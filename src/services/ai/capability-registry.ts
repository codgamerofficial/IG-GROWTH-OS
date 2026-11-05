// =============================================================================
// RIIQX — Master Capability Registry & Model Catalog
// Explicit Capability Declarations • Zero Guesswork • Dynamic Discovery
// =============================================================================

import { AICapability, ModelCapabilitySpec, AIProviderId, TaskType } from './types';

export const MASTER_MODEL_CAPABILITY_CATALOG: ModelCapabilitySpec[] = [
  // 1. Google Gemini (Primary Vision & Multimodal Reasoning)
  {
    modelId: 'gemini-2.5-flash',
    provider: 'google',
    displayName: 'Gemini 2.5 Flash',
    contextWindow: 1_048_576,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.VISION,
      AICapability.TOOL_CALLING,
    ],
    isFreeTier: true,
    tierDescription: 'Free Developer Tier',
    recommendedTasks: ['brand_dna', 'vision', 'fast', 'reasoning', 'scriptwriting'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },
  {
    modelId: 'gemini-1.5-pro',
    provider: 'google',
    displayName: 'Gemini 1.5 Pro',
    contextWindow: 2_097_152,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.VISION,
      AICapability.TOOL_CALLING,
      AICapability.EMBEDDINGS,
    ],
    isFreeTier: false,
    tierDescription: 'Commercial Cloud',
    recommendedTasks: ['research', 'campaign', 'reasoning'],
    pricing: { promptPer1M: 1.25, completionPer1M: 5.0 },
  },

  // 2. Groq Cloud (Ultra-Fast Script & Workflow Orchestration)
  {
    modelId: 'llama-3.3-70b-versatile',
    provider: 'groq',
    displayName: 'Groq Llama 3.3 70B',
    contextWindow: 128_000,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.TOOL_CALLING,
    ],
    isFreeTier: true,
    tierDescription: 'Free Developer Tier',
    recommendedTasks: ['campaign', 'scriptwriting', 'fast', 'workflow_synthesis'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },
  {
    modelId: 'qwen-2.5-32b',
    provider: 'groq',
    displayName: 'Groq Qwen 2.5 32B',
    contextWindow: 128_000,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.TOOL_CALLING,
    ],
    isFreeTier: true,
    tierDescription: 'Free Developer Tier',
    recommendedTasks: ['coding', 'workflow_synthesis', 'fast'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },

  // 3. OpenRouter (Universal Gateway & High-Fidelity Fallback)
  {
    modelId: 'meta-llama/llama-3.3-70b-instruct',
    provider: 'openrouter',
    displayName: 'OpenRouter Llama 3.3 70B',
    contextWindow: 128_000,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.TOOL_CALLING,
    ],
    isFreeTier: true,
    tierDescription: 'Free Tier',
    recommendedTasks: ['general', 'campaign', 'scriptwriting'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },

  // 4. AWS Bedrock (Enterprise Claude 3.5 Sonnet / Haiku via SigV4)
  {
    modelId: 'anthropic.claude-3-5-sonnet',
    provider: 'bedrock',
    displayName: 'Claude 3.5 Sonnet (Bedrock)',
    contextWindow: 200_000,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.VISION,
      AICapability.TOOL_CALLING,
    ],
    isFreeTier: false,
    tierDescription: 'Commercial Cloud',
    recommendedTasks: ['brand_dna', 'reasoning', 'campaign', 'product_concept'],
    pricing: { promptPer1M: 3.0, completionPer1M: 15.0 },
  },
  {
    modelId: 'anthropic.claude-3-5-haiku',
    provider: 'bedrock',
    displayName: 'Claude 3.5 Haiku (Bedrock)',
    contextWindow: 200_000,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.TOOL_CALLING,
    ],
    isFreeTier: false,
    tierDescription: 'Commercial Cloud',
    recommendedTasks: ['fast', 'workflow_synthesis', 'general'],
    pricing: { promptPer1M: 0.8, completionPer1M: 4.0 },
  },

  // 5. Cohere (Enterprise Grounding & Multilingual Citations)
  {
    modelId: 'command-r-plus-08-2024',
    provider: 'cohere',
    displayName: 'Cohere Command R+',
    contextWindow: 128_000,
    capabilities: [
      AICapability.TEXT_GENERATION,
      AICapability.STRUCTURED_OUTPUT,
      AICapability.TOOL_CALLING,
      AICapability.EMBEDDINGS,
    ],
    isFreeTier: true,
    tierDescription: 'Free Developer Tier',
    recommendedTasks: ['research', 'workflow_synthesis', 'general'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },

  // 6. Native Audio Speech Transcription (Whisper)
  {
    modelId: 'whisper-local-native',
    provider: 'local',
    displayName: 'OpenAI Whisper (Native PyTorch)',
    contextWindow: 0,
    capabilities: [AICapability.AUDIO_TRANSCRIPTION],
    isFreeTier: true,
    tierDescription: 'Local Offline',
    recommendedTasks: ['transcription'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },

  // 7. Media Generation Engine
  {
    modelId: 'flux-schnell-sharp-pipeline',
    provider: 'local',
    displayName: 'RIIQX Media & Product Studio Engine',
    contextWindow: 0,
    capabilities: [AICapability.IMAGE_GENERATION, AICapability.IMAGE_EDITING],
    isFreeTier: true,
    tierDescription: 'Local Offline',
    recommendedTasks: ['product_concept', 'canvas_transform'],
    pricing: { promptPer1M: 0, completionPer1M: 0 },
  },
];

export class CapabilityRegistry {
  /**
   * Find models matching ALL required capabilities, prioritized by Free Tier first
   */
  public static findModelsByCapabilities(
    required: AICapability[],
    preferredProvider?: AIProviderId
  ): ModelCapabilitySpec[] {
    return MASTER_MODEL_CAPABILITY_CATALOG.filter((spec) => {
      // Must support every requested capability
      const supportsAll = required.every((cap) => spec.capabilities.includes(cap));
      if (!supportsAll) return false;

      // Filter by provider if specified
      if (preferredProvider && spec.provider !== preferredProvider) return false;

      return true;
    }).sort((a, b) => {
      // Free Tier prioritized over commercial
      if (a.isFreeTier && !b.isFreeTier) return -1;
      if (!a.isFreeTier && b.isFreeTier) return 1;
      return 0;
    });
  }

  /**
   * Resolve best model for a given task
   */
  public static resolveBestModelForTask(
    task: TaskType,
    extraCapabilities: AICapability[] = []
  ): ModelCapabilitySpec {
    const candidates = MASTER_MODEL_CAPABILITY_CATALOG.filter((spec) => {
      const taskMatch = spec.recommendedTasks.includes(task);
      const capMatch = extraCapabilities.every((cap) => spec.capabilities.includes(cap));
      return taskMatch && capMatch;
    }).sort((a, b) => {
      if (a.isFreeTier && !b.isFreeTier) return -1;
      if (!a.isFreeTier && b.isFreeTier) return 1;
      return 0;
    });

    if (candidates.length > 0) return candidates[0];

    // Fallback: Gemini 2.5 Flash as standard universal model
    return (
      MASTER_MODEL_CAPABILITY_CATALOG.find((m) => m.modelId === 'gemini-2.5-flash') ||
      MASTER_MODEL_CAPABILITY_CATALOG[0]
    );
  }

  /**
   * Check if a specific model supports a capability
   */
  public static modelSupports(modelId: string, capability: AICapability): boolean {
    const model = MASTER_MODEL_CAPABILITY_CATALOG.find((m) => m.modelId === modelId);
    return Boolean(model && model.capabilities.includes(capability));
  }
}

