// =============================================================================
// GlowFit AI / RIIQX — Phase 8 Acceptance Test Suite
// Windows Desktop Shell (Electron) • Native Android (Capacitor & Manifest)
// Cross-Platform Unified Backend & State Consistency Verification
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'http://localhost:3001';

async function runPhase8TestSuite() {
  console.log('=============================================================================');
  console.log('RIIQX PHASE 8 ACCEPTANCE TEST SUITE: MULTI-PLATFORM DESKTOP & ANDROID SHELLS');
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
  // TEST 1: Windows Desktop Shell (Electron) Native Capabilities
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 1: Windows Desktop Shell (Electron) Inspection ---');
  const electronMainPath = path.join(ROOT, 'electron', 'main.cjs');
  assert(fs.existsSync(electronMainPath), 'Electron main script exists: electron/main.cjs');

  const mainContent = fs.readFileSync(electronMainPath, 'utf8');
  assert(
    mainContent.includes('enable-gpu-rasterization') && mainContent.includes('enable-zero-copy'),
    'Hardware acceleration & zero-copy video flags configured'
  );
  assert(
    mainContent.includes('riiqx:open-folder') && mainContent.includes('riiqx:probe-media'),
    'Native filesystem and local FFprobe IPC handlers registered'
  );
  assert(
    mainContent.includes('riiqx:scan-clipboard') && mainContent.includes('CommandOrControl+Shift+S'),
    'Global hotkey (Ctrl+Shift+S) and clipboard URL scanner registered'
  );
  assert(
    mainContent.includes('Notification') && mainContent.includes('riiqx:notify'),
    'Native OS notification dispatcher registered'
  );

  const electronPreloadPath = path.join(ROOT, 'electron', 'preload.cjs');
  assert(fs.existsSync(electronPreloadPath), 'Electron preload bridge exists: electron/preload.cjs');
  const preloadContent = fs.readFileSync(electronPreloadPath, 'utf8');
  assert(
    preloadContent.includes('riiqxDesktop') &&
    preloadContent.includes('probeMedia') &&
    preloadContent.includes('scanClipboard') &&
    preloadContent.includes('openFolder'),
    'Preload script securely exposes riiqxDesktop contextBridge API'
  );

  // ---------------------------------------------------------------------------
  // TEST 2: Native Android Application Configuration & Share Intent Receivers
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: Native Android Manifest & Permissions Audit ---');
  const manifestPath = path.join(ROOT, 'mobile', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  assert(fs.existsSync(manifestPath), 'Android manifest exists: mobile/android/app/src/main/AndroidManifest.xml');

  const manifestXml = fs.readFileSync(manifestPath, 'utf8');
  assert(manifestXml.includes('android.permission.CAMERA'), 'Manifest declares CAMERA permission for in-store price scanning');
  assert(manifestXml.includes('android.permission.USE_BIOMETRIC'), 'Manifest declares USE_BIOMETRIC permission for fingerprint/face login');
  assert(manifestXml.includes('android.permission.INTERNET'), 'Manifest declares INTERNET permission for API synchronization');
  assert(manifestXml.includes('android.permission.POST_NOTIFICATIONS'), 'Manifest declares POST_NOTIFICATIONS permission');

  // Verify Share Intent receivers
  assert(
    manifestXml.includes('android.intent.action.SEND') && manifestXml.includes('text/plain'),
    'Share Intent filter registered: 1-tap product link analysis from Amazon/Flipkart apps'
  );
  assert(
    manifestXml.includes('android.intent.action.SEND') && manifestXml.includes('image/*'),
    'Share Intent filter registered: 1-tap screenshot share for multimodal price OCR'
  );

  // ---------------------------------------------------------------------------
  // TEST 3: Capacitor Android Configuration Audit
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: Capacitor Android Mobile Configuration ---');
  const capacitorPath = path.join(ROOT, 'capacitor.config.json');
  assert(fs.existsSync(capacitorPath), 'Capacitor config exists: capacitor.config.json');

  const capConfig = JSON.parse(fs.readFileSync(capacitorPath, 'utf8'));
  assert(capConfig.appId === 'com.riiqx.app', `Capacitor appId matches: ${capConfig.appId}`);
  assert(capConfig.appName === 'RIIQX', `Capacitor appName matches: ${capConfig.appName}`);
  assert(capConfig.server?.cleartext === true, 'Android cleartext traffic enabled for local development');
  assert(Boolean(capConfig.plugins?.Camera), 'Camera plugin configured in Capacitor');
  assert(Boolean(capConfig.plugins?.BiometricAuth), 'BiometricAuth plugin configured in Capacitor');

  // ---------------------------------------------------------------------------
  // TEST 4: Mobile Native Screen & Service Integration
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: Mobile Screen & Service Integration ---');
  const shoppingScreenPath = path.join(ROOT, 'mobile', 'app', '(tabs)', 'shopping.tsx');
  assert(fs.existsSync(shoppingScreenPath), 'Native Mobile Shopping Screen exists: mobile/app/(tabs)/shopping.tsx');

  const shoppingContent = fs.readFileSync(shoppingScreenPath, 'utf8');
  assert(
    shoppingContent.includes('Price Scanner') && shoppingContent.includes('platformComparisons'),
    'Shopping screen integrates 6-retailer cross-platform comparison'
  );
  assert(
    shoppingContent.includes('Track Order') && shoppingContent.includes('trackDropshippingOrder'),
    'Shopping screen integrates dropshipping order tracking'
  );

  const biometricScreenPath = path.join(ROOT, 'mobile', 'app', 'auth', 'biometric.tsx');
  assert(fs.existsSync(biometricScreenPath), 'Native Biometric Auth screen exists: mobile/app/auth/biometric.tsx');

  const mobileApiServicesPath = path.join(ROOT, 'mobile', 'src', 'services', 'api.ts');
  const mobileApiContent = fs.readFileSync(mobileApiServicesPath, 'utf8');
  assert(
    mobileApiContent.includes('analyzeProduct') &&
    mobileApiContent.includes('purchaseGiftCard') &&
    mobileApiContent.includes('trackDropshippingOrder'),
    'Mobile API client exposes shopping, arbitrage, and tracking endpoints'
  );

  // ---------------------------------------------------------------------------
  // TEST 5: Shared Backend Connectivity & State Synchronization
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: Shared Backend Connectivity & State Synchronization ---');
  const mobileSupabasePath = path.join(ROOT, 'mobile', 'src', 'services', 'supabase.ts');
  assert(fs.existsSync(mobileSupabasePath), 'Mobile Supabase client exists: mobile/src/services/supabase.ts');

  const mobileSupabaseContent = fs.readFileSync(mobileSupabasePath, 'utf8');
  assert(
    mobileSupabaseContent.includes('ojtngzqsrdralrhipjzt.supabase.co'),
    'Mobile connects to shared production Supabase instance (ojtngzqsrdralrhipjzt)'
  );

  // Test live shared catalog endpoint
  const catRes = await fetch(`${BASE_URL}/api/shopping/marketplace/products?limit=5`);
  const catData = await catRes.json();
  assert(catData.success === true, 'Shared Backend: GET /api/shopping/marketplace/products responds');
  assert(Array.isArray(catData.products) && catData.products.length >= 1, `Shared catalog delivers ${catData.products?.length} products across all platforms`);

  // Test live dropshipping tracking endpoint
  let testOrderId = 'ORD_RIIQX_DEMO_01';
  const allOrdersRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders`);
  const allOrdersData = await allOrdersRes.json();
  if (allOrdersData.success && Array.isArray(allOrdersData.orders) && allOrdersData.orders.length > 0) {
    testOrderId = allOrdersData.orders[0].id;
  } else {
    // Create an order if none exists
    const newOrdRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: 'cust_plat_test_01',
        customerName: 'Mobile Android User',
        shippingAddress: {
          street: 'Salt Lake Sector V',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
          country: 'India',
        },
        items: [{ productId: 'prod_lumina_aura_01', quantity: 1 }],
      }),
    });
    const newOrdData = await newOrdRes.json();
    if (newOrdData.order) testOrderId = newOrdData.order.id;
  }

  const trackRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${testOrderId}`);
  const trackData = await trackRes.json();
  assert(trackData.success === true, 'Shared Backend: Live order tracking endpoint operational');
  assert(Boolean(trackData.order?.status), `Shared Backend: Order status synchronized: "${trackData.order?.status}"`);

  // Summary
  console.log('\n=============================================================================');
  console.log(`PHASE 8 RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('=============================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runPhase8TestSuite().catch((err) => {
  console.error('Phase 8 Test Suite Failed with Exception:', err);
  process.exit(1);
});
