import { NextRequest, NextResponse } from 'next/server';
import { processReturnAndRefund } from '@/services/shopping/dropshipping-operations';
import { ReturnRefundReason } from '@/services/shopping/types';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(context.params);
    const orderId = params.id;
    const body = await req.json();

    if (!body.customerId || !body.reason) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: customerId, reason (defective_or_damaged, wrong_item_delivered, etc.)',
        },
        { status: 400 }
      );
    }

    const result = processReturnAndRefund({
      orderId,
      customerId: body.customerId,
      reason: body.reason as ReturnRefundReason,
      reasonDetails: body.reasonDetails,
      evidenceUrls: body.evidenceUrls,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      returnRecord: result.returnRecord,
      order: result.order,
      message: 'Return accepted and refund processed successfully.',
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/orders/[id]/return POST:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
