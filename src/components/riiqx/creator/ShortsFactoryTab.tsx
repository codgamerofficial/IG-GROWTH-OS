'use client';

// =============================================================================
// RIIQX — Shorts Factory & Automated Faceless Video Engine
// Open-Source Repos K (AI-Shorts), L (AutoShorts) & M (PurffleShorts) Integration
// Mode 1: Long-Form Podcast Video Clipper (9:16 Vertical Cropping & Virality Scoring)
// Mode 2: Automated Faceless Video Factory (Scripting, Voice, Visuals & Remotion Burn-in)
// =============================================================================

import React, { useState } from 'react';
import {
  Scissors,
  Sparkles,
  Film,
  Video,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Download,
  Share2,
  ArrowRight,
  Layers,
  FileText,
  Volume2,
  Clock,
  Zap,
  Globe,
  Upload,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';

interface ShortsFactoryTabProps {
  project: CreatorProject | null;
  onUpdateProject?: (p: CreatorProject) => void;
  onTabChange?: (tab: CreatorStudioTab) => void;
}

interface CandidateClip {
  id: string;
  title: string;
  startSec: number;
  endSec: number;
  durationSeconds: number;
  viralityPotential: string;
  hookSummary: string;
  transcriptSnippet: string;
  aspectRatio: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface FacelessResult {
  projectId: string;
  title: string;
  renderedVideoUrl: string;
  script: {
    hook: string;
    body: string;
    callToAction: string;
  };
  scenes: Array<{
    id: string;
    text: string;
    durationSeconds: number;
    visualKeyword: string;
    visualAssetUrl: string;
  }>;
  audioTrackUrl: string;
  durationSeconds: number;
  suggestedCaption: string;
  hashtags: string[];
}

export function ShortsFactoryTab({ project, onUpdateProject, onTabChange }: ShortsFactoryTabProps) {
  const [activeMode, setActiveMode] = useState<'clipper' | 'faceless'>('clipper');

  // Clipper State
  const [sourceVideoUrl, setSourceVideoUrl] = useState('/uploads/sample_vertical.mp4');
  const [videoTitle, setVideoTitle] = useState(project?.name || 'AI Cloud Intelligence Masterclass');
  const [targetAspect, setTargetAspect] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [maxClips, setMaxClips] = useState(3);
  const [isClipping, setIsClipping] = useState(false);
  const [candidateClips, setCandidateClips] = useState<CandidateClip[]>([]);
  const [clippingError, setClippingError] = useState<string | null>(null);

  // Faceless Factory State
  const [topic, setTopic] = useState(
    project?.brief?.topic || '5 Psychological Secrets of High Achievers'
  );
  const [niche, setNiche] = useState<'tech' | 'motivation' | 'finance' | 'history' | 'storytelling'>(
    'motivation'
  );
  const [durationSeconds, setDurationSeconds] = useState<15 | 30 | 60>(30);
  const [language, setLanguage] = useState<'en' | 'bn' | 'hi' | 'es'>('en');
  const [stylePreset, setStylePreset] = useState<'viral_kinetic' | 'cinematic_film' | 'authority_luxe' | 'documentary'>(
    'viral_kinetic'
  );
  const [isGeneratingFaceless, setIsGeneratingFaceless] = useState(false);
  const [facelessResult, setFacelessResult] = useState<FacelessResult | null>(null);
  const [facelessError, setFacelessError] = useState<string | null>(null);

  // Run Long-Form Video Clipper (Repo K & L)
  const handleRunClipper = async () => {
    if (!sourceVideoUrl) return;
    setIsClipping(true);
    setClippingError(null);

    try {
      const res = await fetch('/api/riiqx/capabilities/video.clip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'autoshorts',
          payload: {
            sourceVideoUrl,
            videoTitle,
            targetAspectRatio: targetAspect,
            maxClips,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.result?.candidateClips) {
        setCandidateClips(data.result.candidateClips);
      } else {
        setClippingError(data.errorMessage || 'Failed to detect video highlights.');
      }
    } catch (err: any) {
      setClippingError(err.message || 'Network error while contacting video clipping engine.');
    } finally {
      setIsClipping(false);
    }
  };

  // Run Automated Faceless Generator (Repo M - PurffleShorts)
  const handleGenerateFaceless = async () => {
    if (!topic.trim()) return;
    setIsGeneratingFaceless(true);
    setFacelessError(null);

    try {
      const res = await fetch('/api/riiqx/capabilities/video.faceless', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'purffleshorts',
          payload: {
            topic,
            niche,
            durationSeconds,
            language,
            stylePreset,
            aspectRatio: '9:16',
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setFacelessResult(data.result);
      } else {
        setFacelessError(data.errorMessage || 'Faceless video creation failed.');
      }
    } catch (err: any) {
      setFacelessError(err.message || 'Network error executing faceless creation pipeline.');
    } finally {
      setIsGeneratingFaceless(false);
    }
  };

  // Push candidate clip to active project and redirect to editor
  const handleTransferToEditor = (clip: CandidateClip) => {
    if (onUpdateProject && project) {
      const updated: CreatorProject = {
        ...project,
        name: clip.title,
        status: 'editing',
        renderedVideoBlobUrl: clip.videoUrl || sourceVideoUrl,
        brief: {
          ...project.brief,
          topic: clip.title,
        },
      };
      onUpdateProject(updated);
    }
    if (onTabChange) {
      onTabChange('editor');
    }
  };

  // Push faceless video to project and open review/queue
  const handleTransferFacelessToQueue = () => {
    if (!facelessResult) return;
    if (onUpdateProject && project) {
      const updated: CreatorProject = {
        ...project,
        name: facelessResult.title,
        status: 'ready_to_publish',
        renderedVideoBlobUrl: facelessResult.renderedVideoUrl,
        storyboard: project.storyboard
          ? {
              ...project.storyboard,
              title: facelessResult.title,
              caption: facelessResult.suggestedCaption,
              hashtags: facelessResult.hashtags,
            }
          : undefined,
      };
      onUpdateProject(updated);
    }
    if (onTabChange) {
      onTabChange('queue');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222226] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/30">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Shorts Factory & Faceless Video Engine
                <span className="rounded-full bg-[#FFD43B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#FFD43B] border border-[#FFD43B]/20">
                  Open-Source Repo K, L & M
                </span>
              </h1>
              <p className="text-sm text-neutral-400">
                Autonomous vertical video pipeline: long-form podcast clipper & AI faceless video creator with kinetic subtitles.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-[#141418] p-1 border border-[#222226]">
          <button
            onClick={() => setActiveMode('clipper')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeMode === 'clipper'
                ? 'bg-[#FFD43B] text-black shadow-lg font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Scissors className="h-4 w-4" />
            Podcast Clipper (AutoShorts)
          </button>
          <button
            onClick={() => setActiveMode('faceless')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeMode === 'faceless'
                ? 'bg-[#FFD43B] text-black shadow-lg font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Faceless Factory (PurffleShorts)
          </button>
        </div>
      </div>

      {/* Mode 1: Long-Form Video Clipper */}
      {activeMode === 'clipper' && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                <Sliders className="h-4 w-4 text-[#FFD43B]" />
                Long-Form Video Input & Target Options
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400">Source Video URL or Local Path</label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="text"
                      value={sourceVideoUrl}
                      onChange={(e) => setSourceVideoUrl(e.target.value)}
                      placeholder="/uploads/sample_vertical.mp4 or YouTube URL"
                      className="flex-1 rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">Supports local MP4 files or external video feeds.</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-400">Content / Episode Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g. Masterclass on Autonomous AI"
                    className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-400">Target Aspect Ratio</label>
                    <select
                      value={targetAspect}
                      onChange={(e) => setTargetAspect(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    >
                      <option value="9:16">9:16 (Shorts & Reels)</option>
                      <option value="1:1">1:1 (Square Feed)</option>
                      <option value="16:9">16:9 (Landscape)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-400">Max Highlight Clips</label>
                    <select
                      value={maxClips}
                      onChange={(e) => setMaxClips(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    >
                      <option value={1}>1 Viral Clip</option>
                      <option value={3}>3 Highlight Clips</option>
                      <option value={5}>5 Extended Clips</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleRunClipper}
                    disabled={isClipping || !sourceVideoUrl}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-5 py-3 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-50"
                  >
                    {isClipping ? (
                      <>
                        <RotateCcw className="h-4 w-4 animate-spin" />
                        Detecting Virality & Cutting 9:16 Clips...
                      </>
                    ) : (
                      <>
                        <Scissors className="h-4 w-4" />
                        Generate Vertical Clips Now
                      </>
                    )}
                  </button>
                </div>

                {clippingError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{clippingError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Architecture Card */}
            <div className="rounded-2xl border border-[#222226] bg-[#141418] p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#FFD43B]" />
                AutoShorts & AI-Shorts Architecture
              </h4>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Utilizes speech-energy analysis, conversational pauses, and key-topic transitions to detect natural narrative hooks. Automatically centers speakers and cuts 9:16 frames for YouTube Shorts & Instagram Reels.
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222226] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Film className="h-4 w-4 text-[#FFD43B]" />
                Detected Candidate Shorts ({candidateClips.length})
              </h3>
              <span className="text-xs text-neutral-400">
                {candidateClips.length > 0 ? 'Ready for 1-click export' : 'Run detection to generate clips'}
              </span>
            </div>

            {candidateClips.length === 0 && !isClipping && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2B2B30] bg-[#141418]/50 p-12 text-center">
                <Scissors className="h-12 w-12 text-neutral-600 mb-3" />
                <h4 className="text-sm font-semibold text-white">No Clips Extracted Yet</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                  Provide a video path and click &quot;Generate Vertical Clips Now&quot; to automatically extract viral moments.
                </p>
              </div>
            )}

            {isClipping && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#222226] bg-[#141418] p-12 text-center space-y-3">
                <RotateCcw className="h-8 w-8 text-[#FFD43B] animate-spin" />
                <h4 className="text-sm font-semibold text-white">Analyzing Video Hook Potential...</h4>
                <p className="text-xs text-neutral-400">Scanning audio timestamps and detecting conversational shifts.</p>
              </div>
            )}

            {candidateClips.map((clip, idx) => (
              <div
                key={clip.id || idx}
                className="group rounded-2xl border border-[#222226] bg-[#141418] p-5 shadow-lg transition-all hover:border-[#FFD43B]/40"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail / Aspect Preview */}
                  <div className="relative aspect-[9/16] w-full sm:w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-900 border border-[#2B2B30]">
                    <img
                      src={clip.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'}
                      alt={clip.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white/90" />
                    </div>
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-mono text-white">
                      {Math.round(clip.durationSeconds)}s
                    </span>
                  </div>

                  {/* Clip Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white">{clip.title}</h4>
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        {clip.viralityPotential}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-medium">{clip.hookSummary}</p>
                    <p className="text-xs text-neutral-500 italic line-clamp-2">
                      &quot;{clip.transcriptSnippet}&quot;
                    </p>

                    <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3.5 w-3.5 text-neutral-500" />
                        {clip.startSec}s - {clip.endSec}s
                      </span>
                      <span>Format: {clip.aspectRatio}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleTransferToEditor(clip)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#FFD43B] px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-[#FFE066] transition-all"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Edit in Video Editor
                      </button>
                      <a
                        href={clip.videoUrl || sourceVideoUrl}
                        download={`clip_${clip.id}.mp4`}
                        className="flex items-center gap-1.5 rounded-lg border border-[#2B2B30] bg-[#1D1D22] px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Automated Faceless Video Factory */}
      {activeMode === 'faceless' && (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl">
              <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-[#FFD43B]" />
                Faceless Video Creator Parameters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400">Core Topic or Hook Premise</label>
                  <textarea
                    rows={2}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. 5 Psychological laws that make you instantly memorable"
                    className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] p-3 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-400">Niche</label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3 py-2 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    >
                      <option value="tech">Tech & AI</option>
                      <option value="motivation">Motivation & Mindset</option>
                      <option value="finance">Finance & Investing</option>
                      <option value="history">History & Facts</option>
                      <option value="storytelling">Deep Storytelling</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-400">Duration</label>
                    <select
                      value={durationSeconds}
                      onChange={(e) => setDurationSeconds(Number(e.target.value) as any)}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3 py-2 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    >
                      <option value={15}>15 Seconds (Rapid)</option>
                      <option value={30}>30 Seconds (Optimal)</option>
                      <option value={60}>60 Seconds (Deep Dive)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-400">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3 py-2 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    >
                      <option value="en">English (US)</option>
                      <option value="bn">Bengali (বাংলা)</option>
                      <option value="hi">Hindi (हिन्दी)</option>
                      <option value="es">Spanish (Español)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-400">Visual Aesthetic Preset</label>
                    <select
                      value={stylePreset}
                      onChange={(e) => setStylePreset(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3 py-2 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                    >
                      <option value="viral_kinetic">Viral Kinetic (Neon Glow)</option>
                      <option value="cinematic_film">Cinematic Film (35mm)</option>
                      <option value="authority_luxe">Authority Luxe (Dark Minimal)</option>
                      <option value="documentary">Documentary Archive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateFaceless}
                    disabled={isGeneratingFaceless || !topic.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-5 py-3 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-50"
                  >
                    {isGeneratingFaceless ? (
                      <>
                        <RotateCcw className="h-4 w-4 animate-spin" />
                        Generating Script, Audio & Video Scenes...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Complete Faceless Video
                      </>
                    )}
                  </button>
                </div>

                {facelessError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{facelessError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Architecture Explainer */}
            <div className="rounded-2xl border border-[#222226] bg-[#141418] p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#FFD43B]" />
                PurffleShorts Pipeline Workflow
              </h4>
              <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                Generates a 3-part retention script (Pattern Interrupt Hook &rarr; Story/Value Body &rarr; Follow CTA). Synthesizes spoken voiceover, matches high-resolution background assets, and burns in word-level kinetic captions.
              </p>
            </div>
          </div>

          {/* Video Preview & Scenes Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222226] pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Video className="h-4 w-4 text-[#FFD43B]" />
                Faceless Video Output
              </h3>
              {facelessResult && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Ready to Publish ({facelessResult.durationSeconds}s)
                </span>
              )}
            </div>

            {!facelessResult && !isGeneratingFaceless && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2B2B30] bg-[#141418]/50 p-12 text-center">
                <Film className="h-12 w-12 text-neutral-600 mb-3" />
                <h4 className="text-sm font-semibold text-white">No Faceless Video Generated Yet</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                  Configure your topic and style preset, then click &quot;Generate Complete Faceless Video&quot; to build an entire Short.
                </p>
              </div>
            )}

            {isGeneratingFaceless && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#222226] bg-[#141418] p-12 text-center space-y-3">
                <RotateCcw className="h-8 w-8 text-[#FFD43B] animate-spin" />
                <h4 className="text-sm font-semibold text-white">Assembling Faceless Short...</h4>
                <p className="text-xs text-neutral-400">Writing viral hook, synthesizing voice, and rendering Remotion layers.</p>
              </div>
            )}

            {facelessResult && (
              <div className="space-y-6">
                {/* Video Player Card */}
                <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="relative aspect-[9/16] w-48 shrink-0 overflow-hidden rounded-xl bg-black border border-[#2B2B30] shadow-2xl">
                      <video
                        src={facelessResult.renderedVideoUrl}
                        controls
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{facelessResult.title}</h4>
                        <p className="text-xs text-[#FFD43B] font-mono mt-0.5">
                          Duration: {facelessResult.durationSeconds}s • Aspect: 9:16 Vertical HD
                        </p>
                      </div>

                      <div className="space-y-1.5 rounded-xl bg-[#0C0C0E] p-3 border border-[#222226]">
                        <p className="text-xs font-semibold text-white">Viral Hook Script:</p>
                        <p className="text-xs text-neutral-300 italic">&quot;{facelessResult.script.hook}&quot;</p>
                      </div>

                      <div className="space-y-1.5 rounded-xl bg-[#0C0C0E] p-3 border border-[#222226]">
                        <p className="text-xs font-semibold text-white">Suggested Caption & Tags:</p>
                        <p className="text-xs text-neutral-300">{facelessResult.suggestedCaption}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {facelessResult.hashtags.map((tag, i) => (
                            <span key={i} className="text-[11px] text-[#FFD43B]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={handleTransferFacelessToQueue}
                          className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] px-4 py-2 text-xs font-bold text-black hover:bg-[#FFE066] transition-all shadow-md"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          Send to Publishing Queue
                        </button>
                        {onTabChange && (
                          <button
                            onClick={() => onTabChange('editor')}
                            className="flex items-center gap-1.5 rounded-xl border border-[#2B2B30] bg-[#1D1D22] px-4 py-2 text-xs font-medium text-white hover:border-[#FFD43B] transition-all"
                          >
                            <Video className="h-3.5 w-3.5" />
                            Open in Remotion Editor
                          </button>
                        )}
                        <a
                          href={facelessResult.renderedVideoUrl}
                          download={`${facelessResult.title.replace(/\s+/g, '_')}.mp4`}
                          className="flex items-center gap-1.5 rounded-xl border border-[#2B2B30] bg-[#1D1D22] px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download MP4
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene-by-Scene Breakdown */}
                <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                    <Layers className="h-4 w-4 text-[#FFD43B]" />
                    Generated Storyboard & Scene Visuals ({facelessResult.scenes.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {facelessResult.scenes.map((scene, i) => (
                      <div
                        key={scene.id || i}
                        className="rounded-xl border border-[#222226] bg-[#0C0C0E] p-3.5 space-y-2.5"
                      >
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900 border border-[#222226]">
                          <img
                            src={scene.visualAssetUrl}
                            alt={scene.visualKeyword}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-mono text-white">
                            {scene.durationSeconds}s
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400">
                            <span className="font-semibold text-white">Scene {i + 1}</span>
                            <span className="text-[#FFD43B]">{scene.visualKeyword}</span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-300 line-clamp-3">{scene.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
