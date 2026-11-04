// =============================================================================
// RIIQX — AI Video Editor Full Pipeline & Acceptance Test Suite
// Verifies Section 17 Mandatory End-to-End Acceptance Requirements
// Toolchain • Workspace • Reference Analyzer • Whisper Word Timestamps
// Mandatory Storyboard Approval Gate • HyperFrames/FFmpeg Render • FFprobe QA
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

async function runAcceptanceTest() {
  console.log('🚀 Running RIIQX AI Video Editor End-to-End Acceptance Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}\n     ${err.message}`);
    }
  }

  // 1. Toolchain Health
  await test('Toolchain Health: Verify Node, HyperFrames, FFmpeg, FFprobe, Python, Whisper, yt-dlp', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/tools');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.allHealthy) throw new Error('Toolchain check did not report allHealthy');
    if (data.tools.length < 7) throw new Error(`Expected at least 7 verified tools, got ${data.tools.length}`);

    const hyperframes = data.tools.find((t) => t.id === 'hyperframes');
    const ffmpeg = data.tools.find((t) => t.id === 'ffmpeg');
    const ffprobe = data.tools.find((t) => t.id === 'ffprobe');
    const whisper = data.tools.find((t) => t.id === 'whisper');
    const ytdlp = data.tools.find((t) => t.id === 'ytdlp');

    if (!hyperframes?.isInstalled || !ffmpeg?.isInstalled || !ffprobe?.isInstalled || !whisper?.isInstalled || !ytdlp?.isInstalled) {
      throw new Error('Missing verified tool in toolchain report');
    }
  });

  // 2. Workspace Structure
  await test('Workspace Inspection: Verify logical & physical AI Video Editor/ structure', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/workspace');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.tree) throw new Error('Invalid workspace tree response');
    const wsDir = path.join(process.cwd(), 'AI Video Editor');
    if (!fs.existsSync(wsDir)) throw new Error('Physical AI Video Editor directory missing on disk');
  });

  // 3. Reference Style Learning & Style Sheet Generation
  await test('Reference Style Analyzer: Analyze reference Reel & generate style-sheet.md', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/reference/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceUrl: 'https://www.youtube.com/shorts/test_reference_reel',
        presetName: 'Autonomous Viral Mindset',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.analysis?.typography || !data.analysis?.colorGrading) {
      throw new Error('Invalid reference style analysis');
    }

    const styleSheet = path.join(process.cwd(), 'AI Video Editor', 'styles', 'style-sheet.md');
    const guidelines = path.join(process.cwd(), 'AI Video Editor', 'styles', 'brand-guidelines.json');
    if (!fs.existsSync(styleSheet) || !fs.existsSync(guidelines)) {
      throw new Error('Generated style-sheet.md or brand-guidelines.json missing on disk');
    }
  });

  // 4. Raw Footage Analysis & Word Timestamps
  let generatedStoryboardId = '';
  await test('Raw Footage Intelligence: FFprobe metadata, Whisper word timestamps & pause detection', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/analyze-footage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoPath: '/uploads/sample_vertical.mp4',
        projectName: 'Autonomous Creator Masterclass',
        aspectRatio: '9:16',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.metadata || !Array.isArray(data.wordTimestamps)) {
      throw new Error('Invalid footage analysis output');
    }
    if (data.wordTimestamps.length === 0) throw new Error('Word timestamps array is empty');
    if (!data.storyboard?.beats || data.storyboard.beats.length === 0) throw new Error('Storyboard beats not generated');

    generatedStoryboardId = data.storyboard.id;
    if (data.storyboard.isApproved !== false) throw new Error('Storyboard should default to unapproved!');
  });

  // 5. Mandatory Checkpoint Gate: Verify Render is BLOCKED before approval
  await test('Approval Checkpoint Gate: Rendering is strictly locked (HTTP 403) before user approval', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bypassApprovalCheck: false,
      }),
    });

    if (res.status !== 403) {
      throw new Error(`Expected HTTP 403 Forbidden for unapproved storyboard, got ${res.status}`);
    }
    const data = await res.json();
    if (data.checkpointPassed === true) throw new Error('Gate allowed render without approval!');
  });

  // 6. Explicit Storyboard Approval
  await test('Storyboard Approval: User reviews and approves the storyboard', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/storyboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        storyboardId: generatedStoryboardId,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.isApproved !== true) throw new Error('Storyboard approval failed');
  });

  // 7. Physical HyperFrames + FFmpeg Render Execution & FFprobe QA Check
  await test('Physical Render Pipeline: HyperFrames + FFmpeg render & FFprobe QA certification', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/video-editor/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bypassApprovalCheck: false,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.videoUrl || !data.qaReport) throw new Error(data.error || 'Render execution failed');

    // Verify QA inspection metrics
    const qa = data.qaReport;
    if (!qa.checks.fileExists || !qa.checks.resolutionPass || !qa.checks.fpsPass || !qa.checks.hasAudioStream) {
      throw new Error(`FFprobe QA failed: ${JSON.stringify(qa.checks)}`);
    }

    // Verify files on disk
    if (!fs.existsSync(data.finalVideoDiskPath)) {
      throw new Error(`Rendered video missing at disk path: ${data.finalVideoDiskPath}`);
    }
  });

  console.log('\n============================================================');
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} AI VIDEO EDITOR TESTS PASSED CLEANLY!`);
  console.log('============================================================\n');

  if (passed !== total) process.exit(1);
}

runAcceptanceTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

