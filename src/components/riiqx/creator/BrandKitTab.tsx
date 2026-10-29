'use client';

// =============================================================================
// RIIQX Creator Studio — Brand Kit & Visual Styling System
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Brand Kit & Styling Vault</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              Auto-Applied Across All Projects
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Define your brand visual identity, typography tokens, watermark badges, and standard CTA loops.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          {savedSuccess ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Sparkles className="h-3.5 w-3.5" />}
          <span>{savedSuccess ? 'Brand Kit Saved!' : 'Save Brand Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Brand Identity & Colors */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-400" />
              Brand Identity
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Brand Name</label>
              <input
                type="text"
                value={brandKit.brandName}
                onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Tagline</label>
              <input
                type="text"
                value={brandKit.tagline}
                onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Watermark Handle</label>
              <input
                type="text"
                value={brandKit.watermarkText}
                onChange={(e) => setBrandKit({ ...brandKit, watermarkText: e.target.value })}
                className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
          </div>

          {/* Color Palette */}
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="h-4 w-4 text-violet-400" />
              Color Palette Tokens
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Primary Violet
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.primaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, primaryColor: e.target.value })}
                    className="h-8 w-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white font-bold">{brandKit.primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Secondary
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.secondaryColor}
                    onChange={(e) => setBrandKit({ ...brandKit, secondaryColor: e.target.value })}
                    className="h-8 w-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white font-bold">{brandKit.secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Accent Emerald
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.accentColor}
                    onChange={(e) => setBrandKit({ ...brandKit, accentColor: e.target.value })}
                    className="h-8 w-8 rounded-lg border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white font-bold">{brandKit.accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audio, Subtitles & CTA */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="h-4 w-4 text-violet-400" />
              Subtitle & Voice Defaults
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Default Subtitle Preset</label>
              <select
                value={brandKit.defaultCaptionStyle}
                onChange={(e) =>
                  setBrandKit({ ...brandKit, defaultCaptionStyle: e.target.value as CaptionStyle })
                }
                className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="mrbeast">Viral Yellow (MrBeast Style)</option>
                <option value="neon">Cyber Neon Glow</option>
                <option value="minimal">Minimal Modern Sans</option>
                <option value="karaoke">Kinetic Karaoke Word-by-Word</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Default Audio Vibe</label>
              <select
                value={brandKit.defaultAudioVibe}
                onChange={(e) =>
                  setBrandKit({ ...brandKit, defaultAudioVibe: e.target.value as AudioVibe })
                }
                className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="phonk">Phonk Energy 124 BPM</option>
                <option value="synthwave">Synthwave Aesthetic</option>
                <option value="cinematic">Cinematic Crescendo</option>
                <option value="upbeat_lofi">Upbeat Lo-Fi Chill</option>
                <option value="viral_pop">Viral Pop Rhythmic</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Default Outro CTA</label>
              <textarea
                rows={3}
                value={brandKit.defaultCta}
                onChange={(e) => setBrandKit({ ...brandKit, defaultCta: e.target.value })}
                className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500 resize-none font-sans"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
