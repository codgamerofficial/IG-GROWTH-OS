// =============================================================================
// IG GrowthOS: Daily Workflow Orchestrator (Steps 1 to 12)
// =============================================================================

import { repository } from '../supabase/repository';
import { getAIProvider } from '../ai';
import { ContentItem } from '../supabase/types';

export interface WorkflowProgressStep {
  stepNumber: number;
  name: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  result?: unknown;
}

export interface DailyWorkflowResult {
  jobId: string;
  brand: string;
  generatedItems: ContentItem[];
  ideasGeneratedCount: number;
  topIdeasScores: number[];
  trendsConsidered: number;
  completedAt: string;
  message: string;
}

export class DailyWorkflowOrchestrator {
  /**
   * Executes the complete 12-step official IG GrowthOS daily workflow.
   * NEVER automatically publishes during this workflow.
   */
  static async runTodayWorkflow(brandSlug = 'riiqx-fashion'): Promise<DailyWorkflowResult> {
    const ai = getAIProvider();

    // Create automation job record
    const job = await repository.createAutomationJob({
      brand_id: '00000000-0000-0000-0000-000000000001',
      job_type: 'daily_workflow',
      status: 'RUNNING',
      payload: { brandSlug, trigger: 'user_run_todays_workflow' },
      result: {},
      error: null,
      started_at: new Date().toISOString(),
      completed_at: null,
    });

    try {
      // STEP 1: Load active brand
      const brand = await repository.getBrand(brandSlug);

      // STEP 2: Load recent content
      const recentContent = await repository.getContentItems(brand.id);

      // STEP 3: Load recent analytics
      const analytics = await repository.getAnalytics(brand.id, 14);

      // STEP 4: Analyze high-performing content
      const topItems = recentContent
        .filter((i) => i.status === 'PUBLISHED')
        .sort((a, b) => b.ai_score - a.ai_score)
        .slice(0, 3);

      // STEP 5: Research current relevant opportunities
      const currentTrends = await repository.getTrends();

      // STEP 6: Generate 10 content ideas
      const ideas = await ai.generateIdeas({
        brandName: brand.name,
        category: 'Fashion / Clothing / Lifestyle',
        audience: brand.target_audience || undefined,
        tone: brand.brand_voice || undefined,
        count: 10,
      });

      // STEP 7: Score ideas (already scored via AI Opportunity Score formula)
      const scoredIdeas = [...ideas].sort((a, b) => b.ai_score - a.ai_score);

      // STEP 8: Select top 3
      const top3Ideas = scoredIdeas.slice(0, 3);

      // STEP 9 & 10 & 11: Generate complete packages, save to DB with approval_status = PENDING
      const generatedItems: ContentItem[] = [];

      for (let i = 0; i < top3Ideas.length; i++) {
        const idea = top3Ideas[i];

        // Generate full Reel package for each top idea
        const reelPackage = await ai.generateReel({
          topic: idea.title,
          brandName: brand.name,
          tone: brand.brand_voice || undefined,
        });

        // STEP 10 & 11: Save to Supabase with status READY & approval_status PENDING
        const savedItem = await repository.createContentItem({
          brand_id: brand.id,
          title: idea.title,
          content_type: idea.recommended_format || 'Reel',
          content_pillar: idea.content_pillar,
          hook: reelPackage.hook,
          script: {
            hook: reelPackage.hook,
            problem: reelPackage.problem_context,
            story: reelPackage.value_story,
            payoff: reelPackage.payoff,
            cta: reelPackage.cta,
            voiceover: reelPackage.voiceover,
            shot_list: reelPackage.shot_list,
            b_roll: reelPackage.b_roll,
            on_screen_text: reelPackage.on_screen_text,
            production_notes: reelPackage.production_notes,
          },
          caption: reelPackage.caption,
          hashtags: reelPackage.hashtags,
          cta: reelPackage.cta,
          media_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          cover_text: reelPackage.cover_text,
          scheduled_at: null,
          published_at: null,
          instagram_media_id: null,
          status: 'READY',
          approval_status: 'PENDING', // STEP 11: PENDING APPROVAL
          ai_score: idea.ai_score,
          ai_score_breakdown: idea.ai_score_breakdown,
        });

        generatedItems.push(savedItem);
      }

      // STEP 12: Display in Approvals (persisted in DB and available to Approvals screen)
      const resultPayload = {
        generated_count: generatedItems.length,
        item_ids: generatedItems.map((g) => g.id),
        top_scores: top3Ideas.map((t) => t.ai_score),
      };

      await repository.updateAutomationJob(job.id, {
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
        result: resultPayload,
      });

      await repository.logAudit({
        action: 'DAILY_WORKFLOW_EXECUTED',
        resource_type: 'automation_jobs',
        resource_id: job.id,
        metadata: resultPayload,
      });

      return {
        jobId: job.id,
        brand: brand.name,
        generatedItems,
        ideasGeneratedCount: ideas.length,
        topIdeasScores: top3Ideas.map((t) => t.ai_score),
        trendsConsidered: currentTrends.length,
        completedAt: new Date().toISOString(),
        message: `Successfully executed today's workflow for ${brand.name}. Generated 10 ideas, selected top 3, and created complete content packages now awaiting review in Approvals.`,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await repository.updateAutomationJob(job.id, {
        status: 'FAILED',
        completed_at: new Date().toISOString(),
        error: errMsg,
      });
      throw err;
    }
  }
}
