// =============================================================================
// RIIQX — Master Social Media Analytics & Intelligence API Route
// Strictly Authentic Data • Auto-Refresh Token Handling • Multi-Account Filtering
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { syncAllAccountsAnalytics } from '@/lib/riiqx/social/analytics-sync-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { getSafeTempFilePath, safeReadJson } from '@/lib/riiqx/temp-storage';
import { ScheduledPostRecord } from '@/lib/riiqx/social/publishing-engine';
import {
  FuturePlannedContentItem,
  CrossAccountComparisonResult,
  MetricComparisonItem,
} from '@/lib/riiqx/social/analytics-types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';
  const url = new URL(req.url);
  const accountIdFilter = url.searchParams.get('accountId');
  const platformFilter = url.searchParams.get('platform');
  const timeRangeFilter = url.searchParams.get('timeRange') || '30d';

  try {
    const analytics = await syncAllAccountsAnalytics(userId);

    // Read scheduled future content from secure runtime store
    const scheduledStorePath = getSafeTempFilePath('scheduled_posts_store.json');
    const scheduledStore = safeReadJson<{ posts: ScheduledPostRecord[] }>(scheduledStorePath, { posts: [] });

    const futureContent: FuturePlannedContentItem[] = (scheduledStore.posts || []).map((p) => {
      let status: FuturePlannedContentItem['status'] = 'scheduled';
      if (p.status === 'published') status = 'published';
      else if (p.status === 'cancelled') status = 'cancelled';
      else if (p.status === 'failed') status = 'failed';
      else if (p.status === 'queued') status = 'queued';

      return {
        id: p.id,
        platform: p.platform,
        targetAccountId: p.connected_account_id,
        targetAccountHandle: `@account_${p.connected_account_id.slice(-6)}`,
        plannedPublicationDate: p.scheduled_for,
        contentType: 'short',
        topic: p.title || p.caption?.slice(0, 30) || 'Scheduled Post',
        caption: p.caption || '',
        hashtags: [],
        thumbnailUrl: p.media_url,
        status,
        sourceProjectId: p.project_id || p.id,
      };
    });

    analytics.futureContent = futureContent;

    // Filter accounts if requested
    let filteredAccounts = analytics.accounts;
    if (platformFilter && platformFilter !== 'all') {
      filteredAccounts = filteredAccounts.filter((a) => a.platform === platformFilter);
    }
    if (accountIdFilter && accountIdFilter !== 'all') {
      filteredAccounts = filteredAccounts.filter((a) => a.id === accountIdFilter);
    }

    // Filter content history if requested
    let filteredContent = analytics.contentHistory;
    if (platformFilter && platformFilter !== 'all') {
      filteredContent = filteredContent.filter((c) => c.platform === platformFilter);
    }
    if (accountIdFilter && accountIdFilter !== 'all') {
      filteredContent = filteredContent.filter((c) => c.accountId === accountIdFilter);
    }

    // Filter historical snapshots
    let filteredSnapshots = analytics.historicalSnapshots;
    if (accountIdFilter && accountIdFilter !== 'all') {
      filteredSnapshots = filteredSnapshots.filter((s) => s.accountId === accountIdFilter);
    }

    // Generate Cross-Account Comparison if at least 2 accounts exist
    const comparisons: CrossAccountComparisonResult[] = [];
    if (analytics.accounts.length >= 2) {
      const a = analytics.accounts[0];
      const b = analytics.accounts[1];

      const metricsComparison: MetricComparisonItem[] = [];

      // Followers / Subscribers
      const valA = a.metrics.followers?.value ?? a.metrics.subscribers?.value ?? null;
      const valB = b.metrics.followers?.value ?? b.metrics.subscribers?.value ?? null;

      metricsComparison.push({
        metricName: 'audience',
        displayName: 'Total Audience (Followers / Subs)',
        valueA: valA,
        valueB: valB,
        winnerAccountId: valA && valB ? (valA > valB ? a.id : b.id) : undefined,
        differencePct:
          valA && valB && Math.min(valA, valB) > 0
            ? Number(((Math.abs(valA - valB) / Math.min(valA, valB)) * 100).toFixed(1))
            : undefined,
        isComparable: true,
      });

      // Published Content
      const pubA = a.metrics.publishedContentCount?.value ?? null;
      const pubB = b.metrics.publishedContentCount?.value ?? null;

      metricsComparison.push({
        metricName: 'published_content',
        displayName: 'Published Media / Videos',
        valueA: pubA,
        valueB: pubB,
        winnerAccountId: pubA && pubB ? (pubA > pubB ? a.id : b.id) : undefined,
        isComparable: true,
      });

      // Total Likes
      const likesA = a.metrics.totalLikes?.value ?? null;
      const likesB = b.metrics.totalLikes?.value ?? null;

      metricsComparison.push({
        metricName: 'total_likes',
        displayName: 'Tracked Likes',
        valueA: likesA,
        valueB: likesB,
        winnerAccountId: likesA && likesB ? (likesA > likesB ? a.id : b.id) : undefined,
        isComparable: true,
      });

      comparisons.push({
        accountA: a,
        accountB: b,
        comparisonDate: new Date().toISOString(),
        metrics: metricsComparison,
        topContentA: analytics.contentHistory.find((c) => c.accountId === a.id),
        topContentB: analytics.contentHistory.find((c) => c.accountId === b.id),
      });
    }

    // Maintain backward compatibility with legacy snapshots array for older components
    const legacySnapshots = analytics.accounts.map((a) => {
      return {
        platform: a.platform,
        accountId: a.id,
        accountHandle: `@${a.username}`,
        overallStatus: a.connectionStatus === 'connected' ? 'DATA_AVAILABLE' : 'AUTHENTICATION_REQUIRED',
        metrics: {
          followers: a.metrics.followers || a.metrics.subscribers,
          views: a.metrics.totalViews,
          publishedVideosCount: a.metrics.publishedContentCount,
          reach: a.metrics.reach,
          impressions: a.metrics.impressions,
        },
        syncedAt: a.lastSyncAt,
        isRealData: true,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        accounts: filteredAccounts,
        contentHistory: filteredContent,
        reelsAndShorts: filteredContent.filter((c) => c.contentType === 'reel' || c.contentType === 'short'),
        historicalSnapshots: filteredSnapshots,
        comparisons,
      },
      snapshots: legacySnapshots, // backward compatibility
      timestamp: new Date().toISOString(),
      isStrictRealData: true,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to synchronize analytics intelligence';
    console.error('[API /api/social/analytics] Error:', err);
    return NextResponse.json({ error: errorMsg, isStrictRealData: true }, { status: 500 });
  }
}
