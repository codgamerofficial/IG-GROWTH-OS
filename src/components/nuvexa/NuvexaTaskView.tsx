'use client';

import React, { useState } from 'react';
import { useNuvexa } from '@/context/NuvexaContext';
import {
  CheckSquare,
  Play,
  RotateCcw,
  XCircle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export function NuvexaTaskView() {
  const { tasks, activeTask, setActiveTask, createTask, advanceTask } = useNuvexa();
  const [goalInput, setGoalInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await createTask(goalInput);
    setGoalInput('');
    setIsSubmitting(false);
  };

  const currentTask = activeTask || tasks[0];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#030712] p-4 sm:p-6">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col gap-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E2A4A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">Autonomous Task Planner</h1>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Decompose complex goals into verifiable subtasks with explicit permission gates before consequential actions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Human-in-the-Loop Gate</span>
          </div>
        </div>

        {/* Create Task Input */}
        <form onSubmit={handleCreateTask} className="flex gap-2">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Describe an objective (e.g. 'Build an automated documentation audit pipeline for Python API')"
            className="flex-1 rounded-xl border border-[#1E2A4A] bg-[#070D1F] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!goalInput.trim() || isSubmitting}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition ${
              goalInput.trim() && !isSubmitting
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-95'
                : 'cursor-not-allowed bg-[#1E2A4A] text-[#64748B]'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Plan Task</span>
          </button>
        </form>

        {/* Task Planner Main Body */}
        {currentTask ? (
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#1E2A4A] bg-[#070D1F]">
            {/* Task Info Bar */}
            <div className="flex items-center justify-between border-b border-[#1E2A4A] p-4 bg-[#0B132B]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{currentTask.title}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      currentTask.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : currentTask.status === 'paused'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {currentTask.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#94A3B8]">{currentTask.goal}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {currentTask.status !== 'completed' && (
                  <button
                    onClick={() => advanceTask(currentTask.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-cyan-400 active:scale-95"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Advance Step</span>
                  </button>
                )}
              </div>
            </div>

            {/* Subtasks Progress Timeline */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentTask.steps.map((step, idx) => {
                const isCurrent = idx === currentTask.currentStepIndex;
                return (
                  <div
                    key={step.id}
                    className={`rounded-xl border p-4 transition ${
                      step.status === 'completed'
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : step.status === 'paused'
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : isCurrent
                        ? 'border-cyan-500/40 bg-[#0B132B]'
                        : 'border-[#1E2A4A] bg-[#030712]/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            step.status === 'completed'
                              ? 'bg-emerald-500 text-black'
                              : step.status === 'paused'
                              ? 'bg-amber-500 text-black'
                              : isCurrent
                              ? 'bg-cyan-500 text-black'
                              : 'bg-[#1E2A4A] text-[#94A3B8]'
                          }`}
                        >
                          {step.status === 'completed' ? '✓' : step.stepNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-white">
                              {step.title}
                            </span>
                            {step.requiresPermission && (
                              <span className="flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                Requires Permission
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-[#94A3B8]">{step.description}</p>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono text-[#64748B] uppercase">
                        {step.status}
                      </span>
                    </div>

                    {/* Step Output Log */}
                    {step.outputLog && step.outputLog.length > 0 && (
                      <div className="mt-3 rounded-lg bg-black/40 p-2.5 font-mono text-[11px] text-[#94A3B8] border border-white/5 space-y-1">
                        {step.outputLog.map((log, lIdx) => (
                          <div key={lIdx} className="leading-tight">
                            • {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[#1E2A4A] p-12 text-center text-xs text-[#64748B]">
            No active task. Enter an objective above to generate an autonomous execution plan.
          </div>
        )}
      </div>
    </div>
  );
}
