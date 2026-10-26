// =============================================================================
// RIIQX — Social Media Autopilot Data Models & Level 3 Autonomy Types
// 12-State Machine • Emergency STOP • Bounded Rules & Spending Envelopes
// =============================================================================

export type AutopilotJobStatus =
  | 'queued'
  | 'researching'
  | 'scripting'
  | 'storyboarding'
  | 'voice_generating'
  | 'rendering'
  | 'quality_check'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'halted';

export interface AutopilotRule {
  id: string;
  name: string;
  platform: 'instagram_reels' | 'youtube_shorts' | 'both';
  niche: string;
  targetAudience: string;
  language: 'en' | 'bn' | 'hi';
  frequencyPerWeek: number;
  maxDailyPosts: number;
  timeZone: string;
  allowedPublishHours: number[]; // e.g., [9, 14, 19] (IST)
  requireHumanApproval: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AutopilotJob {
  id: string;
  ruleId: string;
  ruleName: string;
  platform: 'instagram_reels' | 'youtube_shorts';
  topic: string;
  status: AutopilotJobStatus;
  progressPercent: number; // 0 - 100
  scheduledFor: string;
  publishedUrl?: string;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  logs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AutopilotSystemStatus {
  isEmergencyStopped: boolean;
  activeRulesCount: number;
  queuedJobsCount: number;
  inProgressJobsCount: number;
  publishedTodayCount: number;
  lastHaltedAt?: string;
  timeZone: string;
}
