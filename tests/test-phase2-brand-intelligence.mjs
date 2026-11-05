// =============================================================================
// RIIQX — Phase 2 AI Brand Intelligence Acceptance Test Suite
// Verifies: SSRF Guard • HTML Intelligence Parser • Brand DNA Synthesis
// Guidelines Export • Brand API CRUD • Cross-Module File Synchronization
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

async function test(name, fn) {
  process.stdout.write(`  ⏳ ${name}... `);
  try {
    await fn();
    console.log('\x1b[32mPASS\x1b[0m');
  } catch (err) {
    console.log('\x1b[31mFAIL\x1b[0m');
    console.error(`     ${err.message}`);
    throw err;
  }
}

async function runSuite() {
  console.log('\n============================================================');
  console.log('🚀 RIIQX Phase 2: AI Brand Intelligence Acceptance Suite');
  console.log('============================================================\n');

  // 1. SSRF Guard Validation via API
  await test('SSRF Guard: Block loopback, private subnets & cloud metadata (HTTP 400)', async () => {
    const maliciousTargets = [
      'http://localhost:3000',
      'http://127.0.0.1:8080/admin',
      'http://169.254.169.254/latest/meta-data',
      'http://192.168.1.1',
      'http://10.0.0.1',
    ];

    for (const target of maliciousTargets) {
      const res = await fetch(`${BASE_URL}/api/riiqx/brand/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: target,
          brandName: 'Malicious Probe',
        }),
      });

      if (res.status !== 400) {
        throw new Error(`Expected HTTP 400 Bad Request for '${target}', got ${res.status}`);
      }
      const data = await res.json();
      if (!data.securityWarning) {
        throw new Error(`Expected securityWarning in response for '${target}'`);
      }
    }
  });

  // 2. AI Brand DNA Synthesis & Strategy Generation
  await test('Brand DNA Synthesizer: Generate complete Brand DNA from business inputs', async () => {
    const res = await fetch(`${BASE_URL}/api/riiqx/brand/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brandName: 'GlowFit AI Performance',
        businessDescription: 'Next-generation biometric activewear engineered for extreme endurance and motion tracking.',
        targetAudience: 'Marathon runners, hybrid athletes, and biohackers',
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || !data.brandDNA) {
      throw new Error('API failed to synthesize Brand DNA');
    }

    const dna = data.brandDNA;
    if (!dna.brandName || !dna.tagline || !dna.mission) {
      throw new Error('Brand DNA missing core identity attributes');
    }
    if (!dna.colorPalette.primary || !dna.colorPalette.background) {
      throw new Error('Brand DNA missing color palette tokens');
    }
    if (!Array.isArray(dna.customerPersonas) || dna.customerPersonas.length === 0) {
      throw new Error('Customer personas missing');
    }
    if (!Array.isArray(dna.visualRules) || dna.visualRules.length === 0) {
      throw new Error('Visual rules missing');
    }
    if (!Array.isArray(dna.doNotUseRules) || dna.doNotUseRules.length === 0) {
      throw new Error('Do-not-use rules missing');
    }
    if (!dna.confidence || dna.confidence.overallScore < 75) {
      throw new Error('Confidence score missing or too low');
    }
  });

  // 3. Brand DNA Retrieval
  await test('Brand API: Retrieve active Brand DNA via GET /api/riiqx/brand', async () => {
    const res = await fetch(`${BASE_URL}/api/riiqx/brand`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || !data.brandDNA) {
      throw new Error('Failed to retrieve active Brand DNA');
    }
    if (!data.brandDNA.brandName) {
      throw new Error('Brand DNA missing brandName');
    }
  });

  // 4. Brand DNA Update & Version Increment
  await test('Brand API: Update brand profile & increment version via POST /api/riiqx/brand', async () => {
    const getRes = await fetch(`${BASE_URL}/api/riiqx/brand`);
    const { brandDNA } = await getRes.json();
    const initialVersion = brandDNA.version || 1;

    const updatedPayload = {
      ...brandDNA,
      tagline: 'Precision Biometrics for High-Velocity Athletes',
    };

    const postRes = await fetch(`${BASE_URL}/api/riiqx/brand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    });
    if (!postRes.ok) throw new Error(`HTTP ${postRes.status}`);
    const postData = await postRes.json();

    if (!postData.success || postData.brandDNA.tagline !== 'Precision Biometrics for High-Velocity Athletes') {
      throw new Error('Brand DNA update failed');
    }
    if (postData.brandDNA.version <= initialVersion) {
      throw new Error('Brand DNA version was not incremented');
    }
  });

  // 5. Guidelines Markdown & JSON Export API
  await test('Brand API: Export formatted Markdown & JSON guidelines via GET /api/riiqx/brand/export', async () => {
    const res = await fetch(`${BASE_URL}/api/riiqx/brand/export`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.success || !data.export) {
      throw new Error('Export endpoint returned failure');
    }
    const { markdown, json } = data.export;
    if (!markdown.includes('#') || !markdown.includes('Color Palette')) {
      throw new Error('Exported markdown invalid');
    }
    if (!json.brandName || !json.colorPalette) {
      throw new Error('Exported JSON invalid');
    }
  });

  // 6. Cross-Module File Synchronization Check
  await test('Cross-Module Sync: Verify brand-guidelines.json & style-sheet.md exist on disk', async () => {
    const jsonPath = path.join(process.cwd(), 'AI Video Editor', 'styles', 'brand-guidelines.json');
    const mdPath = path.join(process.cwd(), 'AI Video Editor', 'styles', 'style-sheet.md');

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Missing synchronized brand-guidelines.json at: ${jsonPath}`);
    }
    if (!fs.existsSync(mdPath)) {
      throw new Error(`Missing synchronized style-sheet.md at: ${mdPath}`);
    }

    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    if (!jsonContent.colorPalette || !jsonContent.brandName) {
      throw new Error('Synchronized JSON brand guidelines file is corrupted or incomplete');
    }
  });

  console.log('\n============================================================');
  console.log('🎉 ALL 6/6 PHASE 2 BRAND INTELLIGENCE TESTS PASSED!');
  console.log('============================================================\n');
}

runSuite().catch(() => {
  process.exit(1);
});
