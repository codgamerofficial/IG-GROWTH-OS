// =============================================================================
// RIIQX — Price Truth Calculator & Ranking Service
// Deterministic Arithmetic • No Zero-Shipping Assumptions • Lowest-Price First
// =============================================================================

import { RetailerOffer } from './types';

export class PriceCalculatorService {
  /**
   * Computes final comparable price and sorts offers strictly by lowest verified cost
   */
  public static computeAndRankOffers(offers: RetailerOffer[]): {
    rankedOffers: RetailerOffer[];
    cheapestVerifiedOffer?: RetailerOffer;
    lowestVerifiedPrice?: number;
    highestVerifiedPrice?: number;
    maxVerifiedSavings?: number;
    hasUnknownFees: boolean;
    calculationExplanation: string;
  } {
    let hasUnknownFees = false;

    // 1. Compute true final comparable price
    const normalized: RetailerOffer[] = offers.map((offer) => {
      let finalPrice: number | undefined;

      if (typeof offer.sellingPrice === 'number' && offer.sellingPrice > 0) {
        const delivery = offer.deliveryCharge ?? 0;
        const fees = offer.mandatoryFees ?? 0;
        finalPrice = offer.sellingPrice + delivery + fees;
      }

      if (offer.deliveryStatus === 'unknown') {
        hasUnknownFees = true;
      }

      return {
        ...offer,
        finalComparablePrice: finalPrice,
      };
    });

    // 2. Separate into verified price vs price-pending
    const withPrice = normalized.filter((o) => typeof o.finalComparablePrice === 'number' && o.finalComparablePrice > 0);
    const withoutPrice = normalized.filter((o) => typeof o.finalComparablePrice !== 'number');

    // Sort withPrice by lowest final price
    withPrice.sort((a, b) => (a.finalComparablePrice || 0) - (b.finalComparablePrice || 0));

    // Mark the cheapest verified offer
    if (withPrice.length > 0) {
      withPrice[0].isCheapestVerified = true;
      withPrice[0].badge = 'Best Verified Price';
    }

    const rankedOffers = [...withPrice, ...withoutPrice];

    const lowestPrice = withPrice[0]?.finalComparablePrice;
    const highestPrice = withPrice.length > 1 ? withPrice[withPrice.length - 1]?.finalComparablePrice : lowestPrice;
    const maxSavings = lowestPrice && highestPrice && highestPrice > lowestPrice ? highestPrice - lowestPrice : 0;

    let explanation = 'Prices ranked from lowest to highest verified final cost.';
    if (hasUnknownFees) {
      explanation += ' Note: Retailer delivery policies may vary by pincode. Pincode-specific fees marked as pending.';
    }

    return {
      rankedOffers,
      cheapestVerifiedOffer: withPrice[0],
      lowestVerifiedPrice: lowestPrice,
      highestVerifiedPrice: highestPrice,
      maxVerifiedSavings: maxSavings,
      hasUnknownFees,
      calculationExplanation: explanation,
    };
  }
}

