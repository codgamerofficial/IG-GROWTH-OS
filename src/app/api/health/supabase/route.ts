import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    const { data: brand, error, count } = await supabase
      .from('brands')
      .select('id, name, slug', { count: 'exact' })
      .limit(1);

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
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      service: 'supabase',
      status: 'healthy',
      healthy: true,
      checkedAt: new Date().toISOString(),
      latencyMs,
      endpoint: process.env.NEXT_PUBLIC_SUPABASE_URL,
      activeBrand: brand?.[0] || null,
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
