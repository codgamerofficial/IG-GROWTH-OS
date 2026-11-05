// =============================================================================
// GlowFit AI / RIIQX — Smart Shopping & Cross-Platform Arbitrage API
// Route: POST /api/shopping/analyze
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PriceComparatorService } from '@/services/shopping/price-comparator';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, screenshotBase64, screenshotMimeType, productNameHint } = body;

    if (!url && !screenshotBase64 && !productNameHint) {
      return NextResponse.json(
        { success: false, error: 'Please provide either a product URL, a screenshot, or a product name.' },
        { status: 400 }
      );
    }

    // 1. Analyze and extract product data (multimodal vision or URL parsing)
    const { extractedProduct, platformComparisons } = await PriceComparatorService.analyzeProduct({
      url,
      screenshotBase64,
      screenshotMimeType,
      productNameHint,
    });

    // 2. Calculate optimal multi-tier gift card & coupon arbitrage plan
    const optimalPlan = GiftCardArbitrageService.calculateOptimalPlan(
      extractedProduct,
      platformComparisons
    );

    return NextResponse.json({
      success: true,
      extractedProduct,
      platformComparisons,
      optimalPlan,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/shopping/analyze] Execution Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error analyzing product arbitrage.' },
      { status: 500 }
    );
  }
}
