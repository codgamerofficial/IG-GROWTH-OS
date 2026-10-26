# 🌺 PujaHop Kolkata — One Day. One City. Maximum Puja.

[![License](https://img.shields.io/badge/license-MIT-amber.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![CARTO Basemaps](https://img.shields.io/badge/CARTO-Basemaps-orange.svg)](https://carto.com/basemaps)
[![Agent Router AI](https://img.shields.io/badge/AI-DeepSeek--V4--Flash-emerald.svg)](https://agentrouter.ai)
[![Author](https://img.shields.io/badge/Creator-Saswata%20Dey%20(Riik)-rose.svg)](#creator-attribution)

> **একদিনে সারা কলকাতার সেরা পুজো**  
> *“পুজো শুধু মণ্ডপ নয়, এটা একটা শহরের গল্প।”*  
> **One Day. One City. Maximum Puja.**

An editorial cultural magazine, modern travel super-app, cinematic Bengali festive experience, and AI companion for navigating Kolkata Durga Puja.

---

## 🏛️ Creator Attribution

- **Creator:** Saswata Dey (Riik)
- **Official Credit:** Created & Conceptualized by **Saswata Dey (Riik)**
- **Vision:** *An independent cultural-tech experience by Saswata Dey (Riik).*

PujaHop Kolkata was conceptualized to liberate Kolkata pandal-hoppers from misinformation, hardcoded fake travel times, fabricated 24/7 metro claims, and guesswork. It bridges centuries of Bengali artistic traditions with modern navigation engineering.

---

## 🎨 The 5 Architectural Layers

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. CINEMATIC KOLKATA LAYER                                             │
│    • High-resolution night photography: Illumination, Tram, Hooghly    │
│    • Multi-format campaign posters (HeroPoster, FestivalBanners)      │
├────────────────────────────────────────────────────────────────────────┤
│ 2. BENGALI EDITORIAL LAYER                                             │
│    • Noto Serif Bengali + Playfair Display + Inter typography          │
│    • Curated Bengali storytelling and cultural idioms                 │
├────────────────────────────────────────────────────────────────────────┤
│ 3. TRAVEL SUPER-APP LAYER                                              │
│    • CARTO Dark Matter & Voyager Basemaps (Key: cb1_4er...)           │
│    • Real OSRM Walking Engine & Turn-by-Turn GPS navigation            │
│    • Honest Metro timetable (06:50 - 23:45; night circulars unverified)│
├────────────────────────────────────────────────────────────────────────┤
│ 4. AI PUJA COPILOT LAYER                                               │
│    • Powered by Agent Router (DeepSeek-V4 Flash)                       │
│    • Real-time tool retrieval: Pandals, Metro, Weather, Lalbazar Traffic│
│    • Strict anti-hallucination uncertainty reporting                   │
├────────────────────────────────────────────────────────────────────────┤
│ 5. FESTIVAL-MEMORY LAYER                                               │
│    • Collectible Digital Puja Passport Stamps with GPS verification    │
│    • Kolkata Gastronomy Trail (Nizam's, Aminia, Balaram Mullick)       │
│    • Multi-Ratio Social Share Studio (Story, Portrait, Square, OG)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Absolute Data Integrity (Zero-Fabrication Pledge)

PujaHop Kolkata strictly enforces these 5 non-negotiable standards across all routes, cards, and responses:

1. **Honest Unknown > Fake Certainty**  
   If special all-night circulars or pandal inaugurations are unannounced, they are explicitly marked as `NOT YET VERIFIED`. We never display fictional 24/7 schedules.
2. **Real Source > AI Guess**  
   Every pandal address, metro station, and traffic advisory is derived from authoritative public records (Kolkata Police Lalbazar, Metro Railway Kolkata, SAHAJ Portal).
3. **Real Route > Hardcoded Distance**  
   All walking times, distances, and paths are calculated dynamically via the Open Source Routing Machine (OSRM).
4. **Current Data > Old Static Data**  
   Date-aware operational modes distinguish **Pre-Puja (13–14 Oct)**, **Main Puja (15–20 Oct)**, and **Bijaya Dashami (21 Oct)**.
5. **Blocked API > Fake Success**  
   The API Health Center executes live HTTP probes (measuring latency and status) rather than displaying simulated `CONNECTED` badges.

---

## 🗺️ Real Cartography & Transit

- **Basemaps Engine:** CARTO Basemaps API key (`cb1_4er7_1_ff393df50298cdcd08cbc8cb`) applied to all raster and vector endpoints:
  - 🌙 **Dark Matter:** `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=...`
  - ☀️ **Voyager:** `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=...`
- **Metro Intelligence:** Real station coordinates and interchange logic for Blue Line (Dakshineswar - Kavi Subhash) and Green Line (Howrah Maidan - Sector V).
- **Route Consistency Assertion:** Displays strictly validate that `Displayed Pandal Count === Actual Itinerary Stops`. Food stops and photo moments never inflate the pandal counter.

---

## 🤖 AI Puja Copilot (Agent Router Gateway)

- **Provider:** Agent Router (`https://api.agentrouter.ai/v1`)
- **Default Model:** `deepseek/deepseek-v4-flash`
- **Tool Suite:**
  - `get_pandal_status`: Retrieves verified opening status, theme, and nearest metro.
  - `get_metro_schedule`: Fetches official schedule for selected date and line.
  - `get_traffic_advisories`: Returns date-filtered Kolkata Police traffic advisories.
  - `get_weather_forecast`: Provides time- and location-aware meteorological data.
- **Safety Directive:** The Copilot refuses to invent pandal opening times, crowd congestion, or special metro trains if absent from verified records.

---

## 📱 Social Campaign Creative Studio

Built-in export studio for sharing verified Puja itineraries and memories:
- **Instagram Story:** `9:16` (1080 × 1920)
- **Instagram Portrait:** `4:5` (1080 × 1350)
- **Square Post:** `1:1` (1080 × 1080)
- **OpenGraph Banner:** `1.91:1` (1200 × 630)
- **Themes:** *“আমার PujaHop Route”*, *“আমি আজ ৬টি পুজো ঘুরেছি”*, *“উত্তর কলকাতার ঐতিহ্য পুজো ট্রেইল”*, *“আমার ডিজিটাল পুজো পাসপোর্ট”*.
- **Attribution Watermark:** *Created & Conceptualized by Saswata Dey (Riik)*.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm / yarn / pnpm

### Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
# Carto Basemaps Key
NEXT_PUBLIC_CARTO_API_KEY=cb1_4er7_1_ff393df50298cdcd08cbc8cb

# Agent Router AI Key
AGENTROUTER_API_KEY=sk-kg8ve3KBHGvRZsc59bivGRi1jrfmlOvhyhkmrqVRHurdcxHi

# Supabase (Optional for local offline mode)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Installation & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run automated tests
node tests/run-all-tests.mjs

# Build production bundle
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) to experience PujaHop Kolkata.

---

## 🧪 Automated Test Suite

Run the full integrity suite with:
```bash
node tests/run-all-tests.mjs
```
Verifies:
- Canonical 2026 SAHAJ Puja Calendar (10–21 October) & Pre-Puja mode.
- 23 Official Kolkata Pandals (GPS, Bengali names, documented scoring methodology).
- Kolkata Metro reality & honest circular reporting.
- OSRM walking distance and polyline derivations.
- Kolkata Police traffic advisory filters.
- Strict Route Consistency (Zero count mismatches).
- Real CARTO Basemaps tile integration and API key injection.
- Agent Router AI Gateway connectivity.
- Source provenance registry and modal disclosures.
- 5-layer cultural architecture and high-resolution media crops.

---

## 📜 Legal & Credits

© 2026 **PujaHop Kolkata**  
**Created & Conceptualized by Saswata Dey (Riik)**  
*An independent cultural-tech experience.*
