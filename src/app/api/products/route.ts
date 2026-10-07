import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') || '00000000-0000-0000-0000-000000000001';
    const products = await repository.getProducts(brandId);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await repository.addProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
