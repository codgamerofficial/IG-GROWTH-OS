// =============================================================================
// RIIQX — Opportunities & Deals Radar API
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || 'all';

    const items = await TwinRepository.getOpportunities(category);
    return NextResponse.json({ success: true, count: items.length, opportunities: items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
