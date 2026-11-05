import { NextRequest, NextResponse } from 'next/server';
import {
  getDropshippingOrderById,
  transitionOrderStatus,
} from '@/services/shopping/dropshipping-operations';
import { DropshippingOrderStatus } from '@/services/shopping/types';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(context.params);
    const orderId = params.id;

    const order = getDropshippingOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: `Order ${orderId} not found` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/orders/[id] GET:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(context.params);
    const orderId = params.id;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: status' },
        { status: 400 }
      );
    }

    const nextStatus = body.status as DropshippingOrderStatus;
    const notes = body.notes as string | undefined;

    const result = transitionOrderStatus(orderId, nextStatus, notes);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      message: `Order ${orderId} transitioned to ${nextStatus}`,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/orders/[id] PATCH:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
