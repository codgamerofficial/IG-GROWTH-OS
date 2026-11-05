// =============================================================================
// GlowFit AI / RIIQX — Phase 4 Acceptance Test Suite
// Deterministic Savings Waterfall, Rule-Based Offers, Authorized Gift Cards,
// Idempotency Protection, and Strictly Separated Cashback Ledger
// =============================================================================

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX — PHASE 4: SAVINGS ENGINE & GIFT CARD ARBITRAGE ACCEPTANCE TESTS');
console.log('=============================================================================\n');

async function runTests() {
  let passed = 0;
  let total = 6;

  // --- TEST 1: 9-Step Deterministic Savings Waterfall ---
  try {
    console.log('--- TEST 1: 9-Step Deterministic Savings Waterfall Evaluation ---');
    const res = await fetch(`${BASE_URL}/api/shopping/savings/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'amazon',
        platformDisplayName: 'Amazon India',
        baseListedPrice: 2499,
        mrp: 3999,
      }),
    });

    assert.strictEqual(res.status, 200, 'Waterfall API must return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.waterfall);

    const wf = data.waterfall;
    // Step 1: Base Listed Price
    assert.strictEqual(wf.baseListedPrice, 2499);
    assert.strictEqual(wf.mrp, 3999);

    // Step 2: Instant Store Coupon
    assert.ok(wf.couponApplied !== undefined, 'Coupon should be applied for ₹2,499 spend');
    assert.strictEqual(wf.couponApplied.code, 'AMZNEW200');
    assert.strictEqual(wf.couponApplied.discountAmount, 200);
    assert.strictEqual(wf.priceAfterCoupon, 2299);

    // Step 3: Verified Bank & Card Offer (10% capped at ₹500)
    assert.ok(wf.bankOfferApplied !== undefined, 'Bank offer should be applied');
    assert.strictEqual(wf.bankOfferApplied.discountAmount, 230); // 10% of 2299
    assert.strictEqual(wf.priceAfterBankOffer, 2069);

    // Step 4: Direct Platform Subtotal before gift card
    assert.strictEqual(wf.directPlatformSubtotal, 2069);

    // Step 5: Gift Card Arbitrage Selection
    assert.ok(wf.giftCardSelected !== undefined);
    assert.strictEqual(wf.giftCardSelected.faceValue, 2069);
    assert.strictEqual(wf.giftCardSelected.discountPct, 2.0);
    assert.strictEqual(wf.giftCardSelected.upfrontSavings, 41); // 2% of 2069

    // Step 6: Upfront Cash Outlay
    assert.strictEqual(wf.upfrontCashOutlay, 2069 - 41); // ₹2,028

    // Step 7: Delivery charges
    assert.strictEqual(wf.deliveryCharges, 0);

    // Step 8: Future Cashback (Strictly Separated!)
    assert.ok(wf.futureCashbackEarned > 0);
    assert.strictEqual(wf.futureCashbackEarned, Math.round(2069 * 0.035)); // 3.5% = ₹72

    // Step 9: Total Net Economic Benefit
    // (3999 - 2499) + 200 + 230 + 41 + 72 = 1500 + 543 = 2043
    assert.strictEqual(wf.totalNetEconomicSavings, 1500 + 200 + 230 + 41 + 72);
    assert.strictEqual(wf.finalEffectiveCost, 3999 - wf.totalNetEconomicSavings);

    console.log('  Step 1 (Base Listed): ₹' + wf.baseListedPrice);
    console.log(`  Step 2 (Coupon ${wf.couponApplied.code}): -₹${wf.couponApplied.discountAmount}`);
    console.log(`  Step 3 (Bank ${wf.bankOfferApplied.bankName}): -₹${wf.bankOfferApplied.discountAmount}`);
    console.log('  Step 4 (Platform Subtotal): ₹' + wf.directPlatformSubtotal);
    console.log(`  Step 5 (Gift Card ${wf.giftCardSelected.discountPct}% Upfront): -₹${wf.giftCardSelected.upfrontSavings}`);
    console.log('  Step 6 (Upfront Cash Outlay Paid): ₹' + wf.upfrontCashOutlay);
    console.log('  Step 8 (Future Cashback to Wallet): +₹' + wf.futureCashbackEarned);
    console.log('  Step 9 (Total Economic Benefit): Save ₹' + wf.totalNetEconomicSavings + ` (${wf.effectiveSavingsPct}% OFF MRP)`);

    console.log('✅ [PASS] TEST 1: 9-step deterministic waterfall correctly evaluates prices and strictly isolates upfront outlay vs future cashback\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 1:', err);
  }

  // --- TEST 2: Rule-Based Thresholds & Capping Limits ---
  try {
    console.log('--- TEST 2: Rule-Based Offer Thresholds & Capping Limits ---');

    // Case 2A: Order value below coupon minimum spend (₹800 < ₹1,000)
    const lowRes = await fetch(`${BASE_URL}/api/shopping/savings/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'amazon',
        baseListedPrice: 800,
        mrp: 1200,
      }),
    });
    const lowData = await lowRes.json();
    assert.strictEqual(lowData.waterfall.couponApplied, undefined, 'Coupon should be blocked when min spend ₹1,000 is unmet');
    console.log('  Case 2A: Minimum spend restriction correctly rejected coupon for ₹800 order');

    // Case 2B: Bank offer cap limit (10% of ₹10,000 is ₹1,000, capped at maxDiscount ₹500)
    const capRes = await fetch(`${BASE_URL}/api/shopping/savings/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'amazon',
        baseListedPrice: 10000,
        mrp: 15000,
      }),
    });
    const capData = await capRes.json();
    assert.strictEqual(capData.waterfall.bankOfferApplied.discountAmount, 500, 'Bank discount must be capped at ₹500');
    console.log('  Case 2B: Max discount cap correctly restricted bank discount to ₹' + capData.waterfall.bankOfferApplied.discountAmount);

    console.log('✅ [PASS] TEST 2: Rule-based eligibility engine enforces minimum spend thresholds and maximum discount caps\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 2:', err);
  }

  // --- TEST 3: Authorized Branded Gift Card Catalog API ---
  try {
    console.log('--- TEST 3: Authorized Branded Gift Card Catalog API ---');
    const res = await fetch(`${BASE_URL}/api/shopping/giftcards/brands`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.brands));
    assert.strictEqual(data.brands.length, 8);

    const brandKeys = data.brands.map((b) => b.brandKey);
    ['amazon_pay', 'flipkart', 'myntra', 'ajio', 'meesho', 'tatacliq', 'nykaa', 'swiggy'].forEach((key) => {
      assert.ok(brandKeys.includes(key), `Missing brand key: ${key}`);
    });

    data.brands.forEach((b) => {
      assert.ok(b.minDenomination > 0);
      assert.ok(b.maxDenomination >= b.minDenomination);
      assert.ok(Array.isArray(b.supportedDenominations) && b.supportedDenominations.length > 0);
      assert.ok(b.currentDiscountPct >= 0);
      assert.ok(b.currentCashbackPct > 0);
      assert.ok(b.walletRedemptionUrl.startsWith('https://'));
    });

    console.log(`  Discovered ${data.brands.length} authorized gift card brands:`);
    data.brands.slice(0, 4).forEach((b) => {
      console.log(`    - ${b.brandName}: ${b.currentDiscountPct}% Off Upfront, +${b.currentCashbackPct}% Cashback`);
    });

    console.log('✅ [PASS] TEST 3: Authorized branded gift card catalog exposes verified brands, rates & official redemption URLs\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 3:', err);
  }

  // --- TEST 4: Idempotent Gift Card Purchase & Duplicate Prevention ---
  try {
    console.log('--- TEST 4: Idempotent Gift Card Purchase & Duplicate Prevention ---');
    const testIdempotencyKey = `idemp_unique_token_${Date.now()}`;

    // Request 1: Initial Purchase
    const req1Res = await fetch(`${BASE_URL}/api/shopping/giftcards/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_user_phase4',
        platform: 'flipkart',
        faceValue: 1000,
        paymentMethod: 'upi',
        autoCreditToShoppingWallet: true,
        idempotencyKey: testIdempotencyKey,
      }),
    });

    assert.strictEqual(req1Res.status, 200);
    const data1 = await req1Res.json();
    assert.strictEqual(data1.success, true);
    const order1 = data1.order;
    assert.ok(order1.orderId.startsWith('GC_GLOW_'));
    assert.ok(order1.voucherCode.startsWith('GLOW-FLI-'));
    assert.strictEqual(order1.faceValue, 1000);
    assert.strictEqual(order1.amountPaid, 975); // 2.5% discount on 1000 = 25 off -> 975
    assert.strictEqual(order1.cashbackEarned, 50); // 5% cashback = 50

    console.log('  Initial Purchase Order ID:', order1.orderId, 'Voucher:', order1.voucherCode);

    // Request 2: Duplicate request with identical idempotencyKey
    const req2Res = await fetch(`${BASE_URL}/api/shopping/giftcards/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_user_phase4',
        platform: 'flipkart',
        faceValue: 1000,
        paymentMethod: 'upi',
        autoCreditToShoppingWallet: true,
        idempotencyKey: testIdempotencyKey,
      }),
    });

    assert.strictEqual(req2Res.status, 200);
    const data2 = await req2Res.json();
    assert.strictEqual(data2.success, true);
    const order2 = data2.order;

    // Must be identical order, NOT a new voucher!
    assert.strictEqual(order2.orderId, order1.orderId, 'Idempotency must return identical orderId');
    assert.strictEqual(order2.voucherCode, order1.voucherCode, 'Idempotency must prevent new voucher creation');
    console.log('  Duplicate Request Safely Resolved to Existing Order:', order2.orderId);

    console.log('✅ [PASS] TEST 4: Idempotency engine prevents duplicate charges and voucher re-issuance\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 4:', err);
  }

  // --- TEST 5: Strictly Separated Customer Cashback Ledger ---
  try {
    console.log('--- TEST 5: Strictly Separated Customer Cashback Ledger ---');
    const res = await fetch(`${BASE_URL}/api/shopping/giftcards/orders?userId=test_user_phase4`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.cashbackLedger));
    assert.ok(data.cashbackLedger.length >= 1, 'Should have at least 1 cashback ledger record');

    const entry = data.cashbackLedger[0];
    assert.strictEqual(entry.userId, 'test_user_phase4');
    assert.strictEqual(entry.status, 'credited');
    assert.strictEqual(entry.amount, 50);
    assert.ok(entry.giftCardOrderId.startsWith('GC_GLOW_'));
    assert.ok(entry.creditedAt);

    console.log('  Ledger Entry ID:', entry.id);
    console.log('  Cashback Amount Credited: ₹' + entry.amount);
    console.log('  Linked Order ID:', entry.giftCardOrderId);
    console.log('  Total User Cashback Credited: ₹' + data.totalCashbackCredited);

    console.log('✅ [PASS] TEST 5: Customer cashback ledger strictly tracks post-purchase wallet funds independently of upfront cash outlay\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 5:', err);
  }

  // --- TEST 6: Official Direct Redemption Links (Zero Scraping) ---
  try {
    console.log('--- TEST 6: Official Direct Redemption Links (Zero Scraping) ---');
    const res = await fetch(`${BASE_URL}/api/shopping/giftcards/brands`);
    const data = await res.json();

    const expectedDomains = {
      amazon_pay: 'amazon.in',
      flipkart: 'flipkart.com',
      myntra: 'myntra.com',
      ajio: 'ajio.com',
      tatacliq: 'tatacliq.com',
    };

    Object.entries(expectedDomains).forEach(([brandKey, domain]) => {
      const brand = data.brands.find((b) => b.brandKey === brandKey);
      assert.ok(brand, `Brand ${brandKey} must exist`);
      assert.ok(brand.walletRedemptionUrl.includes(domain), `Redemption URL must point to official domain ${domain}`);
    });

    console.log('  Verified official domain targets:');
    Object.entries(expectedDomains).forEach(([key, dom]) => {
      const b = data.brands.find((item) => item.brandKey === key);
      console.log(`    - ${b.brandName} -> ${b.walletRedemptionUrl}`);
    });

    console.log('✅ [PASS] TEST 6: All redemption links direct users to official verified retailer wallet portals without password capture\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 6:', err);
  }

  // --- SUMMARY ---
  console.log('=============================================================================');
  console.log(`PHASE 4 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('=============================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();

