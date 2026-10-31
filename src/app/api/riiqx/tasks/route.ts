import { NextRequest, NextResponse } from 'next/server';
import { RiiqxAgentOrchestrator, AgentPlan } from '@/lib/ai/agents/agent-orchestrator';
import { decomposeGoalIntoPlan } from '@/lib/riiqx/planner';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, goal, plan } = body;

    // Action: Execute step in plan using Agent Orchestrator
    if (action === 'execute_step' && plan) {
      const result = await RiiqxAgentOrchestrator.executeNextStep(plan as AgentPlan);
      return NextResponse.json({
        success: true,
        plan: result.plan,
        stepResponse: result.stepResponse,
        requiresApproval: result.requiresApproval,
      });
    }

    // Action: Create plan
    const targetGoal = goal || (plan && plan.userGoal);
    if (!targetGoal || !targetGoal.trim()) {
      return NextResponse.json({ error: 'Goal is required.' }, { status: 400 });
    }

    const agentPlan = await RiiqxAgentOrchestrator.createPlan(targetGoal);
    return NextResponse.json({
      success: true,
      agentPlan,
      legacyPlan: decomposeGoalIntoPlan(targetGoal),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Task planner error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  const samplePlan = await RiiqxAgentOrchestrator.createPlan(
    'Audit AWS Bedrock latency, optimize viral hooks, and schedule Instagram Reel'
  );
  return NextResponse.json({ success: true, tasks: [samplePlan] });
}
