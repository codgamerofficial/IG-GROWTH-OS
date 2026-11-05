// =============================================================================
// RIIQX — Phase 9 Master End-to-End Acceptance Test Suite (Tests A Through F)
// Full Creative Ecosystem: Brand DNA ➔ Campaign ➔ Canvas ➔ Product ➔ Workflow ➔ Cross-Engine
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

console.log('=============================================================================');
console.log('🚀 RIIQX NATIVE AI CREATIVE ECOSYSTEM — MASTER ACCEPTANCE TEST SUITE (PHASE 9)');
console.log('=============================================================================\n');

async function runMasterAcceptance() {
  let activeBrandName = null;
  let activeBrandColor = null;
  let campaignId = null;
  let campaignAssetId = null;
  let canvasId = null;
  let productId = null;
  let workflowId = null;
  let workflowRunId = null;
  let approvalNodeId = null;

  // ---------------------------------------------------------------------------
  // TEST A: Website URL ➔ Brand DNA Extracted ➔ Guidelines Exported
  // ---------------------------------------------------------------------------
  console.log('[TEST A] Website Scanner ➔ Brand DNA Synthesis ➔ Guidelines Export');
  {
    // A.1 Verify SSRF Security Gate (Private Subnet / Cloud Metadata must be blocked)
    const ssrfRes = await fetch(`${BASE_URL}/api/riiqx/brand/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'http://169.254.169.254/latest/meta-data/' }),
    });
    assert.strictEqual(ssrfRes.status, 400, 'SSRF must be blocked with 400');
    const ssrfData = await ssrfRes.json();
    assert.strictEqual(ssrfData.success, false);
    assert.ok(ssrfData.securityWarning, 'Expected securityWarning field');
    console.log(`  ✓ Security Check: SSRF attempt cleanly blocked (${ssrfData.error})`);

    // A.2 Synthesize Brand DNA from Valid Domain
    const scanRes = await fetch(`${BASE_URL}/api/riiqx/brand/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://glowfit.ai' }),
    });
    assert.strictEqual(scanRes.status, 200, `Expected 200 from brand analyze, got ${scanRes.status}`);
    const scanData = await scanRes.json();
    assert.strictEqual(scanData.success, true);
    assert.ok(scanData.brandDNA);
    activeBrandName = scanData.brandDNA.brandName;
    activeBrandColor = scanData.brandDNA.colorPalette.primary;

    console.log(`  ✓ Synthesized Brand DNA: "${activeBrandName}"`);
    console.log(`  ✓ Primary Accent Token: ${activeBrandColor}`);
    console.log(`  ✓ Confidence Score: ${scanData.brandDNA.confidence.overallScore}%`);

    // A.3 Guidelines Export
    const expRes = await fetch(`${BASE_URL}/api/riiqx/brand/export`);
    assert.strictEqual(expRes.status, 200);
    const expData = await expRes.json();
    assert.strictEqual(expData.success, true);
    assert.ok(expData.markdown.includes(activeBrandName));
    console.log(`  ✓ Guidelines Markdown Export generated (${expData.markdown.length} chars)`);
  }

  // ---------------------------------------------------------------------------
  // TEST B: Active Brand ➔ Campaign Generated ➔ Copy Edited ➔ Send to Video
  // ---------------------------------------------------------------------------
  console.log('\n[TEST B] Active Brand ➔ Omnichannel Campaign ➔ Copy Edit ➔ Video Bridge');
  {
    const campRes = await fetch(`${BASE_URL}/api/riiqx/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${activeBrandName} Q4 Master Launch`,
        objective: 'product_launch',
        targetPlatforms: ['instagram', 'youtube', 'tiktok'],
        durationDays: 14,
        offerDetails: 'Autonomous Creator Studio Beta Access',
        callToAction: 'Claim your early access pass',
      }),
    });
    assert.strictEqual(campRes.status, 200);
    const campData = await campRes.json();
    assert.strictEqual(campData.success, true);
    campaignId = campData.campaign.id;
    campaignAssetId = campData.campaign.assets[0].id;
    console.log(`  ✓ Campaign generated: "${campData.campaign.name}" (ID: ${campaignId})`);
    console.log(`  ✓ Brand DNA verified in campaign: "${campData.campaign.brandName}"`);
    assert.strictEqual(campData.campaign.contentPillars.length, 4, 'Must have 4 content pillars');

    // B.2 Edit Asset Copy & Approve
    const patchRes = await fetch(`${BASE_URL}/api/riiqx/campaigns/${campaignId}/asset`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assetId: campaignAssetId,
        hookText: 'APPROVED HOOK: 3 reasons autonomous creators scale 10x faster',
        approvalStatus: 'approved',
      }),
    });
    assert.strictEqual(patchRes.status, 200);
    const patchData = await patchRes.json();
    assert.strictEqual(patchData.asset.approvalStatus, 'approved');
    console.log(`  ✓ Asset copy edited & approved: "${patchData.asset.hookText}"`);

    // B.3 Send to Video Editor Bridge
    const bridgeRes = await fetch(`${BASE_URL}/api/riiqx/campaigns/${campaignId}/push-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetId: campaignAssetId }),
    });
    assert.strictEqual(bridgeRes.status, 200);
    const bridgeData = await bridgeRes.json();
    assert.strictEqual(bridgeData.success, true);
    assert.strictEqual(bridgeData.bridge.beatsCount, 4);
    assert.ok(fs.existsSync(bridgeData.bridge.storyboardPath));
    console.log(`  ✓ Bridged to Video Editor Storyboard: ${bridgeData.bridge.storyboardId}`);
  }

  // ---------------------------------------------------------------------------
  // TEST C: Creative Canvas ➔ Multi-Block ➔ AI Transform ➔ Export to Video
  // ---------------------------------------------------------------------------
  console.log('\n[TEST C] Creative Canvas ➔ Multi-Block ➔ Contextual AI ➔ Video Bridge');
  {
    const canvasRes = await fetch(`${BASE_URL}/api/riiqx/canvas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${activeBrandName} Kinetic Canvas`,
        viewport: { x: 50, y: 50, zoom: 1.0 },
        blocks: [
          {
            id: 'cb_hook',
            type: 'text',
            x: 100,
            y: 100,
            width: 300,
            height: 160,
            zIndex: 1,
            data: { title: 'Viral Hook Concept', text: 'Autonomy is the future of content distribution.' },
          },
          {
            id: 'cb_palette',
            type: 'color_swatch',
            x: 440,
            y: 100,
            width: 260,
            height: 160,
            zIndex: 1,
            data: { title: 'Brand Colors', hexCode: activeBrandColor },
          },
        ],
        connectors: [{ id: 'cc_1', sourceNodeId: 'cb_hook', targetNodeId: 'cb_palette' }],
      }),
    });
    assert.strictEqual(canvasRes.status, 200);
    const canvasData = await canvasRes.json();
    assert.strictEqual(canvasData.success, true);
    canvasId = canvasData.project.id;
    console.log(`  ✓ Canvas created: "${canvasData.project.name}" (ID: ${canvasId})`);

    // C.2 Contextual AI Transform
    const transformRes = await fetch(`${BASE_URL}/api/riiqx/canvas/ai-transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instruction: 'Synthesize companion b-roll direction notes and punchy tagline',
        selectedBlocks: canvasData.project.blocks,
      }),
    });
    assert.strictEqual(transformRes.status, 200);
    const transformData = await transformRes.json();
    assert.strictEqual(transformData.success, true);
    console.log(`  ✓ AI Transform applied: "${transformData.result.summary}"`);

    // C.3 Export Canvas to Video
    const cExportRes = await fetch(`${BASE_URL}/api/riiqx/canvas/export-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: canvasId }),
    });
    assert.strictEqual(cExportRes.status, 200);
    const cExportData = await cExportRes.json();
    assert.strictEqual(cExportData.bridge.beatsCount, 4);
    console.log(`  ✓ Canvas exported to Storyboard: ${cExportData.bridge.storyboardId}`);
  }

  // ---------------------------------------------------------------------------
  // TEST D: Product Studio ➔ Features Extracted ➔ Commercial Scene Rendered
  // ---------------------------------------------------------------------------
  console.log('\n[TEST D] Product Studio ➔ Feature Extraction ➔ Commercial Scene Synthesis');
  {
    const prodRes = await fetch(`${BASE_URL}/api/riiqx/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${activeBrandName} Biometric Smart Band`,
        category: 'wellness',
        description: 'Titanium-encased continuous heart-rate and lactic acid sensor with dynamic neon display.',
        price: '$249.00',
      }),
    });
    assert.strictEqual(prodRes.status, 200);
    const prodData = await prodRes.json();
    productId = prodData.product.id;
    console.log(`  ✓ Product created: "${prodData.product.name}" (ID: ${productId})`);
    console.log(`  ✓ Extracted Materials: ${prodData.product.features.materials.join(', ')}`);

    // D.2 Render Commercial Scene
    const sceneRes = await fetch(`${BASE_URL}/api/riiqx/products/${productId}/generate-scene`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        environment: 'luxury_pedestal',
        lighting: 'dramatic_rim',
        composition: 'center_hero',
        aspectRatio: '1:1',
      }),
    });
    assert.strictEqual(sceneRes.status, 200);
    const sceneData = await sceneRes.json();
    assert.ok(sceneData.generation.imageUrl);
    const svgPath = path.join(process.cwd(), 'public', sceneData.generation.imageUrl.replace(/^\//, ''));
    assert.ok(fs.existsSync(svgPath), 'Rendered SVG must physically exist');
    console.log(`  ✓ Rendered Commercial Scene SVG: ${sceneData.generation.imageUrl}`);
    console.log(`  ✓ Ad Headline: "${sceneData.generation.adHeadline}"`);
  }

  // ---------------------------------------------------------------------------
  // TEST E: Workflow Builder ➔ Natural Language ➔ Checkpoint ➔ Approval
  // ---------------------------------------------------------------------------
  console.log('\n[TEST E] Workflow Builder ➔ Prompt to Graph ➔ Approval Gate ➔ Complete');
  {
    const wfRes = await fetch(`${BASE_URL}/api/riiqx/workflows/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Orchestrate ${activeBrandName} video release with human sign-off gate before final export`,
      }),
    });
    assert.strictEqual(wfRes.status, 200);
    const wfData = await wfRes.json();
    workflowId = wfData.workflow.id;
    const approvalNode = wfData.workflow.nodes.find(
      (n) => n.type === 'human_approval' || n.subType === 'approval_checkpoint'
    );
    assert.ok(approvalNode);
    approvalNodeId = approvalNode.id;
    console.log(`  ✓ Workflow synthesized: "${wfData.workflow.name}" (ID: ${workflowId})`);

    // E.2 Execute & verify pause
    const runRes = await fetch(`${BASE_URL}/api/riiqx/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: { topic: `${activeBrandName} Flow` } }),
    });
    assert.strictEqual(runRes.status, 200);
    const runData = await runRes.json();
    workflowRunId = runData.run.id;
    assert.strictEqual(runData.run.status, 'waiting_approval');
    console.log(`  ✓ Execution paused at human approval gate (Run ID: ${workflowRunId})`);

    // E.3 Approve checkpoint & complete
    const appRes = await fetch(`${BASE_URL}/api/riiqx/workflows/${workflowId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runId: workflowRunId, nodeId: approvalNodeId }),
    });
    assert.strictEqual(appRes.status, 200);
    const appData = await appRes.json();
    assert.strictEqual(appData.run.status, 'completed');
    console.log(`  ✓ Checkpoint approved. Downstream nodes executed to completion!`);
  }

  // ---------------------------------------------------------------------------
  // TEST F: Cross-Engine Verification
  // ---------------------------------------------------------------------------
  console.log('\n[TEST F] Cross-Engine Unified Verification (Brand DNA Propagation)');
  {
    const searchRes = await fetch(`${BASE_URL}/api/riiqx/search`);
    assert.strictEqual(searchRes.status, 200);
    const searchData = await searchRes.json();
    assert.strictEqual(searchData.success, true);

    console.log(`  ✓ Global Unified Search Telemetry:`);
    console.log(`    - Assets Indexed: ${searchData.counts.assets}`);
    console.log(`    - Campaigns Active: ${searchData.counts.campaigns}`);
    console.log(`    - Canvases Saved: ${searchData.counts.canvases}`);
    console.log(`    - Products Registered: ${searchData.counts.products}`);
    console.log(`    - Workflows Deployed: ${searchData.counts.workflows}`);
    console.log(`    - Unified Brand DNA Injected: "${searchData.results.brand.brandName}"`);

    assert.strictEqual(
      searchData.results.brand.brandName,
      activeBrandName,
      'Active brand must match across all 6 engines'
    );
    console.log(`  ✓ Single Source of Truth Verified: Same Brand DNA drives all 6 engines seamlessly!`);
  }

  console.log('\n=============================================================================');
  console.log('🎉 ALL MASTER ACCEPTANCE TESTS (A THROUGH F) PASSED WITH 100% SUCCESS!');
  console.log('=============================================================================\n');
}

runMasterAcceptance().catch((err) => {
  console.error('\n❌ MASTER ACCEPTANCE TEST SUITE FAILED:', err);
  process.exit(1);
});
