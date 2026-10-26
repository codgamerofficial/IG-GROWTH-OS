// =============================================================================
// NUVEXA AI — Model Registry & Open-Weight Ecosystem
// Strictly open-weight first. Zero mandatory paid APIs. Zero faking.
// =============================================================================

export type ModelProviderType = 'ollama' | 'openai-compatible' | 'agentrouter' | 'bedrock';

export interface NuvexaModel {
  id: string;
  name: string;
  tag: string;
  provider: ModelProviderType;
  modelString: string;
  description: string;
  contextWindow: number;
  recommendedFor: 'general' | 'coding' | 'reasoning' | 'fast';
  license: string;
  isLocal: boolean;
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

export const NUVEXA_MODELS: NuvexaModel[] = [
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 (3B Instruct)',
    tag: 'Fast & Versatile',
    provider: 'ollama',
    modelString: 'llama3.2',
    description: 'High-speed open-weight general model by Meta. Ideal for local edge execution and quick dialogue.',
    contextWindow: 128000,
    recommendedFor: 'fast',
    license: 'Llama 3.2 Community License',
    isLocal: true,
    isOpenWeight: true,
    strengths: ['Low latency', 'Resource efficient', 'General dialogue', 'Multilingual'],
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B (Instruct v0.3)',
    tag: 'Reliable Workhorse',
    provider: 'ollama',
    modelString: 'mistral',
    description: 'Permissively licensed benchmark model by Mistral AI with function calling and strong reasoning.',
    contextWindow: 32768,
    recommendedFor: 'general',
    license: 'Apache 2.0',
    isLocal: true,
    isOpenWeight: true,
    strengths: ['Apache 2.0 licensed', 'Rigorous logic', 'Consistent instruction following'],
  },
  {
    id: 'qwen-2.5-coder-7b',
    name: 'Qwen 2.5 Coder (7B)',
    tag: 'Specialized Code Copilot',
    provider: 'ollama',
    modelString: 'qwen2.5-coder:7b',
    description: 'Top-tier open-source coding engine by Alibaba. Excels in multi-file refactoring, debugging, and syntax checks.',
    contextWindow: 32768,
    recommendedFor: 'coding',
    license: 'Apache 2.0',
    isLocal: true,
    isOpenWeight: true,
    strengths: ['Deep code synthesis', 'Architecture design', 'AST understanding', 'Test generation'],
  },
  {
    id: 'deepseek-r1-distill-8b',
    name: 'DeepSeek R1 Distill (8B)',
    tag: 'Chain-of-Thought Reasoning',
    provider: 'ollama',
    modelString: 'deepseek-r1:8b',
    description: 'State-of-the-art open reasoning model featuring step-by-step verifiable cognitive trace reflection.',
    contextWindow: 65536,
    recommendedFor: 'reasoning',
    license: 'MIT',
    isLocal: true,
    isOpenWeight: true,
    strengths: ['Complex math', 'Symbolic logic', 'Multi-step planning', 'Self-verification'],
  },
  {
    id: 'gemma-2-9b',
    name: 'Gemma 2 (9B Instruct)',
    tag: 'Research & Synthesis',
    provider: 'ollama',
    modelString: 'gemma2:9b',
    description: 'Google open-weight architecture tuned for structured research, long-form synthesis, and balanced safety.',
    contextWindow: 8192,
    recommendedFor: 'general',
    license: 'Gemma Open Terms',
    isLocal: true,
    isOpenWeight: true,
    strengths: ['Knowledge retrieval', 'Academic writing', 'Factual precision'],
  },
  {
    id: 'custom-openai-compatible',
    name: 'Custom Open-Weight Server (vLLM / LMStudio)',
    tag: 'Self-Hosted API',
    provider: 'openai-compatible',
    modelString: 'custom-model',
    description: 'Connect any local or cluster-hosted vLLM, LMStudio, LocalAI, or llama.cpp endpoint with custom tokens.',
    contextWindow: 32768,
    recommendedFor: 'general',
    license: 'Configurable',
    isLocal: false,
    isOpenWeight: true,
    strengths: ['Cluster scale', 'Custom fine-tunes', 'GPU farm integration'],
  },
  {
    id: 'bedrock-claude-sonnet',
    name: 'Claude Sonnet 4 / 3.7 (AWS Bedrock)',
    tag: 'Enterprise Cloud AI',
    provider: 'bedrock',
    modelString: process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6',
    description: 'Direct AWS Bedrock Runtime Converse integration in ap-southeast-2 with real IAM & Bearer authentication.',
    contextWindow: 200000,
    recommendedFor: 'reasoning',
    license: 'Anthropic Commercial / AWS Managed',
    isLocal: false,
    isOpenWeight: false,
    strengths: ['Deep contextual synthesis', 'Multi-step logic', 'Direct AWS cloud inference', 'Honest quota tracking'],
  },
];
