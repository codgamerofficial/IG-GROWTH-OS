import { NextResponse } from 'next/server';
import { validateEnvironment } from '@/lib/security/env-validator';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const env = validateEnvironment();

  return NextResponse.json({
    status: env.valid ? 'healthy' : 'degraded',
    service: 'IG GrowthOS',
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    environment: env.environment,
    mockModeActive: env.mockMode,
    integrations: {
      supabase: {
        configured: env.supabase.configured,
        endpoint: env.supabase.url ? new URL(env.supabase.url).host : null,
      },
      bedrock: {
        configured: env.bedrock.configured,
        region: env.bedrock.region,
        authMethod: env.bedrock.authMethod,
        targetModel: env.bedrock.modelId,
      },
      instagram: {
        configured: env.instagram.configured,
        hasAccessToken: env.instagram.hasAccessToken,
        businessAccountId: env.instagram.businessAccountId,
      },
    },
    warnings: env.warnings,
    errors: env.errors,
  });
}
