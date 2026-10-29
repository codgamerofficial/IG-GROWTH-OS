'use client';

// =============================================================================
// RIIQX Creator Studio — Captions, Metadata & Pre-Publish Quality Gate
// Multi-Platform Fields • Thumbnail Safe-Zones • 10-Point Algorithm Checklist
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  PrePublishCheck,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import { generatePrePublishChecklist } from '@/lib/riiqx/creator-engine';
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

  // Editable fields
  const [title, setTitle] = useState(project?.name || '');
  const [caption, setCaption] = useState(project?.storyboard?.caption || '');
  const [hashtags, setHashtags] = useState<string[]>(
    project?.storyboard?.hashtags || ['#AI', '#Shorts', '#ViralReels', '#Automation']
  );

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-slate-400">
        <CheckCircle2 className="h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select or create a project from Overview to review metadata.</p>
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Captions, Metadata & Pre-Publish Review</h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              {passCount} / {checks.length} Checks Passed
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Verify platform-specific titles, captions, hashtags, and thumbnail safe zones before dispatching to the publishing queue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleProceedToQueue}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm active:scale-95"
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
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activePlatformTab === 'both'
                  ? 'bg-violet-600 text-white'
                  : 'bg-[#0B132B] border border-[#1E2A4A] text-slate-400'
              }`}
            >
              Unified Metadata
            </button>
            <button
              onClick={() => setActivePlatformTab('youtube')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activePlatformTab === 'youtube'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#0B132B] border border-[#1E2A4A] text-slate-400'
              }`}
            >
              <Youtube className="h-3.5 w-3.5" />
              <span>YouTube Shorts</span>
            </button>
            <button
              onClick={() => setActivePlatformTab('instagram')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activePlatformTab === 'instagram'
                  ? 'bg-pink-600 text-white'
                  : 'bg-[#0B132B] border border-[#1E2A4A] text-slate-400'
              }`}
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram Reels</span>
            </button>
          </div>

          {/* Title Editor */}
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Video Title
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {title.length} / 100 characters
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold"
            />
            <p className="text-[10px] text-slate-500">
              Tip: Include <code className="text-violet-400 font-mono">#Shorts</code> in the title for automatic YouTube Shorts algorithm routing.
            </p>
          </div>

          {/* Caption / Description Editor */}
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Post Caption & Description
              </label>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300"
              >
                {copiedCaption ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="w-full rounded-xl bg-[#0B132B] border border-[#1E2A4A] p-3 text-xs text-white focus:outline-none focus:border-violet-500 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Hashtag Stack */}
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-violet-400" />
                Targeted Hashtags
              </span>
              <span className="text-[10px] text-slate-400">{hashtags.length} Tags Selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-[#0B132B] border border-[#1E2A4A] px-2.5 py-1 text-xs font-bold text-violet-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Pre-Publish Quality Checklist */}
        <div className="lg:col-span-5 rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2A4A]/60 pb-3">
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

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {checks.map((chk) => (
              <div
                key={chk.id}
                className="rounded-xl border border-[#1E2A4A] bg-[#0B132B]/60 p-3 space-y-1"
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
                <p className="text-[11px] text-slate-400 leading-normal">{chk.detail}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleProceedToQueue}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-2.5 text-xs font-bold text-white shadow-sm transition-all text-center"
            >
              Lock Metadata & Schedule Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
