import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const healthList = await repository.getApiHealthList();

  return NextResponse.json({
    status: 'healthy',
    service: 'PujaHop Kolkata',
    tagline: 'One Day. One City. Maximum Puja.',
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    services: healthList,
  });
}
