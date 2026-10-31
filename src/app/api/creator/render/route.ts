import { NextRequest, NextResponse } from 'next/server';
import { VideoRenderEngine } from '@/lib/creator/render-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    const body = await req.json();
    const { action, request, jobId } = body;

    if (action === 'create') {
      if (!request || !request.projectId) {
        return NextResponse.json(
          { error: 'Valid RenderJobRequest with projectId is required.' },
          { status: 400 }
        );
      }
      const job = VideoRenderEngine.createJob(request);
      return NextResponse.json({ success: true, job });
    }

    if (action === 'cancel' && jobId) {
      const cancelled = VideoRenderEngine.cancelJob(jobId);
      return NextResponse.json({ success: cancelled, jobId });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported: 'create', 'cancel'." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Render dispatch failed';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID parameter is required.' }, { status: 400 });
  }

  const job = VideoRenderEngine.getJobStatus(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Render job not found.', jobId }, { status: 404 });
  }

  return NextResponse.json({ success: true, job });
}

