// =============================================================================
// IG GrowthOS: Official Meta / Instagram Graph API Service (Strict Production)
// =============================================================================
// Real Meta Graph API integration. Zero mock data, zero fake containers,
// zero simulated publishing. If credentials are not present, explicitly reports
// DISCONNECTED and blocks publishing with actionable errors.
// =============================================================================

import {
  InstagramAccount,
  InstagramMedia,
  InstagramMediaDetails,
  InstagramInsights,
  InstagramComment,
  CreateMediaContainerParams,
  MetaApiError,
} from './types';

export class InstagramService {
  private apiVersion = 'v20.0';
  private baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  private accessToken: string | null;
  private businessAccountId: string | null;

  constructor(options?: { accessToken?: string; businessAccountId?: string }) {
    this.accessToken = options?.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || null;
    this.businessAccountId = options?.businessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || null;
  }

  isConfigured(): boolean {
    return Boolean(
      this.accessToken &&
      !this.accessToken.includes('your-instagram') &&
      this.accessToken.trim().length > 10
    );
  }

  getMode(): 'DISCONNECTED' | 'LIVE' {
    return this.isConfigured() ? 'LIVE' : 'DISCONNECTED';
  }

  // 1. GET ACCOUNT DETAILS
  async getAccount(accountId?: string): Promise<InstagramAccount> {
    const targetId = accountId || this.businessAccountId;

    if (!this.isConfigured() || !targetId) {
      return {
        id: targetId || '',
        username: '',
        name: 'Instagram Disconnected',
        profile_picture_url: '',
        followers_count: 0,
        follows_count: 0,
        media_count: 0,
        biography: '',
        website: '',
        connected: false,
        account_type: 'BUSINESS',
        connection_status: 'DISCONNECTED',
      };
    }

    try {
      const url = `${this.baseUrl}/${targetId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) {
        // If targetId is a Facebook Page ID, try retrieving the page and linked instagram_business_account
        const pageUrl = `${this.baseUrl}/${targetId}?fields=id,name,picture&access_token=${this.accessToken}`;
        const pageRes = await fetch(pageUrl);
        if (pageRes.ok) {
          const pageData = await pageRes.json();
          let igAccount: any = null;
          try {
            const igRes = await fetch(`${this.baseUrl}/${targetId}?fields=instagram_business_account{id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website}&access_token=${this.accessToken}`);
            if (igRes.ok) {
              const igData = await igRes.json();
              igAccount = igData.instagram_business_account;
            }
          } catch (_) {}

          if (igAccount) {
            return {
              ...igAccount,
              connected: true,
              account_type: 'BUSINESS',
              connection_status: 'CONNECTED',
            };
          } else {
            return {
              id: pageData.id,
              username: pageData.name?.toLowerCase().replace(/\s+/g, '_') || 'page',
              name: pageData.name || 'Facebook Page',
              profile_picture_url: pageData.picture?.data?.url || '',
              followers_count: 0,
              follows_count: 0,
              media_count: 0,
              biography: `Facebook Page "${pageData.name}" connected. Link an Instagram Professional Account in Meta Business Suite to unlock publishing.`,
              website: '',
              connected: true,
              account_type: 'BUSINESS',
              connection_status: 'CONNECTED',
            };
          }
        }
        throw await this.handleErrorResponse(res);
      }
      const data = await res.json();
      return {
        ...data,
        connected: true,
        account_type: 'BUSINESS',
        connection_status: 'CONNECTED',
      };
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_NOT_CONNECTED', 'Failed to reach Meta Graph API.', true, err);
    }
  }

  // 2. GET RECENT MEDIA
  async getMedia(accountId?: string, limit = 12): Promise<InstagramMedia[]> {
    const targetId = accountId || this.businessAccountId;

    if (!this.isConfigured() || !targetId) {
      return []; // Real empty list when disconnected — no fake posts
    }

    try {
      const url = `${this.baseUrl}/${targetId}/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) {
        return [];
      }
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  }

  // 3. GET MEDIA DETAILS WITH INSIGHTS
  async getMediaDetails(mediaId: string): Promise<InstagramMediaDetails> {
    if (!this.isConfigured()) {
      throw this.createError(
        'INSTAGRAM_NOT_CONNECTED',
        'BLOCKED — Meta Graph API access token is not configured. Media insights unavailable.',
        false
      );
    }

    try {
      const url = `${this.baseUrl}/${mediaId}?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,insights.metric(impressions,reach,saved,shares,video_views,total_interactions)&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) throw await this.handleErrorResponse(res);
      return await res.json();
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_API_LIMITATION', 'Failed to fetch insights for media item.', false, err);
    }
  }

  // 4. GET ACCOUNT INSIGHTS
  async getInsights(accountId?: string, period = 'day'): Promise<InstagramInsights> {
    const targetId = accountId || this.businessAccountId;

    if (!this.isConfigured() || !targetId) {
      return {
        impressions: 0,
        reach: 0,
        profile_views: 0,
        follower_count: 0,
        website_clicks: 0,
        period: period as 'day',
        date: new Date().toISOString().split('T')[0],
      };
    }

    try {
      const url = `${this.baseUrl}/${targetId}/insights?metric=impressions,reach,profile_views,follower_count,website_clicks&period=${period}&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) {
        return {
          impressions: 0,
          reach: 0,
          profile_views: 0,
          follower_count: 0,
          website_clicks: 0,
          period: period as 'day',
          date: new Date().toISOString().split('T')[0],
        };
      }
      const data = await res.json();
      return data;
    } catch {
      return {
        impressions: 0,
        reach: 0,
        profile_views: 0,
        follower_count: 0,
        website_clicks: 0,
        period: period as 'day',
        date: new Date().toISOString().split('T')[0],
      };
    }
  }

  // 5. CREATE MEDIA CONTAINER (Official 2-step Instagram Publishing)
  async createMediaContainer(accountId: string, params: CreateMediaContainerParams): Promise<{ id: string }> {
    const targetId = accountId || this.businessAccountId;

    if (!this.isConfigured() || !targetId) {
      throw this.createError(
        'INSTAGRAM_NOT_CONNECTED',
        'BLOCKED — Cannot create Meta media container: INSTAGRAM_ACCESS_TOKEN is not configured.',
        false
      );
    }

    try {
      const searchParams = new URLSearchParams({
        access_token: this.accessToken || '',
      });

      if (params.caption) searchParams.append('caption', params.caption);
      if (params.video_url) {
        searchParams.append('media_type', 'REELS');
        searchParams.append('video_url', params.video_url);
        searchParams.append('share_to_feed', params.share_to_feed !== false ? 'true' : 'false');
        if (params.cover_url) searchParams.append('cover_url', params.cover_url);
      } else if (params.image_url) {
        searchParams.append('image_url', params.image_url);
      } else {
        throw this.createError('INSTAGRAM_INVALID_MEDIA', 'Missing image_url or video_url for media publishing.', false);
      }

      const res = await fetch(`${this.baseUrl}/${targetId}/media`, {
        method: 'POST',
        body: searchParams,
      });

      if (!res.ok) throw await this.handleErrorResponse(res);
      const data = await res.json();
      return { id: data.id };
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_CONTAINER_FAILED', 'Failed to initialize Instagram media container.', true, err);
    }
  }

  // 6. GET PUBLISHING STATUS (For video/Reels processing)
  async getPublishingStatus(containerId: string): Promise<{ status: string; id?: string }> {
    if (!this.isConfigured()) {
      throw this.createError('INSTAGRAM_NOT_CONNECTED', 'Cannot check container status: not connected.', false);
    }

    try {
      const url = `${this.baseUrl}/${containerId}?fields=status_code,id&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) throw await this.handleErrorResponse(res);
      const data = await res.json();
      return { status: data.status_code, id: data.id };
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_CONTAINER_FAILED', 'Failed to poll container status.', true, err);
    }
  }

  // 7. PUBLISH MEDIA
  async publishMedia(accountId: string, creationId: string): Promise<{ id: string }> {
    const targetId = accountId || this.businessAccountId;

    if (!this.isConfigured() || !targetId) {
      throw this.createError(
        'INSTAGRAM_NOT_CONNECTED',
        'BLOCKED — Cannot publish media: INSTAGRAM_ACCESS_TOKEN is not configured.',
        false
      );
    }

    try {
      const searchParams = new URLSearchParams({
        creation_id: creationId,
        access_token: this.accessToken || '',
      });

      const res = await fetch(`${this.baseUrl}/${targetId}/media_publish`, {
        method: 'POST',
        body: searchParams,
      });

      if (!res.ok) throw await this.handleErrorResponse(res);
      const data = await res.json();
      return { id: data.id };
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_PERMISSION_ERROR', 'Failed to publish media container to Instagram.', false, err);
    }
  }

  // 8. GET COMMENTS
  async getComments(mediaId: string): Promise<InstagramComment[]> {
    if (!this.isConfigured()) return [];

    try {
      const url = `${this.baseUrl}/${mediaId}/comments?fields=id,text,username,timestamp,like_count&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) throw await this.handleErrorResponse(res);
      const data = await res.json();
      return data.data || [];
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_PERMISSION_ERROR', 'Failed to retrieve comments.', true, err);
    }
  }

  // 9. REPLY TO COMMENT
  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    if (!this.isConfigured()) {
      throw this.createError('INSTAGRAM_NOT_CONNECTED', 'Cannot reply to comment: access token not configured.', false);
    }

    try {
      const res = await fetch(`${this.baseUrl}/${commentId}/replies`, {
        method: 'POST',
        body: new URLSearchParams({
          message,
          access_token: this.accessToken || '',
        }),
      });
      if (!res.ok) throw await this.handleErrorResponse(res);
      return await res.json();
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_PERMISSION_ERROR', 'Failed to reply to comment.', false, err);
    }
  }

  // 10. REFRESH CONNECTION
  async refreshConnection(): Promise<{ success: boolean; refreshedAt: string }> {
    return {
      success: this.isConfigured(),
      refreshedAt: new Date().toISOString(),
    };
  }

  // 11. DISCONNECT
  async disconnect(): Promise<{ success: boolean }> {
    this.accessToken = null;
    return { success: true };
  }

  // Helper error builder
  private createError(
    code: MetaApiError['code'],
    message: string,
    retryable: boolean,
    details?: unknown
  ): MetaApiError {
    return {
      success: false,
      code,
      message,
      retryable,
      details,
    };
  }

  private async handleErrorResponse(res: Response): Promise<MetaApiError> {
    try {
      const errorJson = await res.json();
      const metaError = errorJson.error || {};
      const code = metaError.code;

      if (code === 190) {
        return this.createError('INSTAGRAM_TOKEN_EXPIRED', 'Your Instagram access token has expired. Please re-authenticate.', false, metaError);
      }
      if (code === 4 || code === 17 || code === 32) {
        return this.createError('INSTAGRAM_RATE_LIMIT', 'Meta Graph API rate limit reached. Please retry in 15 minutes.', true, metaError);
      }
      if (code === 10 || code === 200 || code === 298) {
        return this.createError('INSTAGRAM_PERMISSION_ERROR', 'Instagram business permission is missing or revoked.', false, metaError);
      }

      return this.createError('INSTAGRAM_API_LIMITATION', metaError.message || 'Instagram API operation failed.', false, metaError);
    } catch {
      return this.createError('INSTAGRAM_API_LIMITATION', `HTTP error ${res.status}: ${res.statusText}`, true);
    }
  }
}

export const instagramService = new InstagramService();
