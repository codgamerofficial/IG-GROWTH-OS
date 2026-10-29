// =============================================================================
// RIIQX — Master Server-Side AI Provider Registry & Adapter Architecture
// Strict Secret Isolation • Multi-Cloud Gateway • Circuit Breakers • Zero Leaks
// =============================================================================

import { bedrockConnection } from '../ai/bedrock-connection';
import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { executeToolSafe, RiiqxToolResult } from './tools';
import { recordInferenceUsage } from './usage-monitor';

export type AIProviderId =
  | 'openrouter'
  | 'groq'
  | 'cohere'
  | 'bedrock'
  | 'nvidia'
  | 'aiml'
  | 'agentrouter'
  | 'openai'
  | 'ollama';

export interface ModelCapabilitySpec {
  modelId: string;
  provider: AIProviderId;
  name: string;
  contextWindow: number;
  streaming: boolean;
  toolCalling: boolean;
  structuredOutput: boolean;
  vision: boolean;
  embeddings: boolean;
  isFreeTier: boolean;
  tierDescription: 'Free Tier' | 'Free Developer Tier' | 'Community Open-Weight' | 'Commercial Cloud' | 'Local Offline';
  recommendedTasks: (
    | 'general'
    | 'ideation'
    | 'scriptwriting'
    | 'research'
    | 'coding'
    | 'fast'
    | 'reasoning'
    | 'vision'
    | 'analytics'
    | 'workflow'
  )[];
}

export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  lastFailureTime: number;
  lastError?: string;
}

export interface ProviderRecord {
  providerId: AIProviderId;
  displayName: string;
  configVarNames: string[];
  authMethod: 'bearer' | 'aws-sigv4' | 'header-key' | 'none';
  apiBaseUrl: string;
  availableModels: string[];
  freeTierAvailable: boolean;
  quotaInfo: string;
  contextLimits: Record<string, number>;
  capabilities: {
    streaming: boolean;
    toolCalling: boolean;
    structuredOutput: boolean;
    vision: boolean;
    embeddings: boolean;
  };
  status: 'configured' | 'unconfigured' | 'invalid_credentials' | 'exhausted_quota' | 'unreachable';
  lastCheckedAt?: string;
  lastSuccessTimestamp?: string;
  lastErrorCategory?: string;
  circuitBreaker: CircuitBreakerState;
}

// -----------------------------------------------------------------------------
// In-Memory Circuit Breakers
// -----------------------------------------------------------------------------
const CIRCUIT_BREAKERS: Record<AIProviderId, CircuitBreakerState> = {
  openrouter: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  groq: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  cohere: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  bedrock: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  nvidia: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  aiml: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  agentrouter: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  openai: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
  ollama: { state: 'closed', failureCount: 0, lastFailureTime: 0 },
};

const CIRCUIT_FAILURE_THRESHOLD = 3;
const CIRCUIT_RESET_TIMEOUT_MS = 60_000; // 60s cool down

function checkCircuit(providerId: AIProviderId): boolean {
  const cb = CIRCUIT_BREAKERS[providerId];
  if (cb.state === 'open') {
    if (Date.now() - cb.lastFailureTime > CIRCUIT_RESET_TIMEOUT_MS) {
      cb.state = 'half-open';
      return true; // Allow test request
    }
    return false; // Circuit is open
  }
  return true;
}

function recordSuccess(providerId: AIProviderId) {
  const cb = CIRCUIT_BREAKERS[providerId];
  cb.state = 'closed';
  cb.failureCount = 0;
  cb.lastError = undefined;
}

function recordFailure(providerId: AIProviderId, error: string) {
  const cb = CIRCUIT_BREAKERS[providerId];
  cb.failureCount += 1;
  cb.lastFailureTime = Date.now();
  cb.lastError = error;
  if (cb.failureCount >= CIRCUIT_FAILURE_THRESHOLD) {
    cb.state = 'open';
  }
}

// -----------------------------------------------------------------------------
// Model Capabilities Catalog
// -----------------------------------------------------------------------------
export const MODEL_CAPABILITIES_CATALOG: Record<string, ModelCapabilitySpec> = {
  // 1. Groq Ultra-Fast (Free Tier)
  'qwen/qwen3.8-27b': {
    modelId: 'qwen/qwen3.8-27b',
    provider: 'groq',
    name: 'Qwen 3.8 27B (Groq LPU Free Tier)',
    contextWindow: 32768,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Tier',
    recommendedTasks: ['fast', 'general', 'scriptwriting'],
  },
  'openai/gpt-oss-120b': {
    modelId: 'openai/gpt-oss-120b',
    provider: 'groq',
    name: 'GPT-OSS 120B (Groq LPU Free Tier)',
    contextWindow: 128000,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Tier',
    recommendedTasks: ['fast', 'reasoning', 'ideation'],
  },

  // 2. OpenRouter Verified Free Models (:free suffix)
  'google/gemma-4-31b-it:free': {
    modelId: 'google/gemma-4-31b-it:free',
    provider: 'openrouter',
    name: 'Gemma 4 31B IT (OpenRouter 100% Free Tier)',
    contextWindow: 32768,
    streaming: true,
    toolCalling: false,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Tier',
    recommendedTasks: ['general', 'coding', 'ideation'],
  },
  'nvidia/nemotron-3.5-lightning:free': {
    modelId: 'nvidia/nemotron-3.5-lightning:free',
    provider: 'openrouter',
    name: 'Nemotron 3.5 Lightning (OpenRouter 100% Free Tier)',
    contextWindow: 65536,
    streaming: true,
    toolCalling: false,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Tier',
    recommendedTasks: ['general', 'fast'],
  },
  'cohere/north-mini-code:free': {
    modelId: 'cohere/north-mini-code:free',
    provider: 'openrouter',
    name: 'North Mini Code (OpenRouter 100% Free Tier)',
    contextWindow: 32768,
    streaming: true,
    toolCalling: false,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Tier',
    recommendedTasks: ['coding'],
  },

  // 3. OpenRouter Verified High-Performance Models
  'meta-llama/llama-3.3-70b-instruct': {
    modelId: 'meta-llama/llama-3.3-70b-instruct',
    provider: 'openrouter',
    name: 'Llama 3.3 70B Instruct (OpenRouter)',
    contextWindow: 131072,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: false,
    tierDescription: 'Community Open-Weight',
    recommendedTasks: ['general', 'ideation', 'scriptwriting'],
  },
  'deepseek/deepseek-chat': {
    modelId: 'deepseek/deepseek-chat',
    provider: 'openrouter',
    name: 'DeepSeek Chat V3 671B (OpenRouter)',
    contextWindow: 64000,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: false,
    tierDescription: 'Community Open-Weight',
    recommendedTasks: ['coding', 'scriptwriting', 'general'],
  },
  'deepseek/deepseek-r1': {
    modelId: 'deepseek/deepseek-r1',
    provider: 'openrouter',
    name: 'DeepSeek R1 Reasoning (OpenRouter)',
    contextWindow: 64000,
    streaming: true,
    toolCalling: false,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: false,
    tierDescription: 'Community Open-Weight',
    recommendedTasks: ['reasoning'],
  },

  // 4. Cohere Free Developer Tier
  'command-r-plus-08-2024': {
    modelId: 'command-r-plus-08-2024',
    provider: 'cohere',
    name: 'Command R+ (Cohere Free Developer Tier)',
    contextWindow: 128000,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Developer Tier',
    recommendedTasks: ['research', 'reasoning', 'general'],
  },
  'command-r-08-2024': {
    modelId: 'command-r-08-2024',
    provider: 'cohere',
    name: 'Command R (Cohere Free Developer Tier)',
    contextWindow: 128000,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Free Developer Tier',
    recommendedTasks: ['research', 'fast'],
  },

  // 5. AWS Bedrock Enterprise
  'au.anthropic.claude-sonnet-4-6': {
    modelId: 'au.anthropic.claude-sonnet-4-6',
    provider: 'bedrock',
    name: 'Claude Sonnet 4 / 3.7 (AWS Bedrock ap-southeast-2)',
    contextWindow: 200000,
    streaming: true,
    toolCalling: true,
    structuredOutput: true,
    vision: true,
    embeddings: false,
    isFreeTier: false,
    tierDescription: 'Commercial Cloud',
    recommendedTasks: ['reasoning', 'vision', 'general'],
  },

  // 6. Local Fallbacks (Ollama)
  'qwen2.5-coder:7b': {
    modelId: 'qwen2.5-coder:7b',
    provider: 'ollama',
    name: 'Qwen 2.5 Coder 7B (Local Offline)',
    contextWindow: 32768,
    streaming: true,
    toolCalling: false,
    structuredOutput: false,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Local Offline',
    recommendedTasks: ['coding'],
  },
  'llama3.2': {
    modelId: 'llama3.2',
    provider: 'ollama',
    name: 'Llama 3.2 3B (Local Offline)',
    contextWindow: 128000,
    streaming: true,
    toolCalling: false,
    structuredOutput: false,
    vision: false,
    embeddings: false,
    isFreeTier: true,
    tierDescription: 'Local Offline',
    recommendedTasks: ['fast'],
  },
};

// -----------------------------------------------------------------------------
// Master AI Provider Registry
// -----------------------------------------------------------------------------
export class AIProviderRegistry {
  /**
   * Safe discovery of configured providers without exposing secrets
   */
  public static getProviders(): ProviderRecord[] {
    const groqKey = Boolean(process.env.GROQ_API_KEY);
    const openrouterKey = Boolean(
      process.env.OPENROUTER_API_KEY || process.env['sk-or-v1-openrouter_api_key']
    );
    const cohereKey = Boolean(process.env.COHERE_API_KEY || process.env.cohera_api_key);
    const bedrockConfigured = Boolean(
      (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
        process.env.AWS_BEARER_TOKEN_BEDROCK ||
        process.env.BEDROCK_API_KEY
    );
    const nvidiaKey = Boolean(process.env.NVIDIA_NIM_API_KEY || process.env.Nvdia_nim_api_key);
    const aimlKey = Boolean(process.env.AIML_API_KEY || process.env.aiml_api_key);
    const agentRouterKey = Boolean(
      process.env.AGENT_ROUTER_API_KEY ||
        process.env.AGENTROUTER_API_KEY ||
        process.env.agenrouter_api_key
    );
    const openaiKey = Boolean(
      process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-kg8v')
    );

    return [
      // 1. Groq Cloud (Verified Active Free Tier)
      {
        providerId: 'groq',
        displayName: 'Groq Cloud LPU',
        configVarNames: ['GROQ_API_KEY', 'GROQ_BASE_URL', 'GROQ_MODEL'],
        authMethod: 'bearer',
        apiBaseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
        availableModels: ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
        freeTierAvailable: true,
        quotaInfo: 'Groq Free Tier (30 RPM / 14,400 RPD)',
        contextLimits: { 'qwen/qwen3.8-27b': 32768, 'openai/gpt-oss-120b': 128000 },
        capabilities: {
          streaming: true,
          toolCalling: true,
          structuredOutput: true,
          vision: false,
          embeddings: false,
        },
        status: groqKey ? 'configured' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.groq,
      },

      // 2. OpenRouter (Verified Active Multi-Cloud Gateway + Free Tier)
      {
        providerId: 'openrouter',
        displayName: 'OpenRouter Multi-Cloud Gateway',
        configVarNames: ['OPENROUTER_API_KEY', 'OPENROUTER_BASE_URL', 'OPENROUTER_MODEL'],
        authMethod: 'bearer',
        apiBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
        availableModels: [
          'meta-llama/llama-3.3-70b-instruct',
          'deepseek/deepseek-chat',
          'deepseek/deepseek-r1',
          'google/gemma-4-31b-it:free',
          'nvidia/nemotron-3.5-lightning:free',
          'cohere/north-mini-code:free',
        ],
        freeTierAvailable: true,
        quotaInfo: '16+ Free Models (:free tag) + Low-cost Pay-as-you-go',
        contextLimits: {
          'meta-llama/llama-3.3-70b-instruct': 131072,
          'deepseek/deepseek-chat': 64000,
          'google/gemma-4-31b-it:free': 32768,
        },
        capabilities: {
          streaming: true,
          toolCalling: true,
          structuredOutput: true,
          vision: true,
          embeddings: false,
        },
        status: openrouterKey ? 'configured' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.openrouter,
      },

      // 3. Cohere (Verified Active Free Developer Tier)
      {
        providerId: 'cohere',
        displayName: 'Cohere Intelligence Cloud',
        configVarNames: ['COHERE_API_KEY'],
        authMethod: 'bearer',
        apiBaseUrl: 'https://api.cohere.com/v2',
        availableModels: ['command-r-plus-08-2024', 'command-r-08-2024'],
        freeTierAvailable: true,
        quotaInfo: 'Cohere Free Developer Trial (20 RPM / 1,000 requests/month)',
        contextLimits: { 'command-r-plus-08-2024': 128000, 'command-r-08-2024': 128000 },
        capabilities: {
          streaming: true,
          toolCalling: true,
          structuredOutput: true,
          vision: false,
          embeddings: true,
        },
        status: cohereKey ? 'configured' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.cohere,
      },

      // 4. AWS Bedrock (Enterprise Managed Region ap-southeast-2)
      {
        providerId: 'bedrock',
        displayName: 'Amazon Bedrock Runtime',
        configVarNames: [
          'AWS_ACCESS_KEY_ID',
          'AWS_SECRET_ACCESS_KEY',
          'AWS_REGION',
          'BEDROCK_MODEL_ID',
          'AWS_BEARER_TOKEN_BEDROCK',
        ],
        authMethod: 'aws-sigv4',
        apiBaseUrl: `https://bedrock-runtime.${process.env.AWS_REGION || 'ap-southeast-2'}.amazonaws.com`,
        availableModels: [process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6'],
        freeTierAvailable: false,
        quotaInfo: 'AWS Account Managed / Requires Bedrock Model Access',
        contextLimits: { 'au.anthropic.claude-sonnet-4-6': 200000 },
        capabilities: {
          streaming: true,
          toolCalling: true,
          structuredOutput: true,
          vision: true,
          embeddings: false,
        },
        status: bedrockConfigured ? 'configured' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.bedrock,
      },

      // 5. Nvidia NIM (Entitlement Required)
      {
        providerId: 'nvidia',
        displayName: 'Nvidia NIM Cloud Microservices',
        configVarNames: ['NVIDIA_NIM_API_KEY'],
        authMethod: 'bearer',
        apiBaseUrl: 'https://integrate.api.nvidia.com/v1',
        availableModels: ['meta/llama-3.1-8b-instruct'],
        freeTierAvailable: false,
        quotaInfo: '1,000 free credits upon developer verification',
        contextLimits: { 'meta/llama-3.1-8b-instruct': 131072 },
        capabilities: {
          streaming: true,
          toolCalling: false,
          structuredOutput: true,
          vision: false,
          embeddings: false,
        },
        status: nvidiaKey ? 'configured' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.nvidia,
      },

      // 6. AIML API (Credits Exhausted)
      {
        providerId: 'aiml',
        displayName: 'AIML API Gateway',
        configVarNames: ['AIML_API_KEY'],
        authMethod: 'bearer',
        apiBaseUrl: 'https://api.aimlapi.com/v1',
        availableModels: ['mistralai/Mistral-7B-Instruct-v0.2'],
        freeTierAvailable: false,
        quotaInfo: 'Credits exhausted (err_insufficient_credits)',
        contextLimits: { 'mistralai/Mistral-7B-Instruct-v0.2': 32768 },
        capabilities: {
          streaming: true,
          toolCalling: false,
          structuredOutput: false,
          vision: false,
          embeddings: false,
        },
        status: aimlKey ? 'exhausted_quota' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.aiml,
      },

      // 7. Agent Router (Unauthorized Client)
      {
        providerId: 'agentrouter',
        displayName: 'Agent Router Gateway',
        configVarNames: ['AGENT_ROUTER_API_KEY', 'AGENT_ROUTER_BASE_URL', 'AGENT_ROUTER_MODEL'],
        authMethod: 'bearer',
        apiBaseUrl: process.env.AGENT_ROUTER_BASE_URL || 'https://agentrouter.org/v1',
        availableModels: [process.env.AGENT_ROUTER_MODEL || 'deepseek/deepseek-chat'],
        freeTierAvailable: false,
        quotaInfo: 'Gateway returned 401 unauthorized client',
        contextLimits: { 'deepseek/deepseek-chat': 64000 },
        capabilities: {
          streaming: true,
          toolCalling: false,
          structuredOutput: false,
          vision: false,
          embeddings: false,
        },
        status: agentRouterKey ? 'invalid_credentials' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.agentrouter,
      },

      // 8. OpenAI Direct (Unconfigured / Dummy Key)
      {
        providerId: 'openai',
        displayName: 'OpenAI Direct API',
        configVarNames: ['OPENAI_API_KEY'],
        authMethod: 'bearer',
        apiBaseUrl: 'https://api.openai.com/v1',
        availableModels: ['gpt-4o-mini', 'gpt-4o'],
        freeTierAvailable: false,
        quotaInfo: 'Requires valid funded OpenAI project key',
        contextLimits: { 'gpt-4o-mini': 128000, 'gpt-4o': 128000 },
        capabilities: {
          streaming: true,
          toolCalling: true,
          structuredOutput: true,
          vision: true,
          embeddings: true,
        },
        status: openaiKey ? 'configured' : 'unconfigured',
        circuitBreaker: CIRCUIT_BREAKERS.openai,
      },

      // 9. Ollama (Optional Local Fallback)
      {
        providerId: 'ollama',
        displayName: 'Local Ollama Daemon',
        configVarNames: ['OLLAMA_BASE_URL'],
        authMethod: 'none',
        apiBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        availableModels: ['qwen2.5-coder:7b', 'llama3.2'],
        freeTierAvailable: true,
        quotaInfo: '100% Free Local Hardware',
        contextLimits: { 'qwen2.5-coder:7b': 32768, 'llama3.2': 128000 },
        capabilities: {
          streaming: true,
          toolCalling: false,
          structuredOutput: false,
          vision: false,
          embeddings: false,
        },
        status: 'configured',
        circuitBreaker: CIRCUIT_BREAKERS.ollama,
      },
    ];
  }

  /**
   * List all available models across verified providers
   */
  public static listAvailableModels(): ModelCapabilitySpec[] {
    return Object.values(MODEL_CAPABILITIES_CATALOG);
  }

  /**
   * Inspect capabilities of a model
   */
  public static getModelCapabilities(modelId: string): ModelCapabilitySpec | undefined {
    return MODEL_CAPABILITIES_CATALOG[modelId];
  }

  /**
   * Validate configuration status of a provider without exposing secrets
   */
  public static validateConfiguration(providerId: AIProviderId): {
    configured: boolean;
    missingVars: string[];
    status: string;
  } {
    const providers = this.getProviders();
    const p = providers.find((prov) => prov.providerId === providerId);
    if (!p) {
      return { configured: false, missingVars: [], status: 'Unknown provider' };
    }

    const missing = p.configVarNames.filter((v) => !process.env[v]);
    return {
      configured: missing.length === 0,
      missingVars: missing,
      status: p.status,
    };
  }

  /**
   * Test connection to a provider
   */
  public static async testConnection(
    providerId: AIProviderId
  ): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      if (!checkCircuit(providerId)) {
        return { ok: false, latencyMs: 0, error: 'Circuit breaker is open' };
      }

      if (providerId === 'groq') {
        const key = process.env.GROQ_API_KEY;
        if (!key) throw new Error('GROQ_API_KEY is not configured');
        const ctrl = new AbortController();
        const tm = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(`${process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'}/models`, {
          headers: { Authorization: `Bearer ${key}` },
          signal: ctrl.signal,
        });
        clearTimeout(tm);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        recordSuccess(providerId);
        return { ok: true, latencyMs: Date.now() - start };
      }

      if (providerId === 'openrouter') {
        const key = process.env.OPENROUTER_API_KEY || process.env['sk-or-v1-openrouter_api_key'];
        if (!key) throw new Error('OPENROUTER_API_KEY is not configured');
        const ctrl = new AbortController();
        const tm = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(
          `${process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'}/models`,
          {
            headers: { Authorization: `Bearer ${key}` },
            signal: ctrl.signal,
          }
        );
        clearTimeout(tm);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        recordSuccess(providerId);
        return { ok: true, latencyMs: Date.now() - start };
      }

      if (providerId === 'cohere') {
        const key = process.env.COHERE_API_KEY || process.env.cohera_api_key;
        if (!key) throw new Error('COHERE_API_KEY is not configured');
        const ctrl = new AbortController();
        const tm = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch('https://api.cohere.com/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
          signal: ctrl.signal,
        });
        clearTimeout(tm);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        recordSuccess(providerId);
        return { ok: true, latencyMs: Date.now() - start };
      }

      if (providerId === 'bedrock') {
        const result = await bedrockConnection.testConnection();
        if (result.inferenceSuccessful || result.authorized) {
          recordSuccess(providerId);
          return { ok: true, latencyMs: result.latencyMs || 0 };
        }
        throw new Error(result.errorMessage || 'Bedrock access pending');
      }

      return { ok: false, latencyMs: 0, error: `Provider ${providerId} unverified` };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      recordFailure(providerId, msg);
      return { ok: false, latencyMs: Date.now() - start, error: msg };
    }
  }

  /**
   * Execute tool call using the safe tool registry
   */
  public static async executeToolCall(toolCall: {
    toolId: string;
    arguments: Record<string, unknown>;
  }): Promise<RiiqxToolResult> {
    return executeToolSafe(toolCall.toolId, toolCall.arguments);
  }
}
