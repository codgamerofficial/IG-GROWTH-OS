// =============================================================================
// PujaHop Kolkata: AI Layer Types & Agent Interfaces
// Real Data Only • Amazon Bedrock Integration • Bengali & English NLP
// =============================================================================

import { Pandal, TripPlan, CrowdLevel, WeatherSnapshot, TrafficAlert } from '../types/pujahop';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: Array<{
    name: string;
    input: Record<string, unknown>;
    result?: unknown;
  }>;
  itineraryRecommendation?: TripPlan;
}

export interface RoutePlanningInput {
  date: string;
  startLocationName: string;
  startLat: number;
  startLng: number;
  startTime: string;
  endTime: string;
  walkingTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
  transportPreference: 'METRO_AND_WALK' | 'WALK_ONLY' | 'CAB_PREFERRED';
  interests: string[];
  maxPandals?: number;
}

export interface RoutePlanningOutput {
  plan: TripPlan;
  rationale: string;
  metroGuidance: string;
  crowdStrategy: string;
  diningSuggestion?: string;
}

export interface CrowdAnalysisOutput {
  pandalId: string;
  pandalName: string;
  currentCrowdLevel: CrowdLevel;
  estimatedWaitMinutes: number;
  bestVisitingWindow: string;
  peakWindow: string;
  advice: string;
}

export interface DailyPujaBriefing {
  date: string;
  tithiName: string;
  pujaStatus: string;
  weatherSummary: string;
  metroStatus: string;
  highlightPandals: string[];
  criticalTrafficAlerts: string[];
  crowdAdvisory: string;
}

export interface PujaAIProvider {
  name: string;
  planRoute(input: RoutePlanningInput): Promise<RoutePlanningOutput>;
  chatWithCopilot(messages: CopilotMessage[]): Promise<{ reply: string; proposedItinerary?: TripPlan }>;
  analyzeCrowd(pandalId: string): Promise<CrowdAnalysisOutput>;
  getDailyBriefing(dateStr: string): Promise<DailyPujaBriefing>;
}
