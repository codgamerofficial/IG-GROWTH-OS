// =============================================================================
// IG GrowthOS: Supabase Database TypeScript Definitions
// =============================================================================

export type ContentType =
  | 'Reel'
  | 'Carousel'
  | 'Single Image'
  | 'Stories'
  | 'Product Posts'
  | 'UGC'
  | 'Educational'
  | 'Promotional'
  | 'Affiliate'
  | 'Trend-based'
  | 'Behind-the-scenes';

export type ContentStatus =
  | 'DRAFT'
  | 'READY'
  | 'PENDING'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'FAILED';

export type ApprovalStatus =
  | 'DRAFT'
  | 'READY'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

export type JobType =
  | 'daily_trend_research'
  | 'daily_content_ideas'
  | 'daily_content_generation'
  | 'scheduled_publishing'
  | 'daily_analytics'
  | 'weekly_analytics_report'
  | 'weekly_content_strategy'
  | 'monthly_growth_report'
  | 'daily_workflow';

export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AIScoreBreakdown {
  hook_strength: number;       // 20%
  audience_relevance: number;  // 20%
  trend_relevance: number;     // 15%
  shareability: number;        // 15%
  save_potential: number;      // 10%
  conversion_potential: number;// 10%
  brand_fit: number;           // 10%
}

export interface ScriptSection {
  hook?: string;           // 0–3s
  problem?: string;        // 3–8s
  story?: string;          // 8–20s
  payoff?: string;         // 20–30s
  cta?: string;            // final seconds
  voiceover?: string;
  shot_list?: string[];
  b_roll?: string[];
  on_screen_text?: string[];
  production_notes?: string;
  [key: string]: unknown;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  instagram_account_id: string | null;
  instagram_username: string | null;
  target_audience: string | null;
  brand_voice: string | null;
  content_language: string;
  timezone: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentPillar {
  id: string;
  brand_id: string;
  name: string;
  description: string | null;
  percentage: number;
  active: boolean;
  created_at: string;
}

export interface ContentItem {
  id: string;
  brand_id: string;
  title: string;
  content_type: ContentType;
  content_pillar: string | null;
  hook: string | null;
  script: ScriptSection | null;
  caption: string | null;
  hashtags: string[];
  cta: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  cover_text: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  instagram_media_id: string | null;
  status: ContentStatus;
  approval_status: ApprovalStatus;
  ai_score: number;
  ai_score_breakdown: AIScoreBreakdown | null;
  created_at: string;
  updated_at: string;
}

export interface ContentVariant {
  id: string;
  content_id: string;
  variant_type: 'hook' | 'caption' | 'hashtags' | 'cta' | 'script';
  content: string;
  score: number;
  created_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  product_url: string | null;
  image_url: string | null;
  affiliate_url: string | null;
  commission: number | null;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trend {
  id: string;
  topic: string;
  source: string;
  source_url: string | null;
  trend_score: number;
  relevance_score: number;
  content_angle: string | null;
  discovered_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface AnalyticsRecord {
  id: string;
  brand_id: string;
  content_id: string | null;
  instagram_media_id: string | null;
  date: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  video_views: number;
  profile_visits: number;
  followers_gained: number;
  engagement_rate: number;
  created_at: string;
}

export interface Approval {
  id: string;
  content_id: string;
  status: ApprovalStatus;
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface AutomationJob {
  id: string;
  brand_id: string;
  job_type: JobType;
  status: JobStatus;
  payload: Record<string, unknown>;
  result: Record<string, unknown>;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
