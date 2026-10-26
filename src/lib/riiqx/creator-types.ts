// =============================================================================
// RIIQX — AI Creator Studio 2.0 Contracts & Storyboard Types
// Multi-Asset Upload (Videos & Photos) • Viral Reels & Shorts Factory
// 9:16 / 1:1 / 16:9 Aspect Ratios • Presets • Trend Assist • Background Jobs
// =============================================================================

export type CreatorPlatform = 'instagram_reels' | 'youtube_shorts' | 'tiktok';

export type AspectRatio = '9:16' | '1:1' | '16:9';

export type HookType = 'pattern_interrupt' | 'curiosity_gap' | 'bold_statistic';

export type CaptionStyle = 'mrbeast' | 'neon' | 'minimal' | 'karaoke';

export type AudioVibe = 'phonk' | 'synthwave' | 'cinematic' | 'upbeat_lofi' | 'viral_pop';

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
  | 'editing'
  | 'rendering'
  | 'ready'
  | 'failed';

export interface UploadedAsset {
  id: string;
  name: string;
  type: 'video' | 'image';
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

export interface ViralHook {
  id: string;
  type: HookType;
  hookText: string;
  visualCue: string;
  engagementScoreEstimate: number; // 0-100
  creativeDirection?: CreativeDirection;
}

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
  assetType?: 'video' | 'image';
  captionStyle?: CaptionStyle;
  cropMode?: 'cover' | 'contain';
  speed?: number;
  voiceoverAudioUrl?: string;
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

export interface CreatorProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed' | 'failed';
  brief: CreatorBrief;
  storyboard?: CreatorStoryboard;
  renderedVideoBlobUrl?: string;
  exportHistory?: Array<{
    id: string;
    timestamp: string;
    format: string;
    aspectRatio: AspectRatio;
    downloadName: string;
  }>;
}

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
}
