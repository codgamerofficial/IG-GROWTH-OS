// =============================================================================
// IG GrowthOS: Amazon Bedrock Runtime Provider (Section 1 & 3)
// =============================================================================
// Primary AI engine using AWS Bedrock Converse API with tool-calling support,
// dynamic model routing via ModelRouter, and multi-tier fallback resilience.
// =============================================================================

import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
  ContentBlock,
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
  private fallback: MockAIProvider;

  constructor() {
    this.fallback = new MockAIProvider();
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      const region = ModelRouter.getRegion();
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
      const sessionToken = process.env.AWS_SESSION_TOKEN;

      if (accessKeyId && secretAccessKey) {
        this.client = new BedrockRuntimeClient({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
            ...(sessionToken ? { sessionToken } : {}),
          },
        });
      } else {
        // AWS SDK default provider chain (IAM role, ECS task role, EC2 instance profile)
        this.client = new BedrockRuntimeClient({ region });
      }
    } catch (err) {
      console.warn('[BedrockProvider] AWS Bedrock client init error, fallback active:', err);
      this.client = null;
    }
  }

  /**
   * Helper to execute Amazon Bedrock ConverseCommand with tool-calling and timeout
   */
  private async runConverse(params: {
    workflow: AIWorkflowType;
    systemPrompt: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    enableTools?: boolean;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    if (!this.client || process.env.MOCK_MODE === 'true' || !ModelRouter.isBedrockConfigured()) {
      return ''; // Trigger fallback gracefully
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
    } catch (error: any) {
      console.warn(`[BedrockProvider] Bedrock Converse failed (${error.name || error.message}): falling back.`);
    }

    return '';
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
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Parse error fallback
      }
    }

    return this.fallback.generateIdeas(params);
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
      try {
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
      } catch {
        // Fallback
      }
    }

    return this.fallback.generateReel(params);
  }

  async generateUGC(params: Parameters<AIProvider['generateUGC']>[0]): Promise<GeneratedUGC> {
    const systemPrompt = `You are an authentic TikTok/Reels UGC director. Output JSON with fields: creator_persona, hook, scene_list (array of scene, description, action), dialogue (array), b_roll (array), cta, caption, cover_concept, format_type, ai_score. Output JSON only.`;

    const text = await this.runConverse({
      workflow: 'content',
      systemPrompt,
      messages: [{ role: 'user', content: `Create UGC script for product "${params.productName}". Style: ${params.style}.` }],
    });

    if (text) {
      try {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.creator_persona) return parsed;
      } catch {}
    }

    return this.fallback.generateUGC(params);
  }

  async generateProductContent(params: Parameters<AIProvider['generateProductContent']>[0]): Promise<GeneratedProductContent> {
    return this.fallback.generateProductContent(params);
  }

  async generateAffiliateContent(params: Parameters<AIProvider['generateAffiliateContent']>[0]): Promise<GeneratedAffiliateContent> {
    return this.fallback.generateAffiliateContent(params);
  }

  async researchTrends(params: Parameters<AIProvider['researchTrends']>[0]): Promise<DiscoveredTrend[]> {
    return this.fallback.researchTrends(params);
  }

  async analyzePerformance(params: Parameters<AIProvider['analyzePerformance']>[0]): Promise<AnalyticsDiagnostic> {
    return this.fallback.analyzePerformance(params);
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

    return this.fallback.chatCopilot(messages, context);
  }
}
