'use client';

// =============================================================================
// RIIQX — Level 3 Social Media Autopilot Command Center
// 12-State Machine • Emergency STOP • Bounded Rules & Telegram/WhatsApp Telemetry
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Rocket,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Instagram,
  Youtube,
  Plus,
} from 'lucide-react';
import { AutopilotJob, AutopilotRule, AutopilotSystemStatus } from '@/lib/riiqx/autopilot-types';
import {
  getAutopilotSystemStatus,
  listAutopilotRules,
  listAutopilotJobs,
  triggerEmergencyStop,
  resumeEmergencyStop,
  createAutopilotJob,
  advanceJobState,
} from '@/lib/riiqx/autopilot-engine';

export function RiiqxAutopilotCenter() {
  const [status, setStatus] = useState<AutopilotSystemStatus>(getAutopilotSystemStatus());
  const [rules, setRules] = useState<AutopilotRule[]>(listAutopilotRules());
  const [jobs, setJobs] = useState<AutopilotJob[]>(listAutopilotJobs());
  const [isProcessing, setIsProcessing] = useState(false);

  const refreshState = () => {
    setStatus(getAutopilotSystemStatus());
    setRules([...listAutopilotRules()]);
    setJobs([...listAutopilotJobs()]);
  };

  const handleEmergencyStop = () => {
    triggerEmergencyStop();
    refreshState();
  };

  const handleResume = () => {
    resumeEmergencyStop();
    refreshState();
  };

  const handleCreateJob = () => {
    createAutopilotJob('rule_ai_reels_daily', 'Why Online-First AI Wins in 2026');
    refreshState();
  };

  const handleAdvanceJob = (jobId: string) => {
    setIsProcessing(true);
    advanceJobState(jobId);
    setTimeout(() => {
      refreshState();
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header & Global Circuit Breaker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1E2A4A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">Social Media Autopilot</h1>
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                LEVEL 3 AUTONOMY
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Continuous Multi-Channel Publishing Pipeline • Bounded Rules • Bounded Spending Envelopes
            </p>
          </div>

          <div className="flex items-center gap-2">
            {status.isEmergencyStopped ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:brightness-110 transition"
              >
                <Play className="h-4 w-4" />
                <span>Resume Autopilot</span>
              </button>
            ) : (
              <button
                onClick={handleEmergencyStop}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-950/50 hover:brightness-110 transition active:scale-95"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>EMERGENCY STOP</span>
              </button>
            )}

            <button
              onClick={handleCreateJob}
              disabled={status.isEmergencyStopped}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 hover:brightness-110 transition disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Queue Video Job</span>
            </button>
          </div>
        </div>

        {/* Emergency Stop Banner (if triggered) */}
        {status.isEmergencyStopped && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold">CIRCUIT BREAKER ACTIVE:</span> All background scheduling and publishing tasks are immediately halted.
              </div>
            </div>
            <button
              onClick={handleResume}
              className="rounded-lg bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-500 transition"
            >
              Resume
            </button>
          </div>
        )}

        {/* System Vitals Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Active Rules</span>
            <div className="mt-1 text-2xl font-black text-white">{status.activeRulesCount}</div>
            <span className="text-[11px] text-[#94A3B8]">Timezone: {status.timeZone}</span>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Queued / Scheduled</span>
            <div className="mt-1 text-2xl font-black text-cyan-400">{status.queuedJobsCount}</div>
            <span className="text-[11px] text-[#94A3B8]">Next execution in 10m</span>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">In Pipeline</span>
            <div className="mt-1 text-2xl font-black text-blue-400">{status.inProgressJobsCount}</div>
            <span className="text-[11px] text-[#94A3B8]">Rendering &amp; QC</span>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Published Today</span>
            <div className="mt-1 text-2xl font-black text-emerald-400">{status.publishedTodayCount}</div>
            <span className="text-[11px] text-[#94A3B8]">100% verified status</span>
          </div>
        </div>

        {/* Section: Autonomous Queue & State Machine */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Continuous Video Pipeline Queue ({jobs.length})</h2>
            </div>
            <span className="text-[11px] text-[#64748B] font-mono">12-State Machine Execution</span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-3 transition hover:border-[#2D4170]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {job.platform === 'instagram_reels' ? (
                        <Instagram className="h-3.5 w-3.5 text-pink-400" />
                      ) : (
                        <Youtube className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <span className="text-xs font-bold text-white">{job.topic}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      Rule: {job.ruleName} • Scheduled: {new Date(job.scheduledFor).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        job.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : job.status === 'halted'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {job.status}
                    </span>

                    {job.status !== 'published' && job.status !== 'halted' && (
                      <button
                        onClick={() => handleAdvanceJob(job.id)}
                        disabled={isProcessing}
                        className="rounded-lg border border-[#1E2A4A] bg-[#0B132B] px-2.5 py-1 text-[11px] font-semibold text-cyan-400 hover:text-white transition"
                      >
                        Advance State &rarr;
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                    <span>Progress</span>
                    <span>{job.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#1E2A4A] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Log Snippet */}
                <div className="rounded-lg bg-[#070D1F] p-2 text-[10px] font-mono text-[#94A3B8] space-y-0.5 border border-[#1E2A4A]/50">
                  {job.logs.slice(-2).map((log, i) => (
                    <div key={i} className="truncate">
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Rules Grid */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Active Autopilot Rules ({rules.length})</h2>
            </div>
            <span className="text-[11px] text-[#64748B]">Bounded Autonomy Envelopes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                  <div>Niche: <span className="text-white">{rule.niche}</span></div>
                  <div>Frequency: <span className="text-white">{rule.frequencyPerWeek}x / week</span></div>
                  <div>Max Daily: <span className="text-white">{rule.maxDailyPosts} post</span></div>
                  <div>Hours: <span className="text-white">{rule.allowedPublishHours.join(', ')}:00 IST</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
