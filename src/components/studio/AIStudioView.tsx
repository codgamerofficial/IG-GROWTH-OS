'use client';

// =============================================================================
// IG GrowthOS: AI Studio (Sections 12, 13, 14, 15)
// Dedicated Reel Agent, UGC Agent, Product Content Agent & Affiliate Workflow
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { GeneratedReel } from '@/lib/ai/types';
import {
  Film,
  Sparkles,
  Layers,
  Send,
  Video,
  List,
  CheckCircle2,
  Bookmark,
  Share2,
  Clock,
  Mic,
  Camera,
  FileCheck,
} from 'lucide-react';

export function AIStudioView() {
  const { brand, products, createContentItem, setActiveTab } = useGrowthOS();

  const [activeAgent, setActiveAgent] = useState<'reel' | 'ugc' | 'affiliate'>('reel');

  // Reel Agent State
  const [topic, setTopic] = useState('Why your $80 hoodie feels like cardboard after wash #1');
  const [selectedProduct, setSelectedProduct] = useState('Modular Double-Zip Boxy Hoodie');
  const [duration, setDuration] = useState(30);
  const [generating, setGenerating] = useState(false);
  const [reelResult, setReelResult] = useState<GeneratedReel | null>(null);

  // UGC Agent State
  const [ugcStyle, setUgcStyle] = useState('Unboxing & Honest Reaction');
  const ugcStyles = [
    'Testimonial',
    'Unboxing & Honest Reaction',
    'Problem / Solution',
    'POV: Uniform Architecture',
    'Before / After Proportion Fix',
    'Reaction to New Drop',
    'Tutorial: Layering Masterclass',
    'Comparison: Fast Fashion vs RIIQX',
    'Storytelling: The Atelier Archive',
    'Street-Style Fit Check',
    'Product Endurance Demo',
  ];

  const handleGenerateReel = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/ai/reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          product: selectedProduct,
          durationSeconds: duration,
          brandName: brand?.name || 'RIIQX',
        }),
      });
      const data = await res.json();
      if (data.success && data.reel) {
        setReelResult(data.reel);
      }
    } catch (err: any) {
      alert(`Reel generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToApprovals = async () => {
    if (!reelResult) return;
    await createContentItem({
      title: reelResult.title,
      content_type: 'Reel',
      content_pillar: 'Product Showcase',
      hook: reelResult.hook,
      script: {
        hook: reelResult.hook,
        problem: reelResult.problem_context,
        story: reelResult.value_story,
        payoff: reelResult.payoff,
        cta: reelResult.cta,
        voiceover: reelResult.voiceover,
        shot_list: reelResult.shot_list,
        b_roll: reelResult.b_roll,
        on_screen_text: reelResult.on_screen_text,
        production_notes: reelResult.production_notes,
      },
      caption: reelResult.caption,
      hashtags: reelResult.hashtags,
      cta: reelResult.cta,
      cover_text: reelResult.cover_text,
      status: 'READY',
      approval_status: 'PENDING',
      ai_score: reelResult.ai_score,
      ai_score_breakdown: reelResult.ai_score_breakdown,
    });
    alert('Reel package sent to Approvals queue (approval_status = PENDING)!');
    setActiveTab('approvals');
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-rose-400" />
            <span>AI Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Produce complete scene-by-scene scripts, voiceovers, shot lists, and captions.
          </p>
        </div>

        {/* Agent Switcher */}
        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          <button
            onClick={() => setActiveAgent('reel')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeAgent === 'reel' ? 'bg-rose-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Reel Agent (0-30s)
          </button>
          <button
            onClick={() => setActiveAgent('ugc')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeAgent === 'ugc' ? 'bg-rose-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            UGC Agent (11 Formats)
          </button>
        </div>
      </div>

      {/* REEL AGENT SECTION */}
      {activeAgent === 'reel' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Topic / Concept Angle</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Focus Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
                >
                  {products.map((pr) => (
                    <option key={pr.id} value={pr.name} className="bg-[#151519]">
                      {pr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleGenerateReel}
                disabled={generating}
                className="rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Structuring Reel Package...</span>
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4" />
                    <span>Generate Complete Reel Package</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Reel Package Display */}
          {reelResult && (
            <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                    Official 30-Second Reel Blueprint
                  </span>
                  <h2 className="text-lg font-bold text-white">{reelResult.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-right">
                    <span className="text-[10px] text-zinc-400 block leading-none">Opportunity</span>
                    <span className="text-sm font-bold text-amber-400">{reelResult.ai_score}/100</span>
                  </div>
                  <button
                    onClick={handleSendToApprovals}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Send to Approvals Queue</span>
                  </button>
                </div>
              </div>

              {/* 5-Phase Timeline Blocks (Section 12) */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-rose-500/20">
                  <span className="text-[10px] font-bold text-rose-400 uppercase block mb-1">0–3s • Hook</span>
                  <p className="text-zinc-200 italic">&ldquo;{reelResult.hook}&rdquo;</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">3–8s • Problem</span>
                  <p className="text-zinc-300">{reelResult.problem_context}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">8–20s • Value</span>
                  <p className="text-zinc-300">{reelResult.value_story}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">20–30s • Payoff</span>
                  <p className="text-zinc-300">{reelResult.payoff}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Final • CTA</span>
                  <p className="text-emerald-200">{reelResult.cta}</p>
                </div>
              </div>

              {/* Scene-by-Scene Table */}
              <div>
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Video className="h-4 w-4 text-rose-400" />
                  <span>Scene-by-Scene Script & Visual Direction</span>
                </h3>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-zinc-400 border-b border-white/10 text-[11px]">
                      <tr>
                        <th className="p-3 w-28">Timestamp</th>
                        <th className="p-3">Visual Direction</th>
                        <th className="p-3">Audio / Voiceover</th>
                        <th className="p-3">On-Screen Text</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {reelResult.scene_by_scene_script.map((scene, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-mono text-rose-400 font-semibold">{scene.timestamp}</td>
                          <td className="p-3">{scene.visual}</td>
                          <td className="p-3 text-zinc-200 italic">{scene.audio}</td>
                          <td className="p-3">
                            <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold border border-amber-500/20">
                              {scene.on_screen_text}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shot List & B-Roll */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-pink-400" />
                    <span>Shot List</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {reelResult.shot_list.map((shot, i) => (
                      <li key={i}>{shot}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <List className="h-4 w-4 text-amber-400" />
                    <span>B-Roll Cutaways</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {reelResult.b_roll.map((roll, i) => (
                      <li key={i}>{roll}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Caption & Hashtags */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <h4 className="font-bold text-white">Full Caption Copy</h4>
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{reelResult.caption}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* UGC AGENT SECTION */}
      {activeAgent === 'ugc' && (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white">UGC Creator Persona & Scenario Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">UGC Format Style</label>
              <select
                value={ugcStyle}
                onChange={(e) => setUgcStyle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
              >
                {ugcStyles.map((s, idx) => (
                  <option key={idx} value={s} className="bg-[#151519]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name} className="bg-[#151519]">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-xs space-y-3">
            <div>
              <strong className="text-rose-400 block mb-1">Creator Persona:</strong>
              <p className="text-zinc-200">
                23-year-old streetwear archivist living in Brooklyn or Shoreditch, obsessed with heavy GSM fabrics and brutalist architecture. Natural unfiltered lighting.
              </p>
            </div>
            <div>
              <strong className="text-rose-400 block mb-1">Authentic Opening Hook:</strong>
              <p className="text-zinc-200 italic">
                &ldquo;I spent $95 on the viral RIIQX cargos so you don&apos;t have to. Here is my 100% honest review.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
