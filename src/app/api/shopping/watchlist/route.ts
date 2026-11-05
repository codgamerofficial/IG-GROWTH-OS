// =============================================================================
// GlowFit AI / RIIQX — Target Price Drop Watchlist API
// Route: GET & POST /api/shopping/watchlist
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PriceComparatorService } from '@/services/shopping/price-comparator';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

    const watchlists = PriceComparatorService.getWatchlists(userId);

    return NextResponse.json({
      success: true,
      watchlists,
      total: watchlists.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API GET /api/shopping/watchlist] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve watchlists.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'default_user', productTitle, productIdentifier, targetPrice, initialPrice, preferredPlatform } = body;

    if (!productTitle || !targetPrice || !initialPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: productTitle, targetPrice, and initialPrice are mandatory.' },
        { status: 400 }
      );
    }

    if (Number(targetPrice) >= Number(initialPrice)) {
      return NextResponse.json(
        { success: false, error: 'Target price must be lower than the current initial price to set a drop alert.' },
        { status: 400 }
      );
    }

    const newRecord = PriceComparatorService.addWatchlist(userId, {
      productTitle,
      productIdentifier: productIdentifier || productTitle.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32),
      targetPrice: Number(targetPrice),
      initialPrice: Number(initialPrice),
      preferredPlatform: preferredPlatform || 'any',
    });

    return NextResponse.json({
      success: true,
      message: 'Target price drop alert created successfully.',
      watchlist: newRecord,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error('[API POST /api/shopping/watchlist] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create price drop alert.' },
      { status: 500 }
    );
  }
}
