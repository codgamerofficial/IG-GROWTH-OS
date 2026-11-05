// =============================================================================
// RIIQX — Marketplace Products API Route
// GET /api/shopping/marketplace/products?category=...&search=...&sortBy=...
// =============================================================================

import { NextResponse } from 'next/server';
import { CommerceService } from '@/services/shopping/commerce-service';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const minPrice = url.searchParams.has('minPrice') ? Number(url.searchParams.get('minPrice')) : undefined;
    const maxPrice = url.searchParams.has('maxPrice') ? Number(url.searchParams.get('maxPrice')) : undefined;
    const inStockOnly = url.searchParams.get('inStockOnly') === 'true';
    const minDiscount = url.searchParams.has('minDiscount') ? Number(url.searchParams.get('minDiscount')) : undefined;
    const sortBy = url.searchParams.get('sortBy') as any || 'popularity';
    const page = url.searchParams.has('page') ? Number(url.searchParams.get('page')) : 1;
    const limit = url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : 20;

    const brandParam = url.searchParams.get('brand');
    const brand = brandParam ? brandParam.split(',').map((b) => b.trim()) : undefined;

    const result = CommerceService.listProducts({
      category,
      search,
      minPrice,
      maxPrice,
      brand,
      inStockOnly,
      minDiscount,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list marketplace products' },
      { status: 500 }
    );
  }
}

