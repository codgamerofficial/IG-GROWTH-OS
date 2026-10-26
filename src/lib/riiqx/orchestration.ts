// =============================================================================
// RIIQX — Online-First Model Orchestration, Streaming & Live Health Engine
// Server-Side Secret Isolation • AWS Bedrock Converse API • Quota-Aware
// =============================================================================

import { RIIQX_MODELS, RiiqxModel, ProviderHealth } from './models';
import { bedrockConnection } from '@/lib/ai/bedrock-connection';
import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const OLLAMA_DEFAULT_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OPENAI_COMPATIBLE_BASE =
  process.env.AGENT_ROUTER_BASE_URL || process.env.OPENAI_COMPATIBLE_BASE_URL || '';
const OPENAI_COMPATIBLE_KEY =
  process.env.AGENT_ROUTER_API_KEY ||
  process.env.AGENTROUTER_API_KEY ||
  process.env.agenrouter_api_key ||
  process.env.OPENAI_API_KEY ||
  '';

const GROQ_BASE = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env['sk-or-v1-openrouter_api_key'] ||
  '';

const OPENAI_DIRECT_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_DIRECT_KEY = process.env.OPENAI_API_KEY || '';
const NVIDIA_NIM_KEY = process.env.NVIDIA_NIM_API_KEY || process.env.Nvdia_nim_api_key || '';
const COHERE_KEY = process.env.COHERE_API_KEY || process.env.cohera_api_key || '';

/**
 * Check real-time health of online and fallback model providers
 */
export async function checkProviderHealth(): Promise<{
  bedrock: ProviderHealth;
  groq: ProviderHealth;
  openrouter: ProviderHealth;
  openai: ProviderHealth;
  agentrouter: ProviderHealth;
  ollama: ProviderHealth;
}> {
  // 1. Probe AWS Bedrock (Primary Online Provider)
  const region = process.env.AWS_REGION || 'ap-southeast-2';
  const bedrockModel = process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6';
  const hasBedrockConfig = Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
      process.env.AWS_BEARER_TOKEN_BEDROCK ||
      process.env.BEDROCK_API_KEY
  );

  const bedrockHealth: ProviderHealth = {
    provider: 'bedrock',
    status: hasBedrockConfig ? 'checking' : 'unconfigured',
    endpoint: `AWS Bedrock (${region})`,
    availableModels: [bedrockModel],
    checkedAt: new Date().toISOString(),
  };

  if (hasBedrockConfig) {
    try {
      const bTest = await bedrockConnection.testConnection();
      bedrockHealth.latencyMs = bTest.latencyMs;
      if (bTest.inferenceSuccessful) {
        bedrockHealth.status = 'online';
      } else if (bTest.authorized || bTest.errorCode === 'ThrottlingException') {
        bedrockHealth.status = 'online'; // Reachable and authorized
        bedrockHealth.errorMessage = bTest.errorMessage;
      } else {
        bedrockHealth.status = 'offline';
        bedrockHealth.errorMessage = bTest.errorMessage;
      }
    } catch (err: unknown) {
      bedrockHealth.status = 'offline';
      bedrockHealth.errorMessage = err instanceof Error ? err.message : 'Bedrock connection error';
    }
  }

  // 2. Probe Groq Cloud
  const groqHealth: ProviderHealth = {
    provider: 'groq',
    status: GROQ_API_KEY ? 'checking' : 'unconfigured',
    endpoint: GROQ_BASE,
    availableModels: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    checkedAt: new Date().toISOString(),
  };

  if (GROQ_API_KEY) {
    try {
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${GROQ_BASE}/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        groqHealth.status = 'online';
      } else {
        groqHealth.status = 'offline';
        groqHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      groqHealth.status = 'offline';
      groqHealth.errorMessage = 'Connection timeout';
    }
  }

  // 3. Probe OpenRouter
  const openrouterHealth: ProviderHealth = {
    provider: 'openrouter',
    status: OPENROUTER_API_KEY ? 'checking' : 'unconfigured',
    endpoint: OPENROUTER_BASE,
    availableModels: ['meta-llama/llama-3.3-70b-instruct'],
    checkedAt: new Date().toISOString(),
  };

  if (OPENROUTER_API_KEY) {
    try {
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${OPENROUTER_BASE}/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        openrouterHealth.status = 'online';
      } else {
        openrouterHealth.status = 'offline';
        openrouterHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      openrouterHealth.status = 'offline';
      openrouterHealth.errorMessage = 'Connection timeout';
    }
  }

  // 4. Probe OpenAI Direct
  const openaiHealth: ProviderHealth = {
    provider: 'openai',
    status: OPENAI_DIRECT_KEY && !OPENAI_DIRECT_KEY.startsWith('sk-kg8v') ? 'checking' : 'unconfigured',
    endpoint: OPENAI_DIRECT_BASE,
    availableModels: ['gpt-4o-mini', 'gpt-4o'],
    checkedAt: new Date().toISOString(),
  };

  if (OPENAI_DIRECT_KEY && !OPENAI_DIRECT_KEY.startsWith('sk-kg8v')) {
    try {
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${OPENAI_DIRECT_BASE}/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${OPENAI_DIRECT_KEY}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        openaiHealth.status = 'online';
      } else {
        openaiHealth.status = 'offline';
        openaiHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      openaiHealth.status = 'offline';
      openaiHealth.errorMessage = 'Connection timeout';
    }
  }

  // 5. Probe Agent Router / OpenAI-Compatible Gateway
  const agentRouterHealth: ProviderHealth = {
    provider: 'agentrouter',
    status: OPENAI_COMPATIBLE_BASE ? 'checking' : 'unconfigured',
    endpoint: OPENAI_COMPATIBLE_BASE || 'Not configured',
    availableModels: [],
    checkedAt: new Date().toISOString(),
  };

  if (OPENAI_COMPATIBLE_BASE) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${OPENAI_COMPATIBLE_BASE}/models`, {
        signal: controller.signal,
        headers: OPENAI_COMPATIBLE_KEY ? { Authorization: `Bearer ${OPENAI_COMPATIBLE_KEY}` } : {},
        cache: 'no-store',
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        agentRouterHealth.status = 'online';
        agentRouterHealth.availableModels = Array.isArray(data.data)
          ? data.data.map((m: { id: string }) => m.id)
          : [];
      } else {
        agentRouterHealth.status = 'offline';
        agentRouterHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      agentRouterHealth.status = 'offline';
      agentRouterHealth.errorMessage = 'Connection refused or timeout';
    }
  }

  // 6. Probe Local Ollama (Optional Fallback)
  const ollamaHealth: ProviderHealth = {
    provider: 'ollama',
    status: 'checking',
    endpoint: OLLAMA_DEFAULT_BASE,
    availableModels: [],
    checkedAt: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${OLLAMA_DEFAULT_BASE}/api/tags`, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const models = Array.isArray(data.models) ? data.models.map((m: { name: string }) => m.name) : [];
      ollamaHealth.status = 'online';
      ollamaHealth.availableModels = models;
    } else {
      ollamaHealth.status = 'offline';
    }
  } catch {
    ollamaHealth.status = 'offline';
  }

  return {
    bedrock: bedrockHealth,
    groq: groqHealth,
    openrouter: openrouterHealth,
    openai: openaiHealth,
    agentrouter: agentRouterHealth,
    ollama: ollamaHealth,
  };
}

/**
 * Online-first inference dispatch with provider fallback
 */
export async function streamChatCompletion({
  model,
  messages,
  signal,
  onChunk,
}: {
  model: RiiqxModel;
  messages: { role: string; content: string }[];
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
}): Promise<{ fullText: string; tokensEstimated: number }> {
  // --- 1. AWS Bedrock Runtime (Primary Online AI) ---
  if (model.provider === 'bedrock') {
    try {
      const client = bedrockConnection.createClient(false);
      const targetModel =
        model.modelString || process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6';

      const command = new ConverseCommand({
        modelId: targetModel,
        messages: messages.map((m) => ({
          role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
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
        const isAuthOrExpired =
          firstErr.name === 'ExpiredTokenException' ||
          firstErr.name === 'UnrecognizedClientException';
        if (isAuthOrExpired && hasBearer) {
          const bearerClient = bedrockConnection.createClient(true);
          response = await bearerClient.send(command);
        } else {
          throw firstErr;
        }
      }

      const text = response.output?.message?.content?.[0]?.text || '';
      onChunk(text);
      return {
        fullText: text,
        tokensEstimated: Math.ceil(text.length / 4),
      };
    } catch (err: any) {
      const isThrottled =
        err.name === 'ThrottlingException' || err.message?.includes('Too many tokens');
      const isValidationNotAllowed =
        err.name === 'ValidationException' && err.message?.includes('Operation not allowed');
      const isAuthError =
        err.name === 'UnrecognizedClientException' || err.name === 'AccessDeniedException';

      let notice = `> ⚠️ **RIIQX Online AI Provider Notice (AWS Bedrock)**\n> Status: \`${err.name || 'Inference Error'}\`\n> Details: ${err.message}\n`;
      if (isThrottled) {
        notice += `>\n> 💡 **AWS Daily Quota Reached:** Bedrock's daily token allocation has been reached for today in region \`ap-southeast-2\`. The system automatically preserved your query context. You can switch to other configured online providers or optional local models in the top selector.`;
      } else if (isValidationNotAllowed) {
        notice += `>\n> 💡 **AWS Model Access Required:** Account \`614084726174\` has not yet requested model access for foundation models. In AWS Console, go to **Amazon Bedrock > Model access (ap-southeast-2)**, click **Modify model access**, select your models (e.g. Amazon Nova / Anthropic Claude), and submit. Access is immediate.`;
      } else if (isAuthError) {
        notice += `>\n> 💡 **AWS Permissions Notice:** Ensure your AWS Credentials in \`.env.local\` have \`bedrock:InvokeModel\` permissions in selected Region \`ap-southeast-2\`.`;
      }

      onChunk(notice);
      return { fullText: notice, tokensEstimated: 50 };
    }
  }

  // --- 2. Groq Cloud (LPU Ultra-Fast Online Inference) ---
  if (model.provider === 'groq') {
    if (!GROQ_API_KEY) {
      const notice = `> ⚠️ **Groq Cloud Not Configured**\n> Please add \`GROQ_API_KEY=gsk_...\` in your \`.env.local\` to activate ultra-fast LPU inference (free at https://console.groq.com/keys).`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }
    return executeOpenAiCompatibleChat({
      baseUrl: GROQ_BASE,
      apiKey: GROQ_API_KEY,
      modelString: model.modelString || 'llama-3.3-70b-versatile',
      messages,
      signal,
      onChunk,
      providerName: 'Groq Cloud',
    });
  }

  // --- 3. OpenRouter Cloud Aggregator (Primary Online) ---
  if (model.provider === 'openrouter') {
    if (!OPENROUTER_API_KEY) {
      const notice = `> ⚠️ **OpenRouter Not Configured**\n> Please add \`OPENROUTER_API_KEY=sk-or-...\` in your \`.env.local\` to activate multi-cloud routing (available at https://openrouter.ai/keys).`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }
    const result = await executeOpenAiCompatibleChat({
      baseUrl: OPENROUTER_BASE,
      apiKey: OPENROUTER_API_KEY,
      modelString: model.modelString || 'meta-llama/llama-3.3-70b-instruct',
      messages,
      signal,
      onChunk,
      providerName: 'OpenRouter',
    });

    if (result.fullText.startsWith('> ⚠️') && GROQ_API_KEY) {
      // Graceful fallback to verified Groq LPU
      onChunk('\n\n*Auto-failover to verified secondary provider: Groq Cloud LPU...*\n\n');
      return await executeOpenAiCompatibleChat({
        baseUrl: GROQ_BASE,
        apiKey: GROQ_API_KEY,
        modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages,
        signal,
        onChunk,
        providerName: 'Groq Cloud (Fallback)',
      });
    }

    return result;
  }

  // --- 4. OpenAI Direct ---
  if (model.provider === 'openai') {
    if (!OPENAI_DIRECT_KEY || OPENAI_DIRECT_KEY.startsWith('sk-kg8v')) {
      const notice = `> ⚠️ **OpenAI Direct Key Not Configured**\n> Please add a valid \`OPENAI_API_KEY=sk-proj-...\` in your \`.env.local\` to use direct OpenAI models.`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }
    return executeOpenAiCompatibleChat({
      baseUrl: OPENAI_DIRECT_BASE,
      apiKey: OPENAI_DIRECT_KEY,
      modelString: model.modelString || 'gpt-4o-mini',
      messages,
      signal,
      onChunk,
      providerName: 'OpenAI Direct',
    });
  }

  // --- 5. OpenAI-Compatible / Agent Router (Cloud Secondary) ---
  if (model.provider === 'agentrouter' || model.provider === 'openai-compatible') {
    const baseUrl = OPENAI_COMPATIBLE_BASE || 'https://agentrouter.org/v1';
    return executeOpenAiCompatibleChat({
      baseUrl,
      apiKey: OPENAI_COMPATIBLE_KEY,
      modelString: model.modelString || 'deepseek-v4-flash',
      messages,
      signal,
      onChunk,
      providerName: 'Agent Router',
    });
  }

  // --- 3. Local Ollama (Optional Fallback) ---
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
            // Partial chunk
          }
        }
      }

      return {
        fullText,
        tokensEstimated: Math.ceil(fullText.length / 4),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Connection error';
      const offlineFallback = `> ℹ️ **Local Model Offline Notice**\n> Model \`${model.name}\` could not be contacted at \`${OLLAMA_DEFAULT_BASE}\` (${errorMsg}).\n> *RIIQX is online-first and does not require local servers. Select Claude Sonnet (AWS Bedrock) above to continue online.*`;
      onChunk(offlineFallback);
      return { fullText: offlineFallback, tokensEstimated: 40 };
    }
  }

  const fallbackNotice = `> ℹ️ Provider \`${model.provider}\` is not reachable. Select an online provider from the model menu.`;
  onChunk(fallbackNotice);
  return { fullText: fallbackNotice, tokensEstimated: 25 };
}

/**
 * Universal OpenAI-compatible chat executor (Groq, OpenRouter, OpenAI, Custom)
 */
async function executeOpenAiCompatibleChat({
  baseUrl,
  apiKey,
  modelString,
  messages,
  signal,
  onChunk,
  providerName,
}: {
  baseUrl: string;
  apiKey: string;
  modelString: string;
  messages: { role: string; content: string }[];
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
  providerName: string;
}): Promise<{ fullText: string; tokensEstimated: number }> {
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'RIIQX',
      },
      body: JSON.stringify({
        model: modelString,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Gateway returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    onChunk(reply);
    return {
      fullText: reply,
      tokensEstimated: Math.ceil(reply.length / 4),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Gateway connection error';
    const notice = `> ⚠️ **${providerName} Gateway Notice**\n> Endpoint: \`${baseUrl}\`\n> Model: \`${modelString}\`\n> Details: ${errorMsg}`;
    onChunk(notice);
    return { fullText: notice, tokensEstimated: 30 };
  }
}

