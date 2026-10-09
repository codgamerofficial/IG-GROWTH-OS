'use client';

// =============================================================================
// PujaHop Kolkata: Cinematic Emotional Closing CTA
// Section 52: "কলকাতা অপেক্ষা করছে। তুমি প্রস্তুত তো?"
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { usePujaHop } from '@/context/PujaHopContext';
import { Compass, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export function EmotionalCTA() {
  const { setWizardOpen, setActiveTab } = usePujaHop();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#1A0E2E] via-[#0E0B1F] to-[#0A0915] p-5 sm:p-10 md:p-16 text-center space-y-6 shadow-2xl w-full max-w-full min-w-0">
      {/* Background Graphic Asset */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src="/images/sharadiya-vintage-lamp.jpg"
          alt="Vintage Kolkata festive street lamp"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0915] via-[#0A0915]/80 to-[#0A0915]/50" />
      </div>

      {/* Floating Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sharadiya 2026 • Real One-Day Navigation</span>
        </div>

        <h2 className="font-bengali text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#FFF7E8] tracking-tight leading-tight">
          কলকাতা অপেক্ষা করছে। <br />
          <span className="bg-gradient-to-r from-[#D6A84F] via-[#FF8A3D] to-[#E53935] bg-clip-text text-transparent">
            তুমি প্রস্তুত তো?
          </span>
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-amber-200/90 font-medium">
          One Day. One City. Maximum Puja.
        </p>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto">
          আজকের সেরা মণ্ডপ, নিখুঁত হাঁটার রুট আর যানজটমুক্ত মেট্রো সংযোগ নিয়ে তোমার পুজোর প্রতিটি মুহূর্ত
          স্মরণীয় করে তোলো।
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-3 w-full">
          <button
            onClick={() => setWizardOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D6A84F] via-[#E53935] to-[#C62828] hover:from-[#E53935] hover:to-[#D6A84F] text-white font-bold px-8 py-3.5 sm:py-4 text-sm sm:text-base shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>PLAN MY PUJA DAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 sm:py-4 text-sm sm:text-base border border-white/15 backdrop-blur-md transition-all active:scale-95"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>EXPLORE PANDALS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
