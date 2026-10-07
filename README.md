# 🚀 IG GrowthOS — AI-Powered Social Growth

Production-ready Instagram and social growth automation command center built for **RIIQX** (Fashion / Clothing / Lifestyle) and modern digital-first brands.

![IG GrowthOS Brand Mark](/brand/brand-mark.png)

> **Tagline:** AI-Powered Social Growth  
> **Brand Concept:** Create • Automate • Grow  
> **Symbol:** Stylized IG + Upward Growth Arrow + AI Digital Ribbon (Cross-Platform Architecture)

---

## 1. Product Overview

**IG GrowthOS** is an autonomous operating system that unifies content research, AI scriptwriting, multi-factor opportunity scoring, editorial approval gates, official Meta Graph API scheduling and publishing, and deep performance analytics into one command center.

- **Brand:** RIIQX
- **Category:** High-End Streetwear / Avant-Garde Lifestyle Fashion
- **Target Audience:** Gen Z & young fashion-conscious aesthetics connoisseurs
- **Brand Voice:** Premium, unapologetic, confident, trend-forward, sleek, concise
- **Official Instagram:** `@riiqx.official`

---

## 2. Core AI Architecture: Amazon Bedrock

The primary and default AI infrastructure for IG GrowthOS is **Amazon Bedrock**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        IG GrowthOS Command Center                      │
│                                                                        │
│  [Natural Language Command Bar]    [15-Section Nav]   [Growth Copilot] │
└──────────────────┬─────────────────────────────────────┬───────────────┘
                   │                                     │
         ┌─────────▼────────┐                   ┌────────▼────────┐
         │ Daily Workflow   │                   │  MCP Interface  │
         │  (12-Step Loop)  │                   │ (15 Tool Suite) │
         └─────────┬────────┘                   └────────┬────────┘
                   │                                     │
         ┌─────────▼─────────────────────────────────────▼────────┐
         │               AI Provider Abstraction Layer            │
         │             (Default: Amazon Bedrock Runtime)          │
         └─────────┬─────────────────────────────────────┬────────┘
                   │                                     │
         ┌─────────▼────────┐                   ┌────────▼────────┐
         │ ModelRouter      │                   │ Converse API    │
         │ Dynamic Routing  │                   │ Tool Calling    │
         └─────────┬────────┘                   └────────┬────────┘
                   │                                     │
         ┌─────────▼─────────────────────────────────────▼────────┐
         │     Amazon Bedrock Runtime (ConverseCommand / AWS)     │
         │   Claude 3.5 Sonnet / Amazon Nova / Meta Llama 3       │
         └─────────────────────────┬──────────────────────────────┘
                                   │
         ┌─────────────────────────▼──────────────────────────────┐
         │              Supabase / PostgreSQL Persistence         │
         │        (RLS, 10 Production Tables, Audit Logs)         │
         └────────────────────────────────────────────────────────┘
```

- **Default Provider:** `BedrockProvider` using `@aws-sdk/client-bedrock-runtime` and `ConverseCommand`.
- **Dynamic Model Router:** Environment-driven task routing (`CONTENT_MODEL_ID`, `ANALYTICS_MODEL_ID`, `TREND_MODEL_ID`, `CHAT_MODEL_ID`) with automated fallback to `BEDROCK_MODEL_ID`.
- **Tool-Calling Integration:** Model can invoke server-side tools (`get_brand`, `get_content`, `create_content`, `get_analytics`, `get_trends`, `get_products`, `get_instagram_account`) without hallucinating data.
- **Provider Independence:** Does NOT require a direct Anthropic API key; Anthropic models are accessed via AWS Bedrock.

---

## 3. Brand Identity & Cross-Platform Logo System

The visual identity is designed for **cross-platform expansion** (Instagram, TikTok, YouTube Shorts, Pinterest):
- **Abstract Geometry:** Smooth glassmorphic digital ribbon combining an abstract lowercase "i" (sphere dot + ribbon stem) and capital "G" sweeping into an integrated **upward growth arrow**.
- **Aurora Color Palette:** Electric Violet (`#7C3AED`) → Deep Purple (`#9333EA`) → Magenta (`#C026D3`) → Hot Pink (`#EC4899`) → Electric Blue (`#2563EB`) → Cyan (`#06B6D4`) with warm orange/coral core lighting.
- **Logo Formats & Assets:**
  - `public/brand/icon.svg` (Infinite-resolution vector symbol)
  - `public/brand/logo-horizontal.svg` (Desktop header & navbar lockup)
  - `public/brand/logo-stacked.svg` (Splash screen & marketing lockup)
  - `public/brand/icon-monochrome.svg` (High-contrast monochrome print lockup)
  - Multi-resolution PNGs (`16px` to `1024px`) & PWA `manifest.json`.

---

## 4. 15 Core Modules

1. **Overview Dashboard** — Welcome banner, KPI cards (Reach, Engagement, Saves, Shares), and today's queue.
2. **Content Calendar** — Month, week, day, and list schedule views.
3. **Ideas Engine** — 10 AI-generated ideas scored with the 7-factor Opportunity Score.
4. **Drafts** — In-progress creative workspaces.
5. **Approvals Center** — Editorial approval gates (`DRAFT` → `READY` → `PENDING` → `APPROVED`).
6. **Scheduled** — Timed release queue for approved media.
7. **Published** — Live Instagram posts linked to official Meta IDs.
8. **Analytics** — Deep reach, impressions, save rate, and engagement diagnostics.
9. **Trends** — Verified fashion, streetwear, and lifestyle trends with freshness scores.
10. **Products** — RIIQX catalog integration for product and affiliate content.
11. **AI Studio** — Multi-format creation studio (Reel, UGC, Carousel, Story, Caption).
12. **Automations** — 9 background automated jobs with single-click manual run.
13. **Instagram Connection** — Meta OAuth 2.0 flow with token validation.
14. **Brands** — Multi-brand management (default: RIIQX).
15. **Settings** — Publishing safety thresholds, API switches, and dark/light modes.

---

## 5. Critical Publishing Safety Gate (Section 28)

To prevent accidental or unauthorized publishing:
```typescript
// Server-side enforcement in Instagram Publishing Service
if (contentItem.approval_status !== 'APPROVED' && process.env.AUTONOMOUS_PUBLISHING !== 'true') {
  throw new Error("APPROVAL_GATE_REJECTION: Post must be APPROVED before publishing.");
}
```
Unapproved content can **never** be published, regardless of frontend actions or AI suggestions.

---

## 6. Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- AWS Account with Bedrock Model Access enabled
- (Optional) Supabase project and Meta Developer app

### Installation
```bash
git clone https://github.com/riiqx/ig-growthos.git
cd ig-growthos
npm install
```

### Environment Configuration
```bash
cp .env.example .env.local
```
Configure your AWS Bedrock and Meta settings (see `docs/AWS-BEDROCK-SETUP.md` and `docs/META-INSTAGRAM-SETUP.md`).

### Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Suite Execution
```bash
npm test
```
Runs the 10 automated test suites covering opportunity scoring, blueprint validation, approval safety gates, Bedrock model routing, and brand assets.

---

## 7. Documentation Index

- [Amazon Bedrock Setup Guide](docs/AWS-BEDROCK-SETUP.md)
- [Meta Instagram API Setup Guide](docs/META-INSTAGRAM-SETUP.md)
- [System Architecture Specification](docs/architecture.md)
- [Demo Walkthrough Script](docs/demo-script.md)

---

## 8. License

Proprietary SaaS. Built for **RIIQX** & Next-Generation Social Growth Automation.
