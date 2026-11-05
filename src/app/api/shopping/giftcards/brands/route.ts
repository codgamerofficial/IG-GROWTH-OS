// =============================================================================
// GlowFit AI / RIIQX — Authorized Gift Card Brands API
// Route: GET /api/shopping/giftcards/brands
// =============================================================================

import { NextResponse } from 'next/server';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';

export async function GET() {
  try {
    const brands = GiftCardArbitrageService.getAuthorizedBrands();

    return NextResponse.json({
      success: true,
      brands,
      total: brands.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/shopping/giftcards/brands] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gift card brands.' },
      { status: 500 }
    );
  }
}
