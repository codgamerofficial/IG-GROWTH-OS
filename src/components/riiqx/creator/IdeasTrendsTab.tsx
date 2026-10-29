'use client';

// =============================================================================
// RIIQX Creator Studio — AI Content Lab & Trend Radar
// Viral Format Discovery • Hook Angle Synthesis • 1-Click Project Conversion
// =============================================================================

import React, { useState } from 'react';
import {
  TrendSuggestion,
  CreatorBrief,
  CreatorProject,
} from '@/lib/riiqx/creator-types';
import {
  generateTrendAssistIdeas,
  createDefaultProject,
} from '@/lib/riiqx/creator-engine';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Zap,
  Flame,
  Search,
  Plus,
} from 'lucide-react';

interface IdeasTrendsTabProps {
  onConvertToProject: (proj: CreatorProject) => void;
}

export function IdeasTrendsTab({ onConvertToProject }: IdeasTrendsTabProps) {
  const [selectedNiche, setSelectedNiche] = useState('Tech & AI');
  const [customTopic, setCustomTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trends, setTrends] = useState<TrendSuggestion[]>(
    generateTrendAssistIdeas('Tech & AI')
  );

  const niches = [
    'Tech & AI',
    'Personal Finance',
    'Creator Economy',
    'Fitness & Health',
    'Business & SaaS',
    'Travel & Lifestyle',
  ];

  const handleNicheChange = (niche: string) => {
    setSelectedNiche(niche);
    setIsSearching(true);
    setTimeout(() => {
      setTrends(generateTrendAssistIdeas(niche));
      setIsSearching(false);
    }, 300);
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setTrends(generateTrendAssistIdeas(customTopic.trim()));
      setIsSearching(false);
    }, 400);
  };

  const handleCreateFromIdea = (trend: TrendSuggestion) => {
    const newProj = createDefaultProject({
      topic: trend.topic,
      niche: trend.niche,
      callToAction: `Follow @RIIQX for more ${trend.niche} breakdowns!`,
      goal: 'Viral engagement & follower growth',
    });
    newProj.sourceIdea = trend;
    onConvertToProject(newProj);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header & Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">AI Content Lab & Trend Radar</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              Verified 2026 Engine
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Niche discovery, viral hook angles, and evidence-based content concepts ready for 1-click production.
          </p>
        </div>

        {/* Search / Custom Topic Input */}
        <form onSubmit={handleCustomGenerate} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Search or enter topic..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#0B132B] border border-[#1E2A4A] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 w-52 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 hover:bg-violet-500 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-xs flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate</span>
          </button>
        </form>
      </div>

      {/* Niche Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="h-3 w-3" /> Niche:
        </span>
        {niches.map((niche) => (
          <button
            key={niche}
            onClick={() => handleNicheChange(niche)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
              selectedNiche === niche
                ? 'bg-violet-600 text-white font-bold shadow-xs'
                : 'bg-[#0B132B] border border-[#1E2A4A] text-slate-300 hover:border-slate-500'
            }`}
          >
            {niche}
          </button>
        ))}
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className="flex flex-col justify-between rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 hover:border-violet-500/60 transition-all hover:shadow-lg group"
          >
            <div className="space-y-4">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-400 uppercase">
                  {trend.niche}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                  <Flame className="h-3 w-3" />
                  <span>96% Potential</span>
                </span>
              </div>

              {/* Title & Core Angle */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                  {trend.topic}
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed bg-[#0B132B]/80 rounded-xl p-2.5 border border-[#1E2A4A]/60">
                  <span className="font-bold text-violet-400">Viral Hook: </span>
                  &ldquo;{trend.suggestedAngle}&rdquo;
                </p>
              </div>

              {/* 3 Creative Angle Options */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Creative Direction Angles:
                </div>
                <div className="rounded-lg bg-[#0B132B] p-2 text-[11px] text-slate-300 space-y-1 border border-[#1E2A4A]/40">
                  <div>
                    <span className="font-bold text-emerald-400">Safe/Direct: </span>
                    {trend.creativeDirections.safeRelevant}
                  </div>
                  <div>
                    <span className="font-bold text-cyan-400">High Energy: </span>
                    {trend.creativeDirections.highEnergy}
                  </div>
                  <div>
                    <span className="font-bold text-purple-400">Experiment: </span>
                    {trend.creativeDirections.creativeExperiment}
                  </div>
                </div>
              </div>

              {/* Recommended Hashtags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {trend.recommendedHashtags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Convert to Project Action */}
            <div className="mt-5 border-t border-[#1E2A4A] pt-4">
              <button
                onClick={() => handleCreateFromIdea(trend)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Convert to Video Project</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
