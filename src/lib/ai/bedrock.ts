// =============================================================================
// PujaHop Kolkata: Amazon Bedrock Runtime Provider & AI Agents
// Implementation: Real AWS Bedrock Converse API with Tool-Calling & Honest Diagnostics
// =============================================================================

import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from '@aws-sdk/client-bedrock-runtime';
import {
  PujaAIProvider,
  CopilotMessage,
  RoutePlanningInput,
  RoutePlanningOutput,
  CrowdAnalysisOutput,
  DailyPujaBriefing,
} from './types';
import { ModelRouter, AIWorkflowType } from './router';
import { bedrockTools, executeBedrockTool } from './tools';
import { bedrockConnection } from './bedrock-connection';
import { optimizePujaItinerary } from '../routing/optimizer';
import { VERIFIED_KOLKATA_PANDALS } from '../data/kolkata-pandals';
import { VERIFIED_METRO_STATIONS, getMetroOperatingSchedule } from '../data/kolkata-metro';
import { VERIFIED_TRAFFIC_ALERTS } from '../data/kolkata-traffic';
import { PUJA_CALENDAR_2026, getCalendarDay } from '../data/kolkata-calendar';
import { fetchLiveKolkataWeather } from '../weather/service';
import { TripPlan } from '../types/pujahop';

export class BedrockProvider implements PujaAIProvider {
  public name = 'BedrockProvider';
  private client: BedrockRuntimeClient | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient(): void {
    try {
      this.client = bedrockConnection.createClient(false);
    } catch (err) {
      console.error('[BedrockProvider] AWS Bedrock client init error:', err);
      this.client = null;
    }
  }

  /**
   * Helper to execute Amazon Bedrock ConverseCommand with tool-calling
   */
  private async runConverse(params: {
    workflow: AIWorkflowType;
    systemPrompt: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    enableTools?: boolean;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{ text: string; toolCallsMade?: Array<{ name: string; input: Record<string, unknown>; result: unknown }> }> {
    if (!this.client) {
      throw new Error('BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED: BedrockRuntimeClient is not initialized.');
    }

    if (!ModelRouter.isBedrockConfigured()) {
      throw new Error('BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED: AWS credentials (Bearer Token or IAM keys) not found.');
    }

    const modelId = ModelRouter.getModelId(params.workflow);

    const formattedMessages: Message[] = params.messages.map((m) => ({
      role: m.role,
      content: [{ text: m.content }],
    }));

    const toolCallsMade: Array<{ name: string; input: Record<string, unknown>; result: unknown }> = [];

    try {
      const command = new ConverseCommand({
        modelId,
        system: [{ text: params.systemPrompt }],
        messages: formattedMessages,
        inferenceConfig: {
          maxTokens: params.maxTokens || 2048,
          temperature: params.temperature ?? 0.7,
        },
        toolConfig: params.enableTools ? { tools: bedrockTools } : undefined,
      });

      let response;
      try {
        response = await this.client.send(command);
      } catch (firstErr: any) {
        const hasBearer = Boolean(process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY);
        if (firstErr.name === 'ExpiredTokenException' && hasBearer) {
          this.client = bedrockConnection.createClient(true);
          response = await this.client.send(command);
        } else {
          throw firstErr;
        }
      }

      // Check for tool use
      const messageContent = response.output?.message?.content;
      if (messageContent) {
        for (const block of messageContent) {
          if (block.toolUse) {
            const toolUse = block.toolUse;
            const toolName = toolUse.name || '';
            const toolInput = (toolUse.input as Record<string, unknown>) || {};

            console.log(`[BedrockProvider] Model requested tool: ${toolName}`);
            const toolResult = await executeBedrockTool(toolName, toolInput);
            toolCallsMade.push({ name: toolName, input: toolInput, result: toolResult });

            // Follow-up request with tool result
            const followUpMessages: Message[] = [
              ...formattedMessages,
              {
                role: 'assistant',
                content: [{ toolUse }],
              },
              {
                role: 'user',
                content: [
                  {
                    toolResult: {
                      toolUseId: toolUse.toolUseId,
                      content: [{ text: JSON.stringify(toolResult) }],
                    },
                  },
                ],
              },
            ];

            const followUpCommand = new ConverseCommand({
              modelId,
              system: [{ text: params.systemPrompt }],
              messages: followUpMessages,
              inferenceConfig: { maxTokens: params.maxTokens || 2048 },
            });

            const followUpResponse = await this.client.send(followUpCommand);
            const textBlocks = followUpResponse.output?.message?.content?.filter((b) => b.text);
            if (textBlocks && textBlocks.length > 0) {
              return {
                text: textBlocks.map((b) => b.text).join('\n'),
                toolCallsMade,
              };
            }
          }
        }

        const textBlocks = messageContent.filter((b) => b.text);
        if (textBlocks.length > 0) {
          return {
            text: textBlocks.map((b) => b.text).join('\n'),
            toolCallsMade,
          };
        }
      }

      return { text: '', toolCallsMade };
    } catch (err: any) {
      console.error('[BedrockProvider] Converse execution failed:', err.name, err.message);
      if (err.name === 'ThrottlingException' || err.message?.includes('Too many tokens per day')) {
        throw new Error('BLOCKED — AWS BEDROCK: Daily token limit reached. Quota increase or account upgrade required.');
      }
      throw new Error(`BLOCKED — AWS BEDROCK: ${err.message || 'Execution error'}`);
    }
  }

  /**
   * 1. Plan Route
   */
  public async planRoute(input: RoutePlanningInput): Promise<RoutePlanningOutput> {
    const plan = await optimizePujaItinerary({
      date: input.date,
      startLocation: { name: input.startLocationName, lat: input.startLat, lng: input.startLng },
      startTime: input.startTime,
      endTime: input.endTime,
      walkingTolerance: input.walkingTolerance,
      transportPreference: input.transportPreference,
      interests: input.interests,
      maxPandals: input.maxPandals,
    });

    const metroSchedule = getMetroOperatingSchedule(input.date);

    return {
      plan,
      rationale: plan.ai_reasoning || 'Optimized for minimal backtracking and verified opening status.',
      metroGuidance: metroSchedule.notes,
      crowdStrategy: `To avoid peak congestion, proceed in order from ${plan.stops[1]?.custom_name || 'first pandal'} and maintain the estimated 45-minute viewing cadence.`,
      diningSuggestion: plan.stops.find((s) => s.stop_type === 'FOOD')?.custom_name,
    };
  }

  /**
   * 2. Chat with Puja Copilot
   */
  public async chatWithCopilot(
    messages: CopilotMessage[]
  ): Promise<{ reply: string; proposedItinerary?: TripPlan }> {
    const lastMsg = messages[messages.length - 1]?.content || '';

    // Check if the user is asking to plan a trip
    const isPlanningIntent =
      lastMsg.toLowerCase().includes('plan') ||
      lastMsg.toLowerCase().includes('route') ||
      lastMsg.includes('বেরোব') ||
      lastMsg.includes('প্যান্ডেল') ||
      lastMsg.includes('pandal');

    let proposedItinerary: TripPlan | undefined;

    if (isPlanningIntent) {
      try {
        // Detect constraints from prompt
        const maxPandals = lastMsg.includes('10') ? 8 : lastMsg.includes('5') ? 5 : 6;
        const startTime = lastMsg.includes('2') || lastMsg.includes('২') ? '14:00' : '15:00';
        const endTime = lastMsg.includes('10') || lastMsg.includes('১০') ? '22:00' : '23:00';

        proposedItinerary = await optimizePujaItinerary({
          date: '2026-10-18', // Default Saptami peak
          startLocation: { name: 'Kolkata Central', lat: 22.5694, lng: 88.3608 },
          startTime,
          endTime,
          walkingTolerance: lastMsg.includes('বেশি হাঁটতে পারব না') ? 'LOW' : 'MEDIUM',
          transportPreference: 'METRO_AND_WALK',
          maxPandals,
        });
      } catch (e) {
        // Continue
      }
    }

    try {
      const systemPrompt = `You are PujaCopilot, the expert AI travel companion for Kolkata Durga Puja.
You speak fluent Bengali (বাংলা) and English.
Philosophy: "সব প্যান্ডেল দেখানো নয় — তোমার হাতে যত সময় আছে তার মধ্যে সবচেয়ে ভালো combination দেখানো।"
Always provide accurate, verified facts. Never invent fake pandal names or imaginary metro routes.
Today's Date: 2026-10-08.
Puja 2026 dates: Mahalaya: 10 Oct, Chaturthi (Pre-Puja): 14 Oct, Shashthi: 17 Oct, Saptami: 18 Oct, Ashtami: 19 Oct, Navami: 20 Oct, Dashami: 21 Oct.`;

      const response = await this.runConverse({
        workflow: 'chat',
        systemPrompt,
        messages: messages.map((m) => ({ role: m.role as any, content: m.content })),
        enableTools: true,
      });

      return {
        reply: response.text,
        proposedItinerary,
      };
    } catch (err: any) {
      // Deterministic bilingual response with honest Bedrock status
      const isBengali = /[\u0980-\u09FF]/.test(lastMsg);

      let reply = '';
      if (proposedItinerary) {
        reply = isBengali
          ? `আপনার সময় ও সুবিধার কথা মাথায় রেখে একটি অপ্টিমাইজড রুট সাজিয়েছি (${proposedItinerary.total_pandals}টি বিখ্যাত প্যান্ডেল):\n\n` +
            proposedItinerary.stops
              .filter((s) => s.stop_type === 'PANDAL')
              .map((s, idx) => `${idx + 1}. **${s.custom_name}** (${s.arrival_time} - ${s.departure_time})`)
              .join('\n') +
            `\n\n📌 মোট হাঁটার দূরত্ব: ${(proposedItinerary.total_walking_distance_meters / 1000).toFixed(1)} কিমি।\n🚇 মেট্রো ও হাঁটার কম্বিনেশন ব্যবহার করা হয়েছে যাতে বেশি হাঁটতে না হয়।\n\n*(AWS Bedrock স্ট্যাটাস: ${err.message})*`
          : `Based on your constraints, I have generated an optimized itinerary featuring ${proposedItinerary.total_pandals} top verified pandals:\n\n` +
            proposedItinerary.stops
              .filter((s) => s.stop_type === 'PANDAL')
              .map((s, idx) => `${idx + 1}. **${s.custom_name}** (${s.arrival_time} - ${s.departure_time})`)
              .join('\n') +
            `\n\nTotal walking distance: ${(proposedItinerary.total_walking_distance_meters / 1000).toFixed(1)} km.\nMetro corridors prioritized to keep walking minimal.\n\n*(AWS Bedrock diagnostic: ${err.message})*`;
      } else {
        reply = isBengali
          ? `নমস্কার! আমি পূজা হপ কোপাইলট। আমি আপনার পছন্দ ও সময় অনুযায়ী কলকাতা দুর্গাপূজার পারফেক্ট রুট তৈরি করতে পারি।\n\n*(AWS Bedrock লাইভ ডায়াগনস্টিক: ${err.message})*`
          : `Hello! I am your PujaHop Copilot. Tell me your start location, preferred date, and time window, and I will calculate the best itinerary.\n\n*(AWS Bedrock diagnostic: ${err.message})*`;
      }

      return {
        reply,
        proposedItinerary,
      };
    }
  }

  /**
   * 3. Analyze Crowd
   */
  public async analyzeCrowd(pandalId: string): Promise<CrowdAnalysisOutput> {
    const pandal = VERIFIED_KOLKATA_PANDALS.find((p) => p.id === pandalId || p.slug === pandalId);
    if (!pandal) {
      throw new Error(`Pandal not found: ${pandalId}`);
    }

    const isExtreme = pandal.crowd_score >= 9.5;
    const isHigh = pandal.crowd_score >= 8.5;

    return {
      pandalId: pandal.id,
      pandalName: pandal.name,
      currentCrowdLevel: isExtreme ? 'EXTREME' : isHigh ? 'HIGH' : 'MODERATE',
      estimatedWaitMinutes: isExtreme ? 65 : isHigh ? 40 : 20,
      bestVisitingWindow: '08:00 AM – 11:30 AM or 01:30 AM – 04:00 AM (Night Hopping)',
      peakWindow: '06:30 PM – 11:30 PM',
      advice: `Due to popularity (${pandal.overall_score}/10 score), queues are long in the evening. Arriving via ${pandal.nearest_metro} Metro avoids major road barricades.`,
    };
  }

  /**
   * 4. Daily Puja Briefing
   */
  public async getDailyBriefing(dateStr: string): Promise<DailyPujaBriefing> {
    const cal = getCalendarDay(dateStr) || PUJA_CALENDAR_2026[2];
    const weather = await fetchLiveKolkataWeather();
    const metroSchedule = getMetroOperatingSchedule(dateStr);

    return {
      date: cal.date,
      tithiName: cal.tithi_name,
      pujaStatus: cal.is_pre_puja ? 'PRE_PUJA MODE' : 'MAIN DURGA PUJA FESTIVAL',
      weatherSummary: `${weather.condition_text}, ${weather.temperature_c}°C, Humidity ${weather.humidity_percent}%`,
      metroStatus: metroSchedule.notes,
      highlightPandals: [
        'Bagbazar Sarbojanin Durgotsav',
        'College Square Sarbojanin',
        'Ekdalia Evergreen Club',
        'Kumartuli Park Sarbojanin',
      ],
      criticalTrafficAlerts: VERIFIED_TRAFFIC_ALERTS.map((a) => a.title),
      crowdAdvisory: `Anticipate ${cal.crowd_expectation} crowd pressure. Plan routes around Metro stations to bypass traffic barricades.`,
    };
  }
}

// Specialized Agents
export class RoutePlanningAgent {
  constructor(private provider: PujaAIProvider) {}
  async execute(input: RoutePlanningInput): Promise<RoutePlanningOutput> {
    return this.provider.planRoute(input);
  }
}

export class PandalResearchAgent {
  getVerifiedPandal(slugOrId: string) {
    return VERIFIED_KOLKATA_PANDALS.find((p) => p.id === slugOrId || p.slug === slugOrId);
  }
  search(query: string, area?: string) {
    let list = VERIFIED_KOLKATA_PANDALS;
    if (area) list = list.filter((p) => p.area === area);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.name_bn.includes(q) || p.theme.toLowerCase().includes(q));
    }
    return list;
  }
}

export class CrowdAnalysisAgent {
  constructor(private provider: PujaAIProvider) {}
  async analyze(pandalId: string): Promise<CrowdAnalysisOutput> {
    return this.provider.analyzeCrowd(pandalId);
  }
}

export class TripOptimizationAgent {
  /**
   * Recalculates live route if crowd or road alert triggers a bottleneck
   */
  async recalculateRoute(
    originalPlan: TripPlan,
    surgePandalId: string,
    reason = 'EXTREME crowd surge detected at stop'
  ): Promise<{
    recalculatedPlan: TripPlan;
    timeSavedMinutes: number;
    distanceChangeMeters: number;
    skippedPandalName: string;
    alternativePandalName?: string;
  }> {
    const skippedPandal = VERIFIED_KOLKATA_PANDALS.find((p) => p.id === surgePandalId);
    const skippedName = skippedPandal?.name || 'Congested Pandal';

    // Filter out the congested pandal
    const remainingPandals = originalPlan.stops
      .filter((s) => s.stop_type === 'PANDAL' && s.pandal?.id !== surgePandalId)
      .map((s) => s.pandal!);

    // Run optimization
    const newPlan = await optimizePujaItinerary({
      date: originalPlan.date,
      startLocation: {
        name: originalPlan.start_location_name,
        lat: originalPlan.start_lat,
        lng: originalPlan.start_lng,
      },
      startTime: originalPlan.start_time,
      endTime: originalPlan.end_time,
      walkingTolerance: originalPlan.walking_tolerance,
      transportPreference: originalPlan.transport_preference,
      interests: originalPlan.interests,
      maxPandals: remainingPandals.length,
      routeType: originalPlan.route_type,
    });

    const timeSaved = Math.max(15, (skippedPandal?.estimated_visit_minutes || 45) - 10);
    const distChange = newPlan.total_walking_distance_meters - originalPlan.total_walking_distance_meters;

    return {
      recalculatedPlan: newPlan,
      timeSavedMinutes: timeSaved,
      distanceChangeMeters: distChange,
      skippedPandalName: skippedName,
    };
  }
}

export class PujaCopilotAgent {
  constructor(private provider: PujaAIProvider) {}
  async chat(messages: CopilotMessage[]) {
    return this.provider.chatWithCopilot(messages);
  }
}

export class DailyPujaAgent {
  constructor(private provider: PujaAIProvider) {}
  async getBriefing(dateStr: string) {
    return this.provider.getDailyBriefing(dateStr);
  }
}

export const defaultBedrockProvider = new BedrockProvider();
export const routePlanningAgent = new RoutePlanningAgent(defaultBedrockProvider);
export const pandalResearchAgent = new PandalResearchAgent();
export const crowdAnalysisAgent = new CrowdAnalysisAgent(defaultBedrockProvider);
export const tripOptimizationAgent = new TripOptimizationAgent();
export const pujaCopilotAgent = new PujaCopilotAgent(defaultBedrockProvider);
export const dailyPujaAgent = new DailyPujaAgent(defaultBedrockProvider);
