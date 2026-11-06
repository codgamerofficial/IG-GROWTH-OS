'use client';

// =============================================================================
// RIIQX — Weekly Personal Intelligence Digest View
// Scheduled Summaries • On-Demand Synthesis • Verifiable Citations
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

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Personal Digest
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Weekly Intelligence Digest
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Consolidated intelligence covering your active goals, detected price drops, and lifestyle picks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerateDigest}
            disabled={generating}
            className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] disabled:opacity-50 text-white px-5 py-2.5 text-xs font-black shadow-xs transition-transform active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Compiling Intelligence...' : 'Regenerate Digest'}</span>
          </button>
        </div>
      </div>

      {/* 2. Week Selector Bar if multiple digests exist */}
      {digests.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {digests.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => setSelectedIndex(idx)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedIndex === idx
                  ? 'bg-[#1A1817] text-white dark:bg-white dark:text-[#1A1817] shadow-xs'
                  : 'bg-white dark:bg-[#18181C] text-[#6B6661] border border-[#EAE3D9] dark:border-[#26262B]'
              }`}
            >
              <Calendar className="h-3 w-3" />
              <span>Week of {new Date(d.weekStartDate).toLocaleDateString()}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Main Digest Content */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] max-w-xl mx-auto space-y-3">
          <RefreshCw className="h-8 w-8 text-[#FF5722] mx-auto animate-spin" />
          <h3 className="text-base font-bold text-[#1A1817] dark:text-white">Loading Intelligence Digest...</h3>
        </div>
      ) : currentDigest ? (
        <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl mx-auto">
          {/* Digest Card Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#FF5722] tracking-wider">
                Week of {new Date(currentDigest.weekStartDate).toLocaleDateString()}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white font-heading mt-1">
                {currentDigest.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 text-xs font-bold text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#1A1817] dark:hover:text-white bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] px-3.5 py-1.5 rounded-xl transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#16865D]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <span className="flex items-center gap-1.5 text-xs font-bold text-[#16865D] bg-[#16865D]/10 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="h-3.5 w-3.5" /> Curated by Twin
              </span>
            </div>
          </div>

          {/* Digest Sections */}
          <div className="space-y-6">
            {currentDigest.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1A1817] dark:text-white font-heading flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-[#FF5722]" />
                    <span>{sec.title}</span>
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#6B6661]">
                    Section 0{idx + 1}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#D1D1D6] leading-relaxed">
                  {sec.summary}
                </p>

                {sec.sourceCitations && sec.sourceCitations.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE3D9] dark:border-[#26262B] text-[10px] text-[#6B6661] flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#16865D] shrink-0" />
                    <span className="font-bold">Sources &amp; Evidence: </span>
                    <span className="text-[#1A1817] dark:text-white">{sec.sourceCitations.join(' • ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Action Footer */}
          <div className="pt-4 border-t border-[#EAE3D9] dark:border-[#26262B] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#6B6661]">
              Want deeper details on any recommendation?
            </div>
            <button
              onClick={() => setActiveTab('twin')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#FF5722] hover:underline"
            >
              <span>Discuss with Twin in Chat</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] max-w-xl mx-auto space-y-4">
          <BookOpen className="h-10 w-10 text-[#6B6661] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#1A1817] dark:text-white">No digest generated yet</h3>
          <p className="text-xs text-[#6B6661]">
            Your weekly digest compiles automatically based on your active goals and saved searches, or you can generate one right now.
          </p>
          <button
            onClick={handleRegenerateDigest}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2.5 text-xs font-black shadow-xs"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate First Digest</span>
          </button>
        </div>
      )}
    </div>
  );
}
