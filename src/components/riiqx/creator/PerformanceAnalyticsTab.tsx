'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Creator Analytics & Growth Engine
// Second-by-Second Retention Curve • Hook Drop-Off Telemetry • AI Growth Insights
// =============================================================================

import React from 'react';
import {
  CreatorProject,
  PerformanceMetric,
} from '@/lib/riiqx/creator-types';
import { generatePerformanceHypotheses } from '@/lib/riiqx/creator-engine';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Users,
  Sparkles,
  Download,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface PerformanceAnalyticsTabProps {
  project: CreatorProject | null;
}

export function PerformanceAnalyticsTab({ project }: PerformanceAnalyticsTabProps) {
  const perf: PerformanceMetric =
    project?.performance ||
    (project
      ? generatePerformanceHypotheses(project)
      : {
          views: 48200,
          watchTimeHours: 326.4,
          avgViewDurationSec: 21,
          retentionCurve: [
            { second: 0, percentage: 100 },
            { second: 1, percentage: 92 },
            { second: 2, percentage: 86 },
            { second: 3, percentage: 79 },
            { second: 5, percentage: 71 },
            { second: 10, percentage: 63 },
            { second: 15, percentage: 56 },
            { second: 20, percentage: 51 },
            { second: 25, percentage: 47 },
            { second: 30, percentage: 43 },
          ],
          retentionAt2s: 86,
          retentionAt5s: 71,
          retentionAt15s: 56,
          likes: 3840,
          comments: 294,
          shares: 612,
          saves: 1420,
          subscribersGained: 340,
          benchmarkComparison: '+34% higher retention than channel 30-day baseline',
          actionableRecommendations: [
            'Strong 2-second hold (86%) driven by the pattern-interrupt hook statement.',
            'Slight dip observed at second 4 (-8%). Adding a micro-sfx whoosh or camera push-in at second 3.5 will stabilize drop-off.',
            'High save rate (1,420 saves / 48k views = 2.9%), indicating audience found the actionable 3-step formula reference-worthy.',
            'Recommended Next Action: Create a Part 2 addressing the top question asked in comments ("How to automate the scheduling step").',
          ],
        });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <BarChart3 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Creator Analytics &amp; Retention Engine
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              {perf.benchmarkComparison}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            {project?.name || 'Top Performing Short-Form Asset'} • Second-by-second viewer attention curve &amp; actionable growth recommendations.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full analytics snapshot (JSON/CSV)...')}
          className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] text-white px-3.5 py-2 text-xs font-bold transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-[#FFD43B]" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[10px] font-bold uppercase text-[#737373] flex items-center gap-1">
            <Eye className="h-3 w-3 text-blue-400" /> Views
          </div>
          <div className="mt-2 text-xl font-black text-white">{perf.views.toLocaleString()}</div>
          <div className="mt-1 text-[10px] text-emerald-400 font-semibold">+450% Reach</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[10px] font-bold uppercase text-[#737373] flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#FFD43B]" /> Watch Time
          </div>
          <div className="mt-2 text-xl font-black text-white">{perf.watchTimeHours}h</div>
          <div className="mt-1 text-[10px] text-[#A3A3A3]">Avg {perf.avgViewDurationSec}s / view</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[10px] font-bold uppercase text-[#737373] flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" /> 2s Hook Hold
          </div>
          <div className="mt-2 text-xl font-black text-emerald-400">{perf.retentionAt2s}%</div>
          <div className="mt-1 text-[10px] text-emerald-400 font-semibold">Top 3% Tier</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[10px] font-bold uppercase text-[#737373] flex items-center gap-1">
            <Bookmark className="h-3 w-3 text-[#FFD43B]" /> Saves
          </div>
          <div className="mt-2 text-xl font-black text-white">{perf.saves.toLocaleString()}</div>
          <div className="mt-1 text-[10px] text-[#FFD43B] font-semibold">2.9% Save Rate</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[10px] font-bold uppercase text-[#737373] flex items-center gap-1">
            <Share2 className="h-3 w-3 text-pink-400" /> Shares
          </div>
          <div className="mt-2 text-xl font-black text-white">{perf.shares.toLocaleString()}</div>
          <div className="mt-1 text-[10px] text-[#737373]">1.3% Viral Ratio</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[10px] font-bold uppercase text-[#737373] flex items-center gap-1">
            <Users className="h-3 w-3 text-[#FFD43B]" /> Followers
          </div>
          <div className="mt-2 text-xl font-black text-[#FFD43B]">+{perf.subscribersGained}</div>
          <div className="mt-1 text-[10px] text-[#FFD43B] font-semibold">High Conversion</div>
        </div>
      </div>

      {/* Retention Curve Visualizer */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2E2E2E] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Second-by-Second Audience Retention Curve (0 to 30 Seconds)
            </h3>
            <p className="text-xs text-[#737373]">Visual representation of viewer attention drop-off at critical hook beats</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
              Actual Retention
            </span>
            <span className="flex items-center gap-1.5 text-[#737373]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3E3E3E] inline-block" />
              Platform Baseline (48%)
            </span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative w-full h-56 pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="800" y2="20" stroke="#2E2E2E" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#2E2E2E" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#2E2E2E" strokeDasharray="4 4" strokeWidth="1" />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="retGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled Area */}
            <path
              d="M 0,0 L 26,16 L 53,28 L 80,42 L 133,58 L 266,74 L 400,88 L 533,98 L 666,106 L 800,114 L 800,200 L 0,200 Z"
              fill="url(#retGrad2)"
            />

            {/* Curve Line */}
            <path
              d="M 0,0 L 26,16 L 53,28 L 80,42 L 133,58 L 266,74 L 400,88 L 533,98 L 666,106 L 800,114"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Benchmark Line */}
            <line x1="0" y1="104" x2="800" y2="104" stroke="#737373" strokeDasharray="6 6" strokeWidth="2" opacity="0.4" />
          </svg>

          {/* Time markers */}
          <div className="flex justify-between text-[10px] text-[#737373] font-mono mt-2 pt-1 border-t border-[#2E2E2E]">
            <span>0s (Hook)</span>
            <span>2s (86%)</span>
            <span>5s (71%)</span>
            <span>15s (Midpoint 56%)</span>
            <span>30s (Loop 43%)</span>
          </div>
        </div>
      </div>

      {/* Actionable AI Growth Recommendations */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#FFD43B]" />
          <h3 className="text-sm font-bold text-white">Actionable Next Steps for Creator Improvement</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perf.actionableRecommendations.map((rec, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-4 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFD43B]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Insight #{idx + 1}</span>
              </div>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
