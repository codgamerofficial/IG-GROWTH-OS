'use client';

// =============================================================================
// PujaHop Kolkata: Cinematic Hero Poster
// Layer 1: Cinematic Kolkata Night Photography • Layer 2: Bengali Editorial Serif
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { usePujaHop } from '@/context/PujaHopContext';
import {
  Compass,
  ArrowRight,
  MapPin,
  Sparkles,
  Train,
  Clock,
  Utensils,
  ShieldCheck,
} from 'lucide-react';

interface HeroPosterProps {
  onPlanClick?: () => void;
  onExploreClick?: () => void;
}

export function HeroPoster({ onPlanClick, onExploreClick }: HeroPosterProps) {
  const { setWizardOpen, setActiveTab, setCopilotOpen } = usePujaHop();

  const handlePlan = onPlanClick || (() => setWizardOpen(true));
  const handleExplore = onExploreClick || (() => setActiveTab('explore'));

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-amber-500/20 bg-[#09090B] shadow-2xl">
      {/* Background Cinematic Visual with Targeted Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-pandal-night.jpg"
          alt="Kolkata Durga Puja Night Pandal Illumination with Dhak and Crowds"
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="object-cover object-right md:object-right-center opacity-95 scale-100 transition-transform duration-1000 ease-out hover:scale-[1.02]"
        />
        {/* Targeted velvet gradient protecting left typography while letting golden Durga face shine on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/95 to-transparent w-full md:w-[62%] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/50 to-transparent h-48 bottom-0 top-auto pointer-events-none" />
      </div>

      {/* Atmospheric Gold/Rose Festive Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-80 h-80 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 px-4 py-7 sm:px-8 sm:py-14 md:py-20 lg:py-24 max-w-4xl space-y-4 sm:space-y-6 w-full max-w-full">
        {/* Campaign Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span>KOLKATA DURGA PUJA 2026 • AI TRAVEL COMPANION</span>
        </div>

        {/* Master Bengali Calligraphy & English Editorial Headline */}
        <div className="space-y-2">
          <div className="font-bengali text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#FFF7E8] tracking-tight leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            মায়ের ডাকে <br />
            <span className="bg-gradient-to-r from-[#F5D887] via-[#D6A84F] to-[#FF8A3D] bg-clip-text text-transparent">
              কলকাতা
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/95 leading-tight tracking-tight">
            The best Puja experience for the time you have.
          </h2>

          <p className="font-serif italic text-base sm:text-xl text-amber-200/90 tracking-wide font-medium">
            One Day. One City. Maximum Puja. <span className="font-bengali not-italic text-sm sm:text-base text-amber-300 font-normal">| একদিনে সম্পূর্ণ কলকাতা দর্শন</span>
          </p>
        </div>

        {/* Supporting Trust Statement */}
        <p className="text-xs sm:text-sm text-[#B7B1BC] max-w-2xl leading-relaxed">
          Discover Kolkata&apos;s pandals, plan practical routes and explore the city with trustworthy travel information.
          Real-time Metro • OSRM walking road calculations • Verified pandal darshan timings.
        </p>

        {/* 3 Quick Action Buttons (Matching Reference Mockup 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
          <button
            onClick={handlePlan}
            className="flex items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#EF4444] hover:to-[#B71C1C] text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-rose-400/30"
          >
            <Compass className="w-4 h-4 shrink-0 text-amber-200" />
            <span>Plan My Puja Day</span>
          </button>

          <button
            onClick={handleExplore}
            className="flex items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-[#171821] hover:bg-[#211923] text-[#FFF7E8] font-semibold text-sm border border-white/10 hover:border-amber-400/40 transition-all duration-300 active:scale-95 shadow-md"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Explore Map</span>
          </button>

          <button
            onClick={() => setActiveTab('pandals')}
            className="flex items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-[#171821] hover:bg-[#211923] text-[#FFF7E8] font-semibold text-sm border border-white/10 hover:border-amber-400/40 transition-all duration-300 active:scale-95 shadow-md"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pandal Guide</span>
          </button>
        </div>

        {/* Dedicated AI Route Planner Card (Matching Reference Mockup 1) */}
        <div
          onClick={() => setWizardOpen(true)}
          className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#171821]/90 hover:bg-[#211923] border border-amber-500/25 hover:border-amber-400/50 transition-all duration-300 cursor-pointer shadow-xl"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>AI Route Planner</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SMART
                </span>
              </div>
              <div className="text-xs text-[#B7B1BC] truncate">
                Let PujaCopilot plan your perfect one-day route
              </div>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#E53935] to-[#C62828] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:from-amber-500 group-hover:to-rose-600 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
