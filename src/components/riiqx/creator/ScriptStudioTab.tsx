'use client';

// =============================================================================
// RIIQX Creator Studio — Script Studio
// 3-Act Script Architecture • Scene-by-Scene Editor • Spoken Pace Calculator
// Multilingual (EN / BN / HI) • Viral Hook Selector • Storyboard Generation
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  ScriptData,
  ScriptScene,
  ViralHook,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import { generateScript, createDefaultProject } from '@/lib/riiqx/creator-engine';
import {
  FileText,
  Sparkles,
  Play,
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

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-slate-400">
        <FileText className="h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select or create a project from Overview to begin scripting.</p>
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
    // Also update Scene 1 narration with the selected hook
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
      const fresh = generateScript(project.brief);
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Script Studio</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              {script.totalDurationSeconds}s Short • {script.language.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {project.name} • Optimized for YouTube Shorts & Instagram Reels retention algorithms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 rounded-xl border border-[#1E2A4A] bg-[#0B132B] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Script</span>
          </button>
          <button
            onClick={handleProceedToStoryboard}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <span>Generate Storyboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Pacing & Duration Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
          <div className="text-[11px] font-bold uppercase text-slate-400">Target Duration</div>
          <div className="mt-1 text-lg font-black text-white">{script.totalDurationSeconds}s</div>
          <div className="text-[10px] text-slate-500">Short-form limit: 60s</div>
        </div>

        <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
          <div className="text-[11px] font-bold uppercase text-slate-400">Spoken Words</div>
          <div className="mt-1 text-lg font-black text-white">{script.totalWordCount} words</div>
          <div className="text-[10px] text-slate-500">Total dialogue volume</div>
        </div>

        <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
          <div className="text-[11px] font-bold uppercase text-slate-400">Pacing Speed</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-black text-white">{script.wordsPerSecond}</span>
            <span className="text-[11px] text-slate-400">words/sec</span>
          </div>
          <div className="text-[10px] text-emerald-400">Ideal range: 2.2 - 2.8</div>
        </div>

        <div className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-3.5">
          <div className="text-[11px] font-bold uppercase text-slate-400">Pacing Status</div>
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
          <div className="text-[10px] text-slate-400 truncate">
            {script.pacingWarning || 'Ready for high-retention narration'}
          </div>
        </div>
      </div>

      {/* Hook Selector Module */}
      <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Viral Hook Candidates (First 1-3 Seconds)</h2>
          </div>
          <span className="text-[11px] text-slate-400">Select preferred opening pattern interrupt</span>
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
                    ? 'border-violet-500 bg-violet-950/30 shadow-md ring-1 ring-violet-500'
                    : 'border-[#1E2A4A] bg-[#0B132B]/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-bold text-violet-400 uppercase tracking-wider">
                    {hook.type.replace('_', ' ')}
                  </span>
                  <span className="font-extrabold text-emerald-400">
                    {hook.estimatedRetentionRate}% Est. 3s Hold
                  </span>
                </div>
                <p className="text-xs font-bold text-white leading-snug">&ldquo;{hook.hookText}&rdquo;</p>
                <p className="mt-2 text-[10px] text-slate-400 italic">Visual: {hook.visualCue}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene-by-Scene Script Breakdown */}
      <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-violet-400" />
              Scene-by-Scene Script & Directing Notes
            </h2>
            <p className="text-xs text-slate-400">Click narration or on-screen text to edit before generating storyboard</p>
          </div>
          <span className="text-xs text-slate-400 font-bold">{script.scenes.length} Scenes</span>
        </div>

        <div className="space-y-4">
          {script.scenes.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              className="rounded-xl border border-[#1E2A4A] bg-[#0B132B]/80 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2A4A]/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-600 text-[10px] font-black text-white">
                    {scene.sceneNumber}
                  </span>
                  <span className="text-xs font-bold text-white">{scene.title}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    {scene.durationSeconds}s
                  </span>
                  <span>•</span>
                  <span>{scene.wordCount} words</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-violet-300">
                    <Camera className="h-3 w-3" />
                    {scene.cameraMotion.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Editable Narration */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Spoken Narration (Voiceover Script)
                </label>
                <textarea
                  rows={2}
                  value={scene.narration}
                  onChange={(e) => handleSceneChange(idx, 'narration', e.target.value)}
                  className="w-full rounded-lg bg-[#070D1F] border border-[#1E2A4A] p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none font-sans"
                />
              </div>

              {/* Editable On-Screen Kinetic Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    On-Screen Kinetic Text Overlay
                  </label>
                  <input
                    type="text"
                    value={scene.onScreenText}
                    onChange={(e) => handleSceneChange(idx, 'onScreenText', e.target.value)}
                    className="w-full rounded-lg bg-[#070D1F] border border-[#1E2A4A] px-2.5 py-1.5 text-xs font-bold text-yellow-300 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    B-Roll / Visual Direction
                  </label>
                  <input
                    type="text"
                    value={scene.bRollSuggestion}
                    onChange={(e) => handleSceneChange(idx, 'bRollSuggestion', e.target.value)}
                    className="w-full rounded-lg bg-[#070D1F] border border-[#1E2A4A] px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-500 italic flex items-center gap-1">
                <Volume2 className="h-3 w-3 text-slate-500" />
                <span>Audio Note: {scene.soundNote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
