import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const alerts = await repository.getTrafficAlerts();
    return NextResponse.json({ success: true, count: alerts.length, alerts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.category || !body.area) {
      return NextResponse.json({ success: false, error: 'Missing required alert fields' }, { status: 400 });
    }
    const alert = await repository.addTrafficAlert(body);
    return NextResponse.json({ success: true, alert }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
