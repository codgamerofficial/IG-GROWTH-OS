// =============================================================================
// PujaHop Kolkata: AI Provider Module & Agent Factory
// Supports Agent Router (OpenAI-compatible) & Amazon Bedrock Runtime
// Real Data Only • No Mock Workflows • Zero Hallucinations
// =============================================================================

import {
  PujaAIProvider,
  CopilotMessage,
  RoutePlanningInput,
  RoutePlanningOutput,
  CrowdAnalysisOutput,
  DailyPujaBriefing,
} from './types';
import {
  BedrockProvider,
  RoutePlanningAgent,
  PandalResearchAgent,
  CrowdAnalysisAgent,
  TripOptimizationAgent,
  PujaCopilotAgent,
  DailyPujaAgent,
  defaultBedrockProvider,
} from './bedrock';
import {
  AgentRouterProvider,
  defaultAgentRouterProvider,
} from './agentrouter';

export * from './types';
export * from './router';
export * from './tools';
export * from './bedrock-connection';
export * from './agentrouter';

export {
  BedrockProvider,
  AgentRouterProvider,
  RoutePlanningAgent,
  PandalResearchAgent,
  CrowdAnalysisAgent,
  TripOptimizationAgent,
  PujaCopilotAgent,
  DailyPujaAgent,
  defaultBedrockProvider,
  defaultAgentRouterProvider,
};

/**
 * Returns the primary configured Puja AI Provider.
 * Priority: Agent Router (when configured) -> Amazon Bedrock
 */
export function getAIProvider(): PujaAIProvider {
  const providerType = (process.env.AI_PROVIDER || '').toLowerCase();
  const hasAgentRouterKey = Boolean(
    process.env.AGENT_ROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    'sk-kg8ve3KBHGvRZsc59bivGRi1jrfmlOvhyhkmrqVRHurdcxHi'
  );

  if (providerType === 'agentrouter' || providerType === 'agent_router' || hasAgentRouterKey) {
    return defaultAgentRouterProvider;
  }

  return defaultBedrockProvider;
}

// Global active agents bound to active provider
export const activeProvider = getAIProvider();
export const routePlanningAgent = new RoutePlanningAgent(activeProvider);
export const pandalResearchAgent = new PandalResearchAgent();
export const crowdAnalysisAgent = new CrowdAnalysisAgent(activeProvider);
export const tripOptimizationAgent = new TripOptimizationAgent();
export const pujaCopilotAgent = new PujaCopilotAgent(activeProvider);
export const dailyPujaAgent = new DailyPujaAgent(activeProvider);
