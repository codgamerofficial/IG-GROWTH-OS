import { NextRequest, NextResponse } from 'next/server';
import { decomposeGoalIntoPlan } from '@/lib/riiqx/planner';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { goal } = body;

    if (!goal || !goal.trim()) {
      return NextResponse.json({ error: 'Goal is required.' }, { status: 400 });
    }

    const plan = decomposeGoalIntoPlan(goal);
    return NextResponse.json({ success: true, plan });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Task planner error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const samplePlan = decomposeGoalIntoPlan('Analyze project architecture, optimize hooks, and publish reel');
  return NextResponse.json({ success: true, tasks: [samplePlan] });
}
