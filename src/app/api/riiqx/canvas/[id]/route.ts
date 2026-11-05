// =============================================================================
// RIIQX — Creative Canvas API (Get Single & Delete)
// =============================================================================

import { NextResponse } from 'next/server';
import { CanvasService } from '@/services/canvas/canvas-service';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = CanvasService.getProject(params.id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: `Canvas project not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch canvas project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = CanvasService.deleteProject(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Canvas project not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Canvas project deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete canvas project' },
      { status: 500 }
    );
  }
}
