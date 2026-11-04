// =============================================================================
// RIIQX — Capability Execution Dispatcher API
// POST /api/riiqx/capabilities/[capabilityId]
// Authenticated • Idempotent • Timeout Guarded • Cost & Provenance Monitored
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { capabilityRegistry } from '@/lib/riiqx/adapters/capability-registry';
import { CapabilityId, CapabilityProviderId } from '@/lib/riiqx/adapters/capability-types';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { capabilityId: string } }
) {
  try {
    const capabilityId = params.capabilityId as CapabilityId;
    const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';
    const body = await req.json().catch(() => ({}));

    const {
      providerId,
      payload,
      projectId,
      idempotencyKey,
      timeoutMs,
    } = body;

    const jobId = `job_${capabilityId.replace(/\./g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const response = await capabilityRegistry.execute({
      jobId,
      userId,
      projectId,
      capabilityId,
      providerId: (providerId as CapabilityProviderId) || 'remotion',
      payload: payload || {},
      idempotencyKey,
      timeoutMs,
    });

    return NextResponse.json({
      success: response.status === 'completed',
      ...response,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Capability execution failure',
      },
      { status: 500 }
    );
  }
}

