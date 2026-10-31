'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Brand Kit & Visual Styling System
// Palettes • Typography • Watermarks • Caption Presets • Brand Voice
// =============================================================================

import React, { useState } from 'react';
import {
  BrandKit,
  CaptionStyle,
  AudioVibe,
  ContentTone,
} from '@/lib/riiqx/creator-types';
import { DEFAULT_BRAND_KIT } from '@/lib/riiqx/creator-engine';
import {
  Palette,
  Type,
  Sparkles,
  Check,
  Shield,
  Volume2,
  Bookmark,
  Sliders,
} from 'lucide-react';

export function BrandKitTab() {
  const [brandKit, setBrandKit] = useState<BrandKit>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('riiqx_brand_kit_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_BRAND_KIT;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('riiqx_brand_kit_v2', JSON.stringify(brandKit));
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      } catch {}
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <Palette className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Brand Kit &amp; Styling Vault
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              Auto-Applied Across All Projects
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Define your brand visual identity, typography tokens, watermark badges, and standard CTA loops.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95"
        >
          {savedSuccess ? <Check className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          <span>{savedSuccess ? 'Brand Kit Saved!' : 'Save Brand Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Brand Identity & Colors */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#FFD43B]" />
              Brand Identity
            </h3>

            <div>
              <label className="text-xs font-bold text-white block mb-1">Brand Name</label>
              <input
                type="text"
                value={brandKit.brandName}
                onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                className="w-full rounded-xl bg-[#151515] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">Tagline</label>
              <input
                type="text"
                value={brandKit.tagline}
                onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                className="w-full rounded-xl bg-[#151515] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">Default Call to Action (CTA)</label>
              <input
                type="text"
                value={brandKit.defaultCta}
                onChange={(e) => setBrandKit({ ...brandKit, defaultCta: e.target.value })}
                className="w-full rounded-xl bg-[#151515] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
              />
            </div>
          </div>

          {/* Color Palette */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#FFD43B]" />
              Signature Color Tokens
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#A3A3A3] block mb-1">Primary Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.primaryColor || '#FFD43B'}
                    onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                    className="h-8 w-8 rounded-lg border border-[#2E2E2E] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandKit.primaryColor || '#FFD43B'}
                    onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                    className="flex-1 rounded-lg bg-[#151515] border border-[#2E2E2E] px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#A3A3A3] block mb-1">Secondary Pop</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.secondaryColor || '#FF6B5E'}
                    onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                    className="h-8 w-8 rounded-lg border border-[#2E2E2E] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandKit.secondaryColor || '#FF6B5E'}
                    onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                    className="flex-1 rounded-lg bg-[#151515] border border-[#2E2E2E] px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Vibe & Caption Typography */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="h-4 w-4 text-[#FFD43B]" />
              Default Kinetic Caption Style
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'mrbeast' as CaptionStyle, label: 'Viral Yellow (MrBeast)' },
                { id: 'neon' as CaptionStyle, label: 'Cyber Neon' },
                { id: 'karaoke' as CaptionStyle, label: 'Karaoke Beat' },
                { id: 'minimal' as CaptionStyle, label: 'Minimal Studio' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setBrandKit({ ...brandKit, defaultCaptionStyle: style.id })}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    brandKit.defaultCaptionStyle === style.id
                      ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-white font-bold'
                      : 'border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:border-[#3E3E3E]'
                  }`}
                >
                  <div className="text-xs">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-[#FFD43B]" />
              Default Audio Vibe &amp; Rhythm
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'phonk' as AudioVibe, label: 'Drift Phonk' },
                { id: 'synthwave' as AudioVibe, label: 'Synthwave' },
                { id: 'upbeat_lofi' as AudioVibe, label: 'Upbeat Lofi' },
                { id: 'cinematic' as AudioVibe, label: 'Cinematic' },
                { id: 'viral_pop' as AudioVibe, label: 'Viral Pop' },
                { id: 'deep_ambient' as AudioVibe, label: 'Deep Ambient' },
              ].map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => setBrandKit({ ...brandKit, defaultAudioVibe: vibe.id })}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    brandKit.defaultAudioVibe === vibe.id
                      ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-white font-bold'
                      : 'border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:border-[#3E3E3E]'
                  }`}
                >
                  <div className="text-xs">{vibe.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
