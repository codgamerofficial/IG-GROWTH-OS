// =============================================================================
// RIIQX — Festive Price Drop Sniper API Route
// GET & POST /api/twin/price-sniper
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { FestiveDropSniperService } from '@/services/product-intelligence/festive-drop-sniper';

export async function GET() {
  try {
    const report = await FestiveDropSniperService.getDashboardReport();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error('[API/PriceSniper] GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve price sniper dashboard' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productTitle, currentPrice, targetPrice, productUrl, retailerName, preferredBank } = body;

    if (!productTitle || !currentPrice || !targetPrice) {
      return NextResponse.json(
        { success: false, error: 'Product title, current price, and target price are required' },
        { status: 400 }
      );
    }

    const item = await FestiveDropSniperService.addSniperTarget({
      productTitle: String(productTitle),
      currentPrice: Number(currentPrice),
      targetPrice: Number(targetPrice),
      productUrl: productUrl ? String(productUrl) : undefined,
      retailerName: retailerName ? String(retailerName) : undefined,
      preferredBank: preferredBank ? String(preferredBank) : undefined,
    });

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (err: any) {
    console.error('[API/PriceSniper] POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to register sniper target' },
      { status: 500 }
    );
  }
}
