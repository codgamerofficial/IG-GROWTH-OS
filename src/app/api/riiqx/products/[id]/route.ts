// =============================================================================
// RIIQX — AI Product Studio API (Get Single & Delete)
// =============================================================================

import { NextResponse } from 'next/server';
import { ProductService } from '@/services/products/product-service';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = ProductService.getProduct(params.id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = ProductService.deleteProduct(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Product not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

