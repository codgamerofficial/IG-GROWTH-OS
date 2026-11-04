// =============================================================================
// RIIQX — Master AI Capability & Service Layer Types
// Provider-Agnostic • Multi-Cloud Gateway • Capability-Based Selection
// =============================================================================

export enum AICapability {
  TEXT_GENERATION = 'TEXT_GENERATION',
  STRUCTURED_OUTPUT = 'STRUCTURED_OUTPUT',
  IMAGE_GENERATION = 'IMAGE_GENERATION',
  IMAGE_EDITING = 'IMAGE_EDITING',
  VIDEO_GENERATION = 'VIDEO_GENERATION',
  AUDIO_TRANSCRIPTION = 'AUDIO_TRANSCRIPTION',
  AUDIO_GENERATION = 'AUDIO_GENERATION',
  EMBEDDINGS = 'EMBEDDINGS',
  TOOL_CALLING = 'TOOL_CALLING',
  VISION = 'VISION',
}

export type AIProviderId =
  | 'google'
  | 'groq'
  | 'openrouter'
  | 'bedrock'
  | 'cohere'
  | 'openai'
  | 'nvidia'
  | 'aiml'
  | 'local';

export type TaskType =
  | 'general'
  | 'brand_dna'
  | 'campaign'
  | 'canvas_transform'
  | 'product_concept'
  | 'workflow_synthesis'
  | 'scriptwriting'
  | 'research'
  | 'coding'
  | 'fast'
  | 'reasoning'
  | 'vision'
  | 'analytics'
  | 'transcription';

export interface ModelCapabilitySpec {
  modelId: string;
  provider: AIProviderId;
  displayName: string;
  contextWindow: number;
  capabilities: AICapability[];
  isFreeTier: boolean;
  tierDescription: 'Free Tier' | 'Free Developer Tier' | 'Commercial Cloud' | 'Local Offline';
  recommendedTasks: TaskType[];
  pricing: {
    promptPer1M: number;
    completionPer1M: number;
  };
}

export interface AIExecutionOptions {
  taskType?: TaskType;
  requiredCapabilities?: AICapability[];
  preferredProvider?: AIProviderId;
  preferredModel?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  brandContext?: Record<string, any>;
  timeoutMs?: number;
  bypassCache?: boolean;
}

export interface AIExecutionResult<T = string> {
  success: boolean;
  data: T;
  provider: AIProviderId;
  model: string;
  isFreeTier: boolean;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  circuitBreakerTripped?: boolean;
  fallbackUsed?: boolean;
}

export interface JobStageEvent {
  stage: string;
  message: string;
  timestamp: string;
  progressPct?: number;
  metadata?: Record<string, any>;
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AIJobRecord {
  id: string;
  userId: string;
  jobType:
    | 'brand_analysis'
    | 'campaign_generation'
    | 'image_generation'
    | 'image_edit'
    | 'workflow_run'
    | 'video_transcribe'
    | 'video_render'
    | 'asset_export';
  status: JobStatus;
  progressPct: number;
  stageMessage: string;
  stageHistory: JobStageEvent[];
  payload: Record<string, any>;
  result?: Record<string, any>;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
