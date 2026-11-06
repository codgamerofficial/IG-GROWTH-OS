// =============================================================================
// RIIQX — Weekly Personal Intelligence Digest API
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const digests = await TwinRepository.getWeeklyDigests(userId);
    return NextResponse.json({ success: true, digests });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

