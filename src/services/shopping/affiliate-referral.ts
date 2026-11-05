// =============================================================================
// GlowFit AI / RIIQX — Affiliate & Dropshipping Referral Conversion Service
// Phase 7: Video Ad Attribution • Multi-Touch Referral Tracking • Commission Ledger
// =============================================================================

export interface ReferralLink {
  referralCode: string;
  creatorId: string;
  productId: string;
  campaignId: string;
  destinationUrl: string;
  canonicalReferralUrl: string;
  commissionRatePct: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  grossMerchandiseValue: number;
  totalCommissionEarned: number;
  createdAt: string;
}

export interface AffiliateEvent {
  id: string;
  eventType: 'impression' | 'click' | 'conversion';
  referralCode: string;
  productId: string;
  creatorId: string;
  orderId?: string;
  orderGrossValue?: number;
  commissionEarned?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CreatorAffiliatePerformance {
  creatorId: string;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  clickThroughRatePct: number;
  conversionRatePct: number;
  grossMerchandiseValue: number;
  totalCommissionEarned: number;
  pendingPayoutBalance: number;
  activeLinks: ReferralLink[];
  recentEvents: AffiliateEvent[];
}

// Global persistent state across hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var __riiqx_referral_links__: Map<string, ReferralLink> | undefined;
  // eslint-disable-next-line no-var
  var __riiqx_affiliate_events__: AffiliateEvent[] | undefined;
}

const referralLinksStore: Map<string, ReferralLink> =
  globalThis.__riiqx_referral_links__ || new Map<string, ReferralLink>();
globalThis.__riiqx_referral_links__ = referralLinksStore;

const affiliateEventsStore: AffiliateEvent[] =
  globalThis.__riiqx_affiliate_events__ || [];
globalThis.__riiqx_affiliate_events__ = affiliateEventsStore;

// Pre-seed high-converting default referral link if empty
if (referralLinksStore.size === 0) {
  const seedCode = 'ref_creator_lumina_01';
  referralLinksStore.set(seedCode, {
    referralCode: seedCode,
    creatorId: 'creator_studio_01',
    productId: 'prod_lumina_aura_01',
    campaignId: 'ad_lumina_viral_launch',
    destinationUrl: '/shopping?product=prod_lumina_aura_01',
    canonicalReferralUrl: 'https://riiqx.com/p/prod_lumina_aura_01?ref=ref_creator_lumina_01&utm_source=riiqx_ad',
    commissionRatePct: 8.5,
    totalImpressions: 1420,
    totalClicks: 218,
    totalConversions: 14,
    grossMerchandiseValue: 40586,
    totalCommissionEarned: 3449.81,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  });
}

export class AffiliateReferralService {
  /**
   * Create or retrieve trackable referral link for video ad campaigns
   */
  public static createReferralLink(params: {
    creatorId: string;
    productId: string;
    campaignId?: string;
    customCommissionRatePct?: number;
  }): ReferralLink {
    const {
      creatorId,
      productId,
      campaignId = `camp_${Date.now()}`,
      customCommissionRatePct = 8.5,
    } = params;

    const referralCode = `ref_${creatorId.replace(/[^a-zA-Z0-9]/g, '')}_${productId.slice(-6)}_${Date.now().toString(36).slice(-4)}`;
    const destinationUrl = `/shopping?product=${encodeURIComponent(productId)}`;
    const canonicalReferralUrl = `https://riiqx.com/p/${productId}?ref=${referralCode}&camp=${campaignId}&utm_source=riiqx_creator_ad`;

    const link: ReferralLink = {
      referralCode,
      creatorId,
      productId,
      campaignId,
      destinationUrl,
      canonicalReferralUrl,
      commissionRatePct: customCommissionRatePct,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      grossMerchandiseValue: 0,
      totalCommissionEarned: 0,
      createdAt: new Date().toISOString(),
    };

    referralLinksStore.set(referralCode, link);
    return link;
  }

  /**
   * Record video ad impression event
   */
  public static recordImpression(referralCode: string, metadata?: Record<string, any>): boolean {
    const link = referralLinksStore.get(referralCode);
    if (!link) return false;

    link.totalImpressions += 1;

    const event: AffiliateEvent = {
      id: `evt_imp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      eventType: 'impression',
      referralCode,
      productId: link.productId,
      creatorId: link.creatorId,
      timestamp: new Date().toISOString(),
      metadata,
    };

    affiliateEventsStore.push(event);
    return true;
  }

  /**
   * Record referral click event
   */
  public static recordClick(referralCode: string, metadata?: Record<string, any>): boolean {
    const link = referralLinksStore.get(referralCode);
    if (!link) return false;

    link.totalClicks += 1;

    const event: AffiliateEvent = {
      id: `evt_clk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      eventType: 'click',
      referralCode,
      productId: link.productId,
      creatorId: link.creatorId,
      timestamp: new Date().toISOString(),
      metadata,
    };

    affiliateEventsStore.push(event);
    return true;
  }

  /**
   * Record completed checkout conversion attributed to this referral code
   */
  public static recordConversion(params: {
    referralCode: string;
    orderId: string;
    orderGrossValue: number;
    metadata?: Record<string, any>;
  }): { success: boolean; commissionEarned: number; event?: AffiliateEvent } {
    const { referralCode, orderId, orderGrossValue, metadata } = params;
    const link = referralLinksStore.get(referralCode);
    if (!link) {
      return { success: false, commissionEarned: 0 };
    }

    const commissionEarned = Math.round(orderGrossValue * (link.commissionRatePct / 100) * 100) / 100;

    link.totalConversions += 1;
    link.grossMerchandiseValue += orderGrossValue;
    link.totalCommissionEarned += commissionEarned;

    const event: AffiliateEvent = {
      id: `evt_cnv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      eventType: 'conversion',
      referralCode,
      productId: link.productId,
      creatorId: link.creatorId,
      orderId,
      orderGrossValue,
      commissionEarned,
      timestamp: new Date().toISOString(),
      metadata,
    };

    affiliateEventsStore.push(event);
    return { success: true, commissionEarned, event };
  }

  /**
   * Get comprehensive creator affiliate dashboard metrics
   */
  public static getCreatorPerformance(creatorId: string = 'creator_studio_01'): CreatorAffiliatePerformance {
    const creatorLinks: ReferralLink[] = [];
    for (const link of referralLinksStore.values()) {
      if (link.creatorId === creatorId || creatorId === 'all') {
        creatorLinks.push(link);
      }
    }

    const totalImpressions = creatorLinks.reduce((acc, l) => acc + l.totalImpressions, 0);
    const totalClicks = creatorLinks.reduce((acc, l) => acc + l.totalClicks, 0);
    const totalConversions = creatorLinks.reduce((acc, l) => acc + l.totalConversions, 0);
    const grossMerchandiseValue = creatorLinks.reduce((acc, l) => acc + l.grossMerchandiseValue, 0);
    const totalCommissionEarned =
      Math.round(creatorLinks.reduce((acc, l) => acc + l.totalCommissionEarned, 0) * 100) / 100;

    const clickThroughRatePct =
      totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0;
    const conversionRatePct =
      totalClicks > 0 ? Math.round((totalConversions / totalClicks) * 10000) / 100 : 0;

    const recentEvents = affiliateEventsStore
      .filter((e) => e.creatorId === creatorId || creatorId === 'all')
      .slice(-20)
      .reverse();

    return {
      creatorId,
      totalImpressions,
      totalClicks,
      totalConversions,
      clickThroughRatePct,
      conversionRatePct,
      grossMerchandiseValue,
      totalCommissionEarned,
      pendingPayoutBalance: totalCommissionEarned,
      activeLinks: creatorLinks,
      recentEvents,
    };
  }

  /**
   * Resolve a referral code
   */
  public static getReferralLink(referralCode: string): ReferralLink | undefined {
    return referralLinksStore.get(referralCode);
  }
}

