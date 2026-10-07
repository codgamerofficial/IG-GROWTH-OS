// =============================================================================
// IG GrowthOS: Amazon Bedrock Runtime Provider (Strict Production Mode)
// =============================================================================
// Primary AI engine using AWS Bedrock Converse API with tool-calling support,
// dynamic model routing via ModelRouter, and zero silent mock fallbacks.
// If Bedrock credentials, model access, or token quotas fail, throws loud
// and actionable error diagnostics.
// =============================================================================

import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from '@aws-sdk/client-bedrock-runtime';
import {
  AIProvider,
  GeneratedIdea,
  GeneratedReel,
  GeneratedUGC,
  GeneratedProductContent,
  GeneratedAffiliateContent,
  DiscoveredTrend,
  AnalyticsDiagnostic,
  CopilotMessage,
} from './types';
import { ModelRouter, AIWorkflowType } from './router';
import { bedrockTools, executeBedrockTool } from './tools';
import { MockAIProvider } from './index';

export class BedrockProvider implements AIProvider {
  public name = 'BedrockProvider';
  private client: BedrockRuntimeClient | null = null;
  private fallback: MockAIProvider | null = null;

  constructor() {
    // Only instantiate fallback if explicitly permitted for testing
    if (process.env.MOCK_MODE === 'true' && process.env.NODE_ENV !== 'production') {
      this.fallback = new MockAIProvider();
    }
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      const region = ModelRouter.getRegion();
      const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      const sessionToken = process.env.AWS_SESSION_TOKEN;

      if (accessKeyId && secretAccessKey) {
        // AWS IAM SigV4 Authentication (Access Key + Secret Key + optional Session Token)
        this.client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
            ...(sessionToken ? { sessionToken } : {}),
          },
        });
      } else if (bearerToken) {
        // Amazon Bedrock Bearer Token authentication (ABSK... key format)
        this.client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId: 'anonymous',
            secretAccessKey: 'anonymous',
          },
        });

        (this.client.middlewareStack as any).add(
          (next: any) => async (args: any) => {
            const request = args.request;
            if (request && request.headers) {
              request.headers['authorization'] = `Bearer ${bearerToken}`;
              delete request.headers['x-amz-date'];
              delete request.headers['x-amz-security-token'];
              delete request.headers['x-amz-content-sha256'];
            }
            return next(args);
          },
          { step: 'finalizeRequest', priority: 'low', name: 'bedrockBearerAuthMiddleware' }
        );
      } else {
        // AWS SDK default provider chain (IAM role, ECS task role, AWS CLI profile)
        this.client = new BedrockRuntimeClient({ region });
      }
    } catch (err) {
      console.error('[BedrockProvider] AWS Bedrock client init error:', err);
      this.client = null;
    }
  }

  /**
   * Helper to execute Amazon Bedrock ConverseCommand with tool-calling
   */
  private async runConverse(params: {
    workflow: AIWorkflowType;
    systemPrompt: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    enableTools?: boolean;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    if (!this.client) {
      if (this.fallback && process.env.MOCK_MODE === 'true') {
        return '';
      }
      throw new Error('BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED: BedrockRuntimeClient is not initialized.');
    }

    if (!ModelRouter.isBedrockConfigured()) {
      if (this.fallback && process.env.MOCK_MODE === 'true') {
        return '';
      }
      throw new Error('BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED: AWS credentials (Bearer Token or IAM keys) not found.');
    }

    const modelId = ModelRouter.getModelId(params.workflow);

    const formattedMessages: Message[] = params.messages.map((m) => ({
      role: m.role,
      content: [{ text: m.content }],
    }));

    try {
      const command = new ConverseCommand({
        modelId,
        system: [{ text: params.systemPrompt }],
        messages: formattedMessages,
        inferenceConfig: {
          maxTokens: params.maxTokens || 2048,
          temperature: params.temperature ?? 0.7,
        },
        toolConfig: params.enableTools ? { tools: bedrockTools } : undefined,
      });

      const response = await this.client.send(command);

      // Check for tool use
      const messageContent = response.output?.message?.content;
      if (messageContent) {
        for (const block of messageContent) {
          if (block.toolUse) {
            const toolUse = block.toolUse;
            const toolName = toolUse.name || '';
            const toolInput = (toolUse.input as Record<string, unknown>) || {};
            
            console.log(`[BedrockProvider] Model requested tool: ${toolName}`);
            const toolResult = await executeBedrockTool(toolName, toolInput);

            // Follow-up request with tool result
            const followUpMessages: Message[] = [
              ...formattedMessages,
              {
                role: 'assistant',
                content: [{ toolUse }],
              },
              {
                role: 'user',
                content: [
                  {
                    toolResult: {
                      toolUseId: toolUse.toolUseId,
                      content: [{ text: JSON.stringify(toolResult) }],
                    },
                  },
                ],
              },
            ];

            const followUpCommand = new ConverseCommand({
              modelId,
              system: [{ text: params.systemPrompt }],
              messages: followUpMessages,
              inferenceConfig: { maxTokens: params.maxTokens || 2048 },
            });

            const followUpResponse = await this.client.send(followUpCommand);
            const textBlocks = followUpResponse.output?.message?.content?.filter((b) => b.text);
            if (textBlocks && textBlocks.length > 0) {
              return textBlocks.map((b) => b.text).join('\n');
            }
          }
        }

        const textBlocks = messageContent.filter((b) => b.text);
        if (textBlocks.length > 0) {
          return textBlocks.map((b) => b.text).join('\n');
        }
      }

      return '';
    } catch (error: any) {
      console.error(`[BedrockProvider] Bedrock Converse failed (${modelId}):`, error.message);

      // If in mock mode during unit test suite, allow fallback
      if (this.fallback && process.env.MOCK_MODE === 'true' && process.env.NODE_ENV !== 'production') {
        return '';
      }

      // FAIL LOUDLY — NO SILENT FALLBACK (Section 52)
      if (error.message?.includes('use case details have not been submitted') || error.name === 'ResourceNotFoundException') {
        throw new Error(`BLOCKED — AWS BEDROCK MODEL ACCESS REQUIRED: Model '${modelId}' requires submitting the Anthropic Use Case details form in the AWS Bedrock Console (Region: ${ModelRouter.getRegion()}).`);
      }
      if (error.message?.includes('Too many tokens per day') || error.name === 'ThrottlingException') {
        throw new Error(`BLOCKED — AWS BEDROCK RATE LIMIT: Daily token limit reached for model '${modelId}'. Account verification or quota upgrade required.`);
      }

      throw new Error(`BEDROCK_CONVERSE_ERROR: ${error.name || 'Error'} — ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Interface Implementation
  // ---------------------------------------------------------------------------

  async generateIdeas(params: Parameters<AIProvider['generateIdeas']>[0]): Promise<GeneratedIdea[]> {
    const systemPrompt = `You are an elite Instagram Fashion & Lifestyle strategist for brand ${params.brandName || 'RIIQX'}. Return a JSON array of ${params.count || 10} high-performing content ideas matching the schema: title, hook, concept, why_it_could_work, target_audience, content_pillar, estimated_difficulty ('Low'|'Medium'|'High'), potential_reach ('Moderate'|'High'|'Viral'), share_potential (0-100), save_potential (0-100), conversion_potential (0-100), ai_score (0-100), recommended_format ('Reel'|'Carousel'|'Single Image'|'UGC'). Output valid JSON only.`;
    const userPrompt = `Generate ${params.count || 10} winning ideas for pillar "${params.pillar || 'Outfit Inspiration'}" targeting "${params.audience || 'Gen Z streetwear'}". Goal: ${params.goal || 'Reach & Engagement'}.`;

    const text = await this.runConverse({
      workflow: 'content',
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 3000,
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    if (this.fallback) return this.fallback.generateIdeas(params);
    throw new Error('Bedrock returned empty response for idea generation.');
  }

  async generateReel(params: Parameters<AIProvider['generateReel']>[0]): Promise<GeneratedReel> {
    const systemPrompt = `You are a viral Instagram Reel scriptwriter and creative director for RIIQX. Return a complete Reel production package in JSON format: title, hook (0-3s), problem_context (3-8s), value_story (8-20s), payoff (20-30s), cta, voiceover, scene_by_scene_script (array of timestamp, visual, audio, on_screen_text), shot_list, b_roll, on_screen_text, cover_text, caption, hashtags, production_notes, ai_score (0-100). Output JSON only.`;
    const userPrompt = `Write a viral high-converting Reel for topic: "${params.topic}". Audience: ${params.audience || 'Gen Z fashionistas'}. Tone: ${params.tone || 'Confident & Premium'}.`;

    const text = await this.runConverse({
      workflow: 'content',
      systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 3000,
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.title && parsed.hook) {
        return {
          ...parsed,
          ai_score_breakdown: parsed.ai_score_breakdown || {
            hook_strength: 20,
            audience_relevance: 20,
            trend_relevance: 15,
            shareability: 15,
            save_potential: 10,
            conversion_potential: 10,
            brand_fit: 10,
          },
        };
      }
    }

    if (this.fallback) return this.fallback.generateReel(params);
    throw new Error('Bedrock returned empty response for Reel generation.');
  }

  async generateUGC(params: Parameters<AIProvider['generateUGC']>[0]): Promise<GeneratedUGC> {
    const systemPrompt = `You are an authentic TikTok/Reels UGC director. Output JSON with fields: creator_persona, hook, scene_list (array of scene, description, action), dialogue (array), b_roll (array), cta, caption, cover_concept, format_type, ai_score. Output JSON only.`;

    const text = await this.runConverse({
      workflow: 'content',
      systemPrompt,
      messages: [{ role: 'user', content: `Create UGC script for product "${params.productName}". Style: ${params.style}.` }],
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.creator_persona) return parsed;
    }

    if (this.fallback) return this.fallback.generateUGC(params);
    throw new Error('Bedrock returned empty response for UGC generation.');
  }

  async generateProductContent(params: Parameters<AIProvider['generateProductContent']>[0]): Promise<GeneratedProductContent> {
    const systemPrompt = `You are a high-converting luxury streetwear copywriter. Output JSON format matching this schema:
{
  "product_name": string,
  "reel_ideas": string[],
  "carousel_ideas": string[],
  "product_hooks": string[],
  "captions": string[],
  "ugc_concepts": string[],
  "ctas": string[]
}
Output JSON only.`;

    const text = await this.runConverse({
      workflow: 'content',
      systemPrompt,
      messages: [{ role: 'user', content: `Create product campaign content for: ${params.product.name}. Description: ${params.product.description || ''}. Price: $${params.product.price}. Goal: ${params.goal || 'Conversion'}.` }],
      maxTokens: 2500,
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.product_name || parsed.captions) return parsed;
    }

    if (this.fallback) return this.fallback.generateProductContent(params);
    throw new Error('Bedrock returned empty response for Product Content generation.');
  }

  async generateAffiliateContent(params: Parameters<AIProvider['generateAffiliateContent']>[0]): Promise<GeneratedAffiliateContent> {
    const systemPrompt = `You are a viral creator affiliate marketing strategist. Output JSON format matching this schema:
{
  "product_url": string,
  "product_angle": string,
  "hook": string,
  "reel_concept": string,
  "caption": string,
  "cta": string,
  "disclosure_recommendation": string,
  "hashtag_suggestions": string[]
}
Output JSON only.`;

    const text = await this.runConverse({
      workflow: 'content',
      systemPrompt,
      messages: [{ role: 'user', content: `Generate affiliate creator kit for product URL "${params.productUrl}". Category: ${params.category || 'streetwear'}. Brand: ${params.brandName || 'RIIQX'}.` }],
      maxTokens: 2000,
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.hook || parsed.caption) return parsed;
    }

    if (this.fallback) return this.fallback.generateAffiliateContent(params);
    throw new Error('Bedrock returned empty response for Affiliate Content generation.');
  }

  async researchTrends(params: Parameters<AIProvider['researchTrends']>[0]): Promise<DiscoveredTrend[]> {
    const systemPrompt = `You are a trend forecaster for fashion and streetwear. Output JSON array of trends: topic, source ('Instagram Audio'|'TikTok Viral'|'Runway'|'Streetwear Forum'), source_url, trend_score (0-100), relevance_score (0-100), content_angle. Output JSON only.`;

    const text = await this.runConverse({
      workflow: 'trend',
      systemPrompt,
      messages: [{ role: 'user', content: `Identify 5 current high-velocity trends in category: ${params.category || 'streetwear'} for brand ${params.brandName || 'RIIQX'}.` }],
      maxTokens: 2000,
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    if (this.fallback) return this.fallback.researchTrends(params);
    throw new Error('Bedrock returned empty response for Trend Research.');
  }

  async analyzePerformance(params: Parameters<AIProvider['analyzePerformance']>[0]): Promise<AnalyticsDiagnostic> {
    const systemPrompt = `You are an algorithmic Instagram growth data scientist. Analyze performance data and return JSON: what_worked (array), what_didnt (array), which_formats_worked (array), which_hooks_worked (array), which_topics_worked (array), which_content_generated_saves (array), which_content_generated_shares (array), what_should_we_stop_doing (array), what_should_we_do_more_of (array), what_should_we_test_next (array), next_10_recommendations (array of 10: rank, title, format, pillar, hook, expected_outcome). Output JSON only.`;

    const text = await this.runConverse({
      workflow: 'analytics',
      systemPrompt,
      messages: [{ role: 'user', content: `Analyze the performance for brand ${params.brandName}. Recent Metrics: ${JSON.stringify(params.recentMetrics)}. Top Posts: ${JSON.stringify(params.topPosts)}.` }],
      maxTokens: 2500,
    });

    if (text) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.what_worked && parsed.next_10_recommendations) return parsed;
    }

    if (this.fallback) return this.fallback.analyzePerformance(params);
    throw new Error('Bedrock returned empty response for Performance Analysis.');
  }

  async chatCopilot(messages: CopilotMessage[], context?: Record<string, unknown>): Promise<string> {
    const systemPrompt = `You are the elite AI Growth Copilot for RIIQX inside IG GrowthOS.
You have tool calling enabled to look up real brand data, historical analytics, current trends, and content.
Never fabricate Instagram analytics or follower numbers. Be authoritative, data-driven, strategic, and concise.`;

    const conversationHistory = messages.map((m) => ({
      role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.content,
    }));

    const response = await this.runConverse({
      workflow: 'chat',
      systemPrompt,
      messages: conversationHistory,
      enableTools: true,
      maxTokens: 1500,
    });

    if (response) return response;
    if (this.fallback) return this.fallback.chatCopilot(messages, context);
    throw new Error('Bedrock Copilot returned empty response.');
  }
}
