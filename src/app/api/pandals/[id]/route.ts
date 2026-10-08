import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pandal = await repository.getPandalById(params.id);
    if (!pandal) {
      return NextResponse.json({ success: false, error: 'Pandal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, pandal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await req.json();
    const updated = await repository.updatePandal(params.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Pandal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, pandal: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
