'use client';

// =============================================================================
// IG GrowthOS: Brand Settings & RIIQX Configuration (Section 39 & 40)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { Tag, Save, CheckCircle2, Sliders, Shield } from 'lucide-react';

export function BrandSettingsView() {
  const { brand, pillars } = useGrowthOS();

  const [brandName, setBrandName] = useState(brand?.name || 'RIIQX');
  const [description, setDescription] = useState(
    brand?.description || 'High-end contemporary streetwear and avant-garde lifestyle fashion for the modern vanguard.'
  );
  const [targetAudience, setTargetAudience] = useState(
    brand?.target_audience || 'Gen Z & young fashion-conscious users, aesthetics connoisseurs'
  );
  const [brandVoice, setBrandVoice] = useState(
    brand?.brand_voice || 'Premium, unapologetic, confident, trend-forward, sleek, highly visual, concise'
  );
  const [timezone, setTimezone] = useState(brand?.timezone || 'America/New_York');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/brand', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: brand?.id,
        name: brandName,
        description,
        target_audience: targetAudience,
        brand_voice: brandVoice,
        timezone,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Tag className="h-6 w-6 text-rose-400" />
          <span>Brand Settings: {brand?.name || 'RIIQX'}</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure audience archetypes, brand voice guidelines, and content distribution pillars.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Profile Details */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-rose-400" />
            <span>Profile & Voice Architecture</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Brand Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Brand Voice</label>
            <input
              type="text"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* 8 Content Pillars Configuration (Section 40) */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">Configured Content Pillars ({pillars.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{pillar.name}</span>
                  <span className="text-rose-400 font-mono">{pillar.percentage}%</span>
                </div>
                <p className="text-[11px] text-zinc-400">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Saved Successfully!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Brand Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
