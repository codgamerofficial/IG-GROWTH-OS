import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    const [restaurants, hospitals, policeStations] = await Promise.all([
      repository.getRestaurants(),
      repository.getHospitals(),
      repository.getPoliceStations(),
    ]);

    if (type === 'restaurants') {
      return NextResponse.json({ success: true, count: restaurants.length, restaurants });
    }
    if (type === 'hospitals') {
      return NextResponse.json({ success: true, count: hospitals.length, hospitals });
    }
    if (type === 'police') {
      return NextResponse.json({ success: true, count: policeStations.length, policeStations });
    }

    return NextResponse.json({
      success: true,
      restaurants,
      hospitals,
      policeStations,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
