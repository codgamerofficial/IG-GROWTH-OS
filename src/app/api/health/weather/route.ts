import { NextResponse } from 'next/server';
import { fetchLiveKolkataWeather } from '@/lib/weather/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    const weather = await fetchLiveKolkataWeather();
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      service: 'weather',
      service_name: 'Open-Meteo Kolkata Forecast',
      status: 'CONNECTED',
      latency_ms: latencyMs,
      endpoint: weather.source_url,
      current_weather: {
        temperature_c: weather.temperature_c,
        condition: weather.condition_text,
        humidity: weather.humidity_percent,
        is_safe_for_walking: weather.is_safe_for_walking,
      },
      checked_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        service: 'weather',
        service_name: 'Open-Meteo Kolkata Forecast',
        status: 'ERROR',
        error_message: err.message,
        checked_at: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
