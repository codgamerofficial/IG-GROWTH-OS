import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      service: 'supabase',
      status: 'degraded',
      healthy: false,
      message: 'Supabase URL or Anon key is not configured in environment.',
      checkedAt: new Date().toISOString(),
    });
  }

  try {
    // Attempt querying pandals, fallback to checking brands or table availability
    let { data, error } = await supabase.from('pandals').select('id, name').limit(1);

    if (error && error.code === 'PGRST205') {
      // Table pandals not yet migrated in PostgreSQL schema cache; check if brands or general connection is responsive
      const res = await supabase.from('brands').select('id').limit(1);
      if (!res.error) {
        error = null;
      }
    }

    const latencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          service: 'supabase',
          status: 'error',
          healthy: false,
          checkedAt: new Date().toISOString(),
          latencyMs,
          error: error.message,
          hint: 'Run migration 20261008000000_pujahop_kolkata_schema.sql in Supabase SQL editor.',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      service: 'supabase',
      status: 'healthy',
      healthy: true,
      checkedAt: new Date().toISOString(),
      latencyMs,
      endpoint: process.env.NEXT_PUBLIC_SUPABASE_URL,
      message: 'Supabase PostgreSQL database is online and responding.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        service: 'supabase',
        status: 'error',
        healthy: false,
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
