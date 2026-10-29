// =============================================================================
// RIIQX — Online-First Model Orchestration, Streaming & Live Health Engine
// Server-Side Secret Isolation • AWS Bedrock Converse API • Quota-Aware
// =============================================================================

import { RIIQX_MODELS, RiiqxModel, ProviderHealth } from './models';
import { bedrockConnection } from '../ai/bedrock-connection';
import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { recordInferenceUsage } from './usage-monitor';

export function getOllamaBase(): string {
  return (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').trim();
}

export function getAgentRouterBase(): string {
  return (
    process.env.AGENT_ROUTER_BASE_URL ||
    process.env.OPENAI_COMPATIBLE_BASE_URL ||
    'https://agentrouter.org/v1'
  ).trim();
}

export function getAgentRouterKey(): string {
  return (
    process.env.AGENT_ROUTER_API_KEY ||
    process.env.AGENTROUTER_API_KEY ||
    process.env.agenrouter_api_key ||
    process.env.OPENAI_API_KEY ||
    ''
  ).trim();
}

export function getGroqBase(): string {
  return (process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1').trim();
}

export function getGroqKey(): string {
  return (process.env.GROQ_API_KEY || process.env.groq_api_key || '').trim();
}

export function getOpenRouterBase(): string {
  return (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').trim();
}

export function getOpenRouterKey(): string {
  return (
    process.env.OPENROUTER_API_KEY ||
    process.env['sk-or-v1-openrouter_api_key'] ||
    ''
  ).trim();
}

export function getOpenAiDirectBase(): string {
  return (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').trim();
}

export function getOpenAiDirectKey(): string {
  return (process.env.OPENAI_API_KEY || '').trim();
}

export function getNvidiaNimKey(): string {
  return (process.env.NVIDIA_NIM_API_KEY || process.env.Nvdia_nim_api_key || '').trim();
}

export function getCohereKey(): string {
  return (process.env.COHERE_API_KEY || process.env.cohera_api_key || '').trim();
}

/**
 * Check real-time health of online and fallback model providers
 */
export async function checkProviderHealth(): Promise<{
  bedrock: ProviderHealth;
  groq: ProviderHealth;
  openrouter: ProviderHealth;
  cohere: ProviderHealth;
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
  const groqKey = getGroqKey();
  const groqBase = getGroqBase();
  const groqHealth: ProviderHealth = {
    provider: 'groq',
    status: groqKey ? 'checking' : 'unconfigured',
    endpoint: groqBase,
    availableModels: [process.env.GROQ_MODEL || 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'],
    checkedAt: new Date().toISOString(),
  };

  if (groqKey) {
    try {
      const startProbe = Date.now();
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${groqBase}/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${groqKey}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        groqHealth.status = 'online';
        groqHealth.latencyMs = Date.now() - startProbe;
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
  const openrouterKey = getOpenRouterKey();
  const openrouterBase = getOpenRouterBase();
  const openrouterHealth: ProviderHealth = {
    provider: 'openrouter',
    status: openrouterKey ? 'checking' : 'unconfigured',
    endpoint: openrouterBase,
    availableModels: [
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-chat',
      'deepseek/deepseek-r1',
    ],
    checkedAt: new Date().toISOString(),
  };

  if (openrouterKey) {
    try {
      const startProbe = Date.now();
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${openrouterBase}/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${openrouterKey}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        openrouterHealth.status = 'online';
        openrouterHealth.latencyMs = Date.now() - startProbe;
      } else {
        openrouterHealth.status = 'offline';
        openrouterHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      openrouterHealth.status = 'offline';
      openrouterHealth.errorMessage = 'Connection timeout';
    }
  }

  // 4. Probe Cohere Intelligence Cloud
  const cohereKey = getCohereKey();
  const cohereHealth: ProviderHealth = {
    provider: 'cohere',
    status: cohereKey ? 'checking' : 'unconfigured',
    endpoint: 'https://api.cohere.com/v2',
    availableModels: ['command-r-plus-08-2024', 'command-r-08-2024'],
    checkedAt: new Date().toISOString(),
  };

  if (cohereKey) {
    try {
      const startProbe = Date.now();
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch('https://api.cohere.com/v1/models', {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${cohereKey}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        cohereHealth.status = 'online';
        cohereHealth.latencyMs = Date.now() - startProbe;
      } else {
        cohereHealth.status = 'offline';
        cohereHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      cohereHealth.status = 'offline';
      cohereHealth.errorMessage = 'Connection timeout';
    }
  }

  // 5. Probe OpenAI Direct
  const openaiDirectKey = getOpenAiDirectKey();
  const openaiDirectBase = getOpenAiDirectBase();
  const openaiHealth: ProviderHealth = {
    provider: 'openai',
    status: openaiDirectKey && !openaiDirectKey.startsWith('sk-kg8v') ? 'checking' : 'unconfigured',
    endpoint: openaiDirectBase,
    availableModels: ['gpt-4o-mini', 'gpt-4o'],
    checkedAt: new Date().toISOString(),
  };

  if (openaiDirectKey && !openaiDirectKey.startsWith('sk-kg8v')) {
    try {
      const startProbe = Date.now();
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 2000);
      const res = await fetch(`${openaiDirectBase}/models`, {
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${openaiDirectKey}` },
        cache: 'no-store',
      });
      clearTimeout(tm);
      if (res.ok) {
        openaiHealth.status = 'online';
        openaiHealth.latencyMs = Date.now() - startProbe;
      } else {
        openaiHealth.status = 'offline';
        openaiHealth.errorMessage = `HTTP ${res.status}`;
      }
    } catch {
      openaiHealth.status = 'offline';
      openaiHealth.errorMessage = 'Connection timeout';
    }
  }

  // 6. Probe Agent Router / OpenAI-Compatible Gateway
  const agentRouterBase = getAgentRouterBase();
  const agentRouterKey = getAgentRouterKey();
  const agentRouterHealth: ProviderHealth = {
    provider: 'agentrouter',
    status: agentRouterBase ? 'checking' : 'unconfigured',
    endpoint: agentRouterBase || 'Not configured',
    availableModels: [],
    checkedAt: new Date().toISOString(),
  };

  if (agentRouterBase) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${agentRouterBase}/models`, {
        signal: controller.signal,
        headers: agentRouterKey ? { Authorization: `Bearer ${agentRouterKey}` } : {},
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

  // 7. Probe Local Ollama (Optional Fallback)
  const ollamaBase = getOllamaBase();
  const ollamaHealth: ProviderHealth = {
    provider: 'ollama',
    status: 'checking',
    endpoint: ollamaBase,
    availableModels: [],
    checkedAt: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${ollamaBase}/api/tags`, {
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
    cohere: cohereHealth,
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
    const groqKey = getGroqKey();
    const groqBase = getGroqBase();
    if (!groqKey) {
      // Auto-failover if OpenRouter is active
      const orKey = getOpenRouterKey();
      if (orKey) {
        onChunk('*Groq Cloud key not detected; dynamically routed to active OpenRouter gateway...*\n\n');
        return await executeOpenAiCompatibleChat({
          baseUrl: getOpenRouterBase(),
          apiKey: orKey,
          modelString: 'meta-llama/llama-3.3-70b-instruct',
          messages,
          signal,
          onChunk,
          providerName: 'OpenRouter (Auto-Route)',
        });
      }
      const notice = `> ⚠️ **Groq Cloud Not Configured**\n> Please add \`GROQ_API_KEY=gsk_...\` in your \`.env.local\` to activate ultra-fast LPU inference (free at https://console.groq.com/keys).`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }

    try {
      return await executeOpenAiCompatibleChat({
        baseUrl: groqBase,
        apiKey: groqKey,
        modelString: model.modelString || process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages,
        signal,
        onChunk,
        providerName: 'Groq Cloud',
      });
    } catch (groqErr: any) {
      const orKey = getOpenRouterKey();
      if (orKey) {
        onChunk(`\n\n*Groq Cloud encountered an issue (${groqErr.message || 'error'}); auto-failover to verified OpenRouter...*\n\n`);
        return await executeOpenAiCompatibleChat({
          baseUrl: getOpenRouterBase(),
          apiKey: orKey,
          modelString: 'meta-llama/llama-3.3-70b-instruct',
          messages,
          signal,
          onChunk,
          providerName: 'OpenRouter (Fallback)',
        });
      }
      throw groqErr;
    }
  }

  // --- 3. OpenRouter Cloud Aggregator (Primary Online) ---
  if (model.provider === 'openrouter') {
    const openrouterKey = getOpenRouterKey();
    const openrouterBase = getOpenRouterBase();
    const groqKey = getGroqKey();

    if (!openrouterKey) {
      // If OpenRouter is not configured but Groq is, smoothly route to Groq LPU without blocking the user
      if (groqKey) {
        return await executeOpenAiCompatibleChat({
          baseUrl: getGroqBase(),
          apiKey: groqKey,
          modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages,
          signal,
          onChunk,
          providerName: 'Groq Cloud LPU (Auto-Route)',
        });
      }
      const cohereKey = getCohereKey();
      if (cohereKey) {
        return await executeCohereChat({
          apiKey: cohereKey,
          modelString: 'command-r-plus-08-2024',
          messages,
          signal,
          onChunk,
        });
      }

      const notice = `> ⚠️ **Provider Configuration Notice**\n> OpenRouter is not configured and no fallback online provider was detected. Please configure \`GROQ_API_KEY\` (free at https://console.groq.com) or \`OPENROUTER_API_KEY\` in your \`.env.local\`.`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }

    try {
      const result = await executeOpenAiCompatibleChat({
        baseUrl: openrouterBase,
        apiKey: openrouterKey,
        modelString: model.modelString || 'meta-llama/llama-3.3-70b-instruct',
        messages,
        signal,
        onChunk,
        providerName: 'OpenRouter',
      });

      if (result.fullText.startsWith('> ⚠️') && groqKey) {
        // Graceful fallback to verified Groq LPU
        onChunk('\n\n*Auto-failover to verified secondary provider: Groq Cloud LPU...*\n\n');
        return await executeOpenAiCompatibleChat({
          baseUrl: getGroqBase(),
          apiKey: groqKey,
          modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages,
          signal,
          onChunk,
          providerName: 'Groq Cloud (Fallback)',
        });
      }

      return result;
    } catch (openRouterErr: any) {
      if (groqKey) {
        onChunk(`\n\n*OpenRouter connection error (${openRouterErr.message || 'error'}); auto-failover to verified Groq Cloud LPU...*\n\n`);
        return await executeOpenAiCompatibleChat({
          baseUrl: getGroqBase(),
          apiKey: groqKey,
          modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages,
          signal,
          onChunk,
          providerName: 'Groq Cloud (Fallback)',
        });
      }
      throw openRouterErr;
    }
  }

  // --- 4. OpenAI Direct ---
  if (model.provider === 'openai') {
    const openaiKey = getOpenAiDirectKey();
    if (!openaiKey || openaiKey.startsWith('sk-kg8v')) {
      const groqKey = getGroqKey();
      if (groqKey) {
        return await executeOpenAiCompatibleChat({
          baseUrl: getGroqBase(),
          apiKey: groqKey,
          modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages,
          signal,
          onChunk,
          providerName: 'Groq Cloud (Auto-Route)',
        });
      }
      const notice = `> ⚠️ **OpenAI Direct Key Not Configured**\n> Please add a valid \`OPENAI_API_KEY=sk-proj-...\` in your \`.env.local\` to use direct OpenAI models.`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }
    return executeOpenAiCompatibleChat({
      baseUrl: getOpenAiDirectBase(),
      apiKey: openaiKey,
      modelString: model.modelString || 'gpt-4o-mini',
      messages,
      signal,
      onChunk,
      providerName: 'OpenAI Direct',
    });
  }

  // --- 5. OpenAI-Compatible / Agent Router (Cloud Secondary with DeepSeek Auto-Failover) ---
  if (model.provider === 'agentrouter' || model.provider === 'openai-compatible') {
    const baseUrl = getAgentRouterBase();
    const apiKey = getAgentRouterKey();
    const result = await executeOpenAiCompatibleChat({
      baseUrl,
      apiKey,
      modelString: model.modelString || 'deepseek/deepseek-chat',
      messages,
      signal,
      onChunk,
      providerName: 'Agent Router',
    });

    const openrouterKey = getOpenRouterKey();
    const groqKey = getGroqKey();
    if (result.fullText.startsWith('> ⚠️')) {
      if (openrouterKey) {
        onChunk('\n\n*Auto-failover to verified DeepSeek V3 via OpenRouter gateway...*\n\n');
        return await executeOpenAiCompatibleChat({
          baseUrl: getOpenRouterBase(),
          apiKey: openrouterKey,
          modelString: 'deepseek/deepseek-chat',
          messages,
          signal,
          onChunk,
          providerName: 'OpenRouter (DeepSeek Verified)',
        });
      } else if (groqKey) {
        onChunk('\n\n*Auto-failover to verified Groq Cloud LPU...*\n\n');
        return await executeOpenAiCompatibleChat({
          baseUrl: getGroqBase(),
          apiKey: groqKey,
          modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages,
          signal,
          onChunk,
          providerName: 'Groq Cloud LPU',
        });
      }
    }

    return result;
  }

  // --- 6. Cohere Intelligence Cloud (Free Developer Tier) ---
  if (model.provider === 'cohere') {
    const cohereKey = getCohereKey();
    if (!cohereKey) {
      const groqKey = getGroqKey();
      if (groqKey) {
        return await executeOpenAiCompatibleChat({
          baseUrl: getGroqBase(),
          apiKey: groqKey,
          modelString: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages,
          signal,
          onChunk,
          providerName: 'Groq Cloud (Auto-Route)',
        });
      }
      const notice = `> ⚠️ **Cohere Not Configured**\n> Please add \`COHERE_API_KEY=...\` in your \`.env.local\` to activate Cohere models (free developer tier at https://dashboard.cohere.com/api-keys).`;
      onChunk(notice);
      return { fullText: notice, tokensEstimated: 25 };
    }
    return executeCohereChat({
      apiKey: cohereKey,
      modelString: model.modelString || 'command-r-plus-08-2024',
      messages,
      signal,
      onChunk,
    });
  }

  // --- 7. Local Ollama (Optional Fallback) ---
  if (model.provider === 'ollama') {
    try {
      const sanitized = messages
        .filter((m) => m.content && m.content.trim().length > 0)
        .map((m) => ({ role: m.role, content: m.content.trim() }));

      const response = await fetch(`${getOllamaBase()}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model.modelString,
          messages: sanitized,
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
      const offlineFallback = `> ℹ️ **Local Model Offline Notice**\n> Model \`${model.name}\` could not be contacted at \`${getOllamaBase()}\` (${errorMsg}).\n> *RIIQX is online-first and does not require local servers. Select an online provider above to continue.*`;
      onChunk(offlineFallback);
      return { fullText: offlineFallback, tokensEstimated: 40 };
    }
  }

  const fallbackNotice = `> ℹ️ Provider \`${model.provider}\` is not reachable. Select an online provider from the model menu.`;
  onChunk(fallbackNotice);
  return { fullText: fallbackNotice, tokensEstimated: 25 };
}

/**
 * Universal OpenAI-compatible chat executor with true SSE streaming
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
  const startTime = Date.now();
  try {
    // Sanitize messages: eliminate empty content items to satisfy provider validations
    const sanitizedMessages = messages
      .filter((m) => m.content && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content.trim(),
      }));

    if (sanitizedMessages.length === 0) {
      sanitizedMessages.push({ role: 'user', content: 'Hello' });
    }

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
        messages: sanitizedMessages,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg =
        errJson.error?.message ||
        errJson.message ||
        `Gateway returned HTTP ${response.status} (${response.statusText})`;
      throw new Error(errMsg);
    }

    if (!response.body) {
      throw new Error('Provider returned empty response stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(dataStr);
          const chunkText = parsed.choices?.[0]?.delta?.content || '';
          if (chunkText) {
            fullText += chunkText;
            onChunk(chunkText);
          }
        } catch {
          // Fragmented chunk line
        }
      }
    }

    // Flush remaining buffer if present
    if (buffer.trim().startsWith('data:')) {
      const dataStr = buffer.trim().slice(5).trim();
      if (dataStr && dataStr !== '[DONE]') {
        try {
          const parsed = JSON.parse(dataStr);
          const chunkText = parsed.choices?.[0]?.delta?.content || '';
          if (chunkText) {
            fullText += chunkText;
            onChunk(chunkText);
          }
        } catch {}
      }
    }

    if (!fullText.trim()) {
      fullText = 'Execution finished.';
      onChunk(fullText);
    }

    const tokensEstimated = Math.ceil(fullText.length / 4);

    recordInferenceUsage({
      provider: providerName.toLowerCase().includes('groq')
        ? 'groq'
        : providerName.toLowerCase().includes('openrouter')
        ? 'openrouter'
        : 'openai',
      model: modelString,
      success: true,
      latencyMs: Date.now() - startTime,
      outputTokens: tokensEstimated,
    });

    return {
      fullText,
      tokensEstimated,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    const errorMsg = err instanceof Error ? err.message : 'Gateway connection error';

    recordInferenceUsage({
      provider: providerName.toLowerCase().includes('groq')
        ? 'groq'
        : providerName.toLowerCase().includes('openrouter')
        ? 'openrouter'
        : 'openai',
      model: modelString,
      success: false,
      latencyMs: Date.now() - startTime,
      errorMessage: errorMsg,
    });

    const notice = `> ⚠️ **${providerName} Gateway Notice**\n> Endpoint: \`${baseUrl}\`\n> Model: \`${modelString}\`\n> Details: ${errorMsg}`;
    return { fullText: notice, tokensEstimated: 30 };
  }
}

/**
 * Cohere V2 Chat completion with streaming
 */
async function executeCohereChat({
  apiKey,
  modelString,
  messages,
  signal,
  onChunk,
}: {
  apiKey: string;
  modelString: string;
  messages: { role: string; content: string }[];
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
}): Promise<{ fullText: string; tokensEstimated: number }> {
  const startTime = Date.now();
  try {
    const sanitizedMessages = messages
      .filter((m) => m.content && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content.trim(),
      }));

    if (sanitizedMessages.length === 0) {
      sanitizedMessages.push({ role: 'user', content: 'Hello' });
    }

    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelString,
        messages: sanitizedMessages,
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson.message || `Cohere API returned HTTP ${response.status}`;
      throw new Error(errMsg);
    }

    if (!response.body) {
      throw new Error('Cohere returned empty response stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const dataStr = trimmed.slice(5).trim();
        if (dataStr === '[DONE]') break;

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.type === 'content-delta') {
            const chunk = parsed.delta?.message?.content?.text || '';
            if (chunk) {
              fullText += chunk;
              onChunk(chunk);
            }
          }
        } catch {}
      }
    }

    if (!fullText.trim()) {
      fullText = 'Execution complete.';
      onChunk(fullText);
    }

    const tokensEstimated = Math.ceil(fullText.length / 4);

    recordInferenceUsage({
      provider: 'cohere',
      model: modelString,
      success: true,
      latencyMs: Date.now() - startTime,
      outputTokens: tokensEstimated,
    });

    return { fullText, tokensEstimated };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    const errorMsg = err instanceof Error ? err.message : 'Cohere connection error';

    recordInferenceUsage({
      provider: 'cohere',
      model: modelString,
      success: false,
      latencyMs: Date.now() - startTime,
      errorMessage: errorMsg,
    });

    const notice = `> ⚠️ **Cohere Cloud Notice**\n> Model: \`${modelString}\`\n> Details: ${errorMsg}`;
    onChunk(notice);
    return { fullText: notice, tokensEstimated: 30 };
  }
}

