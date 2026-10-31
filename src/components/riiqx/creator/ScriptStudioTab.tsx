'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — AI Script Studio & Hook Engine
// 3-Act Retention Architecture • Viral Hook Candidates • Spoken Teleprompter Mode
// Pacing Analyzer (WPM/WPS) • Multilingual • Storyboard & Scene Synchronization
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  CreatorProject,
  ScriptData,
  ScriptScene,
  ViralHook,
  CreatorStudioTab,
  ContentTone,
} from '@/lib/riiqx/creator-types';
import { generateScript, createDefaultProject } from '@/lib/riiqx/creator-engine';
import {
  FileText,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
  Flame,
  Volume2,
  Camera,
  Film,
  Zap,
  Maximize2,
  Minimize2,
  Sliders,
  Languages,
} from 'lucide-react';

interface ScriptStudioTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function ScriptStudioTab({
  project,
  onUpdateProject,
  onTabChange,
}: ScriptStudioTabProps) {
  const [script, setScript] = useState<ScriptData>(() => {
    if (project?.script) return project.script;
    return generateScript(project?.brief || createDefaultProject().brief);
  });

  const [selectedHookIdx, setSelectedHookIdx] = useState(script?.selectedHookIndex || 0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ContentTone>(project?.brief.tone || 'energetic');

  // Teleprompter Mode State
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [teleprompterPlaying, setTeleprompterPlaying] = useState(false);
  const [teleprompterScroll, setTeleprompterScroll] = useState(0);

  // Teleprompter Auto-Scroll Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (teleprompterPlaying) {
      interval = setInterval(() => {
        setTeleprompterScroll((prev) => prev + 1.5);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [teleprompterPlaying]);

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-[#737373]">
        <FileText className="h-10 w-10 text-[#3E3E3E] mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-[#737373] mt-1">Select or create a project from Overview to begin scripting.</p>
      </div>
    );
  }

  // Scene editing handler
  const handleSceneChange = (idx: number, field: keyof ScriptScene, value: any) => {
    const updatedScenes = [...script.scenes];
    updatedScenes[idx] = { ...updatedScenes[idx], [field]: value };

    // Recompute word counts
    let totalWc = 0;
    for (const sc of updatedScenes) {
      totalWc += sc.narration.trim().split(/\s+/).filter(Boolean).length;
    }
    const wps = Number((totalWc / script.totalDurationSeconds).toFixed(2));
    let warn: string | undefined;
    if (wps > 2.8) {
      warn = `Pacing is fast (${wps} words/sec). Reduce narration for natural speech.`;
    } else if (wps < 1.6) {
      warn = `Pacing is slow (${wps} words/sec). You have room to expand.`;
    }

    const updatedScript: ScriptData = {
      ...script,
      scenes: updatedScenes,
      totalWordCount: totalWc,
      wordsPerSecond: wps,
      pacingWarning: warn,
    };

    setScript(updatedScript);
    onUpdateProject({
      ...project,
      script: updatedScript,
      status: 'scripting',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleHookSelect = (idx: number) => {
    setSelectedHookIdx(idx);
    const updatedScript = {
      ...script,
      selectedHookIndex: idx,
    };
    if (updatedScript.scenes.length > 0 && updatedScript.hooks[idx]) {
      updatedScript.scenes[0] = {
        ...updatedScript.scenes[0],
        narration: updatedScript.hooks[idx].hookText,
        onScreenText: updatedScript.hooks[idx].hookText.toUpperCase(),
      };
    }
    setScript(updatedScript);
    onUpdateProject({
      ...project,
      script: updatedScript,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const fresh = generateScript({
        ...project.brief,
        tone: selectedTone,
      });
      setScript(fresh);
      onUpdateProject({
        ...project,
        script: fresh,
        updatedAt: new Date().toISOString(),
      });
      setIsRegenerating(false);
    }, 400);
  };

  const handleProceedToStoryboard = () => {
    onUpdateProject({
      ...project,
      script,
      status: 'producing',
      updatedAt: new Date().toISOString(),
    });
    onTabChange('storyboard');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <FileText className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Script &amp; Hook Studio
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              {script.totalDurationSeconds}s Short • {script.language.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            {project.name} • 3-act retention structure optimized for YouTube Shorts and Instagram Reels algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Teleprompter Button */}
          <button
            onClick={() => {
              setTeleprompterOpen(true);
              setTeleprompterScroll(0);
              setTeleprompterPlaying(false);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] px-3.5 py-2 text-xs font-bold text-white transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5 text-[#FFD43B]" />
            <span>Teleprompter</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] px-3.5 py-2 text-xs font-semibold text-[#A3A3A3] hover:text-white transition-colors"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleProceedToStoryboard}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] px-4 py-2 text-xs font-black text-[#151515] shadow-sm transition-all active:scale-95"
          >
            <span>Proceed to Storyboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Pacing & Duration Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[11px] font-bold uppercase text-[#737373]">Target Duration</div>
          <div className="mt-1 text-xl font-black text-white">{script.totalDurationSeconds}s</div>
          <div className="text-[10px] text-[#737373]">Short-form limit: 60s</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[11px] font-bold uppercase text-[#737373]">Spoken Words</div>
          <div className="mt-1 text-xl font-black text-white">{script.totalWordCount} words</div>
          <div className="text-[10px] text-[#737373]">Total dialogue volume</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[11px] font-bold uppercase text-[#737373]">Pacing Speed</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-white">{script.wordsPerSecond}</span>
            <span className="text-[11px] text-[#A3A3A3]">words/sec</span>
          </div>
          <div className="text-[10px] text-emerald-400">Ideal range: 2.2 - 2.8</div>
        </div>

        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4">
          <div className="text-[11px] font-bold uppercase text-[#737373]">Pacing Health</div>
          <div className="mt-1 text-xs font-bold">
            {script.pacingWarning ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Attention
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="h-3.5 w-3.5 shrink-0" />
                Optimal Flow
              </span>
            )}
          </div>
          <div className="text-[10px] text-[#737373] truncate">
            {script.pacingWarning || 'Ready for high-retention narration'}
          </div>
        </div>
      </div>

      {/* Hook Selector Module */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-[#FFD43B]" />
            <h2 className="text-sm font-bold text-white">Viral Hook Candidates (First 1-3 Seconds)</h2>
          </div>
          <span className="text-[11px] text-[#737373]">Select opening pattern interrupt</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {script.hooks.map((hook, idx) => {
            const isSelected = selectedHookIdx === idx;
            return (
              <div
                key={hook.id}
                onClick={() => handleHookSelect(idx)}
                className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#FFD43B] bg-[#FFD43B]/10 shadow-xs ring-1 ring-[#FFD43B]'
                    : 'border-[#2E2E2E] bg-[#202020] hover:border-[#3E3E3E]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-[#FFD43B] uppercase tracking-wider">
                    {hook.type.replace('_', ' ')}
                  </span>
                  <span className="font-extrabold text-emerald-400">
                    {hook.estimatedRetentionRate}% Est. 3s Hold
                  </span>
                </div>
                <p className="text-xs font-bold text-white leading-snug">&ldquo;{hook.hookText}&rdquo;</p>
                <p className="mt-2 text-[10px] text-[#737373] italic">Visual: {hook.visualCue}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene-by-Scene Script Breakdown */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-[#FFD43B]" />
              Scene-by-Scene Script &amp; Directing Notes
            </h2>
            <p className="text-xs text-[#737373]">Click narration or on-screen text to edit before generating storyboard</p>
          </div>
          <span className="text-xs text-[#A3A3A3] font-bold">{script.scenes.length} Scenes</span>
        </div>

        <div className="space-y-3.5">
          {script.scenes.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2E2E2E] pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFD43B] text-[10px] font-black text-[#151515]">
                    {scene.sceneNumber}
                  </span>
                  <span className="text-xs font-bold text-white">{scene.title}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#737373]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {scene.durationSeconds}s
                  </span>
                  <span>•</span>
                  <span>{scene.wordCount} words</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#FFD43B]">
                    <Camera className="h-3 w-3" />
                    {scene.cameraMotion.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Editable Narration */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                  Spoken Narration (Voiceover Script)
                </label>
                <textarea
                  rows={2}
                  value={scene.narration}
                  onChange={(e) => handleSceneChange(idx, 'narration', e.target.value)}
                  className="w-full rounded-lg bg-[#151515] border border-[#2E2E2E] p-2.5 text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#FFD43B] resize-none font-sans"
                />
              </div>

              {/* Editable On-Screen Kinetic Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                    On-Screen Kinetic Text Overlay
                  </label>
                  <input
                    type="text"
                    value={scene.onScreenText}
                    onChange={(e) => handleSceneChange(idx, 'onScreenText', e.target.value)}
                    className="w-full rounded-lg bg-[#151515] border border-[#2E2E2E] px-2.5 py-1.5 text-xs font-bold text-[#FFD43B] focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                    B-Roll / Visual Direction
                  </label>
                  <input
                    type="text"
                    value={scene.bRollSuggestion}
                    onChange={(e) => handleSceneChange(idx, 'bRollSuggestion', e.target.value)}
                    className="w-full rounded-lg bg-[#151515] border border-[#2E2E2E] px-2.5 py-1.5 text-xs text-[#A3A3A3] focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
              </div>

              <div className="text-[10px] text-[#737373] italic flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                <span>Audio Note: {scene.soundNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Teleprompter Modal */}
      {teleprompterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl p-6 sm:p-12 text-white">
          <div className="flex items-center justify-between border-b border-[#2E2E2E] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold uppercase text-[#FFD43B]">RIIQX Studio Teleprompter</span>
              <span className="text-xs text-[#737373]">({script.totalWordCount} words • ~{script.totalDurationSeconds}s)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTeleprompterPlaying(!teleprompterPlaying)}
                className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] text-[#151515] px-4 py-2 text-xs font-black shadow-md"
              >
                {teleprompterPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{teleprompterPlaying ? 'Pause' : 'Start Auto-Scroll'}</span>
              </button>
              <button
                onClick={() => {
                  setTeleprompterOpen(false);
                  setTeleprompterPlaying(false);
                }}
                className="p-2 rounded-xl border border-[#2E2E2E] text-[#A3A3A3] hover:text-white"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center text-center p-8">
            <div
              className="max-w-3xl space-y-8 transition-transform duration-75 text-2xl sm:text-4xl font-bold leading-relaxed text-slate-100"
              style={{ transform: `translateY(-${teleprompterScroll}px)` }}
            >
              {script.scenes.map((sc, i) => (
                <div key={i} className="py-4">
                  <div className="text-xs uppercase font-bold text-[#FFD43B] mb-2 tracking-widest">
                    Scene {sc.sceneNumber}: {sc.title}
                  </div>
                  <div>{sc.narration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
