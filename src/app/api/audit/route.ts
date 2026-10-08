import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await repository.getAuditLogs();
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log = await repository.addAuditLog(
      body.action || 'USER_ACTION',
      body.resource_type || 'user_interface',
      body.resource_id,
      body.metadata
    );
    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
