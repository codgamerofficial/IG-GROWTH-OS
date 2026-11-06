// =============================================================================
// RIIQX — Action Approvals & Execution Gating API
// Consequential Boundary Gates • Two-Step Verification
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

// In-memory approval ledger for resilient tracking
const pendingApprovals = new Map<string, any[]>();

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const list = pendingApprovals.get(userId) || [];
    return NextResponse.json({ success: true, approvals: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();
    const { actionId, decision } = body; // decision: 'approve' | 'reject'

    const list = pendingApprovals.get(userId) || [];
    const updated = list.map((a) => {
      if (a.id === actionId) {
        return {
          ...a,
          status: decision === 'approve' ? 'approved' : 'rejected',
          decidedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    pendingApprovals.set(userId, updated);
    return NextResponse.json({ success: true, actionId, decision });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
