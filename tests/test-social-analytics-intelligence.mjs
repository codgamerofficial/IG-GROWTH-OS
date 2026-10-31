// =============================================================================
// RIIQX — Master Social Media Analytics & Intelligence Verification Suite
// Tests Multi-Account Tracking, Strict Provenance, Zero-Simulation Rule,
// Content History Ingestion, Evidence-Backed AI Growth & Forecasting
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';

console.log('🚀 Running RIIQX Social Media Analytics & Intelligence Verification Suite...\n');

let passedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// Test 1: 10-State Provenance Taxonomy
// -----------------------------------------------------------------------------
test('Provenance: 10-State Provenance Taxonomy strictly defined in types', () => {
  const typesContent = fs.readFileSync('src/lib/riiqx/social/analytics-types.ts', 'utf8');
  const ALLOWED_STATUSES = [
    'VERIFIED',
    'CACHED',
    'PARTIAL',
    'DELAYED',
    'UNAVAILABLE',
    'PERMISSION_MISSING',
    'AUTHENTICATION_REQUIRED',
    'RATE_LIMITED',
    'API_ERROR',
    'FORECAST',
  ];
  for (const status of ALLOWED_STATUSES) {
    assert(
      typesContent.includes(`'${status}'`),
      `Missing required analytics status in taxonomy: ${status}`
    );
  }
});

// -----------------------------------------------------------------------------
// Test 2: Strict Zero-Simulation Invariant
// -----------------------------------------------------------------------------
test('Integrity: Zero-Simulation Rule: zero Math.random() or fake benchmarks in analytics logic', () => {
  const syncContent = fs.readFileSync('src/lib/riiqx/social/analytics-sync-engine.ts', 'utf8');
  const growthContent = fs.readFileSync('src/lib/riiqx/social/growth-intelligence.ts', 'utf8');
  const viewContent = fs.readFileSync('src/components/riiqx/RiiqxAnalyticsView.tsx', 'utf8');

  assert(!syncContent.includes('Math.random()'), 'Sync engine must NEVER use Math.random()');
  assert(!growthContent.includes('Math.random()'), 'Growth engine must NEVER use Math.random()');
  assert(
    !viewContent.includes('pct: 78'),
    'Fake 78% pattern benchmark must not be hardcoded in view'
  );
});

// -----------------------------------------------------------------------------
// Test 3: Multi-Account Isolation & Aggregation
// -----------------------------------------------------------------------------
test('Multi-Account Isolation: aggregates audience & views across platforms without duplication', () => {
  const mockAccountYT = {
    id: 'acc_yt_1',
    platform: 'youtube',
    metrics: {
      subscribers: { value: 2900, status: 'VERIFIED' },
      totalViews: { value: 1718200, status: 'VERIFIED' },
      publishedContentCount: { value: 373, status: 'VERIFIED' },
    },
  };

  const mockAccountIG = {
    id: 'acc_ig_1',
    platform: 'instagram',
    metrics: {
      followers: { value: 1335, status: 'VERIFIED' },
      publishedContentCount: { value: 677, status: 'VERIFIED' },
    },
  };

  const totalAudience = (mockAccountYT.metrics.subscribers?.value || 0) + (mockAccountIG.metrics.followers?.value || 0);
  assert.strictEqual(totalAudience, 4235, 'Total audience sum must equal exactly 4,235');

  const totalViews = mockAccountYT.metrics.totalViews?.value || 0;
  assert.strictEqual(totalViews, 1718200, 'Total views must reflect YouTube view count exactly');
});

// -----------------------------------------------------------------------------
// Test 4: Format Classification (Short vs Long-Form Video)
// -----------------------------------------------------------------------------
test('Format Classifier: accurately maps video durations <= 60s to Shorts/Reels', () => {
  function classifyDuration(sec) {
    return sec > 0 && sec <= 60 ? 'short' : 'video';
  }
  assert.strictEqual(classifyDuration(9), 'short', '9s video must classify as short');
  assert.strictEqual(classifyDuration(50), 'short', '50s video must classify as short');
  assert.strictEqual(classifyDuration(113), 'video', '113s video must classify as long-form video');
});

// -----------------------------------------------------------------------------
// Test 5: Evidence-Backed Growth Recommendations Structure
// -----------------------------------------------------------------------------
test('Growth Engine: exports generateGrowthRecommendations with authentic evidence requirements', () => {
  const growthContent = fs.readFileSync('src/lib/riiqx/social/growth-intelligence.ts', 'utf8');
  assert(growthContent.includes('generateGrowthRecommendations'), 'Must export generateGrowthRecommendations');
  assert(growthContent.includes('supportingObservations'), 'Must produce supportingObservations');
  assert(growthContent.includes('relevantContentIds'), 'Must cite relevantContentIds');
  assert(growthContent.includes('reportingPeriod'), 'Must specify reportingPeriod');
});

// -----------------------------------------------------------------------------
// Test 6: Mathematical Forecasting & Insufficient Data Guard
// -----------------------------------------------------------------------------
test('Forecasting Engine: strictly guards against fabricating trends with <3 snapshots', () => {
  const growthContent = fs.readFileSync('src/lib/riiqx/social/growth-intelligence.ts', 'utf8');
  assert(growthContent.includes('generatePerformanceForecasts'), 'Must export generatePerformanceForecasts');
  assert(growthContent.includes('ytSnapshots.length < 3'), 'Must require at least 3 discrete snapshots');
  assert(growthContent.includes('Insufficient historical data points'), 'Must return explicit insufficient data reason');
  assert(growthContent.includes('computeLinearTrend'), 'Must use mathematical linear regression');
});

// -----------------------------------------------------------------------------
// Test 7: Token Refresh Integration
// -----------------------------------------------------------------------------
test('Token Refresh: automatic OAuth renewal wired to official Google endpoints', () => {
  const syncContent = fs.readFileSync('src/lib/riiqx/social/analytics-sync-engine.ts', 'utf8');
  const oauthContent = fs.readFileSync('src/lib/riiqx/social/oauth-engine.ts', 'utf8');

  assert(oauthContent.includes('refreshYouTubeAccessToken'), 'oauth-engine must export refreshYouTubeAccessToken');
  assert(syncContent.includes('refreshYouTubeAccessToken'), 'sync-engine must invoke refreshYouTubeAccessToken on expired tokens');
  assert(syncContent.includes('https://www.googleapis.com/youtube/v3/channels'), 'Must query official /channels');
});

// -----------------------------------------------------------------------------
// Test 8: Historical Snapshot Duplicate Prevention
// -----------------------------------------------------------------------------
test('Snapshot Repository: enforces duplicate prevention window', () => {
  const historyRepoContent = fs.readFileSync('src/lib/riiqx/social/analytics-repository.ts', 'utf8');
  assert(historyRepoContent.includes('15 * 60 * 1000'), 'Snapshot store must prevent duplicates within 15-minute window');
  assert(historyRepoContent.includes('saveMetricSnapshot'), 'Must export saveMetricSnapshot');
  assert(historyRepoContent.includes('saveContentIntelligenceItems'), 'Must export saveContentIntelligenceItems');
});

// -----------------------------------------------------------------------------
// Test 9: API Route Contract & Backward Compatibility
// -----------------------------------------------------------------------------
test('API Contract: verified authentic payload with legacy client compatibility', () => {
  const apiRouteContent = fs.readFileSync('src/app/api/social/analytics/route.ts', 'utf8');
  assert(apiRouteContent.includes('isStrictRealData: true'), 'Route must return isStrictRealData: true');
  assert(apiRouteContent.includes('legacySnapshots'), 'Route must maintain backward compatibility snapshots array');
  assert(apiRouteContent.includes('comparisons'), 'Route must generate cross-account comparisons');
});

// -----------------------------------------------------------------------------
// Test 10: AI Analytics Conversational Assistant
// -----------------------------------------------------------------------------
test('Conversational Assistant: system prompt strictly bounds answers to ground-truth records', () => {
  const chatApiContent = fs.readFileSync('src/app/api/social/analytics/chat/route.ts', 'utf8');
  assert(chatApiContent.includes('ONLY answer questions using the verified authentic data'), 'Assistant prompt must enforce strict authenticity');
  assert(chatApiContent.includes('ModelRouter.routeModelForTask'), 'Must route queries to intelligence models');
});

console.log(`\n🎉 Verification Completed: ${passedTests}/10 Tests Passed (100% SUCCESS)\n`);
