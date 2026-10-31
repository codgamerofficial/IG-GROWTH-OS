// =============================================================================
// RIIQX — Master Agent Orchestration Engine
// Multi-Step Planning • Specialist Delegation • Human-in-the-Loop Safety Brake
// =============================================================================

import { MultimodalModelRouter } from '../router/model-router';
import { CapabilityFlag, InferenceResponse } from '../registry/types';

export type AgentRole =
  | 'general_director'
  | 'research_specialist'
  | 'coding_architect'
  | 'creator_strategist'
  | 'media_producer'
  | 'safety_auditor';

export interface PlanStep {
  id: string;
  role: AgentRole;
  description: string;
  requiredCapabilities: CapabilityFlag[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'requires_approval';
  requiresHumanApproval: boolean;
  approvalType?: 'social_publishing' | 'file_deletion' | 'external_api' | 'none';
  result?: string;
  latencyMs?: number;
}

export interface AgentPlan {
  id: string;
  userGoal: string;
  steps: PlanStep[];
  currentStepIndex: number;
  status: 'planning' | 'executing' | 'paused_for_approval' | 'completed' | 'failed';
  createdAt: string;
}

export class RiiqxAgentOrchestrator {
  /**
   * Decompose user goal into an actionable multi-step execution plan
   */
  public static async createPlan(userGoal: string): Promise<AgentPlan> {
    const planId = `plan_${Date.now()}`;
    const goalLower = userGoal.toLowerCase();

    const isPublishingTask =
      goalLower.includes('publish') ||
      goalLower.includes('post to') ||
      goalLower.includes('upload to') ||
      goalLower.includes('instagram') ||
      goalLower.includes('youtube');

    const isCodingTask =
      goalLower.includes('code') ||
      goalLower.includes('build') ||
      goalLower.includes('debug') ||
      goalLower.includes('refactor') ||
      goalLower.includes('typescript');

    const isResearchTask =
      goalLower.includes('research') ||
      goalLower.includes('analyze') ||
      goalLower.includes('benchmark') ||
      goalLower.includes('trends');

    const steps: PlanStep[] = [];

    // Step 1: Goal Understanding & Strategy
    steps.push({
      id: `${planId}_s1`,
      role: 'general_director',
      description: 'Analyze goal constraints, budget boundaries (₹0/mo), and routing requirements',
      requiredCapabilities: ['REASONING', 'TEXT_OUTPUT'],
      status: 'pending',
      requiresHumanApproval: false,
    });

    if (isResearchTask || isPublishingTask) {
      steps.push({
        id: `${planId}_s2`,
        role: 'research_specialist',
        description: 'Verify facts, extract source citations, and assess viral retention patterns',
        requiredCapabilities: ['LONG_CONTEXT', 'TEXT_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      });
    }

    if (isCodingTask) {
      steps.push({
        id: `${planId}_s_code`,
        role: 'coding_architect',
        description: 'Generate type-safe implementations, AST validation, and unit test invariants',
        requiredCapabilities: ['CODE_GENERATION', 'STRUCTURED_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      });
    }

    if (isPublishingTask) {
      steps.push({
        id: `${planId}_s_creator`,
        role: 'creator_strategist',
        description: 'Format 9:16 vertical video script, title hook, caption, and hashtags',
        requiredCapabilities: ['TEXT_OUTPUT', 'STRUCTURED_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: false,
      });

      // Strict Human Approval Brake for Social Publishing
      steps.push({
        id: `${planId}_s_approval`,
        role: 'safety_auditor',
        description: 'Human-in-the-loop safety brake: creator must verify preview before dispatch',
        requiredCapabilities: ['TEXT_OUTPUT'],
        status: 'pending',
        requiresHumanApproval: true,
        approvalType: 'social_publishing',
      });
    }

    // Final Synthesis Step
    steps.push({
      id: `${planId}_s_final`,
      role: 'general_director',
      description: 'Deliver structured results with empirical evidence and latency telemetry',
      requiredCapabilities: ['TEXT_OUTPUT'],
      status: 'pending',
      requiresHumanApproval: false,
    });

    return {
      id: planId,
      userGoal,
      steps,
      currentStepIndex: 0,
      status: 'planning',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Execute the next step in an active agent plan
   */
  public static async executeNextStep(plan: AgentPlan): Promise<{
    plan: AgentPlan;
    stepResponse?: InferenceResponse;
    requiresApproval: boolean;
  }> {
    if (plan.currentStepIndex >= plan.steps.length) {
      plan.status = 'completed';
      return { plan, requiresApproval: false };
    }

    const currentStep = plan.steps[plan.currentStepIndex];

    // Check if step requires human authorization
    if (currentStep.requiresHumanApproval && currentStep.status === 'pending') {
      currentStep.status = 'requires_approval';
      plan.status = 'paused_for_approval';
      return { plan, requiresApproval: true };
    }

    currentStep.status = 'in_progress';
    plan.status = 'executing';

    const t0 = Date.now();
    try {
      const response = await MultimodalModelRouter.execute({
        taskCategory:
          currentStep.role === 'coding_architect'
            ? 'coding'
            : currentStep.role === 'research_specialist'
            ? 'research'
            : 'reasoning',
        requiredCapabilities: currentStep.requiredCapabilities,
        messages: [
          {
            role: 'system',
            content: `You are the RIIQX ${currentStep.role}. Execute this exact step: ${currentStep.description}. Context user goal: ${plan.userGoal}`,
          },
          {
            role: 'user',
            content: `Execute step: ${currentStep.description}`,
          },
        ],
        maxTokens: 500,
      });

      currentStep.status = 'completed';
      currentStep.result = response.reply;
      currentStep.latencyMs = Date.now() - t0;
      plan.currentStepIndex += 1;

      if (plan.currentStepIndex >= plan.steps.length) {
        plan.status = 'completed';
      }

      return { plan, stepResponse: response, requiresApproval: false };
    } catch (err: unknown) {
      currentStep.status = 'failed';
      currentStep.result = err instanceof Error ? err.message : String(err);
      plan.status = 'failed';
      throw err;
    }
  }
}

