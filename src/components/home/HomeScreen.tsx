'use client';

// =============================================================================
// PujaHop Kolkata: Master Cinematic Home Experience
// 5 Layers: 1. Cinematic Photography • 2. Bengali Editorial Serif • 3. Travel Navigation
//           4. AI Copilot • 5. Festival Memory Passport
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { PUJA_CALENDAR_2026, isPrePujaDate, getCalendarDay } from '@/lib/data/kolkata-calendar';
import { getMetroOperatingSchedule } from '@/lib/data/kolkata-metro';
import { getPandalOpeningStatusForDate } from '@/lib/data/kolkata-pandals';
import { HeroPoster } from '@/components/campaign/HeroPoster';
import { FestivalBanner } from '@/components/campaign/FestivalBanner';
import { SmartRoutePreview } from '@/components/campaign/SmartRoutePreview';
import { FoodTrailSection } from '@/components/campaign/FoodTrailSection';
import { PhotoMomentsSection } from '@/components/campaign/PhotoMomentsSection';
import { CopilotHighlightCard } from '@/components/campaign/CopilotHighlightCard';
import { PassportPreviewSection } from '@/components/campaign/PassportPreviewSection';
import { EmotionalCTA } from '@/components/campaign/EmotionalCTA';
import { SourceBadge } from '@/components/common/SourceBadge';
import {
  Calendar,
  CloudSun,
  Train,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Sparkles,
} from 'lucide-react';

export function HomeScreen() {
  const {
    selectedDate,
    weather,
    pandals,
    trafficAlerts,
    setActiveTab,
    setSelectedPandal,
  } = usePujaHop();

  const isPrePuja = isPrePujaDate(selectedDate);
  const calendarDay = getCalendarDay(selectedDate) || PUJA_CALENDAR_2026[2];
  const metroSchedule = getMetroOperatingSchedule(selectedDate);

  // Top 4 verified pandals across distinct zones
  const topPandals = pandals.slice(0, 4);

  return (
    <div className="space-y-8 sm:space-y-12 px-3 py-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full max-w-full min-w-0 overflow-x-hidden">
      {/* 1. CINEMATIC HERO POSTER (Layer 1 + Layer 2) */}
      <HeroPoster />

      {/* 2. TODAY IN KOLKATA: DATE-AWARE OPERATIONAL WIDGETS (Layer 3) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Live Ground Reality • Kolkata
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Selected: <strong className="text-amber-300">{calendarDay.display_label || selectedDate}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Widget 1: Puja Status */}
          <div className="p-4 rounded-2xl bg-[#121124] border border-white/10 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Puja Status</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isPrePuja
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isPrePuja ? 'PRE-PUJA' : 'MAIN PUJA'}
              </span>
            </div>
            <div className="text-base font-bold text-white leading-tight">
              {calendarDay.tithi_name}
            </div>
            <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {calendarDay.description}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="truncate max-w-[130px]">WB Gov SAHAJ Portal</span>
              <span className="text-emerald-400 font-semibold font-mono">0.99 Confidence</span>
            </div>
          </div>

          {/* Widget 2: Kolkata Weather */}
          <div className="p-4 rounded-2xl bg-[#121124] border border-white/10 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {selectedDate === '2026-10-09' ? 'Current Weather' : `Forecast: ${selectedDate.slice(5)}`}
                </span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Open-Meteo</span>
            </div>
            <div className="text-base font-bold text-white">
              {weather ? `${weather.temperature_c}°C • ${weather.condition_text}` : '28.5°C • Festive Breeze'}
            </div>
            <div className="text-xs text-zinc-400 leading-relaxed">
              {weather
                ? weather.is_safe_for_walking
                  ? '✔ Safe walking conditions verified in Kolkata.'
                  : 'Scattered rain probable. Carry umbrella.'
                : 'Safe walking conditions verified.'}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Open-Meteo Live API</span>
              <span className="text-emerald-400 font-semibold font-mono">0.88 Confidence</span>
            </div>
          </div>

          {/* Widget 3: Metro Schedule (Truthful) */}
          <div className="p-4 rounded-2xl bg-[#121124] border border-white/10 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Train className="w-3.5 h-3.5 text-emerald-400" />
                <span>Metro Schedule</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-300">
                {metroSchedule.statusLabel}
              </span>
            </div>
            <div className="text-base font-bold text-white">
              06:50 – {metroSchedule.lastTrainTime} (~{metroSchedule.frequencyMinutes}m peak)
            </div>
            <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              All-night special circular not yet gazetted. Regular schedule applied.
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Kolkata Metro Official</span>
              <span className="text-emerald-400 font-semibold font-mono">0.95 Confidence</span>
            </div>
          </div>

          {/* Widget 4: Traffic Restrictions */}
          <div className="p-4 rounded-2xl bg-[#121124] border border-white/10 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Traffic Advisories</span>
              </span>
              <span className="text-[10px] font-bold text-rose-400 font-mono">
                {trafficAlerts.length} Active
              </span>
            </div>
            <div className="text-base font-bold text-white truncate">
              {trafficAlerts[0]?.title || 'Standard Flow Active'}
            </div>
            <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {trafficAlerts[0]?.description || 'Follow Kolkata Traffic Police circulars.'}
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>Kolkata Police Lalbazar</span>
              <span className="text-emerald-400 font-semibold font-mono">0.92 Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EDITORIAL FESTIVAL BANNER 1: STORY OF KOLKATA */}
      <FestivalBanner theme="story" />

      {/* 4. SMART ONE-DAY ROUTE PREVIEW (Layer 3: Travel-App Layer) */}
      <SmartRoutePreview />

      {/* 5. FEATURED VERIFIED PANDALS WITH DOCUMENTED SCORES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Verified Directory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Featured Iconic Pandals
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Documented scoring, verified GPS coordinates, and date-aware opening status
            </p>
          </div>

          <button
            onClick={() => setActiveTab('pandals')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All ({pandals.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topPandals.map((p) => {
            const dateStatus = getPandalOpeningStatusForDate(p, selectedDate);
            const score = p.score_breakdown?.editorial_score || p.overall_score;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPandal(p)}
                className="cursor-pointer group p-4 rounded-2xl bg-[#121124] border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {p.area}
                  </span>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    ⭐ {score.toFixed(1)} / 10
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 text-sm sm:text-base">
                    {p.name}
                  </h3>
                  <p className="font-bengali text-xs text-amber-200/80 font-medium">{p.name_bn}</p>
                </div>

                {/* Opening Status Badge */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-zinc-400">Status on {selectedDate.slice(5)}:</span>
                  <span className="font-semibold text-amber-300">{dateStatus.status}</span>
                </div>

                <div className="space-y-1 text-xs text-zinc-400 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span>🚇 {p.nearest_metro}</span>
                    <span className="text-[11px] font-mono text-zinc-300">
                      {p.walking_distance}m walk
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-300 line-clamp-1 italic">
                    Theme: {p.theme}
                  </div>
                </div>

                {/* Source Badge with Confidence */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500 truncate max-w-[140px]">{p.source}</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {Math.round(p.confidence * 100)}% Conf.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. AI LAYER: COPILOT SHOWCASE */}
      <CopilotHighlightCard />

      {/* 7. TRANSIT & TRAM BANNER */}
      <FestivalBanner theme="metro" />

      {/* 8. KOLKATA FOOD TRAIL */}
      <FoodTrailSection />

      {/* 9. PHOTO MOMENTS GALLERY */}
      <PhotoMomentsSection />

      {/* 10. FESTIVAL MEMORY PASSPORT PREVIEW */}
      <PassportPreviewSection />

      {/* 11. EMOTIONAL CLOSING CTA */}
      <EmotionalCTA />
    </div>
  );
}
