// =============================================================================
// GlowFit AI / RIIQX — Instant Gift Card Purchase & Auto-Wallet Credit API
// Route: POST /api/shopping/giftcards/purchase
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';
import { GiftCardPurchaseRequest } from '@/services/shopping/types';

export async function POST(req: NextRequest) {
  try {
    const body: GiftCardPurchaseRequest = await req.json();

    if (!body.platform || !body.faceValue || body.faceValue <= 0) {
      return NextResponse.json(
        { success: false, error: 'Platform and valid positive faceValue are required.' },
        { status: 400 }
      );
    }

    const orderResult = await GiftCardArbitrageService.purchaseGiftCard({
      userId: body.userId || 'guest_user',
      platform: body.platform,
      faceValue: Number(body.faceValue),
      paymentMethod: body.paymentMethod || 'upi',
      autoCreditToShoppingWallet: body.autoCreditToShoppingWallet ?? true,
    });

    return NextResponse.json({
      success: true,
      order: orderResult,
      message: `Gift card generated successfully with ₹${orderResult.cashbackEarned} cashback!`,
    });
  } catch (error: any) {
    console.error('[API /api/shopping/giftcards/purchase] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process gift card purchase.' },
      { status: 500 }
    );
  }
}

