# Hackathon Submission Draft: GlowFit AI

## Project Name
**GlowFit AI — Your Skin. Your Style. Your Smartest Beauty Cart.**

## Elevator Pitch
GlowFit AI is an AI beauty shopping decision engine that combines YouCam skin analysis, occasion-based personalization, and virtual try-on to help consumers discover, test, and purchase complete cosmetic looks within their budget.

---

## Inspiration
Online beauty shopping has long suffered from the "Expectation vs. Reality" dilemma. Customers spend hours scrolling social media and eCommerce sites wondering:
- *Will this foundation oxidize or look ashy on my undertone?*
- *How do these 4 products look when combined into a single look?*
- *Can I achieve this wedding guest look without exceeding my ₹1,500 budget?*

We set out to build an end-to-end shopping decision engine that transforms beauty eCommerce from an uncertain gamble into a personalized, visual, and confident ritual.

---

## What It Does
1. **Optical Beauty Profile:** Evaluates skin tone luminance, undertones (Warm, Cool, Neutral, Olive), surface texture, and radiance using facial computer vision.
2. **Intent & Smart Budget Calibration:** Understands what the user is preparing for (Everyday, Work, Date Night, Wedding Guest, Party, Photoshoot) and optimizes product sets to fit strict INR budget tiers (₹500, ₹1,000, ₹1,500, ₹3,000, or Custom).
3. **Personalized Look Engine:** Assembles a 4-piece coordinated cosmetic set (Base, Lips, Cheeks, Eyes) accompanied by clear "Why GlowFit Chose This" rationale.
4. **Virtual Try-On Studio:** Enables users to see the complete look rendered on their facial geometry using YouCam Look & Makeup VTO, featuring an interactive drag slider, split side-by-side mode, and zoom.
5. **Smart Beauty Cart & Archive:** Direct 1-click conversion into an optimized shopping cart with budget status tracking and personal consultation look archiving.

---

## How We Built It
- **Frontend Architecture:** Next.js 14 App Router, TypeScript, and Tailwind CSS styled with an Apple-meets-Vogue luxury editorial aesthetic.
- **Server-Side AI Layer:** A dedicated `/lib/youcam/` architecture featuring exponential backoff polling, async task deduplication, and response normalization adapters.
- **Visuals & Interactivity:** Responsive before/after comparison sliders with touch and mouse tracking, camera capture guides, and canvas confetti animations.
- **Database & Security:** Supabase PostgreSQL schema with Row Level Security (RLS) policies isolating user profiles, skin analyses, and saved looks.

---

## How YouCam Technology Is Used
YouCam by Perfect Corp. is the core engine powering two vital steps of the consumer journey:
1. **Skin Analysis:** Provides calibrated computer vision metrics for surface texture, pore diffusion, radiance, and undertone.
2. **Look VTO (Virtual Try-On):** Applies facial landmark geometry and verified Look templates to render true-to-life cosmetic transformations before checkout.
3. **Dual-Mode Compliance:** Strict architectural separation between **DEMO MODE** (clearly marked with deterministic sample AI results) and **LIVE MODE** (server-authenticated YouCam API calls).

---

## Challenges Overcome
1. **Async Task Deduplication:** When users refresh or tap buttons quickly during AI processing, redundant paid API tasks could be spawned. We engineered a request-fingerprinting cache in `tasks.ts` to identify identical pending tasks and prevent duplicate charges.
2. **Budget Constraint Optimization:** Crafting an algorithm that constructs a harmonious 4-category beauty set (Base, Lips, Cheeks, Eyes) while strictly respecting varying INR budget limits required a multi-pass tier-swapping scoring algorithm.
3. **Anti-Hallucination & Medical Ethics:** Ensured the AI never claims to diagnose clinical skin conditions or make medical claims, presenting only visual cosmetic attributes.

---

## Impact & Market Viability
- **Reduces Returns:** Allowing customers to see the look on themselves dramatically reduces foundation and lipstick return rates.
- **Increases Average Order Value (AOV):** By recommending complete, coordinated 4-piece looks rather than single items, basket sizes increase organically.
- **Democratizes Beauty Consultations:** Brings the expertise of a luxury beauty advisor to every smartphone user in under 90 seconds.

---

## Future Roadmap
- Direct Shopify and WooCommerce merchant checkout integrations.
- Personalized seasonal shade replenishment subscriptions.
- Multi-face group try-on for bridal parties and bridesmaids.

---

## Demo Instructions for Judges
1. Open the GlowFit AI web app.
2. Tap **"Analyze My Skin"**.
3. Select any verified sample portrait or take a live camera selfie.
4. Review your **Beauty Profile** (undertone, skin tone, surface metrics).
5. Tap **"Set Beauty Intent"** → Choose **"Wedding Guest"**, **"Soft Glow"**, and **₹1,500** budget.
6. Explore your **Personalized Look** and product rationale.
7. Tap **"Virtually Try Look"** → Drag the before/after comparison slider.
8. Tap **"Add Look Products to Cart"** → Review your budget meter and tap **"Proceed to Demo Checkout"**!
