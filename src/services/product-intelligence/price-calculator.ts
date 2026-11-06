// =============================================================================
// RIIQX — True Final Payable Price Calculator & 3-Tier Ranking Engine
// "Never confuse the lowest advertised price with the lowest real payable price."
// Deterministic Calculations • Scenarios A-F • Stacking Rules • Caps & Cash Flow Integrity
// =============================================================================

import {
  RetailerOffer,
  PromotionalOffer,
  UserShoppingPreferences,
  PriceCalculationScenario,
  PriceRankings,
} from './types';
import { OfferDiscoveryService } from './offer-discovery';

export class PriceCalculatorService {
  /**
   * Computes the line-by-line price math for an offer given a specific set of applicable promotions
   */
  public static calculateScenario(
    sellingPrice: number,
    deliveryCharge: number,
    mandatoryFees: number,
    offersToApply: PromotionalOffer[],
    userGiftCardBalance = 0,
    scenarioType: PriceCalculationScenario['scenarioName'] = 'standard',
    scenarioLabel = 'Standard Payable Price'
  ): PriceCalculationScenario {
    const evidence: string[] = [];
    const standardPayablePrice = sellingPrice + deliveryCharge + mandatoryFees;

    evidence.push(`Base Selling Price: ₹${sellingPrice.toLocaleString('en-IN')}`);
    if (deliveryCharge > 0) {
      evidence.push(`Mandatory Delivery Charge: +₹${deliveryCharge.toLocaleString('en-IN')}`);
    } else {
      evidence.push('Delivery Charge: Free / Included');
    }
    if (mandatoryFees > 0) {
      evidence.push(`Mandatory Platform / Handling Fees: +₹${mandatoryFees.toLocaleString('en-IN')}`);
    }

    let instantDiscount = 0;
    let bankDiscount = 0;
    let couponDiscount = 0;
    let expectedCashback = 0;
    const appliedOffers: PromotionalOffer[] = [];

    // Separate bank offers from coupons and cashbacks
    const bankOffers = offersToApply.filter((o) => o.offerType === 'bank_card');
    const couponOffers = offersToApply.filter((o) => o.offerType === 'store_coupon');
    const paymentOffers = offersToApply.filter((o) => o.offerType === 'payment_method');
    const cashbackOffers = offersToApply.filter((o) => o.isCashback);

    // 1. Apply Store Coupon first if applicable
    if (couponOffers.length > 0) {
      const coupon = couponOffers[0]; // Apply best coupon
      if (sellingPrice >= coupon.minTransaction && coupon.verificationStatus !== 'expired') {
        let disc = 0;
        if (coupon.discountType === 'percentage') {
          disc = Math.round((sellingPrice * coupon.discountValue) / 100);
          if (coupon.maxDiscountCap && disc > coupon.maxDiscountCap) {
            disc = coupon.maxDiscountCap;
          }
        } else {
          disc = coupon.discountValue;
        }
        couponDiscount = disc;
        appliedOffers.push(coupon);
        evidence.push(
          `Coupon Code [${coupon.couponCode || coupon.offerName}]: -₹${disc.toLocaleString('en-IN')} (Min order: ₹${coupon.minTransaction})`
        );
      } else if (coupon.verificationStatus === 'expired') {
        evidence.push(`Coupon [${coupon.couponCode}]: Expired. Excluded from checkout reduction.`);
      }
    }

    // 2. Apply Bank Card Instant Discount
    // Rule: Bank discounts DO NOT stack with other bank discounts on the same payment
    if (bankOffers.length > 0) {
      const bestBank = bankOffers[0];
      const subtotalForBank = Math.max(0, sellingPrice - couponDiscount);

      if (subtotalForBank >= bestBank.minTransaction && bestBank.verificationStatus !== 'expired') {
        let bDisc = 0;
        if (bestBank.discountType === 'percentage') {
          bDisc = Math.round((subtotalForBank * bestBank.discountValue) / 100);
          if (bestBank.maxDiscountCap && bDisc > bestBank.maxDiscountCap) {
            bDisc = bestBank.maxDiscountCap;
          }
        } else {
          bDisc = bestBank.discountValue;
        }
        bankDiscount = bDisc;
        appliedOffers.push(bestBank);
        evidence.push(
          `Bank Instant Discount [${bestBank.offerName}]: -₹${bDisc.toLocaleString('en-IN')} (Max Cap: ₹${bestBank.maxDiscountCap || bDisc})`
        );
      } else if (subtotalForBank < bestBank.minTransaction) {
        evidence.push(
          `Bank Offer [${bestBank.offerName}] Not Applicable: Order amount (₹${subtotalForBank}) below ₹${bestBank.minTransaction} threshold.`
        );
      }
    }

    // 3. Payment Method (e.g. UPI flat discount)
    if (paymentOffers.length > 0 && bankDiscount === 0) {
      const payOffer = paymentOffers[0];
      if (sellingPrice >= payOffer.minTransaction) {
        instantDiscount += payOffer.discountValue;
        appliedOffers.push(payOffer);
        evidence.push(`Payment Method Discount [${payOffer.offerName}]: -₹${payOffer.discountValue}`);
      }
    }

    // 4. Calculate Final Cash Payable at Checkout
    const totalInstantReductions = couponDiscount + bankDiscount + instantDiscount;
    const checkoutPayableBeforeGiftCard = Math.max(0, standardPayablePrice - totalInstantReductions);

    // 5. Gift Card Stored Value Application (Scenario E)
    // Rule: Stored gift card value reduces out-of-pocket cash payable, but is NOT a merchant discount on market price
    let appliedGiftCardValue = 0;
    if (userGiftCardBalance > 0) {
      appliedGiftCardValue = Math.min(checkoutPayableBeforeGiftCard, userGiftCardBalance);
      evidence.push(
        `Owned Store Gift Card Balance Applied: -₹${appliedGiftCardValue.toLocaleString('en-IN')} (Stored value consumed; not a seller discount)`
      );
    }

    const finalCashPayable = checkoutPayableBeforeGiftCard - appliedGiftCardValue;

    // 6. Cashback Calculation (Scenario F)
    // Rule: Cashback is NEVER subtracted from the immediate checkout invoice price
    if (cashbackOffers.length > 0) {
      const cb = cashbackOffers[0];
      if (cb.verificationStatus !== 'expired') {
        let calcBase = checkoutPayableBeforeGiftCard;
        let cbAmount = 0;
        if (cb.discountType === 'percentage') {
          cbAmount = Math.round((calcBase * cb.discountValue) / 100);
          if (cb.maxDiscountCap && cbAmount > cb.maxDiscountCap) {
            cbAmount = cb.maxDiscountCap;
          }
        } else {
          cbAmount = cb.discountValue;
        }
        expectedCashback = cbAmount;
        appliedOffers.push(cb);
        evidence.push(
          `Expected Post-Purchase Cashback [${cb.offerName}]: ₹${cbAmount.toLocaleString('en-IN')} (Credited post-billing; NOT deducted from checkout cash)`
        );
      }
    }

    const effectiveCostAfterCashback = Math.max(0, checkoutPayableBeforeGiftCard - expectedCashback);

    return {
      scenarioName: scenarioType,
      scenarioLabel,
      sellingPrice,
      deliveryCharge,
      mandatoryFees,
      standardPayablePrice,
      instantDiscount,
      bankDiscount,
      couponDiscount,
      appliedGiftCardValue,
      finalCashPayable,
      expectedCashback,
      effectiveCostAfterCashback,
      appliedOffers,
      isEstimatedRequiringCheckout: deliveryCharge === 0 && sellingPrice < 500, // Common Indian threshold for delivery fees
      calculationEvidence: evidence,
    };
  }

  /**
   * Computes all scenarios and ranks retailer offers across the three required dimensions:
   * 1. Lowest Verified Standard Price
   * 2. Lowest Verified Eligible Final Price (user preferences)
   * 3. Lowest Conditional Price (all available offers)
   */
  public static computeAndRankOffers(
    offers: RetailerOffer[],
    userPreferences?: UserShoppingPreferences
  ): {
    rankedOffers: RetailerOffer[];
    rankings: PriceRankings;
    cheapestStandardOffer?: RetailerOffer;
    cheapestEligibleOffer?: RetailerOffer;
    cheapestConditionalOffer?: RetailerOffer;
    availablePromotionalOffers: PromotionalOffer[];
    lowestStandardPrice?: number;
    lowestEligiblePrice?: number;
    lowestConditionalPrice?: number;
    maxVerifiedSavings?: number;
    hasUnknownFees: boolean;
    calculationExplanation: string;
  } {
    let hasUnknownFees = false;
    const allDiscoveredPromos: PromotionalOffer[] = [];

    // 1. Process each retailer offer and compute pricing scenarios
    const processedOffers: RetailerOffer[] = offers.map((offer) => {
      const selling = typeof offer.sellingPrice === 'number' && offer.sellingPrice > 0 ? offer.sellingPrice : 0;
      const delivery = offer.deliveryCharge ?? 0;
      const fees = offer.mandatoryFees ?? 0;

      if (offer.deliveryStatus === 'unknown') {
        hasUnknownFees = true;
      }

      if (selling === 0) {
        return {
          ...offer,
          finalComparablePrice: undefined,
          eligibleFinalPrice: undefined,
          conditionalBestPrice: undefined,
        };
      }

      // Discover promos for this retailer
      const retailerPromos = OfferDiscoveryService.getOffersForRetailer(offer.retailerDomain, selling);
      allDiscoveredPromos.push(...retailerPromos);

      // Scenario A: Standard Purchase
      const standardScenario = this.calculateScenario(
        selling,
        delivery,
        fees,
        [],
        0,
        'standard',
        'Standard Payable Price'
      );

      // Scenario B & C & D: User Eligible Final Price
      const { eligibleOffers, conditionalOffers } = OfferDiscoveryService.filterOffersByUserPreferences(
        retailerPromos,
        userPreferences
      );

      // User owned gift card balance for this retailer
      const userGc = userPreferences?.giftCardBalances?.find(
        (g) => g.retailer.toLowerCase().includes(offer.retailerDomain.toLowerCase()) ||
               offer.retailerDomain.toLowerCase().includes(g.retailer.toLowerCase())
      );
      const gcBalance = userGc?.balance || 0;

      const eligibleScenario = this.calculateScenario(
        selling,
        delivery,
        fees,
        eligibleOffers,
        gcBalance,
        'eligible_instant',
        'My Eligible Final Price'
      );

      // Best Conditional Price (Best possible across all bank card & coupon stacking)
      const bestConditionalScenario = this.calculateScenario(
        selling,
        delivery,
        fees,
        retailerPromos.filter((p) => p.verificationStatus !== 'expired'),
        gcBalance,
        'coupon_and_bank',
        'Lowest Conditional Price'
      );

      return {
        ...offer,
        finalComparablePrice: standardScenario.standardPayablePrice,
        eligibleFinalPrice: eligibleScenario.finalCashPayable,
        conditionalBestPrice: bestConditionalScenario.finalCashPayable,
        pricingScenarios: {
          standard: standardScenario,
          eligibleFinal: eligibleScenario,
          bestConditional: bestConditionalScenario,
        },
      };
    });

    // 2. Separate into priced vs pending
    const pricedOffers = processedOffers.filter(
      (o) => typeof o.finalComparablePrice === 'number' && o.finalComparablePrice > 0
    );
    const unpricedOffers = processedOffers.filter(
      (o) => typeof o.finalComparablePrice !== 'number'
    );

    // 3. Create the 3 Distinct Rankings:

    // Ranking 1: Lowest Verified Standard Price
    const rankingStandard = [...pricedOffers].sort(
      (a, b) => (a.finalComparablePrice || 0) - (b.finalComparablePrice || 0)
    );

    // Ranking 2: Lowest Verified Eligible Final Price (user preferences)
    const rankingEligible = [...pricedOffers].sort(
      (a, b) => (a.eligibleFinalPrice || a.finalComparablePrice || 0) - (b.eligibleFinalPrice || b.finalComparablePrice || 0)
    );

    // Ranking 3: Lowest Conditional Price
    const rankingConditional = [...pricedOffers].sort(
      (a, b) => (a.conditionalBestPrice || a.finalComparablePrice || 0) - (b.conditionalBestPrice || b.finalComparablePrice || 0)
    );

    // Mark the winners in each ranking
    if (rankingStandard.length > 0) {
      rankingStandard[0].isCheapestVerified = true;
      rankingStandard[0].badge = 'Lowest Standard Price';
    }

    const cheapestStandardOffer = rankingStandard[0];
    const cheapestEligibleOffer = rankingEligible[0];
    const cheapestConditionalOffer = rankingConditional[0];

    const lowestStandardPrice = cheapestStandardOffer?.finalComparablePrice;
    const lowestEligiblePrice = cheapestEligibleOffer?.eligibleFinalPrice || lowestStandardPrice;
    const lowestConditionalPrice = cheapestConditionalOffer?.conditionalBestPrice || lowestStandardPrice;

    // Calculate max verified savings against the highest standard price
    const highestStandardPrice =
      rankingStandard.length > 1
        ? rankingStandard[rankingStandard.length - 1]?.finalComparablePrice
        : lowestStandardPrice;
    const maxVerifiedSavings =
      lowestStandardPrice && highestStandardPrice && highestStandardPrice > lowestEligiblePrice!
        ? highestStandardPrice - lowestEligiblePrice!
        : 0;

    let explanation = 'Prices ranked deterministically from lowest to highest verified final cost.';
    if (hasUnknownFees) {
      explanation += ' Note: Retailer delivery policies may vary by pincode. Pincode-specific fees marked as pending.';
    }

    // Deduplicate available promotional offers
    const seenOfferIds = new Set<string>();
    const uniquePromos: PromotionalOffer[] = [];
    for (const p of allDiscoveredPromos) {
      if (!seenOfferIds.has(p.id)) {
        seenOfferIds.add(p.id);
        uniquePromos.push(p);
      }
    }

    return {
      rankedOffers: [...rankingEligible, ...unpricedOffers],
      rankings: {
        rankingStandard: [...rankingStandard, ...unpricedOffers],
        rankingEligible: [...rankingEligible, ...unpricedOffers],
        rankingConditional: [...rankingConditional, ...unpricedOffers],
      },
      cheapestStandardOffer,
      cheapestEligibleOffer,
      cheapestConditionalOffer,
      availablePromotionalOffers: uniquePromos,
      lowestStandardPrice,
      lowestEligiblePrice,
      lowestConditionalPrice,
      maxVerifiedSavings,
      hasUnknownFees,
      calculationExplanation: explanation,
    };
  }
}
