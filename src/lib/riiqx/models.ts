// =============================================================================
// RIIQX — Online-First Model Registry & Provider Ecosystem
// Online Cloud Intelligence • Zero Mandatory Local Setup • Honest Telemetry
// =============================================================================

export type ModelProviderType =
  | 'bedrock'
  | 'groq'
  | 'openrouter'
  | 'cohere'
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
  isFreeTier?: boolean;
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
  // 1. Ultra-Fast Verified Free Model: Groq Qwen 3.8 27B
  {
    id: 'groq-qwen-27b',
    name: 'Qwen 3.8 27B (Groq LPU Free Tier)',
    tag: 'Ultra-Fast 150ms Free Model',
    provider: 'groq',
    modelString: 'qwen/qwen3.8-27b',
    description: 'Sub-200ms ultra-fast inference via Groq Cloud custom LPUs with zero latency overhead. 100% Free Tier.',
    contextWindow: 32768,
    recommendedFor: 'fast',
    license: 'Qwen Community / Free LPU',
    isOnline: true,
    isOpenWeight: true,
    isFreeTier: true,
    strengths: ['150ms sub-second latency', 'High throughput', 'Zero cost free tier', 'Live verified'],
  },

  // 2. High-Speed Verified Fallback: Groq Cloud GPT-OSS 120B
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
    isFreeTier: true,
    strengths: ['Sub-second latency (250+ tokens/sec)', 'Deep reasoning', 'Broad world knowledge', 'Live verified'],
  },

  // 3. Primary Verified Online Cloud Model: OpenRouter Llama 3.3 70B Instruct
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
    isFreeTier: false,
    strengths: ['Multi-datacenter redundancy', 'Fast streaming', 'Broad benchmark leadership', 'Live verified'],
  },

  // 4. Verified Online DeepSeek V3 (OpenRouter)
  {
    id: 'openrouter-deepseek',
    name: 'DeepSeek Chat V3 (OpenRouter)',
    tag: 'Verified Online DeepSeek',
    provider: 'openrouter',
    modelString: 'deepseek/deepseek-chat',
    description: 'Real DeepSeek-V3 671B MoE architecture with ultra-fast streaming and superior coding and reasoning performance.',
    contextWindow: 64000,
    recommendedFor: 'coding',
    license: 'DeepSeek Open Weight',
    isOnline: true,
    isOpenWeight: true,
    isFreeTier: false,
    strengths: ['State-of-the-art coding', 'Deep reasoning', 'Low latency', 'Live verified online'],
  },

  // 5. Verified Online Free Model: Gemma 4 31B IT (OpenRouter)
  {
    id: 'openrouter-gemma-free',
    name: 'Gemma 4 31B IT (OpenRouter Free)',
    tag: '100% Free OpenRouter Tier',
    provider: 'openrouter',
    modelString: 'google/gemma-4-31b-it:free',
    description: 'Google Gemma 4 instruction-tuned model served with zero token charges via OpenRouter free tier.',
    contextWindow: 32768,
    recommendedFor: 'general',
    license: 'Gemma Terms of Use',
    isOnline: true,
    isOpenWeight: true,
    isFreeTier: true,
    strengths: ['100% Free tier (Cost $0.00)', 'Clean instruction following', 'General conversation', 'Live verified'],
  },

  // 6. Verified Online Free Model: Cohere Command R+ (Cohere Free Developer Tier)
  {
    id: 'cohere-command-r-plus',
    name: 'Command R+ 08-2024 (Cohere Cloud)',
    tag: '128K Context Research Model',
    provider: 'cohere',
    modelString: 'command-r-plus-08-2024',
    description: 'Enterprise reasoning model with 128k context window, native citation grounding, and deep synthesis via Cohere Free Dev Tier.',
    contextWindow: 128000,
    recommendedFor: 'reasoning',
    license: 'Cohere Developer Tier',
    isOnline: true,
    isOpenWeight: false,
    isFreeTier: true,
    strengths: ['128K context window', 'Native citations', 'Deep research', 'Free developer tier'],
  },

  // 4. Verified Online DeepSeek R1 Reasoning (OpenRouter)
  {
    id: 'openrouter-deepseek-r1',
    name: 'DeepSeek R1 Reasoning (OpenRouter)',
    tag: 'Advanced Reasoning Engine',
    provider: 'openrouter',
    modelString: 'deepseek/deepseek-r1',
    description: 'DeepSeek R1 reinforcement-learning reasoning model with transparent chain-of-thought analysis.',
    contextWindow: 64000,
    recommendedFor: 'reasoning',
    license: 'MIT / Open Weight',
    isOnline: true,
    isOpenWeight: true,
    strengths: ['Complex problem solving', 'Chain-of-thought', 'Algorithmic logic', 'Live verified online'],
  },

  // 5. Enterprise AWS Bedrock (Claude Sonnet 4 / 3.7)
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

  // 6. OpenAI Direct / GPT-4o Mini
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

  // 7. Secondary Online Aggregator: DeepSeek v4 Flash / Agent Router
  {
    id: 'agentrouter-deepseek',
    name: 'DeepSeek v4 Flash (Agent Router)',
    tag: 'Ultra-Fast Gateway',
    provider: 'agentrouter',
    modelString: process.env.AGENT_ROUTER_MODEL || 'deepseek/deepseek-chat',
    description: 'High-throughput reasoning dispatched via Agent Router gateway with automatic verified DeepSeek fallback.',
    contextWindow: 64000,
    recommendedFor: 'fast',
    license: 'DeepSeek Commercial / Gateway',
    isOnline: true,
    isOpenWeight: true,
    strengths: ['High throughput', 'Code generation', 'Auto-failover to verified DeepSeek'],
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
