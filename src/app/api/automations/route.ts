import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') || '00000000-0000-0000-0000-000000000001';

    const jobs = await repository.getAutomationJobs(brandId);
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
