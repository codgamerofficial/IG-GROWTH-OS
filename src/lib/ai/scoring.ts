// =============================================================================
// IG GrowthOS: Content Scoring Engine
// =============================================================================

import { AIScoreBreakdown } from '../supabase/types';

export const SCORING_WEIGHTS = {
  hook_strength: 0.20,
  audience_relevance: 0.20,
  trend_relevance: 0.15,
  shareability: 0.15,
  save_potential: 0.10,
  conversion_potential: 0.10,
  brand_fit: 0.10,
} as const;

/**
 * Calculates the exact weighted AI Opportunity Score (0 to 100).
 * Never guarantees performance; represents mathematical potential based on algorithm factors.
 */
export function calculateOpportunityScore(factors: AIScoreBreakdown): number {
  const score =
    factors.hook_strength * SCORING_WEIGHTS.hook_strength +
    factors.audience_relevance * SCORING_WEIGHTS.audience_relevance +
    factors.trend_relevance * SCORING_WEIGHTS.trend_relevance +
    factors.shareability * SCORING_WEIGHTS.shareability +
    factors.save_potential * SCORING_WEIGHTS.save_potential +
    factors.conversion_potential * SCORING_WEIGHTS.conversion_potential +
    factors.brand_fit * SCORING_WEIGHTS.brand_fit;

  return Number(Math.min(100, Math.max(0, score)).toFixed(1));
}

/**
 * Default fallback scoring factor generator with balanced distribution.
 */
export function generateFactors(base = 88, jitter = 8): AIScoreBreakdown {
  const clamp = (val: number) => Math.min(99, Math.max(65, Math.round(val)));
  const rand = () => Math.round((Math.random() - 0.5) * jitter);

  return {
    hook_strength: clamp(base + rand() + 2),
    audience_relevance: clamp(base + rand()),
    trend_relevance: clamp(base + rand() - 1),
    shareability: clamp(base + rand() + 1),
    save_potential: clamp(base + rand() + 3),
    conversion_potential: clamp(base + rand() - 3),
    brand_fit: clamp(base + rand() + 4),
  };
}
