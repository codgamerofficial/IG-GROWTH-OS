import { NextResponse } from 'next/server';
import { defaultAgentRouterProvider } from '@/lib/ai/agentrouter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = defaultAgentRouterProvider.getConfig();
    const result = await defaultAgentRouterProvider.testConnection();

    return NextResponse.json({
      service: 'agentrouter',
      provider: 'Agent Router (agentrouter.org)',
      model: result.model,
      endpoint: config.baseUrl,
      status: result.inferenceSuccessful ? 'CONNECTED' : result.authorized ? 'DEGRADED' : 'BLOCKED',
      healthy: result.inferenceSuccessful,
      latency_ms: result.latencyMs,
      error_message: result.errorMessage,
      last_tested_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        service: 'agentrouter',
        provider: 'Agent Router (agentrouter.org)',
        status: 'ERROR',
        healthy: false,
        error_message: err.message,
        last_tested_at: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
