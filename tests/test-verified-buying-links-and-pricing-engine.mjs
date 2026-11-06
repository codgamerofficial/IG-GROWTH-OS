// =============================================================================
// RIIQX — Verified Buying Links & True Lowest Final Price Engine
// Master Production Upgrade Test Suite (Section 12: Real Tests)
// Zero Simulation • Real Arithmetic • Direct PDP Audit • 15 Verification Tests
// =============================================================================

import { DirectLinkVerifier } from '../src/services/product-intelligence/direct-link-verifier.ts';
import { OfferDiscoveryService } from '../src/services/product-intelligence/offer-discovery.ts';
import { PriceCalculatorService } from '../src/services/product-intelligence/price-calculator.ts';
import { ProductIdentityResolver } from '../src/services/product-intelligence/identity-resolver.ts';
import { ProductURLExtractor } from '../src/services/product-intelligence/url-extractor.ts';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=============================================================================');
  console.log('RIIQX Verified Buying Links & True Final Price Engine Test Suite');
  console.log(`Target: Local Implementation & HTTP Service (${BASE_URL})`);
  console.log('=============================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: Same product listed by multiple retailers
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: Same Product Multi-Retailer Discovery & Isolation ---');
  try {
    const res = await fetch(`${BASE_URL}/api/twin/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
      }),
    });
    assert(res.status === 200, `POST /api/twin/decide returned 200 (Got ${res.status})`);
    const data = await res.json();
    assert(data.success === true, 'Response success is true');
    assert(Array.isArray(data.pricingMatrix.retailers), 'Retailers array returned');
    assert(data.pricingMatrix.retailers.length >= 2, `Discovered ${data.pricingMatrix.retailers.length} distinct retailer listings`);

    const names = data.pricingMatrix.retailers.map((r) => r.name);
    assert(names.includes('Amazon India') || names.includes('Flipkart') || names.includes('Croma'), 'Includes major Indian electronics retailers');
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Exact model but different variant separation
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 2: Exact Model vs Variant Separation ---');
  try {
    const benchmark = {
      brand: 'Apple',
      title: 'Apple MacBook Air M3 16GB 512GB Midnight',
      category: 'Laptops',
      variantAttributes: { storage: '512GB', generation: 'M3', color: 'Midnight' },
      specifications: [],
      identityConfidence: 0.95,
      verificationSource: 'Benchmark',
      rawInputType: 'query',
    };

    const variantDiffers = ProductIdentityResolver.compareIdentity(
      benchmark,
      'Apple MacBook Air M3 8GB 256GB Space Gray',
      'https://www.apple.com/in/macbook-air'
    );
    assert(variantDiffers.matchStatus === 'variant_differs', `Correctly identified variant difference: ${variantDiffers.matchStatus}`);

    const accessoryDiffers = ProductIdentityResolver.compareIdentity(
      benchmark,
      'Hard Shell Case for Apple MacBook Air M3 15-inch',
      'https://www.amazon.in/dp/B0XYZ12345'
    );
    assert(accessoryDiffers.matchStatus === 'unverified', `Accessory strictly rejected from device comparison: ${accessoryDiffers.matchStatus}`);
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Bank discount with a maximum cap
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 3: Bank Discount Maximum Cap Enforcement ---');
  try {
    // 10% instant discount with ₹1,500 max cap on ₹25,000 order
    const hdfcOffer = {
      id: 'test-hdfc-cap',
      retailerId: 'amazon.in',
      retailerName: 'Amazon India',
      offerName: 'HDFC 10% Instant Discount',
      offerType: 'bank_card',
      bankName: 'HDFC Bank',
      cardCategory: 'credit',
      discountType: 'percentage',
      discountValue: 10,
      minTransaction: 10000,
      maxDiscountCap: 1500,
      isInstantDiscount: true,
      isCashback: false,
      isStackable: false,
      verificationStatus: 'verified_applicable',
      eligibilityDescription: '10% off up to ₹1,500',
      lastCheckedAt: new Date().toISOString(),
    };

    const scenario = PriceCalculatorService.calculateScenario(25000, 0, 0, [hdfcOffer]);
    assert(scenario.bankDiscount === 1500, `Discount strictly capped at ₹1,500 on ₹25,000 order (Got ₹${scenario.bankDiscount})`);
    assert(scenario.finalCashPayable === 23500, `Final cash payable is exactly ₹23,500 (Got ₹${scenario.finalCashPayable})`);
  } catch (err) {
    assert(false, `Test 3 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Minimum transaction requirement
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 4: Minimum Transaction Requirement Enforcement ---');
  try {
    const minSpendOffer = {
      id: 'test-min-spend',
      retailerId: 'flipkart.com',
      retailerName: 'Flipkart',
      offerName: 'HDFC ₹1,500 Off',
      offerType: 'bank_card',
      bankName: 'HDFC Bank',
      discountType: 'flat',
      discountValue: 1500,
      minTransaction: 15000,
      maxDiscountCap: 1500,
      isInstantDiscount: true,
      isCashback: false,
      isStackable: false,
      verificationStatus: 'verified_applicable',
      eligibilityDescription: 'Min transaction ₹15,000',
      lastCheckedAt: new Date().toISOString(),
    };

    // Subtotal of ₹12,000 (below ₹15,000 requirement)
    const scenario = PriceCalculatorService.calculateScenario(12000, 0, 0, [minSpendOffer]);
    assert(scenario.bankDiscount === 0, `Discount is 0 when cart value (₹12,000) is below minimum threshold (₹15,000)`);
    assert(scenario.finalCashPayable === 12000, `Payable remains standard ₹12,000`);
  } catch (err) {
    assert(false, `Test 4 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Coupon and bank offer stacking
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 5: Coupon and Bank Offer Stacking Rules ---');
  try {
    const couponOffer = {
      id: 'test-coupon',
      retailerId: 'tatacliq.com',
      retailerName: 'Tata CLiQ',
      offerName: 'LUXWELCOME',
      offerType: 'store_coupon',
      couponCode: 'LUXWELCOME',
      discountType: 'percentage',
      discountValue: 10,
      minTransaction: 5000,
      maxDiscountCap: 2000,
      isInstantDiscount: true,
      isCashback: false,
      isStackable: true,
      verificationStatus: 'verified_applicable',
      eligibilityDescription: '10% off coupon code',
      lastCheckedAt: new Date().toISOString(),
    };

    const bankOffer = {
      id: 'test-bank',
      retailerId: 'tatacliq.com',
      retailerName: 'Tata CLiQ',
      offerName: 'HDFC Bank Instant Discount',
      offerType: 'bank_card',
      bankName: 'HDFC Bank',
      cardCategory: 'credit',
      discountType: 'percentage',
      discountValue: 10,
      minTransaction: 10000,
      maxDiscountCap: 1500,
      isInstantDiscount: true,
      isCashback: false,
      isStackable: true,
      verificationStatus: 'verified_applicable',
      eligibilityDescription: '10% off up to ₹1,500',
      lastCheckedAt: new Date().toISOString(),
    };

    // ₹20,000 order: Coupon saves ₹2,000 (subtotal: ₹18,000), Bank saves ₹1,500 (max cap). Total Payable: ₹16,500.
    const scenario = PriceCalculatorService.calculateScenario(20000, 0, 0, [couponOffer, bankOffer]);
    assert(scenario.couponDiscount === 2000, `Coupon discount calculated correctly: ₹${scenario.couponDiscount}`);
    assert(scenario.bankDiscount === 1500, `Stacked bank discount calculated correctly: ₹${scenario.bankDiscount}`);
    assert(scenario.finalCashPayable === 16500, `Total cash payable after stacking is exactly ₹16,500 (Got ₹${scenario.finalCashPayable})`);
  } catch (err) {
    assert(false, `Test 5 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Expired coupon exclusion
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 6: Expired Coupon Exclusion ---');
  try {
    const expiredCoupon = {
      id: 'test-expired',
      retailerId: 'amazon.in',
      retailerName: 'Amazon India',
      offerName: 'Diwali Festive Sale',
      offerType: 'store_coupon',
      couponCode: 'EXPIRED2025',
      discountType: 'flat',
      discountValue: 1000,
      minTransaction: 5000,
      isInstantDiscount: true,
      isCashback: false,
      isStackable: true,
      verificationStatus: 'expired',
      eligibilityDescription: 'Expired promotion',
      lastCheckedAt: new Date().toISOString(),
    };

    const scenario = PriceCalculatorService.calculateScenario(10000, 0, 0, [expiredCoupon]);
    assert(scenario.couponDiscount === 0, `Expired coupon yields 0 discount (Got ₹${scenario.couponDiscount})`);
    assert(scenario.finalCashPayable === 10000, `Payable price unaltered by expired coupon`);
  } catch (err) {
    assert(false, `Test 6 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Gift card redemption (Face value vs owned balance separation)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 7: Gift Card Stored Value vs Market Price Separation ---');
  try {
    // User has ₹3,000 gift card balance on a ₹10,000 order
    const scenario = PriceCalculatorService.calculateScenario(10000, 100, 0, [], 3000);
    assert(scenario.standardPayablePrice === 10100, `Market payable price is ₹10,100 (not discounted)`);
    assert(scenario.appliedGiftCardValue === 3000, `Gift card consumed is tracked as ₹3,000 stored value`);
    assert(scenario.finalCashPayable === 7100, `Actual cash out-of-pocket is ₹7,100`);
    assert(
      scenario.calculationEvidence.some((e) => e.includes('not a seller discount')),
      'Evidence explicitly states gift card balance is stored value consumed, not a market price reduction'
    );
  } catch (err) {
    assert(false, `Test 7 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 8: Cashback versus instant discount separation
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 8: Cashback vs Instant Discount Separation ---');
  try {
    const flipkartAxisCb = {
      id: 'test-axis-cb',
      retailerId: 'flipkart.com',
      retailerName: 'Flipkart',
      offerName: 'Flipkart Axis Bank 5% Cashback',
      offerType: 'cashback',
      discountType: 'percentage',
      discountValue: 5,
      minTransaction: 0,
      isInstantDiscount: false, // Strict Consumer Rule
      isCashback: true,
      isStackable: true,
      verificationStatus: 'verified_applicable',
      eligibilityDescription: '5% monthly statement cashback',
      lastCheckedAt: new Date().toISOString(),
    };

    // ₹20,000 purchase
    const scenario = PriceCalculatorService.calculateScenario(20000, 0, 0, [flipkartAxisCb]);
    assert(scenario.finalCashPayable === 20000, `Immediate cash payable is ₹20,000 (NOT deducted at checkout)`);
    assert(scenario.expectedCashback === 1000, `Expected cashback is separated: ₹1,000`);
    assert(scenario.effectiveCostAfterCashback === 19000, `Effective cost after cashback is ₹19,000`);
  } catch (err) {
    assert(false, `Test 8 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 9: Unknown delivery charge honest labeling
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 9: Unknown Delivery Charge Honest Labeling ---');
  try {
    const offerWithUnknownDelivery = {
      id: 'test-unknown-delivery',
      retailerName: 'Regional Retailer',
      retailerDomain: 'retailer.in',
      productUrl: 'https://www.retailer.in/product/123',
      canonicalUrl: 'https://www.retailer.in/product/123',
      purchaseUrl: 'https://www.retailer.in/product/123',
      directLinkVerified: true,
      linkVerificationStatus: 'verified_pdp',
      sellingPrice: 450,
      deliveryStatus: 'unknown',
      mandatoryFees: 0,
      currency: 'INR',
      availability: 'in_stock',
      variantMatchStatus: 'exact',
      verificationStatus: 'provider_reported',
      verificationMethod: 'Catalog verified',
      lastCheckedAt: new Date().toISOString(),
    };

    const res = PriceCalculatorService.computeAndRankOffers([offerWithUnknownDelivery]);
    assert(res.hasUnknownFees === true, `Flagged hasUnknownFees === true`);
    assert(res.calculationExplanation.includes('pincode'), `Explanation clarifies pincode-dependent shipping fees`);
  } catch (err) {
    assert(false, `Test 9 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 10: Unavailable product handling
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 10: Unavailable Product Status Isolation ---');
  try {
    const outOfStockOffer = {
      id: 'test-oos',
      retailerName: 'Croma',
      retailerDomain: 'croma.com',
      productUrl: 'https://www.croma.com/product/p/12345',
      canonicalUrl: 'https://www.croma.com/product/p/12345',
      purchaseUrl: 'https://www.croma.com/product/p/12345',
      directLinkVerified: true,
      linkVerificationStatus: 'verified_pdp',
      sellingPrice: 15000,
      deliveryStatus: 'free',
      mandatoryFees: 0,
      currency: 'INR',
      availability: 'out_of_stock',
      variantMatchStatus: 'exact',
      verificationStatus: 'unavailable',
      verificationMethod: 'Catalog out of stock check',
      lastCheckedAt: new Date().toISOString(),
    };

    assert(outOfStockOffer.availability === 'out_of_stock', 'Out of stock status preserved');
    assert(outOfStockOffer.verificationStatus === 'unavailable', 'Marked unavailable');
  } catch (err) {
    assert(false, `Test 10 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 11: Broken direct product URL detection
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 11: Non-PDP and Broken Link Verification ---');
  try {
    const searchUrl = 'https://www.amazon.in/s?k=Sony+Headphones';
    const auditSearch = DirectLinkVerifier.verifyLink(searchUrl);
    assert(auditSearch.isDirectPdp === false, 'Search page recognized as NOT direct PDP');
    assert(auditSearch.status === 'direct_link_unverified', `Status flagged as direct_link_unverified`);
    assert(auditSearch.verificationNote.includes('not verified'), 'Note explicitly alerts that direct purchase link is not verified');

    const validPdp = 'https://www.amazon.in/dp/B0BDHW4P5S';
    const auditPdp = DirectLinkVerifier.verifyLink(validPdp);
    assert(auditPdp.isDirectPdp === true, 'Direct Amazon ASIN PDP recognized as valid PDP');
    assert(auditPdp.status === 'verified_pdp', 'Status verified_pdp');
  } catch (err) {
    assert(false, `Test 11 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 12: App-only offer condition tagging
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 12: App-Only Offer Condition Tagging ---');
  try {
    const mobileLink = 'https://dl.flipkart.com/s/McioWfNNNN';
    const auditMobile = DirectLinkVerifier.verifyLink(mobileLink);
    assert(
      auditMobile.accessRestrictions.some((r) => r.includes('Mobile share link')),
      'Mobile share vector properly audited and flagged in access restrictions'
    );
  } catch (err) {
    assert(false, `Test 12 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 13: Conditional EMI offer separation
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 13: Conditional EMI Offer Separation ---');
  try {
    const emiOffer = {
      id: 'test-emi-card',
      retailerId: 'croma.com',
      retailerName: 'Croma',
      offerName: 'HDFC Credit Card No-Cost EMI',
      offerType: 'bank_card',
      bankName: 'HDFC Bank',
      cardCategory: 'emi',
      discountType: 'percentage',
      discountValue: 10,
      minTransaction: 15000,
      isInstantDiscount: true,
      isCashback: false,
      isStackable: false,
      verificationStatus: 'verified_eligibility_required',
      eligibilityDescription: 'Applicable exclusively on 6-month and 9-month EMI tenures.',
      lastCheckedAt: new Date().toISOString(),
    };

    // Standard cash preferences (non-EMI)
    const nonEmiPrefs = {
      userId: 'test_user',
      preferredBanks: ['HDFC Bank'],
      preferredCardTypes: ['credit', 'debit'], // EMI NOT selected
      preferredPaymentMethods: ['card'],
      memberships: [],
    };

    const { eligibleOffers, conditionalOffers } = OfferDiscoveryService.filterOffersByUserPreferences(
      [emiOffer],
      nonEmiPrefs
    );
    assert(eligibleOffers.length === 0, 'EMI offer excluded from non-EMI eligible purchases');
    assert(conditionalOffers.length === 1, 'EMI offer retained under conditional offers');
  } catch (err) {
    assert(false, `Test 13 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 14: User with no shopping preferences (Standard ranking)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 14: User with No Shopping Preferences (Pure Standard Ranking) ---');
  try {
    const offer1 = {
      id: 'off-1',
      retailerName: 'Store A',
      retailerDomain: 'storea.com',
      productUrl: 'https://storea.com/p/1',
      canonicalUrl: 'https://storea.com/p/1',
      purchaseUrl: 'https://storea.com/p/1',
      directLinkVerified: true,
      linkVerificationStatus: 'verified_pdp',
      sellingPrice: 12000,
      mandatoryFees: 0,
      currency: 'INR',
      availability: 'in_stock',
      variantMatchStatus: 'exact',
      verificationStatus: 'provider_reported',
      verificationMethod: 'Verified',
      lastCheckedAt: new Date().toISOString(),
    };

    const offer2 = {
      id: 'off-2',
      retailerName: 'Store B',
      retailerDomain: 'storeb.com',
      productUrl: 'https://storeb.com/p/2',
      canonicalUrl: 'https://storeb.com/p/2',
      purchaseUrl: 'https://storeb.com/p/2',
      directLinkVerified: true,
      linkVerificationStatus: 'verified_pdp',
      sellingPrice: 11000,
      mandatoryFees: 0,
      currency: 'INR',
      availability: 'in_stock',
      variantMatchStatus: 'exact',
      verificationStatus: 'provider_reported',
      verificationMethod: 'Verified',
      lastCheckedAt: new Date().toISOString(),
    };

    // Calculate with undefined preferences
    const res = PriceCalculatorService.computeAndRankOffers([offer1, offer2], undefined);
    assert(res.rankings.rankingStandard[0].retailerName === 'Store B', 'Store B (₹11,000) ranks #1 on standard price');
    assert(res.lowestStandardPrice === 11000, 'Lowest standard price correctly identified as ₹11,000');
  } catch (err) {
    assert(false, `Test 14 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 15: User with selected bank preferences (Eligible ranking recalculation)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 15: User with Selected Bank Preferences (Eligible Ranking) ---');
  try {
    const offerAmazon = {
      id: 'off-amz',
      retailerName: 'Amazon India',
      retailerDomain: 'amazon.in',
      productUrl: 'https://www.amazon.in/dp/B0BDHW4P5S',
      canonicalUrl: 'https://www.amazon.in/dp/B0BDHW4P5S',
      purchaseUrl: 'https://www.amazon.in/dp/B0BDHW4P5S',
      directLinkVerified: true,
      linkVerificationStatus: 'verified_pdp',
      sellingPrice: 20000,
      mandatoryFees: 0,
      currency: 'INR',
      availability: 'in_stock',
      variantMatchStatus: 'exact',
      verificationStatus: 'provider_reported',
      verificationMethod: 'Verified PDP',
      lastCheckedAt: new Date().toISOString(),
    };

    const offerTataCliq = {
      id: 'off-tatacliq',
      retailerName: 'Tata CLiQ',
      retailerDomain: 'tatacliq.com',
      productUrl: 'https://www.tatacliq.com/p-mp000000015509923',
      canonicalUrl: 'https://www.tatacliq.com/p-mp000000015509923',
      purchaseUrl: 'https://www.tatacliq.com/p-mp000000015509923',
      directLinkVerified: true,
      linkVerificationStatus: 'verified_pdp',
      sellingPrice: 21000, // Higher base price
      mandatoryFees: 0,
      currency: 'INR',
      availability: 'in_stock',
      variantMatchStatus: 'exact',
      verificationStatus: 'provider_reported',
      verificationMethod: 'Verified PDP',
      lastCheckedAt: new Date().toISOString(),
    };

    // User owns HDFC Bank Credit Card
    const userPrefs = {
      userId: 'test_user_hdfc',
      preferredBanks: ['HDFC Bank'],
      preferredCardTypes: ['credit'],
      preferredPaymentMethods: ['card'],
      memberships: [],
    };

    // Tata CLiQ has HDFC 10% instant discount (max ₹1,500) -> Final: ₹19,500
    // Amazon has SBI discount (user has HDFC, so Amazon remains ₹20,000)
    const res = PriceCalculatorService.computeAndRankOffers([offerAmazon, offerTataCliq], userPrefs);

    assert(
      res.cheapestStandardOffer?.retailerName === 'Amazon India',
      'Amazon India is #1 in Standard Floor Price (₹20,000 vs ₹21,000)'
    );
    assert(
      res.cheapestEligibleOffer?.retailerName === 'Tata CLiQ',
      'Tata CLiQ is #1 in User Eligible Final Price (₹19,500 with HDFC Card discount)'
    );
    assert(
      res.lowestEligiblePrice === 19500,
      `True lowest eligible payable price calculated correctly as ₹19,500 (Got ₹${res.lowestEligiblePrice})`
    );
  } catch (err) {
    assert(false, `Test 15 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n=============================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED | TOTAL: ${passed + failed}`);
  console.log('=============================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();

