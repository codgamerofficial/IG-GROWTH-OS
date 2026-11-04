// =============================================================================
// RIIQX — Phase 1 Shared AI Infrastructure Acceptance Test Suite
// Verifies: Capability Discovery • Structured Output • Prompt Engine
// Job Queue Lifecycle & Events • Job Cancellation • Asset Category Service
// =============================================================================

import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001';

async function test(name, fn) {
  process.stdout.write(`  ⏳ ${name}... `);
  try {
    await fn();
    console.log('\x1b[32mPASS\x1b[0m');
  } catch (err) {
    console.log('\x1b[31mFAIL\x1b[0m');
    console.error(`     ${err.message}`);
    throw err;
  }
}

async function runSuite() {
  console.log('\n============================================================');
  console.log('🚀 RIIQX Phase 1: Shared AI Infrastructure Test Suite');
  console.log('============================================================\n');

  let testJobId = null;
  let cancelJobId = null;
  let testAssetId = null;

  // 1. Capability Discovery API
  await test('Capability Discovery: Retrieve all models & capabilities', async () => {
    const res = await fetch(`${BASE_URL}/api/riiqx/ai/capabilities`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || !Array.isArray(data.models)) {
      throw new Error('Invalid response structure from capabilities endpoint');
    }

    const hasGemini = data.models.some((m) => m.modelId === 'gemini-2.5-flash');
    const hasGroq = data.models.some((m) => m.modelId === 'llama-3.3-70b-versatile');
    const hasWhisper = data.models.some((m) => m.modelId === 'whisper-local-native');

    if (!hasGemini || !hasGroq || !hasWhisper) {
      throw new Error('Missing core capability models in registry');
    }

    const gemini = data.models.find((m) => m.modelId === 'gemini-2.5-flash');
    if (!gemini.capabilities.includes('VISION') || !gemini.capabilities.includes('STRUCTURED_OUTPUT')) {
      throw new Error('Gemini capabilities not correctly declared');
    }
  });

  // 2. Prompt Template Engine & Brand DNA Context Injection
  await test('Prompt Template Engine: Render with Brand DNA context injection', async () => {
    const { PromptTemplateEngine } = await import('../src/services/prompts/prompt-template-engine.ts');

    const brandContext = {
      brandName: 'GlowFit AI Activewear',
      toneOfVoice: 'Energetic, confident, empowering',
      brandPersonality: ['Athletic', 'High-Tech', 'Sustainable'],
      colorPalette: { primary: '#FFD43B', secondary: '#0C0C0E', accent: '#06B6D4' },
    };

    const rendered = PromptTemplateEngine.render(
      'CAMPAIGN_STRATEGY',
      {
        objective: 'Product Launch',
        platforms: 'Instagram, YouTube Shorts',
        offer: '20% off Launch Edition',
        callToAction: 'Claim Launch Access',
        language: 'English',
        tone: 'High-energy',
      },
      brandContext
    );

    if (!rendered.userPrompt.includes('GlowFit AI Activewear')) {
      throw new Error('Brand name not injected into prompt');
    }
    if (!rendered.userPrompt.includes('Energetic, confident, empowering')) {
      throw new Error('Brand tone not injected into prompt');
    }
    if (rendered.version !== 1) {
      throw new Error('Template version mismatch');
    }
  });

  // 3. Asynchronous Job Creation via API
  await test('Job Queue: Enqueue new asynchronous campaign job', async () => {
    const res = await fetch(`${BASE_URL}/api/riiqx/ai/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_creator_1',
        jobType: 'campaign_generation',
        payload: {
          brandName: 'RIIQX Creative',
          objective: 'brand_awareness',
        },
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || !data.job || data.job.status !== 'queued') {
      throw new Error('Job was not correctly queued');
    }

    testJobId = data.job.id;
  });

  // 4. Job Event Transitions & Authentic Telemetry via API
  await test('Job Queue: Authentic stage transitions & completion', async () => {
    // Stage 1 update
    const stageRes1 = await fetch(`${BASE_URL}/api/riiqx/ai/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_stage',
        jobId: testJobId,
        stage: 'market_research',
        message: 'Analyzing competitive angle and hashtags...',
        progressPct: 35,
      }),
    });
    const stageData1 = await stageRes1.json();
    if (!stageData1.success || stageData1.job.status !== 'running' || stageData1.job.progressPct !== 35) {
      throw new Error('Job stage transition to running failed');
    }

    // Stage 2 update
    const stageRes2 = await fetch(`${BASE_URL}/api/riiqx/ai/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_stage',
        jobId: testJobId,
        stage: 'content_pillars',
        message: 'Synthesizing 4 core pillars for Instagram & YouTube',
        progressPct: 75,
      }),
    });
    const stageData2 = await stageRes2.json();
    if (!stageData2.success || stageData2.job.progressPct !== 75 || stageData2.job.stageHistory.length < 3) {
      throw new Error('Stage history event was not recorded');
    }

    // Completion
    const compRes = await fetch(`${BASE_URL}/api/riiqx/ai/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'complete',
        jobId: testJobId,
        result: {
          strategyId: 'strat_verified_123',
          pillarsCount: 4,
          totalBriefs: 6,
        },
      }),
    });
    const compData = await compRes.json();
    if (!compData.success || compData.job.status !== 'completed' || compData.job.progressPct !== 100) {
      throw new Error('Job completion state invalid');
    }
  });

  // 5. Job Status Query via API Endpoint
  await test('Job API: Query single job by ID', async () => {
    const res = await fetch(`${BASE_URL}/api/riiqx/ai/jobs/${testJobId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || data.job.id !== testJobId || data.job.status !== 'completed') {
      throw new Error('Job status mismatch on GET /jobs/[id]');
    }
  });

  // 6. Job Cancellation
  await test('Job Queue: Cancel active job gracefully', async () => {
    // Create new job to cancel
    const res = await fetch(`${BASE_URL}/api/riiqx/ai/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_creator_1',
        jobType: 'video_render',
        payload: { videoId: 'vid_123' },
      }),
    });
    const data = await res.json();
    cancelJobId = data.job.id;

    // Send cancellation request
    const cancelRes = await fetch(`${BASE_URL}/api/riiqx/ai/jobs?jobId=${cancelJobId}&reason=User+aborted+render`, {
      method: 'DELETE',
    });
    if (!cancelRes.ok) throw new Error(`HTTP ${cancelRes.status}`);
    const cancelData = await cancelRes.json();

    if (!cancelData.success || cancelData.job.status !== 'cancelled') {
      throw new Error('Job was not marked as cancelled');
    }
  });

  // 7. Asset Category Service & Metadata Registry via API
  await test('Asset Service: Register, filter & manage multi-category assets', async () => {
    const regRes = await fetch(`${BASE_URL}/api/riiqx/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_creator_1',
        category: 'product_images',
        name: 'High-Top Sneaker Studio Front',
        mimeType: 'image/png',
        fileSizeBytes: 1024 * 450,
        publicUrl: '/uploads/products/sneaker_1.png',
        tags: ['footwear', 'studio', 'lifestyle'],
        dimensions: { width: 1080, height: 1080 },
      }),
    });
    if (!regRes.ok) throw new Error(`HTTP ${regRes.status}`);
    const regData = await regRes.json();
    if (!regData.success || !regData.asset || regData.asset.category !== 'product_images') {
      throw new Error('Asset registration failed');
    }
    testAssetId = regData.asset.id;

    // Query filter
    const listRes = await fetch(`${BASE_URL}/api/riiqx/assets?userId=test_creator_1&category=product_images&tag=footwear`);
    if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
    const listData = await listRes.json();
    if (!listData.success || !listData.assets.some((a) => a.id === testAssetId)) {
      throw new Error('Asset filtering failed');
    }

    // Clean up
    const delRes = await fetch(`${BASE_URL}/api/riiqx/assets?assetId=${testAssetId}`, {
      method: 'DELETE',
    });
    if (!delRes.ok) throw new Error(`HTTP ${delRes.status}`);
    const delData = await delRes.json();
    if (!delData.success || !delData.deleted) {
      throw new Error('Asset deletion failed');
    }
  });

  console.log('\n============================================================');
  console.log('🎉 ALL 7/7 PHASE 1 SHARED INFRASTRUCTURE TESTS PASSED!');
  console.log('============================================================\n');
}

runSuite().catch(() => {
  process.exit(1);
});
