// =============================================================================
// RIIQX — WhatsApp Pocket Twin Engine Test Suite
// Verifies Meta Cloud API Webhook Handshake, Link Parsing & Markdown Formatting
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { WhatsAppTwinEngine } from '../src/services/messaging/whatsapp-twin-engine.ts';

// Synchronously parse .env.local for standalone test harness
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  }
} catch {
  // Continue
}

let passCount = 0;
let failCount = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    failCount++;
  }
}

console.log('=============================================================================');
console.log('RIIQX WhatsApp Pocket Twin Engine Test Suite');
console.log('=============================================================================');

// Test 1: Webhook Verification Handshake
await test('Webhook verification succeeds with matching verify token', () => {
  const token = process.env.WHATSAPP_VERIFY_TOKEN || 'riiqx_twin_webhook_secret';
  const result = WhatsAppTwinEngine.verifyWebhook('subscribe', token, 'challenge_code_12345');

  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.challenge, 'challenge_code_12345');
});

// Test 2: Webhook Verification Rejection
await test('Webhook verification rejects invalid tokens', () => {
  const result = WhatsAppTwinEngine.verifyWebhook('subscribe', 'wrong_token', 'challenge_code_12345');
  assert.strictEqual(result.isValid, false);
});

// Test 3: Formatting Price Truth WhatsApp message
await test('formatPriceTruthMessage produces valid WhatsApp markdown', () => {
  const msg = WhatsAppTwinEngine.formatPriceTruthMessage({
    productTitle: 'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
    lowestPrice: 15225,
    retailerName: 'Amazon India',
    purchaseUrl: 'https://www.amazon.in/dp/B0C33XX81R',
    bankOfferDescription: 'HDFC Bank Credit Card 10% Instant Discount',
    nearbyInStorePrice: 15490,
  });

  assert.ok(msg.includes('*RIIQX Twin — Verified Price Truth*'), 'Must contain header');
  assert.ok(msg.includes('₹15,225'), 'Must format currency');
  assert.ok(msg.includes('Amazon India'), 'Must include merchant');
  assert.ok(msg.includes('HDFC Bank'), 'Must include bank offer');
  assert.ok(msg.includes('https://www.amazon.in/dp/B0C33XX81R'), 'Must contain direct purchase URL');
});

// Test 4: Formatting Deceptive Fee WhatsApp message
await test('formatDeceptiveFeeMessage creates actionable uncheck guide', () => {
  const msg = WhatsAppTwinEngine.formatDeceptiveFeeMessage({
    merchantName: 'Flipkart',
    publishedTotal: 15999,
    honestPayablePrice: 15249,
    potentialInstantSavings: 750,
    truthScore: 42,
    stepByStepUncheckGuide: [
      'Deselect "Complete Mobile Protection Plan" (saves ₹599)',
      'Uncheck "Donate ₹10 to Flood Relief" (saves ₹10)',
    ],
  });

  assert.ok(msg.includes('42/100'));
  assert.ok(msg.includes('750'));
  assert.ok(msg.includes('Deselect "Complete Mobile Protection Plan"'));
});

// Test 5: Incoming Greeting Message
await test('processIncomingMessage responds to greetings with zero-app onboarding instructions', async () => {
  const response = await WhatsAppTwinEngine.processIncomingMessage({
    from: '919876543210',
    id: 'msg_001',
    timestamp: String(Date.now()),
    type: 'text',
    text: { body: 'Hi Twin!' },
  });

  assert.strictEqual(response.actionType, 'greeting');
  assert.ok(response.responseText.includes('Personal Intelligence Twin on WhatsApp'));
  assert.ok(response.responseText.includes('No app download required'));
});

// Test 6: Image message notification
await test('processIncomingMessage acknowledges incoming checkout screenshot', async () => {
  const response = await WhatsAppTwinEngine.processIncomingMessage({
    from: '919876543210',
    id: 'msg_002',
    timestamp: String(Date.now()),
    type: 'image',
    image: { id: 'media_img_123' },
  });

  assert.strictEqual(response.actionType, 'image_scan');
  assert.ok(response.responseText.includes('Image Received by RIIQX Vision'));
});

console.log('=============================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED | TOTAL: ${passCount + failCount}`);
console.log('=============================================================================');

if (failCount > 0) process.exit(1);
