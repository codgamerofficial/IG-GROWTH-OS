// =============================================================================
// RIIQX Unified Project Recovery & Live Integration Verification Suite
// Tests: Web Backend (3001) · LAN Host Access · Real AI Inference ·
//        Shared Supabase Identity · Autopilot Telemetry · Zero Fake Data
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const API_BASE = 'http://localhost:3001/api';
const LAN_API_BASE = 'http://10.224.192.200:3001/api';

console.log('🧪 Starting RIIQX Unified Web-Mobile Integration Verification Suite...\n');

let passCount = 0;
async function runTest(name, fn) {
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Reason: ${err.message}`);
    process.exit(1);
  }
}

// 1. Shared Supabase Project Reference
await runTest('1. Single Source of Truth: Web and Mobile share identical Supabase Project', async () => {
  const webClient = fs.readFileSync(path.join(process.cwd(), 'src/lib/supabase/client.ts'), 'utf-8');
  const mobileClient = fs.readFileSync(path.join(process.cwd(), 'mobile/src/services/supabase.ts'), 'utf-8');

  assert.ok(webClient.includes('ojtngzqsrdralrhipjzt'), 'Web must point to project ojtngzqsrdralrhipjzt');
  assert.ok(mobileClient.includes('ojtngzqsrdralrhipjzt'), 'Mobile must point to project ojtngzqsrdralrhipjzt');
});

// 2. Mobile API Client Configuration
await runTest('2. Mobile API Client resolves reachable LAN IP and Supabase credentials', async () => {
  const envPath = path.join(process.cwd(), 'mobile/.env.local');
  assert.ok(fs.existsSync(envPath), 'mobile/.env.local must exist');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  assert.ok(envContent.includes('EXPO_PUBLIC_API_URL=http://10.224.192.200:3001/api'), 'LAN host must be configured');
  assert.ok(envContent.includes('ojtngzqsrdralrhipjzt'), 'Supabase URL must be configured');
});

// 3. Live Server Connectivity & Health Telemetry
await runTest('3. Backend /api/riiqx/models reports real online providers with live latency', async () => {
  const res = await fetch(`${API_BASE}/riiqx/models`);
  assert.strictEqual(res.status, 200, 'Server must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Data must have success: true');
  assert.ok(Array.isArray(data.models) && data.models.length > 0, 'Models catalog must exist');
  assert.ok(data.health, 'Health telemetry must exist');

  // Verify at least one provider is online
  const hasOnlineProvider = Object.values(data.health).some((p) => p.status === 'online');
  assert.ok(hasOnlineProvider, 'At least one real AI provider must be online');
});

// 4. Live Server Accessible via LAN IP
await runTest('4. Backend is reachable via development computer LAN IP (10.224.192.200:3001)', async () => {
  const res = await fetch(`${LAN_API_BASE}/riiqx/models`);
  assert.strictEqual(res.status, 200, 'Server must return HTTP 200 via LAN');
  const data = await res.json();
  assert.ok(data.success, 'Data must be valid JSON via LAN');
});

// 5. Live AI Inference
await runTest('5. Live AI Chat Completion with Groq/Gemini via /api/riiqx/chat', async () => {
  const res = await fetch(`${API_BASE}/riiqx/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Say hello in 3 words' }],
      model: 'gemini-25-flash',
    }),
  });
  assert.strictEqual(res.status, 200, 'Chat endpoint must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Inference must be successful');
  assert.ok(data.reply && data.reply.length > 0, 'Inference must produce a reply string');
  assert.ok(data.modelUsed, 'Inference must record model used');
});

// 6. Creator Studio Storyboard Generation
await runTest('6. 14-Stage 9:16 Storyboard Generation via /api/riiqx/creator', async () => {
  const res = await fetch(`${API_BASE}/riiqx/creator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Autonomous Cloud Agents',
      aspectRatio: '9:16',
      durationSeconds: 30,
    }),
  });
  assert.strictEqual(res.status, 200, 'Creator endpoint must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Creator generation must succeed');
  assert.ok(data.storyboard && data.storyboard.scenes.length > 0, 'Storyboard must contain scenes');
});

// 7. Autopilot Level 3 Engine & Circuit Breaker
await runTest('7. Autopilot Level 3 Queue & Emergency Brake via /api/riiqx/autopilot', async () => {
  const res = await fetch(`${API_BASE}/riiqx/autopilot`);
  assert.strictEqual(res.status, 200, 'Autopilot endpoint must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Autopilot query must succeed');
  assert.strictEqual(data.status.autonomousLevel, 3, 'Autopilot must be Level 3');
  assert.ok('isEmergencyStopped' in data.status, 'Circuit breaker state must be reported');
});

// 8. Task Planner Goal Decomposition
await runTest('8. Autonomous Goal Decomposition via /api/riiqx/tasks', async () => {
  const res = await fetch(`${API_BASE}/riiqx/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: 'Launch viral AI productivity series' }),
  });
  assert.strictEqual(res.status, 200, 'Tasks planner must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Goal planning must succeed');
  const steps = data.agentPlan?.steps || data.legacyPlan?.steps;
  assert.ok(steps && steps.length > 0, 'Plan must contain sequential execution steps');
});

// 9. Zero-Fabrication Dashboard Audit
await runTest('9. Mobile Home Screen has zero hardcoded metric values', async () => {
  const homeContent = fs.readFileSync(path.join(process.cwd(), 'mobile/app/(tabs)/index.tsx'), 'utf-8');
  assert.ok(!homeContent.includes('MR BEAN'), 'MR BEAN fake project must be removed');
  assert.ok(!homeContent.includes('50x growth strategi'), 'Fake stock project must be removed');
  assert.ok(homeContent.includes('dashboardMetrics.activeProjectsCount'), 'Must bind to real active projects count');
  assert.ok(homeContent.includes('dashboardMetrics.onlineProvidersCount'), 'Must bind to real live providers count');
});

// 10. Authentication Flow
await runTest('10. Mobile Login Screen uses real Supabase Auth (zero fake credentials)', async () => {
  const loginContent = fs.readFileSync(path.join(process.cwd(), 'mobile/app/auth/login.tsx'), 'utf-8');
  assert.ok(!loginContent.includes('arif@gmail.com'), 'Fake prefilled arif@gmail.com must be removed');
  assert.ok(loginContent.includes('supabase.auth.signInWithPassword'), 'Must invoke real Supabase signIn');
  assert.ok(loginContent.includes('supabase.auth.signUp'), 'Must support real Supabase signUp');
});

console.log(`\n============================================================`);
console.log(`🎉 ALL ${passCount}/10 RIIQX UNIFIED INTEGRATION TESTS PASSED!`);
console.log(`============================================================\n`);

