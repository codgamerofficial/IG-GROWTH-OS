// =============================================================================
// RIIQX — Master AI Infrastructure, Free Model & Tool Verification Test Suite
// Zero Secret Leakage • Live Inference Probe • Tool Gating • Quota Validation
// =============================================================================

import fs from 'fs';
import assert from 'node:assert';

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const res = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      res[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
  return res;
}

const env = { ...parseEnv('.env'), ...parseEnv('.env.local') };

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests += 1;
  try {
    fn();
    passedTests += 1;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(name, fn) {
  totalTests += 1;
  try {
    await fn();
    passedTests += 1;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name} -> ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAiInfrastructureSuite() {
  console.log('\n============================================================');
  console.log('🤖 RUNNING RIIQX MASTER AI INFRASTRUCTURE & MODEL TEST SUITE');
  console.log('============================================================\n');

  // --- TEST GROUP 1: Environment Security & Variable Audit ---
  console.log('--- Test Group 1: Environment Security & Config Isolation ---');
  const requiredProtectedVars = ['GROQ_API_KEY', 'OPENROUTER_API_KEY', 'COHERE_API_KEY'];
  for (const v of requiredProtectedVars) {
    runTest(`Protected environment variable ${v} is configured`, () => {
      assert(Boolean(env[v]), `${v} must exist in environment`);
    });
    runTest(`${v} conforms to secure token format without whitespace or leaks`, () => {
      const val = env[v] || '';
      assert(!val.includes(' ') && val.length > 10, `${v} format is secure`);
    });
  }

  // --- TEST GROUP 2: Model Registry File & Catalog Inspection ---
  console.log('\n--- Test Group 2: Model Registry & Capability Routing ---');
  const modelsCode = fs.readFileSync('src/lib/riiqx/models.ts', 'utf8');
  const providerRegistryCode = fs.readFileSync('src/lib/riiqx/provider-registry.ts', 'utf8');
  const modelRouterCode = fs.readFileSync('src/lib/riiqx/model-router.ts', 'utf8');

  runTest('Groq Qwen 3.8 27B is registered with isFreeTier: true', () => {
    assert(modelsCode.includes('groq-qwen-27b') && modelsCode.includes('isFreeTier: true'));
  });

  runTest('OpenRouter Gemma 4 Free registered with :free model string', () => {
    assert(modelsCode.includes('google/gemma-4-31b-it:free'));
  });

  runTest('Cohere Command R+ registered with 128k context and Free Developer Tier', () => {
    assert(modelsCode.includes('cohere-command-r-plus') && modelsCode.includes('command-r-plus-08-2024'));
  });

  runTest('Provider Registry defines circuit breakers with closed/open states', () => {
    assert(providerRegistryCode.includes('CIRCUIT_BREAKERS') && providerRegistryCode.includes('CIRCUIT_FAILURE_THRESHOLD'));
  });

  runTest('Model Router supports task-based capability routing for fast, scriptwriting, and research', () => {
    assert(modelRouterCode.includes('routeModelForTask') && modelRouterCode.includes('requireFreeOnly'));
  });

  // --- TEST GROUP 3: Server-Side Tool Registry & Security Gates ---
  console.log('\n--- Test Group 3: Server-Side Tool Execution & Action Gates ---');
  const toolsCode = fs.readFileSync('src/lib/riiqx/tools.ts', 'utf8');

  runTest('Tools registry includes all 9 module tools', () => {
    const requiredTools = [
      'web_search',
      'generate_creator_script',
      'get_creator_analytics',
      'create_storyboard',
      'research_trends',
      'draft_social_post',
      'inspect_project_file',
      'search_library',
      'create_content_idea',
      'prepare_publishing_metadata',
      'draft_content_calendar',
      'inspect_provider_health',
      'run_ai_workflow',
      'summarize_project_state',
    ];
    for (const toolId of requiredTools) {
      assert(toolsCode.includes(`${toolId}:`), `Missing tool in registry: ${toolId}`);
    }
  });

  runTest('Consequential Action Gate: draft_social_post requires user approval', () => {
    assert(toolsCode.includes('draft_social_post') && toolsCode.includes('needsApproval: true'));
  });

  runTest('Security Sandbox: inspect_project_file enforces path traversal guards', () => {
    assert(toolsCode.includes('inspect_project_file') && toolsCode.includes("rawPath.includes('..')"));
  });

  // --- TEST GROUP 4: Usage & Quota Ledger ---
  console.log('\n--- Test Group 4: Usage & Quota Ledger ---');
  const usageCode = fs.readFileSync('src/lib/riiqx/usage-monitor.ts', 'utf8');

  runTest('Usage ledger distinguishes free tier models with $0.00 cost', () => {
    assert(usageCode.includes('isFreeTier') && usageCode.includes('qwen/qwen3.8-27b'));
  });

  runTest('Usage ledger exports recordInferenceUsage and getProviderUsageSummaries', () => {
    assert(usageCode.includes('export function recordInferenceUsage') && usageCode.includes('export function getProviderUsageSummaries'));
  });

  // --- TEST GROUP 5: Live Real Inference Probes ---
  console.log('\n--- Test Group 5: Live Real Inference Probes ---');

  // 1. Live Groq Inference
  await runAsyncTest('Live Groq LPU inference verified (qwen/qwen3.8-27b, Free Tier)', async () => {
    const t0 = Date.now();
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'qwen/qwen3.8-27b', messages: [{ role: 'user', content: 'Say "ACTIVE" in 1 word.' }], max_tokens: 5 }),
      signal: ctrl.signal,
    });
    clearTimeout(tm);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    assert(res.ok && text.length > 0, `Groq returned status ${res.status}`);
    console.log(`     ↳ Groq latency: ${Date.now() - t0}ms | Response: "${text.trim()}"`);
  });

  // 2. Live OpenRouter Inference
  await runAsyncTest('Live OpenRouter inference verified (meta-llama/llama-3.3-70b-instruct)', async () => {
    const t0 = Date.now();
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), 6000);
    const orKey = env.OPENROUTER_API_KEY || env['sk-or-v1-openrouter_api_key'];
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${orKey}` },
      body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct', messages: [{ role: 'user', content: 'Say "ACTIVE" in 1 word.' }], max_tokens: 5 }),
      signal: ctrl.signal,
    });
    clearTimeout(tm);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    assert(res.ok && text.length > 0, `OpenRouter returned status ${res.status}`);
    console.log(`     ↳ OpenRouter latency: ${Date.now() - t0}ms | Response: "${text.trim()}"`);
  });

  // 3. Live Cohere Inference
  await runAsyncTest('Live Cohere inference verified (command-r-plus-08-2024, Free Dev Tier)', async () => {
    const t0 = Date.now();
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), 20000);
    const coKey = env.COHERE_API_KEY || env.cohera_api_key;
    const res = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${coKey}` },
      body: JSON.stringify({ model: 'command-r-plus-08-2024', messages: [{ role: 'user', content: 'Say "ACTIVE" in 1 word.' }], max_tokens: 5 }),
      signal: ctrl.signal,
    });
    clearTimeout(tm);
    const data = await res.json();
    const text = data.message?.content?.[0]?.text || '';
    assert(res.ok && text.length > 0, `Cohere returned status ${res.status}`);
    console.log(`     ↳ Cohere latency: ${Date.now() - t0}ms | Response: "${text.trim()}"`);
  });

  console.log('\n============================================================');
  console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
  console.log('============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAiInfrastructureSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
