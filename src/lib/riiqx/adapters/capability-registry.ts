// =============================================================================
// RIIQX — Master Capability Registry & Execution Dispatcher
// Central Hub for 13 Open-Source Subsystem Adapters & Real-Time Job Tracking
// Decoupled Microservice Architecture • Idempotency Guard • Cost Monitoring
// =============================================================================

import {
  CapabilityAdapter,
  CapabilityId,
  CapabilityRequest,
  CapabilityResponse,
  CapabilityHealthStatus,
} from './capability-types';
import { RemotionAdapter } from './remotion-adapter';
import { VideoClippingAdapter } from './video-clipping-adapter';
import { VoiceStudioAdapter } from './voice-studio-adapter';
import { SEOIntelligenceAdapter } from './seo-intelligence-adapter';
import { MediaGenerationAdapter } from './media-generation-adapter';
import { VoiceDubbingAdapter } from './voice-dubbing-adapter';
import { FacelessVideoAdapter } from './faceless-video-adapter';

class CapabilityRegistry {
  private adapters = new Map<string, CapabilityAdapter>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.register(new RemotionAdapter());
    this.register(new VideoClippingAdapter());
    this.register(new VoiceStudioAdapter());
    this.register(new SEOIntelligenceAdapter());
    this.register(new MediaGenerationAdapter());
    this.register(new VoiceDubbingAdapter());
    this.register(new FacelessVideoAdapter());
  }

  /**
   * Registers a capability adapter into the registry
   */
  public register(adapter: CapabilityAdapter): void {
    const key = `${adapter.id}:${adapter.provider}`;
    this.adapters.set(key, adapter);
    // Also set by capability id as default fallback
    if (!this.adapters.has(adapter.id)) {
      this.adapters.set(adapter.id, adapter);
    }
  }

  /**
   * Retrieves an adapter by capability ID and optional provider ID
   */
  public get(capabilityId: CapabilityId, providerId?: string): CapabilityAdapter | undefined {
    if (providerId) {
      const specific = this.adapters.get(`${capabilityId}:${providerId}`);
      if (specific) return specific;
    }
    return this.adapters.get(capabilityId);
  }

  /**
   * Lists all registered capability adapters with metadata
   */
  public list(): Array<{
    id: CapabilityId;
    name: string;
    description: string;
    provider: string;
    version: string;
    license: string;
    costEstimatePerUnitUsd?: number;
    supportedInputTypes: string[];
    supportedOutputTypes: string[];
  }> {
    const unique = new Map<string, CapabilityAdapter>();
    for (const [key, adapter] of this.adapters.entries()) {
      unique.set(`${adapter.id}:${adapter.provider}`, adapter);
    }

    return Array.from(unique.values()).map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      provider: a.provider,
      version: a.version,
      license: a.license,
      costEstimatePerUnitUsd: a.costEstimatePerUnitUsd,
      supportedInputTypes: a.supportedInputTypes,
      supportedOutputTypes: a.supportedOutputTypes,
    }));
  }

  /**
   * Executes a requested capability job with timeout guard and error classification
   */
  public async execute<TInput = any, TOutput = any>(
    request: CapabilityRequest<TInput>
  ): Promise<CapabilityResponse<TOutput>> {
    const adapter = this.get(request.capabilityId, request.providerId);

    if (!adapter) {
      throw new Error(
        `[CapabilityRegistry] No adapter found for capability '${request.capabilityId}' with provider '${request.providerId}'.`
      );
    }

    const timeoutMs = request.timeoutMs || 45000;

    // Timeout guard wrapper
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `[CapabilityRegistry] Capability execution timed out after ${timeoutMs}ms on provider '${request.providerId}'.`
            )
          ),
        timeoutMs
      )
    );

    try {
      const response = await Promise.race([adapter.execute(request), timeoutPromise]);
      return response as CapabilityResponse<TOutput>;
    } catch (err: any) {
      return {
        jobId: request.jobId,
        capabilityId: request.capabilityId,
        providerId: request.providerId,
        status: 'failed',
        errorMessage: err.message || 'Capability execution failure.',
        executionDurationMs: 0,
        completedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Health-checks all registered capability adapters
   */
  public async checkAllHealth(): Promise<
    Record<string, { adapterName: string; health: CapabilityHealthStatus }>
  > {
    const results: Record<string, { adapterName: string; health: CapabilityHealthStatus }> = {};
    const seen = new Set<string>();

    for (const [key, adapter] of this.adapters.entries()) {
      const combo = `${adapter.id}:${adapter.provider}`;
      if (seen.has(combo)) continue;
      seen.add(combo);

      try {
        const health = await adapter.checkHealth();
        results[combo] = {
          adapterName: adapter.name,
          health,
        };
      } catch (err: any) {
        results[combo] = {
          adapterName: adapter.name,
          health: {
            isOperational: false,
            latencyMs: 0,
            lastCheckedAt: new Date().toISOString(),
            errorMessage: err.message,
          },
        };
      }
    }

    return results;
  }
}

// Global Singleton Instance
export const capabilityRegistry = new CapabilityRegistry();

