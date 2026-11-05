// =============================================================================
// RIIQX — AI Product Studio API (Generate Commercial Scene)
// =============================================================================

import { NextResponse } from 'next/server';
import { ProductService } from '@/services/products/product-service';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const generation = await ProductService.generateScene({
      productId: params.id,
      environment: body.environment || 'luxury_pedestal',
      lighting: body.lighting || 'dramatic_rim',
      composition: body.composition || 'center_hero',
      aspectRatio: body.aspectRatio || '1:1',
      customPrompt: body.customPrompt,
    });

    return NextResponse.json({
      success: true,
      generation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate product scene' },
      { status: 500 }
    );
  }
}

