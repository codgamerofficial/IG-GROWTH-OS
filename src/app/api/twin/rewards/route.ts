// =============================================================================
// RIIQX — Rewards Ledger & Referral Hub API
// Strict Append-Only Ledger • Zero Fake Virtual Balances
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const data = await TwinRepository.getRewardAccount(userId);

    const referralCode = `RIIQX-${userId.slice(-6).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      account: data.account,
      ledger: data.ledger,
      referral: {
        code: referralCode,
        link: `https://riiqx.vercel.app/?ref=${referralCode}`,
        terms: 'Rewards are credited strictly upon verified partner transaction completion. Zero synthetic balances.',
      },
      partnerProgramStatus: {
        merchantCampaigns: 'pending_partner_funding',
        referralEngine: 'active_tracking',
        cashbackValidation: 'ledger_verified_only',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
