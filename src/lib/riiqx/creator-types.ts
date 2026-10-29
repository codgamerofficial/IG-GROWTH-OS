// =============================================================================
// RIIQX — AI Creator Studio 3.0 Master Contracts & Type System
// 14 Production Workspaces • Complete Shorts & Reels Lifecycle
// Research → Create → Edit → Review → Schedule → Publish → Analyze → Improve
// =============================================================================

export type CreatorPlatform = 'instagram_reels' | 'youtube_shorts' | 'tiktok' | 'both';

export type AspectRatio = '9:16' | '1:1' | '16:9';

export type HookType = 'pattern_interrupt' | 'curiosity_gap' | 'bold_statistic' | 'relatable_struggle' | 'secret_reveal';

export type CaptionStyle = 'mrbeast' | 'neon' | 'minimal' | 'karaoke' | 'bold_yellow' | 'cyberpunk';

export type AudioVibe = 'phonk' | 'synthwave' | 'cinematic' | 'upbeat_lofi' | 'viral_pop' | 'deep_ambient';

export type CreationPreset =
  | 'viral_hook'
  | 'cinematic'
  | 'podcast_clips'
  | 'storytelling'
  | 'product_promo'
  | 'travel'
  | 'fashion'
  | 'emotional'
  | 'educational'
  | 'trending_news';

export type CreativeDirection = 'safe_relevant' | 'high_energy' | 'creative_experiment';

export type ContentTone =
  | 'energetic'
  | 'authoritative'
  | 'cinematic'
  | 'educational'
  | 'emotional'
  | 'informative'
  | 'funny'
  | 'professional';

export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'scripting'
  | 'storyboarding'
  | 'editing'
  | 'rendering'
  | 'ready'
  | 'failed';

export type ProjectLifecycleStatus =
  | 'idea'
  | 'researching'
  | 'planned'
  | 'scripting'
  | 'producing'
  | 'editing'
  | 'review'
  | 'ready_to_publish'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'archived'
  | 'draft'
  | 'completed';

export type CreatorStudioTab =
  | 'overview'
  | 'ideas'
  | 'planner'
  | 'script'
  | 'storyboard'
  | 'editor'
  | 'assets'
  | 'metadata'
  | 'queue'
  | 'calendar'
  | 'published'
  | 'analytics'
  | 'templates'
  | 'brand_kit';

// -----------------------------------------------------------------------------
// Media & Asset Models
// -----------------------------------------------------------------------------
export interface UploadedAsset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string; // Object URL or Base64 or local media URL
  sizeBytes: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  aspectRatio?: string;
  previewUrl?: string;
  aiSuggestedRole?: 'hook_visual' | 'b_roll' | 'climax' | 'proof' | 'outro';
  analysisStatus?: 'pending' | 'analyzed' | 'error';
  visualTags?: string[];
  bpm?: number;
  format?: string;
}

export interface MediaAnalysisResult {
  detectedTheme: string;
  visualSummary: string;
  strongestOpeningAssetId?: string;
  recommendedPreset: CreationPreset;
  recommendedAudioVibe: AudioVibe;
  pacing: 'rapid' | 'moderate' | 'cinematic';
  suggestedHooks: string[];
}

// -----------------------------------------------------------------------------
// Hooks & Script Studio
// -----------------------------------------------------------------------------
export interface ViralHook {
  id: string;
  type: HookType;
  hookText: string;
  visualCue: string;
  engagementScoreEstimate: number; // 0-100
  creativeDirection?: CreativeDirection;
  estimatedRetentionRate?: number; // e.g. 84% at 3s
}

export interface ScriptScene {
  sceneNumber: number;
  title: string;
  narration: string;
  onScreenText: string;
  visualDirections: string;
  bRollSuggestion: string;
  cameraMotion: 'static' | 'slow_zoom_in' | 'rapid_pan' | 'orbit' | 'whip_pan' | 'dolly_back';
  durationSeconds: number;
  wordCount: number;
  soundNote: string;
  assetId?: string;
}

export interface ScriptData {
  title: string;
  topic: string;
  tone: ContentTone;
  language: 'en' | 'bn' | 'hi';
  targetAudience: string;
  hooks: ViralHook[];
  selectedHookIndex: number;
  scenes: ScriptScene[];
  totalDurationSeconds: number;
  totalWordCount: number;
  wordsPerSecond: number; // Normal is ~2.3 - 2.8 words/sec
  pacingWarning?: string;
  callToActionVariations: string[];
  selectedCtaIndex: number;
  notes?: string;
}

// -----------------------------------------------------------------------------
// Storyboard & Pre-Production
// -----------------------------------------------------------------------------
export interface VideoScene {
  sceneNumber: number;
  durationSeconds: number;
  visualPrompt: string;
  onScreenText: string;
  narrationScript: string;
  transition: 'cut' | 'fade' | 'zoom' | 'slide';
  backgroundColor: string;
  gradient?: string;
  assetId?: string;
  assetUrl?: string;
  assetType?: 'video' | 'image' | 'audio';
  captionStyle?: CaptionStyle;
  cropMode?: 'cover' | 'contain';
  speed?: number;
  voiceoverAudioUrl?: string;
  cameraMotion?: string;
  soundEffect?: string;
}

export interface CreatorBrief {
  id: string;
  topic: string;
  niche: string;
  targetAudience: string;
  platform: CreatorPlatform;
  aspectRatio?: AspectRatio;
  durationSeconds: 15 | 30 | 60;
  creationPreset?: CreationPreset;
  creativeDirection?: CreativeDirection;
  brandVoice: ContentTone;
  tone?: ContentTone;
  language?: 'en' | 'bn' | 'hi';
  goal: string;
  includeSubtitles: boolean;
  backgroundMusic: string;
  trendingAudioVibe?: AudioVibe;
  captionStyle?: CaptionStyle;
  callToAction: string;
  watermark?: {
    enabled: boolean;
    text: string;
  };
  voiceoverEnabled?: boolean;
  musicVolume?: number;
  assets?: UploadedAsset[];
}

export interface CreatorStoryboard {
  id: string;
  brief: CreatorBrief;
  title: string;
  aspectRatio: AspectRatio;
  selectedHook: ViralHook;
  alternativeHooks: ViralHook[];
  scenes: VideoScene[];
  totalDurationSeconds: number;
  caption: string;
  hashtags: string[];
  thumbnailPrompt: string;
  createdAt: string;
  validationStatus: 'validated' | 'safe_margins_exceeded' | 'invalid_aspect_ratio';
  assetsAttachedCount?: number;
  analysis?: MediaAnalysisResult;
}

// -----------------------------------------------------------------------------
// Multi-Track Timeline Models
// -----------------------------------------------------------------------------
export interface TimelineClip {
  id: string;
  assetId?: string;
  name: string;
  startTime: number;
  duration: number;
  startOffset?: number;
  text?: string;
  color: string;
  type: 'video' | 'image' | 'voiceover' | 'music' | 'subtitle' | 'overlay';
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: 'video' | 'b_roll' | 'voiceover' | 'music' | 'subtitles' | 'overlay';
  muted: boolean;
  locked: boolean;
  volume: number; // 0 to 100
  clips: TimelineClip[];
}

// -----------------------------------------------------------------------------
// Pre-Publish Quality Checklist
// -----------------------------------------------------------------------------
export interface PrePublishCheck {
  id: string;
  label: string;
  category: 'format' | 'audio_visual' | 'metadata' | 'compliance' | 'account';
  status: 'pass' | 'warn' | 'fail';
  detail: string;
  fixAction?: string;
}

// -----------------------------------------------------------------------------
// Publishing & Social Jobs
// -----------------------------------------------------------------------------
export interface PublishingJob {
  id: string;
  projectId: string;
  platform: 'youtube_shorts' | 'instagram_reels' | 'both';
  connectedAccount: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'uploading' | 'processing' | 'published' | 'failed' | 'cancelled';
  retryCount: number;
  idempotencyKey: string;
  platformMediaId?: string;
  permalink?: string;
  publishedAt?: string;
  errorMessage?: string;
}

// -----------------------------------------------------------------------------
// Creator Analytics & Retention Models
// -----------------------------------------------------------------------------
export interface RetentionPoint {
  second: number;
  percentage: number;
}

export interface PerformanceMetric {
  views: number;
  watchTimeHours: number;
  avgViewDurationSec: number;
  retentionCurve: RetentionPoint[];
  retentionAt2s: number;
  retentionAt5s: number;
  retentionAt15s: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  subscribersGained: number;
  benchmarkComparison: string;
  actionableRecommendations: string[];
}

// -----------------------------------------------------------------------------
// Brand Kit
// -----------------------------------------------------------------------------
export interface BrandKit {
  brandName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  brandVoice: ContentTone;
  watermarkText: string;
  defaultCaptionStyle: CaptionStyle;
  defaultAudioVibe: AudioVibe;
  defaultCta: string;
  logoUrl?: string;
  disallowedWords?: string[];
}

// -----------------------------------------------------------------------------
// Trends & Research Ideas
// -----------------------------------------------------------------------------
export interface TrendSuggestion {
  id: string;
  niche: string;
  topic: string;
  source: 'verified_creator_matrix' | 'ai_evergreen_analysis';
  freshness: string;
  suggestedAngle: string;
  creativeDirections: {
    safeRelevant: string;
    highEnergy: string;
    creativeExperiment: string;
  };
  recommendedHashtags: string[];
  viralScore?: number;
  targetAudience?: string;
  corePromise?: string;
  contentRisk?: string;
}

// -----------------------------------------------------------------------------
// Unified Project Master Record
// -----------------------------------------------------------------------------
export interface CreatorProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectLifecycleStatus;
  targetPlatform?: CreatorPlatform;
  contentFormat?: AspectRatio;
  brief: CreatorBrief;
  storyboard?: CreatorStoryboard;
  script?: ScriptData;
  timelineTracks?: TimelineTrack[];
  prePublishChecks?: PrePublishCheck[];
  publishingJob?: PublishingJob;
  performance?: PerformanceMetric;
  sourceIdea?: TrendSuggestion;
  renderedVideoBlobUrl?: string;
  exportHistory?: Array<{
    id: string;
    timestamp: string;
    format: string;
    aspectRatio: AspectRatio;
    downloadName: string;
  }>;
  brandKit?: BrandKit;
  notes?: string;
}
