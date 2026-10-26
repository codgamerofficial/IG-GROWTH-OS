// =============================================================================
// NUVEXA AI — Social Media Autopilot Types & 12-State Machine
// Level 3 Full Autopilot • Instagram Reels & YouTube Shorts • Emergency STOP
// =============================================================================

export type AutopilotState =
  | 'queued'
  | 'researching'
  | 'scripting'
  | 'generating_assets'
  | 'rendering'
  | 'quality_check'
  | 'ready_to_publish'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'retrying'
  | 'paused'
  | 'cancelled'
  | 'failed';

export interface AutopilotRule {
  id: string;
  name: string;
  platform: 'instagram_reels' | 'youtube_shorts';
  niche: string;
  permittedTopics: string[];
  excludedTopics: string[];
  postingFrequency: 'daily' | 'twice_daily' | 'weekdays' | 'weekly';
  permittedWindowStart: string; // e.g. "09:00"
  permittedWindowEnd: string;   // e.g. "21:00"
  timeZone: string;
  dailyPostLimit: number;
  qualityThreshold: number; // 0-100 score minimum
  maxRetries: number;
  autoPublishAuthorized: boolean;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutopilotJob {
  id: string;
  ruleId: string;
  ruleName: string;
  platform: 'instagram_reels' | 'youtube_shorts';
  topic: string;
  status: AutopilotState;
  progressPercent: number;
  scheduledFor: string;
  createdAt: string;
  updatedAt: string;
  retryCount: number;
  maxRetries: number;
  logs: string[];
  storyboardId?: string;
  renderedVideoUrl?: string;
  publishedMediaId?: string;
  publishedUrl?: string;
  errorMessage?: string;
}

export interface AutopilotSystemStatus {
  emergencyStopActive: boolean;
  activeJobsCount: number;
  completedTodayCount: number;
  failedTodayCount: number;
  lastExecutedAt?: string;
}
