import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';
import { PublishingSafetyGate } from '@/lib/security/publishing-gate';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await repository.getContentItemById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, ...updates } = body;

    if (action === 'approve') {
      const approved = await repository.approveContentItem(params.id, updates.approved_by || 'User');
      return NextResponse.json({ success: true, item: approved });
    }

    if (action === 'reject') {
      const rejected = await repository.rejectContentItem(params.id, updates.reason || 'Needs revision');
      return NextResponse.json({ success: true, item: rejected });
    }

    if (action === 'schedule') {
      if (!updates.scheduled_at) {
        return NextResponse.json({ success: false, error: 'scheduled_at timestamp is required' }, { status: 400 });
      }
      const scheduled = await repository.scheduleContentItem(params.id, updates.scheduled_at);
      return NextResponse.json({ success: true, item: scheduled });
    }

    if (action === 'publish') {
      const publishResult = await PublishingSafetyGate.publishVerified(params.id);
      const updatedItem = await repository.getContentItemById(params.id);
      return NextResponse.json({
        success: true,
        publishResult,
        item: updatedItem,
      });
    }

    // Default: simple update
    const updated = await repository.updateContentItem(params.id, updates);
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Operation failed',
        code: error.code || 'ACTION_FAILED',
      },
      { status: 400 }
    );
  }
}
