# RIIQX — Unified Commerce Intelligence & AI Creator Ecosystem Architecture
**Version**: 2.5 Production Master  
**Date**: November 5, 2026  
**Status**: APPROVED ARCHITECTURE  
**Target Clients**: RIIQX Web (`http://localhost:3001`), RIIQX Windows Desktop, RIIQX Native Android  
**Backend**: Unified Supabase Cloud PostgreSQL + Node.js Serverless Services

---

## 1. System Vision & Core Pillars

RIIQX merges **autonomous e-commerce intelligence** with **high-end cinematic media production**. Unlike fragmented shopping aggregators or isolated video editors, RIIQX functions as an interconnected ecosystem where:
- A user discovers a dropshipping product or analyzes a competitor's screenshot.
- RIIQX's **Multimodal Vision Engine** extracts product attributes and cross-checks 6 major retailers (Amazon, Flipkart, Myntra, Meesho, Ajio, Tata CLiQ).
- The **Savings Arbitrage Engine** calculates verified coupon stacking, bank card offers, and authorized gift card purchase discounts.
- The **Creator Studio Engine** generates high-converting 9:16 vertical video ads for dropshippers in 1 click, styled according to the user's authentic `Brand Kit`.
- All operations synchronize across **Web**, **Desktop**, and **Android** under **one Supabase user identity**.

---

## 2. Multi-Platform Topology

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           UNIFIED CLIENT ECOSYSTEM                              │
├─────────────────────────┬───────────────────────────┬───────────────────────────┤
│    A. RIIQX Web App     │ B. Windows Desktop App    │ C. Native Android App     │
│ (Next.js 14.2 / Vercel) │ (Electron / Native Node)  │ (Capacitor / Android 14+) │
│                         │                           │                           │
│ • Full Browser Access   │ • Hardware-Acc. FFmpeg    │ • Native Camera OCR       │
│ • Universal Search      │ • Local Filesystem Access │ • Share Intent URL Intake │
│ • Interactive Canvas    │ • Direct Remotion Export  │ • Push Notifications (FCM)│
│ • Creator Studio Hub    │ • Offline Project Cache   │ • Biometric Auth (FP/Face)│
└────────────┬────────────┴─────────────┬─────────────┴─────────────┬─────────────┘
             │                          │                           │
             └──────────────────────────┼───────────────────────────┘
                                        │ (HTTPS / WSS / JWT)
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    RIIQX SHARED SECURE BACKEND & API GATEWAY                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • SSRF Protection Gate & Rate Limiting                                          │
│ • Multi-Provider AI Orchestration (Gemini 2.5 Flash, Groq, Bedrock Claude, NIM) │
│ • Dynamic Price Comparison & Identity Matcher                                   │
│ • Deterministic Offer Stacker & Savings Engine                                  │
│ • Dropshipping Supplier Routing & Idempotent Order State Machine               │
│ • Authorized Gift Card Distribution Gateway                                     │
│ • AES-256 Token Vault & Webhook Signer                                          │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
         ┌───────────────────────────────┐   ┌───────────────────────────┐
         │     SUPABASE POSTGRESQL       │   │    LOCAL VIDEO ENGINE     │
         ├───────────────────────────────┤   ├───────────────────────────┤
         │ • User Profiles & Auth        │   │ • FFmpeg 6.0+ Multi-Stream│
         │ • Commerce & Dropship Catalog │   │ • OpenAI Whisper C++      │
         │ • Orders & Supplier Inventory │   │ • Remotion React Renderer │
         │ • Price Observation History   │   │ • HyperFrames v0.9.13     │
         │ • Gift Card Orders & Ledgers  │   │ • 1-FPS Vision Analyzer   │
         │ • Row Level Security (RLS)    │   │ • Master 1080x1920 MP4    │
         └───────────────────────────────┘   └───────────────────────────┘
```

---

## 3. Four Core Business Engines

### Engine 1: Premium Dropshipping Marketplace & Supplier Logistics
- **Model**: RIIQX operates as an authorized merchant and marketplace facilitator.
- **Supplier Onboarding**: Verified GSTIN, business credentials, warehouse location, and return window.
- **Product Mapping**: Internal SKU tied to Supplier SKU, GTIN, and variant matrices.
- **Inventory Sync**: Scheduled hourly delta sync; real-time validation upon checkout initiation.
- **Order Routing**: Idempotent order state machine (`pending_payment` -> `paid` -> `supplier_confirmed` -> `packed` -> `shipped` -> `delivered` -> `completed`).
- **Profit Analytics**: Real gross margin = `Selling Price - Supplier Cost - Gateway Fee (1.9%) - Shipping - GST - Return Allowance`. Zero fake margins.

### Engine 2: Smart Price Intelligence & Screenshot Analysis
- **Screenshot OCR**: Multimodal Gemini 2.5 Flash Lite Vision extracts exact title, model, displayed price, MRP, and detected retailer banner.
- **URL Resolver**: Resolves canonical product IDs (ASIN, Flipkart FSN, Myntra Style ID) while strictly respecting robots.txt and platform terms. Zero anti-bot or CAPTCHA bypasses.
- **Identity Matcher**: Multi-signal scoring engine combining GTIN/EAN, exact model number, and Cohere Embed v3 cosine similarity. Requires >= 0.92 similarity for exact match classification.
- **Retailer Coverage**: Transparently reports which platforms were queried and exact timestamp of data freshness.

### Engine 3: Offer, Coupon & Gift Card Arbitrage
- **Deterministic Discount Stacker**: Evaluates discounts in lawful financial hierarchy:
  1. Base Selling Price
  2. Less: Instant Product Coupon (validated against minimum spend threshold)
  3. Less: Payment / Bank Card Discount (capped at maximum bank allowance)
  4. Less: Authorized Gift Card Purchase Savings (face value minus discounted purchase price)
  5. Plus: Verified Shipping & Handling Surcharge
  = **Final Payable at Checkout**
  6. Less: Future Cashback (clearly separated from instant checkout discount)
  = **Effective Net Cost**
- **Authorized Gift Card Sourcing**: Gift cards are provisioned exclusively via authorized distribution partner APIs with server-side payment verification. Zero simulated vouchers.
- **Redemption Protocol**: Safe, step-by-step redemption instructions with official deep links. Zero third-party password or OTP automation.

### Engine 4: AI Creator Studio & Video Editor (Fully Preserved)
- **Zero Disruption**: The existing 14-workspace Creator Studio remains 100% operational.
- **1-Click Dropshipping Ad Bridge**: Converts any product in the dropshipping catalog into a structured 4-beat video ad storyboard (`AI Video Editor/Raw/[Product Name] Launch`) with pacing strips and b-roll directions.
- **Style-Driven Production**: 1-fps frame style extraction from 5 reference videos continuously refines `Brand Kit/brand-kit.md` (colors, fonts, pacing rules).
- **Master Rendering**: Production renders executed via Remotion and local FFmpeg (1080x1920, H.264/AAC, -14 LUFS loudness).

---

## 4. Legal, Regulatory & Compliance Framework (India)

RIIQX is designed in full compliance with current and upcoming Indian e-commerce legislation:

1. **Consumer Protection (E-Commerce) Rules, 2020 & 2026 Amendments (Effective Jan 1, 2027)**:
   - **Prior Price Disclosure**: When advertising a price drop or discount, RIIQX references verified historical price observations rather than inflated arbitrary MRPs.
   - **Prominent Sponsored Disclosure**: Any paid or sponsored product placement carries an unambiguous `[Sponsored]` badge.
   - **Fair Search Ranking**: Search rankings are determined by algorithmic relevance, verified discount, or customer rating. Paid ranking boosts are disclosed.
   - **Seller Transparency**: Name, registered address, GSTIN, and customer care contact details of every supplier are accessible on product pages.
   - **Country of Origin**: Mandatory attribute displayed on all physical product listings.
   - **Grievance Officer**: Designated grievance officer details and complaint tracking mechanism with 48-hour acknowledgment.
2. **GST & Tax Collection at Source (TCS)**:
   - Proper GST categorization (18% for services, specific HSN rates for physical items).
   - Compliance readiness for Section 52 CGST Act (1% TCS on net taxable supplies).
3. **RBI Guidelines on Prepaid Payment Instruments (PPI)**:
   - RIIQX does NOT operate an open monetary wallet or unauthorized stored-value facility.
   - Gift cards sold are closed or semi-closed system instruments issued by authorized partner entities.
   - Promotional credits are strictly non-monetary and non-transferable.
4. **Digital Personal Data Protection Act, 2023 (DPDP)**:
   - Data minimization: Only necessary shipping and contact details are collected.
   - User rights: Users can export or delete their profile and history via the settings panel.
   - Explicit consent gates for marketing notifications and location data.
