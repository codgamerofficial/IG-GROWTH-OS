# RIIQX — Master Implementation Roadmap (Phases 1 to 9)
**Project**: RIIQX (Ultimate Commerce Intelligence & AI Creator Ecosystem)  
**Version**: 2.5 Master Execution Plan  
**Target URL**: `http://localhost:3001` (Dev) / `https://riiqx.vercel.app` (Prod)  
**Backend**: Supabase (`https://ojtngzqsrdralrhipjzt.supabase.co`)

---

## Roadmap Overview

```
Phase 1: Forensic Audit & Protection          [✅ COMPLETED]
Phase 2: Shopping Marketplace & Catalog       [🏗️ READY TO PROCEED]
Phase 3: Smart Price Intelligence & OCR       [PLANNED]
Phase 4: Savings Engine & Gift Card System    [PLANNED]
Phase 5: Dropshipping Operations & Routing    [PLANNED]
Phase 6: AI Shopping Assistant Orchestrator   [PLANNED]
Phase 7: Creator Studio & Ad Video Engine     [PLANNED]
Phase 8: Windows Desktop & Android Apps       [PLANNED]
Phase 9: Compliance, Security & E2E Tests     [PLANNED]
```

---

## Detailed Phase Breakdown

### Phase 1 — Forensic Audit & Protection ✅ (COMPLETED)
- [x] Inspect existing Next.js App Router codebase, component hierarchy, and routing.
- [x] Create git backup checkpoint tag `backup_pre_commerce_transformation`.
- [x] Perform environment variable forensic audit: mapped 71 keys, redacted secrets, zero exposure.
- [x] Audit Supabase database tiers: Database, Auth, Storage (`media`, `brand-assets`, `video-exports`), Functions, RLS.
- [x] Verify tool suite operational health: FFmpeg, FFprobe, Whisper, yt-dlp, Remotion, HyperFrames.
- [x] Produce core architecture deliverables:
  - `docs/environment-inventory-redacted.md`
  - `docs/service-capability-matrix.md`
  - `docs/existing-project-audit.md`
  - `docs/new-architecture.md`
  - `docs/implementation-roadmap.md`

---

### Phase 2 — Shopping Marketplace & Product Discovery ✅ (COMPLETED)
- [x] Implement extended Commerce Database Schema in Supabase (`products`, `product_variants`, `product_categories`, `sellers`, `suppliers`, `reviews`).
- [x] Connect high-margin curated dropshipping catalog with full specifications, images, variants, and country of origin.
- [x] Build Full-Text Search, Category Filtering, and Multi-Signal Sorting (Price, Verified Discount, Popularity).
- [x] Create Cinematic Product Detail View with 3D/Zoom gallery, verified MRP, shipping estimates, and seller disclosure.
- [x] Implement Supplier Registration & Onboarding Flow with GSTIN and warehouse location validation.
- [x] Verify zero fake listings or simulated reviews.

---

### Phase 3 — Smart Price Intelligence & Screenshot Analysis ✅ (COMPLETED)
- [x] Create Price Intelligence Database Schema (`product_price_observations`, `price_watchlists`).
- [x] Refine Multimodal Gemini Vision OCR prompt for screenshots (Amazon, Flipkart, Myntra, Meesho, Ajio, Tata CLiQ).
- [x] Build Canonical Product URL Resolver stripping tracking tags and extracting ASIN / FSN / Style IDs.
- [x] Implement Exact Product Identity Matcher & Spec Guard preventing spec mismatches (e.g. 128GB vs 256GB).
- [x] Implement multi-platform live coverage report with verified timestamps and retailer latency.
- [x] Connect Historical Price API (30-day observations, average, lowest ever, trend direction).
- [x] Connect Target Price Drop Watchlist API & User Notification alerts.
- [x] Update Frontend UI (Arbitrage Scanner with Spec Match Badge, Retailer Coverage, and Watchlist Modal).
- [x] Create and run Phase 3 acceptance test suite (`tests/test-phase3-price-intelligence.mjs`: 6/6 tests passed).

---

### Phase 4 — Savings Engine & Gift Card Optimization 🏗️ (NEXT PHASE)
- [ ] Build deterministic discount evaluation engine: Base Price -> Instant Coupon -> Bank Card Offer -> Gift Card Savings -> Delivery -> Cashback.
- [ ] Implement Rule-Based Coupon & Offer Eligibility Engine (checking minimum spend, category exclusions, and payment method).
- [ ] Integrate Authorized Branded Gift Card Marketplace (Amazon, Flipkart, Myntra, etc.) with provider API connectivity.
- [ ] Implement server-side payment verification and idempotent gift card fulfillment.
- [ ] Provide safe, clear manual redemption instructions and official redemption links. Zero unauthorized wallet scraping.
- [ ] Maintain separate financial ledgers for customer payable, gift card balance, and future cashback.

---

### Phase 5 — Dropshipping Operations & Supplier Logistics
- [ ] Build Supplier Inventory Sync engine with scheduled delta sync and real-time checkout lock.
- [ ] Implement Idempotent Order Routing State Machine: `pending_payment` -> `paid` -> `supplier_confirmed` -> `packed` -> `shipped` -> `delivered`.
- [ ] Integrate Courier Tracking APIs with live milestones and estimated delivery dates.
- [ ] Build Returns & Refunds Workflow with reason capture, quality check status, and automated payment gateway refund trigger.
- [ ] Implement Dropshipping Gross and Contribution Margin Calculator factoring in COGS, shipping, 1.9% gateway fee, GST, and return reserves.

---

### Phase 6 — AI Shopping Assistant & Multi-Agent Orchestrator
- [ ] Build conversational RIIQX Shopping Assistant combining text reasoning and vision OCR.
- [ ] Support natural language queries: "Find the best deal for Sony WH-1000XM5 across all retailers including coupons and gift cards".
- [ ] Implement multi-provider agent fallback: Gemini 2.5 Flash -> Groq GPT-OSS 120B -> OpenRouter Llama 3.3 70B.
- [ ] Add safety boundaries: require human confirmation before any purchase; never hallucinate prices or fake discounts.

---

### Phase 7 — Creator Studio Enhancement & Video Ad Bridge
- [ ] Preserve all 14 existing Creator Studio workspaces without regression.
- [ ] Connect 1-Click Dropshipping Ad Generation: converts any marketplace product into a 4-beat vertical video ad storyboard in `AI Video Editor/Raw/`.
- [ ] Maintain 1-fps style analysis of reference reels to update `Brand Kit/brand-kit.md`.
- [ ] Render master vertical 1080x1920 MP4 video ads via Remotion and local FFmpeg with LUFS loudness compliance.
- [ ] Track content performance and affiliate/dropshipping referral conversions.

---

### Phase 8 — Windows Desktop & Native Android Client Deployment
- [ ] **Windows Desktop (Electron)**:
  - Connect hardware-accelerated local FFmpeg rendering.
  - Native filesystem access to `AI Video Editor/` project directories.
  - Desktop-specific hotkey clipboard URL scanner and notifications.
- [ ] **Native Android (Capacitor)**:
  - Native Camera OCR integration for instantaneous in-store price scanning.
  - Android Share Intent receiver for 1-tap product link analysis from Amazon/Flipkart apps.
  - Secure biometric login (Fingerprint / Face Unlock).
- [ ] Ensure all 3 clients communicate with the shared Supabase backend and preserve user state.

---

### Phase 9 — Production Compliance, Security & E2E Acceptance
- [ ] Implement India E-Commerce Rules (2020 & 2026 amendments) compliance: prior price disclosure, sponsored badges, grievance officer contact.
- [ ] Complete anti-fraud and rate-limiting security checks.
- [ ] Execute Master Acceptance Suite (Tests A through G):
  - **Test A**: Product Screenshot OCR & Retailer Search.
  - **Test B**: Product URL Analysis & Canonical Resolution.
  - **Test C**: Deterministic Discount Stacking & Cashback Separation.
  - **Test D**: Gift Card Purchase & Server-Side Verification.
  - **Test E**: Dropshipping Order Lifecycle & Fulfillment Routing.
  - **Test F**: Creator Studio Video Production & FFprobe QA.
  - **Test G**: Multi-Platform State Consistency (Web, Desktop, Mobile).
- [ ] Publish Final Production Delivery Report.
