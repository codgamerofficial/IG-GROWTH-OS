'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — AI Viral Reels & Shorts Factory
// Simple Interface • Advanced AI • Multi-Asset Upload (Videos & Photos)
// 10 Creation Presets • 9:16 / 1:1 / 16:9 • Kinetic Subtitles • Trend Assist
// Persistent Projects • 30 FPS Canvas Rendering & WebM/MP4 Export
// =============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Eye,
  Sliders,
  Type,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Music,
  Film,
  Zap,
  Flame,
  Volume2,
  VolumeX,
  Plus,
  RefreshCw,
  FolderOpen,
  TrendingUp,
  Compass,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Clock,
  Smartphone,
  Square,
  Monitor,
  AlertCircle,
  Share2,
} from 'lucide-react';
import {
  CreatorBrief,
  CreatorStoryboard,
  VideoScene,
  UploadedAsset,
  CaptionStyle,
  AudioVibe,
  AspectRatio,
  CreationPreset,
  CreativeDirection,
  ContentTone,
  ProcessingStage,
  CreatorProject,
  TrendSuggestion,
} from '@/lib/riiqx/creator-types';
import {
  generateStoryboard,
  generateTrendAssistIdeas,
  analyzeMediaAssets,
  PRESET_PROFILES,
} from '@/lib/riiqx/creator-engine';
import {
  loadCreatorProjectsFromStorage,
  saveCreatorProjectsToStorage,
} from '@/lib/riiqx/storage';
import { createAutopilotJob } from '@/lib/riiqx/autopilot-engine';
import { useRiiqx } from '@/context/RiiqxContext';

// High-fidelity SVG Sample Assets for Instant Out-of-the-Box Demo
const SAMPLE_ASSETS: UploadedAsset[] = [
  {
    id: 'sample_asset_1',
    name: 'neon_neural_core.svg',
    type: 'image',
    sizeBytes: 1024 * 142,
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23030712"/><stop offset="50%" stop-color="%230B132B"/><stop offset="100%" stop-color="%231E2A4A"/></linearGradient><radialGradient id="glow" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="%2322D3EE" stop-opacity="0.35"/><stop offset="100%" stop-color="%23000000" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(%23g1)"/><circle cx="540" cy="800" r="420" fill="url(%23glow)"/><circle cx="540" cy="800" r="300" stroke="%2322D3EE" stroke-width="4" fill="none" opacity="0.6"/><circle cx="540" cy="800" r="180" stroke="%23818CF8" stroke-width="6" fill="none" opacity="0.8"/><polygon points="540,680 640,860 440,860" fill="%2306B6D4" opacity="0.85"/><text x="540" y="1180" fill="%2322D3EE" font-size="44" font-family="sans-serif" font-weight="900" text-anchor="middle" letter-spacing="8">NEURAL SYNAPSE CORE</text><text x="540" y="1240" fill="%2394A3B8" font-size="28" font-family="monospace" text-anchor="middle">ACTIVE AGENT PIPELINE</text></svg>`,
    aiSuggestedRole: 'hook_visual',
    analysisStatus: 'analyzed',
  },
  {
    id: 'sample_asset_2',
    name: 'autonomous_grid.svg',
    type: 'image',
    sizeBytes: 1024 * 165,
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="%230A1128"/><stop offset="50%" stop-color="%23111C3A"/><stop offset="100%" stop-color="%23030712"/></linearGradient><linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23EC4899"/><stop offset="100%" stop-color="%238B5CF6"/></linearGradient></defs><rect width="1080" height="1920" fill="url(%23g2)"/><line x1="140" y1="400" x2="940" y2="400" stroke="url(%23lineG)" stroke-width="8"/><line x1="140" y1="960" x2="940" y2="960" stroke="%2322D3EE" stroke-width="4" stroke-dasharray="20,20"/><line x1="140" y1="1520" x2="940" y2="1520" stroke="url(%23lineG)" stroke-width="8"/><rect x="240" y="650" width="600" height="420" rx="40" fill="%23070D1F" stroke="%2322D3EE" stroke-width="6"/><text x="540" y="850" fill="%23FFFFFF" font-size="64" font-family="sans-serif" font-weight="900" text-anchor="middle">THE PROOF</text><text x="540" y="930" fill="%2334D399" font-size="36" font-family="monospace" font-weight="bold" text-anchor="middle">+450% VIRAL REACH</text></svg>`,
    aiSuggestedRole: 'b_roll',
    analysisStatus: 'analyzed',
  },
  {
    id: 'sample_asset_3',
    name: 'cyberpunk_outro.svg',
    type: 'image',
    sizeBytes: 1024 * 138,
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2306B6D4"/><stop offset="40%" stop-color="%233B82F6"/><stop offset="100%" stop-color="%23030712"/></linearGradient></defs><rect width="1080" height="1920" fill="url(%23g3)"/><circle cx="540" cy="750" r="280" fill="%23030712" stroke="%23FFFFFF" stroke-width="8"/><polygon points="510,660 620,750 510,840" fill="%2322D3EE"/><text x="540" y="1200" fill="%23FFFFFF" font-size="60" font-family="sans-serif" font-weight="900" text-anchor="middle">FOLLOW @RIIQX</text><text x="540" y="1270" fill="%23FDE047" font-size="34" font-family="sans-serif" font-weight="bold" text-anchor="middle">AUTONOMOUS SOCIAL MEDIA OS</text></svg>`,
    aiSuggestedRole: 'climax',
    analysisStatus: 'analyzed',
  },
];

// Helper: Rounded Rectangle for Canvas
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

export function RiiqxCreatorStudio() {
  const { setActiveTab } = useRiiqx();

  // Navigation Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'studio' | 'projects' | 'trend_assist'>('studio');

  // Primary Creation State
  const [topic, setTopic] = useState('How Autonomous AI Builds Viral Brands on Autopilot');
  const [niche, setNiche] = useState('Tech & Creator Automation');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [creationPreset, setCreationPreset] = useState<CreationPreset>('viral_hook');
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [language, setLanguage] = useState<'en' | 'bn' | 'hi'>('en');
  const [tone, setTone] = useState<ContentTone>('energetic');
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('mrbeast');
  const [trendingAudioVibe, setTrendingAudioVibe] = useState<AudioVibe>('phonk');
  const [creativeDirection, setCreativeDirection] = useState<CreativeDirection>('safe_relevant');
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState('@RIIQX');
  const [showSafeMargins, setShowSafeMargins] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [advancedDrawerOpen, setAdvancedDrawerOpen] = useState(false);

  // Uploaded Assets State
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background Job Processing Stage
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [stageProgressPercent, setStageProgressPercent] = useState(0);

  // Storyboard & Playback State
  const [storyboard, setStoryboard] = useState<CreatorStoryboard | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRenderingExport, setIsRenderingExport] = useState(false);
  const [savedProjects, setSavedProjects] = useState<CreatorProject[]>([]);
  const [trendSuggestions, setTrendSuggestions] = useState<TrendSuggestion[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Media Cache for Canvas rendering (Images and Videos)
  const mediaCacheRef = useRef<Map<string, HTMLImageElement | HTMLVideoElement>>(new Map());

  // Load Saved Projects and Trends on Mount
  useEffect(() => {
    const existing = loadCreatorProjectsFromStorage();
    setSavedProjects(existing);
    const trends = generateTrendAssistIdeas(niche);
    setTrendSuggestions(trends);
  }, [niche]);

  // Handle Multi-Asset Upload (Files to Object URLs with Validation)
  const handleFilesAdded = useCallback((files: FileList | File[]) => {
    setUploadError(null);
    const validExtensions = ['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/png', 'image/webp'];
    const rawFiles = Array.from(files);

    const validFiles: File[] = [];
    for (const f of rawFiles) {
      if (f.size > 50 * 1024 * 1024) {
        setUploadError(`"${f.name}" exceeds the 50 MB browser limit. Please select a smaller clip or photo.`);
        continue;
      }
      if (f.type.startsWith('video/') || f.type.startsWith('image/')) {
        validFiles.push(f);
      } else {
        setUploadError(`"${f.name}" format (${f.type || 'unknown'}) is not supported. Please upload MP4, MOV, WebM, PNG, JPG, or WebP.`);
      }
    }

    if (validFiles.length === 0) return;

    const newAssets: UploadedAsset[] = validFiles.map((file, idx) => {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);

      // Preload image/video into cache
      if (isVideo) {
        const vid = document.createElement('video');
        vid.crossOrigin = 'anonymous';
        vid.src = url;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        mediaCacheRef.current.set(url, vid);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        mediaCacheRef.current.set(url, img);
      }

      const suggestedRoles: Array<UploadedAsset['aiSuggestedRole']> = [
        'hook_visual',
        'b_roll',
        'proof',
        'climax',
        'outro',
      ];
      const role = suggestedRoles[(uploadedAssets.length + idx) % suggestedRoles.length];

      return {
        id: `asset_${Date.now()}_${idx}`,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url,
        sizeBytes: file.size,
        aiSuggestedRole: role,
        analysisStatus: 'analyzed',
      };
    });

    setUploadedAssets((prev) => [...prev, ...newAssets]);
  }, [uploadedAssets.length]);

  // Handle Remove Asset
  const handleRemoveAsset = (id: string) => {
    setUploadedAssets((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target?.url.startsWith('blob:')) {
        URL.revokeObjectURL(target.url);
      }
      mediaCacheRef.current.delete(target?.url || '');
      return prev.filter((a) => a.id !== id);
    });
  };

  // Load Sample Footage & Photos
  const handleLoadSampleAssets = () => {
    SAMPLE_ASSETS.forEach((sample) => {
      const img = new Image();
      img.src = sample.url;
      mediaCacheRef.current.set(sample.url, img);
    });
    setUploadedAssets([...SAMPLE_ASSETS]);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Preset Selection Handler (Updates vibe & caption style automatically)
  const handleSelectPreset = (preset: CreationPreset) => {
    setCreationPreset(preset);
    const cfg = PRESET_PROFILES[preset];
    if (cfg) {
      if (cfg.recommendedVibe) setTrendingAudioVibe(cfg.recommendedVibe);
      if (cfg.recommendedCaptionStyle) setCaptionStyle(cfg.recommendedCaptionStyle);
    }
  };

  // One-Click "Create My Reel" Job Pipeline
  const handleCreateMyReel = useCallback(async () => {
    setProcessingStage('uploading');
    setStageProgressPercent(25);

    // Stage 1: Uploading Simulation (already in memory)
    await new Promise((r) => setTimeout(r, 200));

    // Stage 2: Media Analysis
    setProcessingStage('analyzing');
    setStageProgressPercent(50);
    const mediaAnalysis = analyzeMediaAssets(uploadedAssets, topic);
    await new Promise((r) => setTimeout(r, 250));

    // Stage 3: Editing Storyboard
    setProcessingStage('editing');
    setStageProgressPercent(75);

    const brief: CreatorBrief = {
      id: `brief_${Date.now()}`,
      topic,
      niche,
      targetAudience: 'Global Social Viewers',
      platform: aspectRatio === '16:9' ? 'youtube_shorts' : 'instagram_reels',
      aspectRatio,
      durationSeconds: duration,
      creationPreset,
      creativeDirection,
      brandVoice: tone,
      tone,
      language,
      goal: 'Maximize Algorithmic Retention & Engagement',
      includeSubtitles: true,
      backgroundMusic: trendingAudioVibe,
      trendingAudioVibe,
      captionStyle,
      callToAction: `Follow ${watermarkText} for daily breakdowns`,
      watermark: {
        enabled: watermarkEnabled,
        text: watermarkText,
      },
      voiceoverEnabled: true,
      musicVolume: 0.7,
      assets: uploadedAssets.length > 0 ? uploadedAssets : undefined,
    };

    const sb = generateStoryboard(brief);
    setStoryboard(sb);

    // Stage 4: Rendering Frame Cache
    setProcessingStage('rendering');
    setStageProgressPercent(90);
    await new Promise((r) => setTimeout(r, 200));

    // Stage 5: Ready!
    setProcessingStage('ready');
    setStageProgressPercent(100);
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(false);

    // Auto-save Project to persistent library
    const project: CreatorProject = {
      id: `proj_${Date.now()}`,
      name: `${topic.slice(0, 32)} (${aspectRatio})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'completed',
      brief,
      storyboard: sb,
    };
    const updatedList = [project, ...savedProjects.slice(0, 19)];
    setSavedProjects(updatedList);
    saveCreatorProjectsToStorage(updatedList);

    setTimeout(() => {
      setProcessingStage('idle');
    }, 1200);
  }, [
    topic,
    niche,
    aspectRatio,
    duration,
    creationPreset,
    creativeDirection,
    tone,
    language,
    captionStyle,
    trendingAudioVibe,
    watermarkEnabled,
    watermarkText,
    uploadedAssets,
    savedProjects,
  ]);

  // Initial Storyboard on Mount if empty
  useEffect(() => {
    if (!storyboard) {
      handleCreateMyReel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Storyboard when Caption Style, Audio Vibe or Watermark changes
  useEffect(() => {
    if (storyboard) {
      const updatedScenes = storyboard.scenes.map((s) => ({
        ...s,
        captionStyle,
      }));
      setStoryboard({
        ...storyboard,
        scenes: updatedScenes,
        aspectRatio,
        brief: {
          ...storyboard.brief,
          captionStyle,
          trendingAudioVibe,
          aspectRatio,
          watermark: {
            enabled: watermarkEnabled,
            text: watermarkText,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captionStyle, trendingAudioVibe, aspectRatio, watermarkEnabled, watermarkText]);

  // Playback Animation Loop
  useEffect(() => {
    if (isPlaying && storyboard) {
      const activeScene = storyboard.scenes[currentSceneIndex] || storyboard.scenes[0];
      const intervalMs = (activeScene.durationSeconds * 1000) / 100;

      // Handle video element playback if active scene is video
      if (activeScene.assetUrl && activeScene.assetType === 'video') {
        const vid = mediaCacheRef.current.get(activeScene.assetUrl) as HTMLVideoElement;
        if (vid && vid.paused) {
          vid.muted = isMuted;
          vid.play().catch(() => {});
        }
      }

      playTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            if (currentSceneIndex < storyboard.scenes.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return next;
        });
      }, intervalMs);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      mediaCacheRef.current.forEach((media) => {
        if ('pause' in media) {
          media.pause();
        }
      });
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, storyboard, currentSceneIndex, isMuted]);

  // Master Aspect-Ratio Aware Canvas Rendering Engine
  useEffect(() => {
    if (!canvasRef.current || !storyboard) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine Canvas Dimensions based on Aspect Ratio
    let width = 1080;
    let height = 1920;
    if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    const activeScene: VideoScene = storyboard.scenes[currentSceneIndex] || storyboard.scenes[0];
    const assetUrl = activeScene.assetUrl;
    const assetType = activeScene.assetType;
    const activeCaptionStyle = activeScene.captionStyle || captionStyle;

    // Helper: Draw Aspect Ratio "Cover" for uploaded photo or video
    const drawCover = (media: HTMLImageElement | HTMLVideoElement, zoomRatio: number = 1.0) => {
      const mw = 'videoWidth' in media && media.videoWidth ? media.videoWidth : media.width;
      const mh = 'videoHeight' in media && media.videoHeight ? media.videoHeight : media.height;
      if (!mw || !mh) return;

      const mediaRatio = mw / mh;
      const canvasRatio = width / height;
      let renderW: number, renderH: number;

      if (mediaRatio > canvasRatio) {
        renderH = height * zoomRatio;
        renderW = renderH * mediaRatio;
      } else {
        renderW = width * zoomRatio;
        renderH = renderW / mediaRatio;
      }

      const offsetX = (width - renderW) / 2;
      const offsetY = (height - renderH) / 2;

      ctx.save();
      ctx.drawImage(media, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    };

    // 1. Render Background (Uploaded Asset OR Procedural Obsidian Gradient)
    let hasDrawnMedia = false;
    if (assetUrl) {
      let cachedMedia = mediaCacheRef.current.get(assetUrl);
      if (!cachedMedia) {
        if (assetType === 'video') {
          const vid = document.createElement('video');
          vid.crossOrigin = 'anonymous';
          vid.src = assetUrl;
          vid.muted = true;
          vid.loop = true;
          vid.playsInline = true;
          mediaCacheRef.current.set(assetUrl, vid);
          cachedMedia = vid;
        } else {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = assetUrl;
          mediaCacheRef.current.set(assetUrl, img);
          cachedMedia = img;
        }
      }

      if (cachedMedia) {
        // Dynamic subtle Ken-Burns zoom on photos (1.0 to 1.06)
        const kenBurnsScale = 1.0 + (progress / 100) * 0.06;
        drawCover(cachedMedia, kenBurnsScale);
        hasDrawnMedia = true;

        // Dark Vignette Gradient Overlays for Maximum Text Legibility
        const topH = Math.round(height * 0.25);
        const topVignette = ctx.createLinearGradient(0, 0, 0, topH);
        topVignette.addColorStop(0, 'rgba(3, 7, 18, 0.88)');
        topVignette.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = topVignette;
        ctx.fillRect(0, 0, width, topH);

        const botH = Math.round(height * 0.36);
        const bottomVignette = ctx.createLinearGradient(0, height - botH, 0, height);
        bottomVignette.addColorStop(0, 'rgba(3, 7, 18, 0)');
        bottomVignette.addColorStop(0.5, 'rgba(3, 7, 18, 0.82)');
        bottomVignette.addColorStop(1, 'rgba(3, 7, 18, 0.96)');
        ctx.fillStyle = bottomVignette;
        ctx.fillRect(0, height - botH, width, botH);
      }
    }

    if (!hasDrawnMedia) {
      // Default Obsidian Cyberpunk Gradient
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

      // Ambient Neon Rings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Top Header Brand Pill (In Safe Area)
    const pillY = aspectRatio === '16:9' ? 60 : 160;
    ctx.fillStyle = 'rgba(11, 19, 43, 0.88)';
    drawRoundRect(ctx, width / 2 - 250, pillY, 500, 68, 34);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(`RIIQX • ${trendingAudioVibe.toUpperCase()} • ${aspectRatio}`, width / 2, pillY + 44);

    // 3. Scene Number Badge
    const sceneBadgeY = aspectRatio === '16:9' ? height / 2 - 160 : height / 2 - 230;
    ctx.font = 'bold 34px monospace';
    ctx.fillStyle = '#22D3EE';
    ctx.fillText(`SCENE ${activeScene.sceneNumber} OF ${storyboard.scenes.length}`, width / 2, sceneBadgeY);

    // 4. Kinetic On-Screen Typography (Styled based on activeCaptionStyle)
    const rawWords = activeScene.onScreenText.split(' ');
    let lines: string[] = [];
    let currentLine = '';

    const fontSize = aspectRatio === '16:9' ? 58 : 72;
    ctx.font =
      activeCaptionStyle === 'mrbeast'
        ? `900 ${fontSize + 4}px Impact, Arial Black, sans-serif`
        : activeCaptionStyle === 'neon'
        ? `900 ${fontSize}px Inter, sans-serif`
        : activeCaptionStyle === 'minimal'
        ? `700 ${fontSize - 8}px Inter, sans-serif`
        : `800 ${fontSize}px Inter, sans-serif`;

    const maxTextWidth = width - 240;
    for (let i = 0; i < rawWords.length; i++) {
      const test = currentLine + rawWords[i] + ' ';
      const metrics = ctx.measureText(test);
      if (metrics.width > maxTextWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = rawWords[i] + ' ';
      } else {
        currentLine = test;
      }
    }
    lines.push(currentLine.trim());

    const lineHeight = activeCaptionStyle === 'mrbeast' ? fontSize + 20 : fontSize + 14;
    let startY = height / 2 - (lines.length * lineHeight) / 2;

    lines.forEach((lineText, lineIdx) => {
      const textY = startY + lineIdx * lineHeight;

      if (activeCaptionStyle === 'mrbeast') {
        // High Retention MrBeast Yellow / Impact Style
        ctx.font = `900 ${fontSize + 4}px Impact, Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 16;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(lineText.toUpperCase(), width / 2, textY);
        ctx.fillStyle = lineIdx % 2 === 0 ? '#FACC15' : '#FFFFFF';
        ctx.fillText(lineText.toUpperCase(), width / 2, textY);
      } else if (activeCaptionStyle === 'neon') {
        // Cyberpunk Glowing Neon Style
        ctx.save();
        ctx.font = `900 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#22D3EE';
        ctx.fillText(lineText.toUpperCase(), width / 2, textY);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(lineText.toUpperCase(), width / 2, textY);
        ctx.restore();
      } else if (activeCaptionStyle === 'karaoke') {
        // Karaoke Word Highlight Style
        ctx.font = `800 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(0,0,0,0.85)';
        ctx.strokeText(lineText, width / 2, textY);
        const activeLineIdx = Math.floor((progress / 100) * lines.length);
        ctx.fillStyle = lineIdx === activeLineIdx ? '#22D3EE' : '#E2E8F0';
        ctx.fillText(lineText, width / 2, textY);
      } else {
        // Minimalist Clean Helvetica / Inter
        ctx.font = `700 ${fontSize - 8}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(lineText, width / 2, textY);
        ctx.restore();
      }
    });

    // 5. Narration Script / Subtitles Container (Bottom Safe Zone)
    const subH = aspectRatio === '16:9' ? 120 : 150;
    const subY = height - (aspectRatio === '16:9' ? 200 : 440);
    ctx.fillStyle = 'rgba(3, 7, 18, 0.92)';
    drawRoundRect(ctx, 80, subY, width - 160, subH, 28);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '600 32px Inter, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    const scriptSnippet =
      activeScene.narrationScript.length > 55
        ? `"${activeScene.narrationScript.slice(0, 52)}..."`
        : `"${activeScene.narrationScript}"`;
    ctx.fillText(scriptSnippet, width / 2, subY + 75);

    // Audio Beat Equalizer Bars
    ctx.fillStyle = '#22D3EE';
    const eqBars = 7;
    const eqW = 8;
    const eqGap = 6;
    const startX = width / 2 - ((eqBars * (eqW + eqGap)) / 2);
    for (let b = 0; b < eqBars; b++) {
      const barH = 12 + Math.sin(progress * 0.2 + b) * 10;
      ctx.fillRect(startX + b * (eqW + eqGap), subY + subH - 30, eqW, barH);
    }

    // 6. Watermark (if enabled)
    if (watermarkEnabled && watermarkText) {
      ctx.font = 'bold 24px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.fillText(watermarkText, width - 100, aspectRatio === '16:9' ? 80 : 200);
    }

    // 7. Safe Margins Overlay (if enabled)
    if (showSafeMargins) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([16, 12]);
      const marginInset = aspectRatio === '16:9' ? 80 : 60;
      const topSafe = aspectRatio === '16:9' ? 120 : 280;
      const botSafe = aspectRatio === '16:9' ? 140 : 480;
      ctx.strokeRect(marginInset, topSafe, width - marginInset * 2, height - (topSafe + botSafe));
      ctx.setLineDash([]);

      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.textAlign = 'left';
      ctx.fillText(`⚡ ${aspectRatio} SAFE MARGIN GUIDE`, marginInset + 20, topSafe + 35);
    }
  }, [
    currentSceneIndex,
    storyboard,
    showSafeMargins,
    progress,
    captionStyle,
    trendingAudioVibe,
    aspectRatio,
    watermarkEnabled,
    watermarkText,
  ]);

  // Video Export (30 FPS Canvas Stream to WebM)
  const handleRenderVideo = async () => {
    if (!canvasRef.current || !storyboard) return;
    setIsRenderingExport(true);

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(30);
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
      const cleanName = storyboard.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `riiqx_${aspectRatio.replace(':', 'x')}_${cleanName}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setIsRenderingExport(false);
    };

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
    setActiveTab('autopilot');
  };

  // Reorder Scenes Helper
  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    if (!storyboard) return;
    const newScenes = [...storyboard.scenes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newScenes.length) return;

    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIndex];
    newScenes[targetIndex] = temp;

    // Renumber scenes
    const renumbered = newScenes.map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));
    setStoryboard({ ...storyboard, scenes: renumbered });
    setCurrentSceneIndex(targetIndex);
  };

  // Scene Text Edit Helper
  const handleUpdateSceneText = (index: number, onScreenText: string, narrationScript: string) => {
    if (!storyboard) return;
    const newScenes = [...storyboard.scenes];
    newScenes[index] = {
      ...newScenes[index],
      onScreenText,
      narrationScript,
    };
    setStoryboard({ ...storyboard, scenes: newScenes });
  };

  // Preset Buttons List
  const PRESET_OPTIONS: Array<{ id: CreationPreset; label: string; icon: string }> = [
    { id: 'viral_hook', label: 'Viral Hook', icon: '🔥' },
    { id: 'cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'podcast_clips', label: 'Podcast Clips', icon: '🎙️' },
    { id: 'storytelling', label: 'Storytelling', icon: '📖' },
    { id: 'product_promo', label: 'Product Promo', icon: '🛍️' },
    { id: 'travel', label: 'Travel & Vibe', icon: '✈️' },
    { id: 'fashion', label: 'Fashion & Style', icon: '✨' },
    { id: 'emotional', label: 'Emotional', icon: '❤️' },
    { id: 'educational', label: 'Educational', icon: '💡' },
    { id: 'trending_news', label: 'Trending News', icon: '⚡' },
  ];

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
                <Video className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Creator Studio</h1>
              <span className="rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                AI Viral Reels & Shorts Factory
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Turn your ideas, photos & videos into viral Reels, Shorts & more. Simple. Powerful. Professional.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 text-xs">
              <button
                onClick={() => setActiveSubTab('studio')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
                  activeSubTab === 'studio'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                <span>Create</span>
              </button>
              <button
                onClick={() => setActiveSubTab('trend_assist')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
                  activeSubTab === 'trend_assist'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Trending</span>
              </button>
              <button
                onClick={() => setActiveSubTab('projects')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition ${
                  activeSubTab === 'projects'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>My Projects ({savedProjects.length})</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('editor')}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:from-violet-700 hover:to-pink-600 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>+ Open Video Editor</span>
            </button>
          </div>
        </div>

        {/* Upload Reminder Card */}
        <div className="relative overflow-hidden rounded-3xl border border-violet-100 dark:border-violet-900/40 bg-gradient-to-r from-violet-50/60 via-purple-50/40 to-pink-50/60 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-pink-950/20 p-5 shadow-2xs">

          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  ✨ Upload Any Photos or Videos — RIIQX AI Crafts Trending Viral Reels &amp; Shorts
                </h2>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Drop raw video clips (<code className="text-cyan-300">MP4, MOV, WebM</code>) or photos (<code className="text-cyan-300">PNG, JPG, WebP</code>).
                RIIQX AI analyzes your footage, writes high-retention viral hooks, auto-crops to 9:16 vertical cover, syncs kinetic subtitles (<span className="text-yellow-400 font-semibold">MrBeast</span>, <span className="text-cyan-400 font-semibold">Neon</span>, <span className="text-emerald-400 font-semibold">Karaoke</span>), and renders ready-to-post vertical videos!
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-[#CBD5E1]">
                <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/10">
                  <Film className="h-3 w-3 text-cyan-400" /> Auto 9:16 Aspect Cover &amp; Ken-Burns Motion
                </span>
                <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/10">
                  <Flame className="h-3 w-3 text-amber-400" /> Viral Hook Retention Matrix
                </span>
                <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 border border-white/10">
                  <Music className="h-3 w-3 text-purple-400" /> Trending Beat Sync
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 hover:brightness-110 transition"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload Media</span>
              </button>
              <button
                onClick={handleLoadSampleAssets}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-1.5 text-[11px] font-semibold text-[#94A3B8] hover:text-white hover:border-cyan-500/40 transition"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Load Sample Footage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Stage Background Job Progress Tracker (When Active) */}
        {processingStage !== 'idle' && (
          <div className="rounded-2xl border border-cyan-500/40 bg-[#070D1F] p-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="uppercase tracking-wider">
                  AI Pipeline Stage: {processingStage.replace('_', ' ')}
                </span>
              </div>
              <span className="font-mono text-cyan-400">{stageProgressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#030712] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
                style={{ width: `${stageProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-2 font-mono">
              <span className={processingStage === 'uploading' ? 'text-cyan-400 font-bold' : ''}>1. Uploading</span>
              <span className={processingStage === 'analyzing' ? 'text-cyan-400 font-bold' : ''}>2. Analyzing</span>
              <span className={processingStage === 'editing' ? 'text-cyan-400 font-bold' : ''}>3. Storyboarding</span>
              <span className={processingStage === 'rendering' ? 'text-cyan-400 font-bold' : ''}>4. Rendering</span>
              <span className={processingStage === 'ready' ? 'text-emerald-400 font-bold' : ''}>5. Ready</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB: TREND ASSIST INTELLIGENCE
           ========================================================================= */}
        {activeSubTab === 'trend_assist' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span>Trending Content Intelligence (Trend Assist)</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    AI-identified high-retention content angles tailored to {niche}. Choose an angle to immediately populate your Reel project.
                  </p>
                </div>
                <button
                  onClick={() => setTrendSuggestions(generateTrendAssistIdeas(niche))}
                  className="flex items-center gap-1 rounded-xl border border-[#1E2A4A] px-2.5 py-1 text-xs font-semibold text-[#94A3B8] hover:text-white"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Refresh Trends</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendSuggestions.map((trend) => (
                  <div
                    key={trend.id}
                    className="flex flex-col justify-between rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 hover:border-cyan-500/40 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-2">
                        <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 border border-cyan-500/20">
                          {trend.freshness}
                        </span>
                        <span className="text-[#64748B]">{trend.niche}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1.5">{trend.topic}</h4>
                      <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-3">
                        {trend.suggestedAngle}
                      </p>

                      <div className="space-y-2 border-t border-[#1E2A4A] pt-2 text-[10px]">
                        <div>
                          <span className="font-semibold text-emerald-400">Safe &amp; Relevant: </span>
                          <span className="text-slate-300">{trend.creativeDirections.safeRelevant}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-yellow-400">High Energy: </span>
                          <span className="text-slate-300">{trend.creativeDirections.highEnergy}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-purple-400">Creative Experiment: </span>
                          <span className="text-slate-300">{trend.creativeDirections.creativeExperiment}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTopic(trend.topic);
                        setActiveSubTab('studio');
                      }}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-1.5 text-xs font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Apply Topic to Studio</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUB-TAB: LIBRARY & PROJECT HISTORY
           ========================================================================= */}
        {activeSubTab === 'projects' && (
          <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-cyan-400" />
                  <span>Persistent Project Library ({savedProjects.length} Projects)</span>
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Drafts, synthesized storyboards, and completed renders saved in local isolation.
                </p>
              </div>
              {savedProjects.length > 0 && (
                <button
                  onClick={() => {
                    setSavedProjects([]);
                    saveCreatorProjectsToStorage([]);
                  }}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Clear Library
                </button>
              )}
            </div>

            {savedProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#1E2A4A] p-8 text-center text-xs text-[#64748B]">
                No projects saved yet. Click &quot;Create My Reel&quot; in the studio to automatically generate and save your projects!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-col justify-between rounded-xl border border-[#1E2A4A] bg-[#030712] p-3.5 hover:border-cyan-500/40 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1">
                        <span className="font-mono text-cyan-400">{proj.brief.aspectRatio || '9:16'}</span>
                        <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mb-1">{proj.name}</h4>
                      <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                        {proj.storyboard?.selectedHook?.hookText || proj.brief.topic}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#1E2A4A]">
                      <button
                        onClick={() => {
                          setTopic(proj.brief.topic);
                          setNiche(proj.brief.niche);
                          setAspectRatio(proj.brief.aspectRatio || '9:16');
                          if (proj.brief.creationPreset) setCreationPreset(proj.brief.creationPreset);
                          if (proj.storyboard) setStoryboard(proj.storyboard);
                          setActiveSubTab('studio');
                        }}
                        className="flex-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 py-1 text-[11px] font-semibold text-cyan-400 hover:bg-cyan-500 hover:text-black transition text-center"
                      >
                        Reopen in Studio
                      </button>
                      <button
                        onClick={() => {
                          const updated = savedProjects.filter((p) => p.id !== proj.id);
                          setSavedProjects(updated);
                          saveCreatorProjectsToStorage(updated);
                        }}
                        className="p-1 text-[#64748B] hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SUB-TAB: MAIN STUDIO (CREATION FACTORY)
           ========================================================================= */}
        {activeSubTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Upload, Presets & Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Multi-Asset Upload Zone */}
              <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-2">
                    <UploadCloud className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Upload Photos &amp; Videos ({uploadedAssets.length} Uploaded)</span>
                  </div>
                  {uploadedAssets.length > 0 && (
                    <button
                      onClick={() => setUploadedAssets([])}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/*,image/*"
                  onChange={(e) => {
                    if (e.target.files) handleFilesAdded(e.target.files);
                  }}
                  className="hidden"
                />

                {/* Drag & Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
                    isDraggingOver
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-[#1E2A4A] bg-[#030712]/50 hover:border-cyan-500/50 hover:bg-[#0B132B]/40'
                  }`}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-2">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold text-white mb-0.5">
                    Drag &amp; drop video clips or photos here, or click to browse files
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Supports MP4, MOV, WebM, PNG, JPG, WebP • AI auto-crops to {aspectRatio} and syncs kinetic typography
                  </div>
                </div>

                {/* Uploaded Asset Badges Grid */}
                {uploadedAssets.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                    {uploadedAssets.map((asset, idx) => (
                      <div
                        key={asset.id}
                        className="group relative flex items-center gap-2.5 rounded-xl border border-[#1E2A4A] bg-[#030712] p-2 transition hover:border-cyan-500/40"
                      >
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center">
                          {asset.type === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-cyan-950/40 text-cyan-400">
                              <Video className="h-5 w-5" />
                            </div>
                          )}
                          <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 text-[8px] font-bold uppercase text-white">
                            {asset.type === 'video' ? 'VID' : 'IMG'}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-semibold text-white">{asset.name}</div>
                          <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                            <span className="text-cyan-400 font-mono">Scene {idx + 1}</span>
                            <span>•</span>
                            <span>{(asset.sizeBytes / 1024).toFixed(0)} KB</span>
                          </div>
                          <span className="inline-block mt-0.5 rounded bg-[#0B132B] px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-500/20">
                            {asset.aiSuggestedRole?.replace('_', ' ')}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveAsset(asset.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#64748B] hover:text-rose-400 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Aspect Ratio & Creation Presets */}
              <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 sm:p-5 space-y-4">
                {/* Aspect Ratio Selector */}
                <div>
                  <label className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                    <span>Aspect Ratio</span>
                    <span className="text-[10px] text-cyan-400 font-normal">Auto-Reframe Canvas</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: '9:16', label: '9:16 Vertical', desc: 'Reels, Shorts, TikTok', icon: Smartphone },
                      { id: '1:1', label: '1:1 Square', desc: 'Instagram Feed, LinkedIn', icon: Square },
                      { id: '16:9', label: '16:9 Landscape', desc: 'YouTube, Desktop', icon: Monitor },
                    ].map((ar) => {
                      const Icon = ar.icon;
                      const isSelected = aspectRatio === ar.id;
                      return (
                        <button
                          key={ar.id}
                          type="button"
                          onClick={() => setAspectRatio(ar.id as AspectRatio)}
                          className={`rounded-xl border p-2.5 text-left transition ${
                            isSelected
                              ? 'border-cyan-500 bg-[#0B132B] shadow-md shadow-cyan-950/40'
                              : 'border-[#1E2A4A] bg-[#030712] hover:bg-[#0B132B]/50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-[#64748B]'}`} />
                            <span className="text-xs font-bold text-white">{ar.label}</span>
                          </div>
                          <div className="text-[10px] text-[#64748B] mt-0.5">{ar.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 10 Creation Presets */}
                <div>
                  <label className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                    <span>Creation Preset</span>
                    <span className="text-[10px] text-[#94A3B8]">Auto-tunes pacing, transitions &amp; subtitles</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_OPTIONS.map((opt) => {
                      const isSelected = creationPreset === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectPreset(opt.id)}
                          className={`flex items-center gap-1.5 rounded-xl border p-2 text-left transition ${
                            isSelected
                              ? 'border-cyan-500 bg-[#0B132B] shadow-md'
                              : 'border-[#1E2A4A] bg-[#030712] hover:bg-[#0B132B]/50'
                          }`}
                        >
                          <span className="text-sm">{opt.icon}</span>
                          <span className={`text-[11px] font-bold truncate ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Input Fields */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-white mb-1 block">Video Topic / Premise</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. How Autonomous AI Builds Viral Brands"
                      className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3.5 py-2 text-xs font-medium text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white mb-1 block">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value) as any)}
                        className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value={15}>15s (Rapid Viral)</option>
                        <option value={30}>30s (Standard Reel)</option>
                        <option value={60}>60s (Deep Breakdown)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white mb-1 block">Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as any)}
                        className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="en">English (Global)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white mb-1 block">Tone</label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as any)}
                        className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="energetic">Energetic</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="cinematic">Cinematic</option>
                        <option value="educational">Educational</option>
                        <option value="emotional">Emotional</option>
                        <option value="informative">Informative</option>
                        <option value="funny">Funny</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* THE ONE MAIN ACTION: CREATE MY REEL */}
                <button
                  onClick={handleCreateMyReel}
                  disabled={processingStage !== 'idle'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 py-3 text-sm font-bold text-black shadow-xl shadow-cyan-950/50 hover:brightness-110 transition disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 fill-black" />
                  <span>{processingStage !== 'idle' ? 'Processing Reel...' : 'Create My Reel'}</span>
                </button>
              </div>

              {/* 3. Advanced Settings Drawer (Collapsible) */}
              <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAdvancedDrawerOpen(!advancedDrawerOpen)}
                  className="flex w-full items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-[#94A3B8] hover:text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Advanced Customization Drawer</span>
                  </div>
                  {advancedDrawerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {advancedDrawerOpen && (
                  <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-[#1E2A4A]">
                    {/* Creative Direction */}
                    <div>
                      <label className="text-xs font-semibold text-white mb-1.5 block">Creative Direction</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'safe_relevant', label: 'Safe & Relevant', desc: 'Classic high retention' },
                          { id: 'high_energy', label: 'High Energy', desc: 'Rapid aggressive cuts' },
                          { id: 'creative_experiment', label: 'Experiment', desc: 'Contrarian narrative' },
                        ].map((dir) => (
                          <button
                            key={dir.id}
                            type="button"
                            onClick={() => setCreativeDirection(dir.id as CreativeDirection)}
                            className={`rounded-xl border p-2 text-left transition ${
                              creativeDirection === dir.id
                                ? 'border-cyan-500 bg-[#0B132B]'
                                : 'border-[#1E2A4A] bg-[#030712] hover:bg-[#0B132B]/50'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{dir.label}</div>
                            <div className="text-[10px] text-[#64748B]">{dir.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subtitle Style Selector */}
                    <div>
                      <label className="text-xs font-semibold text-white mb-1.5 block">Kinetic Subtitle Style</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'mrbeast', label: 'MrBeast', sub: 'Yellow Bold Impact', color: 'border-yellow-500/40 text-yellow-400' },
                          { id: 'neon', label: 'Neon Glow', sub: 'Cyberpunk Cyan', color: 'border-cyan-500/40 text-cyan-400' },
                          { id: 'karaoke', label: 'Karaoke', sub: 'Word-by-Word Beat', color: 'border-emerald-500/40 text-emerald-400' },
                          { id: 'minimal', label: 'Minimalist', sub: 'Clean Helvetica', color: 'border-slate-500/40 text-slate-300' },
                        ].map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setCaptionStyle(style.id as CaptionStyle)}
                            className={`rounded-xl border p-2 text-left transition ${
                              captionStyle === style.id
                                ? 'border-cyan-500 bg-[#0B132B]'
                                : 'border-[#1E2A4A] bg-[#030712] hover:bg-[#0B132B]/50'
                            }`}
                          >
                            <div className={`text-xs font-bold ${style.color}`}>{style.label}</div>
                            <div className="text-[10px] text-[#64748B] truncate">{style.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audio Vibe & Watermark */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-white mb-1 block">Audio Vibe</label>
                        <select
                          value={trendingAudioVibe}
                          onChange={(e) => setTrendingAudioVibe(e.target.value as any)}
                          className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="phonk">🔥 Drift Phonk (High Energy)</option>
                          <option value="synthwave">🌆 Cyber Synth (Electronic)</option>
                          <option value="cinematic">🎬 Cinematic (Crescendo)</option>
                          <option value="upbeat_lofi">☕ Upbeat Lo-Fi (Chill)</option>
                          <option value="viral_pop">⚡ Trending Pop (Catchy)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-white mb-1 block">Brand Watermark</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            placeholder="@YourBrand"
                            className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                            className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                              watermarkEnabled
                                ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-400'
                                : 'border-[#1E2A4A] bg-[#030712] text-[#64748B]'
                            }`}
                          >
                            {watermarkEnabled ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Smart Timeline & In-line Scene Editor */}
              {storyboard && (
                <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 sm:p-5 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Scene Timeline ({storyboard.scenes.length} Scenes • Click Scene to Preview)</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {uploadedAssets.length > 0 ? `${uploadedAssets.length} Media Attached` : 'Procedural Obsidian Visuals'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {storyboard.scenes.map((scene, idx) => (
                      <div
                        key={scene.sceneNumber}
                        onClick={() => {
                          setCurrentSceneIndex(idx);
                          setProgress(0);
                        }}
                        className={`cursor-pointer rounded-xl border p-3 text-xs transition ${
                          currentSceneIndex === idx
                            ? 'border-cyan-500/60 bg-[#0B132B]'
                            : 'border-[#1E2A4A] bg-[#030712]/60 hover:bg-[#0B132B]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#94A3B8] mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">Scene {scene.sceneNumber}</span>
                            {scene.assetUrl && (
                              <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                                {scene.assetType === 'video' ? '🎬 VIDEO ATTACHED' : '📷 PHOTO ATTACHED'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-400">{scene.durationSeconds}s</span>
                            {/* Move Up / Down Buttons */}
                            <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveScene(idx, 'up')}
                                className="p-1 text-[#64748B] hover:text-white disabled:opacity-30"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                disabled={idx === storyboard.scenes.length - 1}
                                onClick={() => handleMoveScene(idx, 'down')}
                                className="p-1 text-[#64748B] hover:text-white disabled:opacity-30"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* In-Line Text Inputs */}
                        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={scene.onScreenText}
                            onChange={(e) => handleUpdateSceneText(idx, e.target.value, scene.narrationScript)}
                            className="w-full rounded-lg border border-[#1E2A4A] bg-[#030712] px-2.5 py-1 text-xs font-bold text-white focus:border-cyan-500/50 focus:outline-none"
                            placeholder="On-screen kinetic text..."
                          />
                          <input
                            type="text"
                            value={scene.narrationScript}
                            onChange={(e) => handleUpdateSceneText(idx, scene.onScreenText, e.target.value)}
                            className="w-full rounded-lg border border-[#1E2A4A] bg-[#030712] px-2.5 py-1 text-[11px] text-[#94A3B8] italic focus:border-cyan-500/50 focus:outline-none"
                            placeholder="Narration script / subtitle..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Aspect-Ratio Responsive Video Canvas & Action Controls */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="sticky top-6 w-full flex flex-col items-center">
                {/* Responsive Canvas Frame */}
                <div
                  className={`relative w-full rounded-[2.2rem] border-4 border-[#1E2A4A] bg-black shadow-2xl shadow-cyan-950/30 overflow-hidden ${
                    aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-w-[340px]'
                      : aspectRatio === '1:1'
                      ? 'aspect-square max-w-[380px]'
                      : 'aspect-[16/9] max-w-[480px]'
                  }`}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'auto' }}
                  />

                  {/* Progress Scrubber Bar at Top */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Top Scene / Style Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-white border border-white/10">
                      Scene {currentSceneIndex + 1}/{storyboard?.scenes.length || 5}
                    </div>
                    <div className="rounded-full bg-cyan-500/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-500/30">
                      {captionStyle.toUpperCase()}
                    </div>
                  </div>

                  {/* Bottom Media Status Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] text-white border border-white/10">
                    <div className="flex items-center gap-1.5">
                      {storyboard?.scenes[currentSceneIndex]?.assetUrl ? (
                        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Uploaded Media Active</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Procedural Obsidian Visual</span>
                      )}
                    </div>
                    <span className="font-mono text-cyan-400">{progress}%</span>
                  </div>
                </div>

                {/* Playback & Export Controls Bar */}
                <div className="mt-4 flex w-full max-w-[420px] items-center justify-between rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-3 shadow-lg">
                  <button
                    onClick={() => {
                      setCurrentSceneIndex(0);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    title="Restart from Scene 1"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1E2A4A] bg-[#030712] text-[#94A3B8] hover:text-white transition"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                      isMuted
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                        : 'border-[#1E2A4A] bg-[#030712] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-xs font-bold text-black shadow-lg shadow-cyan-500/30 hover:brightness-110 transition"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play Scene'}</span>
                  </button>

                  <button
                    onClick={handleRenderVideo}
                    disabled={isRenderingExport}
                    title={`Export 30 FPS ${aspectRatio} Video`}
                    className="flex h-9 items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 hover:text-white transition disabled:opacity-50"
                  >
                    <Download className={`h-4 w-4 ${isRenderingExport ? 'animate-bounce' : ''}`} />
                    <span>{isRenderingExport ? 'Rendering...' : 'Export'}</span>
                  </button>
                </div>

                {/* Secondary Action Helpers */}
                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-[#64748B]">
                  <button
                    onClick={() => setShowSafeMargins(!showSafeMargins)}
                    className="hover:text-cyan-400 flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Safe Margins {showSafeMargins ? 'ON' : 'OFF'}</span>
                  </button>
                  <span>•</span>
                  <span>30 FPS Canvas Rendering</span>
                  <span>•</span>
                  <button onClick={handleSendToAutopilot} className="hover:text-cyan-400 flex items-center gap-1">
                    <Send className="h-3 w-3" />
                    <span>Autopilot Ready</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
