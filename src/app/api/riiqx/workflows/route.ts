// =============================================================================
// RIIQX — AI Workflow Builder API (List & Save)
// =============================================================================

import { NextResponse } from 'next/server';
import { WorkflowEngine } from '@/services/workflows/workflow-engine';

export async function GET() {
  try {
    const workflows = WorkflowEngine.listWorkflows();
    return NextResponse.json({
      success: true,
      count: workflows.length,
      workflows,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list workflows' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Workflow name is required' },
        { status: 400 }
      );
    }

    const workflow = WorkflowEngine.saveWorkflow(body);

    return NextResponse.json({
      success: true,
      workflow,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save workflow' },
      { status: 500 }
    );
  }
}

