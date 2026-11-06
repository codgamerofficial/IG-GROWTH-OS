'use client';

// =============================================================================
// RIIQX — User Data Ownership & DPDP Act Privacy Settings View
// One-Click JSON Archive Export • Permanent Deletion • Autonomy Controls
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Download,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Save,
  AlertTriangle,
  Lock,
  Sparkles,
} from 'lucide-react';
import { TwinProfile } from '@/lib/riiqx/twin-types';

export function TwinSettingsView() {
  const [profile, setProfile] = useState<TwinProfile>({
    id: '',
    userId: '',
    twinName: 'RIIQX Twin',
    autonomyLevel: 2,
    tone: 'pragmatic_analytical',
    budgetTier: 'balanced',
    skinType: 'Combination / Sensitive',
    preferredBrands: ['Sony', 'Apple', 'Minimalist', 'Asics'],
    avoidKeywords: ['Fast Fashion Polyester', 'Unverified UV Filters'],
    notificationFrequency: 'weekly',
    createdAt: '',
    updatedAt: '',
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/twin/profile');
        if (res.ok) {
          const d = await res.json();
          if (d.profile) setProfile(d.profile);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/twin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    window.location.href = '/api/twin/data';
  };

  const handleDeleteAllData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete all stored twin memories, profiles, goals, and history? This cannot be undone.'
    );
    if (!confirmed) return;

    try {
      const res = await fetch('/api/twin/data', { method: 'DELETE' });
      if (res.ok) {
        alert('All personal data has been completely erased in accordance with DPDP Act standards.');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8 relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Settings className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Twin Controls &amp; Data Ownership
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Data Ownership &amp; Privacy Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Configure your Twin&rsquo;s autonomy and exercise complete ownership under the DPDP Act.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Left Column (2 Cols): Twin Profile & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Sliders className="h-4 w-4" />
                </div>
                <h3 className="text-base font-black text-white font-heading">
                  Twin Configuration &amp; Autonomy
                </h3>
              </div>
              {savedSuccess && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-in fade-in">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Saved Successfully
                </span>
              )}
            </div>

            <div className="space-y-5">
              {/* Twin Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-white">Twin Name</label>
                <input
                  type="text"
                  value={profile.twinName}
                  onChange={(e) => setProfile({ ...profile, twinName: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-white focus:outline-hidden focus:border-orange-500 shadow-inner"
                />
              </div>

              {/* Autonomy Level Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white">
                    Autonomy Level: <span className="text-orange-400 font-mono font-black">Level {profile.autonomyLevel}</span>
                  </label>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {profile.autonomyLevel === 1
                      ? 'Advisory (Always asks)'
                      : profile.autonomyLevel === 2
                      ? 'Semi-Autonomous (Prepares & confirms)'
                      : 'High Autonomy (Acts on pre-approved boundaries)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={profile.autonomyLevel}
                  onChange={(e) => setProfile({ ...profile, autonomyLevel: Number(e.target.value) as any })}
                  className="w-full accent-orange-500 cursor-pointer h-2 bg-zinc-950 rounded-lg"
                />
              </div>

              {/* Tone & Budget Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">Personality Tone</label>
                  <select
                    value={profile.tone}
                    onChange={(e) => setProfile({ ...profile, tone: e.target.value as any })}
                    className="w-full text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-white font-bold focus:outline-hidden focus:border-orange-500"
                  >
                    <option value="pragmatic_analytical">Pragmatic &amp; Analytical</option>
                    <option value="warm_supportive">Warm &amp; Supportive</option>
                    <option value="direct_concise">Direct &amp; Concise</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">Budget Orientation</label>
                  <select
                    value={profile.budgetTier}
                    onChange={(e) => setProfile({ ...profile, budgetTier: e.target.value as any })}
                    className="w-full text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-white font-bold focus:outline-hidden focus:border-orange-500"
                  >
                    <option value="frugal">Frugal (Maximum thrift)</option>
                    <option value="balanced">Balanced Value (Optimal ROI)</option>
                    <option value="premium">Premium (Best build &amp; specs)</option>
                  </select>
                </div>
              </div>

              {/* Preferred Brands */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Preferred Brands (Comma separated)
                </label>
                <input
                  type="text"
                  value={profile.preferredBrands.join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredBrands: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-white focus:outline-hidden focus:border-orange-500 shadow-inner"
                />
              </div>

              {/* Avoid Keywords / Red Flags */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  Avoid Keywords / Dealbreakers
                </label>
                <input
                  type="text"
                  value={profile.avoidKeywords.join(', ')}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      avoidKeywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full text-xs p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-white focus:outline-hidden focus:border-orange-500 shadow-inner"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-7 py-3 text-xs font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Twin Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: DPDP Act Data Ownership & Exports */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-base font-black text-white font-heading">
                DPDP Act Data Rights
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Under India&rsquo;s Digital Personal Data Protection Act, you have the right to obtain a full machine-readable copy of your data or permanently delete all recorded facts.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-950/80 hover:bg-zinc-800 border border-white/[0.08] hover:border-orange-500/40 py-3 text-xs font-bold text-zinc-200 hover:text-white transition-all shadow-md group"
              >
                <Download className="h-4 w-4 text-orange-400 transition-transform group-hover:translate-y-0.5" />
                <span>Export Full Data Archive (JSON)</span>
              </button>

              <button
                onClick={handleDeleteAllData}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 py-3 text-xs font-bold text-rose-400 transition-colors shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                <span>Permanently Delete All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
