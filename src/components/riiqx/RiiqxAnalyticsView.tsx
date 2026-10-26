'use client';

// =============================================================================
// RIIQX — Social Media Analytics & Hook Retention Leaderboard
// 3-Second Hook Retention Telemetry • Drop-off Curve • Actionable Advice
// =============================================================================

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { getFullAnalyticsSummary } from '@/lib/riiqx/analytics';

export function RiiqxAnalyticsView() {
  const [data] = useState(getFullAnalyticsSummary());

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="border-b border-[#1E2A4A] pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Content Analytics &amp; Hook Retention</h1>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            3-Second Hook Retention Telemetry • Rule-Based Continuous Optimization
          </p>
        </div>

        {/* Top Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Total Reel Views</span>
            <div className="mt-1 text-2xl font-black text-white">{data.aggregateMetrics.totalViews.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">+24.8% vs last month</span>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Avg 3s Hook Retention</span>
            <div className="mt-1 text-2xl font-black text-cyan-400">{data.aggregateMetrics.average3sRetention}%</div>
            <span className="text-[11px] text-[#94A3B8]">Target: &gt; 70%</span>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Completion Rate</span>
            <div className="mt-1 text-2xl font-black text-blue-400">{data.aggregateMetrics.averageCompletionRate}%</div>
            <span className="text-[11px] text-[#94A3B8]">Full video watch-through</span>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Total Content Shares</span>
            <div className="mt-1 text-2xl font-black text-purple-400">{data.aggregateMetrics.totalShares.toLocaleString()}</div>
            <span className="text-[11px] text-[#94A3B8]">Virality amplifier</span>
          </div>
        </div>

        {/* Hook Retention Leaderboard */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Viral Hook Retention Leaderboard</h2>
            </div>
            <span className="text-[11px] text-[#64748B]">Ranked by 3-Second Retention</span>
          </div>

          <div className="space-y-3">
            {Object.entries(data.hookAverages).map(([hookType, stats]) => {
              const isTop = hookType === 'pattern_interrupt';
              return (
                <div
                  key={hookType}
                  className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-xs font-bold text-white">
                        {hookType.replace('_', ' ')}
                      </span>
                      {isTop && (
                        <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400">
                          TOP PERFORMER
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {stats.avgRetention3s}% 3s Retention
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-[#1E2A4A] overflow-hidden">
                    <div
                      className={`h-full ${
                        isTop ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-500'
                      }`}
                      style={{ width: `${stats.avgRetention3s}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Sample size: {stats.count} posts</span>
                    <span>Avg completion: {stats.avgCompletion}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Autonomous Continuous Improvement Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      {rec.category}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        rec.severity === 'high'
                          ? 'bg-rose-500/15 text-rose-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {rec.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{rec.observation}</p>
                </div>

                <div className="mt-3 rounded-lg bg-[#070D1F] p-2.5 text-[11px] text-white border border-[#1E2A4A]">
                  <span className="font-semibold text-cyan-400">Action: </span>
                  {rec.actionableAdvice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
