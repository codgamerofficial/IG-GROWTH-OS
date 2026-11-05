// =============================================================================
// RIIQX — Natural Language to Workflow Synthesis API
// =============================================================================

import { NextResponse } from 'next/server';
import { WorkflowEngine } from '@/services/workflows/workflow-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.prompt) {
      return NextResponse.json(
        { success: false, error: 'prompt is required to synthesize workflow' },
        { status: 400 }
      );
    }

    const workflow = await WorkflowEngine.synthesizeWorkflowFromPrompt(body.prompt);

    return NextResponse.json({
      success: true,
      workflow,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to synthesize workflow' },
      { status: 500 }
    );
  }
}

