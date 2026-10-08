'use client';

// =============================================================================
// PujaHop Kolkata: Collectible Digital Passport Showcase
// Layer 5: Festival-Memory Layer • GPS-verified digital stamps
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Award, Stamp, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export function PassportPreviewSection() {
  const { setActiveTab, visits, pandals } = usePujaHop();
  const visitedIds = (visits || []).map((v) => v.pandal_id);

  const sampleStamps = [
    {
      title: 'Bagbazar Sarbojanin',
      area: 'North Kolkata',
      badge: 'Heritage 107y',
      color: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
      seal: 'BAGBAZAR • VERIFIED',
      visited: visitedIds.includes('bagbazar-sarbojanin'),
    },
    {
      title: 'Kumartuli Park',
      area: 'Clay Artisans',
      badge: 'Sculpture Hub',
      color: 'border-rose-400/40 text-rose-300 bg-rose-500/10',
      seal: 'KUMARTULI • VERIFIED',
      visited: visitedIds.includes('kumartuli-park'),
    },
    {
      title: 'Sovabazar Rajbari',
      area: 'North Kolkata',
      badge: 'Aristocratic Bonedi',
      color: 'border-indigo-400/40 text-indigo-300 bg-indigo-500/10',
      seal: 'SOVABAZAR • VERIFIED',
      visited: visitedIds.includes('sovabazar-rajbari'),
    },
    {
      title: 'Ekdalia Evergreen',
      area: 'South Kolkata',
      badge: 'Chandelier Landmark',
      color: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
      seal: 'EKDALIA • VERIFIED',
      visited: visitedIds.includes('ekdalia-evergreen'),
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0C1C] p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Digital Festival Memory Collector</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            PujaHop Digital Passport
          </h2>
          <p className="font-bengali text-xs sm:text-sm text-zinc-400">
            তোমার এক দিনের পুজোর প্রতিটি পদচিহ্ন সংগ্রহ করো — GPS ভেরিফায়েড ডিজিটাল স্ট্যাম্পের মাধ্যমে
          </p>
        </div>

        <button
          onClick={() => setActiveTab('passport')}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold px-5 py-2.5 text-xs sm:text-sm shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
        >
          <span>OPEN MY PASSPORT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Stamps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleStamps.map((stamp, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${
              stamp.visited
                ? 'bg-amber-500/10 border-amber-400/40 shadow-lg shadow-amber-950/20'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                {stamp.area}
              </span>
              {stamp.visited ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  STAMPED
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-zinc-500">UNSTAMPED</span>
              )}
            </div>

            <h3 className="font-bold text-white text-sm mb-1">{stamp.title}</h3>
            <p className="text-[11px] text-zinc-400 mb-3">{stamp.badge}</p>

            {/* Vintage Postal Style Stamp Mark */}
            <div
              className={`p-2.5 rounded-xl border border-dashed text-center font-mono text-[10px] uppercase tracking-wider font-bold ${stamp.color}`}
            >
              {stamp.seal}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verification: Browser GPS Proximity (&lt;150m) or On-Site Confirmation</span>
        </div>
        <span className="text-zinc-500 font-mono text-[11px]">
          {visits.length} of {pandals.length} Pandals Collected
        </span>
      </div>
    </div>
  );
}
