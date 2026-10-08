import { NextResponse } from 'next/server';
import { fetchLiveKolkataWeather } from '@/lib/weather/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const weather = await fetchLiveKolkataWeather();
    return NextResponse.json({ success: true, weather });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
