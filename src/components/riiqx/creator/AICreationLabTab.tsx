'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — AI Creation Lab
// Multi-Modal AI Generation: Text-to-Video • Image-to-Video • Text-to-Image •
// AI Avatar • Talking Photo • Voiceover • Multi-Model Routing & Real Cost Management
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  CreatorProject,
  CreatorStudioTab,
  AIGenerationType,
  AIProviderId,
  AIProviderModel,
  AspectRatio,
} from '@/lib/riiqx/creator-types';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  UserCheck,
  Mic,
  Scissors,
  Layers,
  Wand2,
  DollarSign,
  Cpu,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Copy,
  ChevronDown,
  Info,
  Check,
  AlertTriangle,
  Upload,
  Film,
  Zap,
} from 'lucide-react';

interface AICreationLabTabProps {
  project: CreatorProject | null;
  onUpdateProject?: (updated: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

// Available AI Provider Models with Real Cost Estimates
const AI_MODELS: AIProviderModel[] = [
  {
    id: 'bedrock-claude-3-7',
    name: 'AWS Bedrock — Claude 3.7 Sonnet (Hybrid Reasoning)',
    provider: 'bedrock',
    capabilities: ['text_to_video', 'scene_generation', 'repurpose'],
    costPer1kTokens: 0.003,
    status: 'active',
    speedMs: 820,
  },
  {
    id: 'groq-qwen-2-5-72b',
    name: 'Groq LPU — Qwen 2.5 72B (Ultrafast Hook & Script)',
    provider: 'groq',
    capabilities: ['text_to_video', 'scene_generation', 'repurpose'],
    costPer1kTokens: 0.0006,
    status: 'active',
    speedMs: 440,
  },
  {
    id: 'openrouter-flux-schnell',
    name: 'OpenRouter — FLUX.1 Schnell (4-Step Visuals)',
    provider: 'openrouter',
    capabilities: ['text_to_image', 'image_to_video'],
    costPerImage: 0.003,
    status: 'active',
    speedMs: 1400,
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine 1.6 (High-Fidelity Motion)',
    provider: 'luma',
    capabilities: ['text_to_video', 'image_to_video', 'scene_generation'],
    costPerSecond: 0.035,
    status: 'active',
    speedMs: 12500,
  },
  {
    id: 'runway-gen3-alpha',
    name: 'Runway Gen-3 Alpha Turbo (Cinematic Camera Control)',
    provider: 'runway',
    capabilities: ['text_to_video', 'image_to_video'],
    costPerSecond: 0.05,
    status: 'active',
    speedMs: 16000,
  },
  {
    id: 'seedance-video-2',
    name: 'Seedance 2.0 (Expressive Character & Lip Sync)',
    provider: 'seedance',
    capabilities: ['ai_avatar', 'talking_photo', 'text_to_video'],
    costPerSecond: 0.04,
    status: 'active',
    speedMs: 9800,
  },
];

const STYLE_PRESETS = [
  { id: 'cinematic_cyberpunk', name: 'Cinematic Cyberpunk', desc: 'Moody neon lighting, anamorphic lens flare' },
  { id: 'hyperrealistic_8k', name: 'Hyper-Realistic 8K', desc: 'Shallow depth of field, natural studio light' },
  { id: 'minimalist_tech', name: 'Minimalist Tech', desc: 'Clean Apple-style studio aesthetic, obsidian surfaces' },
  { id: 'viral_documentary', name: 'Viral Documentary', desc: 'Fast-paced dynamic camera, grain, textured visuals' },
  { id: 'anime_phonk', name: 'Dark Anime Phonk', desc: 'High-contrast stylized grading with kinetic motion' },
];

const CAMERA_MOTIONS = [
  { id: 'pan_right', label: 'Pan Right' },
  { id: 'zoom_in', label: 'Slow Push In' },
  { id: 'dynamic_orbit', label: '360° Orbit' },
  { id: 'crane_up', label: 'Crane Up' },
  { id: 'static', label: 'Static Lock' },
];

export function AICreationLabTab({
  project,
  onUpdateProject,
  onTabChange,
}: AICreationLabTabProps) {
  // Mode selection
  const [activeGenType, setActiveGenType] = useState<AIGenerationType>('text_to_video');
  const [selectedModelId, setSelectedModelId] = useState<string>('luma-dream-machine');
  const [promptText, setPromptText] = useState(
    project?.brief.topic
      ? `Cinematic high-retention vertical shot illustrating "${project.brief.topic}". Modern studio lighting, sleek tech atmosphere, 4K quality.`
      : 'Futuristic AI workspace with glowing holograms, cinematic camera slowly panning right, hyper-realistic 8K, depth of field.'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | '4:5'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState<number>(5);
  const [selectedStyle, setSelectedStyle] = useState<string>('cinematic_cyberpunk');
  const [cameraMotion, setCameraMotion] = useState<string>('zoom_in');
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted anatomy, text, watermark');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedClipUrl, setGeneratedClipUrl] = useState<string | null>(null);
  const [lastCost, setLastCost] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Selected Model Details
  const selectedModel = useMemo(
    () => AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0],
    [selectedModelId]
  );

  // Real-time Cost Estimation
  const estimatedCost = useMemo(() => {
    if (activeGenType === 'text_to_image') {
      return selectedModel.costPerImage || 0.004;
    }
    if (selectedModel.costPerSecond) {
      return Number((selectedModel.costPerSecond * durationSeconds).toFixed(3));
    }
    if (selectedModel.costPer1kTokens) {
      const estimatedTokens = Math.max(500, promptText.length * 1.5);
      return Number(((estimatedTokens / 1000) * selectedModel.costPer1kTokens).toFixed(4));
    }
    return 0.02;
  }, [selectedModel, durationSeconds, activeGenType, promptText]);

  // Generation Handler
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setGeneratedClipUrl(null);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setGenerationProgress(100);
            setLastCost(estimatedCost);
            // Simulated high-quality generated preview asset
            setGeneratedClipUrl(
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            );
          }, 600);
          return 95;
        }
        return prev + 15;
      });
    }, 400);
  };

  // Push to Editor Timeline
  const handlePushToEditor = () => {
    if (project && onUpdateProject) {
      const updatedProject = {
        ...project,
        brief: {
          ...project.brief,
          topic: project.brief.topic || promptText.slice(0, 50),
        },
      };
      onUpdateProject(updatedProject);
    }
    onTabChange('editor');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[#2E2E2E] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Creation Lab
            </h1>
            <span className="rounded-full border border-[#FFD43B]/30 bg-[#FFD43B]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#FFD43B]">
              Creator Studio 2.0
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Multi-modal video, image, avatar, and scene generation with multi-model routing and real-time cost management.
          </p>
        </div>

        {/* Live Cost & Credit Tracker Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] px-3.5 py-1.5 shadow-sm">
            <DollarSign className="h-4 w-4 text-[#FFD43B]" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-[#737373]">Estimated Cost</div>
              <div className="text-xs font-black text-white">
                ${estimatedCost.toFixed(3)}{' '}
                <span className="text-[10px] font-normal text-[#A3A3A3]">
                  ({(estimatedCost * 100).toFixed(0)} Credits)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Mode Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-1.5 no-scrollbar">
        {[
          { id: 'text_to_video' as AIGenerationType, label: 'Text to Video', icon: Video },
          { id: 'image_to_video' as AIGenerationType, label: 'Image to Video', icon: Film },
          { id: 'text_to_image' as AIGenerationType, label: 'Text to Image', icon: ImageIcon },
          { id: 'ai_avatar' as AIGenerationType, label: 'AI Avatar', icon: UserCheck },
          { id: 'talking_photo' as AIGenerationType, label: 'Talking Photo', icon: Mic },
          { id: 'repurpose' as AIGenerationType, label: 'One-Click Repurpose', icon: Scissors },
        ].map((mode) => {
          const Icon = mode.icon;
          const isActive = activeGenType === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveGenType(mode.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#FFD43B] text-[#151515] shadow-sm'
                  : 'text-[#A3A3A3] hover:bg-[#252525] hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Control Panel (Left) & Preview / Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Model Selection & Generation Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Model Router Selection */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#FFD43B]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  AI Provider Router
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Gateway
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {AI_MODELS.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-[#FFD43B] bg-[#FFD43B]/10 shadow-xs'
                        : 'border-[#2E2E2E] bg-[#202020] hover:border-[#3E3E3E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">
                        {model.name.split('—')[0].trim()}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#FFD43B]" />}
                    </div>
                    <span className="mt-1 text-[11px] text-[#A3A3A3] line-clamp-1">
                      {model.name.split('—')[1]?.trim() || model.provider}
                    </span>
                    <div className="mt-2.5 flex items-center justify-between border-t border-[#2E2E2E] pt-2 text-[10px] text-[#737373]">
                      <span>Latency: ~{model.speedMs}ms</span>
                      <span className="font-semibold text-white">
                        {model.costPerSecond
                          ? `$${model.costPerSecond}/s`
                          : model.costPerImage
                          ? `$${model.costPerImage}/img`
                          : `$${model.costPer1kTokens}/1k`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Engineering Workspace */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#FFD43B]" />
                Creative Prompt & Hook
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(promptText);
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2000);
                }}
                className="text-[11px] text-[#A3A3A3] hover:text-[#FFD43B] flex items-center gap-1 transition-colors"
              >
                {copiedPrompt ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiedPrompt ? 'Copied' : 'Copy Prompt'}
              </button>
            </div>

            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your scene in detail. E.g.: Cinematic close-up portrait of a creator using futuristic holographic displays, neon yellow backlighting..."
              className="w-full rounded-xl border border-[#2E2E2E] bg-[#151515] p-3 text-xs text-white placeholder-[#737373] focus:border-[#FFD43B] focus:outline-none focus:ring-1 focus:ring-[#FFD43B] transition-all resize-none"
            />

            {/* Negative Prompt Collapsible */}
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between text-[11px] font-semibold text-[#A3A3A3] hover:text-white">
                <span>Negative Prompt & Filters</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 pt-2">
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="w-full rounded-xl border border-[#2E2E2E] bg-[#151515] px-3 py-2 text-xs text-[#A3A3A3] focus:border-[#FFD43B] focus:outline-none"
                />
              </div>
            </details>
          </div>

          {/* Aspect Ratio, Duration & Visual Style */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Aspect Ratio */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] block mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '9:16', label: '9:16', sub: 'Shorts/Reels' },
                    { id: '16:9', label: '16:9', sub: 'YouTube' },
                    { id: '1:1', label: '1:1', sub: 'Square' },
                    { id: '4:5', label: '4:5', sub: 'Portrait' },
                  ].map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio.id as any)}
                      className={`flex flex-col items-center justify-center rounded-xl border py-2 text-center transition-all ${
                        aspectRatio === ratio.id
                          ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-white font-bold'
                          : 'border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:border-[#3E3E3E]'
                      }`}
                    >
                      <span className="text-xs">{ratio.label}</span>
                      <span className="text-[9px] text-[#737373]">{ratio.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3]">
                    Clip Duration
                  </label>
                  <span className="text-xs font-bold text-[#FFD43B]">{durationSeconds}s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Number(e.target.value))}
                  className="w-full accent-[#FFD43B] bg-[#2E2E2E] rounded-lg h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#737373] mt-1.5">
                  <span>3s (Micro hook)</span>
                  <span>5s (Standard)</span>
                  <span>15s (Scene)</span>
                </div>
              </div>
            </div>

            {/* Visual Style Presets */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] block mb-2">
                Visual Style Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      selectedStyle === style.id
                        ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-white font-bold'
                        : 'border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:border-[#3E3E3E]'
                    }`}
                  >
                    <div className="text-xs truncate">{style.name}</div>
                    <div className="text-[10px] text-[#737373] truncate">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Motion */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] block mb-2">
                Camera Dynamics
              </label>
              <div className="flex flex-wrap gap-2">
                {CAMERA_MOTIONS.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setCameraMotion(cam.id)}
                    className={`rounded-xl border px-3 py-1.5 text-xs transition-all ${
                      cameraMotion === cam.id
                        ? 'border-[#FFD43B] bg-[#FFD43B] text-[#151515] font-bold shadow-xs'
                        : 'border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !promptText.trim()}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] py-3.5 text-sm font-black text-[#151515] shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Synthesizing ({generationProgress}%)...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  <span>Generate with {selectedModel.name.split('—')[0]}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generation Preview & Direct Studio Actions */}
        <div className="lg:col-span-5 space-y-5">
          {/* Output Display Canvas */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Play className="h-3.5 w-3.5 text-[#FFD43B]" />
                Live Preview Canvas
              </span>
              <span className="rounded-full bg-[#202020] px-2.5 py-0.5 text-[10px] font-semibold text-[#A3A3A3]">
                {aspectRatio} • {durationSeconds}s
              </span>
            </div>

            {/* Video Preview Frame */}
            <div
              className={`relative mx-auto overflow-hidden rounded-2xl border border-[#2E2E2E] bg-[#111111] flex items-center justify-center ${
                aspectRatio === '9:16'
                  ? 'aspect-[9/16] max-h-[460px]'
                  : aspectRatio === '16:9'
                  ? 'aspect-[16/9]'
                  : 'aspect-square max-h-[380px]'
              }`}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="relative flex h-14 w-14 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-[#FFD43B]/20 border-t-[#FFD43B] animate-spin" />
                    <Sparkles className="h-6 w-6 text-[#FFD43B]" />
                  </div>
                  <div className="text-sm font-bold text-white">Rendering AI Video Clip</div>
                  <div className="w-48 bg-[#202020] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#FFD43B] h-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#737373]">
                    Executing {selectedModel.name.split('—')[0]} pipeline
                  </span>
                </div>
              ) : generatedClipUrl ? (
                <div className="relative h-full w-full group">
                  <video
                    src={generatedClipUrl}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#151515]/80 backdrop-blur-md rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#FFD43B]">
                    AI Rendered (Ready)
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center text-[#737373]">
                  <Film className="h-10 w-10 text-[#3E3E3E]" />
                  <div>
                    <div className="text-xs font-semibold text-white">No Rendered Output Yet</div>
                    <div className="text-[11px] text-[#737373] mt-1 max-w-[220px]">
                      Select model, enter prompt, and click generate to synthesize your clip.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Editable AI Output Actions */}
            {generatedClipUrl && (
              <div className="space-y-2.5 border-t border-[#2E2E2E] pt-4">
                <div className="text-[11px] font-bold uppercase text-[#A3A3A3]">
                  Editable Output Integration
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={handlePushToEditor}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] py-2.5 text-xs font-bold text-[#151515] transition-all shadow-sm"
                  >
                    <Scissors className="h-3.5 w-3.5" />
                    <span>Open in Video Editor</span>
                  </button>

                  <button
                    onClick={() => onTabChange('storyboard')}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#2E2E2E] bg-[#202020] hover:bg-[#282828] py-2.5 text-xs font-bold text-white transition-all"
                  >
                    <Layers className="h-3.5 w-3.5 text-[#FFD43B]" />
                    <span>Send to Storyboard</span>
                  </button>
                </div>

                <button
                  onClick={() => onTabChange('autopilot')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#2E2E2E] bg-[#151515] hover:border-[#FFD43B]/40 py-2.5 text-xs font-semibold text-[#A3A3A3] hover:text-white transition-all"
                >
                  <span>Queue for Autopilot Approval</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#FFD43B]" />
                </button>
              </div>
            )}
          </div>

          {/* Quick AI Presets & Best Practices */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Info className="h-4 w-4 text-[#FFD43B]" />
              RIIQX Viral Video Guidelines
            </div>
            <ul className="space-y-2 text-[11px] text-[#A3A3A3]">
              <li className="flex items-start gap-2">
                <span className="text-[#FFD43B] font-bold">1.</span>
                <span>The first 1.5 seconds determine 80% of retention. Include motion in your prompt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD43B] font-bold">2.</span>
                <span>Pair vertical video clips with kinetic MrBeast-style bold yellow subtitles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFD43B] font-bold">3.</span>
                <span>All generated assets can be fine-tuned directly on the multi-track timeline.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

