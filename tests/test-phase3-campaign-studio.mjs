// =============================================================================
// RIIQX — Phase 3 Acceptance Test Suite: AI Campaign Studio
// Tests Brand DNA Injection, Omnichannel Strategy, Asset Editing, and Video Bridge
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

console.log('--- STARTING PHASE 3 TEST SUITE: AI CAMPAIGN STUDIO ---');

async function runTests() {
  let createdCampaignId = null;
  let targetAssetId = null;

  // TEST 1: List campaigns endpoint
  console.log('\n[TEST 1] GET /api/riiqx/campaigns');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Expected success: true');
    assert.ok(Array.isArray(data.campaigns), 'Expected campaigns array');
    console.log(`✓ Fetched campaigns list cleanly. Current count: ${data.count}`);
  }

  // TEST 2: Generate omnichannel campaign
  console.log('\n[TEST 2] POST /api/riiqx/campaigns (Generate Campaign with Brand DNA Injection)');
  {
    const payload = {
      name: 'Autumn Velocity Creator Push',
      objective: 'product_launch',
      targetPlatforms: ['instagram', 'youtube', 'facebook', 'tiktok', 'linkedin'],
      durationDays: 21,
      offerDetails: 'Free access to autonomous AI video editing studio',
      callToAction: 'Claim your studio license today',
      userInstructions: 'Emphasize high retention and fast pacing for video formats',
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Expected success: true');
    assert.ok(data.campaign, 'Expected campaign object');

    createdCampaignId = data.campaign.id;
    console.log(`✓ Campaign generated with ID: ${createdCampaignId}`);
    console.log(`  - Brand Name Injected: "${data.campaign.brandName}"`);
    console.log(`  - Strategy Overview: "${data.campaign.strategyOverview.slice(0, 80)}..."`);
    console.log(`  - Content Pillars Count: ${data.campaign.contentPillars.length}`);
    assert.strictEqual(data.campaign.contentPillars.length, 4, 'Expected exactly 4 content pillars');

    console.log(`  - Assets Generated: ${data.campaign.assets.length}`);
    assert.ok(data.campaign.assets.length >= 4, 'Expected at least 4 platform assets');

    // Find a video asset (Instagram Reels or YouTube Shorts)
    const videoAsset = data.campaign.assets.find(
      (a) => a.platform === 'instagram' || a.platform === 'youtube' || a.platform === 'tiktok'
    );
    assert.ok(videoAsset, 'Expected at least one video asset');
    targetAssetId = videoAsset.id;

    console.log(`  - Selected Video Asset: "${videoAsset.title}" (${videoAsset.platform})`);
    console.log(`  - Hook: "${videoAsset.hookText}"`);
    assert.ok(videoAsset.hookText, 'Expected 3-second hook text');
    assert.ok(videoAsset.contentBody, 'Expected script/content body');

    // Verify disk persistence
    const diskPath = path.join(process.cwd(), 'AI Video Editor', 'projects', 'campaigns', `${createdCampaignId}.json`);
    assert.ok(fs.existsSync(diskPath), `Expected disk file at ${diskPath}`);
    console.log(`✓ Verified disk persistence in AI Video Editor/projects/campaigns/`);
  }

  // TEST 3: Get single campaign by ID
  console.log('\n[TEST 3] GET /api/riiqx/campaigns/:id');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns/${createdCampaignId}`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.campaign.id, createdCampaignId);
    console.log(`✓ Retrieved campaign by ID successfully`);
  }

  // TEST 4: Update asset copy & toggle approval status
  console.log('\n[TEST 4] PATCH /api/riiqx/campaigns/:id/asset (Update Copy & Status)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns/${createdCampaignId}/asset`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assetId: targetAssetId,
        hookText: 'UPDATED: 3 mistakes every creator makes before scaling',
        approvalStatus: 'approved',
      }),
    });

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.asset.hookText, 'UPDATED: 3 mistakes every creator makes before scaling');
    assert.strictEqual(data.asset.approvalStatus, 'approved');
    console.log(`✓ Asset copy updated and approved: "${data.asset.hookText}"`);
  }

  // TEST 5: Push asset to AI Video Editor (Send to Video Editor Bridge)
  console.log('\n[TEST 5] POST /api/riiqx/campaigns/:id/push-video (Bridge to AI Video Editor)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/campaigns/${createdCampaignId}/push-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId: targetAssetId }),
    });

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true, 'Expected bridge success');
    assert.ok(data.bridge, 'Expected bridge payload');
    assert.ok(data.bridge.projectId, 'Expected projectId');
    assert.ok(data.bridge.storyboardId, 'Expected storyboardId');
    assert.strictEqual(data.bridge.beatsCount, 4, 'Expected 4 storyboard beats');

    console.log(`✓ Bridged asset to AI Video Editor:`);
    console.log(`  - Project ID: ${data.bridge.projectId}`);
    console.log(`  - Storyboard ID: ${data.bridge.storyboardId}`);
    console.log(`  - Storyboard Beats Count: ${data.bridge.beatsCount}`);

    // Verify physical files exist
    assert.ok(fs.existsSync(data.bridge.storyboardPath), 'Storyboard file must exist');
    assert.ok(fs.existsSync(data.bridge.projectPath), 'Project file must exist');

    // Read storyboard file to verify Brand DNA tokens were injected
    const sbData = JSON.parse(fs.readFileSync(data.bridge.storyboardPath, 'utf-8'));
    assert.strictEqual(sbData.isApproved, true, 'Expected storyboard to be approved');
    assert.ok(sbData.brandGuidelines.primaryColor, 'Expected brand primary color in storyboard');
    console.log(`  - Brand Guidelines Primary Color injected: ${sbData.brandGuidelines.primaryColor}`);
  }

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 3 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 3 TEST SUITE FAILED:', err);
  process.exit(1);
});
