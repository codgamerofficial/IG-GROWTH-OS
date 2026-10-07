import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'riiqx-fashion';

    const brand = await repository.getBrand(slug);
    const pillars = await repository.getContentPillars(brand.id);

    return NextResponse.json({
      success: true,
      brand,
      pillars,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = await repository.updateBrand(id || '00000000-0000-0000-0000-000000000001', updates);
    return NextResponse.json({ success: true, brand: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
