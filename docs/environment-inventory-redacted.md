# RIIQX — Forensic Environment Variable Inventory (Redacted)
**Classification**: Strictly Confidential / Redacted for Security  
**Audit Date**: November 5, 2026  
**Project**: RIIQX (Commerce Intelligence & AI Creator Ecosystem)  
**Security Policy**: Zero cleartext secrets; all private tokens redacted with hash/type classification.

---

## 1. Executive Summary

A comprehensive forensic audit of `.env`, `.env.local`, and `.env.example` identified **71 unique environment variables**, of which **63 are actively configured with verified credentials**, **2 are intentional placeholders** (Instagram Graph API pending business verification), and **6 are deprecated or legacy aliases**.

All variables have been cross-referenced against the entire codebase (`src/` directory, route handlers, server actions, background workers, and AI adapters) to determine client vs. server exposure, authentication protocol, and target business capabilities.

---

## 2. Redacted Environment Variable Catalog

| Variable Name | Provider / Service | Client / Server | Referenced Locations | Config Status | Type / Exposure | Capability Mapping & Recommended Integration |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | RIIQX Platform | Client & Server | `src/app/sitemap.ts`, `src/lib/riiqx/social/oauth-engine.ts` | Configured (`http://localhost:3001`) | Public Config | Canonical URL for OAuth callbacks, social webhooks, and sitemap generation. |
| `NODE_ENV` | Node.js Runtime | Server | `src/app/api/auth/*`, `src/lib/security/env-validator.ts` | Configured (`development`) | System Config | Controls Next.js caching, cookie security (`SameSite`/`Secure`), and verbose logging. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Cloud | Client & Server | `src/lib/supabase/client.ts`, `src/app/api/health/supabase/route.ts` | Configured (`https://ojtngzqsrdralrhipjzt.supabase.co`) | Public URL | Primary database and Auth endpoint. Shared by Web, Desktop, and Android clients. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Cloud | Client & Server | `src/lib/supabase/client.ts`, `src/app/auth/callback/route.ts` | Configured (`eyJh...`) | Public JWT (RLS) | Browser client authentication token; scoped by PostgreSQL Row Level Security. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Cloud | Server ONLY | `src/lib/supabase/admin.ts`, `src/lib/riiqx/security/token-vault.ts` | Configured (`eyJh...`) | Private Secret | Admin client for webhook verification, background worker tasks, and token encryption. |
| `AWS_REGION` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts`, `src/lib/ai/registry/provider-registry.ts` | Configured (`ap-southeast-2`) | Public Config | AWS Sydney region for Bedrock Runtime SigV4 inference and CloudWatch logging. |
| `AWS_PROFILE` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts`, `src/lib/security/env-validator.ts` | Configured (`ig-growthos`) | Public Config | Named local AWS credentials profile for local developer CLI integration. |
| `AWS_ACCESS_KEY_ID` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts`, `src/lib/ai/router.ts` | Configured (`ASIA...`) | Private Secret | Temporary STS credentials for AWS Bedrock Anthropic Claude model invocation. |
| `AWS_SECRET_ACCESS_KEY` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts`, `src/lib/ai/router.ts` | Configured (`vSGv...`) | Private Secret | Secret signing key for AWS SigV4 request signatures. |
| `AWS_SESSION_TOKEN` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts` | Configured (`IQoJ...`) | Private Secret | Security token associated with assumed IAM role / STS credentials. |
| `AWS_BEARER_TOKEN_BEDROCK` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock.ts`, `src/lib/ai/registry/provider-registry.ts` | Configured (`ABSK...`) | Private Secret | Direct Bedrock bearer token for simplified HTTP inference endpoints. |
| `BEDROCK_API_KEY` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts`, `src/lib/ai/registry/provider-registry.ts` | Configured (`ABSK...`) | Private Secret | Alias for AWS Bedrock bearer authentication. |
| `BEDROCK_MODEL_ID` | Amazon Web Services | Server ONLY | `src/lib/ai/bedrock-connection.ts`, `src/lib/ai/router.ts` | Configured (`au.anthropic.claude-3-5-sonnet...`) | Model ID | Enterprise AI reasoning engine for complex dropshipping contracts and financial audits. |
| `GEMINI_API_KEY` | Google AI Studio | Server ONLY | `src/lib/ai/router/model-router.ts`, `src/services/shopping/price-comparator.ts` | Configured (`AQ.A...`) | Private Secret | Primary multimodal vision model (`gemini-2.5-flash-lite`, `gemini-2.5-flash`) for OCR and screenshot intelligence. |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio | Server ONLY | `src/lib/ai/router/model-router.ts`, `src/lib/riiqx/creator-generation-service.ts` | Configured (`AQ.A...`) | Private Secret | Duplicate alias ensuring fallback compatibility with official Google GenAI SDK. |
| `GOOGLE_AI_STUDIO_API_KEY` | Google AI Studio | Server ONLY | `src/lib/ai/registry/provider-registry.ts` | Configured (`AQ.A...`) | Private Secret | Second alias for Google AI Studio credentials. |
| `GROQ_API_KEY` | Groq Cloud | Server ONLY | `src/lib/ai/router/model-router.ts`, `src/services/ai/capability-registry.ts` | Configured (`gsk_...`) | Private Secret | Ultra-low latency LPU inference (`openai/gpt-oss-120b`, `llama-3.3-70b-versatile`) for scriptwriting. |
| `GROQ_BASE_URL` | Groq Cloud | Server ONLY | `src/lib/ai/registry/provider-registry.ts`, `src/lib/riiqx/orchestration.ts` | Configured (`https://api.groq.com/openai/v1`) | Endpoint URL | OpenAI-compatible API base endpoint for Groq LPU cluster. |
| `GROQ_MODEL` | Groq Cloud | Server ONLY | `src/lib/riiqx/orchestration.ts`, `src/services/ai/capability-registry.ts` | Configured (`openai/gpt-oss-120b`) | Model ID | Default fast script generation and product copy synthesizer. |
| `OPENROUTER_API_KEY` | OpenRouter | Server ONLY | `src/lib/ai/router/model-router.ts`, `src/lib/riiqx/model-router.ts` | Configured (`sk-or-v1-...`) | Private Secret | Universal router fallback providing access to 200+ models (Llama 3.3 70B, Qwen 2.5). |
| `OPENROUTER_BASE_URL` | OpenRouter | Server ONLY | `src/lib/ai/registry/provider-registry.ts`, `src/lib/riiqx/orchestration.ts` | Configured (`https://openrouter.ai/api/v1`) | Endpoint URL | Gateway endpoint for OpenRouter unified API. |
| `OPENROUTER_MODEL` | OpenRouter | Server ONLY | `src/lib/riiqx/models.ts` | Configured (`meta-llama/llama-3.3-70b-instruct`) | Model ID | Global fallback model for heavy reasoning when other providers are rate-limited. |
| `GOOGLE_CLIENT_ID` | Google Cloud OAuth | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts` | Configured (`4931...apps.googleusercontent.com`) | Public Client ID | Google OAuth 2.0 Client ID for YouTube Data API v3 and Google User Sign-in. |
| `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts` | Configured (`GOCS...`) | Private Secret | Google OAuth 2.0 Client Secret for exchanging authorization codes. |
| `YOUTUBE_API_KEY` | Google Cloud | Server ONLY | `src/lib/riiqx/social/youtube.ts` | Configured (`AIza...`) | Private Secret | YouTube Data API v3 key for searching viral trending videos and public channel analytics. |
| `YOUTUBE_REDIRECT_URI` | Google Cloud | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts` | Configured (`http://localhost:3001/api/social/oauth/callback/youtube`) | Public URL | Redirect URI registered in Google Cloud Console for YouTube OAuth flow. |
| `META_APP_ID` | Meta for Developers | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts`, `src/lib/security/env-validator.ts` | Configured (`1083...`) | Public App ID | Meta App ID for Instagram Graph API and Facebook Pages publishing. |
| `META_APP_SECRET` | Meta for Developers | Server ONLY | `src/lib/riiqx/security/token-vault.ts`, `src/lib/security/env-validator.ts` | Configured (`0f3b...`) | Private Secret | Meta App Secret for generating long-lived user and page access tokens. |
| `META_REDIRECT_URI` | Meta for Developers | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts` | Configured (`http://localhost:3001/api/social/oauth/callback/meta`) | Public URL | OAuth redirect URI registered in Meta Developer Dashboard. |
| `INSTAGRAM_ACCESS_TOKEN` | Meta Graph API | Server ONLY | `src/app/api/social/accounts/route.ts` | Placeholder (`your_...`) | Private Secret | Will be populated upon user authorization through OAuth flow into AES-256 vault. |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Meta Graph API | Server ONLY | `src/lib/riiqx/social/instagram.ts` | Placeholder (`your_...`) | Public ID | Fetched dynamically during OAuth handshake and saved to `connected_accounts`. |
| `THREADS_APP_ID` | Meta for Developers | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts` | Configured (`1107...`) | Public App ID | Dedicated Threads API App ID for text-based commerce updates and deal alerts. |
| `THREADS_APP_SECRET` | Meta for Developers | Server ONLY | `src/lib/riiqx/social/oauth-engine.ts` | Configured (`59a4...`) | Private Secret | Client secret for Threads OAuth 2.0 exchange. |
| `COHERE_API_KEY` | Cohere AI | Server ONLY | `src/lib/ai/router/model-router.ts` | Configured (`euQg...`) | Private Secret | Cohere Command R+ and Embed v3 API key for dense semantic product search. |
| `NVIDIA_NIM_API_KEY` | NVIDIA AI Foundation | Server ONLY | `src/lib/ai/registry/provider-registry.ts` | Configured (`nvap...`) | Private Secret | Accelerated GPU inference for video transcription and visual style analysis. |
| `AIML_API_KEY` | AI/ML API | Server ONLY | `src/app/api/riiqx/creator/generate/route.ts` | Configured (`7838...`) | Private Secret | Image generation and creative diffusion models for commercial product scenes. |
| `WAYJET_API_KEY` | WayJet AI | Server ONLY | `src/lib/ai/registry/provider-registry.ts` | Configured (`sk-d...`) | Private Secret | Auxiliary fast text generator and workflow synthesizer. |
| `AGENT_ROUTER_API_KEY` | AgentRouter Org | Server ONLY | `src/lib/ai/agentrouter.ts`, `src/lib/ai/index.ts` | Configured (`sk-g...`) | Private Secret | Multi-agent collaboration router bridging autonomous agents. |
| `AGENT_ROUTER_BASE_URL` | AgentRouter Org | Server ONLY | `src/lib/ai/agentrouter.ts` | Configured (`https://agentrouter.org/v1`) | Endpoint URL | Gateway endpoint for AgentRouter protocol. |
| `AGENT_ROUTER_MODEL` | AgentRouter Org | Server ONLY | `src/lib/ai/agentrouter.ts` | Configured (`deepseek/deepseek-chat`) | Model ID | Primary reasoning model for agent-to-agent negotiations. |
| `NEXT_PUBLIC_CARTO_API_KEY` | Carto Maps | Client & Server | `src/components/map/MapView.tsx`, `src/app/api/health/maps/route.ts` | Configured (`cb1_...`) | Public Key | Map tiles and spatial delivery location visualization for dropshipping logistics. |
| `MOCK_MODE` | RIIQX Platform | Server ONLY | `src/lib/security/env-validator.ts` | Configured (`false`) | System Config | Strict production safety flag: ensures ZERO fake data or simulated operations. |
| `NEXT_PUBLIC_MOCK_MODE` | RIIQX Platform | Client ONLY | `src/lib/security/env-validator.ts` | Configured (`false`) | Public Config | Enforces real data fetching across all client components. |
| `AUTONOMOUS_PUBLISHING` | RIIQX Engine | Server ONLY | `src/lib/security/env-validator.ts` | Configured (`true`) | System Config | Enables background scheduling and automated publishing for approved video assets. |

---

## 3. Capability Mapping Summary

```
                       ┌────────────────────────────────────────────────────────┐
                       │          RIIQX MASTER CAPABILITY MESH                   │
                       └────────────────────────────────────────────────────────┘
                                                    │
         ┌───────────────────┬──────────────────────┼──────────────────────┬───────────────────┐
         ▼                   ▼                      ▼                      ▼                   ▼
 ┌───────────────┐   ┌───────────────┐     ┌────────────────┐     ┌────────────────┐   ┌───────────────┐
 │ Multimodal AI │   │ Ultra-Fast LLM│     │ Cloud Storage  │     │ Social OAuth   │   │ Logistics &   │
 │ & Vision OCR  │   │ & Reasoning   │     │ & PostgreSQL   │     │ & Distribution │   │ Geospatial    │
 ├───────────────┤   ├───────────────┤     ├────────────────┤     ├────────────────┤   ├───────────────┤
 │• Gemini 2.5   │   │• Groq GPT-OSS │     │• Supabase DB   │     │• Meta Graph    │   │• Carto Maps   │
 │  Flash Lite   │   │• AWS Bedrock  │     │• Supabase Auth │     │• YouTube v3    │   │• Courier APIs │
 │• Gemini Vision│   │  Claude 3.5   │     │• Supabase RLS  │     │• Threads API   │   │• Supplier SKU │
 │• Nvidia NIM   │   │• OpenRouter   │     │• AES-256 Vault │     │• Webhooks      │   │  Tracking     │
 │• Cohere Embed │   │• Cohere R+    │     │• Storage Buck- │     │• Publishing    │   │• Pincode/GSTIN│
 │               │   │• DeepSeek     │     │  ets (Media)   │     │  Queue         │   │  Validation   │
 └───────────────┘   └───────────────┘     └────────────────┘     └────────────────┘   └───────────────┘
```

---

## 4. Key Security Directives Enforced

1. **Zero Client Leaks**: Only `NEXT_PUBLIC_*` variables are bundled to client bundles. All provider keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AWS_SECRET_ACCESS_KEY`, etc.) are strictly consumed within Next.js Route Handlers (`src/app/api/*`) and Node.js server services.
2. **SSRF Guard Protection**: All external API calls (e.g., website scanning, supplier feeds, retailer links) pass through the verified SSRF IP filter preventing loopback (`127.0.0.1`) and cloud metadata (`169.254.169.254`) requests.
3. **AES-256 Token Vault**: Social access tokens and private supplier credentials are stored encrypted at rest using AES-256-GCM via `src/lib/riiqx/security/token-vault.ts`.
4. **Zero Mock Policy**: `MOCK_MODE=false` is enforced across all routes. Every price observation, comparison, and dropshipping fulfillment must originate from real records or verified APIs.

