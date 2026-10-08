import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';
import { getMetroOperatingSchedule } from '@/lib/data/kolkata-metro';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lineId = searchParams.get('line') || undefined;
    const date = searchParams.get('date') || '2026-10-18';

    const lines = await repository.getMetroLines();
    const stations = await repository.getMetroStations(lineId);
    const schedule = getMetroOperatingSchedule(date);

    return NextResponse.json({
      success: true,
      lines,
      stations,
      schedule,
      date,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
