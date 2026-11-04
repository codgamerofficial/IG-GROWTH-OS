# RIIQX Architecture & Codebase Audit Report
**Project**: RIIQX — Advanced Agentic AI Platform & Native Creative Ecosystem  
**Phase**: Phase 0 — Foundation & System Discovery  
**Audit Date**: November 2026  
**Environment**: `http://localhost:3001` (Dev) | `https://riiqx.vercel.app` (Prod)  
**Security Classification**: Internal Architecture Blueprint — Zero Secret Exposure  

---

## 1. Executive Summary

RIIQX is an online-first, autonomous AI Agent Platform, Creator OS, and Social Media Autopilot. The system is designed to provide high-leverage creative intelligence, automated multi-channel publishing, personal finance intelligence, and deep video processing.

The purpose of this audit is to evaluate the existing codebase in preparation for evolving RIIQX into a **Unified Native AI Creative Ecosystem** comprising six interconnected core modules:
1. **AI Brand Intelligence**
2. **AI Campaign Studio**
3. **AI Creative Canvas**
4. **AI Workflow Builder**
5. **AI Product Studio**
6. **AI Video Creative Director**

### Key Finding
RIIQX already contains high-grade production infrastructure:
- A multi-cloud server-side AI provider registry (`Google Gemini`, `Groq`, `OpenRouter`, `AWS Bedrock`, `Cohere`, `OpenAI`) with circuit breakers, tool calling, and token usage accounting.
- A fully native 64-bit video processing pipeline (`HyperFrames` v0.9.13 + `FFmpeg` + `FFprobe` + `OpenAI Whisper` + `yt-dlp`) with a mandatory storyboard approval gate.
- An enterprise OAuth credential vault using `AES-256-GCM` encryption with direct Meta Graph API and YouTube Data API v3 integrations.
- A Supabase PostgreSQL backend with Row Level Security (RLS) and `@supabase/ssr` authentication.

However, several creative capabilities currently operate with local file-system or browser `localStorage` state (e.g., `BrandKitTab` saves to `riiqx_brand_kit_v2`), and there are no dedicated tables or canvas/workflow abstractions for Campaign Studio, Creative Canvas, Workflow Builder, or Product Studio. This audit details what is reusable, what is incomplete, and how to build the shared foundation.

---

## 2. Technology Stack & Framework Inventory

| Layer | Technologies | Current Version | Health & Status |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router), React, React-DOM | `v14.2.18` / `v18.3.1` | ✅ Active & compiling cleanly |
| **Language & Typings** | TypeScript, Strict Typing | `v5.6.3` | ✅ 0 compiler errors (`tsc --noEmit`) |
| **Styling & Theme** | TailwindCSS, PostCSS, Framer Motion, clsx, tailwind-merge | `v3.4.14` / `v11.11.17` | ✅ Obsidian Dark (`#0C0C0E` + `#FFD43B` yellow accent) |
| **Icons & Visuals** | Lucide React, Canvas Confetti | `v0.454.0` / `v1.9.3` | ✅ High-contrast crisp iconography |
| **Backend & APIs** | Next.js API Routes (Node.js runtime) | `Node v24.18.0` | ✅ Active on `localhost:3001` |
| **Database & Auth** | Supabase PostgreSQL, GoTrue Auth, PostgREST | `@supabase/ssr v0.12.7`, `@supabase/supabase-js v2.46.1` | ✅ RLS enabled, Cookie sessions |
| **Video Engine** | Fluent-FFmpeg, FFmpeg/FFprobe binaries, HyperFrames, Remotion | `fluent-ffmpeg v2.1.3`, `hyperframes v0.9.13`, `remotion v4.0.540` | ✅ Native 64-bit binaries verified |
| **AI Tooling & Speech** | OpenAI Whisper (PyTorch), yt-dlp, Model Context Protocol SDK | `whisper 20250625`, `yt-dlp 2026.10.26`, `@modelcontextprotocol/sdk v1.32.1` | ✅ Verified local & API runtimes |
| **Image Processing** | Sharp | `v0.35.5` | ✅ Fast server-side image manipulation |
| **Validation** | Zod | `v3.23.8` | ✅ Strict API schema validation |

---

## 3. Application Structure & Navigation Audit

The desktop application uses a single-page application shell (`src/app/page.tsx` with `RiiqxAppShell.tsx` and `RiiqxContext.tsx`) structured around a persistent primary sidebar (`RiiqxSidebar.tsx`).

### Primary Navigation Workspaces (`RiiqxViewTab`):
1. **Dashboard** (`home`): System health, recent activity, cross-module KPI overview.
2. **AI Agent Chat** (`chat`): Autonomous conversational copilot with tool execution and multi-model routing.
3. **Creator Studio** (`creator`): The central studio containing 20 sub-tabs:
   - `overview`: Pipeline status and high-level project view.
   - `ai_creation`: AI Creation Lab (multi-preset script & concept generator).
   - `shorts_factory`: Short-form video generator.
   - `voice_studio`: TTS and audio narration.
   - `capture_studio`: Screen & camera recording.
   - `seo_intelligence`: Keyword research and search optimization.
   - `editor`: Video production studio with dual mode (`AIVideoEditorPipeline` with HyperFrames + FFmpeg vs multi-track timeline).
   - `script`: Script drafting and editing.
   - `storyboard`: Visual scene cards and timing.
   - `ideas`: Trend discovery and viral hook generation.
   - `planner`: Content calendar and scheduling.
   - `assets`: Media files and uploaded footage.
   - `metadata`: Captions, hashtags, and description optimizer.
   - `queue`: Social media publishing queue.
   - `autopilot`: Safe autonomous publishing boundaries and safety copilot.
   - `calendar`: Editorial calendar.
   - `published`: Verified published social media feed.
   - `analytics`: Post-level performance tracking.
   - `templates`: Saved creation blueprints.
   - `brand_kit`: Visual identity settings (colors, typography, voice, watermarks).
4. **Autopilot Center** (`autopilot`): Scheduling, automated publishing triggers, safety policies.
5. **Task Planner** (`tasks`): Goal-oriented task decomposition and progress tracking.
6. **Deep Research** (`research`): Web research and intelligence synthesis.
7. **Code Studio** (`code`): Embedded coding environment with MCP tool integration.
8. **Integrations** (`integrations`): OAuth connection manager for YouTube, Instagram, Facebook, LinkedIn, Twitter/X.
9. **Analytics & Growth** (`analytics`): Cross-platform social media intelligence OS with strict API telemetry.
10. **Library** (`files`): Central asset library for images, footage, rendered videos, and exports.
11. **Settings** (`settings`): User preferences, API configurations, and model selector.

---

## 4. Backend API Route Audit

The backend consists of well-modularized Next.js route handlers:

### 1. RIIQX Core APIs (`src/app/api/riiqx/*`)
- `/api/riiqx/models`: Dynamic model capability catalog, provider configuration status, active model selection.
- `/api/riiqx/chat`: Conversational agent endpoint with automatic fallback routing and MCP tool calling.
- `/api/riiqx/autopilot`: Autonomous publishing rules, schedule checks, safety boundary verification.
- `/api/riiqx/creator`: Project persistence, brief creation, and brand kit retrieval.
- `/api/riiqx/creator/generate`: AI script, hook, and storyboard scene generation.
- `/api/riiqx/creator/analyze`: Raw media analysis and visual vibe detection.
- `/api/riiqx/video-editor/tools`: Real-time health inspection for Node, HyperFrames, FFmpeg, FFprobe, Python, Whisper, yt-dlp.
- `/api/riiqx/video-editor/workspace`: Physical folder tree and active style guide inspection for `AI Video Editor/`.
- `/api/riiqx/video-editor/reference/analyze`: Multi-category style extraction from reference videos into `style-sheet.md`.
- `/api/riiqx/video-editor/analyze-footage`: Whisper speech recognition, 32+ word-level timestamps, pause detection, unapproved storyboard generation.
- `/api/riiqx/video-editor/storyboard`: Storyboard approval gatekeeper (`approve`, `request_changes`, `update_beats`).
- `/api/riiqx/video-editor/render`: Mandatory gated FFmpeg multi-stream render, LUFS normalization, and FFprobe QA report generation.
- `/api/riiqx/tools`: Safe server-side tools (web search, calculator, scraping, time).
- `/api/riiqx/capabilities`: Dynamic feature adapter discovery.

### 2. Social Media & OAuth APIs (`src/app/api/social/*`)
- `/api/social/accounts`: Connected account discovery, token expiration tracking, re-auth detection.
- `/api/social/oauth/authorize`: Initiates OAuth 2.0 PKCE flow for Google/YouTube, Meta/Instagram, Twitter/X, LinkedIn.
- `/api/social/oauth/callback/*`: Exchanges auth code for access & refresh tokens, encrypts into AES-256 vault.
- `/api/social/publish`: Direct publishing engine for YouTube Shorts and Instagram Reels.
- `/api/social/analytics`: Direct telemetry extraction from YouTube Data API v3 and Meta Graph API v26.0.

### 3. Authentication & Profile APIs (`src/app/api/auth/*`)
- `/api/auth/session`: Cookie-backed session validation via `@supabase/ssr`.
- `/api/auth/profile`: User profile retrieval and role validation.
- `/api/auth/signout`: Session invalidation and cookie clearing.

### 4. Legacy Endpoints (Non-RIIQX Heritage)
- Endpoints under `/api/pandals`, `/api/places`, `/api/traffic`, `/api/metro`: Remnants of an earlier festival navigation project. They do not interfere with RIIQX but should be isolated from the creative ecosystem.

---

## 5. Supabase Database Schema & Storage Audit

### Database Tables Currently Active:
1. `public.profiles`: User identity, display name, avatar, role, base currency, preferred language. RLS enabled.
2. `public.connected_accounts`: Connected social channels (YouTube, Instagram, Facebook, Threads, etc.) with account handles, status, and scopes. RLS enabled.
3. `public.oauth_credentials`: AES-256-GCM encrypted access and refresh tokens with IV and auth tag. Restricted exclusively to `service_role`.
4. `public.social_publishing_jobs`: Scheduled and executed social posts, idempotency keys, publish status, platform media IDs, and logs. RLS enabled.
5. `public.social_audit_logs`: Audit trail for sensitive publishing and OAuth actions. RLS enabled.
6. `public.user_portfolios` & `portfolio_holdings`: Personal finance asset tracking tables. RLS enabled.
7. `public.instruments`, `market_data_sources`, `market_data_points`: Universal financial instrument catalog. RLS enabled.

### Storage Architecture:
- **Supabase Storage**: Configured with bucket access via `src/lib/supabase/client.ts` and `src/lib/supabase/admin.ts`.
- **Physical Video Workspace**: Dedicated filesystem hierarchy under `AI Video Editor/` (`raw footage/`, `reference/`, `export/`, `projects/`, `assets/`, `styles/`, `metadata/`).
- **Client Cache**: LocalStorage used for offline project caching (`riiqx_creator_projects_v2`, `riiqx_brand_kit_v2`).

---

## 6. AI Provider Layer & Model Routing Audit

RIIQX features an advanced server-side AI architecture in `src/lib/riiqx/provider-registry.ts` and `src/lib/riiqx/model-router.ts`:
- **Configured Providers**:
  - `Google Gemini`: Primary multimodal & reasoning provider (Gemini 2.5 Flash, Gemini 1.5 Pro).
  - `Groq`: High-speed generation (Llama 3.3 70B, Qwen 2.5 32B) for ultra-low latency.
  - `OpenRouter`: Universal model aggregator and primary fallback.
  - `AWS Bedrock`: Enterprise Claude 3.5 Sonnet / Haiku integration via AWS IAM SigV4.
  - `Cohere`: Multilingual embeddings and Command R+.
  - `OpenAI / Local Whisper`: Speech recognition and word-level timestamps.
- **Architectural Safeguards**:
  - **Circuit Breakers**: Independent failure counters for each provider (trips after 3 failures, 60s cooldown).
  - **Zero Silent Paid Traps**: Priority given to Free Tier / Free Developer Tier models; explicit user confirmation required for commercial pay-per-token calls.
  - **Usage Accounting**: `recordInferenceUsage` logs tokens, latency, provider ID, and model name.

---

## 7. Component Reuse vs Gaps Analysis

| Creative Capability | Current State in RIIQX | Reusable Assets | Gaps to Address |
| :--- | :--- | :--- | :--- |
| **1. AI Brand Intelligence** | Partially implemented in `BrandKitTab.tsx` and `src/lib/riiqx/brand.ts`. Stored in localStorage and `style-sheet.md`. | Color pickers, typography presets, brand voice controls, export helpers. | No automated SSRF-safe website scraper/analyzer; no persistent `brand_profiles` database table; no versioned Brand DNA export (`brand-guidelines.json`). |
| **2. AI Campaign Studio** | Script Studio & AI Creation Lab generate single video scripts; no unified multi-channel campaign strategy. | Prompt templates in `creator-engine.ts`, copy generation logic, calendar view. | No multi-platform campaign concepting; no content pillars; no multi-format briefs (IG, FB, YT, TikTok, LinkedIn); no campaign project model. |
| **3. AI Creative Canvas** | Does not exist in current app. | `Glass.tsx`, drag/drop helpers from timeline studio, image preview components. | Needs infinite pannable canvas; block graph data structure (images, text, prompts, palettes, moodboards); context-aware selection prompting; board export. |
| **4. AI Workflow Builder** | Autopilot Center has fixed schedule rules; no visual graph editor or NLP workflow synthesis. | `autopilot-engine.ts`, job executor, status badges, task scheduler. | Needs visual node editor (React Flow or native SVG/HTML node graph); natural-language workflow translator; graph validation; step-by-step execution engine. |
| **5. AI Product Studio** | Media ingestion handles video/audio; no dedicated product photo pipeline. | `Sharp` image processing, Supabase media upload handler, aspect ratio formatters. | Needs product feature preservation logic; background generation/expansion adapters; side-by-side original vs AI comparison viewer. |
| **6. AI Video Creative Director** | Fully implemented in `AIVideoEditorPipeline.tsx` with HyperFrames, FFmpeg, Whisper, yt-dlp, and Storyboard gate. | Complete toolchain, `/api/riiqx/video-editor/*`, `FFmpegService`, QA report generator. | Needs direct bidirectional link with Brand DNA profile and Campaign Studio project briefs. |

---

## 8. Audit Conclusions & Recommendations

1. **Preserve the Core**: The existing Next.js architecture, Supabase authentication, OAuth credentials vault, and AI Video Editor pipeline are rock-solid and must not be touched or duplicated.
2. **Build Shared Abstractions First**: Before implementing the visual studios, build the shared provider-agnostic infrastructure (`src/services/ai/`, `src/services/jobs/`, `src/services/prompts/`, `src/services/assets/`).
3. **Graduate State to Supabase**: Replace ephemeral `localStorage` for Brand Kits, Campaigns, and Canvases with structured, RLS-protected Supabase tables.
4. **Implement Incrementally**: Follow the strict 9-phase sequence, verifying every phase with end-to-end tests and type checking before proceeding.

