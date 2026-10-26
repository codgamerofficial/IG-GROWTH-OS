import { NextRequest, NextResponse } from 'next/server';
import {
  listAutopilotRules,
  listAutopilotJobs,
  getAutopilotSystemStatus,
  createAutopilotJob,
  advanceJobState,
  triggerEmergencyStop,
  resumeEmergencyStop,
  saveAutopilotRule,
} from '@/lib/nuvexa/autopilot-engine';

export async function GET() {
  return NextResponse.json({
    success: true,
    status: getAutopilotSystemStatus(),
    rules: listAutopilotRules(),
    jobs: listAutopilotJobs(),
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, any>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
    }

    const { action, ruleId, topic, jobId, rule } = body;

    if (action === 'create_job') {
      const newJob = createAutopilotJob(ruleId || 'rule_ai_reels_daily', topic);
      return NextResponse.json({ success: true, job: newJob });
    }

    if (action === 'advance_job' && jobId) {
      const updatedJob = advanceJobState(jobId);
      return NextResponse.json({ success: true, job: updatedJob });
    }

    if (action === 'emergency_stop') {
      const result = triggerEmergencyStop();
      return NextResponse.json({ success: true, haltedJobsCount: result.haltedJobsCount });
    }

    if (action === 'resume') {
      resumeEmergencyStop();
      return NextResponse.json({ success: true, message: 'Autopilot resumed.' });
    }

    if (action === 'save_rule' && rule) {
      saveAutopilotRule(rule);
      return NextResponse.json({ success: true, rule });
    }

    return NextResponse.json({ error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Autopilot error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
