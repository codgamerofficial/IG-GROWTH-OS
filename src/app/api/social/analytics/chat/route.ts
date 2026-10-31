// =============================================================================
// RIIQX — Social Media Analytics Conversational Assistant API
// Grounded In Authenticated Platform Records • Zero Fabricated Metrics
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { syncAllAccountsAnalytics } from '@/lib/riiqx/social/analytics-sync-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { RIIQX_MODELS } from '@/lib/riiqx/models';
import { streamChatCompletion } from '@/lib/riiqx/orchestration';
import { ModelRouter } from '@/lib/riiqx/model-router';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    const { message, accountId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message query is required.' }, { status: 400 });
    }

    // 1. Fetch grounded authentic analytics state
    const analytics = await syncAllAccountsAnalytics(userId);

    let targetAccounts = analytics.accounts;
    if (accountId && accountId !== 'all') {
      targetAccounts = targetAccounts.filter((a) => a.id === accountId);
    }

    // Construct grounded context
    const accountsSummary = targetAccounts.map((a) => ({
      platform: a.platform,
      username: `@${a.username}`,
      subscribers_or_followers: a.metrics.followers?.value ?? a.metrics.subscribers?.value ?? 'Not Available',
      total_views: a.metrics.totalViews?.value ?? 'Not Available',
      published_count: a.metrics.publishedContentCount?.value ?? 'Not Available',
      total_likes: a.metrics.totalLikes?.value ?? 'Not Available',
      status: a.connectionStatus,
    }));

    const topContent = analytics.contentHistory.slice(0, 5).map((c) => ({
      platform: c.platform,
      title_or_caption: (c.title || c.caption || '').slice(0, 60),
      likes: c.likes ?? 'N/A',
      comments: c.comments ?? 'N/A',
      views: c.views ?? 'N/A',
      publishedAt: c.publishedAt,
    }));

    const systemPrompt = `You are RIIQX Social Intelligence Assistant, an elite social media growth strategist.
STRICT RULE: ONLY answer questions using the verified authentic data provided below.
DO NOT fabricate numbers, followers, or impressions. If a metric is missing or requires permissions, state that clearly.

CURRENT AUTHENTIC PLATFORM DATA:
- Active Accounts: ${JSON.stringify(accountsSummary, null, 2)}
- Overview: Total Audience: ${analytics.overview.totalAudience}, Total Views: ${analytics.overview.totalViews}, Published: ${analytics.overview.totalPublishedContent}
- Recent Top Content: ${JSON.stringify(topContent, null, 2)}
- Active Recommendations: ${JSON.stringify(analytics.growthRecommendations.map((r) => r.title), null, 2)}

Provide clear, professional, evidence-backed advice referencing these real channels and content items.`;

    // Attempt AI routing with verified free model
    let replyText = '';
    try {
      const resolution = ModelRouter.routeModelForTask('analytics');
      const targetModel = resolution.selectedModel || RIIQX_MODELS[0];

      let accumulated = '';
      const res = await streamChatCompletion({
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        onChunk: (chunk: string) => {
          accumulated += chunk;
        },
      });
      replyText = res.fullText || accumulated;
    } catch {
      // Deterministic evidence-backed fallback if AI provider is offline
      replyText = `Based on your authenticated channels:\n` +
        `• Total Tracked Audience: ${analytics.overview.totalAudience.toLocaleString()}\n` +
        `• Total Channel Views: ${analytics.overview.totalViews.toLocaleString()}\n` +
        `• Tracked Content Assets: ${analytics.contentHistory.length} posts/videos\n\n` +
        `Top Recent Asset: "${topContent[0]?.title_or_caption || 'N/A'}" with ${topContent[0]?.likes || 0} likes on ${topContent[0]?.platform?.toUpperCase() || 'platform'}.\n\n` +
        `Recommendation: ${analytics.growthRecommendations[0]?.recommendation || 'Continue posting 9:16 vertical video content.'}`;
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      groundedData: {
        accountsCount: targetAccounts.length,
        contentItemsEvaluated: analytics.contentHistory.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to process natural language query';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
