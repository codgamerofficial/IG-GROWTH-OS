# RIIQX Implementation Roadmap
## Unified Native AI Creative Ecosystem (Phases 0–9)

**Target System**: RIIQX — Master AI Agent Platform & Creative Ecosystem  
**Architecture Principle**: One Connected Platform • Shared Infrastructure • Zero Mock Execution  
**Current Milestone**: Phase 0 Complete — Audit & Planning  

---

## Roadmap Overview

```
Phase 0: Architecture & Security Audit (Complete)
   │
   ▼
Phase 1: Shared AI Infrastructure (Provider Layer, Prompt Engine, Asset Service, Job Engine)
   │
   ▼
Phase 2: Module 1 — AI Brand Intelligence (SSRF-safe Scraper, Brand DNA, Guidelines Export)
   │
   ▼
Phase 3: Module 2 — AI Campaign Studio (Multi-Platform Campaigns, Content Pillars, Briefs)
   │
   ▼
Phase 4: Module 3 — AI Creative Canvas (Infinite Visual Canvas, Blocks, Contextual AI)
   │
   ▼
Phase 5: Module 4 — AI Product Studio (Product Accuracy, Background Replacement, Comparison)
   │
   ▼
Phase 6: Module 5 — AI Workflow Builder (NLP Workflow Generator, Node Graph, Execution Engine)
   │
   ▼
Phase 7: Module 6 — AI Video Creative Director (Brand DNA & Campaign Studio Integration)
   │
   ▼
Phase 8: Cross-Module Integration & Shared Asset Library (Single DNA Driving All 6 Engines)
   │
   ▼
Phase 9: Production Hardening, Security Review & Full Acceptance Test Suite (A through F)
```

---

## Phase Breakdown & Milestone Criteria

### PHASE 0: Codebase Audit & Foundation Discovery
- **Status**: ✅ COMPLETED
- **Objectives**:
  - Perform exhaustive inspection of routes, UI components, backend services, Supabase schema, and AI tools.
  - Produce four foundational audit documents (`architecture-audit.md`, `implementation-roadmap.md`, `database-change-plan.md`, `ai-provider-matrix.md`).
  - Verify zero secret exposure and confirm working tree integrity.
- **Verification Gate**:
  - `npx tsc --noEmit` exits with code 0.
  - All four audit documents generated in `docs/`.
  - User review and explicit approval before Phase 1.

---

### PHASE 1: Shared AI Infrastructure Layer
- **Status**: ⏳ PENDING APPROVAL
- **Objectives**:
  - Build a centralized, provider-independent service layer under `src/services/ai/`:
    - `providers/`: Adapter interfaces for Gemini, Groq, OpenRouter, Bedrock, Cohere, and local tools.
    - `models/`: Capability-based model discovery (`TEXT_GENERATION`, `IMAGE_GENERATION`, `VISION`, etc.).
    - `prompts/`: Centralized prompt template engine with variable substitution, versioning, and brand context injection.
    - `usage/`: Unified token and latency accounting.
    - `errors/`: Typed circuit-breaker exceptions and fallback chains.
  - Build the asynchronous job engine (`src/services/jobs/`):
    - In-memory and Supabase-backed job queue for long-running AI and media tasks.
    - Status lifecycle: `queued` ➔ `running` ➔ `completed` | `failed` | `cancelled`.
    - Event-driven progress reporting (zero fake percentage loaders).
- **Deliverables**:
  - `src/services/ai/ai-service-manager.ts`
  - `src/services/ai/capability-selector.ts`
  - `src/services/prompts/prompt-template-engine.ts`
  - `src/services/jobs/job-queue.ts`
  - Unit test suite: `tests/test-shared-ai-infrastructure.mjs`.
- **Verification Gate**:
  - Capability selector correctly routes text requests to Groq/Gemini and vision to Gemini.
  - Asynchronous jobs accurately transition states with genuine timestamps.

---

### PHASE 2: Module 1 — AI Brand Intelligence
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Develop SSRF-safe website scraper & visual identity extractor:
    - Hostname validation (blocks `localhost`, `127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, AWS metadata `169.254.169.254`).
    - Redirect safety, timeout limits (10s), payload size limit (5MB).
    - Extraction of title, meta description, brand keywords, logo URL, CSS color codes, and social links.
  - AI Brand DNA synthesis:
    - Structured brand profile: Mission, target personas, voice & tone, core positioning, color palette, typography recommendations, do-not-use rules.
  - Interactive Brand DNA Editor in `BrandKitTab.tsx`:
    - Visual color swatch editor, typography selector, logo uploader.
    - Export to downloadable `brand-guidelines.md` and `brand-guidelines.json`.
    - Database persistence to `public.brand_profiles` with version history.
- **Deliverables**:
  - `src/services/brand/website-analyzer.ts`
  - `src/services/brand/brand-dna-synthesizer.ts`
  - `src/app/api/riiqx/brand/analyze/route.ts`
  - `src/app/api/riiqx/brand/route.ts`
  - Enhanced `BrandKitTab.tsx` with Live Website Analysis Drawer.
- **Verification Gate**:
  - Analyze a live URL (e.g. `https://riiqx.vercel.app` or user site) and generate valid Brand DNA.
  - Confirm SSRF block tests pass for private IPs.
  - Generated `brand-guidelines.json` matches schema specification.

---

### PHASE 3: Module 2 — AI Campaign Studio
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Build multi-channel marketing campaign generator:
    - Consumes active Brand DNA profile as immutable context.
    - 9 campaign objectives: Product Launch, Brand Awareness, Sales Promo, Seasonal, Social Engagement, Lead Gen, Product Education, Influencer, Festival.
  - Multi-platform creative brief generator:
    - Instagram (Reels & Carousels), Facebook (Posts & Video Ads), YouTube (Shorts & Long-form), TikTok, LinkedIn.
    - Generates creative strategy, content pillars, calendar schedule, video hooks, captions, ad copy, and CTA variants.
  - Campaign Studio Workspace:
    - Interactive campaign dashboard, editable copy cards, export to PDF/Markdown.
    - Direct "Send to Calendar" and "Send to Video Editor" actions.
- **Deliverables**:
  - `src/services/campaigns/campaign-generator.ts`
  - `src/app/api/riiqx/campaigns/route.ts`
  - `src/components/riiqx/creator/CampaignStudioTab.tsx`
  - Integration with `CreatorStudioNav.tsx`.
- **Verification Gate**:
  - Generate full 5-channel campaign brief for "Product Launch" with Brand DNA.
  - Confirm every copy card is editable and changes persist to Supabase.

---

### PHASE 4: Module 3 — AI Creative Canvas
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Build an original infinite/pannable creative canvas for visual concepting:
    - Pan, zoom (0.2x – 3.0x), drag-and-drop, multi-select, resize, duplicate, delete.
    - Canvas blocks: Image block, Text block, Prompt block, Color Palette block, Brand Asset block, Moodboard card, Connector lines.
  - Context-aware AI operations:
    - User selects an image block and prompts "Make this look more premium" ➔ AI uses selected asset ID and visual properties.
    - Concept expansion, background change, color palette application, image variations.
  - Persistence & Export:
    - Autosave to `public.creative_canvas_projects` and `public.creative_canvas_blocks`.
    - High-res PNG/JPG canvas snapshot export using HTML5 canvas / Sharp.
- **Deliverables**:
  - `src/components/riiqx/canvas/CreativeCanvasWorkspace.tsx`
  - `src/components/riiqx/canvas/CanvasBlock.tsx`
  - `src/components/riiqx/canvas/CanvasToolbar.tsx`
  - `src/app/api/riiqx/canvas/route.ts`
  - `src/app/api/riiqx/canvas/ai-transform/route.ts`
- **Verification Gate**:
  - Place blocks, connect with lines, execute context-aware prompt on selected block.
  - Export canvas to PNG and verify file validity.

---

### PHASE 5: Module 4 — AI Product Studio
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Product-accurate photography & advertising visual generator:
    - User uploads real product asset (PNG/JPG).
    - Selects concept: Clean Studio, Lifestyle, Premium Ad, Social Promo, Festival, E-commerce, Feature Showcase.
  - Feature preservation engine:
    - Protects product logo, typography, shape, packaging, and label integrity.
    - Background replacement and lighting enhancement via supported image provider / Sharp composition.
  - Side-by-Side Comparison Viewer:
    - Interactive slider / toggle between original product asset and AI-generated creative.
    - Warnings if pixel variance or key product contours are altered.
  - Multi-aspect ratio export:
    - 1:1 Square (Feed), 9:16 Vertical (Stories/Reels), 16:9 Landscape (Banners).
- **Deliverables**:
  - `src/services/products/product-image-pipeline.ts`
  - `src/components/riiqx/creator/ProductStudioTab.tsx`
  - `src/components/riiqx/creator/ProductCompareViewer.tsx`
  - `src/app/api/riiqx/products/generate/route.ts`
- **Verification Gate**:
  - Upload sample product, generate studio background, compare with original slider.
  - Export 1:1 and 9:16 variants to Library.

---

### PHASE 6: Module 5 — AI Workflow Builder
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Visual node-based automation builder with Natural Language generation:
    - User types: "Every morning, research trending tech topics, generate 3 scripts, and add to calendar."
    - AI synthesizes an editable node graph.
  - Node Catalog:
    - **Trigger Nodes**: Schedule (Cron), Webhook, Manual, Asset Uploaded.
    - **AI Nodes**: Text Generation, Research, Summarization, Image Gen, Whisper Transcription.
    - **Logic Nodes**: Condition (If/Else), Filter, Loop (bounded <= 10 iterations), Merge.
    - **Action Nodes**: Save to Library, Update Project, Post to Queue (Approval Required), Call API.
  - Secure Execution Engine:
    - Zero arbitrary `eval` or untrusted JS execution.
    - Predefined deterministic node handlers.
    - Mandatory approval gates for sensitive actions (publishing, external webhooks).
    - Step-by-step execution visualization with live status icons (queued, running, done, error).
- **Deliverables**:
  - `src/components/riiqx/workflows/WorkflowCanvas.tsx`
  - `src/components/riiqx/workflows/WorkflowNodeTypes.tsx`
  - `src/services/workflows/workflow-engine.ts`
  - `src/services/workflows/workflow-nlp-compiler.ts`
  - `src/app/api/riiqx/workflows/route.ts`
  - `src/app/api/riiqx/workflows/execute/route.ts`
- **Verification Gate**:
  - Translate user prompt into 4-node graph.
  - Execute workflow with step logs, pausing at approval checkpoint.

---

### PHASE 7: Module 6 — AI Video Creative Director Integration
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Connect the existing production-ready video pipeline (`AIVideoEditorPipeline.tsx`) to the broader ecosystem:
    - Feed Brand DNA color palette, typography, and watermark into HyperFrames motion graphics templates.
    - Feed Campaign Studio video scripts and hooks directly into the Video Storyboard generator.
    - Preserve the strict Storyboard Approval Gate (HTTP 403 block before approval).
    - Retain native FFmpeg multi-stream encoding, -14.2 LUFS normalization, and FFprobe QA report certification.
- **Deliverables**:
  - `src/services/video/video-creative-director.ts`
  - Update `src/components/riiqx/creator/AIVideoEditorPipeline.tsx` with Brand DNA preset loader.
  - Direct bridge between Campaign Studio scripts and Video Production tab.
- **Verification Gate**:
  - Push a Campaign Studio script into AI Video Editor, approve storyboard, and render valid MP4 verified by FFprobe.

---

### PHASE 8: Cross-Module Integration & Shared Asset Library
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Unify all 6 capabilities around a single shared context:
    - Brand DNA ➔ Campaign Studio ➔ Creative Canvas ➔ Product Studio ➔ Workflow Builder ➔ Video Creative Director.
  - Enhanced Shared Library (`RiiqxFilesView.tsx`):
    - Categorized filters: Brand Assets, Product Photos, Moodboards, Generated Images, Scripts, Video Exports, Render Reports.
    - Bidirectional "Open in Canvas", "Send to Video Editor", "Use in Campaign" actions.
- **Deliverables**:
  - Enhanced `RiiqxFilesView.tsx` with cross-module asset routing.
  - `src/context/CreativeEcosystemContext.tsx` providing active Brand DNA and Project state to all tabs.
- **Verification Gate**:
  - Verify Test F (End-to-End Cross-Module Asset Flow).

---

### PHASE 9: Security Hardening, QA & Full Acceptance Tests
- **Status**: ⏳ QUEUED
- **Objectives**:
  - Execute end-to-end acceptance suite covering Tests A through F:
    - **Test A**: Brand DNA extraction to multi-channel Campaign brief.
    - **Test B**: Creative Canvas block arrangement and contextual AI prompt.
    - **Test C**: Workflow generation from prompt to server-side execution.
    - **Test D**: Product Studio photo background change and slider comparison.
    - **Test E**: Video Editor project creation, Whisper transcript, approval gate, FFmpeg render.
    - **Test F**: Cross-module reuse of single Brand DNA across all engines.
  - Security audit: SSRF protection, MIME validation, token vault safety, rate limits, zero secret exposure.
  - Full TypeScript typecheck (`npx tsc --noEmit`) and Next.js build verification (`npm run build`).
- **Deliverables**:
  - `tests/test-creative-ecosystem-e2e.mjs`
  - `docs/final-verification-report.md`
- **Verification Gate**:
  - 100% test pass rate across all 6 test scenarios.
  - Clean build without warnings.

