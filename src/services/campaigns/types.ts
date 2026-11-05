// =============================================================================
// RIIQX — Master AI Campaign Studio Types
// Multi-Platform Campaigns • 9 Objectives • Content Pillars • Creative Briefs
// =============================================================================

export type CampaignObjective =
  | 'product_launch'
  | 'brand_awareness'
  | 'sales_promotion'
  | 'seasonal'
  | 'social_engagement'
  | 'lead_generation'
  | 'product_education'
  | 'influencer'
  | 'festival';

export type CampaignPlatform =
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'tiktok'
  | 'linkedin'
  | 'twitter';

export type CampaignAssetType =
  | 'reel_script'
  | 'shorts_script'
  | 'video_hook'
  | 'carousel_copy'
  | 'ad_copy'
  | 'static_post'
  | 'thought_leadership';

export type AssetApprovalStatus =
  | 'draft'
  | 'approved'
  | 'rejected'
  | 'in_production'
  | 'published';

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  targetEmotion: string;
  recommendedFormats: string[];
}

export interface CampaignAssetItem {
  id: string;
  campaignId: string;
  platform: CampaignPlatform;
  assetType: CampaignAssetType;
  title: string;
  headline?: string;
  hookText?: string;
  contentBody: string;
  visualDirections?: string;
  bRollSuggestions?: string;
  callToAction: string;
  hashtags: string[];
  adCopyVariants?: string[];
  approvalStatus: AssetApprovalStatus;
  mediaUrl?: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignProject {
  id: string;
  userId: string;
  brandProfileId?: string;
  brandName: string;
  name: string;
  objective: CampaignObjective;
  targetPlatforms: CampaignPlatform[];
  durationDays: number;
  language: string;
  tone: string;
  callToAction: string;
  offerDetails?: string;
  userInstructions?: string;
  strategyOverview: string;
  keyPerformanceIndicators: string[];
  contentPillars: ContentPillar[];
  assets: CampaignAssetItem[];
  status: 'draft' | 'active' | 'scheduled' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignInput {
  userId?: string;
  name: string;
  objective: CampaignObjective;
  targetPlatforms: CampaignPlatform[];
  durationDays?: number;
  language?: string;
  tone?: string;
  callToAction: string;
  offerDetails?: string;
  userInstructions?: string;
  productName?: string;
}
