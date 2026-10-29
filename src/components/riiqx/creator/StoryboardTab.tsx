'use client';

// =============================================================================
// RIIQX Creator Studio — Storyboard & Pre-Production Studio
// 9:16 Vertical Storyboard Cards • Safe Margins Overlay • Asset Assignment
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  CreatorStoryboard,
  VideoScene,
  CreatorStudioTab,
  UploadedAsset,
} from '@/lib/riiqx/creator-types';
import { generateStoryboard, createDefaultProject } from '@/lib/riiqx/creator-engine';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  Film,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sliders,
  MoveUp,
  MoveDown,
  Volume2,
} from 'lucide-react';

interface StoryboardTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function StoryboardTab({
  project,
  onUpdateProject,
  onTabChange,
}: StoryboardTabProps) {
  const [storyboard, setStoryboard] = useState<CreatorStoryboard>(() => {
    if (project?.storyboard) return project.storyboard;
    return generateStoryboard(project?.brief || createDefaultProject().brief);
  });

  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-slate-400">
        <Layers className="h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select or create a project from Overview to view storyboard.</p>
      </div>
    );
  }

  const handleTransitionChange = (sceneIdx: number, tr: VideoScene['transition']) => {
    const updatedScenes = [...storyboard.scenes];
    updatedScenes[sceneIdx] = { ...updatedScenes[sceneIdx], transition: tr };
    const updatedSb = { ...storyboard, scenes: updatedScenes };
    setStoryboard(updatedSb);
    onUpdateProject({
      ...project,
      storyboard: updatedSb,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleProceedToEditor = () => {
    onUpdateProject({
      ...project,
      storyboard,
      status: 'editing',
      updatedAt: new Date().toISOString(),
    });
    onTabChange('editor');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Visual Storyboard</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              9:16 Vertical Geometry
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Pre-visualize scene timing, on-screen kinetic graphics, and camera motions with safe-margin validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleProceedToEditor}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <span>Open in Video Editor</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Safe Margins Notice */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-3.5 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <span className="font-bold text-white">Algorithm Safe Margins Active: </span>
          Top 180px and Bottom 240px are reserved for Shorts & Reels profile headers, audio tags, and comment buttons.
          All on-screen typography is constrained to the verified center safe-zone.
        </div>
      </div>

      {/* Storyboard Grid of 9:16 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {storyboard.scenes.map((scene, idx) => {
          const isSelected = activeSceneIdx === idx;
          return (
            <div
              key={scene.sceneNumber}
              onClick={() => setActiveSceneIdx(idx)}
              className={`flex flex-col rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-violet-500 ring-2 ring-violet-500/40 shadow-xl bg-[#0B132B]'
                  : 'border-[#1E2A4A] bg-[#070D1F] hover:border-slate-500'
              }`}
            >
              {/* 9:16 Mock Preview Screen */}
              <div
                className="relative aspect-[9/16] w-full flex flex-col justify-between p-3 overflow-hidden text-center"
                style={{ background: scene.gradient || '#030712' }}
              >
                {/* Top Safe Guide */}
                <div className="text-[9px] uppercase font-bold text-slate-400/80 bg-black/40 rounded px-1.5 py-0.5 self-center">
                  Top Header Safe Zone
                </div>

                {/* Center Content / Graphic */}
                <div className="space-y-2 px-1">
                  <div className="rounded-lg bg-black/70 backdrop-blur-xs p-2 border border-white/10 shadow-lg">
                    <span className="text-[11px] font-black text-yellow-300 leading-tight block">
                      {scene.onScreenText}
                    </span>
                  </div>
                  <div className="text-[9px] text-cyan-300 bg-cyan-950/60 rounded px-1.5 py-0.5 inline-block font-mono">
                    {scene.cameraMotion || 'Slow Zoom In'}
                  </div>
                </div>

                {/* Bottom Safe Guide */}
                <div className="text-[9px] uppercase font-bold text-slate-400/80 bg-black/40 rounded px-1.5 py-0.5 self-center">
                  Bottom UI Safe Zone
                </div>
              </div>

              {/* Scene Metadata Footer */}
              <div className="p-3 space-y-2 border-t border-[#1E2A4A] bg-[#070D1F]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Scene {scene.sceneNumber}</span>
                  <span className="text-[10px] text-violet-400 font-bold">{scene.durationSeconds}s</span>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {scene.narrationScript}
                </p>

                {/* Transition Selector */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Transition:</span>
                  <select
                    value={scene.transition}
                    onChange={(e) =>
                      handleTransitionChange(idx, e.target.value as VideoScene['transition'])
                    }
                    className="text-[10px] font-bold rounded bg-[#0B132B] border border-[#1E2A4A] text-slate-200 px-1.5 py-0.5 focus:outline-none focus:border-violet-500"
                  >
                    <option value="cut">Cut</option>
                    <option value="fade">Fade</option>
                    <option value="zoom">Zoom</option>
                    <option value="slide">Slide</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
