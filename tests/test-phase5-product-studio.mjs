// =============================================================================
// RIIQX — Phase 5 Acceptance Test Suite: AI Product Studio
// Tests Feature Extraction, Environment Presets, Commercial Renders & Asset Sync
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

console.log('--- STARTING PHASE 5 TEST SUITE: AI PRODUCT STUDIO ---');

async function runTests() {
  let createdProductId = null;

  // TEST 1: List products
  console.log('\n[TEST 1] GET /api/riiqx/products');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/products`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.products));
    console.log(`✓ Fetched products list cleanly. Current count: ${data.count}`);
  }

  // TEST 2: Create product and extract physical features
  console.log('\n[TEST 2] POST /api/riiqx/products (Create Product & AI Feature Extraction)');
  {
    const payload = {
      name: 'AeroPulse Titanium Drone',
      category: 'electronics',
      description:
        'Autonomous carbon-fiber 4K cinematic camera drone with gold gimbal accents, aerodynamic folding arms, and obstacle sensors.',
      price: '$899.00',
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.product);

    createdProductId = data.product.id;
    console.log(`✓ Product created with ID: ${createdProductId}`);
    console.log(`  - Category: ${data.product.category}`);
    console.log(`  - Extracted Colors: ${data.product.features?.colors?.join(', ')}`);
    console.log(`  - Extracted Materials: ${data.product.features?.materials?.join(', ')}`);
    console.log(`  - Shape: ${data.product.features?.shape}`);

    assert.ok(data.product.features?.colors?.length > 0, 'Expected extracted colors');
    assert.ok(data.product.features?.materials?.length > 0, 'Expected extracted materials');

    // Verify disk persistence
    const diskPath = path.join(process.cwd(), 'AI Video Editor', 'projects', 'products', `${createdProductId}.json`);
    assert.ok(fs.existsSync(diskPath), `Expected product file on disk at ${diskPath}`);
    console.log(`✓ Verified disk persistence in AI Video Editor/projects/products/`);
  }

  // TEST 3: Generate commercial scene render
  console.log('\n[TEST 3] POST /api/riiqx/products/:id/generate-scene (Synthesize Commercial Scene)');
  {
    const payload = {
      environment: 'luxury_pedestal',
      lighting: 'dramatic_rim',
      composition: 'center_hero',
      aspectRatio: '1:1',
      customPrompt: 'Showcase the aerodynamic carbon-fiber texture on a floating obsidian stage.',
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/products/${createdProductId}/generate-scene`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.generation);

    console.log(`✓ Commercial scene generated:`);
    console.log(`  - Scene ID: ${data.generation.id}`);
    console.log(`  - Image URL: ${data.generation.imageUrl}`);
    console.log(`  - Ad Headline: "${data.generation.adHeadline}"`);
    console.log(`  - CTA: "${data.generation.callToAction}"`);

    // Verify physical SVG exists on disk in public/uploads/products/
    const physicalSvgPath = path.join(process.cwd(), 'public', data.generation.imageUrl.replace(/^\//, ''));
    assert.ok(fs.existsSync(physicalSvgPath), `Expected rendered SVG file at ${physicalSvgPath}`);
    console.log(`✓ Verified physical commercial scene SVG rendered to ${physicalSvgPath}`);
  }

  // TEST 4: Fetch product with generated scene
  console.log('\n[TEST 4] GET /api/riiqx/products/:id (Verify Scene in Product Record)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/products/${createdProductId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.product.generations.length, 1);
    console.log(`✓ Product record contains active commercial scene generation`);
  }

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 5 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 5 TEST SUITE FAILED:', err);
  process.exit(1);
});
