'use client';

// =============================================================================
// RIIQX — Weekly Personal Intelligence Digest View
// Scheduled Summaries • On-Demand Synthesis • Verifiable Citations
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Sparkles,
  CheckCircle2,
  Bookmark,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Target,
  Utensils,
  Radar,
} from 'lucide-react';
import { WeeklyDigest } from '@/lib/riiqx/twin-types';
import { useRiiqx } from '@/context/RiiqxContext';

export function TwinDigestView() {
  const { setActiveTab } = useRiiqx();
  const [digests, setDigests] = useState<WeeklyDigest[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDigests();
  }, []);

  const loadDigests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/twin/digest');
      if (res.ok) {
        const data = await res.json();
        setDigests(data.digests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateDigest = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/twin/digest', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.digest) {
          setDigests((prev) => [data.digest, ...prev.filter((d) => d.id !== data.digest.id)]);
          setSelectedIndex(0);
        }
      }
    } catch (err) {
      console.error('Failed to regenerate digest:', err);
    } finally {
      setGenerating(false);
    }
  };

  const currentDigest = digests[selectedIndex] || digests[0];

  const handleCopySummary = () => {
    if (!currentDigest) return;
    const text = `${currentDigest.title}\nWeek of ${new Date(currentDigest.weekStartDate).toLocaleDateString()}\n\n` +
      currentDigest.sections.map((s) => `• ${s.title}: ${s.summary}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSectionIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('deal') || t.includes('radar')) return Radar;
    if (t.includes('budget') || t.includes('goal')) return Target;
    if (t.includes('lifestyle') || t.includes('food')) return Utensils;
    return Bookmark;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8 relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Personal Digest
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Weekly Intelligence Digest
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Consolidated intelligence covering your active goals, detected price drops, and lifestyle picks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerateDigest}
            disabled={generating}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white px-5 py-2.5 text-xs font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Compiling Intelligence...' : 'Regenerate Digest'}</span>
          </button>
        </div>
      </div>

      {/* 2. Week Selector Bar if multiple digests exist */}
      {digests.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {digests.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => setSelectedIndex(idx)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 ${
                selectedIndex === idx
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Week of {new Date(d.weekStartDate).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Main Digest Content */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-white/[0.08] max-w-xl mx-auto space-y-3">
          <RefreshCw className="h-8 w-8 text-orange-400 mx-auto animate-spin" />
          <h3 className="text-base font-bold text-white font-heading">Loading Intelligence Digest...</h3>
        </div>
      ) : currentDigest ? (
        <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Digest Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 relative z-10">
            <div>
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider font-mono">
                Week of {new Date(currentDigest.weekStartDate).toLocaleDateString()}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                {currentDigest.title}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 border border-white/[0.08] px-3.5 py-2 rounded-xl transition-all"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" /> Curated by Twin
              </span>
            </div>
          </div>

          {/* Digest Sections */}
          <div className="space-y-4 relative z-10">
            {currentDigest.sections.map((sec, idx) => {
              const Icon = getSectionIcon(sec.title);
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.06] hover:border-white/[0.14] space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                      <Icon className="h-4 w-4 text-orange-400" />
                      <span>{sec.title}</span>
                    </h3>
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/[0.06]">
                      Section 0{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {sec.summary}
                  </p>

                  {sec.sourceCitations && sec.sourceCitations.length > 0 && (
                    <div className="pt-2.5 border-t border-white/[0.06] text-[10px] text-zinc-400 flex items-center gap-1.5 font-mono">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-bold text-zinc-400">Sources &amp; Evidence: </span>
                      <span className="text-zinc-300 truncate">{sec.sourceCitations.join(' • ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="text-xs text-zinc-400">
              Want deeper details on any recommendation?
            </div>
            <button
              onClick={() => setActiveTab('twin')}
              className="flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors group"
            >
              <span>Discuss with Twin in Chat</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-dashed border-white/[0.1] max-w-xl mx-auto space-y-4">
          <BookOpen className="h-10 w-10 text-zinc-500 mx-auto opacity-40" />
          <h3 className="text-base font-bold text-white font-heading">No digest generated yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Your weekly digest compiles automatically based on your active goals and saved searches, or you can generate one right now.
          </p>
          <button
            onClick={handleRegenerateDigest}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 text-xs font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate First Digest</span>
          </button>
        </div>
      )}
    </div>
  );
}
