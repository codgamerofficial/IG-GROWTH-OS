// =============================================================================
// RIIQX — Intelligent Multimodal Model Router
// Strict Free-Only Enforcement • Latency-Aware Ranking • Resilient Fallback
// =============================================================================

import {
  CapabilityFlag,
  InferenceRequest,
  InferenceResponse,
  ModelRecord,
} from '../registry/types';
import { MasterProviderRegistry } from '../registry/provider-registry';
import { VERIFIED_MODEL_CATALOG } from '../registry/model-catalog';

export interface RouteDecision {
  selectedModel: ModelRecord;
  fallbackModels: ModelRecord[];
  strategyReason: string;
  isFreeTierOnly: boolean;
}

export class MultimodalModelRouter {
  private static readonly IS_FREE_ONLY =
    process.env.AI_BUDGET_MODE !== 'paid_allowed'; // Default: strict free-only

  /**
   * Determine the best model and fallbacks for a given inference request
   */
  public static selectRoute(req: InferenceRequest): RouteDecision {
    const allModels = MasterProviderRegistry.getModels();

    // 1. Filter by Free-Only policy
    let eligible = allModels.filter((m) => {
      if (this.IS_FREE_ONLY && !m.isFreeTier) return false;
      return m.availability === 'AVAILABLE';
    });

    // 2. Filter by explicitly requested model if specified and available
    if (req.modelId && VERIFIED_MODEL_CATALOG[req.modelId]) {
      const target = VERIFIED_MODEL_CATALOG[req.modelId];
      if (!this.IS_FREE_ONLY || target.isFreeTier) {
        const fallbacks = eligible.filter((m) => m.modelId !== target.modelId);
        return {
          selectedModel: target,
          fallbackModels: fallbacks,
          strategyReason: `User explicitly requested model ${target.displayName}`,
          isFreeTierOnly: this.IS_FREE_ONLY,
        };
      }
    }

    // 3. Filter by required capabilities
    if (req.requiredCapabilities && req.requiredCapabilities.length > 0) {
      eligible = eligible.filter((m) =>
        req.requiredCapabilities!.every((cap) => m.capabilities[cap])
      );
    }

    // 4. Task-Specific Priority Sorting
    const category = req.taskCategory || 'general';

    eligible.sort((a, b) => {
      // Prioritize specific model strengths based on category
      if (category === 'reasoning') {
        const aReasoning = a.capabilities.REASONING ? 1 : 0;
        const bReasoning = b.capabilities.REASONING ? 1 : 0;
        if (aReasoning !== bReasoning) return bReasoning - aReasoning;
      } else if (category === 'coding') {
        const aCode = a.capabilities.CODE_GENERATION ? 1 : 0;
        const bCode = b.capabilities.CODE_GENERATION ? 1 : 0;
        if (aCode !== bCode) return bCode - aCode;
      } else if (category === 'research') {
        // High context models first
        if (b.contextLength !== a.contextLength) return b.contextLength - a.contextLength;
      }

      // Latency priority: Lower measured latency is better
      const latA = a.measuredLatencyMs || 2000;
      const latB = b.measuredLatencyMs || 2000;
      return latA - latB;
    });

    if (eligible.length === 0) {
      // Emergency safe fallback to Qwen on Groq or Laguna on OpenRouter
      const defaultModel =
        VERIFIED_MODEL_CATALOG['qwen/qwen3.8-27b'] ||
        VERIFIED_MODEL_CATALOG['poolside/laguna-xs-2.1:free'];
      return {
        selectedModel: defaultModel,
        fallbackModels: [],
        strategyReason: 'Fallback to verified baseline free LPU engine',
        isFreeTierOnly: this.IS_FREE_ONLY,
      };
    }

    const selected = eligible[0];
    const fallbacks = eligible.slice(1, 4);

    return {
      selectedModel: selected,
      fallbackModels: fallbacks,
      strategyReason: `Ranked #1 for [${category}] with latency ${selected.measuredLatencyMs || 'N/A'}ms and context ${selected.contextLength.toLocaleString()}`,
      isFreeTierOnly: this.IS_FREE_ONLY,
    };
  }

  /**
   * Execute inference with automatic multi-model fallback
   */
  public static async execute(req: InferenceRequest): Promise<InferenceResponse> {
    const route = this.selectRoute(req);
    const candidateList = [route.selectedModel, ...route.fallbackModels];

    let lastError: Error | null = null;

    for (const model of candidateList) {
      try {
        const response = await this.invokeModel(model, req);
        return response;
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.warn(
          `[RIIQX Router] Model ${model.modelId} failed: ${error.message}. Attempting eligible fallback...`
        );
        lastError = error;
      }
    }

    throw new Error(
      `All eligible free AI models failed to respond. Last error: ${lastError?.message || 'Unknown network error'}`
    );
  }

  /**
   * Internal model execution adapter
   */
  private static async invokeModel(
    model: ModelRecord,
    req: InferenceRequest
  ): Promise<InferenceResponse> {
    const t0 = Date.now();

    // 1. Groq Provider
    if (model.providerId === 'groq') {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error('GROQ_API_KEY not configured');

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.modelId,
          messages: req.messages,
          max_tokens: req.maxTokens || 1024,
          temperature: req.temperature ?? 0.7,
        }),
        signal: AbortSignal.timeout(12000),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || `Groq error HTTP ${res.status}`);
      }

      const reply = data.choices?.[0]?.message?.content || '';
      return {
        providerId: 'groq',
        modelId: model.modelId,
        reply,
        latencyMs: Date.now() - t0,
        isFreeTier: true,
        finishReason: data.choices?.[0]?.finish_reason,
        tokensUsed: data.usage
          ? {
              prompt: data.usage.prompt_tokens,
              completion: data.usage.completion_tokens,
              total: data.usage.total_tokens,
            }
          : undefined,
      };
    }

    // 2. OpenRouter Provider
    if (model.providerId === 'openrouter') {
      const apiKey =
        process.env.OPENROUTER_API_KEY || process.env['sk-or-v1-openrouter_api_key'];
      if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://riiqx.ai',
          'X-Title': 'RIIQX AI',
        },
        body: JSON.stringify({
          model: model.modelId,
          messages: req.messages,
          max_tokens: req.maxTokens || 1024,
          temperature: req.temperature ?? 0.7,
        }),
        signal: AbortSignal.timeout(15000),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text.trim());
      } catch {
        throw new Error(`OpenRouter returned invalid JSON: ${text.slice(0, 100)}`);
      }

      if (!res.ok) {
        throw new Error(data.error?.message || `OpenRouter error HTTP ${res.status}`);
      }

      const choice = data.choices?.[0];
      const reply = choice?.message?.content || '';
      const reasoning = choice?.message?.reasoning;

      return {
        providerId: 'openrouter',
        modelId: model.modelId,
        reply: reply || (reasoning ? `[Analysis]\n${reasoning}` : ''),
        reasoning,
        latencyMs: Date.now() - t0,
        isFreeTier: true,
        finishReason: choice?.finish_reason,
        tokensUsed: data.usage
          ? {
              prompt: data.usage.prompt_tokens,
              completion: data.usage.completion_tokens,
              total: data.usage.total_tokens,
            }
          : undefined,
      };
    }

    // 3. Cohere Provider
    if (model.providerId === 'cohere') {
      const apiKey = process.env.COHERE_API_KEY || process.env.cohera_api_key;
      if (!apiKey) throw new Error('COHERE_API_KEY not configured');

      const res = await fetch('https://api.cohere.com/v2/chat', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model.modelId,
          messages: req.messages.map((m) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
        signal: AbortSignal.timeout(12000),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Cohere error HTTP ${res.status}`);
      }

      const reply = data.message?.content?.[0]?.text || '';
      return {
        providerId: 'cohere',
        modelId: model.modelId,
        reply,
        latencyMs: Date.now() - t0,
        isFreeTier: true,
      };
    }

    throw new Error(`Unsupported provider adapter: ${model.providerId}`);
  }
}

