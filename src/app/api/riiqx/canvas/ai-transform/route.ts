// =============================================================================
// RIIQX — Creative Canvas AI Transform API
// =============================================================================

import { NextResponse } from 'next/server';
import { CanvasService } from '@/services/canvas/canvas-service';
import { AITransformInput } from '@/services/canvas/types';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AITransformInput;

    if (!body.instruction) {
      return NextResponse.json(
        { success: false, error: 'instruction is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.selectedBlocks) || body.selectedBlocks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one selected block is required for AI Transform' },
        { status: 400 }
      );
    }

    const transformResult = await CanvasService.aiTransform(body);

    return NextResponse.json({
      success: true,
      result: transformResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to execute AI transform' },
      { status: 500 }
    );
  }
}
