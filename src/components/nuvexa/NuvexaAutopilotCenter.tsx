'use client';

// =============================================================================
// NUVEXA AI — Social Media Autopilot Center View
// Level 3 Full Autopilot • Emergency STOP • 12-State Machine • Rules Manager
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Rocket,
  AlertOctagon,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Settings2,
  Plus,
  ShieldCheck,
  Radio,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  listAutopilotRules,
  listAutopilotJobs,
  getAutopilotSystemStatus,
  triggerEmergencyStop,
  resumeEmergencyStop,
  createAutopilotJob,
  advanceJobState,
} from '@/lib/nuvexa/autopilot-engine';
import { AutopilotJob, AutopilotRule, AutopilotSystemStatus } from '@/lib/nuvexa/autopilot-types';

export function NuvexaAutopilotCenter() {
  const [rules, setRules] = useState<AutopilotRule[]>([]);
  const [jobs, setJobs] = useState<AutopilotJob[]>([]);
  const [status, setStatus] = useState<AutopilotSystemStatus>({
    emergencyStopActive: false,
    activeJobsCount: 0,
    completedTodayCount: 0,
    failedTodayCount: 0,
  });

  const [newTopicInput, setNewTopicInput] = useState('');

  const refreshData = () => {
    setRules(listAutopilotRules());
    setJobs(listAutopilotJobs());
    setStatus(getAutopilotSystemStatus());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleEmergencyStopToggle = () => {
    if (status.emergencyStopActive) {
      resumeEmergencyStop();
    } else {
      const confirmStop = window.confirm(
        '⚠️ EMERGENCY STOP CIRCUIT BREAKER\n\nAre you sure you want to halt all active autopilot jobs immediately?'
      );
      if (confirmStop) {
        triggerEmergencyStop();
      }
    }
    refreshData();
  };

  const handleEnqueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim() || status.emergencyStopActive) return;
    createAutopilotJob(rules[0]?.id || 'rule_ai_reels_daily', newTopicInput.trim());
    setNewTopicInput('');
    refreshData();
  };

  const handleAdvanceJob = (jobId: string) => {
    advanceJobState(jobId);
    refreshData();
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 select-none">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
        {/* Header with Emergency STOP Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2A4A] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">Social Media Autopilot Center</h1>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                LEVEL 3 FULL AUTONOMY
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Autonomous creation, rendering, quality validation, and authorized publishing.
            </p>
          </div>

          {/* Emergency Circuit Breaker Button */}
          <button
            onClick={handleEmergencyStopToggle}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition shadow-lg active:scale-95 ${
              status.emergencyStopActive
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-500 animate-pulse'
                : 'bg-rose-600 text-white shadow-rose-600/30 hover:bg-rose-500'
            }`}
          >
            <AlertOctagon className="h-4 w-4" />
            <span>{status.emergencyStopActive ? 'RESUME AUTOPILOT' : 'EMERGENCY STOP'}</span>
          </button>
        </div>

        {/* Emergency Stop Banner (if triggered) */}
        {status.emergencyStopActive && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/15 p-4 text-rose-300 text-xs">
            <AlertOctagon className="h-5 w-5 shrink-0 text-rose-400" />
            <div>
              <strong className="text-rose-200">Circuit Breaker Active:</strong> All autonomous dispatching has been suspended. No new jobs will publish until manually resumed.
            </div>
          </div>
        )}

        {/* System Vitals Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Autopilot Status</div>
            <div className={`mt-1 text-base font-extrabold ${status.emergencyStopActive ? 'text-rose-400' : 'text-emerald-400'}`}>
              {status.emergencyStopActive ? 'STOPPED' : 'ACTIVE & MONITORING'}
            </div>
          </div>
          <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">In-Flight Queue</div>
            <div className="mt-1 text-base font-extrabold text-cyan-400 font-mono">
              {status.activeJobsCount} Jobs
            </div>
          </div>
          <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Published Today</div>
            <div className="mt-1 text-base font-extrabold text-emerald-400 font-mono">
              {status.completedTodayCount} Posts
            </div>
          </div>
          <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Failed / Paused</div>
            <div className="mt-1 text-base font-extrabold text-amber-400 font-mono">
              {status.failedTodayCount} Jobs
            </div>
          </div>
        </div>

        {/* Manual Enqueue Bar */}
        <form onSubmit={handleEnqueue} className="flex gap-2">
          <input
            type="text"
            value={newTopicInput}
            onChange={(e) => setNewTopicInput(e.target.value)}
            disabled={status.emergencyStopActive}
            placeholder="Enqueue an automated topic (e.g. '3 Python FastAPI Security Mistakes to Avoid')"
            className="flex-1 rounded-xl border border-[#1E2A4A] bg-[#070D1F] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newTopicInput.trim() || status.emergencyStopActive}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition ${
              newTopicInput.trim() && !status.emergencyStopActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-95'
                : 'cursor-not-allowed bg-[#1E2A4A] text-[#64748B]'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Enqueue Job</span>
          </button>
        </form>

        {/* Active Jobs Queue & State Machine */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
              <h2 className="text-sm font-bold text-white">Execution Pipeline Queue ({jobs.length})</h2>
            </div>
            <button
              onClick={refreshData}
              className="text-[#94A3B8] hover:text-white transition"
              title="Refresh Queue"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-[#1E2A4A] bg-[#0B132B] p-4 transition hover:border-[#2D4170]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{job.topic}</span>
                      <span className="rounded bg-[#1E2A4A] px-2 py-0.5 text-[10px] text-[#94A3B8] font-mono">
                        {job.platform === 'instagram_reels' ? 'Reels' : 'Shorts'}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#64748B]">
                      Rule: {job.ruleName} • ID: {job.id}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                        job.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : job.status === 'paused'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {job.status}
                    </span>

                    {/* Step Advance Button (Simulate Pipeline Step) */}
                    {job.status !== 'published' && !status.emergencyStopActive && (
                      <button
                        onClick={() => handleAdvanceJob(job.id)}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/30 transition"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Advance</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1.5 w-full rounded-full bg-[#030712] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'published' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${job.progressPercent}%` }}
                  />
                </div>

                {/* Latest Execution Logs */}
                {job.logs.length > 0 && (
                  <div className="mt-2.5 rounded-lg bg-black/40 p-2 text-[10px] font-mono text-[#94A3B8] space-y-0.5">
                    {job.logs.slice(-2).map((l, i) => (
                      <div key={i} className="truncate">
                        • {l}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
