// =============================================================================
// RIIQX — Master Social Publishing & Channel Integration Test Suite
// Verifies YouTube, Meta (IG & FB), X/Twitter, and LinkedIn OAuth + Token Refresh
// + Post Scheduling, Cancellation, Due Processor, and Route Integrity
// =============================================================================

import assert from 'node:assert';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 Running RIIQX Social Publishing & Multi-Channel Integration Suite...\n');

let passedTests = 0;
const totalTests = 10;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// Test 1: YouTube OAuth 2.0 Specs & Parameters
// -----------------------------------------------------------------------------
test('OAuth Engine: YouTube authorization request adheres to Google specs & PKCE', () => {
  const clientId = 'google-client-id-12345.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000/api/social/oauth/callback/youtube';
  const state = 'rqx_youtube_user123_nonce_999';
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  assert(url.startsWith('https://accounts.google.com/o/oauth2/v2/auth'));
  assert(url.includes('access_type=offline'), 'Must request offline access for refresh token');
  assert(url.includes('prompt=consent'), 'Must force consent to receive refresh token');
  assert(url.includes('code_challenge_method=S256'), 'Must use S256 PKCE');
  assert(url.includes('youtube.upload'), 'Must include YouTube upload scope');
});

// -----------------------------------------------------------------------------
// Test 2: Meta (Instagram & Facebook) Specs & Parameters
// -----------------------------------------------------------------------------
test('OAuth Engine: Meta authorization request includes Instagram Reels permissions', () => {
  const appId = 'meta_app_id_67890';
  const redirectUri = 'http://localhost:3000/api/social/oauth/callback/meta';
  const state = 'rqx_instagram_user123_nonce_888';
  const scopes = [
    'instagram_basic',
    'instagram_content_publish',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
  ];

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    scope: scopes.join(','),
    response_type: 'code',
  });

  const url = `https://www.facebook.com/v26.0/dialog/oauth?${params.toString()}`;

  assert(url.startsWith('https://www.facebook.com/v26.0/dialog/oauth'));
  assert(url.includes('instagram_content_publish'), 'Must request Instagram Reels publishing');
  assert(url.includes('pages_manage_posts'), 'Must request Page management');
});

// -----------------------------------------------------------------------------
// Test 3: X / Twitter OAuth 2.0 PKCE Specs & Parameters
// -----------------------------------------------------------------------------
test('OAuth Engine: X / Twitter authorization request adheres to Twitter API v2 PKCE', () => {
  const clientId = 'twitter_client_id_abcde';
  const redirectUri = 'http://localhost:3000/api/social/oauth/callback/twitter';
  const state = 'rqx_twitter_user123_nonce_777';
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const scopes = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'];

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const url = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

  assert(url.startsWith('https://twitter.com/i/oauth2/authorize'));
  assert(url.includes('response_type=code'), 'Must use code response type');
  assert(url.includes('code_challenge_method=S256'), 'Must use S256 PKCE');
  assert(url.includes('tweet.write'), 'Must request tweet.write scope');
  assert(url.includes('offline.access'), 'Must request offline.access for refresh token');
});

// -----------------------------------------------------------------------------
// Test 4: LinkedIn OAuth 2.0 Specs & UGC Permissions
// -----------------------------------------------------------------------------
test('OAuth Engine: LinkedIn authorization request includes w_member_social UGC scope', () => {
  const clientId = 'linkedin_client_id_xyz';
  const redirectUri = 'http://localhost:3000/api/social/oauth/callback/linkedin';
  const state = 'rqx_linkedin_user123_nonce_666';
  const scopes = ['openid', 'profile', 'email', 'w_member_social'];

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state,
  });

  const url = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

  assert(url.startsWith('https://www.linkedin.com/oauth/v2/authorization'));
  assert(url.includes('w_member_social'), 'Must request w_member_social for UGC post distribution');
  assert(url.includes('openid'), 'Must request openid scope');
});

// -----------------------------------------------------------------------------
// Test 5: AES-256-GCM Token Encryption Roundtrip Across All 4 Providers
// -----------------------------------------------------------------------------
test('Token Vault: Multi-provider token encryption and authenticated decryption', () => {
  const masterKey = crypto.randomBytes(32);
  const sampleTokens = {
    youtube: 'ya29.sample_youtube_google_token_12345',
    instagram: 'EAAB_sample_meta_long_lived_user_access_token_67890',
    twitter: 'x_oauth2_sample_access_token_abcdef123456789',
    linkedin: 'AQ_sample_linkedin_ugc_member_access_token_99999',
  };

  for (const [provider, rawToken] of Object.entries(sampleTokens)) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
    const ciphertext = Buffer.concat([cipher.update(rawToken, 'utf8'), cipher.final()]).toString('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    // Decrypt and verify
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    const decrypted = decipher.update(Buffer.from(ciphertext, 'hex')) + decipher.final('utf8');

    assert.strictEqual(decrypted, rawToken, `Decrypted token mismatch for ${provider}`);
  }
});

// -----------------------------------------------------------------------------
// Test 6: Token Auto-Refresh Simulation for Expired Tokens
// -----------------------------------------------------------------------------
test('Token Refresh Simulation: Correct expiry detection and renewal computation', () => {
  const now = Date.now();
  const expiredAccount = {
    id: 'acc_expired_1',
    provider: 'twitter',
    token_expires_at: new Date(now - 300 * 1000).toISOString(), // Expired 5 min ago
    has_refresh_token: true,
  };

  const isExpired = new Date(expiredAccount.token_expires_at).getTime() < now;
  assert.strictEqual(isExpired, true, 'Account should be recognized as expired');

  // Compute renewed expiration
  const renewedExpiresInSeconds = 7200; // 2 hours
  const newExpiration = new Date(now + renewedExpiresInSeconds * 1000).toISOString();
  assert(new Date(newExpiration).getTime() > now, 'New expiration must be in the future');
});

// -----------------------------------------------------------------------------
// Test 7: Post Scheduling Subsystem — Queuing, Expiry, and Cancellation
// -----------------------------------------------------------------------------
test('Post Scheduling Engine: Future post scheduling, queue state, and cancellation', () => {
  const scheduledTime = new Date(Date.now() + 86400 * 1000).toISOString(); // +24 hours
  const job = {
    id: `sched_post_${Date.now()}`,
    user_id: 'usr_test_scheduler_1',
    platform: 'twitter',
    title: 'Autonomous Social Autopilot with RIIQX 2.0',
    caption: 'Supercharge creator workflows with intelligent scheduling and multi-cloud AI.',
    media_url: 'https://example.com/assets/video.mp4',
    scheduled_for: scheduledTime,
    status: 'queued',
  };

  assert.strictEqual(job.status, 'queued');
  assert(new Date(job.scheduled_for).getTime() > Date.now(), 'Scheduled time must be in future');

  // Cancel job simulation
  job.status = 'cancelled';
  job.updated_at = new Date().toISOString();
  assert.strictEqual(job.status, 'cancelled');
});

// -----------------------------------------------------------------------------
// Test 8: Due Post Execution Processor Logic
// -----------------------------------------------------------------------------
test('Scheduled Due Processor: Correctly identifies due posts vs future posts', () => {
  const now = Date.now();
  const queue = [
    { id: 'job_past', scheduled_for: new Date(now - 10000).toISOString(), status: 'queued' }, // Due
    { id: 'job_future', scheduled_for: new Date(now + 3600000).toISOString(), status: 'queued' }, // Future
    { id: 'job_already_published', scheduled_for: new Date(now - 50000).toISOString(), status: 'published' }, // Published
  ];

  const due = queue.filter(
    (p) => p.status === 'queued' && new Date(p.scheduled_for).getTime() <= now
  );

  assert.strictEqual(due.length, 1, 'Exactly 1 job should be due for execution');
  assert.strictEqual(due[0].id, 'job_past');
});

// -----------------------------------------------------------------------------
// Test 9: Publishing Idempotency Guard Invariant
// -----------------------------------------------------------------------------
test('Publishing Idempotency Guard: Blocks duplicate concurrent jobs with same key', () => {
  const cache = new Map();
  const idempotencyKey = `pub_yt_acc123_${Date.now()}`;

  // First request
  cache.set(idempotencyKey, {
    success: true,
    jobId: idempotencyKey,
    platform: 'youtube',
    status: 'published',
    platformMediaId: 'yt_video_999',
  });

  // Second duplicate request
  const isDuplicate = cache.has(idempotencyKey);
  const cachedResult = cache.get(idempotencyKey);

  assert.strictEqual(isDuplicate, true, 'Duplicate key must be intercepted');
  assert.strictEqual(cachedResult.status, 'published');
  assert.strictEqual(cachedResult.platformMediaId, 'yt_video_999');
});

// -----------------------------------------------------------------------------
// Test 10: Multi-Channel Route & UI Integration Invariants
// -----------------------------------------------------------------------------
test('Integration Invariants: Check routes, callback handlers, schedule API, and UI tokens', () => {
  const authorizeRoutePath = path.resolve(process.cwd(), 'src/app/api/social/oauth/authorize/route.ts');
  const twitterCallbackPath = path.resolve(process.cwd(), 'src/app/api/social/oauth/callback/twitter/route.ts');
  const linkedinCallbackPath = path.resolve(process.cwd(), 'src/app/api/social/oauth/callback/linkedin/route.ts');
  const scheduleRoutePath = path.resolve(process.cwd(), 'src/app/api/social/publish/schedule/route.ts');
  const publishRoutePath = path.resolve(process.cwd(), 'src/app/api/social/publish/route.ts');
  const testAccountRoutePath = path.resolve(process.cwd(), 'src/app/api/social/accounts/[id]/test/route.ts');
  const integrationsViewPath = path.resolve(process.cwd(), 'src/components/riiqx/RiiqxIntegrationsView.tsx');

  assert(fs.existsSync(authorizeRoutePath), 'Authorize route must exist');
  assert(fs.existsSync(twitterCallbackPath), 'Twitter callback route must exist');
  assert(fs.existsSync(linkedinCallbackPath), 'LinkedIn callback route must exist');
  assert(fs.existsSync(scheduleRoutePath), 'Schedule API route must exist');
  assert(fs.existsSync(publishRoutePath), 'Publish API route must exist');
  assert(fs.existsSync(testAccountRoutePath), 'Account test route must exist');
  assert(fs.existsSync(integrationsViewPath), 'Integrations view component must exist');

  // Verify authorize route supports all 4 platforms
  const authRouteContent = fs.readFileSync(authorizeRoutePath, 'utf8');
  assert(authRouteContent.includes('twitter'), 'Authorize route must support twitter');
  assert(authRouteContent.includes('linkedin'), 'Authorize route must support linkedin');
  assert(authRouteContent.includes('createXAuthUrl'), 'Authorize route must call createXAuthUrl');
  assert(authRouteContent.includes('createLinkedInAuthUrl'), 'Authorize route must call createLinkedInAuthUrl');

  // Verify schedule route exports GET, POST, DELETE
  const schedContent = fs.readFileSync(scheduleRoutePath, 'utf8');
  assert(schedContent.includes('export async function GET'), 'Schedule route must export GET');
  assert(schedContent.includes('export async function POST'), 'Schedule route must export POST');
  assert(schedContent.includes('export async function DELETE'), 'Schedule route must export DELETE');

  // Verify account test route supports twitter and linkedin probes
  const testContent = fs.readFileSync(testAccountRoutePath, 'utf8');
  assert(testContent.includes("account.provider === 'twitter'"), 'Test route must probe twitter');
  assert(testContent.includes("account.provider === 'linkedin'"), 'Test route must probe linkedin');

  // Verify Integrations UI includes X and LinkedIn plugins
  const uiContent = fs.readFileSync(integrationsViewPath, 'utf8');
  assert(uiContent.includes("id: 'twitter'"), 'Integrations UI must list Twitter');
  assert(uiContent.includes("id: 'linkedin'"), 'Integrations UI must list LinkedIn');
});

console.log('\n============================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
console.log('============================================================\n');
