'use client';

// =============================================================================
// PujaHop Kolkata: Reusable Social Share & Campaign Creative Modal
// Sections 35, 36: Multi-format campaign cards (Story, Portrait, Square, OG)
// Official Creator Credit: Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import { TripPlan } from '@/lib/types/pujahop';
import { Logo } from '@/components/brand/Logo';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Smartphone,
  Instagram,
  Sparkles,
  MapPin,
  Route,
  Footprints,
} from 'lucide-react';

interface SocialShareModalProps {
  trip: TripPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

type AspectRatioType = 'story' | 'portrait' | 'square' | 'og';

export function SocialShareModal({ trip, isOpen, onClose }: SocialShareModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('story');
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'route' | 'count' | 'north' | 'passport'>('route');

  if (!isOpen) return null;

  const pandalStops = trip ? trip.stops.filter((s) => s.stop_type === 'PANDAL') : [];
  const totalPandals = pandalStops.length || 6;
  const walkingKm = trip ? (trip.total_walking_distance_meters / 1000).toFixed(1) : '5.8';

  const themes = {
    route: {
      headlineBn: 'আমার PujaHop Route',
      headlineEn: 'One Day. One City. Maximum Puja.',
      bg: '/images/hero-pandal-night.jpg',
    },
    count: {
      headlineBn: `আমি আজ ${totalPandals}টি সেরা পুজো ঘুরেছি`,
      headlineEn: `${totalPandals} Iconic Pandals Explored with PujaHop`,
      bg: '/images/palace-pandal-reflection.jpg',
    },
    north: {
      headlineBn: 'উত্তর কলকাতার ঐতিহ্য পুজো ট্রেইল',
      headlineEn: 'North Kolkata Classical Heritage Trail',
      bg: '/images/kumartuli-tradition.jpg',
    },
    passport: {
      headlineBn: 'আমার ডিজিটাল পুজো পাসপোর্ট',
      headlineEn: 'Kolkata Durga Puja Festival Passport',
      bg: '/images/hooghly-river-night.jpg',
    },
  };

  const currentThemeData = themes[selectedTheme];

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dimensions classes based on aspect ratio
  const getCardStyle = () => {
    switch (aspectRatio) {
      case 'story':
        return 'aspect-[9/16] max-h-[580px]';
      case 'portrait':
        return 'aspect-[4/5] max-h-[500px]';
      case 'square':
        return 'aspect-square max-h-[460px]';
      case 'og':
        return 'aspect-[1.91/1] max-h-[320px]';
      default:
        return 'aspect-[9/16] max-h-[580px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0f0d1e] border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Preview Canvas */}
        <div className="flex-1 bg-[#070611] p-6 flex flex-col items-center justify-center overflow-y-auto">
          <div
            className={`relative w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 text-white ${getCardStyle()}`}
          >
            {/* Background Image with Dark Vignette */}
            <Image
              src={currentThemeData.bg}
              alt="PujaHop Social Creative"
              fill
              className="object-cover object-center brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090814] via-[#090814]/40 to-[#090814]/80 pointer-events-none" />

            {/* Top Brand Bar */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <Logo variant="horizontal" size="sm" showTagline={false} />
              <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                Kolkata 2026
              </span>
            </div>

            {/* Middle Content */}
            <div className="relative z-10 space-y-3 my-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-600/30 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Verified Itinerary</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight drop-shadow-md">
                {currentThemeData.headlineBn}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium">
                {currentThemeData.headlineEn}
              </p>

              {/* Stops pill list */}
              {pandalStops.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px]">
                  {pandalStops.slice(0, 4).map((stop, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-zinc-200"
                    >
                      {stop.pandal?.name_bn || stop.custom_name}
                    </span>
                  ))}
                  {pandalStops.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      +{pandalStops.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Stats badges */}
              <div className="flex items-center gap-3 pt-2 text-[11px] text-zinc-300 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {totalPandals} Pandals
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Footprints className="w-3 h-3 text-emerald-400" />
                  {walkingKm} km Walk
                </span>
              </div>
            </div>

            {/* Bottom Footer Watermark with Official Creator Credit */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-end justify-between text-[10px] text-zinc-400">
              <div>
                <div className="text-white font-semibold">pujahop.kolkata</div>
                <div className="text-[9px] text-zinc-500">
                  Created &amp; Conceptualized by Saswata Dey (Riik)
                </div>
              </div>
              <span className="text-[9px] text-amber-400 font-mono">
                One Day • One City • Maximum Puja
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Presets */}
        <div className="w-full lg:w-80 p-6 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0d0b1a]">
          <div className="space-y-5">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Campaign Share Card</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Generate high-resolution social share layouts from your active PujaHop route.
              </p>
            </div>

            {/* Aspect Ratio Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Format &amp; Canvas Ratio
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setAspectRatio('story')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    aspectRatio === 'story'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">Instagram Story</div>
                  <div className="text-[10px] text-zinc-500">9:16 (1080×1920)</div>
                </button>
                <button
                  onClick={() => setAspectRatio('portrait')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    aspectRatio === 'portrait'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">IG Portrait</div>
                  <div className="text-[10px] text-zinc-500">4:5 (1080×1350)</div>
                </button>
                <button
                  onClick={() => setAspectRatio('square')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    aspectRatio === 'square'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">Square Post</div>
                  <div className="text-[10px] text-zinc-500">1:1 (1080×1080)</div>
                </button>
                <button
                  onClick={() => setAspectRatio('og')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    aspectRatio === 'og'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold">OG Banner</div>
                  <div className="text-[10px] text-zinc-500">1.91:1 (1200×630)</div>
                </button>
              </div>
            </div>

            {/* Campaign Theme Preset */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Editorial Theme
              </label>
              <div className="space-y-1.5 text-xs">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                      selectedTheme === key
                        ? 'bg-rose-600/20 border-rose-500/50 text-rose-300 font-semibold'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {themes[key].headlineBn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied to Clipboard!' : 'Share Itinerary Link'}</span>
            </button>

            <div className="text-center text-[10px] text-zinc-500">
              Saswata Dey (Riik) • PujaHop Kolkata Engine
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
