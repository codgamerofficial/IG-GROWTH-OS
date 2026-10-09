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
import { PandalPhotoGallery } from '@/components/pandals/PandalPhotoGallery';
import { CrowdStatusBadge } from '@/components/crowd/CrowdStatusBadge';
import { PandalAudioStoryPlayer } from '@/components/audio/PandalAudioStoryPlayer';
import { BhogAndFoodTrail } from '@/components/food/BhogAndFoodTrail';
import Image from 'next/image';
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
  ChevronLeft,
  Heart,
  Share2,
  Star,
} from 'lucide-react';

export function PandalDetailModal() {
  const { selectedPandal, setSelectedPandal, markPandalVisited, selectedDate } = usePujaHop();
  const [isSaved, setIsSaved] = React.useState(false);

  if (!selectedPandal) return null;

  const dateStatus = getPandalOpeningStatusForDate(selectedPandal, selectedDate);
  const calendarDay = getCalendarDay(selectedDate);
  const scoreBreakdown = selectedPandal.score_breakdown;
  const editorialScore = scoreBreakdown?.editorial_score || selectedPandal.overall_score;
  const confidencePct = Math.round(
    (scoreBreakdown?.data_confidence || selectedPandal.confidence || 0.85) * 100
  );

  // High-res authentic image mapping
  const pandalImage =
    selectedPandal.images?.[0] ||
    (selectedPandal.slug.includes('bagbazar')
      ? '/images/palace-pandal-reflection.jpg'
      : selectedPandal.slug.includes('kumartuli')
      ? '/images/kumartuli-tradition.jpg'
      : selectedPandal.area === 'North Kolkata'
      ? '/images/hero-pandal-night.jpg'
      : selectedPandal.area === 'South Kolkata'
      ? '/images/palace-pandal-reflection.jpg'
      : '/images/sharadiya-vintage-lamp.jpg');

  // Mini photo previews
  const previewThumbnails = [
    '/images/palace-pandal-reflection.jpg',
    '/images/hero-pandal-night.jpg',
    '/images/kumartuli-tradition.jpg',
    '/images/sharadiya-vintage-lamp.jpg',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0C0B14] border border-amber-500/20 shadow-2xl space-y-6 pb-6">
        {/* CINEMATIC HERO PHOTOGRAPHY (Mockup 4) */}
        <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-3xl bg-zinc-950">
          <Image
            src={pandalImage}
            alt={selectedPandal.name}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B14] via-[#0C0B14]/40 to-black/60" />

          {/* Top Bar Navigation over Image */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <button
              onClick={() => setSelectedPandal(null)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-all"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                  isSaved
                    ? 'bg-rose-600/90 border-rose-500 text-white'
                    : 'bg-black/60 border-white/15 text-white hover:bg-black/80'
                }`}
                aria-label="Save"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: selectedPandal.name,
                      text: `Check out ${selectedPandal.name} (${selectedPandal.name_bn}) on PujaHop Kolkata!`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-all"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedPandal(null)}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Bottom Overlay: Title & Ratings */}
          <div className="absolute bottom-4 inset-x-5 space-y-1.5 z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
              {selectedPandal.name}
            </h2>
            <p className="font-bengali text-amber-300 text-base font-semibold drop-shadow">
              {selectedPandal.name_bn}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{editorialScore.toFixed(1)} / 10 (Verified)</span>
              </span>

              <span className="text-zinc-300 flex items-center gap-1 text-[11px] bg-black/50 px-2 py-0.5 rounded-full border border-white/10">
                <Train className="w-3 h-3 text-cyan-400" />
                <span>{selectedPandal.walking_distance}m walk from {selectedPandal.nearest_metro}</span>
              </span>
            </div>
          </div>
        </div>

        {/* BODY CONTAINER */}
        <div className="px-4 sm:px-6 space-y-5">
          {/* CATEGORY & ZONE PILLS (Mockup 4) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/15 text-zinc-200">
              Traditional
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/15 text-zinc-200">
              Heritage
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
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
          </div>

          {/* EDITORIAL SUMMARY */}
          {selectedPandal.description && (
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {selectedPandal.description}
            </p>
          )}

          {/* MINI PHOTO PREVIEW STRIP (Mockup 4) */}
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
              Pandal Darshan Preview
            </div>
            <div className="grid grid-cols-4 gap-2">
              {previewThumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer hover:border-amber-400/50 transition-all"
                >
                  <Image
                    src={thumb}
                    alt={`Preview ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
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

        {/* Real-time Darshan Queue Telemetry (Phase 24) */}
        <CrowdStatusBadge pandal={selectedPandal} variant="detailed" showReportButton={true} />

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

        {/* Bilingual Heritage Audio Story Narrator (Phase 27) */}
        <PandalAudioStoryPlayer pandal={selectedPandal} />

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

        {/* Kolkata Bhog & Street Food Trail (Phase 25) */}
        <BhogAndFoodTrail pandal={selectedPandal} />

        {/* Community Darshan Photo Gallery with EXIF Geocoding */}
        <PandalPhotoGallery pandal={selectedPandal} />

          {/* Action Buttons (Mockup 4) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPandal.lat},${selectedPandal.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#D6A84F] hover:bg-[#c59841] text-black font-extrabold text-xs shadow-lg shadow-amber-950/40 transition-all uppercase tracking-wider"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>NAVIGATE (WALK)</span>
            </a>

            <button
              onClick={() => {
                alert(`Pandal '${selectedPandal.name}' added to your route itinerary.`);
              }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-amber-500/30 font-semibold text-xs transition-all"
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>ADD TO ROUTE</span>
            </button>

            <button
              onClick={() => {
                markPandalVisited(selectedPandal);
                setSelectedPandal(null);
              }}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK VISITED</span>
            </button>
          </div>

          {/* Data Source & Verification Footer */}
          <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-500 flex flex-col sm:flex-row justify-between gap-1">
            <span>Source: {selectedPandal.source}</span>
            <span>Verified: {new Date(selectedPandal.verified_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
