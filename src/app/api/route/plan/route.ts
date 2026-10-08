import { NextRequest, NextResponse } from 'next/server';
import { optimizePujaItinerary } from '@/lib/routing/optimizer';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const date = body.date || '2026-10-18';
    const START_LOCATION_LOOKUP: Record<string, { lat: number; lng: number }> = {
      'shyambazar': { lat: 22.6022, lng: 88.3708 },
      'gariahat': { lat: 22.5186, lng: 88.3647 },
      'college square': { lat: 22.5744, lng: 88.3629 },
      'kalighat': { lat: 22.5186, lng: 88.3472 },
      'howrah': { lat: 22.5830, lng: 88.3418 },
      'salt lake': { lat: 22.5862, lng: 88.4198 },
      'esplanade': { lat: 22.5647, lng: 88.3516 },
      'sealdah': { lat: 22.5670, lng: 88.3712 },
      'dum dum': { lat: 22.6225, lng: 88.3934 },
    };

    let startLocation = {
      name: 'Shyambazar Five Point Crossing',
      lat: 22.6022,
      lng: 88.3708,
    };

    if (body.startLocation) {
      if (typeof body.startLocation === 'string') {
        const query = body.startLocation.toLowerCase();
        const matched = Object.keys(START_LOCATION_LOOKUP).find((k) => query.includes(k));
        startLocation = {
          name: body.startLocation,
          lat: matched ? START_LOCATION_LOOKUP[matched].lat : 22.6022,
          lng: matched ? START_LOCATION_LOOKUP[matched].lng : 88.3708,
        };
      } else if (body.startLocation.lat && body.startLocation.lng) {
        startLocation = {
          name: body.startLocation.name || 'Custom Starting Point',
          lat: Number(body.startLocation.lat),
          lng: Number(body.startLocation.lng),
        };
      }
    }
    const startTime = body.startTime || '14:00';
    const endTime = body.endTime || '22:00';
    const walkingTolerance = body.walkingTolerance || 'MEDIUM';
    const transportPreference = body.transportPreference || 'METRO_AND_WALK';
    const interests = body.interests || ['traditional', 'theme'];
    const maxPandals = body.maxPandals || 6;
    const routeType = body.routeType || 'BEST OF KOLKATA';

    const plan = await optimizePujaItinerary({
      date,
      startLocation,
      startTime,
      endTime,
      walkingTolerance,
      transportPreference,
      interests,
      maxPandals,
      routeType,
    });

    // Save plan to repository
    await repository.saveTripPlan(plan);

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Route optimization failed' },
      { status: 500 }
    );
  }
}
