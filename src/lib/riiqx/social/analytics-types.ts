// =============================================================================
// RIIQX — Master Social Media Analytics & Growth Intelligence Types
// Strict Data Authenticity • 10-State Provenance Taxonomy • Multi-Account Architecture
// =============================================================================

export type AnalyticsDataStatus =
  | 'VERIFIED'
  | 'CACHED'
  | 'PARTIAL'
  | 'DELAYED'
  | 'UNAVAILABLE'
  | 'PERMISSION_MISSING'
  | 'AUTHENTICATION_REQUIRED'
  | 'RATE_LIMITED'
  | 'API_ERROR'
  | 'FORECAST';

export interface ProvenanceMetric {
  name: string;
  displayName: string;
  value: number | null;
  unit?: string;
  status: AnalyticsDataStatus;
  statusExplanation?: string;
  sourceApi: string;
  reportingPeriod: string;
  lastSyncedAt: string;
}

export interface SocialAccountIntelligence {
  id: string;
  platform: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  platformAccountId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  accountType: 'creator' | 'business' | 'personal' | 'channel' | 'page';
  connectionStatus: 'connected' | 'expired' | 'error' | 'revoked' | 'permission_required';
  authorizationStatus: 'valid' | 'refresh_needed' | 'expired';
  grantedScopes: string[];
  missingPermissions: string[];
  lastSyncAt: string;
  nextEligibleSyncAt: string;
  tokenExpiresAt?: string;
  isTokenExpired: boolean;
  historicalDataCoverageDays: number;
  metrics: {
    followers?: ProvenanceMetric;
    subscribers?: ProvenanceMetric;
    totalViews?: ProvenanceMetric;
    publishedContentCount?: ProvenanceMetric;
    totalLikes?: ProvenanceMetric;
    totalComments?: ProvenanceMetric;
    reach?: ProvenanceMetric;
    impressions?: ProvenanceMetric;
    avgEngagementRate?: ProvenanceMetric;
  };
}

export type ContentFormatType =
  | 'reel'
  | 'short'
  | 'video'
  | 'post'
  | 'carousel'
  | 'story';

export interface ContentIntelligenceItem {
  id: string;
  platform: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  accountId: string;
  accountHandle: string;
  contentId: string;
  contentType: ContentFormatType;
  title?: string;
  caption?: string;
  description?: string;
  hashtags: string[];
  publishedAt: string;
  permalink: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  durationSeconds?: number;
  durationFormatted?: string;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  engagementRate: number | null; // e.g., (likes + comments) / views
  sourceProjectId?: string;
  category?: string;
  lastSyncedAt: string;
}

export interface HistoricalMetricSnapshot {
  id: string;
  accountId: string;
  platform: string;
  metricName: string;
  metricValue: number;
  unit?: string;
  timestamp: string;
  reportingPeriod: string;
  sourceApi: string;
  status: AnalyticsDataStatus;
}

export interface MetricComparisonItem {
  metricName: string;
  displayName: string;
  valueA: number | null;
  valueB: number | null;
  unit?: string;
  winnerAccountId?: string;
  differencePct?: number;
  isComparable: boolean;
  notes?: string;
}

export interface CrossAccountComparisonResult {
  accountA: SocialAccountIntelligence;
  accountB: SocialAccountIntelligence;
  comparisonDate: string;
  metrics: MetricComparisonItem[];
  topContentA?: ContentIntelligenceItem;
  topContentB?: ContentIntelligenceItem;
}

export interface AIGrowthRecommendation {
  id: string;
  title: string;
  recommendation: string;
  supportingObservations: string[];
  relevantContentIds: string[];
  relevantContentTitles: string[];
  reportingPeriod: string;
  confidence: 'high' | 'medium' | 'low';
  suggestedNextAction: string;
  category: 'hook_optimization' | 'posting_cadence' | 'content_format' | 'audience_retention';
}

export interface PerformanceForecast {
  targetMetric: string;
  displayName: string;
  forecastValue: number | null;
  confidenceInterval: [number, number] | null;
  method: string;
  assumptions: string[];
  isSufficientData: boolean;
  insufficientDataReason?: string;
  observationPointsCount: number;
  generatedAt: string;
}

export interface FuturePlannedContentItem {
  id: string;
  platform: string;
  targetAccountId: string;
  targetAccountHandle: string;
  plannedPublicationDate: string;
  contentType: ContentFormatType;
  topic: string;
  caption: string;
  hashtags: string[];
  thumbnailUrl?: string;
  status: 'draft' | 'ready_to_publish' | 'scheduled' | 'queued' | 'publishing' | 'published' | 'cancelled' | 'failed';
  sourceProjectId: string;
}

export interface UnifiedAnalyticsResponse {
  accounts: SocialAccountIntelligence[];
  overview: {
    totalAudience: number;
    hasAudienceData: boolean;
    totalViews: number;
    hasViewsData: boolean;
    totalPublishedContent: number;
    totalTrackedInteractions: number;
    activeChannelsCount: number;
    dataFreshness: string;
    strictIntegrityMode: boolean;
  };
  contentHistory: ContentIntelligenceItem[];
  reelsAndShorts: ContentIntelligenceItem[];
  historicalSnapshots: HistoricalMetricSnapshot[];
  futureContent: FuturePlannedContentItem[];
  growthRecommendations: AIGrowthRecommendation[];
  forecasts: PerformanceForecast[];
  comparisons?: CrossAccountComparisonResult[];
  diagnostics: {
    lastGlobalSyncAt: string;
    apiRateLimitStatus: Record<string, string>;
    knownErrors: Array<{ accountId: string; platform: string; error: string; code?: number | string }>;
  };
}

