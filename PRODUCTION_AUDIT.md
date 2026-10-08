# PujaHop Kolkata — Production Reality Audit (Phase 1)
**Date:** 09 October 2026  
**Auditor:** Antigravity Production Reality Engine  
**Product:** PujaHop Kolkata — One Day. One City. Maximum Puja.  
**Repository State:** Pre-Fix Baseline Audit

---

## Executive Summary

PujaHop Kolkata is designed as a real-time, real-world travel companion and route optimization tool for Kolkata Durga Puja. The application possesses a strong visual foundation and production-ready design language. However, a strict production audit reveals critical gaps between **real verified data** and **hardcoded optimistic placeholders**.

This audit details all fabricated data, static assumptions, route counting discrepancies, and unverified timetable claims discovered across the frontend and backend, establishing a clear rectification plan.

---

## 1. Inventory & Architecture Overview

| Layer | Implementation | Status / Issues Identified |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14.2 (App Router), React 18, Tailwind CSS | Healthy, high aesthetic dark theme |
| **State Management** | `PujaHopContext.tsx` | Defaults to hardcoded `2026-10-18`; date selector displayed truncated `10-18 • Maha` |
| **Backend & APIs** | Next.js Route Handlers (`/api/*`) | Working, but several endpoints return hardcoded synthetic fields |
| **Database & Persistence** | Supabase PostgreSQL (`ojtngzqsrdralrhipjzt`) + Memory Store | Schema exists; repository had in-memory defaults with static confidence numbers |
| **AI Layer** | Agent Router (`deepseek-v4-flash` on `agentrouter.org`) | Primary gateway connected; needs strict grounding with verified pandal sources |
| **Routing Engine** | OSRM Foot Routing (`router.project-osrm.org`) | Real routing active; summary metrics occasionally out of sync with actual stops |
| **Weather Engine** | Open-Meteo API (`api.open-meteo.com`) | Real API call exists; lacked date-awareness (showed current live weather for future dates) |
| **Metro Engine** | `kolkata-metro.ts` | Contained unverified "24/7 All-Night" claims without official published circular confirmation |
| **Traffic Engine** | `kolkata-traffic.ts` | Restrictions lacked date/time validity ranges; Gariahat corridor showed as permanent |

---

## 2. Scan for Fabricated, Placeholder & Hardcoded Data

### A. Metro Intelligence (`kolkata-metro.ts`)
- **Issue:** Claimed "24/7 All-Night Puja Service" with "12-minute headway" and "Last train 05:00" across all main puja nights without official circular confirmation.
- **Reality:** While Kolkata Metro historically operates special night trains during Saptami-Navami, future 2026 schedules must be marked **`SPECIAL SERVICE NOT VERIFIED`** until verified against official circulars from Kolkata Metro Railway (Ministry of Railways). Normal timetables must be explicitly separated from festival circulars.

### B. Arbitrary Scores (`kolkata-pandals.ts`)
- **Issue:** Found scores like `overall_score: 9.6`, `art_score: 9.6`, `photo_score: 9.6` across Bagbazar, Ekdalia, Sreebhumi, etc.
- **Reality:** Arbitrary decimal ratings without documented rubric create a false sense of precision. Must be replaced with a documented multi-factor methodology:
  1. Traditional Heritage (1–10)
  2. Art & Craft (1–10)
  3. Photography (1–10)
  4. Accessibility (1–10)
  5. Transit Accessibility (1–10)
  6. Crowd Suitability (1–10)
  7. Data Confidence Score

### C. Date Engine & Pre-Puja Mode (`kolkata-calendar.ts`, `Header.tsx`)
- **Issue:** The top header displayed static string `10-18 • Maha`.
- **Issue:** 13 and 14 October were not clearly distinguished under official Government of West Bengal SAHAJ Puja calendar.
- **Reality:** Official WB SAHAJ Calendar:
  - 10 Oct: Mahalaya
  - 13–14 Oct: Pre-Puja (Early inaugurations / previews)
  - 15 Oct: Maha Chaturthi
  - 16 Oct: Maha Panchami
  - 17 Oct: Maha Shashthi
  - 18 Oct: Maha Saptami
  - 19 Oct: Maha Ashtami
  - 20 Oct: Maha Navami
  - 21 Oct: Vijaya Dashami
- **Requirement:** Default trip date must be **14 October 2026 (Pre-Puja)**. Header must dynamically show actual date (e.g. `14 OCT • Wednesday • Pre-Puja`).

### D. Route Summary vs Itinerary Discrepancies (`RouteView.tsx`, `optimizer.ts`)
- **Issue:** Food stops and starting locations were occasionally counted in total pandal stops.
- **Issue:** Displayed `100% Verified` badge across routes without independent verification of all stops.
- **Reality:** Route assertions must guarantee `total_pandals === itinerary.filter(type === 'PANDAL').length`. Food stops must be optional and categorized distinctly.

### E. Map Projection (`MapView.tsx`)
- **Issue:** MapView used a stylized 2D projection and SVG river representation rather than true OpenStreetMap / CartoDB Dark Matter tiles.
- **Reality:** Must utilize real Leaflet / OpenStreetMap tiles with authentic GIS coordinates for pandals, metro gates, and walking tracks.

### F. Weather Date-Awareness (`HomeScreen.tsx`, `service.ts`)
- **Issue:** Current weather was displayed indiscriminately, even when viewing future trip dates (e.g. 18 Oct).
- **Issue:** Fallback hardcoded string: `'28.5°C • Autumn Breeze'`.
- **Reality:** Must show `CURRENT WEATHER (09 Oct)` vs `FORECAST FOR SELECTED DATE (e.g. 14 Oct)` using real Open-Meteo daily forecast variables.

### G. Source Provenance Missing on Critical Claims
- **Issue:** Pandals and traffic notices lacked standardized source badges.
- **Reality:** Every claim must carry a provenance tag:
  - `OFFICIAL_GOVT` (SAHAJ Portal, WB Tourism)
  - `POLICE_CIRCULAR` (Kolkata Police Traffic Department)
  - `METRO_OFFICIAL` (Kolkata Metro Railway)
  - `PUJA_COMMITTEE` (Official Committee Press Release)
  - `VERIFIED_DIRECTORY` (Street-level verified directory)
  - `UNVERIFIED` (Community submission / awaiting verification)

---

## 3. P0 Fix Roadmap

1. **Canonical Date Engine:** Implement `PujaCalendarService` reflecting SAHAJ 2026 dates, date-aware selector in `Header.tsx`, dynamic day/tithi display, default to 14 Oct Pre-Puja.
2. **Kolkata Metro Reality Fix:** Build `MetroServiceStatus` with verified timetables, remove unverified 24/7 assertions, show `SPECIAL SERVICE NOT VERIFIED` with last verified timestamp.
3. **Pandal Data Integrity & Pre-Puja Mode:** Define granular opening statuses (`OPEN`, `EARLY OPENING`, `INAUGURATION`, `UNDER PREPARATION`, `UNKNOWN`, `CLOSED`) with source URLs and validity dates.
4. **Documented Scoring Engine:** Replace arbitrary ratings with the 6-factor methodology and display Data Confidence.
5. **Route Engine Consistency & Strict Assertions:** Ensure summary matches stops exactly; prevent food or start stops from inflating pandal count.
6. **Real Interactive Map Engine:** Integrate Leaflet with OpenStreetMap / CartoDB dark tiles, real road networks, and OSRM walking routes.
7. **API Health Center:** Enforce real HTTP test execution with status levels (`CONFIGURED`, `REACHABLE`, `AUTHENTICATED`, `TESTED`, `VERIFIED`, `DEGRADED`, `BLOCKED`).
8. **Reusable Source Provenance Badge:** Implement `SourceBadge` across all views.
