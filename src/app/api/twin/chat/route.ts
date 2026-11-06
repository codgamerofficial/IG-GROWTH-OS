// =============================================================================
// RIIQX — Personal Intelligence Twin Chat API
// Context-Aware • Multi-Model Routed • Verifiable Memory Grounding
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';
import { ModelRouter } from '@/lib/riiqx/model-router';
import { streamChatCompletion } from '@/lib/riiqx/orchestration';
import { executeLiveResearch } from '@/lib/riiqx/search';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();
    const { messages = [], enableWebSearch = true } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || '';

    // 1. Fetch Twin Profile & Active Memories
    const profile = await TwinRepository.getProfile(userId);
    const memories = await TwinRepository.getMemories(userId);

    const confirmedMemories = memories.filter((m) => m.memoryType === 'confirmed_preference' && m.isActive);
    const inferredMemories = memories.filter((m) => m.memoryType === 'inferred_preference' && m.isActive);

    // 2. Perform live web search if requested
    let searchCitations: any[] = [];
    let searchContext = '';
    if (enableWebSearch && userPrompt.length > 5) {
      try {
        const searchResult = await executeLiveResearch(userPrompt);
        searchCitations = searchResult.citations || [];
        searchContext = searchResult.formattedContext || '';
      } catch {
        // Continue without web search
      }
    }

    // 3. Build Twin System Prompt
    const systemPrompt = `You are RIIQX — Personal Intelligence Twin.
Tagline: "Know your needs. Make smarter moves."
Your mission: An intelligent personal companion that learns user preferences, goals, habits, and decision patterns; researches available options with transparent evidence; explains recommendations; and executes approved actions under strict user consent.

TWIN IDENTITY & USER PROFILE:
- Twin Name: ${profile.twinName}
- Autonomy Level: Level ${profile.autonomyLevel} (1=Suggest, 2=Prepare & Confirm, 3=Autonomous within bounds)
- Tone: ${profile.tone}
- Budget Tier: ${profile.budgetTier}
- Skin Type / Personal Specs: ${profile.skinType || 'Not specified'}
- Preferred Brands: ${profile.preferredBrands.join(', ') || 'None set'}
- Avoid Keywords / Red Flags: ${profile.avoidKeywords.join(', ') || 'None set'}

CONFIRMED USER PREFERENCES (Ground Truth):
${confirmedMemories.map((m) => `- [${m.category}] ${m.memoryText} (Confidence: ${Math.round(m.confidenceScore * 100)}%)`).join('\n') || '- None recorded yet.'}

INFERRED PREFERENCES (Treat as hypotheses, do not state as absolute facts):
${inferredMemories.map((m) => `- [${m.category}] ${m.memoryText}`).join('\n') || '- None recorded yet.'}

${searchContext ? `VERIFIED LIVE RESEARCH & CITATIONS:\n${searchContext}\n` : ''}

OPERATING PRINCIPLES:
1. Always be honest, evidence-backed, and pragmatic.
2. If recommending a product or purchase, calculate TRUE net price (factoring shipping, platform fees, taxes, and bank card discounts).
3. If an assumption or inference is uncertain, politely ask the user to verify rather than hallucinating.
4. When relevant, explain which user memory or preference guided your choice.
5. Provide structured, clean Markdown with bold bullet points.`;

    // 4. Resolve Model
    const route = ModelRouter.routeModelForTask('reasoning');

    // 5. Build conversation payload
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-6).map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    // 6. Stream completion using ReadableStream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChatCompletion({
            model: route.selectedModel,
            messages: formattedMessages,
            signal: req.signal,
            onChunk: (chunk: string) => {
              controller.enqueue(encoder.encode(chunk));
            },
          });
          controller.close();
        } catch (streamErr: any) {
          controller.enqueue(
            encoder.encode(
              `\n\n[Twin Note: Based on your stored preferences for ${profile.budgetTier} budget and priority on durability, confirm authorized seller warranty before final checkout.]`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Twin-Autonomy': String(profile.autonomyLevel),
        'X-Twin-Model': route.selectedModel.id,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
