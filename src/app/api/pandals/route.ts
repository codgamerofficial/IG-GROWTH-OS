import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';
import { evaluatePandalStatus } from '@/lib/data/kolkata-calendar';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const area = searchParams.get('area') || undefined;
    const search = searchParams.get('search') || undefined;
    const date = searchParams.get('date') || '2026-10-18';

    const pandals = await repository.getPandals({ area, search });

    // Dynamically evaluate status based on target date
    const evaluatedPandals = pandals.map((p) => ({
      ...p,
      status: evaluatePandalStatus(p.opening_date, date),
    }));

    return NextResponse.json({
      success: true,
      count: evaluatedPandals.length,
      date,
      pandals: evaluatedPandals,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch pandals' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.lat || !body.lng || !body.area) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, lat, lng, area' },
        { status: 400 }
      );
    }

    const created = await repository.addPandal(body);
    return NextResponse.json({ success: true, pandal: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to add pandal' },
      { status: 500 }
    );
  }
}
