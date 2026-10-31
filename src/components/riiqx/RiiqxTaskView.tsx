'use client';

// =============================================================================
// RIIQX — Autonomous Task Planner & Observability Workspace
// Multi-Step Goal Decomposition • Real Tool Execution Verification
// Human-in-the-Loop Safety Brake • Live Step Telemetry
// =============================================================================

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Play,
  RefreshCw,
  Cpu,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AgentPlan, PlanStep } from '@/lib/ai/agents/agent-orchestrator';

export function RiiqxTaskView() {
  const [goalInput, setGoalInput] = useState('');
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [isExecutingStep, setIsExecutingStep] = useState(false);

  // Initial Sample Plan
  const [activePlan, setActivePlan] = useState<AgentPlan>({
    id: 'plan_demo_01',
    userGoal: 'Audit AWS Bedrock latency, optimize viral hooks, and schedule Instagram Reel',
    currentStepIndex: 0,
    status: 'planning',
    createdAt: new Date().toISOString(),
    steps: [
      {
        id: 'step_1',
        role: 'general_director',
        description: 'Analyze goal constraints, budget boundaries (₹0/mo), and routing requirements',
        requiredCapabilities: ['REASONING', 'TEXT_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      },
      {
        id: 'step_2',
        role: 'research_specialist',
        description: 'Verify facts, extract source citations, and assess viral retention patterns',
        requiredCapabilities: ['LONG_CONTEXT', 'TEXT_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      },
      {
        id: 'step_3',
        role: 'creator_strategist',
        description: 'Format 9:16 vertical video script, title hook, caption, and hashtags',
        requiredCapabilities: ['TEXT_OUTPUT', 'STRUCTURED_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      },
      {
        id: 'step_4',
        role: 'safety_auditor',
        description: 'Human-in-the-loop safety brake: creator must verify preview before dispatch',
        requiredCapabilities: ['TEXT_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: true,
        approvalType: 'social_publishing',
      },
      {
        id: 'step_5',
        role: 'general_director',
        description: 'Deliver structured results with empirical evidence and latency telemetry',
        requiredCapabilities: ['TEXT_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      },
    ],
  });

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setIsDecomposing(true);

    try {
      const res = await fetch('/api/riiqx/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', goal: goalInput }),
      });
      const data = await res.json();
      if (data.success && data.agentPlan) {
        setActivePlan(data.agentPlan);
        setGoalInput('');
      }
    } catch (err) {
      console.error('Failed to create agent plan:', err);
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleExecuteNextStep = async () => {
    if (!activePlan || activePlan.status === 'completed' || isExecutingStep) return;
    setIsExecutingStep(true);

    try {
      const res = await fetch('/api/riiqx/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute_step', plan: activePlan }),
      });
      const data = await res.json();
      if (data.success && data.plan) {
        setActivePlan(data.plan);
      }
    } catch (err) {
      console.error('Failed executing step:', err);
    } finally {
      setIsExecutingStep(false);
    }
  };

  const handleApproveStep = () => {
    if (!activePlan) return;
    const updatedPlan: AgentPlan = { ...activePlan };
    const currentStep = updatedPlan.steps[updatedPlan.currentStepIndex];
    if (currentStep && currentStep.requiresHumanApproval) {
      currentStep.status = 'completed';
      currentStep.result = 'Human authorized action. Safety approval confirmed by creator.';
      updatedPlan.currentStepIndex += 1;
      if (updatedPlan.currentStepIndex >= updatedPlan.steps.length) {
        updatedPlan.status = 'completed';
      } else {
        updatedPlan.status = 'executing';
      }
      setActivePlan(updatedPlan);
    }
  };

  const completedSteps = activePlan.steps.filter((s) => s.status === 'completed').length;
  const progressPct = Math.round((completedSteps / activePlan.steps.length) * 100);

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#0C0C0E] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="border-b border-[#EAE7E1] dark:border-white/[0.08] pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
              Autonomous Task Planner
            </h1>
          </div>
          <p className="mt-1.5 text-xs text-[#737373] dark:text-[#A1A1AA]">
            Multi-Step Goal Decomposition • Real Tool Execution Verification • Consequential Boundaries
          </p>
        </div>

        {/* Input */}
        <form
          onSubmit={handleCreatePlan}
          className="rounded-3xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md p-5 shadow-sm space-y-3"
        >
          <label className="text-xs font-bold text-[#202124] dark:text-white block">
            Define New Autonomous Objective
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Research competitor viral hooks, script 3 scenes, and render video..."
              className="flex-1 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] px-4 py-2.5 text-xs sm:text-sm text-[#202124] dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3] focus:border-[#FFD43B] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isDecomposing}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] px-5 py-2.5 text-xs font-bold text-[#202124] shadow-xs transition disabled:opacity-50"
            >
              {isDecomposing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Decompose Plan</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Active Plan Dashboard */}
        <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFD43B]">
                Active Objective
              </span>
              <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                {activePlan.userGoal}
              </h3>
              <p className="text-[11px] text-[#737373]">
                Plan ID: {activePlan.id} • Progress: {completedSteps} of {activePlan.steps.length} steps completed ({progressPct}%)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activePlan.status === 'paused_for_approval' ? (
                <button
                  onClick={handleApproveStep}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#151515] font-black text-xs shadow-xs animate-pulse"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Approve &amp; Continue</span>
                </button>
              ) : activePlan.status !== 'completed' ? (
                <button
                  onClick={handleExecuteNextStep}
                  disabled={isExecutingStep}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] font-bold text-xs shadow-xs transition disabled:opacity-50"
                >
                  {isExecutingStep ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Run Next Step</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#16865D] bg-[#16865D]/10 px-3 py-1.5 rounded-xl border border-[#16865D]/30">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Plan Completed</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-[#FAF9F6] dark:bg-[#151515] rounded-full overflow-hidden border border-[#EAE7E1] dark:border-[#2E2E2E]">
            <div
              className="h-full bg-[#FFD43B] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Step Sequence */}
          <div className="space-y-3">
            {activePlan.steps.map((step, idx) => {
              const isCurrent = idx === activePlan.currentStepIndex;
              const isDone = step.status === 'completed';
              const isAwaitingApproval = step.status === 'requires_approval';

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border p-4 text-xs space-y-2 transition-all ${
                    isAwaitingApproval
                      ? 'border-amber-500 bg-amber-500/10'
                      : isCurrent
                      ? 'border-[#FFD43B] bg-[#FFD43B]/5 shadow-xs'
                      : isDone
                      ? 'border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515]'
                      : 'border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6]/50 dark:bg-[#151515]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white dark:bg-[#202020] font-mono text-[11px] font-bold text-[#202124] dark:text-white border border-[#EAE7E1] dark:border-[#2E2E2E] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#202124] dark:text-white">
                            {step.description}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#202020] text-[#A3A3A3] uppercase">
                            {step.role.replace('_', ' ')}
                          </span>
                        </div>

                        {step.result && (
                          <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] font-mono text-[11px] text-[#202124] dark:text-white whitespace-pre-wrap leading-relaxed">
                            {step.result}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {step.latencyMs && (
                        <span className="font-mono text-[10px] text-[#737373]">
                          {step.latencyMs}ms
                        </span>
                      )}

                      {isAwaitingApproval ? (
                        <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/30 animate-pulse">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Action Gate</span>
                        </span>
                      ) : isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-[#16865D]" />
                      ) : (
                        <span className="rounded-full bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] px-2.5 py-0.5 text-[10px] text-[#737373] uppercase font-mono">
                          {step.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
