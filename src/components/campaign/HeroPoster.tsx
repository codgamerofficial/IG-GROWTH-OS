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
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-16 md:py-20 lg:py-24 max-w-4xl space-y-6">
        {/* Campaign Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-semibold text-amber-300 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Kolkata Durga Puja 2026 • AI One-Day Companion</span>
        </div>

        {/* Bengali Headline in Authentic Editorial Serif */}
        <div className="space-y-1">
          <h1 className="font-bengali text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#FFF7E8] tracking-tight leading-[1.15] drop-shadow-lg">
            একদিনে <br />
            <span className="bg-gradient-to-r from-[#D6A84F] via-[#FF8A3D] to-[#E53935] bg-clip-text text-transparent">
              সারা কলকাতার
            </span> <br />
            সেরা পুজো
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-amber-200/90 pt-2 tracking-wide font-medium">
            One Day. One City. Maximum Puja.
          </p>
        </div>

        {/* Emotional Subtitle & Value Statement */}
        <p className="text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed">
          সব প্যান্ডেল এক দিনে সম্ভব নয় — কিন্তু তোমার হাতে যত ঘণ্টা সময় আছে, তার মধ্যে সবচেয়ে সুন্দর
          রুটটি সম্ভব। Real-time Metro • OSRM walking routes • Verified pandal darshan windows.
        </p>

        {/* 5 Feature Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-sm">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Best Routes</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-sm">
            <Train className="w-3.5 h-3.5 text-emerald-400" />
            <span>Metro Guides</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Updates</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Pandal Details</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-200 backdrop-blur-sm">
            <Utensils className="w-3.5 h-3.5 text-amber-300" />
            <span>Food Stops</span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <button
            onClick={handlePlan}
            className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D6A84F] via-[#E53935] to-[#C62828] hover:from-[#E53935] hover:to-[#D6A84F] text-white font-bold px-7 py-4 text-sm sm:text-base shadow-xl shadow-rose-950/60 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>PLAN MY PUJA DAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleExplore}
            className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-4 text-sm sm:text-base border border-white/15 backdrop-blur-md transition-all duration-300 hover:border-amber-400/40 active:scale-95"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>EXPLORE PANDALS</span>
          </button>

          <button
            onClick={() => setCopilotOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold px-5 py-4 text-sm sm:text-base border border-amber-500/30 backdrop-blur-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ASK COPILOT AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
