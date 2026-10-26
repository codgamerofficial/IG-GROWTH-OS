# RIIQX — Environment & Provider Capability Matrix

**Security Standard:** Strict Confidentiality • Zero Plaintext Secrets • Verified Server-Side Injection  
**Last Updated:** October 26, 2026  

---

## 1. Provider & Capability Overview

| Variable / Group | Provider | Status | Verified Capability | Unlocked Feature in RIIQX |
| :--- | :--- | :--- | :--- | :--- |
| `AWS_REGION` (`ap-southeast-2`) | Amazon Web Services | **Configured** | Australia Southeast Regional Endpoint | Region compliance, lowest latency cross-border calls |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | AWS IAM SigV4 | **Authorized** | `bedrock:InvokeModel`, `bedrock:Converse` | Live cloud inference via Amazon Bedrock Runtime |
| `BEDROCK_API_KEY`, `AWS_BEARER_TOKEN_BEDROCK` | AWS Bedrock API | **Configured** | Bedrock Bearer Token Auth | Fallback authentication for Bedrock runtime |
| `BEDROCK_MODEL_ID` (`au.anthropic.claude-sonnet-4-6`) | Anthropic / AWS | **Live & Authorized** | Claude Sonnet 4 / 3.7 Inference Profile | **Online-First Primary AI Engine**, deep planning, code synthesis, hook analysis |
| `AGENT_ROUTER_API_KEY`, `AGENT_ROUTER_BASE_URL` | Agent Router / OpenAI-Compatible | **Configured** | Endpoint: `https://agentrouter.org/v1` | Multi-model aggregation gateway, custom open-weight server adapter |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` (`596660929655724`) | Meta Graph API | **Configured** | Target Business Account container routing | **Creator Studio & Autopilot** Reel publishing and account telemetry |
| `INSTAGRAM_ACCESS_TOKEN` | Meta Graph API | **Configured (Expired)** | Session expired Oct 7; requires renewal via Meta Dev Portal | Reel container creation, status polling, live media publishing |
| `META_APP_ID`, `META_APP_SECRET` | Meta Developers | **Configured** | OAuth token refresh & client credentials | Long-lived token exchange and OAuth reconnect flow |
| `THREADS_APP_ID`, `THREADS_APP_SECRET` | Meta Threads API | **Configured** | Microblogging cross-posting | Cross-platform text snippets and hooks distribution |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase (PostgreSQL) | **Configured** | Hosted PostgreSQL REST & Auth API | Non-Firebase persistent cloud storage for task states & autopilot queues |
| `OLLAMA_BASE_URL` (`localhost:11434`) | Local Ollama Engine | **Online (Optional)** | `qwen2.5-coder:1.5b-base` (7ms latency) | **Optional local development fallback**; zero production requirement |
| `NEXT_PUBLIC_APP_URL` (`http://localhost:3000`) | RIIQX Host | **Active** | Primary Web & API base endpoint | Mobile app connectivity, CORS origins, webhooks |

---

## 2. Capability Matrix by Core Feature

### A. Online-First Conversational Intelligence & Planning
- **Active Engine:** AWS Bedrock Claude Sonnet (`au.anthropic.claude-sonnet-4-6`) in `ap-southeast-2`.
- **Operating Mode:** Online-First. No local daemon or GPU required.
- **Quota Management:** Tracks daily token limits and provides transparent error recovery.
- **Fallback Hierarchy:**
  1. AWS Bedrock Claude Sonnet (Primary Cloud)
  2. OpenAI-Compatible Aggregator (Secondary Cloud)
  3. Local Ollama (Optional Local Dev Fallback)

### B. Creator Studio & Video Rendering
- **Hook Engine:** Rule-based engagement scoring across 3 viral hook categories (Pattern Interrupt, Curiosity Gap, Bold Statistic).
- **Storyboard Engine:** 9:16 vertical scene synthesis with word-wrapped title cards and subtitle synchronization.
- **Rendering Engine:** Browser Canvas 30 FPS `MediaRecorder` + WebM/MP4 container export. Operates on 100% of standard browsers and mobile webviews without host FFmpeg requirements.
- **Cloud Microservice:** Dockerized Python FastAPI + FFmpeg microservice included for server-side bulk rendering.

### C. Social Media Autopilot (Level 3 Autonomy)
- **State Machine:** 12-state deterministic lifecycle (`queued` -> `researching` -> `scripting` -> `storyboarding` -> `voice_generating` -> `rendering` -> `quality_check` -> `scheduled` -> `publishing` -> `published` / `failed` / `halted`).
- **Safety Circuit Breaker:** Global Emergency STOP halts all pending queues immediately.
- **Publishing Adapter:** Official Meta Graph API v20.0 endpoints.
- **Publishing Guardrail:** Requires valid non-expired access token before attempting upload; displays exact missing scope if renewal is needed.

### D. Native Android Mobile Application (`mobile/`)
- **Framework:** React Native with Expo Router v3 and Expo SDK 51.
- **Shared Architecture:** Connects to the same secure RIIQX API layer (`/api/riiqx/*`).
- **Session Management:** Encrypted token storage via `expo-secure-store`.
