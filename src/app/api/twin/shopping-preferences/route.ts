// =============================================================================
// RIIQX — User Shopping & Discount Preferences API
// "My Shopping Offers" • Banks, Cards, Payment Methods, Gift Cards
// Zero Sensitive Credentials • Strict Privacy Isolation
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';
import { UserShoppingPreferences } from '@/services/product-intelligence/types';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const preferences = await TwinRepository.getShoppingPreferences(userId);
    return NextResponse.json({ success: true, preferences });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();

    // Security check: Never accept sensitive payment credentials
    if (body.cardNumber || body.cvv || body.password || body.otp) {
      return NextResponse.json(
        { error: 'Security violation: Never submit full card numbers, CVV, or passwords.' },
        { status: 400 }
      );
    }

    const updatedPrefs: UserShoppingPreferences = {
      userId,
      preferredBanks: Array.isArray(body.preferredBanks) ? body.preferredBanks : ['HDFC Bank', 'ICICI Bank', 'SBI Card'],
      preferredCardTypes: Array.isArray(body.preferredCardTypes) ? body.preferredCardTypes : ['credit', 'debit', 'emi'],
      preferredPaymentMethods: Array.isArray(body.preferredPaymentMethods) ? body.preferredPaymentMethods : ['upi', 'card'],
      memberships: Array.isArray(body.memberships) ? body.memberships : ['Amazon Prime'],
      giftCardBalances: Array.isArray(body.giftCardBalances) ? body.giftCardBalances : [],
    };

    const saved = await TwinRepository.saveShoppingPreferences(updatedPrefs);
    return NextResponse.json({ success: true, preferences: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

