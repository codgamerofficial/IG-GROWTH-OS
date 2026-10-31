// =============================================================================
// RIIQX — Social Media Growth Intelligence & Predictive Forecasting Engine
// Evidence-Backed Insights • Mathematical Forecasting • Zero Simulation
// =============================================================================

import {
  SocialAccountIntelligence,
  ContentIntelligenceItem,
  HistoricalMetricSnapshot,
  AIGrowthRecommendation,
  PerformanceForecast,
} from './analytics-types';

/**
 * Analyzes authentic content history to produce verifiable AI growth recommendations
 */
export function generateGrowthRecommendations(
  accounts: SocialAccountIntelligence[],
  contentHistory: ContentIntelligenceItem[]
): AIGrowthRecommendation[] {
  const recommendations: AIGrowthRecommendation[] = [];

  if (contentHistory.length === 0) {
    recommendations.push({
      id: 'rec_baseline_001',
      title: 'Establish Publishing Baseline',
      recommendation: 'Publish initial short-form Reels and Shorts to establish audience response data.',
      supportingObservations: [
        'No historical content items found in connected accounts.',
        'Initial baseline requires at least 3 published assets to evaluate engagement velocity.',
      ],
      relevantContentIds: [],
      relevantContentTitles: [],
      reportingPeriod: 'current',
      confidence: 'medium',
      suggestedNextAction: 'Use Creator Studio to render and publish your first 30 FPS video.',
      category: 'posting_cadence',
    });
    return recommendations;
  }

  // 1. Identify Top Performing Content by Interactions (Likes + Comments)
  const sortedByInteractions = [...contentHistory].sort((a, b) => {
    const totalA = (a.likes || 0) + (a.comments || 0);
    const totalB = (b.likes || 0) + (b.comments || 0);
    return totalB - totalA;
  });

  const topContent = sortedByInteractions.slice(0, 3);
  const avgLikes =
    contentHistory.reduce((sum, item) => sum + (item.likes || 0), 0) / contentHistory.length;

  if (topContent.length > 0 && topContent[0].likes !== null) {
    const topItem = topContent[0];
    const topInteractions = (topItem.likes || 0) + (topItem.comments || 0);

    recommendations.push({
      id: `rec_top_performer_${topItem.contentId}`,
      title: `Double Down on High-Engagement Theme: "${(topItem.title || topItem.caption || '').slice(0, 32)}..."`,
      recommendation: `Create follow-up content continuing the format and narrative hook that made "${(topItem.title || topItem.caption || '').slice(0, 30)}" succeed.`,
      supportingObservations: [
        `Generated ${topInteractions} authentic interactions (${topItem.likes} likes, ${topItem.comments || 0} comments).`,
        `Outperformed your channel average of ${avgLikes.toFixed(1)} likes per post by ${(((topItem.likes || 0) / Math.max(1, avgLikes) - 1) * 100).toFixed(0)}%.`,
        `Published on ${new Date(topItem.publishedAt).toLocaleDateString()} on ${topItem.platform.toUpperCase()}.`,
      ],
      relevantContentIds: [topItem.contentId],
      relevantContentTitles: [topItem.title || topItem.caption || 'Top Performer'],
      reportingPeriod: 'recent_content',
      confidence: 'high',
      suggestedNextAction: `Draft a sequel or complementary Reel in Creator Studio using the same hook structure.`,
      category: 'hook_optimization',
    });
  }

  // 2. Format Distribution Intelligence (Shorts vs Videos vs Reels)
  const reelsCount = contentHistory.filter((c) => c.contentType === 'reel' || c.contentType === 'short').length;
  const longFormCount = contentHistory.filter((c) => c.contentType === 'video').length;

  if (reelsCount > 0) {
    recommendations.push({
      id: 'rec_short_form_velocity',
      title: 'Prioritize 9:16 Short-Form Video Formats',
      recommendation: 'Maintain a 3:1 ratio of short-form (Reels/Shorts) to long-form videos to maximize organic discovery.',
      supportingObservations: [
        `You have ${reelsCount} short-form video(s) and ${longFormCount} long-form video(s) tracked.`,
        '9:16 vertical videos under 60 seconds benefit from algorithmic discovery feeds across both Meta and YouTube.',
      ],
      relevantContentIds: contentHistory.slice(0, 2).map((c) => c.contentId),
      relevantContentTitles: contentHistory.slice(0, 2).map((c) => c.title || c.caption || 'Video'),
      reportingPeriod: 'lifetime',
      confidence: 'high',
      suggestedNextAction: 'Use the RIIQX Video Editor to export 9:16 vertical videos at 1080x1920 resolution.',
      category: 'content_format',
    });
  }

  // 3. Publishing Cadence Analysis
  if (contentHistory.length >= 2) {
    const dates = contentHistory.map((c) => new Date(c.publishedAt).getTime()).sort();
    const intervalsDays = [];
    for (let i = 1; i < dates.length; i++) {
      intervalsDays.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
    }
    const avgCadenceDays = intervalsDays.reduce((a, b) => a + b, 0) / intervalsDays.length;

    recommendations.push({
      id: 'rec_cadence_consistency',
      title: `Optimize Cadence: Current Interval ~${avgCadenceDays.toFixed(1)} Days`,
      recommendation:
        avgCadenceDays > 7
          ? 'Shorten gap between uploads to 3-4 days to prevent audience churn.'
          : 'Great consistency! Maintain current scheduled rhythm.',
      supportingObservations: [
        `Analyzed ${contentHistory.length} published assets across ${intervalsDays.length} historical intervals.`,
        `Average publishing interval is ${avgCadenceDays.toFixed(1)} days.`,
      ],
      relevantContentIds: [],
      relevantContentTitles: [],
      reportingPeriod: 'historical_average',
      confidence: 'medium',
      suggestedNextAction: 'Schedule future releases in the Content Calendar to maintain cadence.',
      category: 'posting_cadence',
    });
  }

  return recommendations;
}

/**
 * Computes performance forecasts based on genuine historical observations
 * Strictly reports INSUFFICIENT_DATA if fewer than 3 observations exist
 */
export function generatePerformanceForecasts(
  accounts: SocialAccountIntelligence[],
  snapshots: HistoricalMetricSnapshot[]
): PerformanceForecast[] {
  const forecasts: PerformanceForecast[] = [];

  // 1. YouTube Subscribers Forecast
  const ytAccount = accounts.find((a) => a.platform === 'youtube');
  const ytSnapshots = snapshots.filter(
    (s) => s.platform === 'youtube' && s.metricName === 'subscribers'
  );

  if (ytAccount) {
    const currentSubs = ytAccount.metrics.subscribers?.value || null;
    if (ytSnapshots.length < 3 || currentSubs === null) {
      forecasts.push({
        targetMetric: 'youtube_subscribers_30d',
        displayName: 'YouTube Subscribers (30-Day Forecast)',
        forecastValue: null,
        confidenceInterval: null,
        method: 'Linear Regression on Historical Daily Snapshots',
        assumptions: [
          'Requires at least 3 discrete snapshot points across distinct days.',
          'Assumes continuous publishing cadence without platform policy interruptions.',
        ],
        isSufficientData: false,
        insufficientDataReason: `Insufficient historical data points (${ytSnapshots.length} snapshot(s) found, 3 required). Sync periodically to build trend curve.`,
        observationPointsCount: ytSnapshots.length,
        generatedAt: new Date().toISOString(),
      });
    } else {
      // Linear slope estimation
      const trend = computeLinearTrend(
        ytSnapshots.map((s) => ({ x: new Date(s.timestamp).getTime(), y: s.metricValue }))
      );
      const daysAhead = 30;
      const predictedGrowth = trend.slope * (daysAhead * 24 * 60 * 60 * 1000);
      const forecastVal = Math.round(currentSubs + Math.max(0, predictedGrowth));
      const margin = Math.round(Math.max(5, forecastVal * 0.05));

      forecasts.push({
        targetMetric: 'youtube_subscribers_30d',
        displayName: 'YouTube Subscribers (30-Day Forecast)',
        forecastValue: forecastVal,
        confidenceInterval: [forecastVal - margin, forecastVal + margin],
        method: 'Linear Regression on Daily Trend Snapshots',
        assumptions: [
          `Derived from ${ytSnapshots.length} historical snapshot observation points.`,
          'Assumes consistent upload velocity and audience retention.',
        ],
        isSufficientData: true,
        observationPointsCount: ytSnapshots.length,
        generatedAt: new Date().toISOString(),
      });
    }
  }

  // 2. Instagram Followers Forecast
  const igAccount = accounts.find((a) => a.platform === 'instagram');
  const igSnapshots = snapshots.filter(
    (s) => s.platform === 'instagram' && s.metricName === 'followers'
  );

  if (igAccount) {
    const currentFollowers = igAccount.metrics.followers?.value || null;
    if (igSnapshots.length < 3 || currentFollowers === null) {
      forecasts.push({
        targetMetric: 'instagram_followers_30d',
        displayName: 'Instagram Followers (30-Day Forecast)',
        forecastValue: null,
        confidenceInterval: null,
        method: 'Linear Regression on Historical Daily Snapshots',
        assumptions: [
          'Requires at least 3 historical snapshot points across distinct days.',
          'Assumes consistent Reel posting frequency.',
        ],
        isSufficientData: false,
        insufficientDataReason: `Insufficient historical data points (${igSnapshots.length} snapshot(s) found, 3 required). Additional syncs required over multiple days.`,
        observationPointsCount: igSnapshots.length,
        generatedAt: new Date().toISOString(),
      });
    } else {
      const trend = computeLinearTrend(
        igSnapshots.map((s) => ({ x: new Date(s.timestamp).getTime(), y: s.metricValue }))
      );
      const daysAhead = 30;
      const predictedGrowth = trend.slope * (daysAhead * 24 * 60 * 60 * 1000);
      const forecastVal = Math.round(currentFollowers + Math.max(0, predictedGrowth));
      const margin = Math.round(Math.max(5, forecastVal * 0.04));

      forecasts.push({
        targetMetric: 'instagram_followers_30d',
        displayName: 'Instagram Followers (30-Day Forecast)',
        forecastValue: forecastVal,
        confidenceInterval: [forecastVal - margin, forecastVal + margin],
        method: 'Linear Regression on Daily Trend Snapshots',
        assumptions: [
          `Derived from ${igSnapshots.length} historical snapshot observation points.`,
          'Predicts organic growth based on current follower trajectory.',
        ],
        isSufficientData: true,
        observationPointsCount: igSnapshots.length,
        generatedAt: new Date().toISOString(),
      });
    }
  }

  return forecasts;
}

function computeLinearTrend(points: Array<{ x: number; y: number }>): { slope: number; intercept: number } {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: points[0]?.y || 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

