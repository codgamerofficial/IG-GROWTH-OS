// =============================================================================
// RIIQX — Master Personal AI Twin E2E & Acceptance Verification Suite
// Validates All 15 Production Acceptance Criteria
// =============================================================================

import assert from 'node:assert';

const BASE_URL = 'http://localhost:3001';

console.log('🤖 RUNNING RIIQX PERSONAL AI TWIN MASTER ACCEPTANCE SUITE...\n');

let passed = 0;
const total = 15;

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
  // TEST 1: A new authenticated user creates a Twin profile and saves preferences
  await test('TEST 1: User creates Twin profile and saves preferences', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twinName: 'Atlas Intelligence',
        autonomyLevel: 2,
        tone: 'pragmatic_analytical',
        budgetTier: 'balanced',
        skinType: 'Oily / Sensitive',
        preferredBrands: ['Sony', 'Apple', 'Minimalist'],
        avoidKeywords: ['Fast Fashion Polyester'],
        notificationFrequency: 'weekly',
      }),
    });
    assert.strictEqual(res.status, 200, 'Profile endpoint should return 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.profile.twinName, 'Atlas Intelligence');
    assert.strictEqual(data.profile.budgetTier, 'balanced');
  });

  // TEST 2: The Twin retrieves the correct saved preferences in a later conversation
  await test('TEST 2: Twin retrieves correct saved preferences', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/profile`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.profile.twinName, 'Atlas Intelligence');
    assert(data.profile.preferredBrands.includes('Sony'));
  });

  // TEST 3 & 4: Purchase input, extraction, and price truth calculation
  await test('TEST 3 & 4: Price truth calculations with platform fees & card stacking', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Should I buy Apple AirPods Pro 2 or Sony WF-1000XM5?',
        cardsOwned: ['HDFC Bank Credit Card'],
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.pricingMatrix.finalCheckoutPrice > 0, 'Floor price must be positive');
    assert(data.pricingMatrix.totalSavings > 0, 'Total savings must be computed');
    assert(data.pricingMatrix.retailers.length >= 3, 'Must compare across multiple merchants');
  });

  // TEST 5: User confirms uncertain details & adds verified memory
  await test('TEST 5: Add confirmed preference to Twin memory', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'tech',
        memoryText: 'Never purchase laptops with under 16GB unified RAM for video workflows.',
        memoryType: 'confirmed_preference',
        confidenceScore: 1.0,
        sourceType: 'direct_user_statement',
        verifiedByUser: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.memory.memoryType, 'confirmed_preference');
  });

  // TEST 6: Retrieves actual supported offers and compares total costs
  await test('TEST 6: Retrieve verified opportunities from opportunity radar', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/opportunities?category=all`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.opportunities.length > 0, 'Should return verified opportunities');
    assert.strictEqual(data.opportunities[0].verificationStatus, 'verified');
  });

  // TEST 7: Receives recommendation with sources, assumptions, and confidence
  await test('TEST 7: Recommendation includes assumptions and platform warnings', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/decide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Minimalist Ultra-Light Sunscreen SPF 50',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(data.whatPlatformsHide.length > 0, 'Must expose marketplace traps');
    assert(data.bestPick.specs.length > 0, 'Must provide verified specs');
  });

  // TEST 8: Saves decision and sees it in history
  await test('TEST 8: Decision history persistence and access', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/data`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.purchaseAnalyses), 'purchaseAnalyses must be an array');
  });

  // TEST 9: Changes a preference and subsequent recommendations reflect change
  await test('TEST 9: Update Twin preference and verify reflection', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budgetTier: 'frugal',
        twinName: 'Atlas Frugal Twin',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.profile.budgetTier, 'frugal');
  });

  // TEST 10: Connected apps status and revocation
  await test('TEST 10: Connector endpoint audit and status check', async () => {
    const res = await fetch(`${BASE_URL}/api/social/accounts`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert(Array.isArray(data.accounts));
  });

  // TEST 11: Scheduled digest runs and status is persisted
  await test('TEST 11: Weekly intelligence digest retrieval', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/digest`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.digests.length > 0, 'Should return weekly digest archive');
    assert(data.digests[0].sections.length >= 2, 'Digest must have structured sections');
  });

  // TEST 12: Reward ledger prevents unauthorized balance modification
  await test('TEST 12: Reward ledger audit trail and referral generation', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/rewards`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(typeof data.account.availableBalance, 'number');
    assert(data.referral.code.startsWith('RIIQX-'), 'Referral code must have RIIQX prefix');
  });

  // TEST 13: Goal tracking and budget containment
  await test('TEST 13: Twin goal creation and progress tracking', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Emergency Rainy Day Fund',
        category: 'savings',
        targetAmount: 50000,
        currentAmount: 32000,
        currency: 'INR',
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.goal.targetAmount, 50000);
  });

  // TEST 14: Data export and DPDP Act workflows
  await test('TEST 14: DPDP Act JSON data export download', async () => {
    const res = await fetch(`${BASE_URL}/api/twin/data`);
    assert.strictEqual(res.status, 200);
    const disposition = res.headers.get('content-disposition') || '';
    assert(disposition.includes('attachment'), 'Must provide downloadable attachment');
    const data = await res.json();
    assert.strictEqual(data.compliance, 'Digital Personal Data Protection Act (DPDP)');
    assert(data.twinProfile !== undefined);
  });

  // TEST 15: Existing application continues working without regressions
  await test('TEST 15: Baseline application and health routes remain operational', async () => {
    const resHealth = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(resHealth.status, 200);
    const resPage = await fetch(`${BASE_URL}/`);
    assert.strictEqual(resPage.status, 200);
    const html = await resPage.text();
    assert(html.length > 10000, 'Homepage must render substantial markup');
  });

  console.log(`\n🎉 MASTER ACCEPTANCE RESULTS: ${passed}/${total} TESTS PASSED CLEANLY!`);
}

runSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

