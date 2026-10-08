import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const visits = await repository.getVisits();
    return NextResponse.json({ success: true, count: visits.length, visits });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.pandal_id || !body.pandal_name) {
      return NextResponse.json({ success: false, error: 'pandal_id and pandal_name are required' }, { status: 400 });
    }
    const visit = await repository.recordVisit(body);
    return NextResponse.json({ success: true, visit }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
