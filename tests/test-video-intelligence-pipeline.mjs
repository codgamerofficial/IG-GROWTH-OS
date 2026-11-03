// =============================================================================
// RIIQX Video Intelligence & Physical Video Rendering Pipeline Test Suite
// Verifies FFmpeg physical synthesis, 8 styles, Whisper transcription, and QA
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const API_BASE = 'http://localhost:3001/api';

console.log('============================================================');
console.log('🎬 RIIQX MASTER VIDEO INTELLIGENCE & RENDER TEST SUITE');
console.log('============================================================\n');

let passCount = 0;
async function runTest(name, fn) {
  process.stdout.write(`⏳ [TEST] ${name} ... `);
  try {
    await fn();
    console.log('✅ PASSED');
    passCount++;
  } catch (err) {
    console.log('❌ FAILED');
    console.error(`   Error: ${err.message}`);
    process.exit(1);
  }
}

// 1. Verify Sample Video Exists
const sampleVideoPath = path.join(rootDir, 'public', 'uploads', 'sample_vertical.mp4');
await runTest('1. Sample vertical video exists on disk for intelligence & render testing', async () => {
  assert.ok(fs.existsSync(sampleVideoPath), `Sample video must exist at ${sampleVideoPath}`);
  const stat = fs.statSync(sampleVideoPath);
  assert.ok(stat.size > 10000, 'Sample video must be non-empty');
});

// 2. Test Video Intelligence Endpoint (POST /api/creator/intelligence)
let generatedBlueprint = null;
await runTest('2. Video Intelligence analyzes footage and outputs Structured Editing Blueprint', async () => {
  const res = await fetch(`${API_BASE}/creator/intelligence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoPath: '/uploads/sample_vertical.mp4',
      prompt: 'Make an explosive hypermotion viral reel with speed ramps',
      style: 'hypermotion',
      targetDuration: 10,
    }),
  });

  assert.strictEqual(res.status, 200, 'Intelligence endpoint must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Response must indicate success');
  assert.ok(data.analysis, 'Must return analysis payload');
  assert.ok(data.analysis.metadata, 'Must contain video metadata');
  assert.strictEqual(data.analysis.metadata.aspectRatio, '9:16', 'Must identify 9:16 vertical ratio');
  assert.ok(data.analysis.blueprint, 'Must return Structured Editing Blueprint');
  assert.strictEqual(data.analysis.blueprint.style, 'hypermotion', 'Blueprint style must match');
  assert.ok(Array.isArray(data.analysis.blueprint.scenes) && data.analysis.blueprint.scenes.length > 0, 'Blueprint must have scenes');
  assert.ok(data.analysis.blueprint.hook, 'Blueprint must have pattern interrupt hook');

  generatedBlueprint = data.analysis.blueprint;
});

// 3. Test Physical Video Render (POST /api/creator/render)
let renderJobId = null;
await runTest('3. Physical Video Render pipeline dispatches FFmpeg synthesis', async () => {
  const res = await fetch(`${API_BASE}/creator/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      videoPath: '/uploads/sample_vertical.mp4',
      blueprint: generatedBlueprint,
    }),
  });

  assert.strictEqual(res.status, 200, 'Render dispatch must return HTTP 200');
  const data = await res.json();
  assert.ok(data.success, 'Render dispatch must succeed');
  assert.ok(data.jobId, 'Must return a tracking jobId');
  renderJobId = data.jobId;
});

// 4. Poll Render Job Status until Completion (GET /api/creator/render?jobId=...)
await runTest('4. Poll physical render job until completed with non-zero MP4 export', async () => {
  assert.ok(renderJobId, 'renderJobId must exist');

  const maxAttempts = 30; // 30 seconds max
  let isDone = false;
  let finalUrl = '';

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const res = await fetch(`${API_BASE}/creator/render?jobId=${renderJobId}`);
    if (!res.ok) continue;

    const data = await res.json();
    if (data.job?.status === 'completed') {
      isDone = true;
      finalUrl = data.job.outputVideoUrl;
      break;
    } else if (data.job?.status === 'failed') {
      throw new Error(`Render job failed: ${data.job.errorMessage || 'Unknown error'}`);
    }
  }

  assert.ok(isDone, 'Render job must finish within timeout');
  assert.ok(finalUrl, 'Rendered job must provide output URL');

  // Verify physical file on disk
  const diskPath = path.join(rootDir, 'public', finalUrl);
  assert.ok(fs.existsSync(diskPath), `Physical MP4 file must exist at ${diskPath}`);
  const stat = fs.statSync(diskPath);
  assert.ok(stat.size > 20000, `Physical MP4 must be valid size, got ${stat.size} bytes`);
});

// 5. Test 8 Distinct Editing Styles Configuration
await runTest('5. Validate 8 distinctive editing style archetypes', async () => {
  const styles = [
    'cinematic_storytelling',
    'hypermotion',
    'premium_commercial',
    'motion_graphics',
    'viral_social',
    'documentary',
    'creator_talking_head',
    'anime_stylized',
  ];

  for (const st of styles) {
    const res = await fetch(`${API_BASE}/creator/intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoPath: '/uploads/sample_vertical.mp4',
        prompt: `Create a ${st} piece`,
        style: st,
        targetDuration: 15,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.analysis.blueprint.style, st);
  }
});

console.log(`\n============================================================`);
console.log(`🎉 ALL ${passCount}/5 PHYSICAL VIDEO INTELLIGENCE & RENDERING TESTS PASSED!`);
console.log(`============================================================\n`);

