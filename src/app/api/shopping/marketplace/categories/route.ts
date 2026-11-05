// =============================================================================
// RIIQX — Marketplace Categories API Route
// GET /api/shopping/marketplace/categories
// =============================================================================

import { NextResponse } from 'next/server';
import { CommerceService } from '@/services/shopping/commerce-service';

export async function GET() {
  try {
    const categories = CommerceService.CATEGORIES;
    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
