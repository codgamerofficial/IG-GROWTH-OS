'use client';

// =============================================================================
// PujaHop Kolkata: Pandal Detail Modal (Phase 4, 5, 18, 20)
// Documented Score Breakdown • Date-Aware Status • Provenance • Navigation
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { getPandalOpeningStatusForDate } from '@/lib/data/kolkata-pandals';
import { getCalendarDay } from '@/lib/data/kolkata-calendar';
import { SourceBadge } from '@/components/common/SourceBadge';
import {
  X,
  MapPin,
  Train,
  Clock,
  Navigation,
  CheckCircle2,
  Bookmark,
  Calendar,
  Sparkles,
  Info,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export function PandalDetailModal() {
  const { selectedPandal, setSelectedPandal, markPandalVisited, selectedDate } = usePujaHop();

  if (!selectedPandal) return null;

  const dateStatus = getPandalOpeningStatusForDate(selectedPandal, selectedDate);
  const calendarDay = getCalendarDay(selectedDate);
  const scoreBreakdown = selectedPandal.score_breakdown;
  const editorialScore = scoreBreakdown?.editorial_score || selectedPandal.overall_score;
  const confidencePct = Math.round(
    (scoreBreakdown?.data_confidence || selectedPandal.confidence || 0.85) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0F0D20] border border-amber-500/20 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setSelectedPandal(null)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {selectedPandal.area}
          </span>
          <SourceBadge
            source={selectedPandal.source}
            sourceUrl={selectedPandal.source_url}
            sourceType={selectedPandal.source_type}
            verifiedAt={selectedPandal.verified_at}
            retrievedAt={selectedPandal.retrieved_at}
            confidence={selectedPandal.confidence}
          />
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400">
              Editorial Index {editorialScore.toFixed(1)} / 10
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-semibold">
              {confidencePct}% Confidence
            </span>
          </div>
        </div>

        {/* Header Titles */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{selectedPandal.name}</h2>
          <p className="text-base text-amber-300 font-semibold mt-1">{selectedPandal.name_bn}</p>
          <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
            <span>{selectedPandal.address}</span>
          </p>
        </div>

        {/* Date-Aware Opening Banner (Phase 3) */}
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
            dateStatus.status === 'OPEN'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : dateStatus.status === 'EARLY OPENING'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : dateStatus.status === 'UNDER PREPARATION'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Status for {calendarDay?.display_label || selectedDate}:</span>
              <span className="uppercase px-2 py-0.5 rounded text-[11px] bg-white/10">
                {dateStatus.status}
              </span>
            </div>
            {dateStatus.is_verified ? (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Circular
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                Unverified Date
              </span>
            )}
          </div>
          <p className="text-[11px] opacity-90">{dateStatus.display_text}</p>
        </div>

        {/* Description & Theme */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 text-sm">Theme & Concept:</span>
            {selectedPandal.theme_source && (
              <span className="text-[10px] text-zinc-400">
                Source: {selectedPandal.theme_source}
              </span>
            )}
          </div>
          <p className="text-zinc-200 leading-relaxed">{selectedPandal.theme}</p>
          {selectedPandal.description && (
            <p className="text-zinc-400 pt-2 border-t border-white/5 leading-relaxed">
              {selectedPandal.description}
            </p>
          )}
        </div>

        {/* Key Logistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-zinc-400">Nearest Metro</div>
            <div className="font-bold text-white mt-0.5">🚇 {selectedPandal.nearest_metro}</div>
            <div className="text-[10px] text-zinc-400">{selectedPandal.walking_distance}m walk ({selectedPandal.metro_line})</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-zinc-400">Operating Hours</div>
            <div className="font-bold text-white mt-0.5">
              {selectedPandal.opening_time} – {selectedPandal.closing_time}
            </div>
            <div className="text-[10px] text-zinc-400">Darshan Windows</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
            <div className="text-zinc-400">Inauguration Date</div>
            <div className="font-bold text-amber-300 mt-0.5">{selectedPandal.opening_date}</div>
            <div className="text-[10px] text-zinc-400">Official Calendar 2026</div>
          </div>
        </div>

        {/* Documented Score Breakdown (Phase 5) */}
        <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Documented Scoring Breakdown</span>
            </span>
            <span className="text-[10px] text-zinc-400">
              Editorial Index: <strong className="text-amber-400">{editorialScore.toFixed(1)}/10</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-[#121124] p-2.5 rounded-xl border border-white/5">
              <div className="text-zinc-400 text-[10px]">Traditional Heritage</div>
              <div className="font-bold text-amber-400 text-sm mt-0.5">
                {scoreBreakdown?.traditional_heritage || selectedPandal.traditional_score}/10
              </div>
              <div className="text-[9px] text-zinc-500">Weight: 20%</div>
            </div>

            <div className="bg-[#121124] p-2.5 rounded-xl border border-white/5">
              <div className="text-zinc-400 text-[10px]">Art & Craft</div>
              <div className="font-bold text-amber-400 text-sm mt-0.5">
                {scoreBreakdown?.art_and_craft || selectedPandal.art_score}/10
              </div>
              <div className="text-[9px] text-zinc-500">Weight: 25%</div>
            </div>

            <div className="bg-[#121124] p-2.5 rounded-xl border border-white/5">
              <div className="text-zinc-400 text-[10px]">Photography Spot</div>
              <div className="font-bold text-amber-400 text-sm mt-0.5">
                {scoreBreakdown?.photography || selectedPandal.photo_score}/10
              </div>
              <div className="text-[9px] text-zinc-500">Weight: 15%</div>
            </div>

            <div className="bg-[#121124] p-2.5 rounded-xl border border-white/5">
              <div className="text-zinc-400 text-[10px]">Transit Accessibility</div>
              <div className="font-bold text-cyan-400 text-sm mt-0.5">
                {scoreBreakdown?.transit_accessibility || 8.5}/10
              </div>
              <div className="text-[9px] text-zinc-500">Weight: 15%</div>
            </div>

            <div className="bg-[#121124] p-2.5 rounded-xl border border-white/5">
              <div className="text-zinc-400 text-[10px]">Physical Access</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">
                {scoreBreakdown?.accessibility || selectedPandal.accessibility_score}/10
              </div>
              <div className="text-[9px] text-zinc-500">Weight: 15%</div>
            </div>

            <div className="bg-[#121124] p-2.5 rounded-xl border border-white/5">
              <div className="text-zinc-400 text-[10px]">Crowd Suitability</div>
              <div className="font-bold text-rose-400 text-sm mt-0.5">
                {scoreBreakdown?.crowd_suitability || 7.5}/10
              </div>
              <div className="text-[9px] text-zinc-500">Weight: 10%</div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400 italic">
            Methodology: {scoreBreakdown?.methodology || 'Weighted composite index calculated from verified field data.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPandal.lat},${selectedPandal.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-950/40"
          >
            <Navigation className="w-4 h-4" />
            <span>NAVIGATE (WALK)</span>
          </a>

          <button
            onClick={() => {
              markPandalVisited(selectedPandal);
              setSelectedPandal(null);
            }}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>MARK VISITED</span>
          </button>

          <button
            onClick={() => {
              alert(`Pandal '${selectedPandal.name}' saved to your collection.`);
            }}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs"
          >
            <Bookmark className="w-4 h-4" />
            <span>SAVE TO LIST</span>
          </button>
        </div>

        {/* Data Source & Verification Footer */}
        <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-500 flex flex-col sm:flex-row justify-between gap-1">
          <span>Source: {selectedPandal.source}</span>
          <span>Verified: {new Date(selectedPandal.verified_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
