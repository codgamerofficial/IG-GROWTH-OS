import { NextResponse } from 'next/server';
import { calculateWalkingLeg } from '@/lib/routing/router';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    // 1. Real test of OSRM Walking Engine
    const leg = await calculateWalkingLeg(22.6025, 88.3670, 22.5992, 88.3644);

    // 2. Real test of CARTO Basemaps API Key & Tile Server
    const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_4er7_1_ff393df50298cdcd08cbc8cb';
    let cartoStatus = 'UNKNOWN';
    let cartoLatency = 0;
    try {
      const cartoStart = Date.now();
      const cartoRes = await fetch(
        `https://basemaps.cartocdn.com/rastertiles/voyager/10/512/512.png?key=${cartoKey}`,
        { method: 'HEAD', cache: 'no-store' }
      );
      cartoLatency = Date.now() - cartoStart;
      cartoStatus = cartoRes.ok ? 'CONNECTED' : `HTTP_${cartoRes.status}`;
    } catch {
      cartoStatus = 'UNREACHABLE';
    }

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      service: 'maps',
      service_name: 'OSRM Foot Routing & CARTO Basemaps Engine',
      status: leg.isRealApi && cartoStatus === 'CONNECTED' ? 'CONNECTED' : 'DEGRADED',
      latency_ms: latencyMs,
      endpoint: 'https://router.project-osrm.org / https://basemaps.cartocdn.com',
      carto_basemaps: {
        status: cartoStatus,
        key_configured: true,
        latency_ms: cartoLatency,
        endpoint: 'https://basemaps.cartocdn.com',
      },
      test_result: {
        origin: 'Bagbazar Sarbojanin',
        destination: 'Kumartuli Park',
        distance_meters: leg.distanceMeters,
        duration_minutes: leg.durationMinutes,
        source: leg.source,
      },
      checked_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        service: 'maps',
        service_name: 'OSRM Foot Routing & CARTO Basemaps Engine',
        status: 'ERROR',
        error_message: err.message,
        checked_at: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
