// =============================================================================
// RIIQX — Campaign Studio API (Update Asset Copy & Status)
// =============================================================================

import { NextResponse } from 'next/server';
import { CampaignGenerator } from '@/services/campaigns/campaign-generator';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { assetId, ...updates } = body;

    if (!assetId) {
      return NextResponse.json(
        { success: false, error: 'assetId is required' },
        { status: 400 }
      );
    }

    const updated = CampaignGenerator.updateAssetCopy(params.id, assetId, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Asset not found in campaign ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update asset' },
      { status: 500 }
    );
  }
}
