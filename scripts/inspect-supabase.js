const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdG5nenFzcmRyYWxyaGlwanp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTM4MDU3NywiZXhwIjoyMTA2OTU2NTc3fQ.j6oJobxw0xeS7gd8S2Xg2xZ2RPfTk9_16qQjhq8ZQaw';

const supabase = createClient(url, key);

async function inspect() {
  const tables = [
    // Existing schema tables
    'pandals', 'metro_stations', 'metro_lines', 'traffic_alerts', 'crowd_reports',
    'restaurants', 'hospitals', 'police_stations', 'puja_calendar', 'trip_plans',
    'trip_stops', 'trip_sessions', 'pandal_visits', 'user_preferences', 'user_saved_pandals',
    'pandal_photos', 'weather_snapshots', 'api_health', 'audit_logs',
    // Master prompt target tables
    'profiles', 'pandal_sources', 'pandal_status_history', 'pandal_themes',
    'sources', 'source_snapshots', 'metro_schedule_snapshots', 'traffic_advisories',
    'food_places', 'routes', 'route_legs', 'trip_visits', 'passport_stamps',
    'user_saved_places', 'notifications', 'device_tokens', 'api_health_checks',
    'ai_conversations', 'ai_messages', 'ai_audit_logs', 'verification_logs',
    'admin_users', 'festival_calendar'
  ];

  console.log('=== INSPECTING REMOTE SUPABASE TABLES ===');
  const existing = [];
  const missing = [];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      missing.push({ table, code: error.code, message: error.message });
    } else {
      existing.push({ table, count });
    }
  }

  console.log('EXISTING TABLES:');
  for (const e of existing) {
    console.log(`  ✓ ${e.table} (count: ${e.count})`);
  }

  console.log('MISSING TABLES:');
  for (const m of missing) {
    console.log(`  ✗ ${m.table}: ${m.message}`);
  }

  // Also check storage buckets
  console.log('\n=== STORAGE BUCKETS ===');
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.log('Error listing buckets:', bError.message);
  } else {
    console.log('Buckets found:', buckets.map(b => `${b.name} (public: ${b.public})`));
  }
}

inspect().catch(console.error);
