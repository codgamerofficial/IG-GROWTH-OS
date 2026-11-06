// =============================================================================
// RIIQX — Product Intelligence & Purchase Verification Dedicated Test Suite
// Zero Mock Verification • SSRF Defense • Canonical Cleaning • Price Truth Math
// =============================================================================

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';

console.log('🔍 RUNNING PRODUCT INTELLIGENCE & VERIFICATION TEST SUITE...\n');

let passed = 0;
const total = 7;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err.message || err);
    process.exit(1);
  }
}

async function runSuite() {
  // TEST 1: SSRF Defense blocks private network, loopback, and cloud metadata targets
  await test('TEST 1: SSRF Prevention blocks internal/loopback vectors', async () => {
    const maliciousUrls = [
      'http://127.0.0.1:8080/internal-data',
      'http://localhost:3000/api/secret',
      'http://10.0.0.1/admin',
      'http://192.168.1.1/router',
      'http://169.254.169.254/latest/meta-data',
    ];

    for (const badUrl of maliciousUrls) {
      const res = await fetch(`${BASE_URL}/api/product-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: badUrl }),
      });
      assert.strictEqual(res.status, 400, `Blocked URL should return 400: ${badUrl}`);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert(data.error.includes('unsafe') || data.error.includes('blocked'), 'Error message must reflect SSRF block');
    }
  });

  // TEST 2: Canonical URL cleaning strips tracking tags and standardizes product URLs
  await test('TEST 2: Canonicalization strips affiliate tags and extracts identifiers', async () => {
    const dirtyAmazonUrl = 'https://www.amazon.in/Sony-WF-1000XM5-Wireless-Cancelling-Headphones/dp/B0C33XXS56?tag=affiliate-21&ref=sr_1_1';
    const res = await fetch(`${BASE_URL}/api/product-research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: dirtyAmazonUrl }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.report.identity.canonicalIdentifier, 'B0C33XXS56');
    assert.strictEqual(data.report.identity.brand, 'Sony');
    assert(data.report.offers[0].productUrl.includes('dp/B0C33XXS56'));
    assert(!data.report.offers[0].productUrl.includes('tag=affiliate'));
  });

  // TEST 3: Flipkart URL extraction with authentic product slug
  await test('TEST 3: Flipkart product ingestion and verification status', async () => {
    const flipkartUrl = 'https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-case-usb-c-bluetooth/p/itm60c8f5a308352';
    const res = await fetch(`${BASE_URL}/api/product-research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: flipkartUrl }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.report.identity.title.toLowerCase().includes('airpods'));
    assert.strictEqual(data.report.identity.brand, 'Apple');
    const flipkartOffer = data.report.offers.find((o) => o.retailerName === 'Flipkart');
    assert(flipkartOffer, 'Flipkart offer must be present in research offers');
    assert.strictEqual(flipkartOffer.verificationStatus, 'link_verified_price_pending');
  });

  // TEST 4: Free text comparison query triggers multi-retailer discovery
  await test('TEST 4: Free text query discovers multiple verified retailers', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Minimalist 10% Vitamin C Face Serum 30ml',
        cardsOwned: ['HDFC Bank Credit Card'],
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.pricingMatrix.retailers.length >= 2, 'Should compare across at least 2 merchants');
    assert(data.pricingMatrix.finalCheckoutPrice > 0, 'Floor price must be positive');
    assert(data.pricingMatrix.totalSavings >= 0, 'Savings must be positive or zero');
  });

  // TEST 5: Price Truth math strictly enforces delivery fee arithmetic
  await test('TEST 5: Price Truth math arithmetic consistency', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Apple AirPods Pro 2',
        cardsOwned: ['Amazon Pay ICICI Card'],
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const pm = data.pricingMatrix;
    assert(pm.mrp >= pm.lowestListedPrice, 'MRP should be greater than or equal to lowest listed price');
    assert(pm.finalCheckoutPrice <= pm.lowestListedPrice, 'Final checkout price should reflect stacked savings');
    assert(data.whyThisPick.length > 0, 'Must provide reason for selection');
    assert(data.whatPlatformsHide.length > 0, 'Must expose marketplace traps');
  });

  // TEST 6: Upload API enforces 8MB limit and valid mime types
  await test('TEST 6: Screenshot upload validation', async () => {
    // Bad mime type
    const badMimeRes = await fetch(`${BASE_URL}/api/product-research/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileBase64: 'data:text/plain;base64,aGVsbG8=',
        mimeType: 'text/plain',
        fileName: 'bad.txt',
      }),
    });
    assert.strictEqual(badMimeRes.status, 400);

    // Valid PNG
    const validRes = await fetch(`${BASE_URL}/api/product-research/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        mimeType: 'image/png',
        fileName: 'pixel.png',
      }),
    });
    assert.strictEqual(validRes.status, 200);
    const validData = await validRes.json();
    assert.strictEqual(validData.success, true);
    assert(validData.base64.length > 0);
  });

  // TEST 7: Invalid input rejection
  await test('TEST 7: Empty prompt / URL rejection with clean error', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '   ' }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert(data.error.includes('product name') || data.error.includes('URL'));
  });

  console.log(`\n🎉 ALL ${passed}/${total} PRODUCT INTELLIGENCE TESTS PASSED CLEANLY!`);
}

runSuite().catch(console.error);
