import { NextRequest, NextResponse } from 'next/server';
import { tripOptimizationAgent } from '@/lib/ai';
import { TripPlan } from '@/lib/types/pujahop';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const originalPlan: TripPlan = body.plan;
    const congestedPandalId: string = body.congestedPandalId || originalPlan.stops[2]?.pandal?.id || '';
    const reason = body.reason || 'EXTREME crowd surge detected. Queue wait exceeds 80 minutes.';

    if (!originalPlan || !originalPlan.stops) {
      return NextResponse.json({ success: false, error: 'Valid trip plan is required' }, { status: 400 });
    }

    const result = await tripOptimizationAgent.recalculateRoute(originalPlan, congestedPandalId, reason);

    const oldSummary = originalPlan.stops
      .filter((s) => s.stop_type === 'PANDAL')
      .map((s) => s.custom_name)
      .join(' → ');

    const newSummary = result.recalculatedPlan.stops
      .filter((s) => s.stop_type === 'PANDAL')
      .map((s) => s.custom_name)
      .join(' → ');

    return NextResponse.json({
      success: true,
      recalculation: {
        old_route: oldSummary,
        new_route: newSummary,
        time_saved_minutes: result.timeSavedMinutes,
        distance_change_meters: result.distanceChangeMeters,
        reason: `Temporarily bypass ${result.skippedPandalName} due to extreme crowd density. Route re-sequenced to save ~${result.timeSavedMinutes} minutes.`,
        skipped_pandal: result.skippedPandalName,
        recalculated_plan: result.recalculatedPlan,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
