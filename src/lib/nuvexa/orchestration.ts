// =============================================================================
// NUVEXA AI — Model Orchestration, Streaming & Live Health Engine
// Zero-Fabrication • Timeout Handling • Graceful Offline Fallbacks
// =============================================================================

import { NUVEXA_MODELS, NuvexaModel, ProviderHealth } from './models';
import { bedrockConnection } from '@/lib/ai/bedrock-connection';
import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const OLLAMA_DEFAULT_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OPENAI_COMPATIBLE_BASE = process.env.OPENAI_COMPATIBLE_BASE_URL || '';

/**
 * Check the real-time health of model providers without faking
 */
export async function checkProviderHealth(): Promise<{
  ollama: ProviderHealth;
  openaiCompatible: ProviderHealth;
  bedrock: ProviderHealth;
}> {
  // 1. Probe Ollama
  const ollamaHealth: ProviderHealth = {
    provider: 'ollama',
    status: 'checking',
    endpoint: OLLAMA_DEFAULT_BASE,
    availableModels: [],
  };

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${OLLAMA_DEFAULT_BASE}/api/tags`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models.map((m: { name: string }) => m.name) : [];
      ollamaHealth.status = 'online';
      ollamaHealth.latencyMs = Date.now() - startTime;
      ollamaHealth.availableModels = models;
      ollamaHealth.checkedAt = new Date().toISOString();
    } else {
      ollamaHealth.status = 'offline';
      ollamaHealth.errorMessage = `Ollama responded with HTTP ${res.status}`;
    }
  } catch {
    ollamaHealth.status = 'offline';
    ollamaHealth.errorMessage = 'Connection refused. Ensure Ollama is running (`ollama serve`).';
    ollamaHealth.checkedAt = new Date().toISOString();
  }

  // 2. Probe OpenAI Compatible Server (if configured)
  const openaiHealth: ProviderHealth = {
    provider: 'openai-compatible',
    status: OPENAI_COMPATIBLE_BASE ? 'checking' : 'unconfigured',
    endpoint: OPENAI_COMPATIBLE_BASE || 'Not configured',
    availableModels: [],
  };

  if (OPENAI_COMPATIBLE_BASE) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${OPENAI_COMPATIBLE_BASE}/models`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        openaiHealth.status = 'online';
        openaiHealth.availableModels = Array.isArray(data.data) ? data.data.map((m: { id: string }) => m.id) : [];
      } else {
        openaiHealth.status = 'offline';
      }
    } catch {
      openaiHealth.status = 'offline';
    }
  }

  // 3. Probe AWS Bedrock (if configured)
  const region = process.env.AWS_REGION || 'ap-southeast-2';
  const modelId = process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6';
  const hasBedrockConfig = Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
      process.env.AWS_BEARER_TOKEN_BEDROCK ||
      process.env.BEDROCK_API_KEY
  );

  const bedrockHealth: ProviderHealth = {
    provider: 'bedrock',
    status: hasBedrockConfig ? 'checking' : 'unconfigured',
    endpoint: `AWS Bedrock (${region})`,
    availableModels: [modelId],
    checkedAt: new Date().toISOString(),
  };

  if (hasBedrockConfig) {
    try {
      const bTest = await bedrockConnection.testConnection();
      bedrockHealth.latencyMs = bTest.latencyMs;
      if (bTest.inferenceSuccessful) {
        bedrockHealth.status = 'online';
      } else if (bTest.authorized || bTest.errorCode === 'ThrottlingException') {
        bedrockHealth.status = 'online';
        bedrockHealth.errorMessage = bTest.errorMessage;
      } else {
        bedrockHealth.status = 'offline';
        bedrockHealth.errorMessage = bTest.errorMessage;
      }
    } catch (err: unknown) {
      bedrockHealth.status = 'offline';
      bedrockHealth.errorMessage = err instanceof Error ? err.message : 'Bedrock probe error';
    }
  }

  return { ollama: ollamaHealth, openaiCompatible: openaiHealth, bedrock: bedrockHealth };
}

/**
 * Streaming inference dispatch with provider fallback
 */
export async function streamChatCompletion({
  model,
  messages,
  signal,
  onChunk,
}: {
  model: NuvexaModel;
  messages: { role: string; content: string }[];
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
}): Promise<{ fullText: string; tokensEstimated: number }> {
  // If Ollama is target
  if (model.provider === 'ollama') {
    try {
      const response = await fetch(`${OLLAMA_DEFAULT_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model.modelString,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Ollama returned empty response stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.trim() !== '');

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              const chunk = parsed.message.content;
              fullText += chunk;
              onChunk(chunk);
            }
          } catch {
            // Partial JSON chunk - ignore and continue
          }
        }
      }

      return {
        fullText,
        tokensEstimated: Math.ceil(fullText.length / 4),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown connection error';

      // Honest, non-fabricated offline message explaining exact status & how to run
      const offlineFallback = `> ⚠️ **Provider Notice: Local Model Offline**
> Model \`${model.name}\` could not be contacted at \`${OLLAMA_DEFAULT_BASE}\`.
> **Root Cause:** ${errorMsg}
> 
> **How to activate this model:**
> 1. Ensure Ollama is installed from [ollama.com](https://ollama.com).
> 2. Open your terminal and pull the model:
>    \`\`\`bash
>    ollama run ${model.modelString}
>    \`\`\`
> 3. Once running, retry this prompt. NUVEXA will immediately connect without restarting.`;

      onChunk(offlineFallback);
      return {
        fullText: offlineFallback,
        tokensEstimated: 80,
      };
    }
  }

  // If AWS Bedrock is target
  if (model.provider === 'bedrock') {
    try {
      const client = bedrockConnection.createClient(false);
      const targetModel =
        model.modelString || process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6';

      const command = new ConverseCommand({
        modelId: targetModel,
        messages: messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: [{ text: m.content }],
        })),
        inferenceConfig: {
          maxTokens: 2048,
          temperature: 0.7,
        },
      });

      let response;
      try {
        response = await client.send(command);
      } catch (firstErr: any) {
        const hasBearer = Boolean(
          process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY
        );
        if (firstErr.name === 'ExpiredTokenException' && hasBearer) {
          const bearerClient = bedrockConnection.createClient(true);
          response = await bearerClient.send(command);
        } else {
          throw firstErr;
        }
      }

      const reply = response.output?.message?.content?.[0]?.text || '';
      onChunk(reply);
      return {
        fullText: reply,
        tokensEstimated: Math.ceil(reply.length / 4),
      };
    } catch (err: any) {
      const isThrottled =
        err.name === 'ThrottlingException' || err.message?.includes('Too many tokens');
      const isAuthError =
        err.name === 'UnrecognizedClientException' || err.name === 'AccessDeniedException';

      let notice = `> ⚠️ **AWS Bedrock Provider Notice**\n> Status: \`${err.name || 'Inference Error'}\`\n> Details: ${err.message}\n`;
      if (isThrottled) {
        notice += `>\n> 💡 **AWS Daily Quota Limit:** Bedrock's daily token allocation has been reached for today. You can continue conversations seamlessly by switching to local open-weight models (Llama 3.2, Mistral, Qwen, DeepSeek) in the top model selector.`;
      } else if (isAuthError) {
        notice += `>\n> 💡 **AWS Permissions Notice:** Ensure your AWS Credentials in \`.env.local\` have \`bedrock:InvokeModel\` permissions in selected Region \`ap-southeast-2\`.`;
      }

      onChunk(notice);
      return { fullText: notice, tokensEstimated: 50 };
    }
  }

  // Fallback for custom or unconfigured endpoints
  const fallbackNotice = `> ℹ️ Provider \`${model.provider}\` is currently not configured or reachable. Check Settings to supply an active endpoint URL.`;
  onChunk(fallbackNotice);
  return { fullText: fallbackNotice, tokensEstimated: 25 };
}
