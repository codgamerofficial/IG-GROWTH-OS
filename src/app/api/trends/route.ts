import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export async function GET() {
  try {
    const trends = await repository.getTrends();
    return NextResponse.json({ success: true, trends });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTrend = await repository.addTrend(body);
    return NextResponse.json({ success: true, trend: newTrend });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
