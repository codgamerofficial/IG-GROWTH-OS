// =============================================================================
// RIIQX — Workflow Execution API
// =============================================================================

import { NextResponse } from 'next/server';
import { WorkflowEngine } from '@/services/workflows/workflow-engine';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const run = await WorkflowEngine.executeWorkflow(params.id, body.payload);

    return NextResponse.json({
      success: true,
      run,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Workflow execution failed' },
      { status: 500 }
    );
  }
}

