'use client';

// =============================================================================
// NUVEXA AI — AI Creator Studio View
// 9:16 Vertical Video Engine • Storyboard • Subtitles • Canvas MP4 Rendering
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Download,
  Send,
  Layers,
  Settings2,
  CheckCircle2,
  Smartphone,
  Eye,
  Sliders,
  Type,
  FileText,
} from 'lucide-react';
import { CreatorBrief, CreatorStoryboard, VideoScene } from '@/lib/nuvexa/creator-types';
import { generateStoryboard } from '@/lib/nuvexa/creator-engine';
import { createAutopilotJob } from '@/lib/nuvexa/autopilot-engine';
import { useNuvexa } from '@/context/NuvexaContext';

// Canvas rounded rectangle helper with fallback for cross-browser compatibility
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export function NuvexaCreatorStudio() {
  const { setActiveTab } = useNuvexa();

  // Brief Form State
  const [topic, setTopic] = useState('Why Local LLMs Are Winning in 2026');
  const [niche, setNiche] = useState('AI & Developer Tools');
  const [platform, setPlatform] = useState<'instagram_reels' | 'youtube_shorts'>('instagram_reels');
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [brandVoice, setBrandVoice] = useState<'energetic' | 'authoritative' | 'cinematic' | 'educational'>('authoritative');
  const [showSafeMargins, setShowSafeMargins] = useState(true);

  // Storyboard & Playback State
  const [storyboard, setStoryboard] = useState<CreatorStoryboard | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRendering, setIsRendering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate initial storyboard on mount if empty
  useEffect(() => {
    if (!storyboard) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = () => {
    const brief: CreatorBrief = {
      id: `brief_${Date.now()}`,
      topic,
      niche,
      targetAudience: 'Developers, Tech Enthusiasts & Creators',
      platform,
      durationSeconds: duration,
      brandVoice,
      goal: 'Educate & Drive Follows',
      includeSubtitles: true,
      backgroundMusic: 'ambient_cyberpunk_synth',
      callToAction: 'Follow @nuvexa.ai for daily engineering breakdowns',
    };

    const newStoryboard = generateStoryboard(brief);
    setStoryboard(newStoryboard);
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(false);
  };

  // Playback Loop
  useEffect(() => {
    if (isPlaying && storyboard) {
      const sceneDurationMs = (storyboard.totalDurationSeconds / storyboard.scenes.length) * 1000;
      const intervalMs = 100;
      const stepPercent = (intervalMs / (storyboard.totalDurationSeconds * 1000)) * 100;

      playTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + stepPercent;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const activeIndex = Math.min(
            Math.floor((next / 100) * storyboard.scenes.length),
            storyboard.scenes.length - 1
          );
          setCurrentSceneIndex(activeIndex);
          return next;
        });
      }, intervalMs);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, storyboard]);

  // Render Scene to 9:16 Canvas
  useEffect(() => {
    if (!canvasRef.current || !storyboard) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1920;
    canvas.width = width;
    canvas.height = height;

    const activeScene: VideoScene = storyboard.scenes[currentSceneIndex] || storyboard.scenes[0];

    // 1. Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (currentSceneIndex === 0) {
      grad.addColorStop(0, '#030712');
      grad.addColorStop(0.5, '#0B132B');
      grad.addColorStop(1, '#111C3A');
    } else if (currentSceneIndex === storyboard.scenes.length - 1) {
      grad.addColorStop(0, '#06B6D4');
      grad.addColorStop(0.5, '#3B82F6');
      grad.addColorStop(1, '#8B5CF6');
    } else {
      grad.addColorStop(0, '#070D1F');
      grad.addColorStop(1, '#0D1734');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. Futuristic Ambient Neon Rings
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 420, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 540, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Brand Pill Header (Safe Top Area)
    ctx.fillStyle = 'rgba(11, 19, 43, 0.85)';
    drawRoundRect(ctx, width / 2 - 200, 160, 400, 64, 32);
    ctx.fill();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('NUVEXA AI • CREATOR STUDIO', width / 2, 202);

    // 4. Center Scene Card Title
    ctx.font = 'bold 54px Inter, sans-serif';
    ctx.fillStyle = '#22D3EE';
    ctx.fillText(`SCENE ${activeScene.sceneNumber} OF ${storyboard.scenes.length}`, width / 2, height / 2 - 220);

    // 5. On-Screen High-Impact Typography (Centered with word wrapping)
    ctx.font = '900 68px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    const words = activeScene.onScreenText.split(' ');
    let line = '';
    let y = height / 2 - 80;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 240 && n > 0) {
        ctx.fillText(line.trim(), width / 2, y);
        line = words[n] + ' ';
        y += 85;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, y);

    // 6. Subtitles Container (Bottom Safe Zone)
    ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
    drawRoundRect(ctx, 100, height - 440, width - 200, 140, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '600 36px Inter, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(`"${activeScene.narrationScript.slice(0, 55)}..."`, width / 2, height - 355);

    // 7. Safe Margins Overlay (if toggled)
    if (showSafeMargins) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 12]);
      // Top Reels header safe boundary (approx 280px)
      ctx.strokeRect(60, 280, width - 120, height - 760);
      ctx.setLineDash([]);
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.textAlign = 'left';
      ctx.fillText('INSTAGRAM 9:16 SAFE ZONE', 80, 320);
    }
  }, [currentSceneIndex, storyboard, showSafeMargins]);

  // Video Rendering & Download via Canvas MediaRecorder API
  const handleRenderVideo = async () => {
    if (!canvasRef.current || !storyboard) return;
    setIsRendering(true);

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
    });

    const recordedChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nuvexa_${storyboard.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setIsRendering(false);
    };

    // Play scenes through from start to finish for export recording
    mediaRecorder.start();
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(true);

    const totalMs = storyboard.totalDurationSeconds * 1000;
    setTimeout(() => {
      mediaRecorder.stop();
      setIsPlaying(false);
    }, totalMs);
  };

  const handleSendToAutopilot = () => {
    if (!storyboard) return;
    createAutopilotJob('rule_ai_reels_daily', storyboard.title);
    setActiveTab('tasks');
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 select-none">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E2A4A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">AI Creator Studio</h1>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                VERTICAL 9:16
              </span>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Automate high-retention Instagram Reels & YouTube Shorts from topic brief to render.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSafeMargins(!showSafeMargins)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                showSafeMargins
                  ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                  : 'border-[#1E2A4A] bg-[#070D1F] text-[#94A3B8]'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Safe Margins {showSafeMargins ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Config Panel (Left) & 9:16 Player (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Left Column: Brief Input & Storyboard Inspector */}
          <div className="lg:col-span-7 space-y-4">
            {/* Brief Configuration Card */}
            <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-2 text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  Content Brief Parameters
                </span>
                <span className="text-[#64748B]">Step 1 of 3</span>
              </div>

              {/* Topic & Niche */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] mb-1 block">Content Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] mb-1 block">Niche / Domain</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Platform, Duration, Voice */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] mb-1 block">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-2.5 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="instagram_reels">Instagram Reels</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] mb-1 block">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value) as any)}
                    className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-2.5 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value={15}>15s (Punchy)</option>
                    <option value={30}>30s (Recommended)</option>
                    <option value={60}>60s (Deep Dive)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#94A3B8] mb-1 block">Brand Voice</label>
                  <select
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value as any)}
                    className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-2.5 py-2 text-xs text-white focus:border-cyan-500/50 focus:outline-none"
                  >
                    <option value="authoritative">Authoritative</option>
                    <option value="energetic">Energetic</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>
              </div>

              {/* Generate Storyboard Button */}
              <button
                onClick={handleGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generate New Script & Storyboard</span>
              </button>
            </div>

            {/* Storyboard Scene Breakdown */}
            {storyboard && (
              <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-2 text-xs font-bold text-white">
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    Storyboard Scenes ({storyboard.scenes.length})
                  </span>
                  <span className="text-cyan-400 font-mono">{storyboard.totalDurationSeconds}s Total</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {storyboard.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentSceneIndex(idx);
                        setProgress((idx / storyboard.scenes.length) * 100);
                      }}
                      className={`cursor-pointer rounded-xl border p-3 text-xs transition ${
                        currentSceneIndex === idx
                          ? 'border-cyan-500/50 bg-[#0B132B]'
                          : 'border-[#1E2A4A] bg-[#030712]/60 hover:bg-[#0B132B]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#94A3B8] mb-1">
                        <span className="text-cyan-400">Scene {scene.sceneNumber}</span>
                        <span className="font-mono">{scene.durationSeconds}s</span>
                      </div>
                      <div className="font-bold text-white mb-0.5">{scene.onScreenText}</div>
                      <p className="text-[11px] text-[#64748B] italic">&quot;{scene.narrationScript}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 9:16 Vertical Video Canvas & Action Controls */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* 9:16 Canvas Mockup Frame */}
            <div className="relative aspect-[9/16] w-full max-w-[320px] rounded-3xl border-4 border-[#1E2A4A] bg-black shadow-2xl overflow-hidden">
              <canvas
                ref={canvasRef}
                className="h-full w-full object-cover"
              />

              {/* Progress Timeline Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                <div
                  className="h-full bg-cyan-400 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Playback & Render Actions */}
            <div className="mt-4 flex w-full max-w-[320px] flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#1E2A4A] bg-[#070D1F] py-2 text-xs font-semibold text-white hover:bg-[#0B132B] transition"
                >
                  {isPlaying ? <Pause className="h-4 w-4 text-cyan-400" /> : <Play className="h-4 w-4 text-cyan-400 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play Preview'}</span>
                </button>

                <button
                  onClick={() => {
                    setProgress(0);
                    setCurrentSceneIndex(0);
                    setIsPlaying(false);
                  }}
                  className="rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-2 text-[#94A3B8] hover:text-white transition"
                  title="Reset Preview"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Render Video Button */}
              <button
                onClick={handleRenderVideo}
                disabled={isRendering}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition ${
                  isRendering
                    ? 'bg-amber-600 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 active:scale-95'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>{isRendering ? 'Rendering WebM/MP4 (Playing)...' : 'Render & Download Video'}</span>
              </button>

              {/* Send to Autopilot Scheduler */}
              <button
                onClick={handleSendToAutopilot}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send to Autopilot Scheduler</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
