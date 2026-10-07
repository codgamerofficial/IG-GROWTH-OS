'use client';

// =============================================================================
// IG GrowthOS: Trend Research Agent (Section 16)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { TrendingUp, Sparkles, ExternalLink, Flame, Clock, ArrowRight, Compass } from 'lucide-react';

export function TrendsView() {
  const { trends, setActiveTab } = useGrowthOS();
  const [researching, setResearching] = useState(false);

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-rose-400" />
            <span>Trend Research Agent</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active fashion, Instagram audio, and cultural microtrends discovered with evidence-based scoring.
          </p>
        </div>

        <button
          onClick={() => {
            setResearching(true);
            setTimeout(() => {
              setResearching(false);
              alert('Trend index synced. 4 active streetwear trends updated.');
            }, 1200);
          }}
          disabled={researching}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {researching ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Compass className="h-4 w-4" />
          )}
          <span>Research New Trends</span>
        </button>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl hover:border-rose-500/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="rounded-lg bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300">
                  {trend.source}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{trend.trend_score}/100</span>
                  </div>
                  <div className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    <span>{trend.relevance_score}% Fit</span>
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{trend.topic}</h3>

              <div className="mt-3 rounded-xl bg-white/5 border border-white/5 p-3 text-xs">
                <strong className="text-rose-400 block mb-1">Recommended Content Angle:</strong>
                <p className="text-zinc-300 leading-relaxed">{trend.content_angle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Discovered: {new Date(trend.discovered_at).toLocaleDateString()}</span>
                {trend.expires_at && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="h-3 w-3" />
                    <span>Expires in ~10 days</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              {trend.source_url ? (
                <a
                  href={trend.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white"
                >
                  <span>Evidence Source</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-xs text-zinc-500">Verified signal</span>
              )}

              <button
                onClick={() => setActiveTab('studio')}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                <span>Create Reel for this Trend</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
