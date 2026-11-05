// =============================================================================
// GlowFit AI / RIIQX — Instant Gift Card Purchase & Auto-Wallet Credit API
// Route: POST /api/shopping/giftcards/purchase
// Supports Idempotency, Server-Side Ledger, and Direct Wallet Redemption
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';
import { GiftCardPurchaseRequest } from '@/services/shopping/types';

export async function POST(req: NextRequest) {
  try {
    const body: GiftCardPurchaseRequest = await req.json();
    const idempotencyHeader = req.headers.get('x-idempotency-key') || req.headers.get('idempotency-key');
    const idempotencyKey = body.idempotencyKey || idempotencyHeader || undefined;

    if (!body.platform || !body.faceValue || Number(body.faceValue) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Platform and valid positive faceValue are required.' },
        { status: 400 }
      );
    }

    const orderResult = await GiftCardArbitrageService.purchaseGiftCard({
      userId: body.userId || 'default_user',
      platform: body.platform,
      brandKey: body.brandKey,
      faceValue: Number(body.faceValue),
      paymentMethod: body.paymentMethod || 'upi',
      autoCreditToShoppingWallet: body.autoCreditToShoppingWallet ?? true,
      idempotencyKey,
    });

    return NextResponse.json({
      success: true,
      order: orderResult,
      purchaseResult: orderResult,
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
