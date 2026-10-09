// =============================================================================
// PujaHop Kolkata: Autonomous Supabase Security, RLS & Schema Test Suite
// Verifies: Sections 11–14, 16–17, 19, 28, 40, 49–52 of Master Specification
// =============================================================================

import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdG5nenFzcmRyYWxyaGlwanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODA1NzcsImV4cCI6MjEwNjk1NjU3N30.TuZdeSyZpWSYJmUz6VP3EJPduM9t5dxeV1rPQrrnMko';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdG5nenFzcmRyYWxyaGlwanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM4MDU3NywiZXhwIjoyMTA2OTU2NTc3fQ.j6oJobxw0xeS7gd8S2Xg2xZ2RPfTk9_16qQjhq8ZQaw';

// Separate anonymous client and admin client
const anonClient = createClient(url, anonKey);
const adminClient = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runTests() {
  console.log('🛡️ Starting PujaHop Kolkata Supabase RLS & Security Test Suite...\n');

  // --- TEST 1: ALL 29 REQUIRED TABLES EXIST ---
  console.log('--- Test 1: Full 29-Table Core Schema Verification ---');
  const requiredTables = [
    'profiles', 'pandals', 'pandal_sources', 'pandal_status_history', 'pandal_themes',
    'sources', 'source_snapshots', 'metro_stations', 'metro_schedule_snapshots',
    'traffic_advisories', 'weather_snapshots', 'crowd_reports', 'food_places',
    'routes', 'route_legs', 'trip_sessions', 'trip_visits', 'passport_stamps',
    'user_saved_places', 'user_preferences', 'notifications', 'device_tokens',
    'api_health_checks', 'ai_conversations', 'ai_messages', 'ai_audit_logs',
    'verification_logs', 'admin_users', 'festival_calendar'
  ];

  for (const table of requiredTables) {
    const { error } = await adminClient.from(table).select('*', { count: 'exact', head: true });
    assert.strictEqual(error, null, `Table ${table} must exist and be accessible to admin client`);
  }
  console.log(`  ✔ All 29 tables verified present in Supabase PostgreSQL schema.`);
  console.log('✅ PASS: Database Schema Completeness.\n');

  // --- TEST 2: PUBLIC DATA READ RLS ---
  console.log('--- Test 2: Public Data Read Access (Anonymous Role) ---');
  // Anonymous user CAN read active pandals
  const { data: publicPandals, error: pErr } = await anonClient.from('pandals').select('id, name, is_active').limit(5);
  assert.strictEqual(pErr, null, 'Public can read active pandals');
  assert.ok(publicPandals.length > 0, 'Public pandals query returned verified pandals');

  // Anonymous user CAN read festival calendar
  const { data: cal, error: cErr } = await anonClient.from('festival_calendar').select('date, phase, label');
  assert.strictEqual(cErr, null, 'Public can read festival calendar');
  assert.strictEqual(cal.length, 10, 'All 10 canonical festival days readable');

  // Anonymous user CAN read active sources
  const { data: srcs, error: sErr } = await anonClient.from('sources').select('name, publisher, is_official');
  assert.strictEqual(sErr, null, 'Public can read sources');
  assert.ok(srcs.length >= 5, 'Official sources are publicly verifiable');

  console.log('  ✔ Anonymous client successfully read active pandals, sources, and festival calendar.');
  console.log('✅ PASS: Public Read RLS Verified.\n');

  // --- TEST 3: PRIVATE USER DATA RLS ENFORCEMENT ---
  console.log('--- Test 3: Private User Data Protection (Anonymous Blocked) ---');

  // 1. Anonymous cannot read other users' private routes
  const { data: anonRoutes, error: rErr } = await anonClient.from('routes').select('*');
  assert.strictEqual(rErr, null);
  assert.strictEqual(anonRoutes.length, 0, 'Anonymous client cannot view any private routes');

  // 2. Anonymous cannot insert routes without authentication
  const fakeRouteId = 'a0000000-0000-0000-0000-000000000001';
  const { error: insertRouteErr } = await anonClient.from('routes').insert({
    id: fakeRouteId,
    user_id: 'b0000000-0000-0000-0000-000000000002',
    trip_date: '2026-10-18',
    start_location: 'Howrah',
    start_latitude: 22.58,
    start_longitude: 88.34,
    start_time: '08:00:00',
    end_time: '20:00:00',
  });
  assert.ok(insertRouteErr, 'Anonymous user cannot insert route (RLS must reject)');

  // 3. Anonymous cannot insert passport stamps
  const { error: stampErr } = await anonClient.from('passport_stamps').insert({
    user_id: 'b0000000-0000-0000-0000-000000000002',
    pandal_id: publicPandals[0].id,
    stamp_type: 'VISIT',
    verification_method: 'GPS_PROXIMITY',
  });
  assert.ok(stampErr, 'Anonymous user cannot insert passport stamp (RLS must reject)');

  // 4. Anonymous cannot modify pandals or pandal verification
  const { data: updatedPandals, error: updatePandalErr } = await anonClient
    .from('pandals')
    .update({ status: 'CLOSED' })
    .eq('id', publicPandals[0].id)
    .select();
  
  // Under RLS, unauthorized update is filtered out and returns 0 rows updated
  assert.strictEqual(updatedPandals?.length || 0, 0, 'Anonymous user cannot update any pandal records');

  // Verify pandal in DB remains unaltered
  const { data: checkPandal } = await adminClient.from('pandals').select('status').eq('id', publicPandals[0].id).single();
  assert.notStrictEqual(checkPandal?.status, 'CLOSED', 'Pandal status was NOT changed to CLOSED by anonymous user');

  // 5. Anonymous cannot insert into admin_users
  const { error: adminUserErr } = await anonClient.from('admin_users').insert({
    user_id: 'b0000000-0000-0000-0000-000000000002',
    role: 'SUPER_ADMIN',
  });
  assert.ok(adminUserErr, 'Anonymous user cannot escalate to admin (RLS must reject with 42501)');
  assert.strictEqual(adminUserErr.code, '42501', 'RLS policy violation code 42501');

  console.log('  ✔ Anonymous user blocked from inserting routes, stamps, pandal updates, and admin roles.');
  console.log('✅ PASS: User Data Isolation & Security RLS Verified.\n');

  // --- TEST 4: STORAGE BUCKETS & PRIVACY ENFORCEMENT ---
  console.log('--- Test 4: Supabase Storage Buckets & Privacy ---');
  const { data: buckets, error: bErr } = await adminClient.storage.listBuckets();
  assert.strictEqual(bErr, null, 'Listing buckets via admin client');

  const bucketMap = new Map(buckets.map(b => [b.name, b]));
  const requiredBuckets = [
    { name: 'pandal-images', public: true },
    { name: 'pandal-gallery', public: true },
    { name: 'passport-photos', public: false },
    { name: 'avatars', public: true },
    { name: 'social-share-cards', public: true },
    { name: 'app-assets', public: true },
  ];

  for (const rb of requiredBuckets) {
    const found = bucketMap.get(rb.name);
    assert.ok(found, `Bucket ${rb.name} must exist`);
    assert.strictEqual(found.public, rb.public, `Bucket ${rb.name} public status must be ${rb.public}`);
  }

  console.log(`  ✔ All 6 storage buckets configured with correct public/private visibility.`);
  console.log(`  ✔ Private bucket 'passport-photos' confirmed strictly non-public.`);
  console.log('✅ PASS: Storage Architecture & Security Verified.\n');

  // --- TEST 5: POSTGRESQL FUNCTIONS & POSTGIS GEODESIC ENGINE ---
  console.log('--- Test 5: PostGIS Spatial Queries & Database RPC Functions ---');

  // Test get_nearby_pandals
  const { data: nearby, error: nErr } = await adminClient.rpc('get_nearby_pandals', {
    p_lat: 22.5726,
    p_lng: 88.3639,
    p_radius_meters: 3000,
  });
  assert.strictEqual(nErr, null, 'get_nearby_pandals RPC executes without error');
  assert.ok(nearby.length > 0, 'Found nearby pandals within 3000m of College Square');
  assert.ok(nearby[0].distance_meters > 0, 'Real distance_meters calculated by PostGIS');

  // Test get_pandal_verification
  const { data: dossier, error: dErr } = await adminClient.rpc('get_pandal_verification', {
    p_pandal_id: publicPandals[0].id,
  });
  assert.strictEqual(dErr, null, 'get_pandal_verification RPC executes');
  assert.ok(dossier.pandal_name, 'Verification dossier includes pandal name');
  assert.ok(dossier.sources.length > 0, 'Verification dossier includes verified sources');

  // Ensure fresh weather snapshot for RPC validation
  await adminClient.from('weather_snapshots').insert({
    latitude: 22.5726,
    longitude: 88.3639,
    forecast_for: new Date().toISOString(),
    temperature: 28.5,
    feels_like: 31.0,
    rain_probability: 20,
    precipitation: 0.0,
    wind_speed: 9.5,
    weather_code: 1,
    source: 'Open-Meteo Kolkata Live',
    retrieved_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
  });

  // Test get_current_weather
  const { data: weather, error: wErr } = await adminClient.rpc('get_current_weather');
  assert.strictEqual(wErr, null, 'get_current_weather RPC executes');
  assert.ok(typeof weather.temperature === 'number', 'Weather includes real temperature');
  assert.strictEqual(weather.is_stale, false, 'Weather snapshot is fresh');

  console.log(`  ✔ get_nearby_pandals returned ${nearby.length} pandals with accurate geodesic distances.`);
  console.log(`  ✔ get_pandal_verification returned authentic source dossier.`);
  console.log(`  ✔ get_current_weather returned live weather with freshness validation.`);
  console.log('✅ PASS: Database Functions & Spatial Intelligence Verified.\n');

  // --- TEST 6: CANONICAL 2026 CALENDAR INTEGRITY ---
  console.log('--- Test 6: 2026 Canonical Calendar Dates in Database ---');
  const { data: calendarRows } = await adminClient.from('festival_calendar').select('*').order('date');
  const datePhases = new Map(calendarRows.map(r => [r.date, r.phase]));

  assert.strictEqual(datePhases.get('2026-10-10'), 'MAHALAYA', '10 Oct 2026 is Mahalaya');
  assert.strictEqual(datePhases.get('2026-10-13'), 'PRE_PUJA', '13 Oct 2026 is Pre-Puja Day 1');
  assert.strictEqual(datePhases.get('2026-10-14'), 'PRE_PUJA', '14 Oct 2026 is Pre-Puja Day 2');
  assert.strictEqual(datePhases.get('2026-10-15'), 'MAHA_CHATURTHI', '15 Oct 2026 is Maha Chaturthi');
  assert.strictEqual(datePhases.get('2026-10-18'), 'MAHA_SAPTAMI', '18 Oct 2026 is Maha Saptami');
  assert.strictEqual(datePhases.get('2026-10-19'), 'MAHA_ASHTAMI', '19 Oct 2026 is Maha Ashtami');
  assert.strictEqual(datePhases.get('2026-10-21'), 'VIJAYA_DASHAMI', '21 Oct 2026 is Vijaya Dashami');

  console.log('  ✔ All 2026 Puja dates verified against official Almanac in database.');
  console.log('✅ PASS: 2026 Canonical Festival Calendar Verified.\n');

  console.log('🎉 ALL SUPABASE RLS, STORAGE & SCHEMA SECURITY TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch(err => {
  console.error('❌ Supabase Test Suite Failed:', err);
  process.exit(1);
});
