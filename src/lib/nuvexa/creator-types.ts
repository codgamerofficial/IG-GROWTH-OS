// =============================================================================
// NUVEXA AI — Creator Studio Types & Storyboard Protocol
// Vertical 9:16 Video Creation • Instagram Reels & YouTube Shorts
// =============================================================================

export type VideoPlatform = 'instagram_reels' | 'youtube_shorts' | 'tiktok';
export type VideoDurationOption = 15 | 30 | 60;
export type BrandVoice = 'energetic' | 'authoritative' | 'cinematic' | 'educational' | 'storytelling';

export interface CreatorBrief {
  id: string;
  topic: string;
  niche: string;
  targetAudience: string;
  platform: VideoPlatform;
  durationSeconds: VideoDurationOption;
  brandVoice: BrandVoice;
  goal: string;
  includeSubtitles: boolean;
  backgroundMusic: string;
  callToAction: string;
}

export interface VideoScene {
  sceneNumber: number;
  durationSeconds: number;
  visualPrompt: string;
  onScreenText: string;
  narrationScript: string;
  transition: 'cut' | 'fade' | 'zoom' | 'slide';
  backgroundColor: string;
  gradient: string;
}

export interface GeneratedHook {
  id: string;
  type: 'question' | 'pattern_interrupt' | 'bold_statistic' | 'curiosity_gap';
  hookText: string;
  visualCue: string;
  engagementScoreEstimate: number;
}

export interface CreatorStoryboard {
  id: string;
  brief: CreatorBrief;
  title: string;
  selectedHook: GeneratedHook;
  alternativeHooks: GeneratedHook[];
  scenes: VideoScene[];
  totalDurationSeconds: number;
  caption: string;
  hashtags: string[];
  thumbnailPrompt: string;
  createdAt: string;
  renderedVideoUrl?: string;
  validationStatus: 'draft' | 'validated' | 'rendering' | 'ready' | 'failed';
  validationErrors?: string[];
}
