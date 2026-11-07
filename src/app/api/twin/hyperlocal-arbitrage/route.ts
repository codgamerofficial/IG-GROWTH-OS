// =============================================================================
// RIIQX — Hyperlocal Online vs Offline Arbitrage API Route
// POST /api/twin/hyperlocal-arbitrage
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { HyperlocalArbitrageEngine } from '@/services/product-intelligence/hyperlocal-arbitrage-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productTitle = 'Electronics Item',
      onlinePrice = 15000,
      onlineRetailer = 'Amazon India',
      onlineDeliveryDays = 2,
      city,
      pincode,
      lat,
      lng,
      searchRadiusKm = 15,
    } = body;

    if (!productTitle && !onlinePrice) {
      return NextResponse.json(
        { success: false, error: 'Product title or online price is required' },
        { status: 400 }
      );
    }

    const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
      productTitle: String(productTitle),
      onlineDeliveredPrice: Number(onlinePrice) || 15000,
      onlineRetailerName: String(onlineRetailer || 'Amazon India'),
      onlineDeliveryDays: Number(onlineDeliveryDays) || 2,
      userCity: city ? String(city) : undefined,
      userPincode: pincode ? String(pincode) : undefined,
      userLat: typeof lat === 'number' ? lat : undefined,
      userLng: typeof lng === 'number' ? lng : undefined,
      searchRadiusKm: Number(searchRadiusKm) || 15,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error('[API/HyperlocalArbitrage] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to calculate hyperlocal store arbitrage',
      },
      { status: 500 }
    );
  }
}

