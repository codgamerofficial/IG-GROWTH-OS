// =============================================================================
// GlowFit AI / RIIQX — Affiliate & Dropshipping Referral Tracking API
// Route: POST & GET /api/shopping/affiliate/track
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { AffiliateReferralService } from '@/services/shopping/affiliate-referral';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventType, // 'impression' | 'click' | 'conversion' | 'create_link'
      referralCode,
      creatorId = 'creator_studio_01',
      productId,
      orderId,
      orderGrossValue = 0,
      metadata = {},
    } = body;

    if (eventType === 'create_link') {
      if (!productId) {
        return NextResponse.json(
          { success: false, error: 'productId is required to generate a referral link.' },
          { status: 400 }
        );
      }
      const newLink = AffiliateReferralService.createReferralLink({
        creatorId,
        productId,
        campaignId: metadata?.campaignId,
        customCommissionRatePct: metadata?.commissionRatePct,
      });
      return NextResponse.json({
        success: true,
        message: 'Affiliate referral link created.',
        link: newLink,
      });
    }

    if (!referralCode) {
      return NextResponse.json(
        { success: false, error: 'referralCode is required for event tracking.' },
        { status: 400 }
      );
    }

    if (eventType === 'impression') {
      const recorded = AffiliateReferralService.recordImpression(referralCode, metadata);
      return NextResponse.json({
        success: recorded,
        message: recorded ? 'Impression recorded.' : 'Referral code not found.',
      });
    }

    if (eventType === 'click') {
      const recorded = AffiliateReferralService.recordClick(referralCode, metadata);
      return NextResponse.json({
        success: recorded,
        message: recorded ? 'Click recorded.' : 'Referral code not found.',
      });
    }

    if (eventType === 'conversion') {
      if (!orderId || !orderGrossValue) {
        return NextResponse.json(
          { success: false, error: 'orderId and orderGrossValue are required for conversion tracking.' },
          { status: 400 }
        );
      }
      const result = AffiliateReferralService.recordConversion({
        referralCode,
        orderId,
        orderGrossValue: Number(orderGrossValue),
        metadata,
      });
      return NextResponse.json({
        success: result.success,
        commissionEarned: result.commissionEarned,
        event: result.event,
        message: result.success
          ? `Conversion attributed! Earned ₹${result.commissionEarned.toFixed(2)} commission.`
          : 'Referral code not found.',
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid eventType: "${eventType}". Must be create_link, impression, click, or conversion.` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId') || 'creator_studio_01';
    const referralCode = searchParams.get('code');

    if (referralCode) {
      const link = AffiliateReferralService.getReferralLink(referralCode);
      if (!link) {
        return NextResponse.json({ success: false, error: 'Referral link not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, link });
    }

    const performance = AffiliateReferralService.getCreatorPerformance(creatorId);
    return NextResponse.json({ success: true, performance });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

