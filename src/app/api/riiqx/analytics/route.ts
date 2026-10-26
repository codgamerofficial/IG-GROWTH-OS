import { NextResponse } from 'next/server';
import { getFullAnalyticsSummary } from '@/lib/riiqx/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const summary = getFullAnalyticsSummary();
    return NextResponse.json({
      success: true,
      summary: summary.aggregateMetrics,
      records: summary.records,
      hookAverages: summary.hookAverages,
      recommendations: summary.recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Analytics error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
