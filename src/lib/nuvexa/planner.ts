// =============================================================================
// NUVEXA AI — Autonomous Task Planner & Consequential Permission Gate
// State Machine • Multi-step Execution • User Authorization Safeguard
// =============================================================================

import { NuvexaTaskPlan, NuvexaSubTask, TaskStatus } from './types';

/**
 * Decompose a user prompt into a structured multi-step execution plan
 */
export function generateTaskPlan(userId: string, goal: string): NuvexaTaskPlan {
  const isCodingTask = /code|script|build|implement|debug|refactor|function|api/i.test(goal);
  const isResearchTask = /research|find|search|compare|analyze|evaluate|sources/i.test(goal);

  const steps: NuvexaSubTask[] = [];

  // Step 1: Analytical Decomposition
  steps.push({
    id: `step_1`,
    stepNumber: 1,
    title: 'Decompose Objectives & Constraints',
    description: 'Parse requirements, isolate functional parameters, and identify dependencies.',
    status: 'pending',
    requiresPermission: false,
    outputLog: ['Analyzing target parameters...', 'Constraint matrix constructed.'],
  });

  if (isResearchTask || isCodingTask) {
    // Step 2: Information Retrieval & Documentation Lookup (Requires Network Permission)
    steps.push({
      id: `step_2`,
      stepNumber: 2,
      title: 'Query External Knowledge & Specifications',
      description: 'Fetch official API documentation, open-source references, and verified citations.',
      status: 'pending',
      requiresPermission: true,
      toolName: 'web_search_and_docs',
      outputLog: [],
    });
  }

  if (isCodingTask) {
    // Step 3: Synthesis & Implementation (Safe generation)
    steps.push({
      id: `step_3`,
      stepNumber: steps.length + 1,
      title: 'Synthesize Solution Architecture & Code',
      description: 'Generate modular TypeScript/Python code following strict typing and security rules.',
      status: 'pending',
      requiresPermission: false,
      toolName: 'code_generator',
      outputLog: [],
    });

    // Step 4: Verification & Linting (Requires Sandbox Execution Permission)
    steps.push({
      id: `step_4`,
      stepNumber: steps.length + 1,
      title: 'Sandboxed Syntax & Security Audit',
      description: 'Validate against AST vulnerabilities, potential memory leaks, and type mismatches.',
      status: 'pending',
      requiresPermission: true,
      toolName: 'sandbox_executor',
      outputLog: [],
    });
  } else {
    // Step 3 for General/Research: Synthesis
    steps.push({
      id: `step_3`,
      stepNumber: steps.length + 1,
      title: 'Synthesize Findings & Formulate Strategy',
      description: 'Structure insights with verified footnotes, edge cases, and actionable next steps.',
      status: 'pending',
      requiresPermission: false,
      toolName: 'synthesis_engine',
      outputLog: [],
    });
  }

  // Final Step: Deliverable Verification
  steps.push({
    id: `step_${steps.length + 1}`,
    stepNumber: steps.length + 1,
    title: 'Final Quality Review & Verification',
    description: 'Ensure all user constraints and zero-fabrication criteria are satisfied.',
    status: 'pending',
    requiresPermission: false,
    outputLog: [],
  });

  return {
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    title: goal.length > 50 ? goal.slice(0, 48) + '...' : goal,
    goal,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    steps,
    currentStepIndex: 0,
    canRetry: true,
  };
}

/**
 * Advance task state machine by one step
 */
export function advanceTaskStep(
  plan: NuvexaTaskPlan,
  permissionGranted?: boolean
): { updatedPlan: NuvexaTaskPlan; actionRequired?: 'permission' | 'none' } {
  const currentStep = plan.steps[plan.currentStepIndex];

  if (!currentStep) {
    plan.status = 'completed';
    return { updatedPlan: plan, actionRequired: 'none' };
  }

  // If step requires permission and hasn't been granted yet
  if (currentStep.requiresPermission && !permissionGranted && !currentStep.permissionGranted) {
    currentStep.status = 'paused';
    plan.status = 'paused';
    return { updatedPlan: plan, actionRequired: 'permission' };
  }

  if (permissionGranted) {
    currentStep.permissionGranted = true;
  }

  // Mark step running then completed
  currentStep.status = 'completed';
  if (!currentStep.outputLog) currentStep.outputLog = [];
  currentStep.outputLog.push(`Step ${currentStep.stepNumber} successfully validated.`);

  // Move to next step
  if (plan.currentStepIndex + 1 < plan.steps.length) {
    plan.currentStepIndex++;
    plan.steps[plan.currentStepIndex].status = 'running';
    plan.status = 'running';

    if (plan.steps[plan.currentStepIndex].requiresPermission) {
      plan.steps[plan.currentStepIndex].status = 'paused';
      plan.status = 'paused';
      return { updatedPlan: plan, actionRequired: 'permission' };
    }
  } else {
    plan.status = 'completed';
  }

  plan.updatedAt = new Date().toISOString();
  return { updatedPlan: plan, actionRequired: 'none' };
}

/**
 * Cancel an in-flight task plan
 */
export function cancelTaskPlan(plan: NuvexaTaskPlan): NuvexaTaskPlan {
  plan.status = 'cancelled';
  for (const step of plan.steps) {
    if (step.status === 'pending' || step.status === 'running' || step.status === 'paused') {
      step.status = 'cancelled';
    }
  }
  plan.updatedAt = new Date().toISOString();
  return plan;
}
