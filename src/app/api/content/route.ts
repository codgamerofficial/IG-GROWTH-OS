import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') || '00000000-0000-0000-0000-000000000001';
    const status = searchParams.get('status') as any;
    const approval_status = searchParams.get('approval_status') as any;

    const items = await repository.getContentItems(brandId, { status, approval_status });
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newItem = await repository.createContentItem(body);
    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
