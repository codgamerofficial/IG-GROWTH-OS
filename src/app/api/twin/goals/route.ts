// =============================================================================
// RIIQX — Twin Personal Goals API Endpoint
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const goals = await TwinRepository.getGoals(userId);
    return NextResponse.json({ success: true, goals });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Goal title is required' }, { status: 400 });
    }

    const goal = await TwinRepository.addGoal({
      userId,
      title: body.title,
      description: body.description,
      category: body.category || 'purchase_budget',
      targetAmount: Number(body.targetAmount || 0),
      currentAmount: Number(body.currentAmount || 0),
      currency: body.currency || 'INR',
      deadline: body.deadline,
      status: body.status || 'active',
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, goal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();
    const { goalId, ...updates } = body;

    if (!goalId) {
      return NextResponse.json({ error: 'goalId is required' }, { status: 400 });
    }

    const updated = await TwinRepository.updateGoal(userId, goalId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, goal: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get('id');

    if (!goalId) {
      return NextResponse.json({ error: 'Goal id is required' }, { status: 400 });
    }

    const deleted = await TwinRepository.deleteGoal(userId, goalId);
    if (!deleted) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

