'use client';

// =============================================================================
// RIIQX — Autonomous Task Planner & Observability Workspace
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
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="border-b border-[#1E2A4A] pb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Autonomous Task Planner</h1>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Multi-Step Goal Decomposition • Real Tool Execution Verification • Consequential Boundaries
          </p>
        </div>

        {/* Input */}
        <form onSubmit={handleCreatePlan} className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-3">
          <label className="text-xs font-semibold text-white block">Define New Autonomous Objective</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Research competitor viral hooks, script 3 scenes, and render video..."
              className="flex-1 rounded-xl border border-[#1E2A4A] bg-[#030712] px-3.5 py-2 text-xs text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 hover:brightness-110 transition"
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
              className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1E2A4A] pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">{plan.goal}</h3>
                  <p className="text-[11px] text-[#64748B]">
                    Plan ID: {plan.id} • Created: {new Date(plan.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    plan.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : plan.status === 'awaiting_permission'
                      ? 'bg-rose-500/15 text-rose-400 animate-pulse'
                      : 'bg-cyan-500/15 text-cyan-400'
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
                    className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3 text-xs flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0B132B] font-mono text-[11px] font-bold text-cyan-400 border border-[#1E2A4A] shrink-0 mt-0.5">
                        {step.order}
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-white leading-relaxed">
                          {step.description}
                        </span>
                        {step.output && (
                          <p className="text-[11px] text-[#94A3B8] font-mono">
                            &gt; {step.output}
                          </p>
                        )}
                        {step.toolUsed && (
                          <div className="flex items-center gap-1.5 text-[10px] text-cyan-400/80 font-mono">
                            <Terminal className="h-3 w-3" />
                            <span>Tool: {step.toolUsed}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {step.requiresPermission ? (
                        <span className="flex items-center gap-1 rounded bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Permission Gate</span>
                        </span>
                      ) : step.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <span className="rounded bg-[#1E2A4A] px-2 py-0.5 text-[10px] text-[#94A3B8] font-mono uppercase">
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
