import { NextRequest, NextResponse } from 'next/server';
import { RIIQX_MODELS, RiiqxModel } from '@/lib/riiqx/models';
import { streamChatCompletion } from '@/lib/riiqx/orchestration';
import { ModelRouter, TaskType } from '@/lib/riiqx/model-router';
import { executeToolSafe, RiiqxToolResult } from '@/lib/riiqx/tools';
import { executeLiveResearch } from '@/lib/riiqx/search';
import { wrapInSecurityBarrier } from '@/lib/riiqx/documents';
import { decomposeGoalIntoPlan } from '@/lib/riiqx/planner';
import { RiiqxDocument, RiiqxSearchCitation } from '@/lib/riiqx/types';

export const dynamic = 'force-dynamic';

interface ToolExecutionCandidate {
  toolId: string;
  args: Record<string, unknown>;
}

function detectToolIntent(userText: string): ToolExecutionCandidate | null {
  const text = userText.toLowerCase();

  // 1. Script generation
  if (text.includes('script') || text.includes('write a reel') || text.includes('write a short') || text.includes('viral hook')) {
    return {
      toolId: 'generate_creator_script',
      args: { topic: userText.slice(0, 100), durationSeconds: 30, language: 'en' },
    };
  }

  // 2. Storyboard creation
  if (text.includes('storyboard') || text.includes('scene by scene') || text.includes('visual shots')) {
    return {
      toolId: 'create_storyboard',
      args: { scriptTopic: userText.slice(0, 100), sceneCount: 4 },
    };
  }

  // 3. Trends radar
  if (text.includes('trend') || text.includes('viral audio') || text.includes('hashtags') || text.includes('what is trending')) {
    return {
      toolId: 'research_trends',
      args: { niche: text.includes('tech') ? 'Tech' : text.includes('finance') ? 'Finance' : 'AI & Productivity', region: 'Global' },
    };
  }

  // 4. Analytics & Retention diagnostics
  if (text.includes('retention') || text.includes('analytics') || text.includes('views drop') || text.includes('engagement rate')) {
    return {
      toolId: 'get_creator_analytics',
      args: { channelOrPostId: 'recent_reels' },
    };
  }

  // 5. Library search
  if (text.includes('library') || text.includes('find asset') || text.includes('b-roll') || text.includes('brand kit')) {
    return {
      toolId: 'search_library',
      args: { query: userText.slice(0, 50) },
    };
  }

  // 6. Project file inspection
  if (text.includes('package.json') || text.includes('inspect code') || text.includes('inspect file') || text.includes('check project')) {
    return {
      toolId: 'inspect_project_file',
      args: { filePath: 'package.json' },
    };
  }

  // 7. Content calendar
  if (text.includes('calendar') || text.includes('schedule') || text.includes('weekly plan')) {
    return {
      toolId: 'draft_content_calendar',
      args: { niche: 'Short-Form Creators', postsPerWeek: 5 },
    };
  }

  // 8. Provider health inspection
  if (text.includes('provider health') || text.includes('model status') || text.includes('check latency') || text.includes('api status')) {
    return {
      toolId: 'inspect_provider_health',
      args: {},
    };
  }

  // 9. Autopilot workflow
  if (text.includes('run workflow') || text.includes('autopilot pipeline') || text.includes('execute workflow')) {
    return {
      toolId: 'run_ai_workflow',
      args: { workflowName: 'Autonomous Reel Synthesis Pipeline' },
    };
  }

  // 10. Master project state summary
  if (text.includes('project status') || text.includes('workspace status') || text.includes('summary of project')) {
    return {
      toolId: 'summarize_project_state',
      args: {},
    };
  }

  // 11. Publishing draft
  if (text.includes('publish') || text.includes('draft post') || text.includes('post to instagram')) {
    return {
      toolId: 'draft_social_post',
      args: { platform: 'instagram', caption: userText.slice(0, 120) },
    };
  }

  return null;
}

function detectTaskType(userText: string): TaskType {
  const text = userText.toLowerCase();
  if (text.includes('code') || text.includes('bug') || text.includes('function') || text.includes('typescript') || text.includes('error')) {
    return 'coding';
  }
  if (text.includes('script') || text.includes('reel') || text.includes('hook') || text.includes('story')) {
    return 'scriptwriting';
  }
  if (text.includes('research') || text.includes('analyze') || text.includes('source') || text.includes('verify')) {
    return 'research';
  }
  if (text.includes('why') || text.includes('solve') || text.includes('logic') || text.includes('step by step')) {
    return 'reasoning';
  }
  if (text.includes('fast') || text.includes('quick') || text.length < 20) {
    return 'fast';
  }
  return 'general';
}

function isConversationalGreeting(text: string): boolean {
  const t = text.trim().toLowerCase();
  const greetings = [
    'hi',
    'hello',
    'hey',
    'hi there',
    'hello there',
    'how are you',
    'how are you?',
    'how are you doing',
    'good morning',
    'good afternoon',
    'good evening',
    'sup',
    'yo',
    'what\'s up',
    'whats up',
  ];
  return (
    greetings.includes(t) ||
    (t.length <= 15 && (t.startsWith('hi') || t.startsWith('hello') || t.startsWith('hey')))
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload.' }, { status: 400 });
    }

    const { modelId, messages, enableWebSearch, documents, stream: requestStreaming } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    // Filter out messages with empty content to prevent provider rejection
    const validMessages = messages.filter(
      (m: any) => typeof m?.content === 'string' && m.content.trim().length > 0
    );

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: 'At least one message with non-empty content is required.' },
        { status: 400 }
      );
    }

    const lastUserMessage = validMessages[validMessages.length - 1];
    const taskType = detectTaskType(lastUserMessage.content);

    // Resolve model using intelligent router
    const route = ModelRouter.routeModelForTask(taskType, modelId);
    const targetModel: RiiqxModel = route.selectedModel;

    let augmentedUserContent = lastUserMessage.content;
    let citations: RiiqxSearchCitation[] = [];
    let executedToolResults: RiiqxToolResult[] = [];

    // 1. Tool Intent Detection & Server-Side Controlled Execution (skip for greetings)
    if (!isConversationalGreeting(lastUserMessage.content)) {
      const candidateTool = detectToolIntent(lastUserMessage.content);
      if (candidateTool) {
        try {
          const toolResult = await executeToolSafe(candidateTool.toolId, candidateTool.args);
          executedToolResults.push(toolResult);

          // Ground the LLM prompt with verified tool outputs
          augmentedUserContent = `[SYSTEM TOOL CONTEXT — Tool: ${candidateTool.toolId}]
Summary: ${toolResult.summary}
Output Data: ${JSON.stringify(toolResult.data)}
${toolResult.needsApproval ? `⚠️ ACTION GATE: ${toolResult.approvalPrompt}` : ''}
[END TOOL CONTEXT]

User Request:
${augmentedUserContent}`;
        } catch (toolErr) {
          // Continue even if tool execution fails
        }
      }
    }

    // 2. Web Research Integration (strictly disabled for greetings or when research yields no citations)
    if (enableWebSearch && !isConversationalGreeting(lastUserMessage.content)) {
      try {
        const research = await executeLiveResearch(lastUserMessage.content);
        citations = research.citations || [];
        if (research.formattedContext) {
          augmentedUserContent = `${research.formattedContext}\n\nUser Question:\n${augmentedUserContent}`;
        }
      } catch {
        citations = [];
      }
    } else {
      citations = [];
    }

    // 3. Untrusted Document Sandbox (if files attached)
    if (Array.isArray(documents) && documents.length > 0) {
      const docContext = documents
        .map((doc: RiiqxDocument) => wrapInSecurityBarrier(doc))
        .join('\n\n');
      augmentedUserContent = `${docContext}\n\n${augmentedUserContent}`;
    }

    // 4. Task Plan Detection (if user asks to plan, automate, build, or deploy)
    let taskPlan: any;
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
      ...validMessages.slice(0, -1),
      { role: lastUserMessage.role, content: augmentedUserContent },
    ];

    const acceptsSSE =
      requestStreaming === true ||
      req.headers.get('accept')?.includes('text/event-stream');

    if (acceptsSSE) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            // Initial metadata event
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'meta',
                  modelUsed: targetModel.name,
                  routerReason: route.reason,
                  isFreeTier: route.isFreeTier,
                  citations,
                  taskPlan,
                  toolResults: executedToolResults,
                })}\n\n`
              )
            );

            // Stream tool events if executed
            for (const tr of executedToolResults) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: 'tool_result',
                    toolId: tr.toolId,
                    summary: tr.summary,
                    needsApproval: tr.needsApproval,
                    approvalPrompt: tr.approvalPrompt,
                  })}\n\n`
                )
              );
            }

            let fullReply = '';
            const completionResult = await streamChatCompletion({
              model: targetModel,
              messages: processedMessages,
              signal: req.signal,
              onChunk: (chunk) => {
                fullReply += chunk;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: 'chunk',
                      text: chunk,
                    })}\n\n`
                  )
                );
              },
            });

            // Final done event
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'done',
                  fullReply: completionResult.fullText || fullReply,
                  tokensEstimated: completionResult.tokensEstimated,
                  modelUsed: targetModel.name,
                })}\n\n`
              )
            );
            controller.close();
          } catch (streamErr: unknown) {
            const errorMsg =
              streamErr instanceof Error ? streamErr.message : 'Stream inference error';
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: errorMsg,
                })}\n\n`
              )
            );
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // Fallback non-streaming JSON response
    let fullReply = '';
    const completionResult = await streamChatCompletion({
      model: targetModel,
      messages: processedMessages,
      signal: req.signal,
      onChunk: (chunk) => {
        fullReply += chunk;
      },
    });

    return NextResponse.json({
      success: true,
      reply: completionResult.fullText || fullReply,
      modelUsed: targetModel.name,
      routerReason: route.reason,
      isFreeTier: route.isFreeTier,
      citations,
      taskPlan,
      toolResults: executedToolResults,
      tokensEstimated: completionResult.tokensEstimated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Chat inference error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
