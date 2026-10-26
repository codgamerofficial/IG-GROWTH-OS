import { NextResponse } from 'next/server';
import { RIIQX_MODELS } from '@/lib/riiqx/models';
import { checkProviderHealth } from '@/lib/riiqx/orchestration';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const health = await checkProviderHealth();
    return NextResponse.json({
      success: true,
      models: RIIQX_MODELS,
      health,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed checking provider health';
    return NextResponse.json(
      {
        success: false,
        models: RIIQX_MODELS,
        error: msg,
      },
      { status: 500 }
    );
  }
}
