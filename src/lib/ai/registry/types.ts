// =============================================================================
// RIIQX — Master AI Registry & Capability Typings
// Strict Normalized Flags • Evidence-Based Verification • Zero Simulation
// =============================================================================

export type CapabilityFlag =
  | 'TEXT_INPUT'
  | 'TEXT_OUTPUT'
  | 'IMAGE_INPUT'
  | 'IMAGE_OUTPUT'
  | 'VIDEO_INPUT'
  | 'VIDEO_OUTPUT'
  | 'AUDIO_INPUT'
  | 'AUDIO_OUTPUT'
  | 'TRANSCRIPTION'
  | 'SPEECH_GENERATION'
  | 'MUSIC_GENERATION'
  | 'EMBEDDINGS'
  | 'RERANKING'
  | 'TOOL_CALLING'
  | 'STRUCTURED_OUTPUT'
  | 'STREAMING'
  | 'LONG_CONTEXT'
  | 'CODE_GENERATION'
  | 'REASONING';

export type ProviderStatus =
  | 'NOT_CONFIGURED'
  | 'CONFIGURED'
  | 'AUTHENTICATION_FAILED'
  | 'DISCOVERY_FAILED'
  | 'AVAILABLE'
  | 'RATE_LIMITED'
  | 'QUOTA_EXHAUSTED'
  | 'MODEL_UNAVAILABLE'
  | 'UNSUPPORTED_CAPABILITY'
  | 'PROVIDER_ERROR';

export type PricingTier =
  | 'free_tier'
  | 'free_developer'
  | 'open_weight'
  | 'commercial_paid'
  | 'unknown';

export interface ModelRecord {
  providerId: string;
  modelId: string;
  displayName: string;
  modelFamily: string;
  description: string;
  inputModalities: ('text' | 'image' | 'video' | 'audio')[];
  outputModalities: ('text' | 'image' | 'video' | 'audio')[];
  capabilities: Record<CapabilityFlag, boolean>;
  contextLength: number;
  maxOutputTokens?: number;
  isFreeTier: boolean;
  pricingTier: PricingTier;
  costPer1kPrompt?: number;
  costPer1kCompletion?: number;
  availability: ProviderStatus;
  measuredLatencyMs?: number;
  lastVerifiedAt?: string;
  evidenceSource: 'empirical_test' | 'provider_catalog' | 'default_specification';
  lastError?: string;
}

export interface ProviderRecord {
  providerId: string;
  displayName: string;
  envKeys: string[];
  isConfigured: boolean;
  status: ProviderStatus;
  authMethod: 'bearer' | 'aws-sigv4' | 'header-key' | 'none';
  apiBaseUrl: string;
  modelsCount: number;
  testedModelsCount: number;
  workingModelsCount: number;
  freeTierAvailable: boolean;
  quotaDescription: string;
  lastVerifiedAt?: string;
  lastError?: string;
}

export interface InferenceMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface InferenceRequest {
  modelId?: string;
  providerId?: string;
  taskCategory?:
    | 'general'
    | 'reasoning'
    | 'coding'
    | 'vision'
    | 'audio_transcription'
    | 'speech'
    | 'embeddings'
    | 'creator'
    | 'research';
  messages: InferenceMessage[];
  maxTokens?: number;
  temperature?: number;
  requiredCapabilities?: CapabilityFlag[];
  streaming?: boolean;
  tools?: unknown[];
}

export interface InferenceResponse {
  providerId: string;
  modelId: string;
  reply: string;
  reasoning?: string;
  latencyMs: number;
  isFreeTier: boolean;
  finishReason?: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

