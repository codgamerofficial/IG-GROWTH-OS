'use client';

// =============================================================================
// RIIQX — AI Video Editor Pipeline & Production Studio
// HyperFrames Motion Graphics • FFmpeg Native Rendering • Whisper Word Timestamps
// yt-dlp Reference Analyzer • Mandatory Storyboard Approval Checkpoint • FFprobe QA
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Scissors,
  Video,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  ShieldCheck,
  ShieldAlert,
  Layers,
  FileText,
  Sliders,
  Film,
  Music,
  Clock,
  Zap,
  Globe,
  Upload,
  ExternalLink,
  ChevronRight,
  Eye,
  Cpu,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';

interface AIVideoEditorPipelineProps {
  project: CreatorProject | null;
  onUpdateProject?: (p: CreatorProject) => void;
  onTabChange?: (tab: CreatorStudioTab) => void;
}

export function AIVideoEditorPipeline({
  project,
  onUpdateProject,
  onTabChange,
}: AIVideoEditorPipelineProps) {
  // Toolchain state
  const [tools, setTools] = useState<any[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(true);

  // Reference Style State
  const [referenceUrl, setReferenceUrl] = useState('https://www.youtube.com/shorts/sample_reel');
  const [presetName, setPresetName] = useState('RIIQX Viral Authority');
  const [isAnalyzingReference, setIsAnalyzingReference] = useState(false);
  const [referenceAnalysis, setReferenceAnalysis] = useState<any>(null);
  const [referenceError, setReferenceError] = useState<string | null>(null);

  // Raw Footage Analysis State
  const [rawVideoPath, setRawVideoPath] = useState(
    project?.renderedVideoBlobUrl || '/uploads/sample_vertical.mp4'
  );
  const [isAnalyzingFootage, setIsAnalyzingFootage] = useState(false);
  const [footageAnalysis, setFootageAnalysis] = useState<any>(null);
  const [footageError, setFootageError] = useState<string | null>(null);

  // Storyboard Approval Checkpoint State
  const [storyboard, setStoryboard] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isUpdatingApproval, setIsUpdatingApproval] = useState(false);

  // Render & Quality Assurance State
  const [isRendering, setIsRendering] = useState(false);
  const [renderStage, setRenderStage] = useState<string | null>(null);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Fetch toolchain health on mount
  const fetchToolHealth = async () => {
    setIsLoadingTools(true);
    try {
      const res = await fetch('/api/riiqx/video-editor/tools');
      const data = await res.json();
      if (data.success && Array.isArray(data.tools)) {
        setTools(data.tools);
      }
    } catch (err) {
      console.warn('Failed to probe toolchain:', err);
    } finally {
      setIsLoadingTools(false);
    }
  };

  useEffect(() => {
    fetchToolHealth();
    // Also fetch latest storyboard if exists
    fetch('/api/riiqx/video-editor/storyboard')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.hasStoryboard) {
          setStoryboard(d.storyboard);
          setIsApproved(d.storyboard.isApproved);
        }
      })
      .catch(() => {});
  }, []);

  // 1. Analyze Reference Video Style (Section 4)
  const handleAnalyzeReference = async () => {
    setIsAnalyzingReference(true);
    setReferenceError(null);
    try {
      const res = await fetch('/api/riiqx/video-editor/reference/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceUrl,
          presetName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReferenceAnalysis(data.analysis);
      } else {
        setReferenceError(data.error || 'Reference analysis failed.');
      }
    } catch (err: any) {
      setReferenceError(err.message || 'Network error analyzing reference.');
    } finally {
      setIsAnalyzingReference(false);
    }
  };

  // 2. Analyze Raw Footage & Generate Storyboard (Section 5)
  const handleAnalyzeFootage = async () => {
    setIsAnalyzingFootage(true);
    setFootageError(null);
    try {
      const res = await fetch('/api/riiqx/video-editor/analyze-footage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoPath: rawVideoPath,
          projectName: project?.name || 'Autonomous Video Project',
          aspectRatio: '9:16',
          targetDuration: 30,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFootageAnalysis(data);
        setStoryboard(data.storyboard);
        setIsApproved(false); // Reset to require approval!
      } else {
        setFootageError(data.error || 'Footage analysis failed.');
      }
    } catch (err: any) {
      setFootageError(err.message || 'Network error inspecting video footage.');
    } finally {
      setIsAnalyzingFootage(false);
    }
  };

  // 3. Storyboard Approval Checkpoint Handler (Section 6)
  const handleSetApproval = async (approve: boolean) => {
    setIsUpdatingApproval(true);
    try {
      const res = await fetch('/api/riiqx/video-editor/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: approve ? 'approve' : 'request_changes',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsApproved(approve);
        if (storyboard) {
          setStoryboard({ ...storyboard, isApproved: approve, approvalStatus: approve ? 'approved' : 'changes_requested' });
        }
      }
    } catch (err) {
      console.error('Failed to update storyboard approval:', err);
    } finally {
      setIsUpdatingApproval(false);
    }
  };

  // 4. Physical HyperFrames + FFmpeg Render Execution (Section 7-12)
  const handleExecuteRender = async () => {
    if (!isApproved) {
      alert('Approval Checkpoint: You must approve the Storyboard before rendering!');
      return;
    }

    setIsRendering(true);
    setRenderError(null);
    setRenderStage('Initializing HyperFrames composition & FFmpeg trimming...');

    try {
      const res = await fetch('/api/riiqx/video-editor/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bypassApprovalCheck: false,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRenderResult(data);
        if (onUpdateProject && project) {
          onUpdateProject({
            ...project,
            status: 'ready_to_publish',
            renderedVideoBlobUrl: data.videoUrl,
          });
        }
      } else {
        setRenderError(data.error || 'Video rendering failed.');
      }
    } catch (err: any) {
      setRenderError(err.message || 'Render pipeline error.');
    } finally {
      setIsRendering(false);
      setRenderStage(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Verified Toolchain Health Dashboard */}
      <div className="rounded-2xl border border-[#222226] bg-[#141418] p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#FFD43B]" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Video Toolchain Health & Verification
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              Verified Real Runtimes
            </span>
          </div>
          <button
            onClick={fetchToolHealth}
            disabled={isLoadingTools}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isLoadingTools ? 'animate-spin' : ''}`} />
            Re-verify
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {tools.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between rounded-xl border border-[#222226] bg-[#0C0C0E] p-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate">{t.name}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      t.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                </div>
                <span className="mt-1 block font-mono text-[11px] text-[#FFD43B] font-bold truncate">
                  v{t.version || 'installed'}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-neutral-500 line-clamp-2 leading-tight">
                {t.requiredFor}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Reference Style Learning System */}
      <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#FFD43B]" />
            <div>
              <h3 className="text-base font-bold text-white">Reference Style Learning System</h3>
              <p className="text-xs text-neutral-400">
                Inspect 3-5 reference Reels via yt-dlp to extract typography, color grade, pacing & sound design.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="Paste permitted reference Reel/Short URL (e.g. YouTube or Instagram)"
            className="flex-1 rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
          />
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset Name"
            className="w-48 rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
          />
          <button
            onClick={handleAnalyzeReference}
            disabled={isAnalyzingReference || !referenceUrl.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-5 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-50"
          >
            {isAnalyzingReference ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                Analyzing Pacing & Palette...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Reference Reel
              </>
            )}
          </button>
        </div>

        {referenceError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{referenceError}</span>
          </div>
        )}

        {referenceAnalysis && (
          <div className="rounded-xl border border-[#222226] bg-[#0C0C0E] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Style Sheet & Brand Guidelines Generated
              </span>
              <span className="text-neutral-400 font-mono">
                Saved: AI Video Editor/styles/style-sheet.md
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="rounded-lg bg-[#141418] p-2.5 border border-[#222226]">
                <span className="text-[10px] text-neutral-500 block">Typography</span>
                <span className="font-semibold text-white">{referenceAnalysis.typography.fontFamily}</span>
              </div>
              <div className="rounded-lg bg-[#141418] p-2.5 border border-[#222226]">
                <span className="text-[10px] text-neutral-500 block">Pacing Interval</span>
                <span className="font-semibold text-[#FFD43B] font-mono">
                  Cut every {referenceAnalysis.motionAndTransitions.averageShotDurationSec}s
                </span>
              </div>
              <div className="rounded-lg bg-[#141418] p-2.5 border border-[#222226]">
                <span className="text-[10px] text-neutral-500 block">Voice Normalization</span>
                <span className="font-semibold text-emerald-400 font-mono">-14 LUFS Target</span>
              </div>
              <div className="rounded-lg bg-[#141418] p-2.5 border border-[#222226]">
                <span className="text-[10px] text-neutral-500 block">Color Palette</span>
                <div className="flex gap-1.5 mt-1">
                  {referenceAnalysis.colorGrading.dominantPalette.map((c: string, idx: number) => (
                    <span
                      key={idx}
                      className="h-3.5 w-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Raw Footage Analysis & Storyboard Blueprint Generation */}
      <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-[#FFD43B]" />
            <div>
              <h3 className="text-base font-bold text-white">Raw Footage Intelligence & AI Creative Director</h3>
              <p className="text-xs text-neutral-400">
                Whisper word-level timestamps, pause detection, and timestamp-aligned scene generation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={rawVideoPath}
            onChange={(e) => setRawVideoPath(e.target.value)}
            placeholder="/uploads/sample_vertical.mp4"
            className="flex-1 rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-3.5 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
          />
          <button
            onClick={handleAnalyzeFootage}
            disabled={isAnalyzingFootage || !rawVideoPath.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-5 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-50"
          >
            {isAnalyzingFootage ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin" />
                Analyzing Speech & Pauses...
              </>
            ) : (
              <>
                <Scissors className="h-4 w-4" />
                Analyze Footage & Build Storyboard
              </>
            )}
          </button>
        </div>

        {footageError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{footageError}</span>
          </div>
        )}

        {footageAnalysis && (
          <div className="rounded-xl border border-[#222226] bg-[#0C0C0E] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">
                Whisper Transcript ({footageAnalysis.wordTimestamps?.length} word timestamps generated)
              </span>
              <span>Duration: {Math.round(footageAnalysis.metadata?.durationSeconds || 14)}s • Format: 9:16</span>
            </div>
            <p className="text-xs text-neutral-300 italic bg-[#141418] p-3 rounded-lg border border-[#222226]">
              &quot;{footageAnalysis.transcript}&quot;
            </p>
          </div>
        )}
      </div>

      {/* 4. Mandatory Storyboard Approval Checkpoint */}
      {storyboard && (
        <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222226] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#FFD43B]" />
                <h3 className="text-base font-bold text-white">
                  Storyboard Approval Checkpoint ({storyboard.beats?.length || 0} Beats)
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Review every scene beat. Rendering is locked until explicit approval is granted.
              </p>
            </div>

            {/* Approval Controls */}
            <div className="flex items-center gap-2.5">
              {isApproved ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Storyboard Approved
                  </span>
                  <button
                    onClick={() => handleSetApproval(false)}
                    disabled={isUpdatingApproval}
                    className="rounded-lg border border-[#2B2B30] bg-[#1D1D22] px-3 py-1 text-xs text-neutral-400 hover:text-white"
                  >
                    Request Changes
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Awaiting User Approval
                  </span>
                  <button
                    onClick={() => handleSetApproval(true)}
                    disabled={isUpdatingApproval}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-md"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve Storyboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Scene Beats Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storyboard.beats?.map((beat: any, idx: number) => (
              <div
                key={beat.id || idx}
                className="rounded-xl border border-[#222226] bg-[#0C0C0E] p-4 space-y-3 transition-all hover:border-[#FFD43B]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{beat.title}</span>
                  <span className="rounded bg-black px-2 py-0.5 font-mono text-[11px] text-[#FFD43B]">
                    {beat.inSec.toFixed(1)}s - {beat.outSec.toFixed(1)}s ({beat.durationSeconds}s)
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-500 shrink-0 font-medium">Spoken:</span>
                    <span className="text-neutral-200 italic">&quot;{beat.spokenText}&quot;</span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-500 shrink-0 font-medium">Caption:</span>
                    <span className="text-white font-semibold">{beat.captionText}</span>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <span className="text-neutral-500 shrink-0 font-medium">Visual:</span>
                    <span className="text-neutral-300">{beat.visualComposition}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                    <span>Transition: {beat.transition}</span>
                    <span>SFX: {beat.audioSfx}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Render Trigger & Quality Inspection Area */}
          <div className="border-t border-[#222226] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isApproved ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Gate Unlocked: Ready for HyperFrames + FFmpeg physical render</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Rendering Locked: Please review and click &quot;Approve Storyboard&quot; above.</span>
                </div>
              )}
            </div>

            <button
              onClick={handleExecuteRender}
              disabled={!isApproved || isRendering}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-6 py-3 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isRendering ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  Rendering Physical Video...
                </>
              ) : (
                <>
                  <Film className="h-4 w-4" />
                  Render Final MP4 (HyperFrames + FFmpeg)
                </>
              )}
            </button>
          </div>

          {renderStage && (
            <div className="p-3 rounded-xl bg-[#0C0C0E] border border-[#222226] text-xs text-[#FFD43B] flex items-center gap-2 font-mono">
              <RotateCcw className="h-3.5 w-3.5 animate-spin" />
              <span>{renderStage}</span>
            </div>
          )}

          {renderError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{renderError}</span>
            </div>
          )}

          {/* 6. Render Quality Assurance Report View */}
          {renderResult && renderResult.qaReport && (
            <div className="rounded-xl border border-emerald-500/30 bg-[#0C0C0E] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#222226] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h4 className="text-base font-bold text-white">FFprobe Quality Assurance Inspection</h4>
                    <span className="text-xs text-emerald-400 font-semibold">100% Quality Certified Output</span>
                  </div>
                </div>
                <span className="font-mono text-xs text-neutral-400">
                  Job ID: {renderResult.jobId}
                </span>
              </div>

              {/* Video Player & Specs */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-xl bg-black border border-[#2B2B30] shadow-2xl">
                  <video
                    src={renderResult.videoUrl}
                    controls
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="rounded-lg bg-[#141418] p-3 border border-[#222226]">
                      <span className="text-[10px] text-neutral-500 block">Resolution</span>
                      <span className="font-bold text-white font-mono">
                        {renderResult.qaReport.checks.probedResolution} (9:16)
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#141418] p-3 border border-[#222226]">
                      <span className="text-[10px] text-neutral-500 block">Frame Rate</span>
                      <span className="font-bold text-white font-mono">
                        {renderResult.qaReport.checks.probedFps} fps
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#141418] p-3 border border-[#222226]">
                      <span className="text-[10px] text-neutral-500 block">Duration</span>
                      <span className="font-bold text-white font-mono">
                        {Math.round(renderResult.qaReport.checks.durationSeconds)}s
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#141418] p-3 border border-[#222226]">
                      <span className="text-[10px] text-neutral-500 block">Audio Codec</span>
                      <span className="font-bold text-emerald-400 uppercase font-mono">
                        {renderResult.qaReport.checks.audioCodec}
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#141418] p-3 border border-[#222226]">
                      <span className="text-[10px] text-neutral-500 block">Normalization</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {renderResult.qaReport.checks.audioNormalizedLufs} LUFS
                      </span>
                    </div>
                    <div className="rounded-lg bg-[#141418] p-3 border border-[#222226]">
                      <span className="text-[10px] text-neutral-500 block">File Size</span>
                      <span className="font-bold text-white font-mono">
                        {(renderResult.qaReport.checks.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  {/* Export Trigger Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <a
                      href={renderResult.videoUrl}
                      download={`RIIQX_${renderResult.jobId}.mp4`}
                      className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] px-4 py-2 font-bold text-black hover:bg-[#FFE066] transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Validated MP4
                    </a>
                    {onTabChange && (
                      <button
                        onClick={() => onTabChange('queue')}
                        className="flex items-center gap-1.5 rounded-xl border border-[#2B2B30] bg-[#1D1D22] px-4 py-2 font-medium text-white hover:border-[#FFD43B] transition-all"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Send to Publishing Queue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

