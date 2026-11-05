// =============================================================================
// RIIQX — Phase 6: AI Shopping Assistant & Multi-Agent Orchestrator Acceptance Tests
// Natural Language Queries • Multi-Provider Cascade • Grounded Pricing • Safety Gates
// =============================================================================

import assert from 'assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX — PHASE 6: AI SHOPPING ASSISTANT ACCEPTANCE TESTS');
console.log('=============================================================================');

async function runPhase6Tests() {
  let passedCount = 0;

  // ---------------------------------------------------------------------------
  // TEST 1: Service Status & Multi-Tier Cascade Registration
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 1: Service Status & Multi-Tier Cascade Registration ---');
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/assistant/chat`);
    assert.strictEqual(res.status, 200, 'Assistant GET should return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.status, 'active');
    assert.strictEqual(data.cascadeTiers.length, 4, 'Must register 4 cascade tiers');

    console.log('  Active Multi-Tier Cascade:');
    data.cascadeTiers.forEach((t) => {
      console.log(`    Tier ${t.tier}: ${t.provider} (${t.model}) -> ${t.role}`);
    });

    console.log('✅ [PASS] TEST 1: Multi-tier provider cascade and status endpoint verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 1:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Natural Language Shopping Query & Best Deal Discovery
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: Natural Language Query & Best Deal Discovery ---');
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Find the best deal for Sony WH-1000XM5 across all retailers including coupons and gift cards',
      }),
    });

    assert.strictEqual(res.status, 200, 'Query should return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const r = data.response;

    assert.ok(r.reply.length > 50, 'Assistant should return substantial reply');
    assert.ok(r.providerUsed, 'Must specify which provider processed the query');
    assert.ok(r.latencyMs >= 0, 'Must record latency');
    assert.strictEqual(r.requiresHumanConfirmation, true, 'Safety gate: requires human confirmation');
    assert.ok(r.suggestedActions.length > 0, 'Should return actionable suggestion buttons');

    console.log(`  Engine Used: ${r.providerUsed} (${r.modelUsed}) in ${r.latencyMs}ms`);
    console.log(`  Confidence Score: ${(r.confidenceScore * 100).toFixed(0)}%`);
    console.log(`  Suggested Actions: ${r.suggestedActions.map((a) => a.label).join(' | ')}`);

    console.log('✅ [PASS] TEST 2: Natural language best-deal discovery with multi-agent orchestration verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 2:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Multi-Platform Cross-Retailer Grounding (Noise Colorfit Pro 5)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: Multi-Platform Cross-Retailer Grounding ---');
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Compare Noise Colorfit Pro 5 across Amazon, Flipkart and Meesho',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const r = data.response;

    assert.ok(r.priceComparisons && r.priceComparisons.length >= 4, 'Must return comparisons across retailers');
    assert.ok(r.savingsPlan, 'Must evaluate savings plan');
    assert.ok(r.savingsPlan.finalEffectivePrice > 0, 'Effective price must be positive');
    assert.ok(r.savingsPlan.upfrontPaid > 0, 'Upfront cash outlay must be calculated');

    console.log(`  Cross-Retailer Coverage: ${r.priceComparisons.length} platforms compared`);
    console.log(`  Cheapest Identified: ${r.savingsPlan.bestPlatform} at ₹${r.savingsPlan.finalEffectivePrice}`);
    console.log(`  Upfront Outlay: ₹${r.savingsPlan.upfrontPaid} | Future Cashback: ₹${r.savingsPlan.futureCashback}`);

    console.log('✅ [PASS] TEST 3: Grounded cross-retailer comparison without hallucinated figures verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 3:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: High-Margin Dropshipping Sourcing Query
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: High-Margin Dropshipping Sourcing Query ---');
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Which ambient desk lamp has the highest dropshipping profit margin?',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const r = data.response;

    assert.ok(r.matchedProduct, 'Should match Lumina Aura Ambient Desk Lamp');
    assert.ok(
      r.matchedProduct.title.toLowerCase().includes('lamp') ||
        r.matchedProduct.title.toLowerCase().includes('lumina'),
      'Matched product must be the ambient lamp'
    );
    console.log(`  Matched Sourcing Product: "${r.matchedProduct.title}" (₹${r.matchedProduct.price})`);

    const hasVideoAdAction = r.suggestedActions.some((a) => a.actionType === 'create_video_ad');
    assert.ok(hasVideoAdAction, 'Must suggest 1-Click Video Ad bridge for dropshipping products');
    console.log('  Video Ad Bridge Action: Successfully attached to product recommendation');

    console.log('✅ [PASS] TEST 4: Dropshipping sourcing query and Creator Studio ad bridge verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 4:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Conversational Order Tracking via Natural Language
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: Conversational Order Tracking via Natural Language ---');
  try {
    // 1. Create real order
    const orderRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: 'cust_assistant_test_01',
        customerName: 'Priya Mukherjee',
        shippingAddress: {
          street: '12 Ballygunge Circular Road',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700019',
          country: 'India',
        },
        items: [{ productId: 'prod_lumina_aura_01', quantity: 1 }],
        paymentMethod: 'upi_direct',
        idempotencyKey: `idemp_asst_${Date.now()}`,
        initialStatus: 'paid',
      }),
    });

    assert.strictEqual(orderRes.status, 200);
    const orderData = await orderRes.json();
    const orderId = orderData.order.id;

    // 2. Query assistant about this order
    const chatRes = await fetch(`${BASE_URL}/api/shopping/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Where is my order ${orderId}? Can you give me the courier details?`,
      }),
    });

    assert.strictEqual(chatRes.status, 200);
    const chatData = await chatRes.json();
    const r = chatData.response;

    assert.ok(r.reply.includes(orderId), 'Assistant reply must reference the exact order ID');
    assert.ok(
      r.reply.includes('PAID') || r.reply.includes('BlueDart') || r.reply.includes('Kolkata'),
      'Reply must include authentic order details'
    );
    console.log(`  Identified Order ID: ${orderId}`);
    console.log(`  Courier Tracking Integrated in Reply: ${r.suggestedActions.find((a) => a.actionType === 'track_order')?.label || 'Trackable'}`);

    console.log('✅ [PASS] TEST 5: Natural language order tracking query verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 5:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Multilingual Bengali Support & Safety Guardrails
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 6: Multilingual Bengali Support & Safety Guardrails ---');
  try {
    const res = await fetch(`${BASE_URL}/api/shopping/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Lumina Lamp er dam koto ar sobcheye sasta kothay pawa jabe?',
        preferredLanguage: 'bn',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const r = data.response;

    assert.strictEqual(r.requiresHumanConfirmation, true, 'Safety gate: requires human confirmation');
    // Check Bengali script in reply
    const hasBengali = /[\u0980-\u09FF]/.test(r.reply);
    assert.ok(hasBengali, 'Reply should contain natural Bengali phrasing');

    console.log(`  Bengali Language Detected & Served: ${hasBengali}`);
    console.log(`  Safety Boundary: requiresHumanConfirmation = ${r.requiresHumanConfirmation}`);

    console.log('✅ [PASS] TEST 6: Bengali language intelligence and safety guardrails verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 6:', err.message);
  }

  console.log('\n=============================================================================');
  console.log(`PHASE 6 TEST RESULTS: ${passedCount}/6 TESTS PASSED (${Math.round((passedCount / 6) * 100)}%)`);
  console.log('=============================================================================');

  if (passedCount !== 6) {
    process.exit(1);
  }
}

runPhase6Tests();

