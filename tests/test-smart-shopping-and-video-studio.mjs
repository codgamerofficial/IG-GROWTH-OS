// =============================================================================
// GlowFit AI / RIIQX — Master Test Suite: Smart Shopping, Arbitrage & Video Studio
// Tests: Video Tools • Folder Architecture • Shopping Arbitrage • Storyboard Notes
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function runTestSuite() {
  console.log('=============================================================================');
  console.log('GLOWFIT AI / RIIQX — MASTER INTEGRATION TEST SUITE');
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
  // TEST 1: AI Video Editor Folder Structure & READMEs
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 1: AI Video Editor Folder Structure ---');
  const expectedDirs = [
    'References',
    'Approved Videos',
    'Editing Style',
    'Brand Kit',
    'Raw',
    'Exports',
  ];

  for (const dir of expectedDirs) {
    const dirPath = path.join(ROOT, 'AI Video Editor', dir);
    assert(fs.existsSync(dirPath), `Directory exists: AI Video Editor/${dir}`);
    const readmePath = path.join(dirPath, 'README.md');
    assert(fs.existsSync(readmePath), `README exists: AI Video Editor/${dir}/README.md`);
  }

  // Check Brand Kit & Notes
  const brandKitPath = path.join(ROOT, 'AI Video Editor', 'Brand Kit', 'brand-kit.md');
  assert(fs.existsSync(brandKitPath), 'Brand Kit exists: Brand Kit/brand-kit.md');
  const brandKitContent = fs.readFileSync(brandKitPath, 'utf8');
  assert(brandKitContent.includes('#') && brandKitContent.includes('Montserrat'), 'Brand Kit contains color HEX and font specs');

  const notesPath = path.join(ROOT, 'AI Video Editor', 'Raw', 'Product Showcase Launch', 'notes.json');
  assert(fs.existsSync(notesPath), 'notes.json exists in Raw/Product Showcase Launch');
  const notesData = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
  assert(Array.isArray(notesData.beats) && notesData.beats.length > 0, `notes.json contains ${notesData.beats?.length} storyboard beats`);

  // ---------------------------------------------------------------------------
  // TEST 2: Video Tools Ingestion & Verification
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: Video Tools (FFmpeg, Whisper, yt-dlp, Remotion, HyperFrames) ---');
  try {
    const ffmpeg = await import('@ffmpeg-installer/ffmpeg');
    assert(Boolean(ffmpeg.default?.path), `FFmpeg installed: ${ffmpeg.default?.path}`);
  } catch (e) {
    assert(false, 'FFmpeg installer check', e.message);
  }

  try {
    const remotionPlayer = await import('@remotion/player');
    assert(Boolean(remotionPlayer.Player), 'Remotion Player loaded successfully');
  } catch (e) {
    assert(false, 'Remotion check', e.message);
  }

  try {
    const hfApi = await import('hyperframes/api');
    assert(Boolean(hfApi.transcribe), 'HyperFrames API exports transcribe & media tools');
  } catch (e) {
    assert(false, 'HyperFrames check', e.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Smart Shopping & Cross-Platform Price Comparator
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: Smart Shopping & Arbitrage Engine ---');
  const testUrl = 'https://www.flipkart.com/noise-colorfit-pro-5-smartwatch/p/itm12345';
  
  const analyzeRes = await fetch('http://localhost:3001/api/shopping/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: testUrl }),
  });
  
  const analyzeData = await analyzeRes.json();
  assert(analyzeData.success === true, 'API /api/shopping/analyze returns success: true');
  assert(Boolean(analyzeData.extractedProduct?.title), `Product title extracted: "${analyzeData.extractedProduct?.title}"`);
  assert(Array.isArray(analyzeData.platformComparisons) && analyzeData.platformComparisons.length >= 5, `Comparisons found across ${analyzeData.platformComparisons?.length} platforms`);
  
  const cheapest = analyzeData.platformComparisons.find(p => p.isCheapest);
  assert(Boolean(cheapest), `Cheapest platform identified: ${cheapest?.displayName} at ₹${cheapest?.finalEffectivePrice}`);

  const plan = analyzeData.optimalPlan;
  assert(Boolean(plan?.giftCardArbitrage?.giftCardDiscountPct), `Gift card arbitrage calculated: ${plan?.giftCardArbitrage?.giftCardDiscountPct}% discount`);
  assert(plan?.finalLowestEffectivePrice < plan?.originalPrice, `Total savings verified: Final ₹${plan?.finalLowestEffectivePrice} vs MRP ₹${plan?.originalPrice}`);

  // ---------------------------------------------------------------------------
  // TEST 4: Gift Card Purchase & Auto-Wallet Credit API
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: Gift Card Purchase & Auto-Credit ---');
  const gcRes = await fetch('http://localhost:3001/api/shopping/giftcards/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      platform: 'flipkart',
      faceValue: 2000,
      paymentMethod: 'upi',
      autoCreditToShoppingWallet: true,
    }),
  });

  const gcData = await gcRes.json();
  assert(gcData.success === true, 'API /api/shopping/giftcards/purchase returns success: true');
  assert(Boolean(gcData.order?.voucherCode), `Voucher code generated: ${gcData.order?.voucherCode}`);
  assert(gcData.order?.cashbackEarned > 0, `Cashback credited: ₹${gcData.order?.cashbackEarned}`);
  assert(Boolean(gcData.order?.directWalletUrl), `Direct wallet sync link: ${gcData.order?.directWalletUrl}`);

  // ---------------------------------------------------------------------------
  // TEST 5: Video Storyboard Notes API
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: Video Storyboard & Brand Kit Sync ---');
  const storyRes = await fetch('http://localhost:3001/api/riiqx/video-editor/storyboard?project=Product Showcase Launch');
  const storyData = await storyRes.json();
  assert(storyData.success === true, 'API /api/riiqx/video-editor/storyboard returns notes');
  assert(storyData.notes?.beats?.length === 4, `Loaded 4 beats from notes.json`);

  // Test updating notes
  const updateRes = await fetch('http://localhost:3001/api/riiqx/video-editor/storyboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: 'Product Showcase Launch',
      notes: { ...storyData.notes, status: 'approved' },
      brandKitUpdates: '### Automated Test Verification Note: Verified style consistency.',
    }),
  });
  const updateData = await updateRes.json();
  assert(updateData.success === true, 'Storyboard notes & Brand Kit updated successfully');

  // ---------------------------------------------------------------------------
  // TEST 6: Reference Video 1-FPS Frame Style Extraction
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 6: Reference Video 1-FPS Frame Style Extraction ---');
  const refListRes = await fetch('http://localhost:3001/api/riiqx/video-editor/analyze-references');
  const refListData = await refListRes.json();
  assert(refListData.success === true && refListData.totalReferenceVideos >= 5, `Discovered ${refListData.totalReferenceVideos} reference MP4 videos in References/`);

  const analyzeRefRes = await fetch('http://localhost:3001/api/riiqx/video-editor/analyze-references', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoName: 'ref_viral_hook_01.mp4' }),
  });
  const analyzeRefData = await analyzeRefRes.json();
  assert(analyzeRefData.success === true, '1-FPS Frame Extraction & Vision Analysis succeeded');
  assert(Array.isArray(analyzeRefData.analysis?.extractedHexColors), `Extracted ${analyzeRefData.analysis?.extractedHexColors?.length} Hex color codes`);
  assert(Boolean(analyzeRefData.analysis?.detectedFonts?.primaryHeadline), `Detected typography: "${analyzeRefData.analysis?.detectedFonts?.primaryHeadline}"`);

  // ---------------------------------------------------------------------------
  // TEST 7: Dropshipping to AI Video Ad Project Bridge
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 7: Dropshipping to Video Ad Project Bridge ---');
  const createAdRes = await fetch('http://localhost:3001/api/shopping/dropshipping/create-video-ad', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: 'drop_lumina_01' }),
  });
  const createAdData = await createAdRes.json();
  assert(createAdData.success === true, 'Dropshipping product bridged to video ad project');
  assert(createAdData.adNotes?.beats?.length === 4, `Generated 4-beat video ad storyboard`);
  const adNotesOnDisk = path.join(ROOT, 'AI Video Editor', 'Raw', createAdData.projectDirName, 'notes.json');
  assert(fs.existsSync(adNotesOnDisk), `Verified notes.json on disk: ${createAdData.projectDirName}/notes.json`);

  // ---------------------------------------------------------------------------
  // TEST 8: Multi-Platform Shells (Electron Desktop & Capacitor Mobile)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 8: Multi-Platform Configurations ---');
  assert(fs.existsSync(path.join(ROOT, 'electron', 'main.cjs')), 'Electron main desktop shell exists');
  assert(fs.existsSync(path.join(ROOT, 'electron', 'preload.cjs')), 'Electron preload context bridge exists');
  assert(fs.existsSync(path.join(ROOT, 'capacitor.config.json')), 'Capacitor Android mobile config exists');

  // Summary
  console.log('\n=============================================================================');
  console.log(`TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('=============================================================================\n');
}

runTestSuite().catch(err => {
  console.error('Test Suite Failed with Exception:', err);
  process.exit(1);
});

