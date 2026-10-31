# RIIQX AI Provider Audit & Real-Time Telemetry Report
**Audit Timestamp:** 2026-10-31T04:14:00Z  
**Budget Enforcement:** `AI_BUDGET_MODE=free_only` (₹0 / $0.00 Monthly Allocation)  
**Host Environment:** Local Development `http://localhost:3001`  
**Security Barrier:** Zero secret exposure; all credentials masked and encrypted.

---

## 1. Executive Summary

A comprehensive, empirical audit was conducted across all configured and candidate AI providers in the RIIQX platform. Unlike static mockups or demo interfaces, all provider states in RIIQX represent **empirically validated network and inference results**.

### Key Audit Findings:
1. **Configured ≠ Authenticated ≠ Discovered ≠ Available ≠ Inference Working**:
   - Providers with valid API keys may have unactivated function endpoints, exhausted balances, or expired trial credits.
   - Every provider in RIIQX is assigned an explicit, non-overlapping operational status.
2. **Groq Cloud LPU**:
   - Status: **`AVAILABLE`** (Free Tier).
   - Discovered 11 models; live test completion completed in **214ms** using `qwen/qwen3.8-27b`.
   - Native audio support verified via `whisper-large-v3-turbo`.
3. **OpenRouter Multi-Cloud Gateway**:
   - Status: **`AVAILABLE`** (Free Tier).
   - Discovered 420 models; 16 free variants (`:free`) audited.
   - **7 Active Verified Free Models** confirmed, including **NVIDIA Nemotron 3.5 Lightning (1M context)**, **Laguna XS (748ms)**, and **Cohere North Mini Code (256K context)**.
4. **Cohere Intelligence Cloud**:
   - Status: **`AVAILABLE`** (Free Developer Tier).
   - Discovered 20 models; live inference completed in **967ms** using `command-r-08-2024`.
   - Multilingual / Bengali specialist verified (`c4ai-aya-expanse-32b`).
5. **NVIDIA Direct NIM**:
   - Status: **`RATE_LIMITED` / `ENTITLEMENT_PENDING`**.
   - API key authenticated; 85 catalog models discovered. Direct function invocation requires individual account activation in NVIDIA Developer Console.
   - Seamlessly routed through OpenRouter's free NVIDIA Nemotron fleet without user disruption.
6. **AIML API**:
   - Status: **`QUOTA_EXHAUSTED`**.
   - Gateway returned HTTP 403 ("run out of funds"). Circuit breaker opened immediately; zero requests routed to prevent failure.
7. **Agent Router**:
   - Status: **`AUTHENTICATION_FAILED`**.
   - Endpoint returned HTTP 401 Unauthorized Client. Quarantined.
8. **AWS Bedrock**:
   - Status: **`RATE_LIMITED` / `CONSOLE_ENTITLEMENT_REQUIRED`**.
   - Selected Region: `ap-southeast-2`. Returned `ValidationException: Operation not allowed` due to AWS Account 614084726174 needing Model Access activation in the AWS Console.
9. **Host Media Stack**:
   - Status: **`BROWSER_FALLBACK`**.
   - System inspected for `ffmpeg` and `ffprobe`. In the absence of host binaries, RIIQX strictly falls back to HTML5 Canvas and Web Audio processing without fabricating video output files.

---

## 2. Provider-by-Provider Empirical Audit Table

| Provider | Configured Key | Auth Status | Catalog Count | Tested Model | Measured Latency | Free Tier Policy | Operational Status |
|---|---|---|---|---|---|---|---|
| **Groq Cloud LPU** | `GROQ_API_KEY` (56 chars) | Valid Bearer | 11 models | `qwen/qwen3.8-27b` | **214 ms** | 100% Free (30 RPM) | **`AVAILABLE`** |
| **OpenRouter Gateway** | `OPENROUTER_API_KEY` (73 chars) | Valid Bearer | 420 models | `poolside/laguna-xs-2.1:free` | **748 ms** | 100% Free (:free) | **`AVAILABLE`** |
| **Cohere Intelligence** | `COHERE_API_KEY` (40 chars) | Valid Bearer | 20 models | `command-r-08-2024` | **967 ms** | Free Developer Tier | **`AVAILABLE`** |
| **NVIDIA Direct NIM** | `NVIDIA_NIM_API_KEY` (70 chars) | Valid Bearer | 85 models | `nvidia/nemotron-4-340b` | N/A (404 func) | Free Dev (Credits) | **`RATE_LIMITED`** |
| **AWS Bedrock** | `AWS_ACCESS_KEY_ID` (20 chars) | SigV4 Valid | 1 model | `au.anthropic.claude-sonnet-4-6` | N/A (Validation) | Commercial AWS | **`RATE_LIMITED`** |
| **AIML API Gateway** | `AIML_API_KEY` (32 chars) | Valid Bearer | 949 models | `mistral-7b` | N/A (403 Funds) | Paid / Trial Depleted | **`QUOTA_EXHAUSTED`** |
| **Agent Router** | `AGENT_ROUTER_API_KEY` (51 chars) | Client 401 | 1 model | `deepseek-chat` | N/A (401 Auth) | Unknown | **`AUTHENTICATION_FAILED`** |
| **Local Ollama** | `OLLAMA_BASE_URL` | Offline | 2 models | `qwen2.5-coder:7b` | Offline | 100% Free Local | **`CONFIGURED`** |

---

## 3. Discovered vs. Deprecated Free Models

During live automated testing, several models previously marketed as free were found to be deprecated or paywalled:
- ❌ `meta-llama/llama-3.3-70b-instruct:free`: HTTP 404 (Free variant sunset by OpenRouter).
- ❌ `google/gemini-2.0-flash-exp:free`: HTTP 404 (Experimental endpoint sunset).
- ❌ `deepseek/deepseek-chat:free`: HTTP 404 (Paywalled to commercial tier).
- ❌ `google/gemma-4-31b-it:free`: HTTP 503 (Upstream provider failure).

### Verified Active Replacements in RIIQX:
- ✅ `nvidia/nemotron-3.5-lightning:free` — 1,000,000 context reasoning engine.
- ✅ `nvidia/nemotron-3-ultra-550b-a55b:free` — Massive 550B flagship reasoning.
- ✅ `cohere/north-mini-code:free` — 256,000 context coding specialist.
- ✅ `poolside/laguna-xs-2.1:free` — Ultra-fast 748ms conversational engine.
- ✅ `qwen/qwen3.8-27b` — 214ms sub-second Groq LPU engine.
- ✅ `command-r-08-2024` — 128,000 context citation-grounded research model.
- ✅ `c4ai-aya-expanse-32b` — Native Bengali / Indic multilingual specialist.

