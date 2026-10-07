// =============================================================================
// IG GrowthOS: Official Meta / Instagram Graph API Types
// =============================================================================

export interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  biography: string;
  website?: string;
  connected: boolean;
  account_type: 'BUSINESS' | 'CREATOR' | 'PERSONAL';
  connection_status: 'CONNECTED' | 'DISCONNECTED' | 'TOKEN_EXPIRED' | 'MOCK_SIMULATED';
}

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_product_type: 'REELS' | 'FEED' | 'STORY';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export interface InstagramMediaDetails extends InstagramMedia {
  insights?: {
    impressions: number;
    reach: number;
    saved: number;
    shares: number;
    video_views?: number;
    total_interactions: number;
  };
}

export interface InstagramInsights {
  impressions: number;
  reach: number;
  profile_views: number;
  follower_count: number;
  website_clicks: number;
  period: 'day' | 'week' | 'days_28';
  date: string;
}

export interface InstagramComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count: number;
  replies?: InstagramComment[];
}

export interface CreateMediaContainerParams {
  caption?: string;
  image_url?: string;
  video_url?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'REELS' | 'STORIES';
  share_to_feed?: boolean;
  cover_url?: string;
  thumb_offset?: number;
}

export interface MetaApiError {
  success: false;
  code:
    | 'INSTAGRAM_NOT_CONNECTED'
    | 'INSTAGRAM_PERMISSION_ERROR'
    | 'INSTAGRAM_RATE_LIMIT'
    | 'INSTAGRAM_INVALID_MEDIA'
    | 'INSTAGRAM_CONTAINER_FAILED'
    | 'INSTAGRAM_API_LIMITATION'
    | 'INSTAGRAM_TOKEN_EXPIRED';
  message: string;
  retryable: boolean;
  details?: unknown;
}
