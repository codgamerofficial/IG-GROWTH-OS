# ♾️ NUVEXA AI — Master Implementation Plan: Hybrid AI + Autopilot Creator Platform
**Tagline:** *One Assistant. Many Possibilities.*  
**Engineering Horizon:** Production Readiness • Full Functional Realization

---

## 1. Architectural Phases

### Phase 1: Hybrid AI Provider System (Local + Cloud + Auto Routing)
- Expand provider abstraction in [models.ts](file:///d:/GlowFit%20AI/src/lib/nuvexa/models.ts) to support:
  - **Local Mode:** Ollama open-weights (`llama3.2`, `mistral`, `qwen2.5-coder`, `deepseek-r1`).
  - **Online Cloud Mode:** Configurable OpenAI-compatible, AWS Bedrock, or AgentRouter endpoints.
  - **Auto Mode:** Intelligent task-based routing (e.g. code tasks -> Qwen Coder; creative hooks -> Cloud/Mistral; privacy-sensitive -> Local).
- Token usage and estimated cost tracker.

### Phase 2: AI Creator Studio (Vertical 9:16 Reels & Shorts Engine)
- **Step 1: Content Brief:** Topic, target audience, duration (15s, 30s, 60s), brand voice, platform target.
- **Step 2: Script & Hook Generator:** Pattern-interrupt visual hooks, scene-by-scene storyboard, voiceover narration, on-screen text, call-to-action (CTA), hashtags, and description.
- **Step 3: Asset Orchestration:** Visual cards generation, gradient backdrops, typography safe margins (Instagram 9:16 safe area overlay).
- **Step 4: Vertical Video Rendering Engine:**
  - Real-time 9:16 Canvas preview player in the browser with scene sequencing, subtitle animation, and Web Speech API audio synthesis.
  - Client-side MP4/WebM video recording & export via HTML5 Canvas `captureStream()` and `MediaRecorder`.
  - Server-side FFmpeg worker configuration for Docker/cloud production deployments.
- **Step 5: Output Validation:** Duration check, aspect ratio validation (1080x1920), audio presence check, subtitle synchronization, downloadable artifact.

### Phase 3: Social Media Autopilot (Level 3 Full Autopilot)
- **Autopilot Center:** Persistent rule configuration:
  - Account target, Platform (Instagram Reels / YouTube Shorts), niche, forbidden topics, posting frequency, schedule windows, time zone, daily spending/render budget, quality thresholds.
- **Autonomous State Machine:**
  `queued` ➔ `researching` ➔ `scripting` ➔ `generating_assets` ➔ `rendering` ➔ `quality_check` ➔ `ready_to_publish` ➔ `scheduled` ➔ `publishing` ➔ `published` (or `paused` / `failed` / `cancelled`).
- **Emergency Circuit Breaker (STOP Button):** Immediate global cancellation of pending tasks and worker halts.
- **Persistent Background Scheduler:** Server-side interval executor that advances eligible tasks according to configured schedules.

### Phase 4: Social Media Integrations (Instagram & YouTube)
- **Instagram Graph API Adapter:**
  - Professional/Creator account verification, Reels upload container initialization (`POST /{ig-user-id}/media`), status polling (`GET /{container-id}`), and publishing confirmation (`POST /{ig-user-id}/media_publish`).
- **YouTube Data API v3 Adapter:**
  - Google OAuth2 authentication flow, resumable video upload protocol (`POST /upload/youtube/v3/videos?uploadType=resumable`), title, description, privacy status (`public`/`private`/`unlisted`), category ID, and confirmed video ID.
- **Honest Platform Verification:** Zero fake "Connected" status; clear setup instructions and credential input fields in Settings.

### Phase 5: Analytics & Continuous Improvement Engine
- Real engagement metrics tracking: Views, reach, watch time, retention rate, likes, comments, shares.
- Rule-based AI suggestions: Hook optimization, peak publishing times, topic resonance analysis.

### Phase 6: Automated Testing & Verification
- Unit & integration tests for Creator Studio storyboard, Autopilot state machine, Emergency STOP circuit breaker, and Social API payloads.
- Production build and typecheck verification.
