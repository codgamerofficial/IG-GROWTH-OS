// =============================================================================
// RIIQX — Creative Canvas Export to Video API
// =============================================================================

import { NextResponse } from 'next/server';
import { CanvasService } from '@/services/canvas/canvas-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, selectedBlockIds } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400 }
      );
    }

    const project = CanvasService.getProject(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: `Canvas project not found: ${projectId}` },
        { status: 404 }
      );
    }

    const videoBridge = await CanvasService.exportToVideo(project, selectedBlockIds);

    return NextResponse.json({
      success: true,
      message: 'Canvas elements successfully bridged to AI Video Editor as storyboard.',
      bridge: videoBridge,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to export canvas to video' },
      { status: 500 }
    );
  }
}
