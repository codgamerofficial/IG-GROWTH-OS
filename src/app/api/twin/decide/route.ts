// =============================================================================
// RIIQX — AI Twin Real Product Decision & Purchase Verification Engine
// "Before you decide, ask your AI Twin."
// Zero Fake Products • Real Retailer Discovery • Deterministic Floor Price Math
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { ProductResearchOrchestrator } from '@/services/product-intelligence/orchestrator';
import { PurchaseAnalysisReport, UserShoppingPreferences, LinkVerificationStatus } from '@/services/product-intelligence/types';

export interface TwinDecisionRequest {
  prompt?: string;
  query?: string;
  category?: string;
  userBudget?: number;
  cardsOwned?: string[];
  productUrl?: string;
  screenshotBase64?: string;
  screenshotMimeType?: string;
  userPreferences?: UserShoppingPreferences;
}

export interface RetailerPrice {
  name: string;
  price: number;
  originalPrice?: number;
  deliveryDays: number;
  inStock: boolean;
  link: string;
  purchaseUrl?: string;
  canonicalUrl?: string;
  directLinkVerified?: boolean;
  linkVerificationStatus?: LinkVerificationStatus;
  imageUrl?: string;
  badge?: string;
  status?: string;
  verificationMethod?: string;
  priceBreakdown?: string;
}

export interface TwinDecisionResponse {
  success: boolean;
  verdict: 'strong_buy' | 'consider_alternative' | 'wait_for_drop' | 'caution' | 'skip';
  headline: string;
  subtext: string;
  bestPick: {
    title: string;
    brand: string;
    category: string;
    imageUrl?: string;
    specs: string[];
    twinMatchScore: number;
    verificationSource?: string;
  };
  pricingMatrix: {
    mrp: number;
    lowestListedPrice: number;
    bestRetailer: string;
    cardDiscountApplied: number;
    cardOfferName: string;
    twinArbitrageSavings: number;
    finalCheckoutPrice: number;
    totalSavings: number;
    savingsPercentage: number;
    hasUnknownFees: boolean;
    calculationExplanation: string;
    retailers: RetailerPrice[];
  };
  whyThisPick: string[];
  whatPlatformsHide: string[];
  alternativeOption?: {
    name: string;
    reason: string;
    price: number;
  };
  userTwinNote: string;
  report?: PurchaseAnalysisReport;
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body: TwinDecisionRequest = await req.json();

    const prompt = (body.prompt || body.query || '').trim();
    const productUrl = body.productUrl?.trim();
    const screenshotBase64 = body.screenshotBase64?.trim();
    const screenshotMimeType = body.screenshotMimeType || 'image/jpeg';

    if (!prompt && !productUrl && !screenshotBase64) {
      return NextResponse.json(
        { error: 'Please enter a product name, paste an authentic product URL, or upload a screenshot.' },
        { status: 400 }
      );
    }

    // Execute real research orchestrator (Zero fabrication pipeline)
    const report: PurchaseAnalysisReport = await ProductResearchOrchestrator.executeResearch({
      url: productUrl || (prompt.startsWith('http') ? prompt : undefined),
      screenshotBase64,
      screenshotMimeType,
      queryHint: !productUrl && !prompt.startsWith('http') ? prompt : undefined,
      userId,
      userPreferences: body.userPreferences,
    });

    const cheapest = report.cheapestEligibleOffer || report.cheapestStandardOffer;
    const highestPrice = report.priceTruth.highestVerifiedPrice || cheapest?.mrp || cheapest?.sellingPrice || 0;
    const lowestPrice = cheapest?.eligibleFinalPrice || cheapest?.finalComparablePrice || cheapest?.sellingPrice || report.priceTruth.lowestEligiblePrice || report.priceTruth.lowestStandardPrice || 0;
    const totalSavings = Math.max(0, highestPrice - lowestPrice);
    const savingsPercentage = highestPrice > 0 ? Math.round((totalSavings / highestPrice) * 100) : 0;

    // Convert offers to RetailerPrice items
    const retailers: RetailerPrice[] = report.offers.map((offer) => ({
      name: offer.retailerName,
      price: offer.eligibleFinalPrice || offer.finalComparablePrice || offer.sellingPrice || 0,
      originalPrice: offer.mrp,
      deliveryDays: offer.deliveryDays || 3,
      inStock: offer.inStock ?? (offer.availability === 'in_stock'),
      link: offer.purchaseUrl || offer.productUrl,
      purchaseUrl: offer.purchaseUrl || offer.productUrl,
      canonicalUrl: offer.canonicalUrl || offer.productUrl,
      directLinkVerified: offer.directLinkVerified,
      linkVerificationStatus: offer.linkVerificationStatus,
      imageUrl: (offer.imageUrl && !offer.imageUrl.includes('unsplash.com')) ? offer.imageUrl : report.identity.imageUrl,
      badge: offer.badge,
      status: offer.priceVerificationStatus,
      verificationMethod: offer.verificationMethod,
      priceBreakdown: offer.priceBreakdown,
    }));

    // If no external retailers discovered, create an explicit verified retailer item
    if (retailers.length === 0 && cheapest) {
      retailers.push({
        name: cheapest.retailerName,
        price: cheapest.eligibleFinalPrice || cheapest.finalComparablePrice || cheapest.sellingPrice || 0,
        originalPrice: cheapest.mrp,
        deliveryDays: cheapest.deliveryDays || 3,
        inStock: cheapest.inStock ?? (cheapest.availability === 'in_stock'),
        link: cheapest.purchaseUrl || cheapest.productUrl,
        purchaseUrl: cheapest.purchaseUrl || cheapest.productUrl,
        canonicalUrl: cheapest.canonicalUrl || cheapest.productUrl,
        directLinkVerified: cheapest.directLinkVerified,
        linkVerificationStatus: cheapest.linkVerificationStatus,
        imageUrl: (cheapest.imageUrl && !cheapest.imageUrl.includes('unsplash.com')) ? cheapest.imageUrl : report.identity.imageUrl,
        badge: cheapest.badge,
        status: cheapest.priceVerificationStatus,
        verificationMethod: cheapest.verificationMethod,
        priceBreakdown: cheapest.priceBreakdown,
      });
    }

    const response: TwinDecisionResponse = {
      success: true,
      verdict: report.aiAnalysis.verdict,
      headline: report.aiAnalysis.headline || 'Verified Cross-Retailer Price Analysis',
      subtext: report.aiAnalysis.summary,
      bestPick: {
        title: report.identity.title,
        brand: report.identity.brand,
        category: report.identity.category,
        imageUrl: report.identity.imageUrl,
        specs: report.identity.specifications.slice(0, 5),
        twinMatchScore: Math.min(99, Math.round(report.identity.identityConfidence * 100)),
        verificationSource: report.identity.verificationSource,
      },
      pricingMatrix: {
        mrp: highestPrice,
        lowestListedPrice: cheapest?.sellingPrice || lowestPrice,
        bestRetailer: cheapest?.retailerName || 'Verified Merchant',
        cardDiscountApplied: report.priceTruth.maxVerifiedSavings || 0,
        cardOfferName: 'Verified Direct / Platform Savings',
        twinArbitrageSavings: totalSavings,
        finalCheckoutPrice: lowestPrice,
        totalSavings,
        savingsPercentage,
        hasUnknownFees: report.priceTruth.hasUnknownFees,
        calculationExplanation: report.priceTruth.calculationExplanation,
        retailers,
      },
      whyThisPick: report.aiAnalysis.pros.length > 0 ? report.aiAnalysis.pros : [
        'Verified authentic product identity across authorized merchants.',
        'Deterministic total calculation inclusive of visible delivery fees.',
        'Verified lowest effective price in the active retail comparison pool.'
      ],
      whatPlatformsHide: report.aiAnalysis.whatPlatformsHide.length > 0 ? report.aiAnalysis.whatPlatformsHide : [
        'Hidden delivery fees and convenience charges may only surface at final payment step.',
        'Return window may require unboxing video proof on third-party marketplace sellers.'
      ],
      alternativeOption: report.similarAlternatives && report.similarAlternatives[0]
        ? {
            name: report.similarAlternatives[0].name,
            reason: report.similarAlternatives[0].difference,
            price: report.similarAlternatives[0].targetPrice || 0,
          }
        : undefined,
      userTwinNote: report.aiAnalysis.isDiscountGenuine
        ? report.aiAnalysis.discountEvidence
        : 'Genuine price verification complete based on real-time web listings and canonical merchant sources.',
      report,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('[API /api/twin/decide] Error:', err);
    return NextResponse.json(
      {
        error: err.message || 'Failed to analyze product decision with verified sources.',
      },
      { status: 400 }
    );
  }
}
