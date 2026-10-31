// =============================================================================
// RIIQX Creator Studio — Complete Multimodal Media & Analytics Typings
// Mobile Upload • AI Video Editing • 9:16 Canvas Pipeline • Real Analytics
// =============================================================================

export type MediaMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/heic'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/webm';

export type EditingStyle =
  | 'cinematic'
  | 'viral_fast'
  | 'minimal'
  | 'aesthetic'
  | 'documentary'
  | 'vlog'
  | 'podcast_clip'
  | 'product_showcase'
  | 'custom';

export type ColorFilter =
  | 'clean'
  | 'teal_orange'
  | 'cyberpunk'
  | 'noir'
  | 'vintage'
  | 'golden_hour';

export type CaptionPreset =
  | 'mrbeast'
  | 'minimal'
  | 'karaoke'
  | 'bold_yellow'
  | 'neon_glow';

export interface IngestedMediaFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  mediaType: 'image' | 'video';
  localUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
  aspectRatio?: number;
  orientation?: 'portrait' | 'landscape' | 'square';
  uploadedAt: string;
}

export interface MediaAnalysisResult {
  fileId: string;
  durationSeconds: number;
  resolution: { width: number; height: number };
  aspectRatio: number;
  isVertical: boolean;
  needsVerticalCrop: boolean;
  cropBounds?: { x: number; y: number; width: number; height: number };
  estimatedShotCount: number;
  dominantSubjects: string[];
  audioDetected: boolean;
  suggestedStyle: EditingStyle;
  suitabilityScore: number; // 0 - 100
  notes: string[];
}

export interface EditingAction {
  type:
    | 'trim'
    | 'crop_vertical'
    | 'filter'
    | 'speed'
    | 'subtitles'
    | 'audio_mix'
    | 'transition'
    | 'hook_insert';
  parameters: Record<string, unknown>;
  explanation: string;
}

export interface EditingPlan {
  id: string;
  userPrompt: string;
  style: EditingStyle;
  targetDurationSeconds: number;
  targetAspectRatio: '9:16' | '1:1' | '16:9';
  selectedFilter: ColorFilter;
  speedMultiplier: number;
  captionPreset: CaptionPreset;
  language: string;
  actions: EditingAction[];
  version: number;
  createdAt: string;
}

export interface TimelineClip {
  id: string;
  sourceFileId: string;
  sourceUrl: string;
  mediaType: 'image' | 'video';
  trackIndex: number;
  startTime: number;
  duration: number;
  sourceTrimStart: number;
  sourceTrimEnd: number;
  filter: ColorFilter;
  speed: number;
  volume: number;
}

export interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  highlightWords?: string[];
}

export interface RenderJobRequest {
  projectId: string;
  plan: EditingPlan;
  clips: TimelineClip[];
  subtitles: SubtitleCue[];
  musicUrl?: string;
  resolution: { width: number; height: number };
  fps: number;
}

export interface RenderJobStatus {
  jobId: string;
  projectId: string;
  status:
    | 'queued'
    | 'extracting_frames'
    | 'applying_effects'
    | 'encoding_video'
    | 'encoding_audio'
    | 'validating'
    | 'completed'
    | 'failed';
  progressPercent: number;
  outputBlobUrl?: string;
  outputFormat?: string;
  outputSizeBytes?: number;
  durationSeconds?: number;
  resolution?: { width: number; height: number };
  fps?: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface RenderValidationResult {
  isValid: boolean;
  checks: {
    filePresent: boolean;
    playableCodec: boolean;
    nonZeroDuration: boolean;
    correctAspectRatio: boolean;
    audioStreamValid: boolean;
    nonZeroBytes: boolean;
  };
  diagnostics: string[];
}

// -----------------------------------------------------------------------------
// Real Analytics Typings
// -----------------------------------------------------------------------------

export type AnalyticsStatus =
  | 'CONNECTED'
  | 'AUTHENTICATION_REQUIRED'
  | 'PERMISSION_MISSING'
  | 'DATA_AVAILABLE'
  | 'PARTIAL_DATA'
  | 'DATA_DELAYED'
  | 'RATE_LIMITED'
  | 'API_ERROR'
  | 'UNSUPPORTED_METRIC'
  | 'NO_DATA_YET';

export interface SocialMetricValue {
  name: string;
  displayName: string;
  value: number | null;
  unit?: string;
  status: AnalyticsStatus;
  statusExplanation?: string;
  lastSyncedAt?: string;
  sourceApi: string;
}

export interface ChannelAnalyticsSnapshot {
  platform: 'youtube' | 'instagram' | 'facebook';
  accountId: string;
  accountHandle: string;
  overallStatus: AnalyticsStatus;
  metrics: {
    followers?: SocialMetricValue;
    views?: SocialMetricValue;
    reach?: SocialMetricValue;
    impressions?: SocialMetricValue;
    engagementRate?: SocialMetricValue;
    publishedVideosCount?: SocialMetricValue;
    likes?: SocialMetricValue;
    comments?: SocialMetricValue;
    shares?: SocialMetricValue;
  };
  syncedAt: string;
  isRealData: boolean;
}

