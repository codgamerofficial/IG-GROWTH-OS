'use client';

// =============================================================================
// IG GrowthOS: Content Idea Engine (Section 10 & 11)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { GeneratedIdea } from '@/lib/ai/types';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  Flame,
  Bookmark,
  Share2,
  TrendingUp,
  CheckCircle2,
  Film,
  Plus,
} from 'lucide-react';

export function IdeasEngineView() {
  const { brand, pillars, products, createContentItem, setActiveTab } = useGrowthOS();

  const [selectedPillar, setSelectedPillar] = useState('Outfit Inspiration');
  const [selectedAudience, setSelectedAudience] = useState('Gen Z & Streetwear connoisseurs');
  const [selectedGoal, setSelectedGoal] = useState('High Saves & Shares');
  const [selectedFormat, setSelectedFormat] = useState('Reel');
  const [selectedProduct, setSelectedProduct] = useState('Modular Double-Zip Boxy Hoodie');
  const [selectedTone, setSelectedTone] = useState('Premium, sleek, unapologetic');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brand?.name || 'RIIQX',
          category: 'Fashion / Clothing / Lifestyle',
          pillar: selectedPillar,
          audience: selectedAudience,
          goal: selectedGoal,
          format: selectedFormat,
          product: selectedProduct,
          tone: selectedTone,
          count: 10,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
      }
    } catch (err: any) {
      alert(`Error generating ideas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDrafts = async (idea: GeneratedIdea) => {
    await createContentItem({
      title: idea.title,
      content_type: idea.recommended_format,
      content_pillar: idea.content_pillar,
      hook: idea.hook,
      caption: `${idea.concept}\n\nWhy it works: ${idea.why_it_could_work}\n\n#riiqx #streetwear #fashion`,
      hashtags: ['#riiqx', '#fashiontips', '#streetwearinspo'],
      status: 'DRAFT',
      approval_status: 'DRAFT',
      ai_score: idea.ai_score,
      ai_score_breakdown: idea.ai_score_breakdown,
    });
    setSavedCount((p) => p + 1);
    alert(`Saved "${idea.title}" to Drafts!`);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-amber-400" />
          <span>AI Content Idea Engine</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Generate 10 algorithm-tailored content angles scored with the multi-factor AI Opportunity formula.
        </p>
      </div>

      {/* Control Panel */}
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pillar */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Content Pillar</label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            >
              {pillars.map((p) => (
                <option key={p.id} value={p.name} className="bg-[#151519]">
                  {p.name} ({p.percentage}%)
                </option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Campaign Goal</label>
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            >
              <option value="High Saves & Shares" className="bg-[#151519]">High Saves & Shares (Algorithmic Push)</option>
              <option value="Viral Reach & Discovery" className="bg-[#151519]">Viral Reach & Discovery (Top of Funnel)</option>
              <option value="Product Conversions" className="bg-[#151519]">Product Conversions (Direct Checkout)</option>
              <option value="Community Engagement" className="bg-[#151519]">Community Engagement (Debate & Comments)</option>
            </select>
          </div>

          {/* Product Focus */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Product Focus</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            >
              {products.map((pr) => (
                <option key={pr.id} value={pr.name} className="bg-[#151519]">
                  {pr.name} (${pr.price})
                </option>
              ))}
            </select>
          </div>

          {/* Audience */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Target Audience</label>
            <input
              type="text"
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            />
          </div>

          {/* Format */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Recommended Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            >
              <option value="Reel" className="bg-[#151519]">Reel (Short-form Video)</option>
              <option value="Carousel" className="bg-[#151519]">Carousel (Multi-slide Masterclass)</option>
              <option value="UGC" className="bg-[#151519]">UGC (Creator Fit Check)</option>
              <option value="Single Image" className="bg-[#151519]">Single Image (High-Res Editorial)</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Brand Tone</label>
            <input
              type="text"
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating 10 Scored Angles...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-white" />
                <span>Generate 10 Content Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Ideas Grid */}
      {ideas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Generated Ideas ({ideas.length})</h2>
            <span className="text-xs text-zinc-400">Ranked by AI Opportunity Score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl hover:border-rose-500/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        {idea.recommended_format}
                      </span>
                      <span className="rounded-lg bg-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-300">
                        {idea.content_pillar}
                      </span>
                    </div>

                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-right">
                      <span className="text-[10px] text-zinc-400 block leading-none">Score</span>
                      <span className="text-sm font-bold text-amber-400">{idea.ai_score}/100</span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white leading-snug">{idea.title}</h3>

                  <div className="mt-2.5 rounded-xl bg-white/5 p-3 border border-white/5 text-xs">
                    <strong className="text-rose-400 block mb-0.5">Hook:</strong>
                    <span className="text-zinc-200 italic">&ldquo;{idea.hook}&rdquo;</span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-300 leading-relaxed">{idea.concept}</p>

                  <div className="mt-3 text-xs text-emerald-400/90 bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/20">
                    <strong>Why it could work:</strong> {idea.why_it_could_work}
                  </div>

                  {/* Factor potential gauges */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                      <span className="text-zinc-400 block">Share</span>
                      <strong className="text-white text-xs">{idea.share_potential}%</strong>
                    </div>
                    <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                      <span className="text-zinc-400 block">Save</span>
                      <strong className="text-white text-xs">{idea.save_potential}%</strong>
                    </div>
                    <div className="bg-white/5 rounded-lg p-1.5 border border-white/5">
                      <span className="text-zinc-400 block">Conversion</span>
                      <strong className="text-white text-xs">{idea.conversion_potential}%</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">
                    Difficulty: <strong className="text-white">{idea.estimated_difficulty}</strong>
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveToDrafts(idea)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      Save to Drafts
                    </button>
                    <button
                      onClick={() => {
                        handleSaveToDrafts(idea);
                        setActiveTab('studio');
                      }}
                      className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                    >
                      Open in Studio
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
