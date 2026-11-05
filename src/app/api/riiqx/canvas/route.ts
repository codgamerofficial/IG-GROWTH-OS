// =============================================================================
// RIIQX — Creative Canvas API (List & Create/Save)
// =============================================================================

import { NextResponse } from 'next/server';
import { CanvasService } from '@/services/canvas/canvas-service';

export async function GET() {
  try {
    const projects = CanvasService.listProjects();
    return NextResponse.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list canvas projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    const saved = CanvasService.saveProject(body);

    return NextResponse.json({
      success: true,
      project: saved,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save canvas project' },
      { status: 500 }
    );
  }
}
