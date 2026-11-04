// =============================================================================
// RIIQX — Single Job Inspection Route
// GET /api/riiqx/ai/jobs/[id]
// =============================================================================

import { NextResponse } from 'next/server';
import { JobQueue } from '@/services/jobs/job-queue';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const jobId = params.id;
  const job = JobQueue.getJob(jobId);

  if (!job) {
    return NextResponse.json({ success: false, error: 'Job not found.' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    job,
  });
}
