// =============================================================================
// RIIQX — Phase 7 Acceptance Test Suite: AI Video Creative Director Integration
// Tests End-to-End Pipeline: Brand DNA ➔ Campaign Asset ➔ Storyboard ➔ FFmpeg Render ➔ Asset Catalog
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

console.log('--- STARTING PHASE 7 TEST SUITE: AI VIDEO CREATIVE DIRECTOR ---');

async function runTests() {
  let campaignId = null;
  let videoAssetId = null;
  let storyboardId = null;

  // STEP 1: Generate Campaign with Brand DNA
  console.log('\n[STEP 1] POST /api/riiqx/campaigns (Generate Campaign with Brand DNA)');
  {
    const payload = {
      name: 'Creative Director Kinetic Launch',
      objective: 'product_launch',
      targetPlatforms: ['instagram', 'youtube'],
      durationDays: 14,
      offerDetails: 'Autonomous Video Generation Masterclass',
      callToAction: 'Watch the full breakdown',
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    campaignId = data.campaign.id;
    videoAssetId = data.campaign.assets[0].id;
    console.log(`✓ Campaign created: ${campaignId}, Asset ID: ${videoAssetId}`);
  }

  // STEP 2: Bridge Asset to AI Video Editor (Creates Pre-Approved Storyboard)
  console.log('\n[STEP 2] POST /api/riiqx/campaigns/:id/push-video (Bridge to Video Storyboard)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns/${campaignId}/push-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId: videoAssetId }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    storyboardId = data.bridge.storyboardId;
    console.log(`✓ Storyboard bridged: ${storyboardId}`);
    console.log(`  - Beats Count: ${data.bridge.beatsCount}`);
    assert.ok(fs.existsSync(data.bridge.storyboardPath));
    assert.ok(fs.existsSync(data.bridge.projectPath));
  }

  // STEP 3: Execute Physical Render via FFmpeg & HyperFrames Pipeline
  console.log('\n[STEP 3] POST /api/riiqx/video-editor/render (Physical Multi-Stream Render & QA)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/video-editor/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyboardId,
        bypassApprovalCheck: false, // Strict Storyboard Gate Verification!
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    console.log(`✓ Video rendering completed successfully!`);
    console.log(`  - Job ID: ${data.jobId}`);
    console.log(`  - Public Video URL: ${data.videoUrl}`);
    console.log(`  - Thumbnail URL: ${data.thumbnailUrl}`);
    console.log(`  - Execution Duration: ${data.executionDurationMs}ms`);

    // Verify physical files on disk
    assert.ok(fs.existsSync(data.finalVideoDiskPath), 'Final MP4 video must physically exist on disk');
    const publicVideoOnDisk = path.join(process.cwd(), 'public', data.videoUrl.replace(/^\//, ''));
    assert.ok(fs.existsSync(publicVideoOnDisk), 'Public web video must physically exist in public/uploads/rendered/');

    // Verify QA inspection metrics
    assert.ok(data.qaReport, 'QA Report must be present');
    assert.strictEqual(data.qaReport.checks.resolutionPass, true, '1080x1920 9:16 resolution must pass');
    assert.strictEqual(data.qaReport.isQualityCertified, true, 'Must be certified');
    console.log(`  - Resolution Verified: ${data.qaReport.checks.probedResolution}`);
    console.log(`  - FPS Verified: ${data.qaReport.checks.probedFps} fps`);
    console.log(`  - File Size: ${data.exportSummary.fileSizeBytes} bytes`);
  }

  // STEP 4: Verify Asset Catalog Registration
  console.log('\n[STEP 4] GET /api/riiqx/assets (Verify Video Catalog Registration)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/assets?category=videos`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    const matchingVideo = data.assets.find((a) => a.metadata?.storyboardId === storyboardId);
    assert.ok(matchingVideo, 'Rendered video must be registered in shared Asset Catalog');
    console.log(`✓ Found newly rendered video in Asset Catalog: "${matchingVideo.name}"`);
  }

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 7 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 7 TEST SUITE FAILED:', err);
  process.exit(1);
});
