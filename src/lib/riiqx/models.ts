// =============================================================================
// RIIQX — Online-First Model Registry & Provider Ecosystem
// Online Cloud Intelligence • Zero Mandatory Local Setup • Honest Telemetry
// =============================================================================

export type ModelProviderType =
  | 'bedrock'
  | 'groq'
  | 'openrouter'
  | 'openai'
  | 'agentrouter'
  | 'openai-compatible'
  | 'ollama';

export interface RiiqxModel {
  id: string;
  name: string;
  tag: string;
  provider: ModelProviderType;
  modelString: string;
  description: string;
  contextWindow: number;
  recommendedFor: 'general' | 'coding' | 'reasoning' | 'fast';
  license: string;
  isOnline: boolean;
  isOpenWeight: boolean;
  strengths: string[];
}

export interface ProviderHealth {
  provider: ModelProviderType;
  status: 'online' | 'offline' | 'checking' | 'unconfigured';
  endpoint: string;
  latencyMs?: number;
  availableModels: string[];
  errorMessage?: string;
  checkedAt?: string;
}

export const RIIQX_MODELS: RiiqxModel[] = [
  // 1. Primary Verified Online Cloud Model: OpenRouter Llama 3.3 70B Instruct
  {
    id: 'openrouter-llama-70b',
    name: 'Llama 3.3 70B Instruct (OpenRouter)',
    tag: 'Verified Online Cloud Model',
    provider: 'openrouter',
    modelString: 'meta-llama/llama-3.3-70b-instruct',
    description: 'High-precision reasoning, multi-turn dialogue, and fast code generation via OpenRouter multi-cloud gateway.',
    contextWindow: 131072,
    recommendedFor: 'general',
    license: 'Llama 3.3 Community',
    isOnline: true,
    isOpenWeight: true,
    strengths: ['Multi-datacenter redundancy', 'Fast streaming', 'Broad benchmark leadership', 'Live verified'],
  },

  // 2. High-Speed Verified Fallback: Groq Cloud LPU
  {
    id: 'groq-gpt-120b',
    name: 'GPT-OSS 120B (Groq Cloud LPU)',
    tag: 'Ultra-Fast LPU Inference',
    provider: 'groq',
    modelString: 'openai/gpt-oss-120b',
    description: 'Lightning-fast inference via Groq Cloud custom LPUs with zero latency overhead.',
    contextWindow: 128000,
    recommendedFor: 'fast',
    license: 'Open-Weight / Groq Managed',
    isOnline: true,
    isOpenWeight: true,
    strengths: ['Sub-second latency (250+ tokens/sec)', 'Deep reasoning', 'Broad world knowledge', 'Live verified'],
  },

  // 3. Enterprise AWS Bedrock (Claude Sonnet 4 / 3.7)
  {
    id: 'bedrock-claude-sonnet',
    name: 'Claude Sonnet 4 / 3.7 (AWS Bedrock)',
    tag: 'Enterprise Cloud Intelligence',
    provider: 'bedrock',
    modelString: process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6',
    description: 'High-precision reasoning powered directly by AWS Bedrock in selected Region ap-southeast-2 (requires console Model Access).',
    contextWindow: 200000,
    recommendedFor: 'reasoning',
    license: 'Anthropic Commercial / AWS Managed',
    isOnline: false,
    isOpenWeight: false,
    strengths: ['Deep contextual synthesis', 'Multi-step logic', 'Direct AWS cloud inference', 'Real enterprise grounding'],
  },

  // 4. OpenAI Direct / GPT-4o Mini
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini (OpenAI Cloud)',
    tag: 'Cloud Vision & Intelligence',
    provider: 'openai',
    modelString: 'gpt-4o-mini',
    description: 'Affordable, low-latency multimodal reasoning and concise code generation.',
    contextWindow: 128000,
    recommendedFor: 'general',
    license: 'OpenAI Commercial',
    isOnline: true,
    isOpenWeight: false,
    strengths: ['Multimodal support', 'Fast response times', 'Reliable instruction following'],
  },

  // 5. Secondary Online Aggregator: DeepSeek v4 Flash / Agent Router
  {
    id: 'agentrouter-deepseek',
    name: 'DeepSeek v4 Flash (Agent Router)',
    tag: 'Ultra-Fast Gateway',
    provider: 'agentrouter',
    modelString: process.env.AGENT_ROUTER_MODEL || 'deepseek-v4-flash',
    description: 'High-throughput reasoning and code synthesis dispatched via server-side OpenAI-compatible gateway.',
    contextWindow: 64000,
    recommendedFor: 'fast',
    license: 'DeepSeek Commercial / Gateway',
    isOnline: true,
    isOpenWeight: true,
    strengths: ['High throughput', 'Code generation', 'Low cost'],
  },

  // 6. Custom Self-Hosted / Cluster Endpoint (OpenAI Compatible)
  {
    id: 'custom-openai-compatible',
    name: 'Custom Cloud / Cluster Server (vLLM / LMStudio)',
    tag: 'Configurable Endpoint',
    provider: 'openai-compatible',
    modelString: 'custom-model',
    description: 'Connect any remote or team-hosted OpenAI-compatible endpoint with custom API tokens.',
    contextWindow: 32768,
    recommendedFor: 'general',
    license: 'Configurable',
    isOnline: true,
    isOpenWeight: true,
    strengths: ['Cluster scale', 'Custom fine-tunes', 'GPU cloud integration'],
  },

  // 7. Local Development Fallbacks (Optional - NOT required for production)
  {
    id: 'ollama-qwen-coder',
    name: 'Qwen 2.5 Coder 7B (Local Fallback)',
    tag: 'Local Offline Copilot',
    provider: 'ollama',
    modelString: 'qwen2.5-coder:7b',
    description: 'Optional local fallback for offline coding and AST inspection via Ollama daemon.',
    contextWindow: 32768,
    recommendedFor: 'coding',
    license: 'Apache 2.0',
    isOnline: false,
    isOpenWeight: true,
    strengths: ['100% offline fallback', 'AST understanding', 'Test generation'],
  },
  {
    id: 'ollama-llama-3.2',
    name: 'Llama 3.2 3B (Local Fallback)',
    tag: 'Local Edge Dialogue',
    provider: 'ollama',
    modelString: 'llama3.2',
    description: 'Optional edge fallback for quick conversational tasks when offline.',
    contextWindow: 128000,
    recommendedFor: 'fast',
    license: 'Llama 3.2 Community License',
    isOnline: false,
    isOpenWeight: true,
    strengths: ['Low memory footprint', 'Local fallback'],
  },
];
