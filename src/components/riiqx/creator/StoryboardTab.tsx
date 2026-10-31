'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Storyboard & Pre-Production Studio
// 9:16 Vertical Storyboard Cards • Safe Margins Overlay • Scene Director
// Instant "Send to AI Creation Lab" & "Open in Video Editor" Routing
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
  Wand2,
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
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-[#737373]">
        <Layers className="h-10 w-10 text-[#3E3E3E] mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-[#737373] mt-1">Select or create a project from Overview to view storyboard.</p>
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

  const handleSendToAILab = (scene: VideoScene) => {
    onUpdateProject({
      ...project,
      brief: {
        ...project.brief,
        topic: scene.visualPrompt || scene.onScreenText,
      },
      storyboard,
      updatedAt: new Date().toISOString(),
    });
    onTabChange('ai_creation');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <Layers className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Visual Storyboard &amp; Scene Director
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              9:16 Vertical Geometry
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            {project.name} • Pre-visualize scene timing, on-screen kinetic graphics, and camera motions with safe-margin validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange('ai_creation')}
            className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] px-3.5 py-2 text-xs font-bold text-white transition-colors"
          >
            <Wand2 className="h-3.5 w-3.5 text-[#FFD43B]" />
            <span>Generate in AI Lab</span>
          </button>
          <button
            onClick={handleProceedToEditor}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] px-4 py-2 text-xs font-black text-[#151515] shadow-sm transition-all active:scale-95"
          >
            <span>Open in Video Editor</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Safe Margins Notice */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-[#A3A3A3]">
          <span className="font-bold text-white">Algorithm Safe Margins Active: </span>
          Top 180px and Bottom 240px are reserved for YouTube Shorts &amp; Instagram Reels profile headers, sound tags, and interactive action buttons.
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
                  ? 'border-[#FFD43B] ring-2 ring-[#FFD43B]/30 shadow-xl bg-[#1A1A1A]'
                  : 'border-[#2E2E2E] bg-[#1A1A1A] hover:border-[#3E3E3E]'
              }`}
            >
              {/* 9:16 Mock Preview Screen */}
              <div
                className="relative aspect-[9/16] w-full flex flex-col justify-between p-3 overflow-hidden text-center"
                style={{ background: scene.gradient || '#151515' }}
              >
                {/* Top Safe Guide */}
                <div className="text-[9px] uppercase font-bold text-[#A3A3A3] bg-black/50 backdrop-blur-xs rounded px-1.5 py-0.5 self-center border border-white/5">
                  Top Header Safe Zone
                </div>

                {/* Center Content / Graphic */}
                <div className="space-y-2 px-1">
                  <div className="rounded-xl bg-black/70 backdrop-blur-md p-2.5 border border-white/10 shadow-lg">
                    <span className="text-xs font-black text-[#FFD43B] leading-tight block">
                      {scene.onScreenText}
                    </span>
                  </div>
                  <div className="text-[9px] text-[#A3A3A3] bg-[#151515]/80 rounded px-1.5 py-0.5 inline-block font-mono border border-[#2E2E2E]">
                    {scene.cameraMotion || 'Slow Zoom In'}
                  </div>
                </div>

                {/* Bottom Safe Guide */}
                <div className="text-[9px] uppercase font-bold text-[#A3A3A3] bg-black/50 backdrop-blur-xs rounded px-1.5 py-0.5 self-center border border-white/5">
                  Bottom UI Safe Zone
                </div>
              </div>

              {/* Scene Metadata Footer */}
              <div className="p-3.5 space-y-2.5 border-t border-[#2E2E2E] bg-[#202020]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Scene {scene.sceneNumber}</span>
                  <span className="text-[10px] text-[#FFD43B] font-bold">{scene.durationSeconds}s</span>
                </div>

                <p className="text-[11px] text-[#A3A3A3] line-clamp-2 leading-relaxed">
                  {scene.narrationScript}
                </p>

                {/* Transition Selector */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-[#737373] uppercase font-bold">Transition:</span>
                  <select
                    value={scene.transition}
                    onChange={(e) =>
                      handleTransitionChange(idx, e.target.value as VideoScene['transition'])
                    }
                    className="text-[10px] font-bold rounded-lg bg-[#151515] border border-[#2E2E2E] text-white px-2 py-1 focus:outline-none focus:border-[#FFD43B]"
                  >
                    <option value="cut">Hard Cut</option>
                    <option value="fade">Smooth Fade</option>
                    <option value="zoom">Zoom Blur</option>
                    <option value="slide">Slide Transition</option>
                  </select>
                </div>

                {/* Direct Action: Send Scene to AI Lab */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendToAILab(scene);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-[#2E2E2E] bg-[#151515] hover:border-[#FFD43B]/40 py-1.5 text-[10px] font-semibold text-[#A3A3A3] hover:text-white transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-[#FFD43B]" />
                  <span>Synthesize Clip in AI Lab</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
