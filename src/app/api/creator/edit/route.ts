import { NextRequest, NextResponse } from 'next/server';
import { createEditingPlanFromPrompt } from '@/lib/creator/editing-planner';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    const body = await req.json();
    const { prompt, targetDurationSeconds, currentPlan } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'A natural language editing prompt is required.' },
        { status: 400 }
      );
    }

    const plan = createEditingPlanFromPrompt(
      prompt,
      targetDurationSeconds || 30,
      currentPlan
    );

    return NextResponse.json({
      success: true,
      plan,
      message: `Generated revision ${plan.version} for '${plan.style}' style.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate editing plan';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

