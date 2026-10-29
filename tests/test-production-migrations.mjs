// =============================================================================
// RIIQX — Master Production Migration & Database Integrity Verification Suite
// Validates 20261028180000_riiqx_master_production_deploy.sql
// Checks table creation, foreign keys, RLS policies, indexes, and seed fixtures
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('🚀 Running RIIQX Production Migration & Schema Integrity Suite...\n');

let passedTests = 0;
const totalTests = 8;

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

const masterMigrationPath = path.resolve(
  process.cwd(),
  'supabase/migrations/20261028180000_riiqx_master_production_deploy.sql'
);

assert(fs.existsSync(masterMigrationPath), 'Master migration file must exist');
const sql = fs.readFileSync(masterMigrationPath, 'utf8');

// Test 1: Core Extension Dependencies
test('Schema: Required PostgreSQL extensions enabled', () => {
  assert(sql.includes('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'), 'uuid-ossp missing');
  assert(sql.includes('CREATE EXTENSION IF NOT EXISTS "pgcrypto"'), 'pgcrypto missing');
});

// Test 2: User Profiles Table & Onboarding Trigger
test('Schema: Profiles table with auth.users cascade & onboarding trigger', () => {
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'profiles table missing');
  assert(sql.includes('REFERENCES auth.users(id) ON DELETE CASCADE'), 'auth.users cascade missing');
  assert(sql.includes('CREATE OR REPLACE FUNCTION public.handle_new_user()'), 'handle_new_user trigger function missing');
  assert(sql.includes('AFTER INSERT ON auth.users'), 'on_auth_user_created trigger missing');
});

// Test 3: Connected Accounts & Provider Check Constraint
test('Schema: connected_accounts table with YouTube, Meta, X/Twitter, LinkedIn support', () => {
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.connected_accounts'), 'connected_accounts table missing');
  assert(sql.includes('provider IN (\'youtube\', \'instagram\', \'facebook\', \'whatsapp\', \'threads\', \'tiktok\', \'twitter\', \'linkedin\')'), 'Must support youtube, instagram, twitter, linkedin');
  assert(sql.includes('uq_user_provider_account UNIQUE'), 'Unique constraint per user/provider/account missing');
});

// Test 4: OAuth Credentials Vault & Zero-Leak RLS
test('Schema: oauth_credentials table strictly isolated for service_role only', () => {
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.oauth_credentials'), 'oauth_credentials table missing');
  assert(sql.includes('encrypted_access_token TEXT NOT NULL'), 'encrypted_access_token field missing');
  assert(sql.includes('iv TEXT NOT NULL'), 'AES-256-GCM iv field missing');
  assert(sql.includes('auth_tag TEXT NOT NULL'), 'AES-256-GCM auth_tag field missing');
  assert(sql.includes('ALTER TABLE public.oauth_credentials ENABLE ROW LEVEL SECURITY;'), 'RLS must be enabled on vault');
  assert(sql.includes('auth.role() = \'service_role\''), 'Service role exclusive policy missing on credentials');
});

// Test 5: Social Publishing & Post Scheduling Jobs
test('Schema: social_publishing_jobs with scheduled_for timestamp and idempotency key', () => {
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.social_publishing_jobs'), 'social_publishing_jobs missing');
  assert(sql.includes('idempotency_key TEXT UNIQUE NOT NULL'), 'idempotency_key unique constraint missing');
  assert(sql.includes('scheduled_for TIMESTAMPTZ'), 'scheduled_for column missing');
  assert(sql.includes('idx_publishing_jobs_scheduled'), 'scheduled_for index missing');
  assert(sql.includes('idx_publishing_jobs_idempotency'), 'idempotency index missing');
});

// Test 6: Financial Intelligence & Asset Master Catalog
test('Schema: Market data sources and instruments tables with universal asset classes', () => {
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.market_data_sources'), 'market_data_sources missing');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.instruments'), 'instruments catalog missing');
  assert(sql.includes('CREATE TABLE IF NOT EXISTS public.market_data_points'), 'market_data_points missing');
  assert(sql.includes('asset_class IN (\'indian_stock\', \'us_stock\', \'mutual_fund\', \'etf\''), 'asset_class checks missing');
});

// Test 7: Universal Row Level Security (RLS) Coverage
test('Schema: All tables enforce Row Level Security', () => {
  const tables = [
    'public.profiles',
    'public.connected_accounts',
    'public.oauth_credentials',
    'public.social_publishing_jobs',
    'public.social_audit_logs',
    'public.market_data_sources',
    'public.instruments',
    'public.instrument_identifiers',
    'public.market_data_points',
    'public.user_portfolios',
    'public.portfolio_holdings',
  ];

  for (const table of tables) {
    const rlsStatement = `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`;
    assert(sql.includes(rlsStatement), `Missing RLS enforcement on ${table}`);
  }
});

// Test 8: Verified Seed Data Fixtures
test('Schema: Production seed fixtures for Indian Equities, US Stocks, MFAPI & Bullion', () => {
  assert(sql.includes('INSERT INTO public.market_data_sources'), 'Market data sources seed missing');
  assert(sql.includes('mfapi'), 'MFAPI source missing');
  assert(sql.includes('tapetide'), 'Tapetide source missing');
  assert(sql.includes('INSERT INTO public.instruments'), 'Instruments seed missing');
  assert(sql.includes('RELIANCE'), 'Reliance seed missing');
  assert(sql.includes('TCS'), 'TCS seed missing');
  assert(sql.includes('HDFCBANK'), 'HDFC Bank seed missing');
  assert(sql.includes('NVDA'), 'NVIDIA seed missing');
  assert(sql.includes('GOLD999'), 'Physical gold seed missing');
});

console.log('\n============================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
console.log('============================================================\n');
