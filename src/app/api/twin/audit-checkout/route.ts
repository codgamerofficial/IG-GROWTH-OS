// =============================================================================
// RIIQX — Checkout Trap & Deceptive Fee Audit API
// POST /api/twin/audit-checkout
// Audits checkout screenshots for hidden fees, pre-ticked donations, and fake insurance
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { DeceptiveFeeDeflector } from '@/services/product-intelligence/deceptive-fee-deflector';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { screenshotBase64, mimeType = 'image/jpeg', merchantHint } = body;

    if (!screenshotBase64 || typeof screenshotBase64 !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid checkout screenshot in base64 format.',
        },
        { status: 400 }
      );
    }

    const auditResult = await DeceptiveFeeDeflector.auditCheckoutScreen(
      screenshotBase64,
      mimeType,
      merchantHint
    );

    return NextResponse.json({
      success: true,
      audit: auditResult,
    });
  } catch (error: any) {
    console.error('[API /twin/audit-checkout] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to audit checkout screenshot.',
      },
      { status: 500 }
    );
  }
}
