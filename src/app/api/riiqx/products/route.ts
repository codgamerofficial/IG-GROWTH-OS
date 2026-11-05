// =============================================================================
// RIIQX — AI Product Studio API (List & Create Product)
// =============================================================================

import { NextResponse } from 'next/server';
import { ProductService } from '@/services/products/product-service';
import { CreateProductInput } from '@/services/products/types';

export async function GET() {
  try {
    const products = ProductService.listProducts();
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateProductInput;

    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Product name and category are required' },
        { status: 400 }
      );
    }

    const product = await ProductService.createProduct(body);

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
