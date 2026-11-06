'use client';

// =============================================================================
// RIIQX — User Data Ownership & DPDP Act Privacy Settings View
// One-Click JSON Archive Export • Permanent Deletion • Autonomy Controls
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
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Twin Controls &amp; Data Ownership
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Data Ownership &amp; Privacy Center
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Configure your Twin&rsquo;s autonomy and exercise complete ownership under the DPDP Act.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Left Column (2 Cols): Twin Profile & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sliders className="h-5 w-5 text-[#FF5722]" />
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                  Twin Configuration &amp; Autonomy
                </h3>
              </div>
              {savedSuccess && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#16865D]">
                  <CheckCircle2 className="h-4 w-4" /> Saved Successfully
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Twin Name */}
              <div>
                <label className="block text-xs font-bold text-[#1A1817] dark:text-white mb-1">Twin Name</label>
                <input
                  type="text"
                  value={profile.twinName}
                  onChange={(e) => setProfile({ ...profile, twinName: e.target.value })}
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              {/* Autonomy Level Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#1A1817] dark:text-white">
                    Autonomy Level: Level {profile.autonomyLevel}
                  </label>
                  <span className="text-[11px] text-[#6B6661]">
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
                  className="w-full accent-[#FF5722]"
                />
              </div>

              {/* Tone & Budget Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1817] dark:text-white mb-1">Personality Tone</label>
                  <select
                    value={profile.tone}
                    onChange={(e) => setProfile({ ...profile, tone: e.target.value as any })}
                    className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33]"
                  >
                    <option value="pragmatic_analytical">Pragmatic &amp; Analytical</option>
                    <option value="warm_supportive">Warm &amp; Supportive</option>
                    <option value="direct_concise">Direct &amp; Concise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1817] dark:text-white mb-1">Budget Orientation</label>
                  <select
                    value={profile.budgetTier}
                    onChange={(e) => setProfile({ ...profile, budgetTier: e.target.value as any })}
                    className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33]"
                  >
                    <option value="frugal">Frugal (Maximum thrift)</option>
                    <option value="balanced">Balanced Value (Optimal ROI)</option>
                    <option value="premium">Premium (Best build &amp; specs)</option>
                  </select>
                </div>
              </div>

              {/* Preferred Brands */}
              <div>
                <label className="block text-xs font-bold text-[#1A1817] dark:text-white mb-1">
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
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              {/* Avoid Keywords / Red Flags */}
              <div>
                <label className="block text-xs font-bold text-[#1A1817] dark:text-white mb-1">
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
                  className="w-full text-xs p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-none focus:border-[#FF5722]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Twin Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: DPDP Act Data Ownership & Exports */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#16865D]" />
              <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                DPDP Act Data Rights
              </h3>
            </div>

            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
              Under India&rsquo;s Digital Personal Data Protection Act, you have the right to obtain a full machine-readable copy of your data or permanently delete all recorded facts.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] py-3 text-xs font-bold text-[#1A1817] dark:text-white hover:border-[#FF5722] transition-colors"
              >
                <Download className="h-4 w-4 text-[#FF5722]" />
                <span>Export Full Data Archive (JSON)</span>
              </button>

              <button
                onClick={handleDeleteAllData}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 py-3 text-xs font-bold text-[#FF4D4F] hover:bg-[#FF4D4F]/20 transition-colors"
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
