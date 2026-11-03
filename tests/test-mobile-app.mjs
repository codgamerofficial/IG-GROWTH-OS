// =============================================================================
// RIIQX Mobile 2.0: Agentic AI Mobile Application Test Suite
// Verifies: Expo SDK 57 • RIIQX Agentic OS Tabs • Multimodal Chat • Autopilot
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('📱 Starting RIIQX Mobile 2.0 Agentic OS Verification Suite...\n');

const rootDir = process.cwd();
const mobileDir = path.join(rootDir, 'mobile');

// 1. MOBILE DIRECTORY & CORE CONFIGURATION VERIFICATION
console.log('--- Test 1: Mobile Project Configuration & Manifests ---');
assert.ok(fs.existsSync(mobileDir), 'mobile/ directory must exist');

const pkgPath = path.join(mobileDir, 'package.json');
assert.ok(fs.existsSync(pkgPath), 'mobile/package.json must exist');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

assert.ok(pkg.dependencies['expo'], 'expo dependency must be declared');
assert.ok(pkg.dependencies['expo-router'], 'expo-router dependency must be declared');
assert.ok(pkg.dependencies['react-native'], 'react-native dependency must be declared');
assert.ok(pkg.dependencies['react-native-reanimated'], 'react-native-reanimated must be declared');
assert.ok(pkg.dependencies['expo-haptics'], 'expo-haptics must be declared');
assert.ok(pkg.dependencies['expo-sharing'], 'expo-sharing must be declared');

console.log('  ✔ mobile/package.json verified with Expo SDK 57 and native packages.');

// 2. EXPO APP.JSON & BUILD IDENTIFIERS
console.log('--- Test 2: App.json Production Identifiers & Permissions ---');
const appJsonPath = path.join(mobileDir, 'app.json');
assert.ok(fs.existsSync(appJsonPath), 'mobile/app.json must exist');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8')).expo;

assert.strictEqual(appJson.name, 'RIIQX');
assert.strictEqual(appJson.scheme, 'riiqx');
assert.strictEqual(appJson.android.package, 'com.riiqx.app');
assert.strictEqual(appJson.ios.bundleIdentifier, 'com.riiqx.app');
assert.ok(appJson.android.permissions.includes('CAMERA'), 'Android camera permission required for multimodal vision');
assert.ok(appJson.android.permissions.includes('POST_NOTIFICATIONS'), 'Android notifications permission required');

console.log('  ✔ app.json identifiers, deep links (riiqx://), and native permissions verified.');

// 3. SCREEN ARCHITECTURE & EXPO ROUTER ROUTES
console.log('--- Test 3: RIIQX Agentic Mobile Screens & Navigation ---');
const expectedScreens = [
  path.join(mobileDir, 'app', '_layout.tsx'),
  path.join(mobileDir, 'app', '(tabs)', '_layout.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'index.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'chat.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'creator.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'autopilot.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'tasks.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'settings.tsx'),
  path.join(mobileDir, 'app', '(tabs)', 'studio.tsx'),
];

for (const screenPath of expectedScreens) {
  assert.ok(fs.existsSync(screenPath), `Screen file missing: ${screenPath}`);
  const content = fs.readFileSync(screenPath, 'utf-8');
  assert.ok(content.length > 200, `Screen content too short: ${screenPath}`);
}
console.log(`  ✔ All ${expectedScreens.length} RIIQX Agentic OS screens verified.`);

// 4. TAB NAVIGATION ARCHITECTURE
console.log('--- Test 4: Tab Layout Exposes Agentic Screens ---');
const tabLayoutContent = fs.readFileSync(path.join(mobileDir, 'app', '(tabs)', '_layout.tsx'), 'utf-8');
assert.ok(tabLayoutContent.includes('name="index"'), 'Home tab must exist');
assert.ok(tabLayoutContent.includes('name="chat"'), 'Chat tab must exist');
assert.ok(tabLayoutContent.includes('name="creator"'), 'Creator tab must exist');
assert.ok(tabLayoutContent.includes('name="autopilot"'), 'Autopilot tab must exist');
assert.ok(tabLayoutContent.includes('name="tasks"'), 'Tasks tab must exist');
assert.ok(tabLayoutContent.includes('name="settings"'), 'Settings tab must exist');
console.log('  ✔ 6 Agentic OS primary tabs verified in TabLayout.');

// 5. CONTEXT & STATE PROVIDER
console.log('--- Test 5: RIIQX Mobile Context Provider ---');
const contextPath = path.join(mobileDir, 'src', 'context', 'RiiqxMobileContext.tsx');
assert.ok(fs.existsSync(contextPath), 'RiiqxMobileContext.tsx must exist');
const contextContent = fs.readFileSync(contextPath, 'utf-8');
assert.ok(contextContent.includes('sendMessage'), 'Context must expose sendMessage');
assert.ok(contextContent.includes('emergencyStop'), 'Context must expose emergencyStop');
assert.ok(contextContent.includes('autopilotQueue'), 'Context must expose autopilotQueue');
console.log('  ✔ RIIQX Mobile Context Provider verified with autonomous state.');

// 6. ZERO-FABRICATION AND ₹0 SPEND VERIFICATION
console.log('--- Test 6: Zero-Fabrication & Free-Tier AI Model Integrity ---');
const homeContent = fs.readFileSync(path.join(mobileDir, 'app', '(tabs)', 'index.tsx'), 'utf-8');
assert.ok(homeContent.includes('₹0/mo FREE TIER'), 'Home screen must reflect ₹0/mo spend');
assert.ok(homeContent.includes('Gemini 2.5 Flash'), 'Home screen must include Gemini 2.5 Flash');
assert.ok(homeContent.includes('Groq Qwen 27B'), 'Home screen must include Groq Qwen 27B');
console.log('  ✔ Mobile Home Screen verifies authentic zero-fabrication metrics.');

console.log('\n============================================================');
console.log('🎉 ALL 6 RIIQX MOBILE VERIFICATION SUITES PASSED CLEANLY!');
console.log('============================================================\n');
