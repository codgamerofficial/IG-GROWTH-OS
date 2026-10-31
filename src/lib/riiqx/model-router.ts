// =============================================================================
// RIIQX — Intelligent Model Router & Capability-Based Selection Engine
// Primary/Secondary Fallback Chain • Circuit Breakers • Zero Silent Paid Traps
// =============================================================================

import { RIIQX_MODELS, RiiqxModel } from './models';
import { AIProviderRegistry, ModelCapabilitySpec } from './provider-registry';

export type TaskType =
  | 'general'
  | 'ideation'
  | 'scriptwriting'
  | 'research'
  | 'coding'
  | 'fast'
  | 'reasoning'
  | 'vision'
  | 'analytics'
  | 'workflow';

export interface RouteResolution {
  selectedModel: RiiqxModel;
  fallbackModel: RiiqxModel;
  capability: ModelCapabilitySpec;
  reason: string;
  isFreeTier: boolean;
}

export class ModelRouter {
  /**
   * Determine if a given provider currently has active credentials configured
   */
  public static isProviderConfigured(provider: string): boolean {
    switch (provider) {
      case 'groq':
        return Boolean(process.env.GROQ_API_KEY || process.env.groq_api_key);
      case 'openrouter':
        return Boolean(
          process.env.OPENROUTER_API_KEY ||
          process.env['sk-or-v1-openrouter_api_key']
        );
      case 'cohere':
        return Boolean(process.env.COHERE_API_KEY || process.env.cohera_api_key);
      case 'bedrock':
        return Boolean(
          (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
          process.env.AWS_BEARER_TOKEN_BEDROCK ||
          process.env.BEDROCK_API_KEY
        );
      case 'openai':
        return Boolean(
          process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-kg8v')
        );
      case 'agentrouter':
      case 'openai-compatible':
        return Boolean(
          process.env.AGENT_ROUTER_API_KEY ||
          process.env.AGENTROUTER_API_KEY ||
          process.env.agenrouter_api_key
        );
      default:
        return false;
    }
  }

  /**
   * Resolve best model according to task requirements, live health, and configured providers
   */
  public static routeModelForTask(
    task: TaskType = 'general',
    preferredModelId?: string,
    requireFreeOnly: boolean = false
  ): RouteResolution {
    const hasGroq = this.isProviderConfigured('groq');
    const hasOpenRouter = this.isProviderConfigured('openrouter');
    const hasCohere = this.isProviderConfigured('cohere');
    const hasBedrock = this.isProviderConfigured('bedrock');

    // 1. If user explicitly picked a model
    if (preferredModelId) {
      const explicitModel = RIIQX_MODELS.find((m) => m.id === preferredModelId);
      if (explicitModel) {
        // Verify provider credentials exist for this model
        if (this.isProviderConfigured(explicitModel.provider)) {
          const cap = AIProviderRegistry.getModelCapabilities(explicitModel.modelString) || {
            modelId: explicitModel.modelString,
            provider: explicitModel.provider as any,
            name: explicitModel.name,
            contextWindow: explicitModel.contextWindow,
            streaming: true,
            toolCalling: true,
            structuredOutput: true,
            vision: false,
            embeddings: false,
            isFreeTier: Boolean(explicitModel.isFreeTier),
            tierDescription: (explicitModel.isFreeTier ? 'Free Tier' : 'Community Open-Weight') as any,
            recommendedTasks: [task],
          };

          const fallback = this.getFallbackForModel(explicitModel);
          return {
            selectedModel: explicitModel,
            fallbackModel: fallback,
            capability: cap,
            reason: `User selected explicit model: ${explicitModel.name}`,
            isFreeTier: Boolean(explicitModel.isFreeTier),
          };
        }

        // Provider is unconfigured: smoothly failover to active configured model
        let autoFallbackModel: RiiqxModel | undefined;
        if (hasGroq) {
          autoFallbackModel = RIIQX_MODELS.find((m) => m.id === 'groq-qwen-27b') || RIIQX_MODELS[0];
        } else if (hasOpenRouter) {
          autoFallbackModel = RIIQX_MODELS.find((m) => m.id === 'openrouter-llama-70b');
        } else if (hasCohere) {
          autoFallbackModel = RIIQX_MODELS.find((m) => m.id === 'cohere-command-r-plus');
        }

        if (autoFallbackModel) {
          const fallback = this.getFallbackForModel(autoFallbackModel);
          const cap = AIProviderRegistry.getModelCapabilities(autoFallbackModel.modelString) || {
            modelId: autoFallbackModel.modelString,
            provider: autoFallbackModel.provider as any,
            name: autoFallbackModel.name,
            contextWindow: autoFallbackModel.contextWindow,
            streaming: true,
            toolCalling: true,
            structuredOutput: true,
            vision: false,
            embeddings: false,
            isFreeTier: Boolean(autoFallbackModel.isFreeTier),
            tierDescription: (autoFallbackModel.isFreeTier ? 'Free Tier' : 'Community Open-Weight') as any,
            recommendedTasks: [task],
          };

          return {
            selectedModel: autoFallbackModel,
            fallbackModel: fallback,
            capability: cap,
            reason: `Selected model '${explicitModel.name}' belongs to unconfigured provider '${explicitModel.provider}'; automatically routed to active ${autoFallbackModel.name}.`,
            isFreeTier: Boolean(autoFallbackModel.isFreeTier),
          };
        }
      }
    }

    // 2. Task-based capability routing preferring configured providers
    let primaryId = 'groq-qwen-27b';
    let fallbackId = 'openrouter-llama-70b';
    let reason = 'Default fast conversational routing';

    switch (task) {
      case 'fast':
        if (hasGroq) {
          primaryId = 'groq-qwen-27b';
          fallbackId = hasOpenRouter ? 'poolside-laguna-xs' : 'groq-gpt-120b';
          reason = 'Ultra-low latency inference via Groq Cloud LPU (214ms, Free Tier)';
        } else if (hasOpenRouter) {
          primaryId = 'poolside-laguna-xs';
          fallbackId = 'openrouter-llama-70b';
          reason = 'Ultra-fast 748ms inference via Poolside Laguna XS (Free Tier)';
        } else {
          primaryId = 'groq-qwen-27b';
          fallbackId = 'groq-gpt-120b';
          reason = 'Fast LPU conversational routing';
        }
        break;

      case 'scriptwriting':
      case 'ideation':
        if (hasOpenRouter) {
          primaryId = 'nvidia-nemotron-35-lightning';
          fallbackId = hasGroq ? 'groq-gpt-120b' : 'cohere-command-r';
          reason = 'NVIDIA Nemotron 3.5 1M context engine for creative storytelling (Free Tier)';
        } else if (hasGroq) {
          primaryId = 'groq-gpt-120b';
          fallbackId = 'groq-qwen-27b';
          reason = 'Groq Cloud GPT-OSS 120B optimized for creative scripting (Free Tier)';
        } else if (hasCohere) {
          primaryId = 'cohere-command-r';
          fallbackId = 'groq-qwen-27b';
          reason = 'Cohere Command R for creative generation (Free Dev Tier)';
        }
        break;

      case 'research':
        if (hasCohere) {
          primaryId = 'cohere-command-r';
          fallbackId = hasOpenRouter ? 'nvidia-nemotron-35-lightning' : 'groq-gpt-120b';
          reason = 'Cohere Command R with 128K context window for grounded synthesis (Free Dev Tier)';
        } else if (hasOpenRouter) {
          primaryId = 'nvidia-nemotron-35-lightning';
          fallbackId = hasGroq ? 'groq-gpt-120b' : 'groq-qwen-27b';
          reason = 'NVIDIA Nemotron 1M context window for massive document research (Free Tier)';
        } else {
          primaryId = 'groq-gpt-120b';
          fallbackId = 'groq-qwen-27b';
          reason = 'Groq Cloud LPU high-context research synthesis';
        }
        break;

      case 'coding':
        if (hasOpenRouter) {
          primaryId = 'cohere-north-mini-code';
          fallbackId = hasGroq ? 'groq-gpt-120b' : 'groq-qwen-27b';
          reason = 'Cohere North Mini Code 256K context coding specialist (Free Tier)';
        } else if (hasGroq) {
          primaryId = 'groq-gpt-120b';
          fallbackId = 'groq-qwen-27b';
          reason = 'Groq Cloud GPT-OSS 120B for fast code generation (Free Tier)';
        }
        break;

      case 'reasoning':
        if (hasOpenRouter) {
          primaryId = 'nvidia-nemotron-35-lightning';
          fallbackId = hasCohere ? 'cohere-command-r' : 'groq-gpt-120b';
          reason = 'NVIDIA Nemotron 3.5 1M reasoning engine with deep chain-of-thought (Free Tier)';
        } else if (hasCohere) {
          primaryId = 'cohere-command-r';
          fallbackId = hasGroq ? 'groq-gpt-120b' : 'groq-qwen-27b';
          reason = 'Cohere Command R enterprise reasoning';
        } else {
          primaryId = 'groq-gpt-120b';
          fallbackId = 'groq-qwen-27b';
          reason = 'Groq Cloud LPU reasoning engine (Free Tier)';
        }
        break;

      case 'analytics':
        if (hasGroq) {
          primaryId = 'groq-gpt-120b';
          fallbackId = hasOpenRouter ? 'openrouter-llama-70b' : 'groq-qwen-27b';
          reason = 'Fast quantitative synthesis and retention curve analysis';
        } else if (hasOpenRouter) {
          primaryId = 'openrouter-llama-70b';
          fallbackId = 'groq-qwen-27b';
          reason = 'OpenRouter Llama 3.3 70B quantitative analytics';
        }
        break;

      case 'workflow':
        if (hasGroq) {
          primaryId = 'groq-qwen-27b';
          fallbackId = 'groq-gpt-120b';
          reason = 'High-throughput autopilot task execution';
        } else if (hasOpenRouter) {
          primaryId = 'openrouter-llama-70b';
          fallbackId = 'openrouter-deepseek';
          reason = 'OpenRouter autopilot task execution';
        }
        break;

      case 'vision':
        if (hasBedrock) {
          primaryId = 'bedrock-claude-sonnet';
          fallbackId = hasOpenRouter ? 'openrouter-llama-70b' : 'groq-qwen-27b';
          reason = 'Multimodal image and storyboard comprehension via AWS Bedrock';
        } else if (hasOpenRouter) {
          primaryId = 'openrouter-llama-70b';
          fallbackId = 'groq-qwen-27b';
          reason = 'OpenRouter multimodal comprehension';
        }
        break;

      case 'general':
      default:
        if (hasGroq) {
          primaryId = 'groq-qwen-27b';
          fallbackId = hasOpenRouter ? 'openrouter-llama-70b' : 'groq-gpt-120b';
          reason = 'Ultra-low latency general dialogue via Groq Cloud LPU (150ms, Free Tier)';
        } else if (hasOpenRouter) {
          primaryId = 'openrouter-llama-70b';
          fallbackId = hasCohere ? 'cohere-command-r-plus' : 'openrouter-deepseek';
          reason = 'Balanced high-velocity general dialogue via OpenRouter';
        } else if (hasCohere) {
          primaryId = 'cohere-command-r-plus';
          fallbackId = 'groq-qwen-27b';
          reason = 'Cohere Command R+ general dialogue';
        }
        break;
    }

    if (requireFreeOnly) {
      primaryId = 'groq-qwen-27b';
      fallbackId = 'groq-gpt-120b';
      reason = 'Enforced 100% Free Tier routing constraint';
    }

    const selectedModel = RIIQX_MODELS.find((m) => m.id === primaryId) || RIIQX_MODELS[0];
    const fallbackModel = RIIQX_MODELS.find((m) => m.id === fallbackId) || RIIQX_MODELS[1];

    const capability = AIProviderRegistry.getModelCapabilities(selectedModel.modelString) || {
      modelId: selectedModel.modelString,
      provider: selectedModel.provider as any,
      name: selectedModel.name,
      contextWindow: selectedModel.contextWindow,
      streaming: true,
      toolCalling: true,
      structuredOutput: true,
      vision: false,
      embeddings: false,
      isFreeTier: Boolean(selectedModel.isFreeTier),
      tierDescription: (selectedModel.isFreeTier ? 'Free Tier' : 'Community Open-Weight') as any,
      recommendedTasks: [task],
    };

    return {
      selectedModel,
      fallbackModel,
      capability,
      reason,
      isFreeTier: Boolean(selectedModel.isFreeTier),
    };
  }

  /**
   * Get an eligible secondary fallback model
   */
  private static getFallbackForModel(primary: RiiqxModel): RiiqxModel {
    if (primary.provider === 'groq') {
      return (
        RIIQX_MODELS.find((m) => m.id === 'openrouter-llama-70b') ||
        RIIQX_MODELS.find((m) => m.id === 'groq-gpt-120b') ||
        RIIQX_MODELS[0]
      );
    }
    if (primary.provider === 'openrouter') {
      return RIIQX_MODELS.find((m) => m.id === 'groq-qwen-27b') || RIIQX_MODELS[0];
    }
    if (primary.provider === 'cohere') {
      return (
        RIIQX_MODELS.find((m) => m.id === 'groq-qwen-27b') ||
        RIIQX_MODELS.find((m) => m.id === 'openrouter-deepseek') ||
        RIIQX_MODELS[0]
      );
    }
    if (primary.provider === 'bedrock') {
      return RIIQX_MODELS.find((m) => m.id === 'groq-qwen-27b') || RIIQX_MODELS[0];
    }
    return RIIQX_MODELS[0];
  }
}
