// =============================================================================
// RIIQX — Safe Provider Health Check API Endpoint
// Zero Secret Leaks • Real-Time Latency Probes • Multi-Cloud Status
// =============================================================================

import { NextResponse } from 'next/server';
import { checkProviderHealth } from '@/lib/riiqx/orchestration';
import { ModelRouter } from '@/lib/riiqx/model-router';
import { RIIQX_MODELS } from '@/lib/riiqx/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const health = await checkProviderHealth();

    // Map into sanitized, safe records without exposing any tokens or secret keys
    const sanitizedProviders = Object.entries(health).map(([key, p]) => {
      const isFreeTier = key === 'groq' || key === 'cohere';
      const modelsForProvider = RIIQX_MODELS.filter((m) => m.provider === key).map(
        (m) => m.name
      );

      return {
        providerId: key,
        providerName:
          key === 'groq'
            ? 'Groq Cloud LPU'
            : key === 'openrouter'
            ? 'OpenRouter Multi-Cloud'
            : key === 'cohere'
            ? 'Cohere Intelligence Cloud'
            : key === 'bedrock'
            ? 'AWS Bedrock'
            : key === 'openai'
            ? 'OpenAI Direct'
            : key === 'agentrouter'
            ? 'Agent Router Gateway'
            : 'Local Ollama',
        status: p.status,
        endpoint: p.endpoint,
        latencyMs: p.latencyMs ?? null,
        errorMessage: p.errorMessage ?? null,
        availableModels: modelsForProvider.length > 0 ? modelsForProvider : p.availableModels,
        isFreeTier,
        checkedAt: p.checkedAt || new Date().toISOString(),
      };
    });

    const activeCount = sanitizedProviders.filter((p) => p.status === 'online').length;
    const defaultRoute = ModelRouter.routeModelForTask('fast');

    return NextResponse.json({
      success: true,
      service: 'RIIQX Multi-Cloud Provider Health',
      status: activeCount > 0 ? 'healthy' : 'degraded',
      activeProvidersCount: activeCount,
      defaultRecommendedModel: defaultRoute.selectedModel.name,
      defaultRecommendedProvider: defaultRoute.selectedModel.provider,
      providers: sanitizedProviders,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Health check probe failed';
    return NextResponse.json(
      {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
