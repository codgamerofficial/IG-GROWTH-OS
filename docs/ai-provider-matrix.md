# RIIQX AI Provider Capability Matrix & Routing Architecture
**Project**: RIIQX Native AI Creative Ecosystem  
**Layer**: Provider-Independent Multi-Cloud AI Gateway  
**Architecture Policy**: Zero Silent Paid Traps • Capability-Based Selection • Circuit Breakers • Fallback Chains  

---

## 1. AI Provider Capability Matrix

| Provider | Model / Endpoint | Supported Capabilities | Cost Tier | Context Window | Recommended Tasks | Latency / Speed |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Gemini** | `gemini-2.5-flash` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `VISION`, `TOOL_CALLING` | Free Developer Tier | 1,000,000 tokens | Fast reasoning, multimodal analysis, Brand DNA extraction | ~350ms (Ultra-fast) |
| **Google Gemini** | `gemini-1.5-pro` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `VISION`, `TOOL_CALLING`, `EMBEDDINGS` | Commercial / Dev Tier | 2,000,000 tokens | Deep research, complex creative briefs, document analysis | ~1.2s (Deep reasoning) |
| **Groq Cloud** | `llama-3.3-70b-versatile` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `TOOL_CALLING` | Free Developer Tier | 128,000 tokens | Scriptwriting, real-time chat, workflow orchestration | ~180ms (700 tok/sec) |
| **Groq Cloud** | `qwen-2.5-32b` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `TOOL_CALLING` | Free Developer Tier | 128,000 tokens | Fast code generation, Bengali/Hindi multilingual scripts | ~150ms (800 tok/sec) |
| **OpenRouter** | `meta-llama/llama-3.3-70b-instruct` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `TOOL_CALLING` | Free / Pay-per-token | 128,000 tokens | Universal fallback gateway, viral hook generation | ~400ms (Reliable) |
| **AWS Bedrock** | `anthropic.claude-3-5-sonnet` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `VISION`, `TOOL_CALLING` | Enterprise Cloud (IAM SigV4) | 200,000 tokens | High-precision creative direction, complex brand strategy | ~900ms (Highest fidelity) |
| **AWS Bedrock** | `anthropic.claude-3-5-haiku` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `TOOL_CALLING` | Enterprise Cloud (IAM SigV4) | 200,000 tokens | Low-latency agent copilot, classification, safety filter | ~280ms (Fast) |
| **Cohere** | `command-r-plus-08-2024` | `TEXT_GENERATION`, `STRUCTURED_OUTPUT`, `TOOL_CALLING`, `EMBEDDINGS` | Free Trial / Commercial | 128,000 tokens | Enterprise RAG grounding, citations, multi-turn chat | ~650ms (Grounded) |
| **OpenAI Whisper** | `whisper-base / small` (Local PyTorch) | `AUDIO_TRANSCRIPTION` | 100% Free / Local Engine | Unlimited audio chunks | Speech-to-text, 32+ word-level timestamps, pause detection | Real-time x0.2 |
| **Media Engine** | `FLUX.1-schnell / SDXL / Sharp` | `IMAGE_GENERATION`, `IMAGE_EDITING` | Hybrid (Free/API) | N/A | Product photography, canvas visuals, background expansion | ~2.5s per image |

---

## 2. Capability Definitions

To ensure models are never called for unsupported operations, RIIQX uses strict capability-based dispatching:

```typescript
export enum AICapability {
  TEXT_GENERATION = 'TEXT_GENERATION',
  STRUCTURED_OUTPUT = 'STRUCTURED_OUTPUT',
  IMAGE_GENERATION = 'IMAGE_GENERATION',
  IMAGE_EDITING = 'IMAGE_EDITING',
  VIDEO_GENERATION = 'VIDEO_GENERATION',
  AUDIO_TRANSCRIPTION = 'AUDIO_TRANSCRIPTION',
  AUDIO_GENERATION = 'AUDIO_GENERATION',
  EMBEDDINGS = 'EMBEDDINGS',
  TOOL_CALLING = 'TOOL_CALLING',
  VISION = 'VISION',
}
```

### Capability Rule:
- When a task requires `VISION` (e.g. Website logo extraction, Product image inspection, Video keyframe analysis), the router filters strictly for models with `VISION: true` (`Google Gemini 2.5 Flash / 1.5 Pro` or `AWS Bedrock Claude 3.5 Sonnet`).
- When a task requires `AUDIO_TRANSCRIPTION`, the pipeline dispatches directly to the local/server native **Whisper** engine.
- When a task requires `STRUCTURED_OUTPUT` (e.g. Brand DNA JSON, Storyboard JSON, Workflow graph), JSON schemas with Zod validation are enforced.

---

## 3. Circuit Breaker & Fallback Chain Architecture

Every provider has an independent, thread-safe circuit breaker in `src/lib/riiqx/provider-registry.ts`:

```
Request Dispatch
       │
       ▼
[Circuit Breaker Check] ──── Open (Cooling Down) ───► Fallback Provider
       │
     Closed
       │
       ▼
[Call Primary Provider] ──── Error (Timeout / Rate Limit)
       │                              │
       │ (Success)                    ▼
       ▼                     Increment Failures
Record Token Usage                    │
Return Response               Failures >= 3? ── Yes ──► Trip Circuit (Open 60s)
                                      │
                                      ▼
                             Dispatch to Secondary Fallback
```

### Multi-Tier Fallback Chains by Task:

1. **Brand Intelligence & Multimodal Analysis**:
   - Primary: `Google Gemini 2.5 Flash` (High speed, 1M context, vision enabled)
   - Secondary: `AWS Bedrock Claude 3.5 Sonnet`
   - Tertiary: `Google Gemini 1.5 Pro`

2. **Campaign Studio & Scriptwriting**:
   - Primary: `Groq Llama 3.3 70B` (Ultra-low latency, free developer tier)
   - Secondary: `Google Gemini 2.5 Flash`
   - Tertiary: `OpenRouter Llama 3.3 70B`

3. **Workflow NLP Synthesis & Logic Processing**:
   - Primary: `Groq Qwen 2.5 32B` / `Llama 3.3 70B`
   - Secondary: `Cohere Command R+`
   - Tertiary: `AWS Bedrock Claude 3.5 Haiku`

4. **Speech Transcription & Pacing**:
   - Primary: Native Local `OpenAI Whisper` (PyTorch)
   - Secondary: Fallback to FFprobe audio segment analysis

---

## 4. Cost Control & Transparent Pricing Policy

### Non-Negotiable Rules:
1. **Never claim a service is free merely because the UI is free**: RIIQX transparently reports whether a request ran via an open-source local binary, a free developer tier quota, or a commercial pay-per-token API.
2. **Zero Silent Paid Traps**: Priority is always routed to configured Free Developer Tier models (`Gemini Flash`, `Groq Llama 3.3 70B`, `Local Whisper`).
3. **Usage Logging**: Every completed inference records:
   - `provider_id`
   - `model_id`
   - `prompt_tokens`
   - `completion_tokens`
   - `latency_ms`
   - `is_free_tier`
   Stored persistently in `public.ai_provider_usage`.

---

## 5. Environment Variable Reference (Sanitized)

The table below lists the required environment keys without exposing any secret tokens or credentials:

| Variable Name | Required | Provider / Service | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Recommended | Google AI Studio | Powers Gemini 2.5 Flash / 1.5 Pro multimodal analysis |
| `GROQ_API_KEY` | Recommended | Groq Cloud | Powers ultra-fast Llama 3.3 70B and Qwen 2.5 32B inference |
| `OPENROUTER_API_KEY` | Optional | OpenRouter | Universal multi-model fallback gateway |
| `AWS_ACCESS_KEY_ID` | Optional | AWS Bedrock | Enterprise Claude 3.5 Sonnet / Haiku access via IAM |
| `AWS_SECRET_ACCESS_KEY` | Optional | AWS Bedrock | Paired with `AWS_REGION` (`ap-southeast-2`) |
| `AWS_REGION` | Optional | AWS Bedrock | Selected region for Bedrock runtime |
| `COHERE_API_KEY` | Optional | Cohere AI | Command R+ and multilingual embeddings |
| `NEXT_PUBLIC_SUPABASE_URL` | Mandatory | Supabase | Production Supabase database and Auth endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Mandatory | Supabase | Client-side cookie authentication key |
| `SUPABASE_SERVICE_ROLE_KEY` | Mandatory | Supabase (Server Only) | Server-side credential vault & administrative queries |
| `TOKEN_ENCRYPTION_KEY` | Mandatory | AES-256 Vault | 32-byte hexadecimal key for OAuth token encryption |

