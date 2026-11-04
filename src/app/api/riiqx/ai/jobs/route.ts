// =============================================================================
// RIIQX — Asynchronous AI Job Engine API Route
// GET, POST, DELETE /api/riiqx/ai/jobs
// =============================================================================

import { NextResponse } from 'next/server';
import { JobQueue } from '@/services/jobs/job-queue';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId') || 'default_user';
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);

  const jobs = JobQueue.listJobs(userId, limit);
  return NextResponse.json({
    success: true,
    total: jobs.length,
    jobs,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action = 'create', userId = 'default_user', jobType, payload = {}, jobId, stage, message, progressPct, result, errorMessage } = body;

    if (action === 'update_stage') {
      if (!jobId || !stage || !message) {
        return NextResponse.json({ success: false, error: 'jobId, stage, and message are required.' }, { status: 400 });
      }
      const updated = JobQueue.updateStage(jobId, stage, message, progressPct);
      return NextResponse.json({ success: true, job: updated });
    }

    if (action === 'complete') {
      if (!jobId) {
        return NextResponse.json({ success: false, error: 'jobId is required.' }, { status: 400 });
      }
      const completed = JobQueue.completeJob(jobId, result || {});
      return NextResponse.json({ success: true, job: completed });
    }

    if (action === 'fail') {
      if (!jobId || !errorMessage) {
        return NextResponse.json({ success: false, error: 'jobId and errorMessage are required.' }, { status: 400 });
      }
      const failed = JobQueue.failJob(jobId, errorMessage);
      return NextResponse.json({ success: true, job: failed });
    }

    // Default action: create job
    if (!jobType) {
      return NextResponse.json({ success: false, error: 'jobType is required.' }, { status: 400 });
    }

    const job = JobQueue.createJob(userId, jobType, payload);
    return NextResponse.json({
      success: true,
      job,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get('jobId');
    const reason = url.searchParams.get('reason') || 'User requested cancellation';

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'jobId is required.' }, { status: 400 });
    }

    const cancelled = JobQueue.cancelJob(jobId, reason);
    return NextResponse.json({
      success: true,
      job: cancelled,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
