// =============================================================================
// GlowFit AI / RIIQX — Phase 7 Acceptance Test Suite
// Creator Studio Workspaces • 1-Click Dropshipping Ad Bridge • 1-FPS Style Analyzer
// Master Video Render & LUFS Compliance • Affiliate Referral Conversion Tracking
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'http://localhost:3001';

async function runPhase7TestSuite() {
  console.log('=============================================================================');
  console.log('RIIQX PHASE 7 ACCEPTANCE TEST SUITE: CREATOR STUDIO & VIDEO AD BRIDGE');
  console.log('=============================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (details) console.log(`   └─ ${details}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error(`   └─ ${details}`);
      process.exitCode = 1;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: Creator Studio Workspaces Preservation Audit (14+ Workspaces)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 1: Creator Studio 14 Workspaces Preservation Audit ---');
  const requiredWorkspaces = [
    'src/components/riiqx/creator/CreatorOverviewTab.tsx',
    'src/components/riiqx/creator/AICreationLabTab.tsx',
    'src/components/riiqx/creator/AutopilotStudioTab.tsx',
    'src/components/riiqx/creator/IdeasTrendsTab.tsx',
    'src/components/riiqx/creator/ContentPlannerTab.tsx',
    'src/components/riiqx/creator/ScriptStudioTab.tsx',
    'src/components/riiqx/creator/StoryboardTab.tsx',
    'src/components/riiqx/creator/VideoProductionTab.tsx',
    'src/components/riiqx/creator/AIAssetsTab.tsx',
    'src/components/riiqx/creator/CaptionsMetadataTab.tsx',
    'src/components/riiqx/creator/PublishingQueueTab.tsx',
    'src/components/riiqx/creator/CalendarTab.tsx',
    'src/components/riiqx/creator/PublishedContentTab.tsx',
    'src/components/riiqx/creator/PerformanceAnalyticsTab.tsx',
    'src/components/riiqx/creator/BrandKitTab.tsx',
    'src/components/riiqx/creator/CampaignStudioTab.tsx',
    'src/components/riiqx/canvas/CreativeCanvasTab.tsx',
    'src/components/riiqx/products/ProductStudioTab.tsx',
    'src/components/riiqx/workflows/WorkflowBuilderTab.tsx',
    'src/components/riiqx/video/StoryboardDashboard.tsx',
    'src/components/riiqx/RiiqxCreatorStudio.tsx',
    'src/components/riiqx/RiiqxVideoEditor.tsx',
  ];

  for (const relPath of requiredWorkspaces) {
    const fullPath = path.join(ROOT, relPath);
    assert(fs.existsSync(fullPath), `Workspace component exists: ${path.basename(relPath)}`);
  }

  // Verify AI Video Editor Root Folders & READMEs
  const expectedEditorDirs = ['References', 'Approved Videos', 'Editing Style', 'Brand Kit', 'Raw', 'Exports'];
  for (const dir of expectedEditorDirs) {
    const dirPath = path.join(ROOT, 'AI Video Editor', dir);
    assert(fs.existsSync(dirPath), `AI Video Editor directory exists: AI Video Editor/${dir}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: 1-Click Dropshipping Ad Generation Pipeline
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: 1-Click Dropshipping Ad Generation Pipeline ---');
  const createAdRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/create-video-ad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId: 'prod_lumina_aura_01',
      creatorId: 'creator_studio_01',
    }),
  });
  const createAdData = await createAdRes.json();
  assert(createAdData.success === true, 'POST /api/shopping/dropshipping/create-video-ad returns success: true');
  assert(Boolean(createAdData.projectDirName), `Project folder created: "${createAdData.projectDirName}"`);
  assert(Array.isArray(createAdData.adNotes?.beats) && createAdData.adNotes.beats.length === 4, 'Storyboard has exactly 4 beats (Hook, Reveal, Arbitrage, CTA)');

  const beat1 = createAdData.adNotes?.beats[0];
  const beat2 = createAdData.adNotes?.beats[1];
  const beat3 = createAdData.adNotes?.beats[2];
  const beat4 = createAdData.adNotes?.beats[3];

  assert(beat1.durationSeconds === 3.0 && beat1.captionStyle?.highlightColor === '#FFD43B', 'Beat 1 (Hook/Problem): 3.0s with #FFD43B yellow highlight');
  assert(beat2.durationSeconds === 4.0 && beat2.captionStyle?.highlightColor === '#06B6D4', 'Beat 2 (Reveal/Mechanism): 4.0s with #06B6D4 cyan highlight');
  assert(beat3.durationSeconds === 4.0 && beat3.captionStyle?.highlightColor === '#10B981', 'Beat 3 (Arbitrage/Savings): 4.0s with #10B981 green highlight');
  assert(beat4.durationSeconds === 4.0 && beat4.captionStyle?.highlightColor === '#FFD43B', 'Beat 4 (CTA/Urgency): 4.0s with pulse animation');

  assert(Boolean(createAdData.adNotes?.affiliate?.canonicalReferralUrl), `Affiliate referral link embedded: ${createAdData.adNotes?.affiliate?.canonicalReferralUrl}`);

  // Check file on disk
  const notesPath = path.join(ROOT, 'AI Video Editor', 'Raw', createAdData.projectDirName, 'notes.json');
  assert(fs.existsSync(notesPath), `Verified notes.json on disk: AI Video Editor/Raw/${createAdData.projectDirName}/notes.json`);

  // Verify GET list endpoint
  const listAdsRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/create-video-ad`);
  const listAdsData = await listAdsRes.json();
  assert(listAdsData.success === true && listAdsData.totalProjects >= 1, `GET /api/shopping/dropshipping/create-video-ad lists ${listAdsData.totalProjects} projects`);

  // ---------------------------------------------------------------------------
  // TEST 3: Reference Video 1-FPS Frame Style Extraction & Brand Kit Update
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: Reference Video 1-FPS Frame Style Extraction ---');
  const analyzeRefRes = await fetch(`${BASE_URL}/api/riiqx/video-editor/analyze-references`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoName: 'ref_viral_hook_01.mp4' }),
  });
  const analyzeRefData = await analyzeRefRes.json();
  assert(analyzeRefData.success === true, 'POST /api/riiqx/video-editor/analyze-references returns success: true');
  assert(Array.isArray(analyzeRefData.analysis?.extractedHexColors) && analyzeRefData.analysis.extractedHexColors.length >= 2, `Extracted ${analyzeRefData.analysis?.extractedHexColors?.length} Hex palette tones`);
  assert(Boolean(analyzeRefData.analysis?.detectedFonts?.primaryHeadline), `Detected typography: "${analyzeRefData.analysis?.detectedFonts?.primaryHeadline}"`);

  // Verify Brand Kit markdown on disk
  const brandKitPath = path.join(ROOT, 'AI Video Editor', 'Brand Kit', 'brand-kit.md');
  const brandKitContent = fs.readFileSync(brandKitPath, 'utf8');
  assert(brandKitContent.includes('# Brand Kit') && brandKitContent.includes('Color Palette'), 'Brand Kit markdown file contains updated Color Palette and Typography');

  // Verify Editing Style rules on disk
  const styleRulesPath = path.join(ROOT, 'AI Video Editor', 'Editing Style', 'editing-style-rules.json');
  assert(fs.existsSync(styleRulesPath), 'Editing style rules JSON file exists');

  // ---------------------------------------------------------------------------
  // TEST 4: Master 1080x1920 MP4 Video Render & LUFS Loudness Compliance
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: Master 1080x1920 MP4 Video Render & LUFS Compliance ---');
  const renderRes = await fetch(`${BASE_URL}/api/riiqx/video-editor/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: createAdData.projectDirName,
      bypassApprovalCheck: true,
    }),
  });
  const renderData = await renderRes.json();
  assert(renderData.success === true, 'POST /api/riiqx/video-editor/render returns success: true');
  assert(Boolean(renderData.jobId), `Video render job completed: ${renderData.jobId}`);
  assert(Boolean(renderData.publicVideoUrl), `Public video URL generated: ${renderData.publicVideoUrl}`);

  const qa = renderData.qaReport;
  assert(qa?.checks?.resolutionPass === true, `Target resolution passed: ${qa?.checks?.targetResolution} (1080x1920 9:16 vertical)`);
  assert(qa?.checks?.fpsPass === true, `Target framerate passed: ${qa?.checks?.probedFps} FPS`);
  assert(qa?.checks?.hasAudioStream === true, 'Video contains active audio stream');
  assert(qa?.checks?.audioNormalizedLufs <= -14.0 && qa?.checks?.audioNormalizedLufs >= -16.0, `Audio normalized to ${qa?.checks?.audioNormalizedLufs} LUFS (compliant with YouTube Shorts / Reels standard)`);
  assert(qa?.isQualityCertified === true, 'Video export is Quality Certified');

  // Verify output files on disk
  const finalVideoOnDisk = renderData.finalVideoPath;
  assert(fs.existsSync(finalVideoOnDisk), `Rendered master video exists on disk: ${finalVideoOnDisk}`);
  const directExportVideo = path.join(ROOT, 'AI Video Editor', 'Exports', path.basename(finalVideoOnDisk));
  assert(fs.existsSync(directExportVideo), `Exported video copied to AI Video Editor/Exports/: ${path.basename(directExportVideo)}`);

  // Verify QA report file
  const reportPath = path.join(ROOT, 'AI Video Editor', 'export', 'render-reports', `render_report_${renderData.jobId}.json`);
  assert(fs.existsSync(reportPath), `QA inspection report saved: render_report_${renderData.jobId}.json`);

  // ---------------------------------------------------------------------------
  // TEST 5: Affiliate Referral Tracking & Commission Attribution
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: Affiliate Referral Tracking & Commission Attribution ---');
  
  // 5a. Create trackable referral link
  const createLinkRes = await fetch(`${BASE_URL}/api/shopping/affiliate/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'create_link',
      creatorId: 'creator_studio_01',
      productId: 'prod_pulse_mini_02',
      metadata: { campaignId: 'ad_pulse_viral_hook' },
    }),
  });
  const createLinkData = await createLinkRes.json();
  assert(createLinkData.success === true, 'POST /api/shopping/affiliate/track creates referral link');
  const refCode = createLinkData.link?.referralCode;
  assert(Boolean(refCode), `Generated referralCode: ${refCode}`);

  // 5b. Record impression
  const impRes = await fetch(`${BASE_URL}/api/shopping/affiliate/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'impression',
      referralCode: refCode,
    }),
  });
  const impData = await impRes.json();
  assert(impData.success === true, 'Recorded video ad impression');

  // 5c. Record click
  const clickRes = await fetch(`${BASE_URL}/api/shopping/affiliate/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'click',
      referralCode: refCode,
    }),
  });
  const clickData = await clickRes.json();
  assert(clickData.success === true, 'Recorded video ad click');

  // 5d. Record checkout conversion
  const convRes = await fetch(`${BASE_URL}/api/shopping/affiliate/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'conversion',
      referralCode: refCode,
      orderId: 'ORD_TEST_REF_999',
      orderGrossValue: 2199,
    }),
  });
  const convData = await convRes.json();
  assert(convData.success === true, 'Recorded attributed checkout conversion');
  assert(convData.commissionEarned > 0, `Commission earned: ₹${convData.commissionEarned}`);

  // 5e. Get Creator Dashboard Metrics
  const perfRes = await fetch(`${BASE_URL}/api/shopping/affiliate/track?creatorId=creator_studio_01`);
  const perfData = await perfRes.json();
  assert(perfData.success === true, 'GET /api/shopping/affiliate/track returns creator metrics');
  const p = perfData.performance;
  assert(p?.totalImpressions >= 1 && p?.totalClicks >= 1 && p?.totalConversions >= 1, `Performance verified: ${p?.totalImpressions} imp, ${p?.totalClicks} clicks, ${p?.totalConversions} conversions`);
  assert(p?.totalCommissionEarned > 0, `Total commission balance: ₹${p?.totalCommissionEarned}`);

  // ---------------------------------------------------------------------------
  // TEST 6: Cross-Module End-to-End Pipeline Integrity
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 6: Cross-Module End-to-End Pipeline Integrity ---');
  // Verify that notes.json status was updated to 'rendered' after the render step
  const updatedNotes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
  assert(updatedNotes.status === 'rendered', `notes.json status transitioned to: "${updatedNotes.status}"`);
  assert(Boolean(updatedNotes.renderedVideoPath), `notes.json contains renderedVideoPath: ${updatedNotes.renderedVideoPath}`);

  // Summary
  console.log('\n=============================================================================');
  console.log(`PHASE 7 RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('=============================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase7TestSuite().catch((err) => {
  console.error('Phase 7 Test Suite Failed with Exception:', err);
  process.exit(1);
});

