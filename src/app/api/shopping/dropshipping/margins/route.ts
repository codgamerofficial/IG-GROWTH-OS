import { NextRequest, NextResponse } from 'next/server';
import { calculateContributionMargin } from '@/services/shopping/dropshipping-operations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellingPrice = parseFloat(searchParams.get('sellingPrice') || '2499');
    const cogs = parseFloat(searchParams.get('cogs') || '1100');
    const shippingCost = parseFloat(searchParams.get('shippingCost') || '60');

    const breakdown = calculateContributionMargin(sellingPrice, cogs, shippingCost);

    return NextResponse.json({
      success: true,
      breakdown,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/margins GET:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sellingPrice = parseFloat(body.sellingPrice || 0);
    const cogs = parseFloat(body.cogs || 0);
    const shippingCost = parseFloat(body.shippingCost ?? 60);

    const breakdown = calculateContributionMargin(sellingPrice, cogs, shippingCost, {
      returnReservePct: body.returnReservePct,
      gatewayFeePct: body.gatewayFeePct,
    });

    return NextResponse.json({
      success: true,
      breakdown,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/margins POST:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

