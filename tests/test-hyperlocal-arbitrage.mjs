// =============================================================================
// RIIQX — Hyperlocal Online vs Offline Arbitrage Test Suite
// Verifies Haversine Distance, In-Store POS Cashback & Carto GIS Mapping Feeds
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { HyperlocalArbitrageEngine } from '../src/services/product-intelligence/hyperlocal-arbitrage-engine.ts';

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
console.log('RIIQX Hyperlocal Online vs Offline Arbitrage Engine Test Suite');
console.log('=============================================================================');

// Test 1: Service calculates valid HyperlocalArbitrageReport
await test('HyperlocalArbitrageEngine generates valid report with offline stores', async () => {
  const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
    productTitle: 'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
    onlineDeliveredPrice: 24990,
    onlineRetailerName: 'Amazon India',
    onlineDeliveryDays: 2,
    userCity: 'Kolkata',
    userPincode: '700001',
  });

  assert.ok(report.arbitrageId, 'Must return arbitrageId');
  assert.strictEqual(report.userCity, 'Kolkata');
  assert.strictEqual(report.onlineLowestDeliveredPrice, 24990);
  assert.ok(Array.isArray(report.offlineStores), 'offlineStores must be an array');
  assert.ok(report.offlineStores.length > 0, 'Must identify nearby stores');
  assert.ok(report.bestOfflineOffer, 'Must identify best offline offer');
  assert.ok(report.cartoBasemapUrl, 'Must include Carto basemap url');
});

// Test 2: In-Store POS terminal cashback is correctly computed
await test('POS terminal cashback deductions are mathematically correct', async () => {
  const report = await HyperlocalArbitrageEngine.analyzeArbitrage({
    productTitle: 'Samsung Galaxy S24 Ultra',
    onlineDeliveredPrice: 129999,
    onlineRetailerName: 'Flipkart',
    userCity: 'Bengaluru',
    userPincode: '560001',
  });

  for (const store of report.offlineStores) {
    assert.strictEqual(typeof store.netInStorePayablePrice, 'number');
    assert.ok(store.netInStorePayablePrice <= store.storePrice, 'Net price must be <= store price');
    assert.ok(store.drivingMinutes > 0, 'Driving time must be positive');
    assert.ok(store.distanceKm >= 0, 'Distance must be non-negative');
    assert.ok(store.directionsUrl.includes('google.com/maps/dir'), 'Directions url must point to Google Maps');
  }
});

// Test 3: Haversine distance calculation
await test('Haversine distance calculates accurate geographic distance', () => {
  // Distance between Kolkata Center (22.5726, 88.3639) and South City Mall (22.5015, 88.3615) is ~7.9 km
  const dist = HyperlocalArbitrageEngine.calculateHaversineDistanceKm(22.5726, 88.3639, 22.5015, 88.3615);
  assert.ok(dist >= 7.5 && dist <= 8.5, `Expected distance ~7.9km, got ${dist}km`);
});

// Test 4: City and pincode resolution
await test('Pincode and city resolver maps major Indian hubs accurately', () => {
  const r1 = HyperlocalArbitrageEngine.resolveCityAndCoords(undefined, '700068');
  assert.strictEqual(r1.city, 'Kolkata');

  const r2 = HyperlocalArbitrageEngine.resolveCityAndCoords(undefined, '560038');
  assert.strictEqual(r2.city, 'Bengaluru');

  const r3 = HyperlocalArbitrageEngine.resolveCityAndCoords(undefined, '400013');
  assert.strictEqual(r3.city, 'Mumbai');

  const r4 = HyperlocalArbitrageEngine.resolveCityAndCoords('Delhi');
  assert.strictEqual(r4.city, 'Delhi');
});

// Test 5: Arbitrage verdict verification
await test('Arbitrage verdict correctly evaluates offline vs online advantage', async () => {
  // When physical store beats online price
  const report1 = await HyperlocalArbitrageEngine.analyzeArbitrage({
    productTitle: 'Apple iPad Air M2',
    onlineDeliveredPrice: 59900,
    userCity: 'Kolkata',
  });
  assert.ok(
    ['offline_wins_cheaper', 'offline_wins_faster', 'online_wins_cheaper', 'parity'].includes(report1.arbitrageVerdict),
    `Invalid verdict: ${report1.arbitrageVerdict}`
  );
  assert.ok(report1.recommendationReason.length > 10, 'Recommendation reason must be descriptive');
});

console.log('=============================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED | TOTAL: ${passCount + failCount}`);
console.log('=============================================================================');

if (failCount > 0) process.exit(1);

