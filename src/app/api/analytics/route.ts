import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';
import { AnalyticsEngine } from '@/lib/analytics/engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') || '00000000-0000-0000-0000-000000000001';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const records = await repository.getAnalytics(brandId, days);
    const aggregates = AnalyticsEngine.aggregate(records);

    return NextResponse.json({
      success: true,
      records,
      aggregates,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
