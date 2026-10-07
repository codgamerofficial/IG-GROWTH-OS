// =============================================================================
// IG GrowthOS: Official Meta / Instagram Graph API Service
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
  private isMock: boolean;

  constructor(options?: { accessToken?: string; businessAccountId?: string }) {
    this.accessToken = options?.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || null;
    this.businessAccountId = options?.businessAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841405309281745';
    this.isMock = process.env.MOCK_MODE === 'true' || !this.accessToken || this.accessToken.includes('your-instagram');
  }

  getMode(): 'MOCK' | 'LIVE' {
    return this.isMock ? 'MOCK' : 'LIVE';
  }

  // 1. GET ACCOUNT DETAILS
  async getAccount(accountId?: string): Promise<InstagramAccount> {
    const targetId = accountId || this.businessAccountId || '17841405309281745';

    if (this.isMock) {
      return {
        id: targetId,
        username: 'riiqx.official',
        name: 'RIIQX | Modern Vanguard',
        profile_picture_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        followers_count: 48920,
        follows_count: 312,
        media_count: 84,
        biography: 'Avant-garde streetwear & modern uniform architecture. Heavyweight fleece, tactical tailoring. Worldwide delivery.',
        website: 'https://riiqx.com',
        connected: true,
        account_type: 'BUSINESS',
        connection_status: 'MOCK_SIMULATED',
      };
    }

    try {
      const url = `${this.baseUrl}/${targetId}?fields=id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) {
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
    const targetId = accountId || this.businessAccountId || '17841405309281745';

    if (this.isMock) {
      return [
        {
          id: '17983419082347101',
          caption: 'The anatomy of a hoodie that actually holds its boxy structure forever. 460 GSM combed French terry. #riiqx #streetwearfits',
          media_type: 'VIDEO',
          media_product_type: 'REELS',
          media_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
          permalink: 'https://instagram.com/p/riiqx_hoodie_reel',
          timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
          like_count: 3510,
          comments_count: 275,
        },
        {
          id: '17983419082347102',
          caption: 'Tactical Wide-Leg Pleats. Structured Cordura waistband cinch. Now available. #cargopants #riiqx',
          media_type: 'IMAGE',
          media_product_type: 'FEED',
          media_url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
          permalink: 'https://instagram.com/p/riiqx_cargos',
          timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
          like_count: 2240,
          comments_count: 162,
        },
        {
          id: '17983419082347103',
          caption: 'Raw Hem Selvedge Denim in charcoal wash. Made to wear hard. #rawdenim #japanesedenim',
          media_type: 'IMAGE',
          media_product_type: 'FEED',
          media_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
          permalink: 'https://instagram.com/p/riiqx_denim',
          timestamp: new Date(Date.now() - 9 * 86400000).toISOString(),
          like_count: 1890,
          comments_count: 134,
        },
      ];
    }

    try {
      const url = `${this.baseUrl}/${targetId}/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) throw await this.handleErrorResponse(res);
      const data = await res.json();
      return data.data || [];
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_PERMISSION_ERROR', 'Unable to fetch Instagram media.', true, err);
    }
  }

  // 3. GET MEDIA DETAILS WITH INSIGHTS
  async getMediaDetails(mediaId: string): Promise<InstagramMediaDetails> {
    if (this.isMock) {
      return {
        id: mediaId,
        caption: 'The anatomy of a hoodie that actually holds its boxy structure forever.',
        media_type: 'VIDEO',
        media_product_type: 'REELS',
        media_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        permalink: 'https://instagram.com/p/riiqx_sample',
        timestamp: new Date().toISOString(),
        like_count: 3510,
        comments_count: 275,
        insights: {
          impressions: 51300,
          reach: 40100,
          saved: 1460,
          shares: 930,
          video_views: 38000,
          total_interactions: 6175,
        },
      };
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
    const targetId = accountId || this.businessAccountId || '17841405309281745';

    if (this.isMock) {
      return {
        impressions: 51300,
        reach: 40100,
        profile_views: 1080,
        follower_count: 48920,
        website_clicks: 412,
        period: period as 'day',
        date: new Date().toISOString().split('T')[0],
      };
    }

    try {
      const url = `${this.baseUrl}/${targetId}/insights?metric=impressions,reach,profile_views,follower_count,website_clicks&period=${period}&access_token=${this.accessToken}`;
      const res = await fetch(url);
      if (!res.ok) throw await this.handleErrorResponse(res);
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      if ((err as MetaApiError).code) throw err;
      throw this.createError('INSTAGRAM_PERMISSION_ERROR', 'Insights permission is not granted by user token.', false, err);
    }
  }

  // 5. CREATE MEDIA CONTAINER (Official 2-step Instagram Publishing)
  async createMediaContainer(accountId: string, params: CreateMediaContainerParams): Promise<{ id: string }> {
    const targetId = accountId || this.businessAccountId || '17841405309281745';

    if (this.isMock) {
      const mockContainerId = `mock_container_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return { id: mockContainerId };
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
    if (this.isMock) {
      return { status: 'FINISHED', id: containerId };
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
    const targetId = accountId || this.businessAccountId || '17841405309281745';

    if (this.isMock) {
      const mockPublishedMediaId = `1799${Date.now().toString().slice(-8)}`;
      return { id: mockPublishedMediaId };
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
    if (this.isMock) {
      return [
        { id: 'c1', text: 'Where can I get the oversized hoodie? Link??', username: 'stylevanguard', timestamp: new Date(Date.now() - 3600000).toISOString(), like_count: 14 },
        { id: 'c2', text: '460 GSM is crazy heavy. Appreciate the real cotton.', username: 'drapemaster', timestamp: new Date(Date.now() - 7200000).toISOString(), like_count: 8 },
        { id: 'c3', text: 'Need the cargos in black ASAP please restock', username: 'kicks_and_fits', timestamp: new Date(Date.now() - 14400000).toISOString(), like_count: 5 },
      ];
    }

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
    if (this.isMock) {
      return { id: `mock_reply_${Date.now()}` };
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
      success: true,
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
