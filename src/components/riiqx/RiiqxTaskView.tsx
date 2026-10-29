'use client';

// =============================================================================
// RIIQX — Autonomous Task Planner & Observability Workspace
// iOS-Inspired Design System • Trending Yellow (#FFD43B) & Red/Coral (#FF4D4F)
// Structured Dependency DAGs • Step-by-Step Progress Tracking
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { decomposeGoalIntoPlan } from '@/lib/riiqx/planner';
import { RiiqxTaskPlan } from '@/lib/riiqx/types';

export function RiiqxTaskView() {
  const [goalInput, setGoalInput] = useState('');
  const [plans, setPlans] = useState<RiiqxTaskPlan[]>([
    decomposeGoalIntoPlan('Audit AWS Bedrock latency, optimize viral hooks, and schedule Instagram Reel'),
  ]);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    const newPlan = decomposeGoalIntoPlan(goalInput);
    setPlans([newPlan, ...plans]);
    setGoalInput('');
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#151515] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
              Autonomous Task Planner
            </h1>
          </div>
          <p className="mt-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
            Multi-Step Goal Decomposition • Real Tool Execution Verification • Consequential Boundaries
          </p>
        </div>

        {/* Input */}
        <form
          onSubmit={handleCreatePlan}
          className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-5 shadow-2xs space-y-3"
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
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] px-5 py-2.5 text-xs font-bold text-[#202124] shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Decompose Plan</span>
            </button>
          </div>
        </form>

        {/* Plans List */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 space-y-4 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3.5">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[#202124] dark:text-white">{plan.goal}</h3>
                  <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                    Plan ID: {plan.id} • Created: {new Date(plan.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    plan.status === 'completed'
                      ? 'bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30'
                      : plan.status === 'awaiting_permission'
                      ? 'bg-[#FF4D4F]/15 text-[#FF4D4F] border border-[#FF4D4F]/30 animate-pulse'
                      : 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border border-[#FFD43B]/40'
                  }`}
                >
                  {plan.status.replace('_', ' ')}
                </span>
              </div>

              {/* Step Sequence */}
              <div className="space-y-2.5">
                {plan.steps.map((step) => (
                  <div
                    key={step.id}
                    className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-3.5 text-xs flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white dark:bg-[#202020] font-mono text-[11px] font-bold text-[#202124] dark:text-white border border-[#EAE7E1] dark:border-[#2E2E2E] shrink-0 mt-0.5">
                        {step.order}
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-[#202124] dark:text-white leading-relaxed">
                          {step.description}
                        </span>
                        {step.output && (
                          <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-mono">
                            &gt; {step.output}
                          </p>
                        )}
                        {step.toolUsed && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#FF6B5E] font-mono font-semibold">
                            <Terminal className="h-3 w-3" />
                            <span>Tool: {step.toolUsed}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {step.requiresPermission ? (
                        <span className="flex items-center gap-1 rounded-full bg-[#FF4D4F]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#FF4D4F] border border-[#FF4D4F]/30">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Permission Gate</span>
                        </span>
                      ) : step.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-[#16865D]" />
                      ) : (
                        <span className="rounded-full bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] px-2.5 py-0.5 text-[10px] text-[#737373] dark:text-[#A3A3A3] font-mono uppercase">
                          {step.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
