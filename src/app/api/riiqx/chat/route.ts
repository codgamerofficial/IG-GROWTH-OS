import { NextRequest, NextResponse } from 'next/server';
import { RIIQX_MODELS, RiiqxModel } from '@/lib/riiqx/models';
import { streamChatCompletion } from '@/lib/riiqx/orchestration';
import { executeLiveResearch, formatCitationsToContext } from '@/lib/riiqx/search';
import { wrapInSecurityBarrier } from '@/lib/riiqx/documents';
import { decomposeGoalIntoPlan } from '@/lib/riiqx/planner';
import { RiiqxDocument, RiiqxSearchCitation } from '@/lib/riiqx/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload.' }, { status: 400 });
    }

    const { modelId, messages, enableWebSearch, documents } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    // Resolve target model (default: AWS Bedrock Claude Sonnet)
    const targetModel: RiiqxModel =
      RIIQX_MODELS.find((m) => m.id === modelId) || RIIQX_MODELS[0];

    const lastUserMessage = messages[messages.length - 1];
    let augmentedUserContent = lastUserMessage.content;
    let citations: RiiqxSearchCitation[] = [];

    // 1. Web Research Integration (if enabled)
    if (enableWebSearch) {
      const research = await executeLiveResearch(lastUserMessage.content);
      citations = research.citations;
      if (research.formattedContext) {
        augmentedUserContent = `${research.formattedContext}\n\nUser Question:\n${augmentedUserContent}`;
      }
    }

    // 2. Untrusted Document Sandbox (if files attached)
    if (Array.isArray(documents) && documents.length > 0) {
      const docContext = documents
        .map((doc: RiiqxDocument) => wrapInSecurityBarrier(doc))
        .join('\n\n');
      augmentedUserContent = `${docContext}\n\n${augmentedUserContent}`;
    }

    // 3. Task Plan Detection (if user asks to plan, automate, build, or deploy)
    let taskPlan;
    const lowerContent = lastUserMessage.content.toLowerCase();
    if (
      lowerContent.startsWith('plan') ||
      lowerContent.includes('create a plan') ||
      lowerContent.includes('step by step') ||
      lowerContent.includes('autopilot') ||
      lowerContent.includes('deploy')
    ) {
      taskPlan = decomposeGoalIntoPlan(lastUserMessage.content);
    }

    const processedMessages = [
      ...messages.slice(0, -1),
      { role: lastUserMessage.role, content: augmentedUserContent },
    ];

    let fullReply = '';
    const completionResult = await streamChatCompletion({
      model: targetModel,
      messages: processedMessages,
      onChunk: (chunk) => {
        fullReply += chunk;
      },
    });

    return NextResponse.json({
      success: true,
      reply: completionResult.fullText || fullReply,
      modelUsed: targetModel.name,
      citations,
      taskPlan,
      tokensEstimated: completionResult.tokensEstimated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Chat inference error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
