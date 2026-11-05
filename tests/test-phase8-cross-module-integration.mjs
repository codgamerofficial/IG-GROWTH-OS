// =============================================================================
// RIIQX — Phase 8 Acceptance Test Suite: Cross-Module Integration & Shared Asset Library
// Tests Universal Asset Catalog, Global Cross-Module Search, and Unified Brand DNA Flow
// =============================================================================

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';

console.log('--- STARTING PHASE 8 TEST SUITE: CROSS-MODULE INTEGRATION ---');

async function runTests() {
  // TEST 1: Universal Asset Catalog
  console.log('\n[TEST 1] GET /api/riiqx/assets (Universal Creative Asset Catalog)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/assets`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.assets));
    assert.ok(data.assets.length > 0, 'Expected populated asset catalog');

    console.log(`✓ Universal Asset Catalog active:`);
    console.log(`  - Total indexed assets: ${data.total || data.count}`);
    const categoriesFound = new Set(data.assets.map((a) => a.category));
    console.log(`  - Active categories: ${Array.from(categoriesFound).join(', ')}`);
  }

  // TEST 2: Global Search Across All 6 Modules (Empty Query -> Counts)
  console.log('\n[TEST 2] GET /api/riiqx/search (Global System Overview)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/search`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.counts);

    console.log(`✓ Global search overview verified across all 6 engines:`);
    console.log(`  - Assets: ${data.counts.assets}`);
    console.log(`  - Campaigns: ${data.counts.campaigns}`);
    console.log(`  - Canvases: ${data.counts.canvases}`);
    console.log(`  - Products: ${data.counts.products}`);
    console.log(`  - Workflows: ${data.counts.workflows}`);
    console.log(`  - Active Brand DNA Synced: ${data.counts.hasBrand}`);

    assert.ok(data.counts.assets >= 1, 'Expected at least 1 asset');
    assert.ok(data.counts.campaigns >= 1, 'Expected at least 1 campaign');
    assert.ok(data.counts.canvases >= 1, 'Expected at least 1 canvas');
    assert.ok(data.counts.products >= 1, 'Expected at least 1 product');
    assert.ok(data.counts.workflows >= 1, 'Expected at least 1 workflow');
    assert.strictEqual(data.counts.hasBrand, true, 'Brand DNA must be active');
  }

  // TEST 3: Targeted Global Keyword Search
  console.log('\n[TEST 3] GET /api/riiqx/search?q=drone (Targeted Entity Search)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/search?q=drone`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.query, 'drone');
    console.log(`✓ Targeted search returned ${data.totalMatches} total match(es) across modules.`);
    assert.ok(data.totalMatches >= 1, 'Expected drone product match');
  }

  // TEST 4: Unified Brand DNA Flow Verification
  console.log('\n[TEST 4] GET /api/riiqx/brand (Brand DNA Single Source of Truth)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/brand`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const brand = data.brandDNA || data.brand;
    assert.ok(brand, 'Expected active Brand DNA');
    console.log(`✓ Active Brand DNA verified: "${brand.brandName}"`);
    console.log(`  - Primary Accent: ${brand.colorPalette.primary}`);
    console.log(`  - Mission: "${brand.mission}"`);
  }

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 8 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 8 TEST SUITE FAILED:', err);
  process.exit(1);
});
