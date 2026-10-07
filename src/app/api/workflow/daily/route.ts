import { NextResponse } from 'next/server';
import { DailyWorkflowOrchestrator } from '@/lib/automation/workflow';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const brandSlug = body.brandSlug || 'riiqx-fashion';

    const result = await DailyWorkflowOrchestrator.runTodayWorkflow(brandSlug);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
