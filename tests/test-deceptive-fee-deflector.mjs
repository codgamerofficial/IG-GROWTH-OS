// =============================================================================
// RIIQX — Deceptive Fee & Dark Pattern Deflector Test Suite
// Verifies Multimodal Checkout Trap Detection, Sneaky Surcharges, and Truth Math
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { DeceptiveFeeDeflector } from '../src/services/product-intelligence/deceptive-fee-deflector.ts';

// Synchronously parse .env.local for standalone test harness
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  }
} catch {
  // Continue
}

let passCount = 0;
let failCount = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    failCount++;
  }
}

console.log('=============================================================================');
console.log('RIIQX Deceptive Fee & Dark Pattern Deflector Test Suite');
console.log('=============================================================================');

// 1x1 transparent PNG base64 for vision fallback/test payload
const mockCheckoutBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Test 1: Service returns valid DeceptiveFeeAuditResult
await test('DeceptiveFeeDeflector returns valid forensic audit structure', async () => {
  const result = await DeceptiveFeeDeflector.auditCheckoutScreen(
    mockCheckoutBase64,
    'image/png',
    'BookMyShow'
  );

  assert.ok(result.auditId, 'Must have auditId');
  assert.strictEqual(typeof result.truthScore, 'number', 'truthScore must be a number');
  assert.ok(result.truthScore >= 0 && result.truthScore <= 100, 'truthScore must be between 0 and 100');
  assert.ok(Array.isArray(result.deceptiveItems), 'deceptiveItems must be an array');
  assert.ok(Array.isArray(result.stepByStepUncheckGuide), 'stepByStepUncheckGuide must be an array');
  assert.ok(result.stepByStepUncheckGuide.length > 0, 'Must provide at least one uncheck instruction');
});

// Test 2: Mathematical Truth Formula: publishedTotal - removableSurchargesTotal === honestPayablePrice
await test('Deterministic Math: publishedTotal - removableSurchargesTotal equals honestPayablePrice', async () => {
  const result = await DeceptiveFeeDeflector.auditCheckoutScreen(
    mockCheckoutBase64,
    'image/png',
    'Flipkart'
  );

  const calcHonest = Math.max(0, result.publishedTotal - result.removableSurchargesTotal);
  assert.strictEqual(result.honestPayablePrice, calcHonest, 'honestPayablePrice must match formula');
  assert.strictEqual(result.potentialInstantSavings, result.removableSurchargesTotal, 'potentialInstantSavings must equal removable total');
});

// Test 3: Local HTTP API Route Test /api/twin/audit-checkout
await test('POST /api/twin/audit-checkout responds with HTTP 200 and audit result', async () => {
  const res = await fetch('http://localhost:3001/api/twin/audit-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      screenshotBase64: mockCheckoutBase64,
      mimeType: 'image/png',
      merchantHint: 'Zomato Cart',
    }),
  });

  assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
  const data = await res.json();
  assert.strictEqual(data.success, true, 'API response success must be true');
  assert.ok(data.audit, 'Must return audit object');
  assert.ok(data.audit.auditId, 'Must return auditId');
});

// Test 4: Validation error on missing screenshot
await test('POST /api/twin/audit-checkout returns 400 when screenshot is missing', async () => {
  const res = await fetch('http://localhost:3001/api/twin/audit-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.strictEqual(res.status, 400, 'Expected 400 Bad Request');
  const data = await res.json();
  assert.strictEqual(data.success, false, 'Expected success=false');
});

console.log('=============================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED | TOTAL: ${passCount + failCount}`);
console.log('=============================================================================');

if (failCount > 0) process.exit(1);
