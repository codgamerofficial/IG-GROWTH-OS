// =============================================================================
// GlowFit AI / RIIQX — Deterministic Savings Waterfall Calculator API
// Route: POST /api/shopping/savings/calculate
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';
import { ShoppingPlatform } from '@/services/shopping/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      platform = 'amazon',
      platformDisplayName,
      baseListedPrice,
      mrp,
      couponCode,
      bankName,
      cardType,
    } = body;

    if (!baseListedPrice || Number(baseListedPrice) <= 0) {
      return NextResponse.json(
        { success: false, error: 'A valid positive baseListedPrice is required.' },
        { status: 400 }
      );
    }

    const listedPrice = Number(baseListedPrice);
    const originalMrp = mrp ? Number(mrp) : Math.round(listedPrice * 1.35);
    const displayName = platformDisplayName || (platform.charAt(0).toUpperCase() + platform.slice(1));

    const waterfall = GiftCardArbitrageService.evaluateWaterfallSavings({
      platform: platform as ShoppingPlatform,
      platformDisplayName: displayName,
      baseListedPrice: listedPrice,
      mrp: originalMrp,
      couponCode,
      bankName,
      cardType,
    });

    return NextResponse.json({
      success: true,
      waterfall,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/shopping/savings/calculate] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate deterministic savings waterfall.' },
      { status: 500 }
    );
  }
}

