// =============================================================================
// RIIQX Creator Studio — Real Social Analytics Engine
// Official Meta Graph API v26.0 & YouTube Data API v3 Telemetry
// Strict Zero-Simulation Rule: Explicit Status Enum & Zero Fabricated Numbers
// =============================================================================

import {
  ChannelAnalyticsSnapshot,
  SocialMetricValue,
  AnalyticsStatus,
} from '../types';
import { getAccountWithCredentials } from '@/lib/riiqx/social/account-repository';

/**
 * Fetches genuine real-time metrics for an authorized YouTube Channel
 */
export async function syncYouTubeAnalytics(
  accountId: string,
  userId: string
): Promise<ChannelAnalyticsSnapshot> {
  const creds = await getAccountWithCredentials(accountId, userId);

  if (!creds || !creds.accessToken) {
    return createEmptySnapshot('youtube', accountId, '@unknown', 'AUTHENTICATION_REQUIRED');
  }

  const { account, accessToken } = creds;
  const snapshot: ChannelAnalyticsSnapshot = {
    platform: 'youtube',
    accountId,
    accountHandle: account.account_handle || account.account_name,
    overallStatus: 'DATA_AVAILABLE',
    metrics: {},
    syncedAt: new Date().toISOString(),
    isRealData: true,
  };

  try {
    // 1. Query Official YouTube Data API v3 Channel Statistics
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.items || data.items.length === 0) {
      if (res.status === 401 || res.status === 403) {
        snapshot.overallStatus = 'AUTHENTICATION_REQUIRED';
      } else {
        snapshot.overallStatus = 'API_ERROR';
      }
      return snapshot;
    }

    const item = data.items[0];
    const stats = item.statistics || {};

    snapshot.accountHandle = item.snippet?.customUrl || `@${item.snippet?.title}`;

    // Real Subscriber Count
    snapshot.metrics.followers = {
      name: 'subscribers',
      displayName: 'Subscribers',
      value: stats.subscriberCount !== undefined ? parseInt(stats.subscriberCount, 10) : null,
      status: stats.subscriberCount !== undefined ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
      sourceApi: 'YouTube Data API v3 /channels (statistics.subscriberCount)',
      lastSyncedAt: new Date().toISOString(),
    };

    // Real Total Lifetime Views
    snapshot.metrics.views = {
      name: 'views',
      displayName: 'Total Channel Views',
      value: stats.viewCount !== undefined ? parseInt(stats.viewCount, 10) : null,
      status: stats.viewCount !== undefined ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
      sourceApi: 'YouTube Data API v3 /channels (statistics.viewCount)',
      lastSyncedAt: new Date().toISOString(),
    };

    // Real Published Videos Count
    snapshot.metrics.publishedVideosCount = {
      name: 'video_count',
      displayName: 'Published Videos',
      value: stats.videoCount !== undefined ? parseInt(stats.videoCount, 10) : null,
      status: stats.videoCount !== undefined ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
      sourceApi: 'YouTube Data API v3 /channels (statistics.videoCount)',
      lastSyncedAt: new Date().toISOString(),
    };

    // Note: YouTube Analytics API (watch time / retention curves) requires separate YouTube Analytics API quota
    snapshot.metrics.reach = {
      name: 'reach',
      displayName: 'Unique Viewers / Reach',
      value: null,
      status: 'PERMISSION_MISSING',
      statusExplanation: 'YouTube Analytics API reports require yt-analytics.readonly scope and channel eligibility.',
      sourceApi: 'YouTube Analytics API',
    };

    return snapshot;
  } catch (err: unknown) {
    snapshot.overallStatus = 'API_ERROR';
    return snapshot;
  }
}

/**
 * Fetches genuine real-time metrics for an authorized Instagram Professional account
 */
export async function syncInstagramAnalytics(
  accountId: string,
  userId: string
): Promise<ChannelAnalyticsSnapshot> {
  const creds = await getAccountWithCredentials(accountId, userId);

  if (!creds || !creds.accessToken) {
    return createEmptySnapshot('instagram', accountId, '@unknown', 'AUTHENTICATION_REQUIRED');
  }

  const { account, accessToken } = creds;
  const platformId = account.platform_account_id;

  const snapshot: ChannelAnalyticsSnapshot = {
    platform: 'instagram',
    accountId,
    accountHandle: account.account_handle || account.account_name,
    overallStatus: 'DATA_AVAILABLE',
    metrics: {},
    syncedAt: new Date().toISOString(),
    isRealData: true,
  };

  try {
    // 1. Query Official Meta Graph API v26.0 for Instagram Profile Statistics
    const profileRes = await fetch(
      `https://graph.facebook.com/v26.0/${platformId}?fields=username,name,followers_count,media_count&access_token=${accessToken}`
    );

    const profileData = await profileRes.json();

    if (!profileRes.ok || profileData.error) {
      if (profileData.error?.code === 190) {
        snapshot.overallStatus = 'AUTHENTICATION_REQUIRED';
      } else {
        snapshot.overallStatus = 'API_ERROR';
      }
      return snapshot;
    }

    if (profileData.username) {
      snapshot.accountHandle = `@${profileData.username}`;
    }

    // Real Followers Count
    snapshot.metrics.followers = {
      name: 'followers',
      displayName: 'Followers',
      value: profileData.followers_count !== undefined ? profileData.followers_count : null,
      status: profileData.followers_count !== undefined ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
      sourceApi: 'Meta Graph API v26.0 /{ig-user-id} (followers_count)',
      lastSyncedAt: new Date().toISOString(),
    };

    // Real Media Count
    snapshot.metrics.publishedVideosCount = {
      name: 'media_count',
      displayName: 'Published Media Posts',
      value: profileData.media_count !== undefined ? profileData.media_count : null,
      status: profileData.media_count !== undefined ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
      sourceApi: 'Meta Graph API v26.0 /{ig-user-id} (media_count)',
      lastSyncedAt: new Date().toISOString(),
    };

    // 2. Query /insights for Reach & Impressions (Requires approved instagram_manage_insights permission)
    try {
      const insightsRes = await fetch(
        `https://graph.facebook.com/v26.0/${platformId}/insights?metric=reach,impressions&period=days_28&access_token=${accessToken}`
      );
      const insightsData = await insightsRes.json();

      if (insightsRes.ok && Array.isArray(insightsData.data)) {
        for (const item of insightsData.data) {
          if (item.name === 'reach') {
            const val = item.values?.[0]?.value ?? null;
            snapshot.metrics.reach = {
              name: 'reach',
              displayName: 'Account Reach (28 Days)',
              value: val,
              status: val !== null ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
              sourceApi: 'Meta Graph API v26.0 /{ig-user-id}/insights (reach)',
              lastSyncedAt: new Date().toISOString(),
            };
          } else if (item.name === 'impressions') {
            const val = item.values?.[0]?.value ?? null;
            snapshot.metrics.impressions = {
              name: 'impressions',
              displayName: 'Total Impressions (28 Days)',
              value: val,
              status: val !== null ? 'DATA_AVAILABLE' : 'NO_DATA_YET',
              sourceApi: 'Meta Graph API v26.0 /{ig-user-id}/insights (impressions)',
              lastSyncedAt: new Date().toISOString(),
            };
          }
        }
      } else {
        // Explicitly report permission required instead of substituting fake reach numbers
        snapshot.metrics.reach = {
          name: 'reach',
          displayName: 'Account Reach',
          value: null,
          status: 'PERMISSION_MISSING',
          statusExplanation:
            insightsData.error?.message ||
            'Instagram Insights metrics require Meta App Review approval for instagram_manage_insights.',
          sourceApi: 'Meta Graph API v26.0 /{ig-user-id}/insights',
        };
      }
    } catch {
      snapshot.metrics.reach = {
        name: 'reach',
        displayName: 'Account Reach',
        value: null,
        status: 'UNSUPPORTED_METRIC',
        statusExplanation: 'Network limitation during insights request.',
        sourceApi: 'Meta Graph API v26.0',
      };
    }

    return snapshot;
  } catch (err: unknown) {
    snapshot.overallStatus = 'API_ERROR';
    return snapshot;
  }
}

function createEmptySnapshot(
  platform: 'youtube' | 'instagram' | 'facebook',
  accountId: string,
  handle: string,
  status: AnalyticsStatus
): ChannelAnalyticsSnapshot {
  return {
    platform,
    accountId,
    accountHandle: handle,
    overallStatus: status,
    metrics: {},
    syncedAt: new Date().toISOString(),
    isRealData: true,
  };
}

