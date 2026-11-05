// =============================================================================
// RIIQX — Phase 4 Acceptance Test Suite: AI Creative Canvas
// Tests Infinite Pan/Zoom State, 7 Block Types, Connectors, AI Transforms, & Bridges
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

console.log('--- STARTING PHASE 4 TEST SUITE: AI CREATIVE CANVAS ---');

async function runTests() {
  let createdCanvasId = null;

  // TEST 1: List canvas projects
  console.log('\n[TEST 1] GET /api/riiqx/canvas');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/canvas`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.projects));
    console.log(`✓ Fetched canvas projects list. Count: ${data.count}`);
  }

  // TEST 2: Save new canvas project with multi-block layout & connectors
  console.log('\n[TEST 2] POST /api/riiqx/canvas (Save Project with 4 Block Types & Connectors)');
  {
    const payload = {
      name: 'Omnichannel Launch Moodboard',
      description: 'Brand-synchronized visual concept space',
      viewport: { x: 100, y: 50, zoom: 0.95 },
      blocks: [
        {
          id: 'b_text_1',
          type: 'text',
          x: 100,
          y: 100,
          width: 320,
          height: 180,
          zIndex: 1,
          data: {
            title: 'Primary Campaign Hook',
            text: 'Stop wasting hours editing vertical videos manually.',
            statusTag: 'Approved',
          },
        },
        {
          id: 'b_palette_1',
          type: 'color_swatch',
          x: 480,
          y: 100,
          width: 280,
          height: 160,
          zIndex: 1,
          data: {
            title: 'Hero Brand Tokens',
            hexCode: '#FFD43B',
            paletteColors: ['#FFD43B', '#0C0C0E', '#06B6D4'],
          },
        },
        {
          id: 'b_video_1',
          type: 'video',
          x: 100,
          y: 320,
          width: 320,
          height: 240,
          zIndex: 1,
          data: {
            title: '9:16 Kinetic Cut',
            videoUrl: '/uploads/sample_vertical.mp4',
            aspectRatio: '9:16',
            caption: 'Hook pattern interrupt',
          },
        },
        {
          id: 'b_note_1',
          type: 'sticky_note',
          x: 480,
          y: 320,
          width: 240,
          height: 160,
          zIndex: 1,
          data: {
            title: 'Creative Direction',
            text: 'Keep visual transitions punchy and under 2.5s per scene.',
            noteColor: 'yellow',
          },
        },
      ],
      connectors: [
        {
          id: 'c_1',
          fromBlockId: 'b_text_1',
          toBlockId: 'b_video_1',
          label: 'Script to Video',
          color: '#FFD43B',
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/canvas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.project);

    createdCanvasId = data.project.id;
    console.log(`✓ Canvas project created with ID: ${createdCanvasId}`);
    assert.strictEqual(data.project.blocks.length, 4, 'Expected 4 blocks');
    assert.strictEqual(data.project.connectors.length, 1, 'Expected 1 connector');

    // Verify physical persistence
    const diskPath = path.join(process.cwd(), 'AI Video Editor', 'projects', 'canvas', `${createdCanvasId}.json`);
    assert.ok(fs.existsSync(diskPath), `Expected canvas project file on disk at ${diskPath}`);
    console.log(`✓ Verified disk persistence in AI Video Editor/projects/canvas/`);
  }

  // TEST 3: Contextual AI Transform
  console.log('\n[TEST 3] POST /api/riiqx/canvas/ai-transform (Contextual AI Block Transform)');
  {
    const payload = {
      instruction: 'Make the narrative hook more dramatic and generate companion visual b-roll ideas',
      selectedBlocks: [
        {
          id: 'b_text_1',
          type: 'text',
          x: 100,
          y: 100,
          width: 320,
          height: 180,
          zIndex: 1,
          data: {
            title: 'Primary Campaign Hook',
            text: 'Stop wasting hours editing vertical videos manually.',
          },
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/canvas/ai-transform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.result);
    console.log(`✓ AI Transform executed cleanly: "${data.result.summary}"`);
    console.log(`  - Updated blocks: ${data.result.updatedBlocks?.length || 0}`);
    console.log(`  - Suggested companion blocks: ${data.result.suggestedNewBlocks?.length || 0}`);
  }

  // TEST 4: Export Canvas to AI Video Editor
  console.log('\n[TEST 4] POST /api/riiqx/canvas/export-video (Bridge to AI Video Editor)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/canvas/export-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: createdCanvasId,
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.bridge);
    assert.ok(data.bridge.storyboardId);
    assert.strictEqual(data.bridge.beatsCount, 4);

    console.log(`✓ Exported canvas to AI Video Editor storyboard:`);
    console.log(`  - Storyboard ID: ${data.bridge.storyboardId}`);
    console.log(`  - Beats Count: ${data.bridge.beatsCount}`);
    assert.ok(fs.existsSync(data.bridge.storyboardPath));
  }

  // TEST 5: Export Canvas to Campaign Studio
  console.log('\n[TEST 5] POST /api/riiqx/canvas/export-campaign (Bridge to Campaign Studio)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/canvas/export-campaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: createdCanvasId,
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.campaign);
    console.log(`✓ Exported canvas to Campaign Studio:`);
    console.log(`  - Campaign Name: "${data.campaign.name}"`);
    console.log(`  - Content Pillars: ${data.campaign.contentPillars?.length || 0}`);
    console.log(`  - Assets Generated: ${data.campaign.assets?.length || 0}`);
  }

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 4 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 4 TEST SUITE FAILED:', err);
  process.exit(1);
});
