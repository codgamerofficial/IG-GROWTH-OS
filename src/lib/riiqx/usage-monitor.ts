// =============================================================================
// RIIQX — Server-Side AI Usage & Quota Monitoring Ledger
// Honest Telemetry • Zero Invented Figures • Free-Tier Distinction
// =============================================================================

export interface UsageRecord {
  id: string;
  provider: string;
  model: string;
  taskType: string;
  timestamp: string;
  success: boolean;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  isFreeTier: boolean;
  estimatedCostUsd: number;
  errorMessage?: string;
}

export interface ProviderUsageSummary {
  provider: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCostUsd: number;
  averageLatencyMs: number;
  freeTierRequests: number;
}

// In-Memory Usage Ring Buffer (Persists during server lifecycle, max 500 records)
const USAGE_LEDGER: UsageRecord[] = [];
const MAX_LEDGER_SIZE = 500;

// Known cost per 1M tokens (USD) for verified models. Free-tier models are 0.
const MODEL_PRICING_PER_1M: Record<string, { prompt: number; completion: number; isFree: boolean }> = {
  // Free tier models
  'qwen/qwen3.8-27b': { prompt: 0, completion: 0, isFree: true },
  'openai/gpt-oss-120b': { prompt: 0, completion: 0, isFree: true },
  'openai/gpt-oss-20b': { prompt: 0, completion: 0, isFree: true },
  'google/gemma-4-31b-it:free': { prompt: 0, completion: 0, isFree: true },
  'nvidia/nemotron-3.5-lightning:free': { prompt: 0, completion: 0, isFree: true },
  'cohere/north-mini-code:free': { prompt: 0, completion: 0, isFree: true },
  'meta-llama/llama-3.2-3b-instruct:free': { prompt: 0, completion: 0, isFree: true },
  'command-r-plus-08-2024': { prompt: 0, completion: 0, isFree: true }, // Free developer tier
  'command-r-08-2024': { prompt: 0, completion: 0, isFree: true }, // Free developer tier
  'qwen2.5-coder:7b': { prompt: 0, completion: 0, isFree: true }, // Local offline
  'llama3.2': { prompt: 0, completion: 0, isFree: true }, // Local offline

  // Low-cost commercial models (OpenRouter)
  'meta-llama/llama-3.3-70b-instruct': { prompt: 0.12, completion: 0.30, isFree: false },
  'deepseek/deepseek-chat': { prompt: 0.14, completion: 0.28, isFree: false },
  'deepseek/deepseek-r1': { prompt: 0.55, completion: 2.19, isFree: false },
  'gpt-4o-mini': { prompt: 0.15, completion: 0.60, isFree: false },
  'au.anthropic.claude-sonnet-4-6': { prompt: 3.0, completion: 15.0, isFree: false },
};

/**
 * Record a completed or failed inference request
 */
export function recordInferenceUsage(entry: {
  provider: string;
  model: string;
  taskType?: string;
  success: boolean;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  errorMessage?: string;
}): UsageRecord {
  const inputTokens = entry.inputTokens || 0;
  const outputTokens = entry.outputTokens || 0;
  const totalTokens = inputTokens + outputTokens;

  const pricing = MODEL_PRICING_PER_1M[entry.model] || {
    prompt: 0,
    completion: 0,
    isFree: entry.model.includes(':free') || entry.provider === 'groq' || entry.provider === 'ollama',
  };

  const isFreeTier = pricing.isFree;
  let estimatedCostUsd = 0;

  if (!isFreeTier && entry.success) {
    const promptCost = (inputTokens / 1_000_000) * pricing.prompt;
    const completionCost = (outputTokens / 1_000_000) * pricing.completion;
    estimatedCostUsd = parseFloat((promptCost + completionCost).toFixed(6));
  }

  const record: UsageRecord = {
    id: `usage_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    provider: entry.provider,
    model: entry.model,
    taskType: entry.taskType || 'chat',
    timestamp: new Date().toISOString(),
    success: entry.success,
    latencyMs: entry.latencyMs,
    inputTokens,
    outputTokens,
    totalTokens,
    isFreeTier,
    estimatedCostUsd,
    errorMessage: entry.errorMessage,
  };

  USAGE_LEDGER.unshift(record);
  if (USAGE_LEDGER.length > MAX_LEDGER_SIZE) {
    USAGE_LEDGER.pop();
  }

  return record;
}

/**
 * Retrieve recent usage history
 */
export function getUsageLedger(limit: number = 100): UsageRecord[] {
  return USAGE_LEDGER.slice(0, limit);
}

/**
 * Get aggregated summary statistics by provider
 */
export function getProviderUsageSummaries(): ProviderUsageSummary[] {
  const map = new Map<string, ProviderUsageSummary>();

  for (const record of USAGE_LEDGER) {
    if (!map.has(record.provider)) {
      map.set(record.provider, {
        provider: record.provider,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        averageLatencyMs: 0,
        freeTierRequests: 0,
      });
    }

    const stat = map.get(record.provider)!;
    stat.totalRequests += 1;
    if (record.success) {
      stat.successfulRequests += 1;
    } else {
      stat.failedRequests += 1;
    }
    stat.totalTokens += record.totalTokens;
    stat.totalCostUsd = parseFloat((stat.totalCostUsd + record.estimatedCostUsd).toFixed(6));
    if (record.isFreeTier) {
      stat.freeTierRequests += 1;
    }
  }

  // Calculate average latency
  for (const [provider, stat] of map.entries()) {
    const records = USAGE_LEDGER.filter((r) => r.provider === provider);
    const sumLatency = records.reduce((acc, r) => acc + r.latencyMs, 0);
    stat.averageLatencyMs = records.length > 0 ? Math.round(sumLatency / records.length) : 0;
  }

  return Array.from(map.values());
}
