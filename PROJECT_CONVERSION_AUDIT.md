# 🔍 PROJECT CONVERSION AUDIT — IG GROWTHOS → PUJAHOP KOLKATA

**Audit Date:** October 8, 2026  
**Auditor:** Principal Enterprise Architect & Systems Engineer  
**Scope:** Full codebase audit before migration to **PujaHop Kolkata**  
**Core Directive:** Zero Mock • Zero Fake Workflows • Preserve Real Working Infrastructure  

---

## 1. Existing Architecture

- **Application Framework:** Next.js 14.2.18 (React 18.3.1, App Router architecture).
- **Language / Typing:** TypeScript 5.6.3 with strict type checking enabled (`tsconfig.json`).
- **Styling & Design System:** Tailwind CSS 3.4.14 with PostCSS, `clsx`, `tailwind-merge`, and dark-mode foundation (`#09090B`, zinc-100, accent highlights).
- **Animation & UI Transitions:** Framer Motion 11.11.17, Canvas Confetti 1.9.3.
- **Icons:** Lucide React 0.454.0.
- **Data Validation:** Zod 3.23.8 for input and payload validation.
- **Deployment & Runtime:** Node.js 20+ runtime, compatible with Vercel, AWS ECS/Fargate, or standalone Node.js server.
- **State Management:** React Context API (`GrowthOSContext` managing navigation, active tab, items, copilot drawer, execution handlers).

---

## 2. Existing APIs

The current project exposes 20 Next.js Route Handlers (`src/app/api`):

1. `POST /api/ai/analyze` — Analyzes Instagram performance and opportunities.
2. `POST /api/ai/bedrock/test` — Direct live connectivity test to AWS Bedrock Converse API.
3. `POST /api/ai/copilot` — Conversational assistant with tool calling.
4. `POST /api/ai/ideas` — Content idea generator with score calculation.
5. `POST /api/ai/reel` — Reel 5-phase script builder.
6. `GET /api/analytics` — Historical analytics records and aggregated metrics.
7. `GET, POST /api/audit` — Immutable audit log retrieval and creation.
8. `GET /api/auth/instagram/url` — Generates Meta OAuth authorization URL.
9. `GET, POST /api/automations` — Automation jobs queue and dispatcher.
10. `GET, PUT /api/brand` — Brand configuration and content pillars management.
11. `GET, POST /api/content` — Content items list and creation.
12. `GET, PUT, DELETE /api/content/[id]` — Single content item lifecycle (draft, approve, schedule).
13. `GET /api/health` — Unified health status aggregator.
14. `GET /api/health/bedrock` — Live AWS Bedrock runtime health check.
15. `GET /api/health/instagram` — Meta Graph API token verification.
16. `GET /api/health/supabase` — Supabase PostgreSQL connection & query latency test.
17. `GET /api/instagram/account` — Instagram business account details.
18. `GET, POST /api/products` — Product catalog management.
19. `GET, POST /api/trends` — Trend discovery and scoring.
20. `POST /api/workflow/daily` — 12-step daily automated pipeline.

---

## 3. Existing Database

- **Provider:** Supabase PostgreSQL (Remote instance `ojtngzqsrdralrhipjzt.supabase.co`).
- **Connection Libraries:** `@supabase/supabase-js` v2.46.1.
- **Existing Schema Tables (`supabase/migrations/20261007000000_ig_growthos_schema.sql`):**
  1. `brands`
  2. `content_pillars`
  3. `content_items`
  4. `content_variants`
  5. `products`
  6. `trends`
  7. `analytics_records`
  8. `automation_jobs`
  9. `audit_logs`
  10. `approvals`
- **Security:** Row Level Security (RLS) policies configured on Supabase tables with `anon` and `service_role` separation.
- **Repository Pattern:** Dual-mode repository (`src/lib/supabase/repository.ts`) with PostgreSQL client and resilient in-memory fallback.

---

## 4. Existing Reusable Components

The project includes modular UI components and layouts:
- `src/components/layout/Header.tsx`: Responsive navigation header with command input, copilot trigger, and status pills.
- `src/components/layout/Sidebar.tsx`: Tab-based navigation with icons and badges.
- `src/components/layout/MobileBottomNav.tsx`: Bottom navigation bar for mobile devices.
- `src/components/copilot/GrowthCopilotDrawer.tsx`: Sliding AI chat panel with chat bubbles and prompt suggestions.
- `src/components/settings/AIInfrastructureView.tsx`: Live connection diagnostic panel with latency indicators.
- `src/components/ThemeToggle.tsx`: Dark/light/system theme switcher.
- `src/components/brand/Logo.tsx`: SVG vector logo with horizontal and stacked variants.

---

## 5. Existing Environment Variables

Defined in `.env.example` and `.env.local`:
- `NEXT_PUBLIC_APP_URL` (`http://localhost:3000`)
- `NODE_ENV` (`development` / `production`)
- `NEXT_PUBLIC_SUPABASE_URL` (`https://ojtngzqsrdralrhipjzt.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (JWT anon key)
- `SUPABASE_SERVICE_ROLE_KEY` (JWT service_role key)
- `AWS_REGION` (`ap-southeast-2` — strictly enforced per AWS project policy)
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` (IAM session credentials)
- `AWS_BEARER_TOKEN_BEDROCK`, `BEDROCK_API_KEY`, `BEDROCK_API_KEY_NAME` (Bedrock API key authentication)
- `AI_PROVIDER` (`bedrock`)
- `BEDROCK_MODEL_ID` (`au.anthropic.claude-sonnet-4-6`)
- `CONTENT_MODEL_ID`, `ANALYTICS_MODEL_ID`, `TREND_MODEL_ID`, `CHAT_MODEL_ID`
- `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `MOCK_MODE` (`false`), `NEXT_PUBLIC_MOCK_MODE` (`false`)

---

## 6. Existing Authentication

- **Supabase Auth:** `@supabase/supabase-js` auth client configured with session persistence.
- **Admin Security:** `createAdminClient` in `src/lib/supabase/admin.ts` strictly enforces server-side execution and forbids browser execution.
- **Meta OAuth:** Server-side OAuth redirect and code exchange structure in `src/lib/instagram/oauth.ts`.
- **AWS SigV4 & Bearer Tokens:** AWS Bedrock client supports SigV4 with session tokens and custom authorization headers for Bedrock API keys.

---

## 7. Existing Integrations

1. **Amazon Bedrock Runtime:**
   - Client: `BedrockRuntimeClient` from `@aws-sdk/client-bedrock-runtime`.
   - Methods: `ConverseCommand` with tool calling schema.
   - Dynamic model resolution via `ModelRouter`.
   - Health diagnostics via `BedrockConnectionService.testConnection()`.
2. **Supabase Database:**
   - Remote REST API with service role key.
   - Automated health checks and query latency measurement.
3. **Model Context Protocol (MCP):**
   - `@modelcontextprotocol/sdk` configured in `mcp/instagram-growth`.

---

## 8. Features That Can Be Reused

1. **AWS Bedrock Infrastructure:**
   - Full `BedrockRuntimeClient` setup, Converse command execution, Bearer Token handling, and model routing.
   - Reusable for `RoutePlanningAgent`, `PandalResearchAgent`, `CrowdAnalysisAgent`, `TripOptimizationAgent`, and `PujaCopilotAgent`.
2. **Supabase Client & RLS Architecture:**
   - `client.ts`, `server.ts`, and `admin.ts` can be directly retained.
   - Database schema will be updated to host PujaHop Kolkata tables.
3. **AI Copilot Drawer & Chat Interface:**
   - Sliding chat UI, markdown rendering, tool calling response parsing, and error diagnostics.
4. **API Health Center:**
   - Health diagnostic architecture and connection test framework.
5. **Layout & PWA Shell:**
   - Next.js root layout, manifest structure, mobile bottom navigation, and sticky header.
6. **Security & Environment Validation:**
   - Multi-tier environment guard (`src/lib/security/env-validator.ts`).

---

## 9. Features That Must Be Removed

1. **Instagram Graph API Integration:**
   - Meta OAuth endpoints (`/api/auth/instagram/*`), Instagram publishing container APIs, media insights, and Reels publishing logic.
2. **Fashion / Streetwear Brand Configuration:**
   - `RIIQX` fashion brand configurations, clothing products, apparel pricing, and fashion content pillars.
3. **Instagram Reels Script Generators & Content Approvals:**
   - Hook/problem/payoff fashion reel generators.
4. **Mock Fallback Mechanisms:**
   - Any silent simulation mode that fabricates fake data.

---

## 10. Features That Must Be Redesigned

1. **Brand & Identity:**
   - Transform from *IG GrowthOS (RIIQX)* into **PujaHop Kolkata** (*"One Day. One City. Maximum Puja."*).
   - Aesthetic transformation to Bengali Durga Puja festival styling (dark mode with warm festive saffron/vermilion/gold accents, alpona motifs, glassmorphism).
2. **Data Model:**
   - Migrate database schema to:
     - `pandals`
     - `pandal_sources`
     - `pandal_verifications`
     - `metro_stations`
     - `metro_lines`
     - `walking_routes`
     - `traffic_alerts`
     - `crowd_reports`
     - `restaurants`
     - `hospitals`
     - `police_stations`
     - `puja_calendar`
     - `trip_plans`
     - `trip_stops`
     - `trip_sessions`
     - `pandal_visits`
     - `user_preferences`
     - `user_saved_pandals`
     - `pandal_photos`
     - `route_recalculations`
     - `weather_snapshots`
     - `api_health`
     - `audit_logs`
3. **Route Engine:**
   - Build a real itinerary optimization engine with real distance calculation, metro connections, traffic filters, crowd awareness, and walking navigation actions.
4. **Metro Intelligence Layer:**
   - Official Kolkata Metro line models (Blue Line, Green Line, Purple Line, Orange Line) with verified stations, coordinates, interchanges, and date-aware schedules.
5. **AI Travel Assistant (Puja Copilot):**
   - Natural language planner supporting Bengali ("আমি দুপুর ২টো থেকে রাত ১০টা পর্যন্ত বেরোব...") and English with live constraints and route generation.
6. **One-Day Mode Wizard:**
   - 8-step planning wizard with date picker supporting 2026 Puja dates (Mahalaya to Dashami + Pre-Puja mode).
7. **Pandal Passport & Offline Trip Mode:**
   - Visit tracker, offline trip storage (localStorage + downloadable JSON), emergency SOS directory.
