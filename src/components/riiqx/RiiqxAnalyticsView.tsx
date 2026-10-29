'use client';

// =============================================================================
// RIIQX — Analytics & Growth Workspace
// iOS-Inspired Design System • Trending Yellow (#FFD43B) & Red/Coral (#FF4D4F)
// Audience Retention Curve • Second-by-Second Hold Rates • Top Content
// =============================================================================

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Youtube,
  Instagram,
  Share2,
  MessageCircle,
  Clock,
  Eye,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { getFullAnalyticsSummary } from '@/lib/riiqx/analytics';

export function RiiqxAnalyticsView() {
  const [data] = useState(getFullAnalyticsSummary());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');

  const retentionPoints = [
    { second: '0s', pct: 100 },
    { second: '3s', pct: 86 },
    { second: '6s', pct: 79 },
    { second: '10s', pct: 74 },
    { second: '15s', pct: 70 },
    { second: '20s', pct: 68 },
  ];

  const topContent = [
    {
      title: 'AI Tools Reel',
      views: '1.2M views',
      retention: '78%',
      thumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Agentic Workflow Demo',
      views: '890K views',
      retention: '74%',
      thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Finance Short',
      views: '540K views',
      retention: '69%',
      thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#151515] p-4 sm:p-6 lg:p-8 text-[#202124] dark:text-white transition-colors">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Top Header & Platform Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] dark:text-white">
                Analytics &amp; Growth
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] mt-1.5">
              Audience retention curve, second-by-second hold rates &amp; channel performance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Time range selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs font-bold text-[#202124] dark:text-white focus:outline-none focus:border-[#FFD43B] shadow-2xs"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Platform Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs">
              <button
                onClick={() => setSelectedPlatform('youtube')}
                title="YouTube"
                className={`p-2 rounded-xl transition ${
                  selectedPlatform === 'youtube'
                    ? 'bg-[#FF4D4F]/15 text-[#FF4D4F]'
                    : 'text-[#737373] hover:text-[#FF4D4F]'
                }`}
              >
                <Youtube className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPlatform('instagram')}
                title="Instagram"
                className={`p-2 rounded-xl transition ${
                  selectedPlatform === 'instagram'
                    ? 'bg-[#FF6B5E]/15 text-[#FF6B5E]'
                    : 'text-[#737373] hover:text-[#FF6B5E]'
                }`}
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPlatform('facebook')}
                title="Facebook"
                className={`p-2 rounded-xl transition ${
                  selectedPlatform === 'facebook'
                    ? 'bg-blue-500/15 text-blue-500'
                    : 'text-[#737373] hover:text-blue-500'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPlatform('whatsapp')}
                title="WhatsApp"
                className={`p-2 rounded-xl transition ${
                  selectedPlatform === 'whatsapp'
                    ? 'bg-[#16865D]/15 text-[#16865D]'
                    : 'text-[#737373] hover:text-[#16865D]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
                Total Views
              </span>
              <div className="text-3xl font-black text-[#202124] dark:text-white tabular-nums">
                2.4M
              </div>
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30">
                +32% vs last month
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
                Total Watch Time (Hours)
              </span>
              <div className="text-3xl font-black text-[#202124] dark:text-white tabular-nums">
                124.6K
              </div>
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30">
                +22% vs last month
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B5E]/15 text-[#FF6B5E] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Audience Retention & Top Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Audience Retention Chart (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3.5">
              <div>
                <h2 className="text-sm font-bold text-[#202124] dark:text-white">
                  Audience Retention
                </h2>
                <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Second-by-second viewer hold rate</p>
              </div>
              <span className="text-xs font-black text-[#202124] dark:text-[#FFD43B] px-3 py-1 rounded-full bg-[#FFD43B]/20 border border-[#FFD43B]/40">
                68% Final Hold
              </span>
            </div>

            {/* Retention Graph with Yellow to Coral Gradient */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
              {retentionPoints.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-[#FF6B5E] opacity-0 group-hover:opacity-100 transition-opacity">
                    {pt.pct}%
                  </span>
                  <div
                    style={{ height: `${pt.pct}%` }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-[#FFD43B] to-[#FF6B5E] transition-all group-hover:brightness-105 shadow-xs"
                  />
                  <span className="text-[10px] font-semibold text-[#737373] dark:text-[#A3A3A3]">
                    {pt.second}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Content Ranking (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3.5">
              <h2 className="text-sm font-bold text-[#202124] dark:text-white">
                Top Content
              </h2>
              <span className="text-[11px] font-semibold text-[#737373] dark:text-[#A3A3A3]">Ranked by Views</span>
            </div>

            <div className="space-y-3">
              {topContent.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] flex items-center justify-between hover:border-[#FFD43B] transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={c.thumb}
                      alt={c.title}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#202124] dark:text-white truncate">
                        {c.title}
                      </p>
                      <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">{c.views}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16865D] bg-[#16865D]/15 px-2.5 py-0.5 rounded-full border border-[#16865D]/30 shrink-0 ml-2">
                    {c.retention}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
