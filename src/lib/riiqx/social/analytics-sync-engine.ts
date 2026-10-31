// =============================================================================
// RIIQX — Master Social Media Analytics & Synchronization Engine
// Official YouTube Data API v3 & Meta Graph API v26.0 Telemetry
// Auto-Token Refresh • Content History Ingestion • Strict Data Authenticity
// =============================================================================

import {
  getConnectedAccounts,
  getAccountWithCredentials,
  saveConnectedAccount,
} from '@/lib/riiqx/social/account-repository';
import { refreshYouTubeAccessToken } from '@/lib/riiqx/social/oauth-engine';
import {
  SocialAccountIntelligence,
  ContentIntelligenceItem,
  UnifiedAnalyticsResponse,
  ProvenanceMetric,
} from './analytics-types';
import {
  saveMetricSnapshot,
  saveContentIntelligenceItems,
  getContentIntelligenceHistory,
  getHistoricalSnapshots,
} from './analytics-repository';
import { generateGrowthRecommendations, generatePerformanceForecasts } from './growth-intelligence';

/**
 * Synchronizes an individual YouTube account with automatic token refresh
 */
export async function syncYouTubeAccountAnalytics(
  accountId: string,
  userId: string
): Promise<{ account: SocialAccountIntelligence; contentItems: ContentIntelligenceItem[] }> {
  const creds = await getAccountWithCredentials(accountId, userId);

  if (!creds || !creds.accessToken) {
    return {
      account: createUnauthenticatedAccount('youtube', accountId, '@unknown'),
      contentItems: [],
    };
  }

  let accessToken = creds.accessToken;
  const { account, refreshToken } = creds;
  let isTokenExpired = false;

  // Check if token is expired or expiring within 60 seconds
  if (account.token_expires_at) {
    const expiresAt = new Date(account.token_expires_at).getTime();
    if (Date.now() >= expiresAt - 60000) {
      isTokenExpired = true;
    }
  }

  // Attempt automatic refresh if expired and refresh token exists
  if (isTokenExpired && refreshToken) {
    try {
      const refreshed = await refreshYouTubeAccessToken(refreshToken);
      accessToken = refreshed.accessToken;
      const newExpiresAt = new Date(Date.now() + refreshed.expiresIn * 1000).toISOString();

      await saveConnectedAccount({
        userId: account.user_id,
        provider: 'youtube',
        platformAccountId: account.platform_account_id,
        accountName: account.account_name,
        accountHandle: account.account_handle,
        avatarUrl: account.avatar_url,
        scopes: account.scopes,
        accessToken: refreshed.accessToken,
        refreshToken,
        tokenExpiresAt: newExpiresAt,
        status: 'connected',
      });
      isTokenExpired = false;
    } catch (refreshErr) {
      console.warn('[syncYouTubeAccountAnalytics] Refresh token attempt failed:', refreshErr);
    }
  }

  const now = new Date().toISOString();
  const intel: SocialAccountIntelligence = {
    id: accountId,
    platform: 'youtube',
    platformAccountId: account.platform_account_id,
    username: (account.account_handle || account.account_name).replace(/^@/, ''),
    displayName: account.account_name,
    avatarUrl: account.avatar_url,
    accountType: 'channel',
    connectionStatus: isTokenExpired ? 'expired' : 'connected',
    authorizationStatus: isTokenExpired ? 'refresh_needed' : 'valid',
    grantedScopes: account.scopes,
    missingPermissions: ['https://www.googleapis.com/auth/yt-analytics.readonly'],
    lastSyncAt: now,
    nextEligibleSyncAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    tokenExpiresAt: account.token_expires_at,
    isTokenExpired,
    historicalDataCoverageDays: 90,
    metrics: {},
  };

  const contentItems: ContentIntelligenceItem[] = [];

  try {
    // 1. Fetch channel snippet, statistics, and uploads playlist
    const chRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    const chData = await chRes.json();

    if (!chRes.ok || !chData.items || chData.items.length === 0) {
      if (chRes.status === 401 || chRes.status === 403) {
        intel.connectionStatus = 'expired';
        intel.authorizationStatus = 'refresh_needed';
      }
      return { account: intel, contentItems: [] };
    }

    const channelItem = chData.items[0];
    const stats = channelItem.statistics || {};
    const snippet = channelItem.snippet || {};

    if (snippet.title) intel.displayName = snippet.title;
    if (snippet.customUrl) intel.username = snippet.customUrl.replace(/^@/, '');
    if (snippet.thumbnails?.medium?.url) intel.avatarUrl = snippet.thumbnails.medium.url;

    const subCount = stats.subscriberCount !== undefined ? parseInt(stats.subscriberCount, 10) : null;
    const viewCount = stats.viewCount !== undefined ? parseInt(stats.viewCount, 10) : null;
    const videoCount = stats.videoCount !== undefined ? parseInt(stats.videoCount, 10) : null;

    intel.metrics.subscribers = {
      name: 'subscribers',
      displayName: 'Subscribers',
      value: subCount,
      status: subCount !== null ? 'VERIFIED' : 'UNAVAILABLE',
      sourceApi: 'YouTube Data API v3 /channels (statistics.subscriberCount)',
      reportingPeriod: 'lifetime',
      lastSyncedAt: now,
    };

    intel.metrics.totalViews = {
      name: 'total_views',
      displayName: 'Channel Total Views',
      value: viewCount,
      status: viewCount !== null ? 'VERIFIED' : 'UNAVAILABLE',
      sourceApi: 'YouTube Data API v3 /channels (statistics.viewCount)',
      reportingPeriod: 'lifetime',
      lastSyncedAt: now,
    };

    intel.metrics.publishedContentCount = {
      name: 'video_count',
      displayName: 'Published Videos',
      value: videoCount,
      status: videoCount !== null ? 'VERIFIED' : 'UNAVAILABLE',
      sourceApi: 'YouTube Data API v3 /channels (statistics.videoCount)',
      reportingPeriod: 'lifetime',
      lastSyncedAt: now,
    };

    intel.metrics.reach = {
      name: 'reach',
      displayName: 'Unique Viewers / Reach',
      value: null,
      status: 'PERMISSION_MISSING',
      statusExplanation: 'YouTube Analytics API reports require yt-analytics.readonly scope and channel partner eligibility.',
      sourceApi: 'YouTube Analytics API',
      reportingPeriod: '28d',
      lastSyncedAt: now,
    };

    // Save historical snapshots
    if (subCount !== null) {
      await saveMetricSnapshot({
        accountId,
        platform: 'youtube',
        metricName: 'subscribers',
        metricValue: subCount,
        reportingPeriod: 'lifetime',
        sourceApi: 'YouTube Data API v3',
        status: 'VERIFIED',
        timestamp: now,
      });
    }

    if (viewCount !== null) {
      await saveMetricSnapshot({
        accountId,
        platform: 'youtube',
        metricName: 'total_views',
        metricValue: viewCount,
        reportingPeriod: 'lifetime',
        sourceApi: 'YouTube Data API v3',
        status: 'VERIFIED',
        timestamp: now,
      });
    }

    // 2. Ingest recent videos via Uploads Playlist
    const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
    if (uploadsPlaylistId) {
      const plRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=15`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const plData = await plRes.json();

      if (plRes.ok && Array.isArray(plData.items)) {
        const videoIds = plData.items.map((i: any) => i.contentDetails?.videoId).filter(Boolean).join(',');

        let statsMap: Record<string, { views: number; likes: number; comments: number; duration: string }> = {};
        if (videoIds) {
          const vRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const vData = await vRes.json();
          if (vRes.ok && Array.isArray(vData.items)) {
            for (const v of vData.items) {
              statsMap[v.id] = {
                views: parseInt(v.statistics?.viewCount || '0', 10),
                likes: parseInt(v.statistics?.likeCount || '0', 10),
                comments: parseInt(v.statistics?.commentCount || '0', 10),
                duration: v.contentDetails?.duration || '',
              };
            }
          }
        }

        let totalLikesSum = 0;
        let totalCommentsSum = 0;

        for (const item of plData.items) {
          const vidId = item.contentDetails?.videoId;
          if (!vidId) continue;
          const vidStats = statsMap[vidId];
          const durSec = parseISO8601Duration(vidStats?.duration || '');
          const isShort = durSec > 0 && durSec <= 60;

          if (vidStats) {
            totalLikesSum += vidStats.likes;
            totalCommentsSum += vidStats.comments;
          }

          contentItems.push({
            id: `yt_${vidId}`,
            platform: 'youtube',
            accountId,
            accountHandle: `@${intel.username}`,
            contentId: vidId,
            contentType: isShort ? 'short' : 'video',
            title: item.snippet?.title || 'Untitled Video',
            description: item.snippet?.description || '',
            hashtags: extractHashtags(item.snippet?.description || ''),
            publishedAt: item.snippet?.publishedAt || now,
            permalink: `https://www.youtube.com/watch?v=${vidId}`,
            thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
            durationSeconds: durSec,
            durationFormatted: formatSeconds(durSec),
            views: vidStats?.views ?? null,
            likes: vidStats?.likes ?? null,
            comments: vidStats?.comments ?? null,
            shares: null,
            saves: null,
            engagementRate:
              vidStats && vidStats.views > 0
                ? Number((((vidStats.likes + vidStats.comments) / vidStats.views) * 100).toFixed(2))
                : null,
            lastSyncedAt: now,
          });
        }

        intel.metrics.totalLikes = {
          name: 'total_likes',
          displayName: 'Total Video Likes',
          value: totalLikesSum,
          status: 'VERIFIED',
          sourceApi: 'YouTube Data API v3 /videos',
          reportingPeriod: 'recent_uploads',
          lastSyncedAt: now,
        };

        intel.metrics.totalComments = {
          name: 'total_comments',
          displayName: 'Total Comments',
          value: totalCommentsSum,
          status: 'VERIFIED',
          sourceApi: 'YouTube Data API v3 /videos',
          reportingPeriod: 'recent_uploads',
          lastSyncedAt: now,
        };
      }
    }

    return { account: intel, contentItems };
  } catch (err) {
    console.error('[syncYouTubeAccountAnalytics] Sync error:', err);
    return { account: intel, contentItems: [] };
  }
}

/**
 * Synchronizes an individual Instagram account
 */
export async function syncInstagramAccountAnalytics(
  accountId: string,
  userId: string
): Promise<{ account: SocialAccountIntelligence; contentItems: ContentIntelligenceItem[] }> {
  const creds = await getAccountWithCredentials(accountId, userId);

  if (!creds || !creds.accessToken) {
    return {
      account: createUnauthenticatedAccount('instagram', accountId, '@unknown'),
      contentItems: [],
    };
  }

  const { account, accessToken } = creds;
  const platformId = account.platform_account_id;
  const now = new Date().toISOString();

  const intel: SocialAccountIntelligence = {
    id: accountId,
    platform: 'instagram',
    platformAccountId: platformId,
    username: (account.account_handle || account.account_name).replace(/^@/, ''),
    displayName: account.account_name,
    avatarUrl: account.avatar_url,
    accountType: 'creator',
    connectionStatus: 'connected',
    authorizationStatus: 'valid',
    grantedScopes: account.scopes,
    missingPermissions: ['instagram_manage_insights'],
    lastSyncAt: now,
    nextEligibleSyncAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    tokenExpiresAt: account.token_expires_at,
    isTokenExpired: false,
    historicalDataCoverageDays: 60,
    metrics: {},
  };

  const contentItems: ContentIntelligenceItem[] = [];

  try {
    // 1. Fetch Profile info (followers_count, media_count)
    const profRes = await fetch(
      `https://graph.facebook.com/v26.0/${platformId}?fields=id,username,name,followers_count,media_count,profile_picture_url&access_token=${accessToken}`
    );
    const profData = await profRes.json();

    if (!profRes.ok || profData.error) {
      if (profData.error?.code === 190) {
        intel.connectionStatus = 'expired';
        intel.authorizationStatus = 'refresh_needed';
      }
      return { account: intel, contentItems: [] };
    }

    if (profData.username) intel.username = profData.username;
    if (profData.name) intel.displayName = profData.name;
    if (profData.profile_picture_url) intel.avatarUrl = profData.profile_picture_url;

    const followers = profData.followers_count !== undefined ? profData.followers_count : null;
    const mediaCount = profData.media_count !== undefined ? profData.media_count : null;

    intel.metrics.followers = {
      name: 'followers',
      displayName: 'Followers',
      value: followers,
      status: followers !== null ? 'VERIFIED' : 'UNAVAILABLE',
      sourceApi: 'Meta Graph API v26.0 /{ig-user-id} (followers_count)',
      reportingPeriod: 'lifetime',
      lastSyncedAt: now,
    };

    intel.metrics.publishedContentCount = {
      name: 'media_count',
      displayName: 'Published Media Posts',
      value: mediaCount,
      status: mediaCount !== null ? 'VERIFIED' : 'UNAVAILABLE',
      sourceApi: 'Meta Graph API v26.0 /{ig-user-id} (media_count)',
      reportingPeriod: 'lifetime',
      lastSyncedAt: now,
    };

    intel.metrics.reach = {
      name: 'reach',
      displayName: 'Account Reach (28 Days)',
      value: null,
      status: 'PERMISSION_MISSING',
      statusExplanation: 'Instagram Insights requires Meta App Review approval for instagram_manage_insights.',
      sourceApi: 'Meta Graph API v26.0 /{ig-user-id}/insights',
      reportingPeriod: '28d',
      lastSyncedAt: now,
    };

    intel.metrics.impressions = {
      name: 'impressions',
      displayName: 'Total Impressions',
      value: null,
      status: 'PERMISSION_MISSING',
      statusExplanation: 'Instagram Insights requires Meta App Review approval for instagram_manage_insights.',
      sourceApi: 'Meta Graph API v26.0 /{ig-user-id}/insights',
      reportingPeriod: '28d',
      lastSyncedAt: now,
    };

    if (followers !== null) {
      await saveMetricSnapshot({
        accountId,
        platform: 'instagram',
        metricName: 'followers',
        metricValue: followers,
        reportingPeriod: 'lifetime',
        sourceApi: 'Meta Graph API v26.0',
        status: 'VERIFIED',
        timestamp: now,
      });
    }

    // 2. Ingest real media items (Reels, Posts)
    const mediaRes = await fetch(
      `https://graph.facebook.com/v26.0/${platformId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&limit=25&access_token=${accessToken}`
    );
    const mediaData = await mediaRes.json();

    if (mediaRes.ok && Array.isArray(mediaData.data)) {
      let totalLikesSum = 0;
      let totalCommentsSum = 0;

      for (const m of mediaData.data) {
        const likes = typeof m.like_count === 'number' ? m.like_count : 0;
        const comments = typeof m.comments_count === 'number' ? m.comments_count : 0;
        totalLikesSum += likes;
        totalCommentsSum += comments;

        let contentType: ContentIntelligenceItem['contentType'] = 'post';
        if (m.media_type === 'VIDEO') contentType = 'reel';
        else if (m.media_type === 'CAROUSEL_ALBUM') contentType = 'carousel';

        contentItems.push({
          id: `ig_${m.id}`,
          platform: 'instagram',
          accountId,
          accountHandle: `@${intel.username}`,
          contentId: m.id,
          contentType,
          caption: m.caption || '',
          hashtags: extractHashtags(m.caption || ''),
          publishedAt: m.timestamp || now,
          permalink: m.permalink || '',
          thumbnailUrl: m.thumbnail_url || m.media_url,
          mediaUrl: m.media_url,
          views: null, // View count on personal reels without insights permission
          likes,
          comments,
          shares: null,
          saves: null,
          engagementRate:
            followers && followers > 0 ? Number((((likes + comments) / followers) * 100).toFixed(2)) : null,
          lastSyncedAt: now,
        });
      }

      intel.metrics.totalLikes = {
        name: 'total_likes',
        displayName: 'Total Post Likes',
        value: totalLikesSum,
        status: 'VERIFIED',
        sourceApi: 'Meta Graph API v26.0 /media (like_count)',
        reportingPeriod: 'recent_media',
        lastSyncedAt: now,
      };

      intel.metrics.totalComments = {
        name: 'total_comments',
        displayName: 'Total Comments',
        value: totalCommentsSum,
        status: 'VERIFIED',
        sourceApi: 'Meta Graph API v26.0 /media (comments_count)',
        reportingPeriod: 'recent_media',
        lastSyncedAt: now,
      };

      if (followers && followers > 0 && contentItems.length > 0) {
        const avgEngagement = Number((((totalLikesSum + totalCommentsSum) / (contentItems.length * followers)) * 100).toFixed(2));
        intel.metrics.avgEngagementRate = {
          name: 'avg_engagement_rate',
          displayName: 'Avg Engagement Rate',
          value: avgEngagement,
          unit: '%',
          status: 'VERIFIED',
          sourceApi: 'Calculated from authentic media likes/comments & followers',
          reportingPeriod: 'recent_media',
          lastSyncedAt: now,
        };
      }
    }

    return { account: intel, contentItems };
  } catch (err) {
    console.error('[syncInstagramAccountAnalytics] Sync error:', err);
    return { account: intel, contentItems: [] };
  }
}

/**
 * Synchronizes all authorized accounts and builds the unified social intelligence payload
 */
export async function syncAllAccountsAnalytics(userId: string): Promise<UnifiedAnalyticsResponse> {
  const accounts = await getConnectedAccounts(userId);
  const connectedAccounts = accounts.filter((a) => a.status === 'connected' || a.status === 'expired');

  const syncedAccounts: SocialAccountIntelligence[] = [];
  const allContentItems: ContentIntelligenceItem[] = [];

  for (const acc of connectedAccounts) {
    if (acc.provider === 'youtube') {
      const res = await syncYouTubeAccountAnalytics(acc.id, userId);
      syncedAccounts.push(res.account);
      allContentItems.push(...res.contentItems);
    } else if (acc.provider === 'instagram') {
      const res = await syncInstagramAccountAnalytics(acc.id, userId);
      syncedAccounts.push(res.account);
      allContentItems.push(...res.contentItems);
    }
  }

  // Persist synced content items into historical content store
  if (allContentItems.length > 0) {
    await saveContentIntelligenceItems(allContentItems);
  }

  // Retrieve complete content history & snapshots
  const fullContentHistory = await getContentIntelligenceHistory({ timeRange: 'all' });
  const historicalSnapshots = await getHistoricalSnapshots({ timeRange: '90d' });

  // Calculate authentic totals
  let totalAudience = 0;
  let hasAudienceData = false;
  let totalViews = 0;
  let hasViewsData = false;
  let totalPublished = 0;
  let totalTrackedInteractions = 0;

  for (const acc of syncedAccounts) {
    if (acc.metrics.followers?.value !== null && acc.metrics.followers?.value !== undefined) {
      totalAudience += acc.metrics.followers.value;
      hasAudienceData = true;
    }
    if (acc.metrics.subscribers?.value !== null && acc.metrics.subscribers?.value !== undefined) {
      totalAudience += acc.metrics.subscribers.value;
      hasAudienceData = true;
    }
    if (acc.metrics.totalViews?.value !== null && acc.metrics.totalViews?.value !== undefined) {
      totalViews += acc.metrics.totalViews.value;
      hasViewsData = true;
    }
    if (acc.metrics.publishedContentCount?.value !== null && acc.metrics.publishedContentCount?.value !== undefined) {
      totalPublished += acc.metrics.publishedContentCount.value;
    }
    if (acc.metrics.totalLikes?.value !== null && acc.metrics.totalLikes?.value !== undefined) {
      totalTrackedInteractions += acc.metrics.totalLikes.value;
    }
    if (acc.metrics.totalComments?.value !== null && acc.metrics.totalComments?.value !== undefined) {
      totalTrackedInteractions += acc.metrics.totalComments.value;
    }
  }

  const reelsAndShorts = fullContentHistory.filter(
    (c) => c.contentType === 'reel' || c.contentType === 'short'
  );

  // Generate evidence-backed AI recommendations & forecasts
  const growthRecommendations = generateGrowthRecommendations(syncedAccounts, fullContentHistory);
  const forecasts = generatePerformanceForecasts(syncedAccounts, historicalSnapshots);

  return {
    accounts: syncedAccounts,
    overview: {
      totalAudience,
      hasAudienceData,
      totalViews,
      hasViewsData,
      totalPublishedContent: totalPublished || fullContentHistory.length,
      totalTrackedInteractions,
      activeChannelsCount: syncedAccounts.filter((a) => a.connectionStatus === 'connected').length,
      dataFreshness: new Date().toLocaleTimeString(),
      strictIntegrityMode: true,
    },
    contentHistory: fullContentHistory,
    reelsAndShorts,
    historicalSnapshots,
    futureContent: [], // populated from creator projects in route handler
    growthRecommendations,
    forecasts,
    diagnostics: {
      lastGlobalSyncAt: new Date().toISOString(),
      apiRateLimitStatus: {
        youtube: 'normal',
        instagram: 'normal',
      },
      knownErrors: syncedAccounts
        .filter((a) => a.connectionStatus === 'expired')
        .map((a) => ({
          accountId: a.id,
          platform: a.platform,
          error: 'Access token expired; re-authorization or valid refresh token required.',
        })),
    },
  };
}

function createUnauthenticatedAccount(
  platform: 'youtube' | 'instagram',
  accountId: string,
  handle: string
): SocialAccountIntelligence {
  const now = new Date().toISOString();
  return {
    id: accountId,
    platform,
    platformAccountId: accountId,
    username: handle.replace(/^@/, ''),
    displayName: handle,
    accountType: platform === 'youtube' ? 'channel' : 'creator',
    connectionStatus: 'expired',
    authorizationStatus: 'refresh_needed',
    grantedScopes: [],
    missingPermissions: [],
    lastSyncAt: now,
    nextEligibleSyncAt: now,
    isTokenExpired: true,
    historicalDataCoverageDays: 0,
    metrics: {},
  };
}

function parseISO8601Duration(duration: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatSeconds(sec: number): string {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#[\p{L}\p{N}_]+/gu);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
}

