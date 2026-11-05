// =============================================================================
// RIIQX — Campaign Studio API (Push Asset to AI Video Editor)
// =============================================================================

import { NextResponse } from 'next/server';
import { CampaignGenerator } from '@/services/campaigns/campaign-generator';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { assetId } = body;

    if (!assetId) {
      return NextResponse.json(
        { success: false, error: 'assetId is required to bridge to Video Editor' },
        { status: 400 }
      );
    }

    const videoBridge = await CampaignGenerator.sendToVideoEditor(params.id, assetId);

    return NextResponse.json({
      success: true,
      message: 'Asset successfully bridged to AI Video Editor workspace.',
      bridge: videoBridge,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to push to video editor' },
      { status: 500 }
    );
  }
}

