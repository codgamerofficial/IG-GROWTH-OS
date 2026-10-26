import { NextResponse } from 'next/server';
import { NUVEXA_MODELS } from '@/lib/nuvexa/models';
import { checkProviderHealth } from '@/lib/nuvexa/orchestration';

export async function GET() {
  try {
    const health = await checkProviderHealth();
    return NextResponse.json({
      success: true,
      models: NUVEXA_MODELS,
      health,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to query provider health';
    return NextResponse.json(
      {
        success: false,
        models: NUVEXA_MODELS,
        error: msg,
      },
      { status: 500 }
    );
  }
}
