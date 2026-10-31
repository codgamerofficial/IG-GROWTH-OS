'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — AI Content Lab & Trend Radar
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
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header & Concept */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Content Lab &amp; Trend Radar
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              Verified Algorithm Radar
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Niche discovery, viral hook angles, and evidence-based content concepts ready for 1-click production.
          </p>
        </div>

        {/* Search / Custom Topic Input */}
        <form onSubmit={handleCustomGenerate} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#737373]" />
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Search or enter custom topic..."
              className="rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] pl-8 pr-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#FFD43B] focus:outline-none w-56 sm:w-64"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !customTopic.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-3.5 py-2 text-xs font-black transition-all disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate</span>
          </button>
        </form>
      </div>

      {/* Niche Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {niches.map((niche) => {
          const isSelected = selectedNiche === niche;
          return (
            <button
              key={niche}
              onClick={() => handleNicheChange(niche)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#FFD43B] text-[#151515] shadow-xs'
                  : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#A3A3A3] hover:text-white'
              }`}
            >
              {niche}
            </button>
          );
        })}
      </div>

      {/* Trend Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trends.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 hover:border-[#FFD43B]/60 transition-all hover:shadow-xl group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 font-bold text-[#FFD43B] uppercase tracking-wider">
                  {item.niche}
                </span>
                <span className="flex items-center gap-1 font-extrabold text-emerald-400">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  {item.viralScore || 85}% Viral Potential
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-[#FFD43B] transition-colors leading-snug">
                {item.topic}
              </h3>

              {/* Hook Preview */}
              <div className="rounded-xl bg-[#151515] border border-[#2E2E2E] p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                  3-Second Hook Angle
                </span>
                <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                  &ldquo;{item.suggestedAngle}&rdquo;
                </p>
              </div>

              {/* Evidence / Signal */}
              <div className="text-[11px] text-[#A3A3A3] space-y-1">
                <div>
                  <span className="text-[#737373] font-medium">Trend Signal: </span>
                  <span className="text-slate-300 font-semibold">{item.freshness}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#737373]">
                  <span>Risk: {item.contentRisk || 'Low'}</span>
                  <span>•</span>
                  <span>Format: 9:16 Shorts/Reels</span>
                </div>
              </div>
            </div>

            {/* 1-Click Action Button */}
            <div className="border-t border-[#2E2E2E] pt-4">
              <button
                onClick={() => handleCreateFromIdea(item)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#202020] hover:bg-[#FFD43B] text-white hover:text-[#151515] py-2.5 text-xs font-bold transition-all shadow-xs"
              >
                <span>Create Video from this Concept</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
