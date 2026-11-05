import { NextRequest, NextResponse } from 'next/server';
import {
  createDropshippingOrder,
  getAllDropshippingOrders,
} from '@/services/shopping/dropshipping-operations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.customerId || !body.customerName || !body.shippingAddress || !body.items || !body.items.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: customerId, customerName, shippingAddress, items (array)',
        },
        { status: 400 }
      );
    }

    const result = createDropshippingOrder({
      customerId: body.customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail || `${body.customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      customerPhone: body.customerPhone || '+91 98765 43210',
      shippingAddress: body.shippingAddress,
      items: body.items,
      paymentMethod: body.paymentMethod || 'upi_direct',
      idempotencyKey: body.idempotencyKey,
      initialStatus: body.initialStatus || 'paid',
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      isExisting: result.isExisting || false,
      order: result.order,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/orders POST:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId') || undefined;

    const orders = getAllDropshippingOrders(customerId);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/orders GET:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

