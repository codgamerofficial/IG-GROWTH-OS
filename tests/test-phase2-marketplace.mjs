// =============================================================================
// RIIQX — Phase 2 Automated Acceptance Test Suite
// Commerce Marketplace, Curated Catalog, Multi-Signal Search,
// Regulatory Disclosures, and Supplier Onboarding Verification
// =============================================================================

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX — PHASE 2: SHOPPING MARKETPLACE & SUPPLIER ACCEPTANCE TESTS');
console.log('=============================================================================\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  function recordPass(testName) {
    passed++;
    total++;
    console.log(`✅ [PASS] ${testName}`);
  }

  function recordFail(testName, err) {
    total++;
    console.error(`❌ [FAIL] ${testName}:`, err.message || err);
  }

  // TEST 1: Categories Hierarchy API
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/marketplace/categories`);
    assert.strictEqual(res.status, 200, 'Categories endpoint must return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'success must be true');
    assert.ok(Array.isArray(data.categories), 'categories must be an array');
    assert.ok(data.categories.length >= 6, 'Must have at least 6 categories');

    const hasElectronics = data.categories.some((c) => c.id === 'electronics');
    const hasHome = data.categories.some((c) => c.id === 'home');
    assert.ok(hasElectronics && hasHome, 'Must include electronics and home categories');
    recordPass('TEST 1: Categories Hierarchy API returns structured categories');
  } catch (err) {
    recordFail('TEST 1: Categories Hierarchy API', err);
  }

  // TEST 2: Product Listing & Pagination API
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/marketplace/products?limit=10&page=1`);
    assert.strictEqual(res.status, 200, 'Products listing must return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'success must be true');
    assert.ok(data.total >= 8, `Expected at least 8 products, got ${data.total}`);
    assert.ok(Array.isArray(data.products), 'products must be an array');
    assert.strictEqual(data.page, 1, 'Page number must match');
    recordPass(`TEST 2: Marketplace Product Listing returns ${data.total} verified products`);
  } catch (err) {
    recordFail('TEST 2: Marketplace Product Listing', err);
  }

  // TEST 3: Category and Search Filtering
  try {
    const homeRes = await fetch(`${BASE_URL}/api/shopping/marketplace/products?category=home`);
    const homeData = await homeRes.json();
    assert.ok(homeData.products.every((p) => p.category === 'home'), 'All items must belong to home category');

    const searchRes = await fetch(`${BASE_URL}/api/shopping/marketplace/products?search=lumina`);
    const searchData = await searchRes.json();
    assert.ok(searchData.products.length > 0, 'Search query for "lumina" must return at least 1 match');
    assert.ok(searchData.products[0].title.toLowerCase().includes('lumina'), 'Title must match search term');
    recordPass('TEST 3: Category filtering and search query successfully isolate products');
  } catch (err) {
    recordFail('TEST 3: Category and Search Filtering', err);
  }

  // TEST 4: Single Product Detail & Mandatory Disclosures (Consumer Protection Rules)
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/marketplace/products/prod_lumina_aura_01`);
    assert.strictEqual(res.status, 200, 'Single product endpoint must return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'success must be true');
    const p = data.product;

    assert.ok(p.id, 'Product must have ID');
    assert.ok(p.title, 'Product must have title');
    assert.ok(p.brand, 'Product must have brand');
    assert.ok(p.currentPrice > 0, 'Current price must be positive');
    assert.ok(p.verifiedMrp >= p.currentPrice, 'Verified MRP must be >= selling price');
    assert.ok(p.discountPct > 0, 'Discount % must be calculated');
    assert.ok(p.countryOfOrigin, 'Country of origin is mandatory');
    assert.strictEqual(p.countryOfOrigin, 'India', 'Country of origin must be India');
    assert.ok(p.warranty, 'Warranty must be declared');
    assert.ok(p.returnPolicy, 'Return policy must be declared');
    assert.ok(p.gtin, 'GTIN/Barcode must be present');

    // Seller Transparency
    assert.ok(p.seller.name, 'Seller name is mandatory');
    assert.ok(p.seller.legalName, 'Seller legal name is mandatory');
    assert.ok(p.seller.gstin, 'Seller GSTIN is mandatory');
    assert.ok(p.seller.address, 'Seller physical address is mandatory');

    // Variants
    assert.ok(Array.isArray(p.variants) && p.variants.length > 0, 'Product must have variant options');

    recordPass('TEST 4: Product Detail meets all India Consumer Protection Rule disclosures');
  } catch (err) {
    recordFail('TEST 4: Single Product Detail', err);
  }

  // TEST 5: Supplier Registration Validation (GSTIN Format Verification)
  try {
    // 5A: Rejection of invalid GSTIN
    const invalidRes = await fetch(`${BASE_URL}/api/shopping/marketplace/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Fake Trader',
        contactPerson: 'John Doe',
        email: 'invalid@fake.com',
        phone: '1234567890',
        gstin: 'INVALID_GSTIN_123',
        warehouseAddress: 'Unknown Street',
        warehouseCity: 'Mumbai',
        warehousePincode: '400001',
      }),
    });

    assert.strictEqual(invalidRes.status, 400, 'Invalid GSTIN must return HTTP 400');
    const invalidData = await invalidRes.json();
    assert.strictEqual(invalidData.success, false, 'Invalid registration must fail');
    assert.ok(invalidData.errors.some((e) => e.includes('GSTIN')), 'Must flag GSTIN format error');

    // 5B: Acceptance of valid Indian GSTIN
    const validRes = await fetch(`${BASE_URL}/api/shopping/marketplace/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: 'Apex Precision Electronics Ltd',
        contactPerson: 'Rohit Sen',
        email: 'supplier@apexprecision.in',
        phone: '9820112233',
        gstin: '27AABCA1234F1Z8',
        warehouseAddress: 'Plot 42, Hiranandani Tech Park, Powai',
        warehouseCity: 'Mumbai',
        warehousePincode: '400076',
        shippingDaysMin: 2,
        shippingDaysMax: 4,
        returnWindowDays: 7,
      }),
    });

    assert.strictEqual(validRes.status, 200, 'Valid supplier registration must return HTTP 200');
    const validData = await validRes.json();
    assert.strictEqual(validData.success, true, 'Valid registration must succeed');
    assert.ok(validData.supplierId, 'Supplier ID must be assigned');
    recordPass(`TEST 5: Supplier Onboarding strictly validates GSTIN and generates ${validData.supplierId}`);
  } catch (err) {
    recordFail('TEST 5: Supplier Registration Validation', err);
  }

  // TEST 6: Supplier Listing API
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/marketplace/suppliers`);
    assert.strictEqual(res.status, 200, 'Supplier listing must return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true, 'success must be true');
    assert.ok(data.count >= 1, 'Must list at least 1 verified supplier');
    recordPass(`TEST 6: Supplier Registry lists ${data.count} active verified dropshipping suppliers`);
  } catch (err) {
    recordFail('TEST 6: Supplier Listing API', err);
  }

  console.log('\n=============================================================================');
  console.log(`PHASE 2 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('=============================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

