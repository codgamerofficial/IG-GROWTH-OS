// =============================================================================
// RIIQX — Master Unified AI Service Manager
// Provider-Agnostic Gateway • Capability Resolution • Fallback Chains • Zero Traps
// =============================================================================

import { z } from 'zod';
import {
  AICapability,
  AIExecutionOptions,
  AIExecutionResult,
  ModelCapabilitySpec,
} from './types';
import { CapabilityRegistry, isProviderConfigured } from './capability-registry';
import {
  CapabilityUnsupportedError,
  ModelTimeoutError,
  StructuredParsingError,
  ProviderUnavailableError,
} from './errors';
import { recordInferenceUsage } from '@/lib/riiqx/usage-monitor';

export class AIServiceManager {
  /**
   * Execute general text generation with capability matching & multi-provider automatic failover
   */
  public static async executeText(
    prompt: string,
    options: AIExecutionOptions = {}
  ): Promise<AIExecutionResult<string>> {
    const startMs = Date.now();
    const task = options.taskType || 'general';
    const requiredCaps = options.requiredCapabilities || [AICapability.TEXT_GENERATION];

    // 1. Resolve Ordered List of Candidate Models (Filtered to Configured Providers)
    const candidateSpecs: ModelCapabilitySpec[] = [];

    // Explicit model requested
    if (options.preferredModel) {
      const explicit = CapabilityRegistry.findModelsByCapabilities(requiredCaps, undefined, false).find(
        (m) => m.modelId === options.preferredModel
      );
      if (explicit && isProviderConfigured(explicit.provider)) {
        candidateSpecs.push(explicit);
      }
    }

    // Preferred provider requested
    if (options.preferredProvider) {
      const providerModels = CapabilityRegistry.findModelsByCapabilities(
        requiredCaps,
        options.preferredProvider,
        true
      );
      for (const m of providerModels) {
        if (!candidateSpecs.some((c) => c.modelId === m.modelId)) {
          candidateSpecs.push(m);
        }
      }
    }

    // Best model for task
    const bestModel = CapabilityRegistry.resolveBestModelForTask(task, requiredCaps, true);
    if (!candidateSpecs.some((c) => c.modelId === bestModel.modelId)) {
      candidateSpecs.push(bestModel);
    }

    // Add all other configured candidates matching requested capabilities
    const allMatching = CapabilityRegistry.findModelsByCapabilities(requiredCaps, undefined, true);
    for (const spec of allMatching) {
      if (!candidateSpecs.some((c) => c.modelId === spec.modelId)) {
        candidateSpecs.push(spec);
      }
    }

    // If still empty (e.g. no vision provider configured), fall back to general text models
    if (candidateSpecs.length === 0) {
      const generalFallback = CapabilityRegistry.findModelsByCapabilities([AICapability.TEXT_GENERATION], undefined, true);
      candidateSpecs.push(...generalFallback);
    }

    if (candidateSpecs.length === 0) {
      throw new Error(
        'No AI provider credentials configured in environment. Please verify GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY in .env.local.'
      );
    }

    // 2. Prepare Context-Enriched Prompt
    let fullPrompt = prompt;
    if (options.brandContext) {
      fullPrompt = `[BRAND CONTEXT: ${JSON.stringify(options.brandContext)}]\n\n${prompt}`;
    }

    // 3. Execution with Multi-Provider Automatic Failover
    const timeoutMs = options.timeoutMs || 25_000;
    let fallbackUsed = false;
    let lastError: any = null;

    for (let i = 0; i < candidateSpecs.length; i++) {
      const targetSpec = candidateSpecs[i];
      if (i > 0) fallbackUsed = true;

      try {
        console.log(`[AIServiceManager] Attempting model ${targetSpec.modelId} (${targetSpec.provider})${fallbackUsed ? ' [Fallback Chain]' : ''}...`);

        const responseText = await this.executeWithTimeout(
          this.dispatchProviderRequest(targetSpec, fullPrompt, options),
          timeoutMs,
          targetSpec.modelId
        );

        const latencyMs = Date.now() - startMs;
        const inputTokens = Math.round(fullPrompt.length / 4);
        const outputTokens = Math.round(responseText.length / 4);
        const cost = targetSpec.isFreeTier
          ? 0
          : (inputTokens * targetSpec.pricing.promptPer1M +
              outputTokens * targetSpec.pricing.completionPer1M) /
            1_000_000;

        // Record Real Usage Telemetry
        recordInferenceUsage({
          provider: targetSpec.provider,
          model: targetSpec.modelId,
          taskType: task,
          latencyMs,
          inputTokens,
          outputTokens,
          success: true,
        });

        return {
          success: true,
          data: responseText,
          provider: targetSpec.provider,
          model: targetSpec.modelId,
          isFreeTier: targetSpec.isFreeTier,
          latencyMs,
          inputTokens,
          outputTokens,
          estimatedCostUsd: cost,
          fallbackUsed,
        };
      } catch (err: any) {
        console.warn(`[AIServiceManager] Provider '${targetSpec.provider}' (${targetSpec.modelId}) failed: ${err.message}. Automatically switching to next provider...`);
        lastError = err;
      }
    }

    // If all configured providers were attempted and failed
    throw new Error(
      lastError?.message ||
      'AI inference service is temporarily unavailable across all configured providers. Please retry in a few moments.'
    );
  }

  /**
   * Execute structured JSON output with Zod schema verification & repair
   */
  public static async executeStructured<T>(
    prompt: string,
    schema: z.ZodSchema<T>,
    options: AIExecutionOptions = {}
  ): Promise<AIExecutionResult<T>> {
    const requiredCaps = [AICapability.TEXT_GENERATION, AICapability.STRUCTURED_OUTPUT];
    const systemPrompt = `${options.systemPrompt || ''}\n\nCRITICAL INSTRUCTION: Return ONLY a valid JSON object matching the requested schema. Do NOT include markdown code blocks, explanation, or conversational commentary. Return pure parseable JSON.`.trim();

    const textResult = await this.executeText(prompt, {
      ...options,
      systemPrompt,
      requiredCapabilities: requiredCaps,
    });

    let raw = textResult.data.trim();
    if (raw.startsWith('```json')) {
      raw = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    } else if (raw.startsWith('```')) {
      raw = raw.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    try {
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(raw);
      } catch (firstErr) {
        // Simple repair for truncated strings or missing closing brackets
        let repaired = raw;
        const quotes = (repaired.match(/"/g) || []).length;
        if (quotes % 2 !== 0) repaired += '"';
        const openBrackets = (repaired.match(/\[/g) || []).length;
        const closeBrackets = (repaired.match(/\]/g) || []).length;
        for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
        const openBraces = (repaired.match(/{/g) || []).length;
        const closeBraces = (repaired.match(/}/g) || []).length;
        for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';
        parsedJson = JSON.parse(repaired);
      }

      if (parsedJson && typeof parsedJson === 'object') {
        if (parsedJson.brandDNA) parsedJson = parsedJson.brandDNA;
        else if (parsedJson.brand_dna) parsedJson = parsedJson.brand_dna;
        else if (parsedJson.brand) parsedJson = parsedJson.brand;
        else if (parsedJson.data) parsedJson = parsedJson.data;
      }
      const validated = schema.parse(parsedJson);

      return {
        ...textResult,
        data: validated,
      };
    } catch (parseErr: any) {
      throw new StructuredParsingError(parseErr.message, raw);
    }
  }

  /**
   * Execute multimodal vision inspection (Website screenshots, logos, product photos)
   * Automatically attempts Google Gemini, then OpenRouter Vision (Nemotron VL), then Groq Vision
   */
  public static async executeVision(
    prompt: string,
    imageSource: { mimeType: string; base64Data: string } | string,
    options: AIExecutionOptions = {}
  ): Promise<AIExecutionResult<string>> {
    return this.executeText(prompt, {
      ...options,
      imageSource,
      taskType: 'vision',
      requiredCapabilities: [AICapability.TEXT_GENERATION, AICapability.VISION],
      preferredProvider: isProviderConfigured('google') ? 'google' : undefined,
    });
  }

  /**
   * Dispatch raw request to specific provider
   */
  private static async dispatchProviderRequest(
    spec: ModelCapabilitySpec,
    prompt: string,
    options: AIExecutionOptions
  ): Promise<string> {
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_AI_STUDIO_API_KEY ||
      process.env.GOOGLE_API_KEY;
    const groqKey = process.env.GROQ_API_KEY || process.env.groq_api_key;
    const openrouterKey =
      process.env.OPENROUTER_API_KEY || process.env['sk-or-v1-openrouter_api_key'];
    const cohereKey = process.env.COHERE_API_KEY || process.env.cohera_api_key;
    const agentRouterKey =
      process.env.AGENT_ROUTER_API_KEY || process.env.AGENTROUTER_API_KEY;
    const agentRouterBase = process.env.AGENT_ROUTER_BASE_URL || 'https://agentrouter.org/v1';

    // 1. Google Gemini
    if (spec.provider === 'google' && geminiKey) {
      const isStructured = options.requiredCapabilities?.includes(AICapability.STRUCTURED_OUTPUT);
      const parts: any[] = [];

      if (options.imageSource) {
        if (typeof options.imageSource === 'object' && options.imageSource.base64Data) {
          const rawBase64 = options.imageSource.base64Data.replace(/^data:[^;]+;base64,/, '');
          parts.push({
            inlineData: {
              mimeType: options.imageSource.mimeType || 'image/jpeg',
              data: rawBase64,
            },
          });
        }
      }

      parts.push({ text: prompt });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${spec.modelId}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(options.systemPrompt
              ? { systemInstruction: { parts: [{ text: options.systemPrompt }] } }
              : {}),
            contents: [{ parts }],
            generationConfig: {
              temperature: options.temperature ?? 0.7,
              maxOutputTokens: options.maxTokens ?? 4096,
              ...(isStructured ? { responseMimeType: 'application/json' } : {}),
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini returned empty candidate stream.');
      return text;
    }

    // 2. Groq Cloud
    if (spec.provider === 'groq' && groqKey) {
      let userContent: any = prompt;
      if (options.imageSource && typeof options.imageSource === 'object' && options.imageSource.base64Data) {
        const mime = options.imageSource.mimeType || 'image/jpeg';
        const rawB64 = options.imageSource.base64Data.replace(/^data:[^;]+;base64,/, '');
        userContent = [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:${mime};base64,${rawB64}` } },
        ];
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: spec.modelId,
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: userContent },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4096,
        }),
      });

      if (!res.ok) {
        throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Groq returned empty choice stream.');
      return content;
    }

    // 3. OpenRouter Universal Gateway
    if (spec.provider === 'openrouter' && openrouterKey) {
      let userContent: any = prompt;
      if (options.imageSource && typeof options.imageSource === 'object' && options.imageSource.base64Data) {
        const mime = options.imageSource.mimeType || 'image/jpeg';
        const rawB64 = options.imageSource.base64Data.replace(/^data:[^;]+;base64,/, '');
        userContent = [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:${mime};base64,${rawB64}` } },
        ];
      }

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: spec.modelId,
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: userContent },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 2048,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenRouter API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('OpenRouter returned empty choice stream.');
      return content;
    }

    // 4. Cohere Enterprise Grounding
    if (spec.provider === 'cohere' && cohereKey) {
      const res = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cohereKey}`,
        },
        body: JSON.stringify({
          message: prompt,
          model: spec.modelId || 'command-r-plus-08-2024',
          ...(options.systemPrompt ? { preamble: options.systemPrompt } : {}),
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4096,
        }),
      });

      if (!res.ok) {
        throw new Error(`Cohere API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const text = data.text;
      if (!text) throw new Error('Cohere returned empty text.');
      return text;
    }

    // 5. AgentRouter Gateway
    if (spec.provider === 'agentrouter' && (agentRouterKey || agentRouterBase)) {
      const res = await fetch(`${agentRouterBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(agentRouterKey ? { Authorization: `Bearer ${agentRouterKey}` } : {}),
        },
        body: JSON.stringify({
          model: spec.modelId || 'deepseek-v4-flash',
          messages: [
            ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4096,
        }),
      });

      if (!res.ok) {
        throw new Error(`AgentRouter API error ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('AgentRouter returned empty choice stream.');
      return content;
    }

    // 6. AWS Bedrock Runtime (Graceful invocation if configured)
    if (spec.provider === 'bedrock') {
      try {
        const { bedrockConnection } = await import('@/lib/ai/bedrock-connection');
        const client = bedrockConnection.createClient();
        const { ConverseCommand } = await import('@aws-sdk/client-bedrock-runtime');
        const targetModel = process.env.BEDROCK_MODEL_ID || spec.modelId;

        const cmd = new ConverseCommand({
          modelId: targetModel,
          messages: [
            {
              role: 'user',
              content: [{ text: prompt }],
            },
          ],
          inferenceConfig: {
            temperature: options.temperature ?? 0.7,
            maxTokens: options.maxTokens ?? 2048,
          },
        });

        const res = await client.send(cmd);
        const text = res.output?.message?.content?.[0]?.text;
        if (!text) throw new Error('Bedrock returned empty response content.');
        return text;
      } catch (bedrockErr: any) {
        throw new Error(`Bedrock invocation error: ${bedrockErr.message}`);
      }
    }

    throw new ProviderUnavailableError(
      spec.provider,
      `API key or client not configured for provider '${spec.provider}'.`
    );
  }

  /**
   * Internal timeout wrapper
   */
  private static async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    modelId: string
  ): Promise<T> {
    let timeoutTimer: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutTimer = setTimeout(() => {
        reject(new ModelTimeoutError(modelId, timeoutMs));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutTimer!);
      return result;
    } catch (err) {
      clearTimeout(timeoutTimer!);
      throw err;
    }
  }
}
