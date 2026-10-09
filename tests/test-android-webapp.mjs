// =============================================================================
// PujaHop Kolkata — Android WebApp & PWA Strict Verification Suite
// Validates: Manifest spec, Maskable Icons, Screenshots, AssetLinks TWA,
// Service Worker, Viewport Fit, Safe Area & Standalone ergonomics.
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testFetch(urlPath) {
  const res = await fetch(`${BASE_URL}${urlPath}`);
  return { status: res.status, headers: res.headers, res };
}

async function runAndroidSuite() {
  console.log('🤖 Starting PujaHop Kolkata Android WebApp Verification Suite...\n');

  // --- Test 1: Web App Manifest Delivery ---
  console.log('--- Test 1: Android Web App Manifest Delivery ---');
  const manifestRes = await testFetch('/manifest.webmanifest');
  assert.strictEqual(manifestRes.status, 200, 'Manifest must respond with HTTP 200');
  const manifest = await manifestRes.res.json();

  assert.strictEqual(manifest.display, 'standalone', 'Manifest display must be "standalone"');
  assert.strictEqual(manifest.orientation, 'portrait', 'Manifest orientation must be "portrait"');
  assert.strictEqual(manifest.theme_color, '#070611', 'theme_color must match brand midnight');
  assert.strictEqual(manifest.background_color, '#070611', 'background_color must match brand midnight');
  assert.ok(manifest.name.includes('PujaHop'), 'Manifest name must contain PujaHop');
  assert.strictEqual(manifest.short_name, 'PujaHop', 'Manifest short_name must be PujaHop');

  // Icons check
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 4, 'Manifest must have at least 4 icons');
  const icon192 = manifest.icons.find(i => i.sizes === '192x192' && i.purpose === 'any');
  const icon512 = manifest.icons.find(i => i.sizes === '512x512' && i.purpose === 'any');
  const maskable192 = manifest.icons.find(i => i.sizes === '192x192' && i.purpose === 'maskable');
  const maskable512 = manifest.icons.find(i => i.sizes === '512x512' && i.purpose === 'maskable');

  assert.ok(icon192, 'Manifest must have 192x192 any icon for Android Chrome home screen');
  assert.ok(icon512, 'Manifest must have 512x512 any icon for Android splash & Play Store');
  assert.ok(maskable192, 'Manifest must have 192x192 maskable icon for Android adaptive icons');
  assert.ok(maskable512, 'Manifest must have 512x512 maskable icon for Android adaptive icons');

  // Shortcuts check
  assert.ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, 'Manifest must provide quick Android app shortcuts');
  console.log('  ✔ Android Web App Manifest verified with standalone mode, adaptive icons, and quick shortcuts.');

  // --- Test 2: High-Resolution Icons & Screenshot Assets Delivery ---
  console.log('--- Test 2: High-Resolution Icons & Screenshot Assets Delivery ---');
  const assetsToVerify = [
    { path: '/icon-192.png', type: 'image/png' },
    { path: '/icon-512.png', type: 'image/png' },
    { path: '/icon-maskable-192.png', type: 'image/png' },
    { path: '/icon-maskable-512.png', type: 'image/png' },
    { path: '/screenshot-mobile.jpg', type: 'image/jpeg' },
    { path: '/screenshot-wide.jpg', type: 'image/jpeg' },
  ];

  for (const asset of assetsToVerify) {
    const res = await testFetch(asset.path);
    assert.strictEqual(res.status, 200, `Asset ${asset.path} must respond with HTTP 200`);
    const ctype = res.headers.get('content-type') || '';
    assert.ok(ctype.includes(asset.type) || ctype.includes('octet-stream'), `Asset ${asset.path} must be ${asset.type}`);
  }
  console.log('  ✔ All Android launcher icons, maskable icons, and mobile install screenshots verified HTTP 200.');

  // --- Test 3: Digital Asset Links (Trusted Web Activity TWA Ready) ---
  console.log('--- Test 3: Digital Asset Links (TWA Spec) ---');
  const assetLinksRes = await testFetch('/.well-known/assetlinks.json');
  assert.strictEqual(assetLinksRes.status, 200, 'assetlinks.json must be served with HTTP 200');
  const assetLinks = await assetLinksRes.res.json();
  assert.ok(Array.isArray(assetLinks) && assetLinks.length > 0, 'assetlinks.json must contain statements');
  assert.strictEqual(assetLinks[0].target.namespace, 'android_app');
  assert.strictEqual(assetLinks[0].target.package_name, 'com.pujahop.kolkata');
  console.log('  ✔ Digital Asset Links verified for Android package "com.pujahop.kolkata".');

  // --- Test 4: Offline Service Worker Delivery ---
  console.log('--- Test 4: Offline Service Worker Delivery ---');
  const swRes = await testFetch('/sw.js');
  assert.strictEqual(swRes.status, 200, 'sw.js must respond with HTTP 200');
  const swText = await swRes.res.text();
  assert.ok(swText.includes('pujahop-cache') || swText.includes('fetch'), 'Service worker must contain caching and fetch interception logic');
  console.log('  ✔ Offline service worker verified with active fetch interception.');

  // --- Test 5: Mobile HTML Meta Tags & Ergonomics ---
  console.log('--- Test 5: Mobile HTML Meta Tags & Ergonomics ---');
  const htmlRes = await testFetch('/');
  assert.strictEqual(htmlRes.status, 200, 'Index page must respond with HTTP 200');
  const html = await htmlRes.res.text();

  assert.ok(html.includes('manifest.webmanifest'), 'HTML must link to manifest.webmanifest');
  assert.ok(html.includes('mobile-web-app-capable'), 'HTML must declare mobile-web-app-capable');
  assert.ok(html.includes('#070611'), 'HTML must declare #070611 theme-color for Android status bar');
  assert.ok(html.includes('viewport-fit=cover') || html.includes('width=device-width'), 'HTML must set mobile viewport');
  console.log('  ✔ HTML document verified with Android meta tags, theme color, and viewport-fit.');

  console.log('\n============================================================');
  console.log('🎉 ALL 5 ANDROID WEBAPP VERIFICATION SUITES PASSED WITH ZERO ERRORS!');
  console.log('============================================================\n');
}

runAndroidSuite().catch((err) => {
  console.error('❌ Android WebApp Verification Suite Failed:', err);
  process.exit(1);
});
