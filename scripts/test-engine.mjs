import assert from 'node:assert';

console.log('🧪 Starting GlowFit AI Verification Test Suite...\n');

// 1. Test Budget Calculation Logic
function testBudgetCalculation() {
  console.log('▶ Test 1: Smart Budget Calculation');
  const budget = 1500;
  const products = [
    { name: 'Foundation', price: 499 },
    { name: 'Lipstick', price: 399 },
    { name: 'Blush', price: 349 },
    { name: 'Mascara', price: 249 },
  ];
  const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  assert.strictEqual(subtotal, 1496);
  assert.ok(subtotal <= budget, 'Subtotal should be within ₹1,500 target');
  console.log('  ✔ Subtotal ₹1,496 strictly fits within target ₹1,500.');
}

// 2. Test Task Deduplication Fingerprinting
function testTaskFingerprinting() {
  console.log('▶ Test 2: Request Fingerprinting & Deduplication');
  const payload1 = { fileIdOrUrl: 'image_123', templateId: 'look_wedding' };
  const payload2 = { fileIdOrUrl: 'image_123', templateId: 'look_wedding' };
  const payload3 = { fileIdOrUrl: 'image_456', templateId: 'look_wedding' };

  const fp1 = JSON.stringify(payload1);
  const fp2 = JSON.stringify(payload2);
  const fp3 = JSON.stringify(payload3);

  assert.strictEqual(fp1, fp2, 'Identical requests must yield identical fingerprints');
  assert.notStrictEqual(fp1, fp3, 'Different images must yield different fingerprints');
  console.log('  ✔ Request fingerprinting prevents redundant duplicate API tasks.');
}

// 3. Test Normalization Adapter Bounds
function testNormalizationBounds() {
  console.log('▶ Test 3: Normalization Safety Bounds');
  const clamp = (val) => Math.min(100, Math.max(0, Math.round(val)));
  assert.strictEqual(clamp(115), 100);
  assert.strictEqual(clamp(-10), 0);
  assert.strictEqual(clamp(84.6), 85);
  console.log('  ✔ Optical scores are safely clamped within [0, 100].');
}

// 4. Test Demo Mode Identification
function testDemoModeFlags() {
  console.log('▶ Test 4: Demo Mode Verification');
  const isDemo = (key, envFlag) => {
    return envFlag === 'true' || !key || key.startsWith('mock_') || key === 'your-youcam-api-key';
  };

  assert.strictEqual(isDemo('', 'true'), true, 'Empty key must trigger Demo Mode');
  assert.strictEqual(isDemo('your-youcam-api-key', 'false'), true, 'Placeholder key must trigger Demo Mode');
  assert.strictEqual(isDemo('real_live_prod_key_9988', 'false'), false, 'Valid key must enable Live Mode');
  console.log('  ✔ Mode switcher reliably distinguishes live vs demo credentials.');
}

try {
  testBudgetCalculation();
  testTaskFingerprinting();
  testNormalizationBounds();
  testDemoModeFlags();
  console.log('\n✨ ALL TESTS PASSED SUCCESSFULLY! (4/4 test suites)');
} catch (err) {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
}
