// =============================================================================
// RIIQX — AI Workflow Builder API (Get Single & Delete)
// =============================================================================

import { NextResponse } from 'next/server';
import { WorkflowEngine } from '@/services/workflows/workflow-engine';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = WorkflowEngine.getWorkflow(params.id);
    if (!workflow) {
      return NextResponse.json(
        { success: false, error: `Workflow not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workflow,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch workflow' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = WorkflowEngine.deleteWorkflow(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Workflow not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete workflow' },
      { status: 500 }
    );
  }
}

