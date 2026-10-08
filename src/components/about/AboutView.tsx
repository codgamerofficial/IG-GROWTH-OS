'use client';

// =============================================================================
// PujaHop Kolkata: About & Cultural Story View
// Sections 0, 1, 3, 5, 28, 57: Cultural Magazine Editorial, Architecture & Creator
// Official Creator Credit: Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Logo } from '@/components/brand/Logo';
import {
  Compass,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Train,
  Camera,
  Award,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export function AboutView() {
  const { setActiveTab, setWizardOpen } = usePujaHop();

  return (
    <div className="min-h-screen bg-[#070611] text-zinc-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="space-y-4 text-center md:text-left border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editorial Story &amp; Cultural Manifesto</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight leading-tight">
            একদিনে সারা কলকাতার সেরা পুজো
          </h1>

          <p className="text-lg sm:text-xl text-amber-200/90 font-bengali leading-relaxed">
            “পুজো শুধু মণ্ডপ নয়, এটা একটা শহরের গল্প।”
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            <strong className="text-white">PujaHop Kolkata</strong> was conceptualized not as a generic travel directory or
            superficial festival poster, but as a bridge between Kolkata’s timeless heritage and contemporary travel technology.
          </p>
        </div>

        {/* Creator Highlight Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161228] to-[#0d0b1a] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-300 p-0.5 shrink-0 shadow-lg shadow-rose-950/50">
              <div className="w-full h-full bg-[#0d0b1a] rounded-[14px] flex items-center justify-center text-amber-300">
                <Logo variant="icon" size="lg" />
              </div>
            </div>

            <div className="space-y-3 text-center md:text-left flex-1">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest font-semibold text-amber-400">
                  Concept &amp; Product Direction
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                  Saswata Dey (Riik)
                </h2>
                <div className="text-xs sm:text-sm font-semibold text-zinc-300">
                  Created &amp; Conceptualized by Saswata Dey (Riik)
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                An independent cultural-tech experience designed to liberate Kolkata pandal-hoppers from
                guesswork, fake 24/7 promises, and endless traffic bottlenecks. PujaHop unites real OSRM road
                geometry, authoritative Kolkata Police and Metro records, and responsive AI copilot intelligence into
                one harmonious companion.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-zinc-500">
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  Kolkata, West Bengal
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  Durga Puja 2026 Edition
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                  Autonomous Cultural Engineering
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Pillars */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
              The 5 Pillars of PujaHop Kolkata
            </h3>
            <p className="text-xs text-zinc-400">
              Transforming raw festival data into an emotionally resonant, trustworthy journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>1. Cinematic Kolkata Visuals</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No cheap clip-art or generic posters. Real illuminated night pandals, Kumartuli artisan clay workshops,
                Hooghly river reflections, and vintage streetcars celebrate Kolkata’s genuine spirit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-rose-400 font-semibold text-sm">
                <BookOpen className="w-4 h-4 text-rose-400" />
                <span>2. Bengali Editorial Identity</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Typography paired with Noto Serif Bengali and Playfair Display, expressing authentic Kolkata idioms and
                emotional festival storytelling rather than sterile machine translations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-blue-400 font-semibold text-sm">
                <Train className="w-4 h-4 text-blue-400" />
                <span>3. Real Travel-App Precision</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                CARTO Dark Matter &amp; Voyager basemaps, real OSRM street walk calculations, and strictly honest Metro schedules
                (06:50 - 23:45, with unannounced special night circulars flagged as NOT YET VERIFIED).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>4. Anti-Hallucinatory AI Copilot</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Powered by DeepSeek-V4 Flash via Agent Router, the Copilot verifies real pandal records, live weather, and
                traffic conditions before answering, upholding strict uncertainty honesty.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 md:col-span-2">
              <div className="flex items-center gap-2.5 text-purple-400 font-semibold text-sm">
                <Award className="w-4 h-4 text-purple-400" />
                <span>5. Festival Memory &amp; Puja Passport</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Collectible digital ink stamps across North, Central, and South Kolkata pandals with GPS visit checks,
                complemented by iconic culinary pitstops (Nizam&apos;s, Aminia, Balaram Mullick, Mitra Cafe) that never falsely inflate pandal counts.
              </p>
            </div>
          </div>
        </div>

        {/* The Zero-Fabrication Pledge */}
        <div className="p-6 rounded-3xl bg-[#121124] border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Our Zero-Fabrication Pledge</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            In travel applications, trust is far more valuable than decorative perfection. We adhere to these 5 non-negotiable standards:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-emerald-400 block mb-0.5">Honest Unknown &gt; Fake Certainty</strong>
              <span className="text-zinc-400 text-[11px]">If opening times or night circulars are unannounced, we declare them UNVERIFIED.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-emerald-400 block mb-0.5">Real Source &gt; AI Guess</strong>
              <span className="text-zinc-400 text-[11px]">All traffic, pandal coordinates, and dates derive from official public records.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-emerald-400 block mb-0.5">Real Route &gt; Hardcoded Distance</strong>
              <span className="text-zinc-400 text-[11px]">Every walking meter and travel minute is calculated dynamically via OSRM.</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <strong className="text-emerald-400 block mb-0.5">Blocked API &gt; Fake Success</strong>
              <span className="text-zinc-400 text-[11px]">API health dashboards execute live probes and honestly report degradation.</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4 space-y-3">
          <button
            onClick={() => setWizardOpen(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-950/40 hover:brightness-110 transition-all active:scale-95"
          >
            PLAN MY PUJA DAY
          </button>
          <div>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-xs text-zinc-400 hover:text-amber-400 transition-colors"
            >
              Or explore Kolkata map &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
