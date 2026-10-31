# RIIQX AI Model Catalog & Capability Matrix
**Audit Timestamp:** 2026-10-31T04:14:00Z  
**Budget Policy:** Strict Free-Only Enforced (`AI_BUDGET_MODE=free_only`)  
**Single Source of Truth:** `src/lib/ai/registry/model-catalog.ts`

---

## 1. Verified Active Free Models Fleet

| Model Name | Model ID | Provider | Context Window | Measured Latency | Input Modalities | Output Modalities | Primary Strengths | Status |
|---|---|---|---|---|---|---|---|---|
| **Qwen 3.8 27B** | `qwen/qwen3.8-27b` | Groq LPU | 32,768 | **214 ms** | Text | Text | Ultra-fast dialogue, rapid ideation, Bengali fluency | `AVAILABLE` |
| **GPT-OSS 120B** | `openai/gpt-oss-120b` | Groq LPU | 128,000 | ~350 ms | Text | Text | Complex synthesis, high-throughput logic | `AVAILABLE` |
| **GPT-OSS 20B** | `openai/gpt-oss-20b` | Groq LPU | 128,000 | ~180 ms | Text | Text | Lightweight summaries, intent classification | `AVAILABLE` |
| **Whisper Large v3 Turbo** | `whisper-large-v3-turbo` | Groq LPU | 128,000 | ~420 ms | Audio | Text | Fast speech-to-text, multilingual subtitles | `AVAILABLE` |
| **NVIDIA Nemotron 3.5 Lightning** | `nvidia/nemotron-3.5-lightning:free` | OpenRouter | **1,000,000** | **1,034 ms** | Text | Text | Strategic reasoning, multi-step agent planning | `AVAILABLE` |
| **NVIDIA Nemotron 3 Ultra 550B** | `nvidia/nemotron-3-ultra-550b-a55b:free` | OpenRouter | **1,000,000** | **3,593 ms** | Text | Text | Massive 550B flagship scale, complex problem solving | `AVAILABLE` |
| **NVIDIA Nemotron 3 Nano Omni** | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | OpenRouter | 256,000 | **891 ms** | Text | Text | Fast step validation, structured reflection | `AVAILABLE` |
| **Cohere North Mini Code** | `cohere/north-mini-code:free` | OpenRouter | 256,000 | **1,876 ms** | Text | Text | Code synthesis, TypeScript AST analysis, debugging | `AVAILABLE` |
| **Poolside Laguna XS 2.1** | `poolside/laguna-xs-2.1:free` | OpenRouter | 262,144 | **748 ms** | Text | Text | Sub-second conversational streaming, snappy UI | `AVAILABLE` |
| **Poolside Laguna S 2.1** | `poolside/laguna-s-2.1:free` | OpenRouter | 262,144 | **1,630 ms** | Text | Text | Deep document summarization, general chat | `AVAILABLE` |
| **Dots 3 Note Preview** | `dots-studio/dots-3-note-preview:free` | OpenRouter | 512,000 | **1,824 ms** | Text | Text | Script breakdown, structured JSON formatting | `AVAILABLE` |
| **Command R 08-2024** | `command-r-08-2024` | Cohere Cloud | 128,000 | **967 ms** | Text | Text | Citation-grounded research, multi-source RAG | `AVAILABLE` |
| **Aya Expanse 32B** | `c4ai-aya-expanse-32b` | Cohere Cloud | 128,000 | ~1,100 ms | Text | Text | Native Bengali linguistic nuances, South Asian Indic | `AVAILABLE` |
| **Embed Multilingual v3.0** | `embed-multilingual-v3.0` | Cohere Cloud | 512 | ~150 ms | Text | Embeddings | High-density vector semantic search in 100+ languages | `AVAILABLE` |

---

## 2. Normalized Capability Matrix

| Model Identifier | Reasoning | Code Gen | Structured JSON | Streaming | Tool Calling | Long Context | Transcription | Bengali |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `qwen/qwen3.8-27b` | ⚡ Fast | ✅ | ✅ | ✅ | ✅ | 32K | ❌ | ✅ High |
| `openai/gpt-oss-120b` | ✅ Deep | ✅ | ✅ | ✅ | ✅ | 128K | ❌ | ✅ Mid |
| `nvidia/nemotron-3.5-lightning:free` | 🧠 1M Deep | ✅ | ✅ | ✅ | ❌ | **1,000K** | ❌ | ✅ Mid |
| `nvidia/nemotron-3-ultra-550b:free` | 🧠 550B Flagship | ✅ | ✅ | ✅ | ❌ | **1,000K** | ❌ | ✅ Mid |
| `cohere/north-mini-code:free` | 💻 Code Logic | **Expert** | ✅ | ✅ | ❌ | 256K | ❌ | ✅ Mid |
| `poolside/laguna-xs-2.1:free` | ⚡ Fast | ✅ | ✅ | ✅ | ❌ | 262K | ❌ | ✅ High |
| `command-r-08-2024` | 🔍 Grounded | ✅ | ✅ | ✅ | ✅ Native | 128K | ❌ | ✅ High |
| `c4ai-aya-expanse-32b` | ✅ General | ✅ | ✅ | ✅ | ❌ | 128K | ❌ | **Native** |
| `whisper-large-v3-turbo` | ❌ N/A | ❌ | ❌ | ❌ | ❌ | 128K | **Native** | ✅ Audio |

---

## 3. Strict Non-Inference Rules
1. **Understanding ≠ Generation**:
   - Models that accept audio (e.g. Whisper) are strictly classified as `AUDIO_INPUT` / `TRANSCRIPTION`, never `MUSIC_GENERATION` or `SPEECH_GENERATION`.
   - Vision models (e.g. Claude Sonnet) are strictly classified as `IMAGE_INPUT`, never `IMAGE_OUTPUT`.
2. **Offline Fallback Guarantee**:
   - When offline, RIIQX routes to `qwen2.5-coder:7b` and `llama3.2:3b` via local Ollama daemons with zero external API calls.

