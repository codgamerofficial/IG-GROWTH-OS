'use client';

// =============================================================================
// RIIQX Creator Studio — Template Library (Section 8 of Blueprint)
// CapCut/VN Style Catalog • Category Chips • Search • Instant Project Injection
// =============================================================================

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  CreatorProject,
  CreatorStudioTab,
  CreationPreset,
} from '@/lib/riiqx/creator-types';
import {
  CREATOR_TEMPLATES,
  createDefaultProject,
} from '@/lib/riiqx/creator-engine';
import {
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Crown,
  Play,
  Check,
  Filter,
} from 'lucide-react';

interface TemplatesTabProps {
  onSelectProject: (proj: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function TemplatesTab({
  onSelectProject,
  onTabChange,
}: TemplatesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<(typeof CREATOR_TEMPLATES)[0] | null>(null);

  const categories = ['All', 'Trending', 'Reels', 'YouTube Shorts', 'Motivation', 'Travel', 'Business'];

  const filteredTemplates = useMemo(() => {
    return CREATOR_TEMPLATES.filter((tmpl) => {
      const matchesSearch =
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Trending') return tmpl.tag === 'Trending' || tmpl.category === 'Viral Hook';
      return tmpl.category.toLowerCase() === selectedCategory.toLowerCase() || tmpl.tag?.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [searchQuery, selectedCategory]);

  const handleApplyTemplate = (tmpl: (typeof CREATOR_TEMPLATES)[0]) => {
    const newProj = createDefaultProject({
      topic: tmpl.name,
      durationSeconds: (tmpl.recommendedDuration as 15 | 30 | 60) || 30,
      creationPreset: tmpl.preset,
      captionStyle: tmpl.captionStyle,
      trendingAudioVibe: tmpl.audioVibe,
      goal: `Viral engagement via ${tmpl.name}`,
    });
    onSelectProject(newProj);
    onTabChange('editor');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-[#171A22] dark:text-white">
      {/* Top Header & Search Bar (Exact Blueprint Specification) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171A22] dark:text-white">
              Template Library
            </h1>
            <p className="text-xs sm:text-sm text-[#777D88] dark:text-slate-400 mt-0.5">
              CapCut & VN-style creator blueprints for YouTube Shorts, Instagram Reels & TikTok.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#777D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#1C2230] border border-[#E5E4DE] dark:border-[#2A3347] text-xs text-[#171A22] dark:text-white placeholder-[#777D88] focus:outline-none focus:border-[#6750D8] transition"
            />
          </div>
        </div>

        {/* Category Pills (Section 8 of Blueprint) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 text-xs ${
                  isSelected
                    ? 'bg-[#6750D8] text-white shadow-xs'
                    : 'bg-white dark:bg-[#1C2230] text-[#777D88] dark:text-slate-300 border border-[#E5E4DE] dark:border-[#2A3347] hover:border-[#6750D8]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blueprint Section 8: 8 High-Impact Template Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => handleApplyTemplate(tmpl)}
            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#E5E4DE] dark:border-[#2A3347] bg-white dark:bg-[#1C2230] hover:border-[#6750D8] dark:hover:border-[#6750D8] hover:shadow-lg transition-all flex flex-col aspect-[3/4]"
          >
            {/* Background Cover Image */}
            <Image
              src={tmpl.coverUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
              alt={tmpl.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Top Right Crown / Curated Star Badge */}
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-sm sm:text-base font-black tracking-tight leading-tight">
                {tmpl.name}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-slate-300 font-medium">
                  {tmpl.templateCount || 25} Templates
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
                  {tmpl.recommendedDuration}s
                </span>
              </div>

              {/* Hover Apply Button */}
              <div className="mt-2.5 pt-2 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  className="w-full py-1.5 rounded-xl bg-[#6750D8] hover:bg-[#5841C5] text-white text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
