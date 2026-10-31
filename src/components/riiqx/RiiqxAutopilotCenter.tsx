'use client';

// =============================================================================
// RIIQX — Level 3 Social Media Autopilot Command Center
// iOS-Inspired Design System • Trending Yellow (#FFD43B) & Red/Coral (#FF4D4F)
// 12-State Machine • Emergency STOP • Bounded Rules & Safe Telemetry
// =============================================================================

import React, { useState } from 'react';
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
  ArrowRight,
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
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#0C0C0E] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header & Global Circuit Breaker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EAE7E1] dark:border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <Rocket className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
                Social Media Autopilot
              </h1>
              <span className="rounded-full bg-[#FFD43B]/20 border border-[#FFD43B]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#202124] dark:text-[#FFD43B] uppercase">
                LEVEL 3 AUTONOMY
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
              Continuous Multi-Channel Publishing Pipeline • Bounded Rules • Guarded Spending Envelopes
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {status.isEmergencyStopped ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 rounded-2xl bg-[#16865D] hover:bg-[#16865D]/90 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
              >
                <Play className="h-4 w-4" />
                <span>Resume Autopilot</span>
              </button>
            ) : (
              <button
                onClick={handleEmergencyStop}
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#FF4D4F] to-[#FF6B5E] hover:opacity-95 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>EMERGENCY STOP</span>
              </button>
            )}

            <button
              onClick={handleCreateJob}
              disabled={status.isEmergencyStopped}
              className="flex items-center gap-1.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] px-4 py-2.5 text-xs font-bold text-[#202124] shadow-xs transition disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Queue Video Job</span>
            </button>
          </div>
        </div>

        {/* Emergency Stop Banner (if triggered) */}
        {status.isEmergencyStopped && (
          <div className="rounded-2xl border border-[#FF4D4F]/40 bg-[#FF4D4F]/10 p-4 text-xs text-[#FF4D4F] dark:text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[#FF4D4F] shrink-0" />
              <div>
                <span className="font-bold">CIRCUIT BREAKER ACTIVE:</span> All background scheduling and publishing tasks are immediately halted.
              </div>
            </div>
            <button
              onClick={handleResume}
              className="rounded-xl bg-[#FF4D4F] px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90 transition"
            >
              Resume
            </button>
          </div>
        )}

        {/* System Vitals Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">Active Rules</span>
            <div className="mt-1 text-2xl font-black text-[#202124] dark:text-white">{status.activeRulesCount}</div>
            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Timezone: {status.timeZone}</span>
          </div>

          <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">Queued / Scheduled</span>
            <div className="mt-1 text-2xl font-black text-[#FF6B5E]">{status.queuedJobsCount}</div>
            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Autonomous dispatch</span>
          </div>

          <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">In Pipeline</span>
            <div className="mt-1 text-2xl font-black text-[#D97706] dark:text-[#FFD43B]">{status.inProgressJobsCount}</div>
            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Rendering &amp; QC</span>
          </div>

          <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-4 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">Published Today</span>
            <div className="mt-1 text-2xl font-black text-[#16865D]">{status.publishedTodayCount}</div>
            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">100% verified status</span>
          </div>
        </div>

        {/* Section: Autonomous Queue & State Machine */}
        <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#FF6B5E]" />
              <h2 className="text-sm font-bold text-[#202124] dark:text-white">
                Continuous Video Pipeline Queue ({jobs.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-mono">12-State Machine Execution</span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-3 transition hover:border-[#FFD43B]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {job.platform === 'instagram_reels' ? (
                        <Instagram className="h-3.5 w-3.5 text-[#FF6B5E]" />
                      ) : (
                        <Youtube className="h-3.5 w-3.5 text-[#FF4D4F]" />
                      )}
                      <span className="text-xs font-bold text-[#202124] dark:text-white">{job.topic}</span>
                    </div>
                    <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                      Rule: {job.ruleName} • Scheduled: {new Date(job.scheduledFor).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        job.status === 'published'
                          ? 'bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30'
                          : job.status === 'halted'
                          ? 'bg-[#FF4D4F]/15 text-[#FF4D4F] border border-[#FF4D4F]/30'
                          : 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border border-[#FFD43B]/40'
                      }`}
                    >
                      {job.status}
                    </span>

                    {job.status !== 'published' && job.status !== 'halted' && (
                      <button
                        onClick={() => handleAdvanceJob(job.id)}
                        disabled={isProcessing}
                        className="rounded-xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] px-3 py-1 text-[11px] font-semibold text-[#202124] dark:text-white hover:border-[#FFD43B] transition"
                      >
                        Advance State &rarr;
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#737373] dark:text-[#A3A3A3] font-mono">
                    <span>Progress</span>
                    <span>{job.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#EAE7E1] dark:bg-[#2E2E2E] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FFD43B] to-[#FF6B5E] transition-all duration-300"
                      style={{ width: `${job.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Log Snippet */}
                <div className="rounded-xl bg-white dark:bg-[#202020] p-2.5 text-[10px] font-mono text-[#737373] dark:text-[#A3A3A3] space-y-0.5 border border-[#EAE7E1] dark:border-[#2E2E2E]">
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
        <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FFD43B]" />
              <h2 className="text-sm font-bold text-[#202124] dark:text-white">
                Active Autopilot Rules ({rules.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Bounded Autonomy Envelopes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#202124] dark:text-white">{rule.name}</span>
                  <span className="rounded-full bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30 px-2.5 py-0.5 text-[9px] font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                  <div>Niche: <span className="font-semibold text-[#202124] dark:text-white">{rule.niche}</span></div>
                  <div>Frequency: <span className="font-semibold text-[#202124] dark:text-white">{rule.frequencyPerWeek}x / week</span></div>
                  <div>Max Daily: <span className="font-semibold text-[#202124] dark:text-white">{rule.maxDailyPosts} post</span></div>
                  <div>Hours: <span className="font-semibold text-[#202124] dark:text-white">{rule.allowedPublishHours.join(', ')}:00 IST</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
