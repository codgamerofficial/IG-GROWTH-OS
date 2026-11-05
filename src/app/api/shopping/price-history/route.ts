// =============================================================================
// GlowFit AI / RIIQX — 30-Day Historical Price Observations API
// Route: GET /api/shopping/price-history
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PriceComparatorService } from '@/services/shopping/price-comparator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productIdentifier = searchParams.get('productIdentifier') || searchParams.get('id') || 'prod_default';
    const productTitle = searchParams.get('productTitle') || searchParams.get('title') || 'Analyzed Product';
    const currentPrice = Number(searchParams.get('currentPrice') || searchParams.get('price')) || 1999;
    const mrp = Number(searchParams.get('mrp')) || Math.round(currentPrice * 1.35);

    const priceHistory = PriceComparatorService.getPriceHistory(
      productIdentifier,
      productTitle,
      currentPrice,
      mrp
    );

    return NextResponse.json({
      success: true,
      priceHistory,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/shopping/price-history] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch price history.' },
      { status: 500 }
    );
  }
}

