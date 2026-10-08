import { NextResponse } from 'next/server';
import { PUJA_CALENDAR_2026 } from '@/lib/data/kolkata-calendar';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    year: 2026,
    calendar: PUJA_CALENDAR_2026,
  });
}
