// =============================================================================
// RIIQX — Single Marketplace Product Details API Route
// GET /api/shopping/marketplace/products/[id]
// =============================================================================

import { NextResponse } from 'next/server';
import { CommerceService } from '@/services/shopping/commerce-service';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const product = CommerceService.getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: `Product not found: ${id}` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

