'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Captions, Metadata & Pre-Publish Quality Gate
// Multi-Platform Fields • AI Hashtag Generator • 10-Point Algorithm Checklist
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  PrePublishCheck,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import { generatePrePublishChecklist, generateStoryboard } from '@/lib/riiqx/creator-engine';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Youtube,
  Instagram,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';

interface CaptionsMetadataTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function CaptionsMetadataTab({
  project,
  onUpdateProject,
  onTabChange,
}: CaptionsMetadataTabProps) {
  const [checks, setChecks] = useState<PrePublishCheck[]>(() => {
    if (project?.prePublishChecks && project.prePublishChecks.length > 0) {
      return project.prePublishChecks;
    }
    return project ? generatePrePublishChecklist(project) : [];
  });

  const [activePlatformTab, setActivePlatformTab] = useState<'both' | 'youtube' | 'instagram'>('both');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);

  // Editable fields
  const [title, setTitle] = useState(project?.name || '');
  const [caption, setCaption] = useState(project?.storyboard?.caption || '');
  const [hashtags, setHashtags] = useState<string[]>(
    project?.storyboard?.hashtags || ['#AI', '#Shorts', '#ViralReels', '#Automation', '#RIIQX']
  );

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-[#737373]">
        <CheckCircle2 className="h-10 w-10 text-[#3E3E3E] mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-[#737373] mt-1">Select or create a project from Overview to review metadata.</p>
      </div>
    );
  }

  const handleTitleChange = (val: string) => {
    setTitle(val);
    onUpdateProject({
      ...project,
      name: val,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCaptionChange = (val: string) => {
    setCaption(val);
    if (project.storyboard) {
      onUpdateProject({
        ...project,
        storyboard: {
          ...project.storyboard,
          caption: val,
        },
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleAIGenerateMetadata = () => {
    setIsGeneratingCaptions(true);
    setTimeout(() => {
      const generated = generateStoryboard(project.brief);
      setCaption(generated.caption);
      setHashtags(generated.hashtags);
      if (project.storyboard) {
        onUpdateProject({
          ...project,
          storyboard: {
            ...project.storyboard,
            caption: generated.caption,
            hashtags: generated.hashtags,
          },
          updatedAt: new Date().toISOString(),
        });
      }
      setIsGeneratingCaptions(false);
    }, 400);
  };

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const isReadyToPublish = passCount >= 8;

  const handleProceedToQueue = () => {
    onUpdateProject({
      ...project,
      status: 'ready_to_publish',
      prePublishChecks: checks,
      updatedAt: new Date().toISOString(),
    });
    onTabChange('queue');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Captions, Metadata &amp; Pre-Publish Review
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              {passCount} / {checks.length} Checks Passed
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            {project.name} • Verify platform-specific titles, captions, hashtags, and thumbnail safe zones before dispatching to the publishing queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAIGenerateMetadata}
            disabled={isGeneratingCaptions}
            className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] px-3.5 py-2 text-xs font-bold text-white transition-colors"
          >
            <Wand2 className={`h-3.5 w-3.5 text-[#FFD43B] ${isGeneratingCaptions ? 'animate-spin' : ''}`} />
            <span>AI Generate Captions</span>
          </button>
          <button
            onClick={handleProceedToQueue}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-4 py-2 text-xs font-black shadow-sm transition-all active:scale-95"
          >
            <span>Proceed to Publishing Queue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Platform Metadata Editors */}
        <div className="lg:col-span-7 space-y-5">
          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePlatformTab('both')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activePlatformTab === 'both'
                  ? 'bg-[#FFD43B] text-[#151515] shadow-xs'
                  : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#A3A3A3] hover:text-white'
              }`}
            >
              Unified Metadata
            </button>
            <button
              onClick={() => setActivePlatformTab('youtube')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activePlatformTab === 'youtube'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#A3A3A3] hover:text-white'
              }`}
            >
              <Youtube className="h-3.5 w-3.5" />
              <span>YouTube Shorts</span>
            </button>
            <button
              onClick={() => setActivePlatformTab('instagram')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activePlatformTab === 'instagram'
                  ? 'bg-gradient-to-r from-amber-500 to-[#FF6B5E] text-white shadow-xs'
                  : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#A3A3A3] hover:text-white'
              }`}
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram Reels</span>
            </button>
          </div>

          {/* Title Editor */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Video Title
              </label>
              <span className="text-[10px] text-[#737373] font-mono">
                {title.length} / 100 characters
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-xl bg-[#151515] border border-[#2E2E2E] p-3 text-xs text-white focus:outline-none focus:border-[#FFD43B] font-bold"
            />
            <p className="text-[10px] text-[#737373]">
              Tip: Include <code className="text-[#FFD43B] font-mono">#Shorts</code> in the title for automatic YouTube Shorts algorithm routing.
            </p>
          </div>

          {/* Caption / Description Editor */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                Post Caption &amp; Description
              </label>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-[11px] font-bold text-[#FFD43B] hover:underline"
              >
                {copiedCaption ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCaption ? 'Copied' : 'Copy Caption'}</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="w-full rounded-xl bg-[#151515] border border-[#2E2E2E] p-3 text-xs text-white focus:outline-none focus:border-[#FFD43B] resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Hashtag Stack */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#FFD43B]" />
                Targeted Hashtags
              </span>
              <span className="text-[10px] text-[#737373]">{hashtags.length} Tags Selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-[#202020] border border-[#2E2E2E] px-2.5 py-1 text-xs font-bold text-[#FFD43B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Pre-Publish Quality Checklist */}
        <div className="lg:col-span-5 rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2E2E2E] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Pre-Publish Quality Gate</h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isReadyToPublish
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {isReadyToPublish ? 'Algorithm Ready' : 'Review Needed'}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {checks.map((chk) => (
              <div
                key={chk.id}
                className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white truncate max-w-[220px]">{chk.label}</span>
                  {chk.status === 'pass' ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-extrabold uppercase shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> PASS
                    </span>
                  ) : chk.status === 'warn' ? (
                    <span className="flex items-center gap-1 text-amber-400 text-[10px] font-extrabold uppercase shrink-0">
                      <AlertTriangle className="h-3 w-3" /> WARN
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-[10px] font-extrabold uppercase shrink-0">
                      <AlertCircle className="h-3 w-3" /> FAIL
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#A3A3A3] leading-normal">{chk.detail}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleProceedToQueue}
              className="w-full rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] py-2.5 text-xs font-black text-[#151515] shadow-sm transition-all text-center"
            >
              Lock Metadata &amp; Schedule Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
