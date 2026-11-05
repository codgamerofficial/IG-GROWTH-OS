// =============================================================================
// GlowFit AI / RIIQX — Phase 3 Acceptance Test Suite
// Smart Price Intelligence, Multimodal OCR, Spec Guard, & Price Drop Watchlist
// =============================================================================

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX — PHASE 3: PRICE INTELLIGENCE & SPEC GUARD ACCEPTANCE TESTS');
console.log('=============================================================================\n');

async function runTests() {
  let passed = 0;
  let total = 6;

  // --- TEST 1: Canonical URL Resolver & Platform Tracking Param Stripping ---
  try {
    console.log('--- TEST 1: Canonical URL Resolver & Platform Identifier Extraction ---');

    // Case 1A: Amazon India with Affiliate Tag & Tracking
    const dirtyAmazonUrl = 'https://www.amazon.in/Noise-ColorFit-Smartwatch-Bluetooth-Display/dp/B0CKZ32H69?tag=affil-21&ref_=nav_signin&utm_source=google&utm_medium=cpc';
    const amzRes = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: dirtyAmazonUrl }),
    });
    assert.strictEqual(amzRes.status, 200, 'Amazon analyze must return 200');
    const amzData = await amzRes.json();
    assert.strictEqual(amzData.success, true);
    assert.strictEqual(amzData.extractedProduct.detectedPlatform, 'amazon');
    assert.ok(
      amzData.extractedProduct.modelOrVariant.includes('B0CKZ32H69'),
      `Extracted model must contain ASIN B0CKZ32H69, got: ${amzData.extractedProduct.modelOrVariant}`
    );
    console.log('  Amazon Extracted Identifier:', amzData.extractedProduct.modelOrVariant);

    // Case 1B: Flipkart with PID tracking parameter
    const dirtyFlipkartUrl = 'https://www.flipkart.com/noise-colorfit-pro-5-smartwatch/p/itm123456789?pid=SMWGW89HFEXAMPLE&marketplace=FLIPKART&cmpid=sem_adwords';
    const flpRes = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: dirtyFlipkartUrl }),
    });
    assert.strictEqual(flpRes.status, 200, 'Flipkart analyze must return 200');
    const flpData = await flpRes.json();
    assert.strictEqual(flpData.success, true);
    assert.strictEqual(flpData.extractedProduct.detectedPlatform, 'flipkart');
    assert.ok(
      flpData.extractedProduct.modelOrVariant.includes('SMWGW89HFEXAMPLE'),
      `Extracted model must contain FSN SMWGW89HFEXAMPLE, got: ${flpData.extractedProduct.modelOrVariant}`
    );
    console.log('  Flipkart Extracted Identifier:', flpData.extractedProduct.modelOrVariant);

    // Case 1C: Myntra with Style ID
    const dirtyMyntraUrl = 'https://www.myntra.com/smart-watches/noise/noise-colorfit-pro-5/26491820/buy?utm_source=dada&utm_campaign=sale';
    const mynRes = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: dirtyMyntraUrl }),
    });
    assert.strictEqual(mynRes.status, 200, 'Myntra analyze must return 200');
    const mynData = await mynRes.json();
    assert.strictEqual(mynData.success, true);
    assert.strictEqual(mynData.extractedProduct.detectedPlatform, 'myntra');
    assert.ok(
      mynData.extractedProduct.modelOrVariant.includes('26491820'),
      `Extracted model must contain Style ID 26491820, got: ${mynData.extractedProduct.modelOrVariant}`
    );
    console.log('  Myntra Extracted Identifier:', mynData.extractedProduct.modelOrVariant);

    console.log('✅ [PASS] TEST 1: Canonical URL resolver strips tracking tags & extracts platform identifiers\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 1:', err);
  }

  // --- TEST 2: Exact Product Identity Matcher & Spec Guard ---
  try {
    console.log('--- TEST 2: Exact Product Identity Matcher & Spec Guard ---');

    // Case 2A: Exact match query
    const exactRes = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productNameHint: 'Noise ColorFit Pro 5 Smartwatch' }),
    });
    const exactData = await exactRes.json();
    assert.strictEqual(exactData.matchResult.matchType, 'exact_match');
    assert.strictEqual(exactData.matchResult.isPurchaseSafe, true);
    assert.ok(exactData.matchResult.confidenceScore >= 0.85);
    console.log('  Case 2A (Exact Match):', exactData.matchResult.matchType, 'Safe:', exactData.matchResult.isPurchaseSafe);

    // Case 2B: Mismatched Generation (Pro 4)
    const mismatchRes = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productNameHint: 'Noise ColorFit Pro 4 Smartwatch' }),
    });
    const mismatchData = await mismatchRes.json();
    assert.ok(
      mismatchData.matchResult.matchType === 'variant_match' || mismatchData.matchResult.matchType === 'similar_product',
      `Expected variant_match or similar_product, got: ${mismatchData.matchResult.matchType}`
    );
    console.log('  Case 2B (Spec Differentiation):', mismatchData.matchResult.matchType, 'Explanation:', mismatchData.matchResult.matchExplanation);

    console.log('✅ [PASS] TEST 2: Anti-Mismatched Spec Guard flags variant differences & protects user arbitrage\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 2:', err);
  }

  // --- TEST 3: Multimodal Vision & Arbitrage Analysis Endpoint ---
  try {
    console.log('--- TEST 3: Multimodal Vision & Arbitrage Analysis Endpoint ---');
    const res = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productNameHint: 'Noise ColorFit Pro 5 Smartwatch' }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.extractedProduct);
    assert.ok(Array.isArray(data.platformComparisons));
    assert.strictEqual(data.platformComparisons.length, 6);
    assert.ok(data.optimalPlan);
    assert.ok(data.matchResult);
    assert.ok(data.coverageReport);
    assert.ok(data.priceHistory);

    console.log('  Extracted Title:', data.extractedProduct.title);
    console.log('  Retailers Compared:', data.platformComparisons.length);
    console.log('  Cheapest Platform:', data.optimalPlan.recommendedPlatformName);
    console.log('  Base Price: ₹' + data.optimalPlan.baseListedPrice);
    console.log('  Final Effective Price: ₹' + data.optimalPlan.finalLowestEffectivePrice);
    console.log('  Total Savings: ' + data.optimalPlan.overallSavingsPct + '%');

    console.log('✅ [PASS] TEST 3: POST /api/shopping/analyze returns complete pricing, spec match, coverage & history\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 3:', err);
  }

  // --- TEST 4: Retailer Real-Time Coverage Report ---
  try {
    console.log('--- TEST 4: Retailer Real-Time Coverage Report ---');
    const res = await fetch(`${BASE_URL}/api/shopping/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productNameHint: 'boAt Airdopes 141' }),
    });

    const data = await res.json();
    const coverage = data.coverageReport;

    assert.ok(Array.isArray(coverage));
    assert.strictEqual(coverage.length, 6);

    const platforms = coverage.map((c) => c.platform);
    ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'tatacliq'].forEach((p) => {
      assert.ok(platforms.includes(p), `Missing platform in coverage: ${p}`);
    });

    coverage.forEach((c) => {
      assert.strictEqual(c.status, 'live_verified');
      assert.ok(c.latencyMs > 0);
      assert.ok(c.verifiedAt);
    });

    console.log('  Platforms verified with latency:');
    coverage.forEach((c) => {
      console.log(`    - ${c.displayName}: ${c.status} (${c.latencyMs}ms) at ${c.verifiedAt}`);
    });

    console.log('✅ [PASS] TEST 4: Real-time retailer coverage reports active verification across 6 platforms\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 4:', err);
  }

  // --- TEST 5: 30-Day Historical Price Observations API ---
  try {
    console.log('--- TEST 5: 30-Day Historical Price Observations API ---');
    const url = `${BASE_URL}/api/shopping/price-history?productIdentifier=noise_colorfit_pro_5&title=Noise+ColorFit+Pro+5&currentPrice=1999&mrp=3999`;
    const res = await fetch(url);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.priceHistory);

    const hist = data.priceHistory;
    assert.strictEqual(hist.productIdentifier, 'noise_colorfit_pro_5');
    assert.ok(Array.isArray(hist.observations));
    assert.strictEqual(hist.observations.length, 30);
    assert.ok(hist.lowestObserved <= 1999);
    assert.ok(hist.highestObserved >= 1999);
    assert.ok(hist.averageObserved > 0);
    assert.ok(['dropping', 'increasing', 'stable'].includes(hist.priceTrendDirection));

    console.log('  30-Day Price Window:');
    console.log(`    - Lowest Recorded: ₹${hist.lowestObserved}`);
    console.log(`    - 30-Day Average: ₹${hist.averageObserved}`);
    console.log(`    - Highest Recorded: ₹${hist.highestObserved}`);
    console.log(`    - Trend Direction: ${hist.priceTrendDirection}`);
    console.log(`    - Observations Count: ${hist.observations.length} daily data points`);

    console.log('✅ [PASS] TEST 5: GET /api/shopping/price-history provides 30-day observations & trend direction\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 5:', err);
  }

  // --- TEST 6: Target Price Drop Watchlist API ---
  try {
    console.log('--- TEST 6: Target Price Drop Watchlist API ---');

    // Case 6A: Create Target Price Drop Alert (Valid: target < initial)
    const postRes = await fetch(`${BASE_URL}/api/shopping/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_user_789',
        productTitle: 'Noise ColorFit Pro 5 Smartwatch',
        productIdentifier: 'noise_pro_5_black',
        targetPrice: 1699,
        initialPrice: 1999,
        preferredPlatform: 'meesho',
      }),
    });

    assert.strictEqual(postRes.status, 201);
    const postData = await postRes.json();
    assert.strictEqual(postData.success, true);
    assert.ok(postData.watchlist);
    assert.ok(postData.watchlist.id.startsWith('wlist_'));
    assert.strictEqual(postData.watchlist.targetPrice, 1699);
    console.log('  Created Watchlist Alert ID:', postData.watchlist.id, 'Target: ₹' + postData.watchlist.targetPrice);

    // Case 6B: Reject Invalid Target Price (target >= initial)
    const invalidRes = await fetch(`${BASE_URL}/api/shopping/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_user_789',
        productTitle: 'Noise ColorFit Pro 5 Smartwatch',
        targetPrice: 2100,
        initialPrice: 1999,
      }),
    });

    assert.strictEqual(invalidRes.status, 400);
    const invalidData = await invalidRes.json();
    assert.strictEqual(invalidData.success, false);
    console.log('  Invalid Target Correctly Blocked:', invalidData.error);

    // Case 6C: List User's Active Watchlists
    const listRes = await fetch(`${BASE_URL}/api/shopping/watchlist?userId=test_user_789`);
    assert.strictEqual(listRes.status, 200);
    const listData = await listRes.json();
    assert.strictEqual(listData.success, true);
    assert.ok(Array.isArray(listData.watchlists));
    assert.ok(listData.watchlists.length >= 1);
    assert.strictEqual(listData.watchlists[0].id, postData.watchlist.id);
    console.log('  Retrieved Active Watchlists Count:', listData.watchlists.length);

    console.log('✅ [PASS] TEST 6: Watchlist API supports alert creation, validation guard & user alert listing\n');
    passed++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 6:', err);
  }

  // --- SUMMARY ---
  console.log('=============================================================================');
  console.log(`PHASE 3 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('=============================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
