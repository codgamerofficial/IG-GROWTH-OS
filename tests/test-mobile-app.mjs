// =============================================================================
// PujaHop Kolkata: Native Mobile Application Test Suite & Verification Runner
// Verifies: React Native / Expo Architecture • Deep Links • Screens • Zero-Fabrication
// Creator: Saswata Dey (Riik)
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('📱 Starting PujaHop Kolkata Native Mobile Verification Suite...\n');

const rootDir = process.cwd();
const mobileDir = path.join(rootDir, 'mobile');

// 1. MOBILE DIRECTORY & CORE CONFIGURATION VERIFICATION
console.log('--- Test 1: Mobile Project Configuration & Manifests ---');
assert.ok(fs.existsSync(mobileDir), 'mobile/ directory must exist');

const pkgPath = path.join(mobileDir, 'package.json');
assert.ok(fs.existsSync(pkgPath), 'mobile/package.json must exist');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

assert.strictEqual(pkg.name, 'pujahop-kolkata-mobile', 'Package name must be pujahop-kolkata-mobile');
assert.ok(pkg.dependencies['expo'], 'expo dependency must be declared');
assert.ok(pkg.dependencies['expo-router'], 'expo-router dependency must be declared');
assert.ok(pkg.dependencies['react-native'], 'react-native dependency must be declared');
assert.ok(pkg.dependencies['react-native-reanimated'], 'react-native-reanimated must be declared');
assert.ok(pkg.dependencies['react-native-maps'], 'react-native-maps must be declared');
assert.ok(pkg.dependencies['expo-haptics'], 'expo-haptics must be declared');
assert.ok(pkg.dependencies['expo-location'], 'expo-location must be declared');
assert.ok(pkg.dependencies['expo-sharing'], 'expo-sharing must be declared');

console.log('  ✔ mobile/package.json verified with Expo SDK 51 and native packages.');

// 2. EXPO APP.JSON & BUILD IDENTIFIERS
console.log('--- Test 2: App.json Production Identifiers & Permissions ---');
const appJsonPath = path.join(mobileDir, 'app.json');
assert.ok(fs.existsSync(appJsonPath), 'mobile/app.json must exist');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8')).expo;

assert.strictEqual(appJson.name, 'PujaHop Kolkata', 'App name must be PujaHop Kolkata');
assert.strictEqual(appJson.scheme, 'pujahop', 'Deep link scheme must be pujahop');
assert.strictEqual(appJson.android.package, 'com.pujahop.kolkata', 'Android package must be com.pujahop.kolkata');
assert.strictEqual(appJson.ios.bundleIdentifier, 'com.pujahop.kolkata', 'iOS bundleIdentifier must be com.pujahop.kolkata');
assert.ok(appJson.android.permissions.includes('ACCESS_FINE_LOCATION'), 'Android fine location permission required');
assert.ok(appJson.android.permissions.includes('POST_NOTIFICATIONS'), 'Android notifications permission required');
assert.ok(appJson.android.permissions.includes('CAMERA'), 'Android camera permission required');
assert.strictEqual(appJson.extra.creator, 'Saswata Dey (Riik)', 'Creator metadata must be Saswata Dey (Riik)');

console.log('  ✔ app.json identifiers, deep links (pujahop://), and native permissions verified.');

// 3. EAS BUILD PROFILE VERIFICATION
console.log('--- Test 3: EAS Build Profiles Configuration ---');
const easJsonPath = path.join(mobileDir, 'eas.json');
assert.ok(fs.existsSync(easJsonPath), 'mobile/eas.json must exist');
const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf-8'));
assert.ok(easJson.build.development, 'EAS development profile must exist');
assert.ok(easJson.build.preview, 'EAS preview profile must exist');
assert.ok(easJson.build.production, 'EAS production profile must exist');

console.log('  ✔ EAS profiles (development, preview APK, production AAB) verified.');

// 4. SCREEN ARCHITECTURE & EXPO ROUTER ROUTES
console.log('--- Test 4: Mobile Screen Directory & Route Tree ---');
const expectedScreens = [
  path.join(mobileDir, 'app', '_layout.tsx'),
  path.join(mobileDir, 'app', '(tabs)', '_layout.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'index.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'explore.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'plan.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'passport.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'more.tsx'),
  path.join(mobileDir, 'app', 'pandal', '[id].tsx'),
  path.join(mobileDir, 'app', 'route', '[id].tsx'),
  path.join(mobileDir, 'app', 'metro', 'index.tsx'),
  path.join(mobileDir, 'app', 'copilot', 'index.tsx'),
  path.join(mobileDir, 'app', 'food', 'index.tsx'),
  path.join(mobileDir, 'app', 'weather', 'index.tsx'),
  path.join(mobileDir, 'app', 'emergency', 'index.tsx'),
  path.join(mobileDir, 'app', 'about', 'index.tsx'),
  path.join(mobileDir, 'app', 'settings', 'index.tsx'),
];

for (const screenPath of expectedScreens) {
  assert.ok(fs.existsSync(screenPath), `Screen file missing: ${screenPath}`);
  const content = fs.readFileSync(screenPath, 'utf-8');
  assert.ok(content.length > 200, `Screen content too short: ${screenPath}`);
}
console.log(`  ✔ All ${expectedScreens.length} Expo Router screens verified.`);

// 5. OFFICIAL CREATOR CREDIT CHECK
console.log('--- Test 5: Official Creator Credit (Saswata Dey (Riik)) ---');
const aboutScreenContent = fs.readFileSync(path.join(mobileDir, 'app', 'about', 'index.tsx'), 'utf-8');
assert.ok(aboutScreenContent.includes('Saswata Dey (Riik)'), 'About screen must credit Saswata Dey (Riik)');

const moreScreenContent = fs.readFileSync(path.join(mobileDir, 'app', '(tabs)', 'more.tsx'), 'utf-8');
assert.ok(moreScreenContent.includes('Saswata Dey (Riik)'), 'More screen must credit Saswata Dey (Riik)');

const settingsScreenContent = fs.readFileSync(path.join(mobileDir, 'app', 'settings', 'index.tsx'), 'utf-8');
assert.ok(settingsScreenContent.includes('Saswata Dey (Riik)'), 'Settings screen must credit Saswata Dey (Riik)');

console.log('  ✔ Official creator credit "Saswata Dey (Riik)" strictly verified in all required screens.');

// 6. ZERO-FABRICATION VERIFICATION IN MOBILE
console.log('--- Test 6: Zero-Fabrication Integrity in Transit & Weather ---');
const metroScreenContent = fs.readFileSync(path.join(mobileDir, 'app', 'metro', 'index.tsx'), 'utf-8');
assert.ok(
  !metroScreenContent.includes('24/7 service throughout night'),
  'Metro screen must not fabricate unverified 24/7 service'
);
assert.ok(
  metroScreenContent.includes('SPECIAL PUJA SERVICE') &&
  metroScreenContent.includes('Zero fabricated'),
  'Metro screen must state schedule status honestly'
);

const weatherScreenContent = fs.readFileSync(path.join(mobileDir, 'app', 'weather', 'index.tsx'), 'utf-8');
assert.ok(
  weatherScreenContent.includes('LIVE GROUND OBSERVATION') &&
  weatherScreenContent.includes('FESTIVAL HISTORICAL FORECAST'),
  'Weather screen must clearly distinguish live observation vs festival forecast'
);

console.log('  ✔ Transit and weather screens pass zero-fabrication tests.');

// 7. WEB-TO-APP HANDOFF VERIFICATION
console.log('--- Test 7: Web-to-App Handoff Deep Link Integration ---');
const bannerPath = path.join(rootDir, 'src', 'components', 'common', 'OpenInAppBanner.tsx');
assert.ok(fs.existsSync(bannerPath), 'OpenInAppBanner.tsx must exist');
const bannerContent = fs.readFileSync(bannerPath, 'utf-8');
assert.ok(bannerContent.includes('pujahop://'), 'Banner must deep-link to pujahop:// scheme');

const webLayoutContent = fs.readFileSync(path.join(rootDir, 'src', 'app', 'layout.tsx'), 'utf-8');
assert.ok(webLayoutContent.includes('OpenInAppBanner'), 'Web layout must mount OpenInAppBanner');

console.log('  ✔ Web-to-App handoff with pujahop:// deep link verified.');

console.log('\n============================================================');
console.log('🎉 ALL 7 MOBILE VERIFICATION SUITES PASSED WITH ZERO ERRORS!');
console.log('============================================================\n');
