'use client';

// =============================================================================
// RIIQX / GlowFit AI — Beat-Based Storyboard Dashboard
// Pacing Strip • Beat Cards • Approve/Reject/Feedback • Sync with notes.json & Brand Kit
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Film,
  Play,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
  Layers,
  Scissors,
  Palette,
  RefreshCw,
  Save,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface StoryboardBeat {
  beatNumber: number;
  timecode: string;
  durationSeconds: number;
  speechTranscript: string;
  visualDirection: string;
  captions: string;
  captionStyle: {
    highlightColor: string;
    animation: string;
  };
  bRoll: string;
  assets: string[];
  approval: 'approved' | 'rejected' | 'pending';
  feedback?: string;
}

interface StoryboardData {
  projectId: string;
  title: string;
  targetPlatform: string;
  aspectRatio: string;
  status: string;
  beats: StoryboardBeat[];
  creatorFeedbackNotes?: string;
}

export function StoryboardDashboard() {
  const [storyboard, setStoryboard] = useState<StoryboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedBeatIdx, setSelectedBeatIdx] = useState(0);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [brandKitNotes, setBrandKitNotes] = useState('');

  useEffect(() => {
    fetchStoryboard();
  }, []);

  const fetchStoryboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/riiqx/video-editor/storyboard?project=Product Showcase Launch');
      const data = await res.json();
      if (data.success && data.notes) {
        setStoryboard(data.notes);
      }
    } catch (e) {
      console.error('Failed to load storyboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (beatIdx: number, newStatus: 'approved' | 'rejected' | 'pending') => {
    if (!storyboard) return;
    const updatedBeats = [...storyboard.beats];
    updatedBeats[beatIdx] = {
      ...updatedBeats[beatIdx],
      approval: newStatus,
    };
    setStoryboard({ ...storyboard, beats: updatedBeats });
  };

  const handleFeedbackSubmit = (beatIdx: number) => {
    if (!storyboard || !feedbackInput.trim()) return;
    const updatedBeats = [...storyboard.beats];
    updatedBeats[beatIdx] = {
      ...updatedBeats[beatIdx],
      feedback: feedbackInput.trim(),
    };
    setStoryboard({ ...storyboard, beats: updatedBeats });
    setFeedbackInput('');
  };

  const saveStoryboard = async () => {
    if (!storyboard) return;
    try {
      setSaving(true);
      const res = await fetch('/api/riiqx/video-editor/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: 'Product Showcase Launch',
          notes: storyboard,
          brandKitUpdates: brandKitNotes.trim() ? brandKitNotes : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-zinc-800 bg-[#0C0C0E] p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
        <span className="ml-3 text-sm font-medium text-zinc-400">Loading Beat Storyboard...</span>
      </div>
    );
  }

  if (!storyboard) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-[#0C0C0E] p-8 text-center text-zinc-400">
        No storyboard notes found in AI Video Editor/Raw/
      </div>
    );
  }

  const totalDuration = storyboard.beats.reduce((acc, b) => acc + b.durationSeconds, 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#121215] p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">{storyboard.title}</h2>
            <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-400/20">
              {storyboard.targetPlatform}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Total Beats: {storyboard.beats.length} • Runtime: {totalDuration.toFixed(1)}s • Ratio: {storyboard.aspectRatio}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveStoryboard}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-black transition hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : savedSuccess ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {savedSuccess ? 'Saved to notes.json!' : 'Save Storyboard & Brand Kit'}
          </button>
        </div>
      </div>

      {/* Pacing Strip (Timeline) */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#0C0C0E] p-5 shadow-inner">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Scissors className="h-3.5 w-3.5 text-amber-400" />
            Interactive Pacing Strip
          </span>
          <span className="text-xs text-zinc-500">Click a beat to inspect</span>
        </div>

        {/* Visual timeline blocks */}
        <div className="flex h-12 w-full gap-1.5 rounded-xl bg-zinc-900/80 p-1.5 border border-zinc-800">
          {storyboard.beats.map((beat, idx) => {
            const widthPct = (beat.durationSeconds / totalDuration) * 100;
            const isSelected = selectedBeatIdx === idx;
            const statusColor =
              beat.approval === 'approved'
                ? 'bg-emerald-500/30 border-emerald-500/60 text-emerald-300'
                : beat.approval === 'rejected'
                ? 'bg-rose-500/30 border-rose-500/60 text-rose-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300';

            return (
              <button
                key={beat.beatNumber}
                onClick={() => setSelectedBeatIdx(idx)}
                style={{ width: `${widthPct}%` }}
                className={`relative flex flex-col justify-center items-center rounded-lg border text-[11px] font-bold transition-all ${statusColor} ${
                  isSelected ? 'ring-2 ring-amber-400 scale-[1.02] z-10' : 'hover:opacity-80'
                }`}
              >
                <span className="truncate px-1">Beat {beat.beatNumber}</span>
                <span className="text-[9px] opacity-75 font-mono">{beat.durationSeconds}s</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Beat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {storyboard.beats.map((beat, idx) => {
          const isSelected = selectedBeatIdx === idx;

          return (
            <div
              key={beat.beatNumber}
              className={`rounded-2xl border p-5 transition-all ${
                isSelected
                  ? 'border-amber-400/50 bg-[#151518] shadow-lg shadow-amber-500/5'
                  : 'border-zinc-800/80 bg-[#101013] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10 text-xs font-black text-amber-400 border border-amber-400/20 font-mono">
                    {beat.beatNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Timecode: {beat.timecode}</h4>
                    <p className="text-[11px] text-zinc-400">{beat.durationSeconds}s duration</p>
                  </div>
                </div>

                {/* Approval Badges & Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(idx, 'approved')}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      beat.approval === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(idx, 'rejected')}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      beat.approval === 'rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </div>
              </div>

              {/* Speech Transcript */}
              <div className="mt-3.5 space-y-2">
                <div className="rounded-xl bg-black/40 p-3 border border-zinc-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Speech Transcript (Whisper)
                  </span>
                  <p className="mt-1 text-xs font-medium text-zinc-200 italic">
                    "{beat.speechTranscript}"
                  </p>
                </div>

                {/* Visual Direction */}
                <div className="rounded-xl bg-black/40 p-3 border border-zinc-800/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Visual Direction & Camera Motion
                  </span>
                  <p className="mt-1 text-xs text-zinc-300">{beat.visualDirection}</p>
                </div>

                {/* Captions & Style */}
                <div className="flex items-center justify-between rounded-xl bg-black/40 p-3 border border-zinc-800/60">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Caption Pill
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-white">{beat.captions}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: beat.captionStyle.highlightColor }}
                      className="h-3.5 w-3.5 rounded-full border border-white/20"
                    />
                    <span className="text-[11px] font-mono text-zinc-400">
                      {beat.captionStyle.animation}
                    </span>
                  </div>
                </div>

                {/* B-Roll & Assets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Layers className="h-3 w-3 text-zinc-500" />
                    B-Roll: <span className="font-mono text-zinc-300">{beat.bRoll}</span>
                  </span>
                  {beat.assets.map((asset, aIdx) => (
                    <span
                      key={aIdx}
                      className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400"
                    >
                      {asset}
                    </span>
                  ))}
                </div>

                {/* Feedback Note Display */}
                {beat.feedback && (
                  <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 text-xs text-amber-300">
                    <span className="font-bold">Creator Feedback: </span>
                    {beat.feedback}
                  </div>
                )}

                {/* Inline Feedback Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add feedback to this beat..."
                    value={selectedBeatIdx === idx ? feedbackInput : ''}
                    onChange={(e) => {
                      setSelectedBeatIdx(idx);
                      setFeedbackInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFeedbackSubmit(idx);
                    }}
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleFeedbackSubmit(idx)}
                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Kit Feedback & Evolution Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-[#121215] p-5 shadow-xl">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Refine Brand Kit (Brand Kit/brand-kit.md)</h3>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Any stylistic guidelines, cut frequencies, or font rules entered here will be appended to the global Brand Kit.
        </p>
        <textarea
          rows={3}
          value={brandKitNotes}
          onChange={(e) => setBrandKitNotes(e.target.value)}
          placeholder="e.g. Always punch-in 1.12x on price reveal. Use Montserrat Black for all discount numbers. Keep cuts strictly under 2.2 seconds."
          className="mt-3 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
