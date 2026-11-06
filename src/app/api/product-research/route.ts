// =============================================================================
// RIIQX — Product Research & Verification API Endpoint
// Real Multimodal Product Extraction • Cross-Retailer Verification • Price Truth
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { ProductResearchOrchestrator } from '@/services/product-intelligence/orchestrator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();

    const { url, screenshotBase64, screenshotMimeType, query, prompt, userPreferences } = body;

    const report = await ProductResearchOrchestrator.executeResearch({
      url,
      screenshotBase64,
      screenshotMimeType,
      queryHint: query || prompt,
      userId,
      userPreferences,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error('[API /api/product-research] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Product verification failed. Please ensure the URL is valid or image is clear.',
      },
      { status: 400 }
    );
  }
}

