// =============================================================================
// RIIQX — Workflow Human Approval Gate API
// =============================================================================

import { NextResponse } from 'next/server';
import { WorkflowEngine } from '@/services/workflows/workflow-engine';

export async function POST(
  req: Request,
  _params: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { runId, nodeId } = body;

    if (!runId || !nodeId) {
      return NextResponse.json(
        { success: false, error: 'runId and nodeId are required' },
        { status: 400 }
      );
    }

    const resumedRun = await WorkflowEngine.approveExecutionNode(runId, nodeId);

    return NextResponse.json({
      success: true,
      message: 'Human approval granted. Workflow execution resumed.',
      run: resumedRun,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to approve workflow node' },
      { status: 500 }
    );
  }
}

