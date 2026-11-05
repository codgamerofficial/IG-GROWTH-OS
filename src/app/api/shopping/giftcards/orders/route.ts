// =============================================================================
// GlowFit AI / RIIQX — Gift Card Orders & Cashback Ledger API
// Route: GET /api/shopping/giftcards/orders
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

    const orders = GiftCardArbitrageService.getGiftCardOrders();
    const cashbackLedger = GiftCardArbitrageService.getCashbackLedger(userId);

    const totalCashbackCredited = cashbackLedger
      .filter((c) => c.status === 'credited')
      .reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({
      success: true,
      orders,
      cashbackLedger,
      totalCashbackCredited,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/shopping/giftcards/orders] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gift card orders and ledger.' },
      { status: 500 }
    );
  }
}
