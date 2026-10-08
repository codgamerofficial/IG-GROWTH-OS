import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pandalId = searchParams.get('pandal_id') || undefined;
    const reports = await repository.getCrowdReports(pandalId);
    return NextResponse.json({ success: true, count: reports.length, reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.crowd_level) {
      return NextResponse.json({ success: false, error: 'crowd_level is required' }, { status: 400 });
    }
    const report = await repository.addCrowdReport({
      pandal_id: body.pandal_id,
      metro_station_id: body.metro_station_id,
      crowd_level: body.crowd_level,
      wait_time_minutes: body.wait_time_minutes || 30,
      source: body.source || 'Verified User Report',
      source_type: 'USER_REPORT',
      confidence: 0.85,
      verified: true,
    });
    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
