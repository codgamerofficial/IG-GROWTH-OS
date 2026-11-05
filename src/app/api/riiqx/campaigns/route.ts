// =============================================================================
// RIIQX — Campaign Studio API (List & Create)
// =============================================================================

import { NextResponse } from 'next/server';
import { CampaignGenerator } from '@/services/campaigns/campaign-generator';
import { CreateCampaignInput } from '@/services/campaigns/types';

export async function GET() {
  try {
    const campaigns = CampaignGenerator.listCampaigns();
    return NextResponse.json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateCampaignInput;

    if (!body.name || !body.objective) {
      return NextResponse.json(
        { success: false, error: 'Campaign name and objective are required fields.' },
        { status: 400 }
      );
    }

    const campaign = await CampaignGenerator.generateCampaign(body);

    return NextResponse.json({
      success: true,
      campaign,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate campaign' },
      { status: 500 }
    );
  }
}
