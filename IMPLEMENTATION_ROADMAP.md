# RIIQX — Master Implementation Roadmap

**Product Name:** RIIQX  
**Mission:** Transform the existing project into an advanced online-first Agentic AI platform, autonomous Social Media Creator & Autopilot system, and full Android mobile application.  
**Execution Standard:** Zero-Fabrication • Production Verification • Strict Test Coverage  

---

## Milestone Progress Tracker

```mermaid
gantt
    title RIIQX Implementation Timeline
    dateFormat  YYYY-MM-DD
    section M1: Foundation
    Audit & Governance Docs       :done, m1_1, 2026-10-26, 1d
    Online-First AI Gateway      :done, m1_2, 2026-10-26, 1d
    RIIQX Core Rebrand & Engine  :active, m1_3, 2026-10-26, 1d
    section M2: Agent Core
    Persistent Task Planning     :m2_1, 2026-10-26, 1d
    Consequential Permission Gate:m2_2, 2026-10-26, 1d
    Observability & Memory Logs  :m2_3, 2026-10-26, 1d
    section M3: Creator Studio
    Hook & Storyboard Matrix     :m3_1, 2026-10-26, 1d
    Canvas 9:16 Video Renderer   :m3_2, 2026-10-26, 1d
    Subtitle Sync & Export       :m3_3, 2026-10-26, 1d
    section M4: Autopilot
    12-State Queue Engine        :m4_1, 2026-10-26, 1d
    Meta Reels & YouTube Adapters:m4_2, 2026-10-26, 1d
    Emergency STOP & Analytics   :m4_3, 2026-10-26, 1d
    section M5: Android
    Expo SDK 51 RIIQX Rebrand    :m5_1, 2026-10-26, 1d
    Mobile Screens & API Client  :m5_2, 2026-10-26, 1d
    Android Typecheck & Build    :m5_3, 2026-10-26, 1d
    section M6: Verification
    End-to-End Test Suite        :m6_1, 2026-10-26, 1d
    Deployment Guide & Signoff   :m6_2, 2026-10-26, 1d
```

---

## Detailed Milestone Objectives

### Milestone 1: Audit & Foundation
- Complete project & capability audit without leaking secrets.
- Rebrand core brand definitions, logos, tokens, and metadata to **RIIQX**.
- Verify online-first AI gateway with AWS Bedrock Claude Sonnet (`ap-southeast-2`) as primary provider.

### Milestone 2: Agent Core & Tool Dispatch
- Task planner supporting natural-language goal decomposition into structured dependency DAGs.
- Mandatory cryptographic permission gate before high-consequence operations.
- Real tool integration: web search with verifiable citations, sandboxed code executor, untrusted document parser.

### Milestone 3: Creator Studio (Vertical 9:16)
- Viral hook synthesizer: Pattern Interrupt, Curiosity Gap, Bold Statistic.
- Scene-by-scene script generator (Bengali, Hindi, English).
- 9:16 Canvas rendering engine with 30 FPS `MediaRecorder` video export.
- Subtitle auto-sync and safe margin overlays (Instagram Reels & YouTube Shorts).

### Milestone 4: Social Autopilot (Level 3 Autonomy)
- 12-state autonomous content machine with persistent scheduling.
- Meta Graph API v20.0 adapter for Instagram Reels (`596660929655724`).
- YouTube Data API adapter with automatic `#Shorts` tag enforcement.
- Global Emergency STOP circuit breaker and retention optimization telemetry.

### Milestone 5: Full Android Mobile Application (`mobile/`)
- Rebrand Expo mobile app to RIIQX (`com.riiqx.app`).
- Implement mobile navigation: AI Chat, Creator Studio, Autopilot, Task Planner, Settings.
- Connect to shared backend API endpoints (`/api/riiqx/*`).
- Verify TypeScript compilation and Android build configurations.

### Milestone 6: Production Verification & Security Signoff
- Execute master automated test suite (`tests/test-riiqx.mjs`).
- Verify Next.js production build (`npm run build`).
- Verify mobile TypeScript compilation (`mobile/npm run typecheck`).
- Document deployment guide, operational checklist, and security signoff.
