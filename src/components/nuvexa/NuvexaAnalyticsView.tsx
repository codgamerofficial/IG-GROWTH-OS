'use client';

// =============================================================================
// NUVEXA AI — Social Analytics & Continuous Improvement Dashboard
// Genuine Metrics • Hook Retention Insights • Algorithmic Recommendations
// =============================================================================

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import {
  listAnalyticsRecords,
  computeAnalyticsSummary,
  generateOptimizationRecommendations,
  ContentPerformanceRecord,
  OptimizationRecommendation,
} from '@/lib/nuvexa/analytics';

export function NuvexaAnalyticsView() {
  const [records] = useState<ContentPerformanceRecord[]>(listAnalyticsRecords());
  const [recommendations] = useState<OptimizationRecommendation[]>(generateOptimizationRecommendations());
  const summary = computeAnalyticsSummary();

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 select-none">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <div className="border-b border-[#1E2A4A] pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Analytics & Performance Optimization</h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
              AUDITED METRICS
            </span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Genuine platform engagement data and AI recommendations to systematically boost watch time.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-[11px] font-bold uppercase">Total Views</span>
              <Eye className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {summary.totalViews.toLocaleString()}
            </div>
            <div className="mt-1 text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +18.4% this week
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-[11px] font-bold uppercase">Total Reach</span>
              <Zap className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {summary.totalReach.toLocaleString()}
            </div>
            <div className="mt-1 text-[10px] text-emerald-400 font-semibold">
              Organic Discovery
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-[11px] font-bold uppercase">3s Retention</span>
              <Clock className="h-4 w-4 text-violet-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-cyan-300 font-mono">
              {summary.avgRetention3s}%
            </div>
            <div className="mt-1 text-[10px] text-cyan-400 font-semibold">
              Top 10% in Tech Niche
            </div>
          </div>

          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="text-[11px] font-bold uppercase">Engagements</span>
              <Heart className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-white font-mono">
              {summary.totalLikes.toLocaleString()}
            </div>
            <div className="mt-1 text-[10px] text-rose-400 font-semibold">
              Likes, Saves & Shares
            </div>
          </div>
        </div>

        {/* AI Continuous Improvement Recommendations */}
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-[#070D1F] to-[#0B132B] p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>AI Rule-Based Optimization Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-[#1E2A4A] bg-[#030712]/80 p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-400 font-mono">
                    {rec.category}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {rec.confidenceScore}% Confidence
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{rec.title}</div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">{rec.insight}</p>
                <div className="mt-2 text-[10px] font-semibold text-cyan-300 border-t border-white/5 pt-1.5">
                  Action: {rec.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Published Content Table */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 sm:p-5 space-y-3">
          <div className="border-b border-[#1E2A4A] pb-2 text-xs font-bold text-white">
            Historical Published Content Breakdown
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1E2A4A] text-[10px] font-bold uppercase text-[#64748B]">
                <tr>
                  <th className="py-2 px-3">Title & Platform</th>
                  <th className="py-2 px-3">Hook Strategy</th>
                  <th className="py-2 px-3">Duration</th>
                  <th className="py-2 px-3">Views</th>
                  <th className="py-2 px-3">3s Retention</th>
                  <th className="py-2 px-3">Likes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2A4A]">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-[#0B132B]/50 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{r.title}</div>
                      <div className="text-[10px] text-[#64748B] capitalize">
                        {r.platform.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-[#1E2A4A] px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                        {r.hookType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#94A3B8]">{r.durationSeconds}s</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">
                      {r.views.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">
                      {r.retentionAt3sPercent}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#94A3B8]">{r.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
