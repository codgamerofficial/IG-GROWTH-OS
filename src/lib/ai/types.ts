// =============================================================================
// IG GrowthOS: AI Provider Interface & Schemas
// =============================================================================

import { AIScoreBreakdown, ScriptSection } from '../supabase/types';

export interface GeneratedIdea {
  title: string;
  hook: string;
  concept: string;
  why_it_could_work: string;
  target_audience: string;
  content_pillar: string;
  estimated_difficulty: 'Low' | 'Medium' | 'High';
  potential_reach: 'Moderate' | 'High' | 'Viral';
  share_potential: number;      // 0-100
  save_potential: number;       // 0-100
  conversion_potential: number; // 0-100
  ai_score: number;             // 0-100 AI Opportunity Score
  ai_score_breakdown: AIScoreBreakdown;
  recommended_format: 'Reel' | 'Carousel' | 'Single Image' | 'UGC';
}

export interface GeneratedReel {
  title: string;
  hook: string;                 // 0–3 seconds
  problem_context: string;      // 3–8 seconds
  value_story: string;          // 8–20 seconds
  payoff: string;               // 20–30 seconds
  cta: string;                  // Final seconds
  voiceover: string;
  scene_by_scene_script: Array<{
    timestamp: string;
    visual: string;
    audio: string;
    on_screen_text: string;
  }>;
  shot_list: string[];
  b_roll: string[];
  on_screen_text: string[];
  cover_text: string;
  caption: string;
  hashtags: string[];
  production_notes: string;
  ai_score: number;
  ai_score_breakdown: AIScoreBreakdown;
}

export interface GeneratedUGC {
  creator_persona: string;
  hook: string;
  scene_list: Array<{
    scene: number;
    description: string;
    action: string;
  }>;
  dialogue: string[];
  b_roll: string[];
  cta: string;
  caption: string;
  cover_concept: string;
  format_type: string;
  ai_score: number;
}

export interface GeneratedProductContent {
  product_name: string;
  reel_ideas: string[];
  carousel_ideas: string[];
  product_hooks: string[];
  captions: string[];
  ugc_concepts: string[];
  ctas: string[];
}

export interface GeneratedAffiliateContent {
  product_url: string;
  product_angle: string;
  hook: string;
  reel_concept: string;
  caption: string;
  cta: string;
  disclosure_recommendation: string;
  hashtag_suggestions: string[];
}

export interface DiscoveredTrend {
  topic: string;
  source: string;
  source_url: string;
  date_discovered: string;
  relevance_score: number;
  trend_score: number;
  recommended_content_angle: string;
  expiration_date: string;
}

export interface AnalyticsDiagnostic {
  what_worked: string[];
  what_didnt: string[];
  which_formats_worked: string[];
  which_hooks_worked: string[];
  which_topics_worked: string[];
  which_content_generated_saves: string[];
  which_content_generated_shares: string[];
  what_should_we_stop_doing: string[];
  what_should_we_do_more_of: string[];
  what_should_we_test_next: string[];
  next_10_recommendations: Array<{
    rank: number;
    title: string;
    format: string;
    pillar: string;
    hook: string;
    expected_outcome: string;
  }>;
}

export interface CopilotMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  name: string;
  generateIdeas(params: {
    brandName: string;
    category: string;
    pillar?: string;
    audience?: string;
    goal?: string;
    format?: string;
    product?: string;
    tone?: string;
    count?: number;
  }): Promise<GeneratedIdea[]>;

  generateReel(params: {
    topic: string;
    product?: string;
    audience?: string;
    goal?: string;
    tone?: string;
    durationSeconds?: number;
    brandName?: string;
  }): Promise<GeneratedReel>;

  generateUGC(params: {
    style: string;
    productName: string;
    productDescription?: string;
    brandName?: string;
  }): Promise<GeneratedUGC>;

  generateProductContent(params: {
    product: {
      name: string;
      description?: string | null;
      price: number;
      sale_price?: number | null;
      category: string;
    };
    brandName?: string;
    goal?: string;
  }): Promise<GeneratedProductContent>;

  generateAffiliateContent(params: {
    productUrl: string;
    category?: string;
    brandName?: string;
  }): Promise<GeneratedAffiliateContent>;

  researchTrends(params: {
    category: string;
    brandName?: string;
  }): Promise<DiscoveredTrend[]>;

  analyzePerformance(params: {
    brandName: string;
    recentMetrics: Record<string, unknown>;
    topPosts: Array<{ title: string; reach: number; saves: number; shares: number; type: string }>;
  }): Promise<AnalyticsDiagnostic>;

  chatCopilot(
    messages: CopilotMessage[],
    context?: Record<string, unknown>
  ): Promise<string>;
}
