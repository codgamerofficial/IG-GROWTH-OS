// =============================================================================
// RIIQX — Master Capability Adapter Architecture & Type Definitions
// Open-Source Ecosystem Integration (13-Repo Federated Architecture)
// Strict Type Safety • Decoupled Microservice Contracts • Provenance & Cost
// =============================================================================

export type CapabilityId =
  | 'media.generate.image'
  | 'media.generate.video'
  | 'media.generate.lipsync'
  | 'voice.synthesize'
  | 'voice.clone'
  | 'voice.dub'
  | 'audio.transcribe'
  | 'audio.diarize'
  | 'video.clip'
  | 'video.faceless'
  | 'video.render'
  | 'seo.keyword_research'
  | 'seo.audit'
  | 'seo.competitor'
  | 'capture.record'
  | 'support.conversation'
  | 'project.sync';

export type CapabilityProviderId =
  | 'higgsfield'
  | 'voicestudio'
  | 'openwhispr'
  | 'openseo'
  | 'remotion'
  | 'ffmpeg'
  | 'purffleshorts'
  | 'autoshorts'
  | 'chatwoot'
  | 'openproject'
  | 'appflowy'
  | 'cap'
  | 'moviepy'
  | 'elevenlabs'
  | 'bedrock'
  | 'gemini'
  | 'groq';

export type AdapterLicense =
  | 'MIT'
  | 'Apache-2.0'
  | 'AGPL-3.0-External'
  | 'GPL-3.0-External'
  | 'Remotion-Dual'
  | 'Proprietary-API';

export interface CapabilityHealthStatus {
  isOperational: boolean;
  latencyMs: number;
  lastCheckedAt: string;
  errorMessage?: string;
  isRateLimited?: boolean;
  activeProviderVersion?: string;
}

export interface CapabilityRequest<T = any> {
  jobId: string;
  userId: string;
  projectId?: string;
  capabilityId: CapabilityId;
  providerId: CapabilityProviderId;
  payload: T;
  idempotencyKey?: string;
  webhookUrl?: string;
  timeoutMs?: number;
}

export interface CapabilityResponse<T = any> {
  jobId: string;
  capabilityId: CapabilityId;
  providerId: CapabilityProviderId;
  status: 'completed' | 'processing' | 'failed';
  result?: T;
  errorMessage?: string;
  costIncurredUsd?: number;
  executionDurationMs: number;
  completedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CapabilityAdapter<TInput = any, TOutput = any> {
  id: CapabilityId;
  name: string;
  description: string;
  provider: CapabilityProviderId;
  version: string;
  license: AdapterLicense;
  costEstimatePerUnitUsd?: number;
  supportedInputTypes: string[];
  supportedOutputTypes: string[];

  execute(request: CapabilityRequest<TInput>): Promise<CapabilityResponse<TOutput>>;
  checkHealth(): Promise<CapabilityHealthStatus>;
}

export interface CapabilityJobRecord {
  id: string;
  userId: string;
  projectId?: string;
  capabilityId: CapabilityId;
  providerId: CapabilityProviderId;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  inputPayload: Record<string, unknown>;
  outputResult?: Record<string, unknown>;
  errorMessage?: string;
  costIncurredUsd?: number;
  executionDurationMs?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
