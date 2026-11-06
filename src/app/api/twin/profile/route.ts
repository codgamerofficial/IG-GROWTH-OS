// =============================================================================
// RIIQX — Twin Profile API Endpoint
// GET / POST: Retrieve and update personal Twin identity, autonomy, and preferences
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const profile = await TwinRepository.getProfile(userId);
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();

    const updated = await TwinRepository.upsertProfile({
      userId,
      twinName: body.twinName,
      autonomyLevel: body.autonomyLevel,
      tone: body.tone,
      budgetTier: body.budgetTier,
      skinType: body.skinType,
      preferredBrands: body.preferredBrands,
      avoidKeywords: body.avoidKeywords,
      notificationFrequency: body.notificationFrequency,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
