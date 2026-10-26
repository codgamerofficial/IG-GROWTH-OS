import { NextRequest, NextResponse } from 'next/server';
import { NUVEXA_MODELS } from '@/lib/nuvexa/models';
import { streamChatCompletion } from '@/lib/nuvexa/orchestration';
import { executeWebSearch, formatCitations } from '@/lib/nuvexa/search';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, modelId = 'llama-3.2-3b', enableWebSearch = false, documentContext = '' } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const selectedModel = NUVEXA_MODELS.find((m) => m.id === modelId) || NUVEXA_MODELS[0];
    const latestUserMessage = messages[messages.length - 1];

    let citationsBlock = '';
    let citationsData: Array<{ id: number; url: string; title: string; snippet: string; sourceDomain: string }> = [];

    // Optional Live Research Integration
    if (enableWebSearch && latestUserMessage?.content) {
      try {
        const searchResults = await executeWebSearch(latestUserMessage.content, 4);
        if (searchResults.length > 0) {
          const formatted = formatCitations(searchResults);
          citationsData = formatted.citations;
          citationsBlock = formatted.citationBlock;
        }
      } catch {
        // Search error gracefully ignored without fabrication
      }
    }

    // Build enhanced prompt with document context and citations
    const enhancedMessages = [...messages];
    if (documentContext) {
      enhancedMessages.unshift({
        role: 'system',
        content: `Attached Document Context:\n${documentContext}`,
      });
    }

    // Setup streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const { fullText } = await streamChatCompletion({
            model: selectedModel,
            messages: enhancedMessages,
            onChunk: (chunk: string) => {
              const data = JSON.stringify({ type: 'chunk', content: chunk });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            },
          });

          // If citations exist, stream them at the end
          if (citationsBlock) {
            const citeChunk = JSON.stringify({
              type: 'citations',
              content: citationsBlock,
              citations: citationsData,
            });
            controller.enqueue(encoder.encode(`data: ${citeChunk}\n\n`));
          }

          const doneChunk = JSON.stringify({
            type: 'done',
            modelUsed: selectedModel.name,
            totalLength: fullText.length + citationsBlock.length,
          });
          controller.enqueue(encoder.encode(`data: ${doneChunk}\n\n`));
          controller.close();
        } catch (streamErr: unknown) {
          const errText = streamErr instanceof Error ? streamErr.message : 'Streaming error';
          const errChunk = JSON.stringify({ type: 'error', error: errText });
          controller.enqueue(encoder.encode(`data: ${errChunk}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
