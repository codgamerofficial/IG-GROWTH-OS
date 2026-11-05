// =============================================================================
// RIIQX — Campaign Studio API (Get Single & Delete)
// =============================================================================

import { NextResponse } from 'next/server';
import { CampaignGenerator } from '@/services/campaigns/campaign-generator';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = CampaignGenerator.getCampaign(params.id);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: `Campaign not found: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = CampaignGenerator.deleteCampaign(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Campaign not found or could not be deleted: ${params.id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}

