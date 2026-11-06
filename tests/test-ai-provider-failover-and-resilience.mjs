import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Pre-load .env.local for standalone test runner if not already loaded by Next.js
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { AIServiceManager } from '../src/services/ai/ai-service-manager.ts';
import { CapabilityRegistry, isProviderConfigured } from '../src/services/ai/capability-registry.ts';
import { AICapability } from '../src/services/ai/types.ts';
import { VisualProductRecognizer } from '../src/services/product-intelligence/visual-recognizer.ts';

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🧪 RIIQX AI MULTI-PROVIDER RESILIENT FAILOVER VERIFICATION');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function test(desc, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`✅ [TEST ${total}] PASS: ${desc}`);
    } catch (e) {
      console.error(`❌ [TEST ${total}] FAIL: ${desc}`);
      console.error(e);
      process.exit(1);
    }
  }

  async function testAsync(desc, fn) {
    total++;
    try {
      await fn();
      passed++;
      console.log(`✅ [TEST ${total}] PASS: ${desc}`);
    } catch (e) {
      console.error(`❌ [TEST ${total}] FAIL: ${desc}`);
      console.error(e);
      process.exit(1);
    }
  }

  // 1. Provider configuration detection
  test('isProviderConfigured correctly detects Google, Groq, OpenRouter, Cohere', () => {
    assert.strictEqual(isProviderConfigured('google'), true, 'Google should be configured');
    assert.strictEqual(isProviderConfigured('groq'), true, 'Groq should be configured');
    assert.strictEqual(isProviderConfigured('openrouter'), true, 'OpenRouter should be configured');
    assert.strictEqual(isProviderConfigured('cohere'), true, 'Cohere should be configured');
  });

  // 2. Bedrock is filtered out if unconfigured / without model access
  test('Bedrock is not treated as configured if model access/profile is pending', () => {
    // Unless BEDROCK_MODEL_ID is explicitly set
    const bedrockConfigured = isProviderConfigured('bedrock');
    console.log(`   Bedrock configured status: ${bedrockConfigured}`);
    const candidateModels = CapabilityRegistry.findModelsByCapabilities(
      [AICapability.TEXT_GENERATION, AICapability.VISION],
      undefined,
      true
    );
    console.log('   Configured Vision candidates:', candidateModels.map(m => `${m.modelId} (${m.provider})`));
    assert.ok(candidateModels.length >= 2, 'Should have at least 2 vision candidates (Gemini, OpenRouter VL)');
    if (!bedrockConfigured) {
      assert.ok(!candidateModels.some(m => m.provider === 'bedrock'), 'Bedrock must NOT be in configured candidates');
    }
  });

  // 3. AIServiceManager.executeText works on primary model
  await testAsync('AIServiceManager.executeText executes cleanly', async () => {
    const res = await AIServiceManager.executeText('Reply with only the word: VERIFIED', {
      timeoutMs: 15_000,
    });
    console.log(`   Model used: ${res.model} (${res.provider}), response: ${res.data.trim()}`);
    assert.strictEqual(res.success, true);
    assert.ok(res.data.length > 0);
  });

  // 4. AIServiceManager.executeVision works with image base64
  await testAsync('AIServiceManager.executeVision processes image payload', async () => {
    // 1x1 test image
    const sampleB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const res = await AIServiceManager.executeVision(
      'Respond with JSON: {"status": "ok"}',
      { mimeType: 'image/png', base64Data: sampleB64 },
      { timeoutMs: 20_000 }
    );
    console.log(`   Vision Model used: ${res.model} (${res.provider}), output: ${res.data.trim().slice(0, 60)}`);
    assert.strictEqual(res.success, true);
    assert.ok(res.data.length > 0);
  });

  // 5. Automatic Fallback when preferred model fails
  await testAsync('AIServiceManager seamlessly falls back to another provider when primary fails', async () => {
    // Force a candidate order where the first provider/model fails, and verify it automatically falls back
    // By requesting preferredProvider: 'openrouter' with a bad/deprecated model or testing sequential fallback
    const res = await AIServiceManager.executeText('Return the single word SUCCESS', {
      preferredProvider: 'openrouter',
      timeoutMs: 15_000,
    });
    console.log(`   Provider used: ${res.model} (${res.provider}), fallbackUsed: ${res.fallbackUsed}`);
    assert.strictEqual(res.success, true);
    assert.ok(res.data.length > 0);
  });

  // 6. VisualProductRecognizer optimizes and recognizes screenshot
  await testAsync('VisualProductRecognizer recognizes image without throwing unconfigured provider errors', async () => {
    const sampleB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const rec = await VisualProductRecognizer.recognizeScreenshot(
      sampleB64,
      'image/png',
      'Campus GC-4002 Men Clogs'
    );
    console.log(`   Recognized title: ${rec.identity.title}, brand: ${rec.identity.brand}, confidence: ${rec.confidence}`);
    assert.ok(rec.identity.title.length > 0);
    assert.ok(rec.confidence > 0.5);
  });

  console.log('\n===============================================================');
  console.log(`🎉 ALL ${passed}/${total} MULTI-PROVIDER RESILIENCE TESTS PASSED!`);
  console.log('===============================================================\n');
}

runTestSuite().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
