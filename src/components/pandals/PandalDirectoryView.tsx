'use client';

// =============================================================================
// PujaHop Kolkata: Searchable Pandal Directory (Phase 4, 5, 18, 20)
// Search • Date-Aware Status • Score Breakdown • SourceBadge • Theme Transparency
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import { usePujaHop } from '@/context/PujaHopContext';
import { Pandal, PujaArea } from '@/lib/types/pujahop';
import { getPandalOpeningStatusForDate } from '@/lib/data/kolkata-pandals';
import { getCalendarDay } from '@/lib/data/kolkata-calendar';
import { SourceBadge } from '@/components/common/SourceBadge';
import { CrowdStatusBadge } from '@/components/crowd/CrowdStatusBadge';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Train,
  CheckCircle2,
  Navigation,
  Sparkles,
  Calendar,
  AlertCircle,
  HelpCircle,
  Star,
} from 'lucide-react';

export function PandalDirectoryView() {
  const { pandals, setSelectedPandal, selectedDate } = usePujaHop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');

  const selectedCalendarDay = getCalendarDay(selectedDate);
  const dateLabel = selectedCalendarDay?.display_label || selectedDate;

  const getPandalThumb = (p: Pandal) => {
    if (p.images?.[0]) return p.images[0];
    if (p.slug.includes('bagbazar')) return '/images/palace-pandal-reflection.jpg';
    if (p.slug.includes('kumartuli')) return '/images/kumartuli-tradition.jpg';
    if (p.area === 'North Kolkata') return '/images/hero-pandal-night.jpg';
    if (p.area === 'South Kolkata') return '/images/palace-pandal-reflection.jpg';
    return '/images/sharadiya-vintage-lamp.jpg';
  };

  const filtered = pandals.filter((p) => {
    const matchesArea = selectedArea === 'ALL' || p.area === selectedArea;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.name_bn.includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      p.nearest_metro.toLowerCase().includes(q) ||
      p.theme.toLowerCase().includes(q);
    return matchesArea && matchesQuery;
  });

  return (
    <div className="px-3 py-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 w-full min-w-0 overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Target Date: {dateLabel}</span>
            </span>
            <span className="text-[10px] text-zinc-400">
              {selectedCalendarDay?.is_pre_puja ? 'Pre-Puja Phase' : 'Main Puja Phase'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-amber-400" />
            <span>Kolkata Puja Directory</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            23 Verified Pandals • Official Police GPS Coordinates • Real-Time Opening Verification
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 self-start md:self-auto">
          {filtered.length} Pandals Listed
        </span>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by pandal name, Bengali name, theme, or metro station..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121124] border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Area Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar max-w-full">
          {['ALL', 'North Kolkata', 'Central Kolkata', 'South Kolkata', 'East Kolkata / Salt Lake'].map(
            (area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedArea === area
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {area}
              </button>
            )
          )}
        </div>
      </div>

      {/* DIRECTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const dateStatus = getPandalOpeningStatusForDate(p, selectedDate);
          const score = p.score_breakdown?.editorial_score || p.overall_score;
          const confidencePct = Math.round(
            (p.score_breakdown?.data_confidence || p.confidence || 0.85) * 100
          );
          const isThemeUnannounced = p.theme.toLowerCase().includes('not officially');

          return (
            <div
              key={p.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#121124] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3.5 group shadow-xl"
            >
              <div className="space-y-3">
                {/* PHOTOGRAPHY BANNER */}
                <div
                  onClick={() => setSelectedPandal(p)}
                  className="relative w-full h-36 rounded-xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 group-hover:border-amber-500/40 transition-all"
                >
                  <Image
                    src={getPandalThumb(p)}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121124] via-transparent to-black/50" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600/90 text-white shadow-md">
                      {p.area}
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{score.toFixed(1)}</span>
                    </span>
                  </div>

                  {/* Metro walking overlay */}
                  <div className="absolute bottom-2 left-2.5 z-10">
                    <span className="text-[10px] text-zinc-200 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                      <Train className="w-3 h-3 text-cyan-400" />
                      <span>{p.walking_distance}m from {p.nearest_metro}</span>
                    </span>
                  </div>
                </div>

                {/* Provenance Badge */}
                <div className="flex items-center justify-between gap-2">
                  <SourceBadge
                    source={p.source}
                    sourceUrl={p.source_url}
                    sourceType={p.source_type}
                    verifiedAt={p.verified_at}
                    retrievedAt={p.retrieved_at}
                    confidence={p.confidence}
                  />
                  <div className="text-[10px] text-zinc-400">
                    {confidencePct}% Confidence
                  </div>
                </div>

                {/* Name & Address */}
                <div>
                  <h3
                    onClick={() => setSelectedPandal(p)}
                    className="font-bold text-white text-base group-hover:text-amber-300 cursor-pointer transition-colors line-clamp-1"
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-medium font-bengali">{p.name_bn}</p>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{p.address}</p>
                </div>

                {/* Real-time Darshan Queue Badge (Phase 24) */}
                <div className="flex items-center justify-between">
                  <CrowdStatusBadge pandal={p} variant="compact" />
                </div>

                {/* Date-Aware Opening Status */}
                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    dateStatus.status === 'OPEN'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : dateStatus.status === 'EARLY OPENING'
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                      : dateStatus.status === 'UNDER PREPARATION'
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                  }`}
                >
                  {dateStatus.is_verified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-400" />
                  )}
                  <div>
                    <div className="font-semibold text-[11px] uppercase tracking-wide">
                      {dateStatus.status}
                    </div>
                    <div className="text-[10px] opacity-90 mt-0.5">
                      {dateStatus.display_text}
                    </div>
                  </div>
                </div>

                {/* Theme Box */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-semibold text-[11px]">Theme:</span>
                    {isThemeUnannounced && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                        Unannounced
                      </span>
                    )}
                  </div>
                  <div className={`line-clamp-2 ${isThemeUnannounced ? 'text-zinc-400 italic' : 'text-zinc-200'}`}>
                    {p.theme}
                  </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5 text-zinc-400">
                  <div>
                    <span className="block text-[10px] text-zinc-500">Metro Station</span>
                    <span className="text-zinc-200 font-medium">🚇 {p.nearest_metro}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500">Walking Dist</span>
                    <span className="text-zinc-200 font-medium">{p.walking_distance}m walk</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => setSelectedPandal(p)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 text-xs font-semibold border border-white/10 transition-all"
                >
                  View Details & Scores
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-[#D6A84F] hover:bg-[#c59841] text-black text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-950/30 transition-all uppercase tracking-wider"
                  title="Start walking navigation"
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>Navigate</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
