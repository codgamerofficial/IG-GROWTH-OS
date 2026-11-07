// =============================================================================
// RIIQX — Festive Price Drop Sniper & 48-Hour Bank Arbitrage Test Suite
// Verifies Shifting Bank Offer Cycles, Target Price Sniping & Savings Math
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { FestiveDropSniperService } from '../src/services/product-intelligence/festive-drop-sniper.ts';

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
console.log('RIIQX Festive Price Drop Sniper & 48-Hour Bank Rotation Test Suite');
console.log('=============================================================================');

// Test 1: Bank rotation calendar verification
await test('Bank rotation schedule contains 3 valid 48-hour shifting cycles', () => {
  const calendar = FestiveDropSniperService.getBankRotationCalendar();

  assert.strictEqual(calendar.length, 3, 'Must contain 3 cycles (HDFC, ICICI, SBI/Axis)');
  assert.ok(calendar.some((c) => c.bankName.includes('HDFC')), 'Must have HDFC cycle');
  assert.ok(calendar.some((c) => c.bankName.includes('ICICI')), 'Must have ICICI cycle');
  assert.ok(calendar.some((c) => c.bankName.includes('SBI')), 'Must have SBI cycle');

  const activeNow = calendar.filter((c) => c.status === 'active_now');
  assert.strictEqual(activeNow.length, 1, 'Exactly one cycle must be active_now at any time');
});

// Test 2: Dashboard report generation
await test('FestiveDropSniperService generates complete dashboard report', async () => {
  const report = await FestiveDropSniperService.getDashboardReport();

  assert.ok(report.timestamp, 'Report must have timestamp');
  assert.ok(report.currentActiveBank, 'Must have currentActiveBank');
  assert.ok(report.upcomingBank, 'Must have upcomingBank');
  assert.ok(Array.isArray(report.watchlist), 'Watchlist must be an array');
  assert.ok(report.watchlist.length >= 3, 'Watchlist must have at least 3 seeded items');
  assert.ok(report.totalPotentialSavings > 0, 'Total potential savings must be positive');
  assert.strictEqual(typeof report.snipeReadyCount, 'number');
});

// Test 3: Add new sniper target with bank discount computation
await test('addSniperTarget calculates discount cap and net payable accurately', async () => {
  const target = await FestiveDropSniperService.addSniperTarget({
    productTitle: 'Apple iPad Pro 11-inch M4',
    currentPrice: 99900,
    targetPrice: 95000,
    preferredBank: 'HDFC Bank Credit Card',
  });

  assert.ok(target.id.startsWith('snipe_'), 'ID must start with snipe_');
  assert.strictEqual(target.productTitle, 'Apple iPad Pro 11-inch M4');
  assert.strictEqual(target.currentFloorPrice, 99900);
  assert.strictEqual(target.targetSnipePrice, 95000);
  assert.ok(target.netPayableAfterBankDiscount <= target.currentFloorPrice);
  assert.strictEqual(target.potentialSavings, target.currentFloorPrice - target.netPayableAfterBankDiscount);
});

// Test 4: Target hit trigger logic
await test('Target hit trigger accurately flags deals when net payable <= target price', async () => {
  // Case A: High target price where discount satisfies it immediately
  const hitItem = await FestiveDropSniperService.addSniperTarget({
    productTitle: 'Samsung Galaxy Watch 6',
    currentPrice: 18000,
    targetPrice: 17500, // Discount of 10% (1,750) will drop price to ~16,250 <= 17,500!
  });
  assert.strictEqual(hitItem.targetHit, true, 'Item should be flagged as targetHit=true');
  assert.strictEqual(hitItem.status, 'snipe_ready');

  // Case B: Unrealistically low target price where deal is not yet ready
  const pendingItem = await FestiveDropSniperService.addSniperTarget({
    productTitle: 'MacBook Air M3',
    currentPrice: 114900,
    targetPrice: 70000,
  });
  assert.strictEqual(pendingItem.targetHit, false, 'Item should be flagged as targetHit=false');
  assert.strictEqual(pendingItem.status, 'monitoring');
});

console.log('=============================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED | TOTAL: ${passCount + failCount}`);
console.log('=============================================================================');

if (failCount > 0) process.exit(1);

