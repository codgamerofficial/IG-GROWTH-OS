# RIIQX — Service Capability & Provider Matrix
**Date**: November 5, 2026  
**Project**: RIIQX Commerce Intelligence & AI Creator Ecosystem  
**Architecture Principle**: Multi-Provider Redundancy • Zero Single Point of Failure • Strict Fallbacks

---

## 1. Provider & Capability Overview

RIIQX operates as an autonomous, multi-engine platform where each business capability is backed by a primary tier provider and at least one automatic fallback adapter:

| Business Capability | Primary Service / Model | Tier 1 Fast Fallback | Tier 2 Global Fallback | Local / Offline Capability |
| :--- | :--- | :--- | :--- | :--- |
| **Product Screenshot OCR & Vision** | Google Gemini 2.5 Flash Lite | Google Gemini 2.5 Flash | NVIDIA NIM Vision | Local Sharp / Preprocessing |
| **Product URL Parsing & Resolver** | Internal Canonical Engine | Headless Metadata Resolver | Verified Manual Review | Cache / Pinned Catalog |
| **Exact Product Identity Matcher** | Cohere Embed v3 + Cosine Sim | Gemini 2.5 Flash Lite | Groq GPT-OSS 120B | Exact SKU / Barcode Match |
| **Price Arbitrage & Savings Engine** | RIIQX Deterministic Engine | Rule-based Offer Stacker | Stored Historical Matrix | In-Memory Stacking Calculator |
| **Gift Card Catalog & Purchase** | Authorized Partner API | Direct Merchant Gift API | Stored Vault Inventory | Secure Manual Delivery |
| **Dropshipping Supplier Management** | Supplier Webhook / REST API | CSV Batch Ingestion | Admin Verified Catalog | Local SQLite / JSON Cache |
| **AI Video Creative Director** | Remotion + HyperFrames | FFmpeg Multi-Stream Render | Canvas Storyboard Bridge | Local Windows FFmpeg Executable |
| **Video Audio Transcription** | OpenAI Whisper (Local C++) | Groq Whisper Large v3 | Google Gemini Speech | Local Python Whisper v2026 |
| **Video Motion Graphics Generation** | HyperFrames v0.9.13 | Remotion React Canvas | SVG Vector Canvas | Local Remotion Player |
| **Social Media Autopilot** | Meta Graph API v21 (IG/FB) | YouTube Data API v3 | Threads Graph API | Supabase Publishing Queue |
| **Primary Database & Auth** | Supabase Cloud (PostgreSQL) | Connection Pooler (PgBouncer)| Supabase Local Docker | Electron Local Cache |
| **Encrypted Token Vault** | AES-256-GCM TokenVault | Supabase RLS Scoped Vault | Environment Key Encryptor| In-Memory Session Storage |

---

## 2. Capability Details & Fallback Cascades

### A. Smart Price Intelligence & Screenshot Analysis
```
User Uploads Screenshot / Product URL
                │
                ▼
      Image Validation & SSRF Guard
                │
                ▼
    [Primary] Gemini 2.5 Flash Lite
   (Extracts: Title, Brand, Model, Displayed Price, MRP, Variant)
                │
         (If Rate Limited)
                ▼
    [Fallback 1] Gemini 2.5 Flash
                │
         (If Rate Limited)
                ▼
    [Fallback 2] Groq Vision / Local OCR
                │
                ▼
    Zod Structured Schema Output:
    { brand, model, color, storage, price, confidence }
```

### B. Product Matching & Price Comparison Matrix
To prevent false matches (e.g. confusing a 128GB phone with a 256GB phone), the Product Matching Engine computes a composite confidence score:
1. **Barcode / GTIN / ASIN Match**: 100% confidence.
2. **Model Number + Variant Exact Match**: 95% confidence.
3. **Normalized Title + Specification Embeddings**:
   - `Similarity >= 0.92`: Exact Match.
   - `0.80 <= Similarity < 0.92`: Variant Match.
   - `0.65 <= Similarity < 0.80`: Similar Alternative.
   - `< 0.65`: Unverified Match.

### C. Discount Stacking & Effective Net Cost Formula
Offers must be evaluated strictly in order of financial precedence:
```
1. Base Selling Price (Verified Platform Price)
2. Less: Verified Instant Product Discount
3. Less: Stackable Coupon Code (Verified against Minimum Spend)
4. Less: Payment / Bank Card Instant Discount (Check BIN & Maximum Cap)
5. Less: Authorized Gift Card Purchase Savings (Face Value vs Discounted Purchase Price)
6. Plus: Verified Delivery & Fulfillment Surcharge
---------------------------------------------------------------------------------
= Final Payable Amount at Checkout (Immediate Out-of-Pocket Expense)
7. Less: Future Cashback (Credited 30-90 days post-return window)
---------------------------------------------------------------------------------
= Effective Net Cost
```

### D. AI Creator Studio Video Production Pipeline
```
[References/] 5 Curated MP4 Reference Reels
                │
                ▼ (1-fps Frame Extraction via Local FFmpeg)
     Visual Style & Typography Extraction
                │
                ▼ (multimodal style evaluation)
   [Brand Kit] Brand Kit/brand-kit.md Updated
                │
[Raw/[Project Name]] A-Roll & Product Video Assets
                │
                ▼ (OpenAI Whisper Audio Transcription)
      Beat Detection & Pacing Strip
                │
                ▼
     Storyboard Dashboard (Approve / Reject / Feedback)
                │
                ▼ (User feedback saved to notes.json)
    Motion Graphics Synthesis (HyperFrames & Remotion)
                │
                ▼ (FFmpeg Multi-Stream Compositing: 1080x1920 @ 60fps)
   [Exports/] Final Master MP4 Rendered & FFprobe Validated
```

---

## 3. Platform Client Architecture Matrix

| Capability | RIIQX Web App (`http://localhost:3001`) | RIIQX Windows Desktop (Electron) | RIIQX Native Android (Capacitor) |
| :--- | :--- | :--- | :--- |
| **Authentication** | Supabase Cookie Session | Supabase Stored Session | Supabase Native Biometric Token |
| **Screenshot Input** | Web Drag-and-Drop / File Input | Desktop Screen Grab / Drag-Drop | Native Camera / Gallery Picker |
| **URL Analysis** | Clipboard Paste / Input Form | Global Hotkey Clipboard Watcher | Android Native Share Intent |
| **Video Editing** | Remotion Web Player Preview | Local Native FFmpeg Acceleration | Mobile Storyboard Review / Approval |
| **File Storage** | Cloud Storage & Signed URLs | Local Drive (`AI Video Editor/`) | Mobile Sandboxed App Storage |
| **Push Alerts** | Web Push / Service Workers | Windows Native Toast Notifications| FCM Native Push Notifications |
| **Gift Card Delivery** | In-App Reveal & Copy Code | Windows Clipboard & Secure Vault | Mobile Wallet Card & One-Tap Copy |
| **Supplier Portal** | Web Dropshipping Dashboard | Desktop Bulk CSV / Inventory Sync| Mobile Order Alert & Quick Dispatch|

