import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await repository.getTripPlans();
    return NextResponse.json({ success: true, count: plans.length, plans });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await repository.saveTripPlan(body);
    return NextResponse.json({ success: true, plan: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
