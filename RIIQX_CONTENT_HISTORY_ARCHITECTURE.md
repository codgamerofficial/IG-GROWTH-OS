# RIIQX — Content History Architecture
## Universal Content Ingestion • Unified Schema • Video & Short Classification • Metadata Indexing

---

### 1. Ingestion Pipeline & Unified Schema

The Content Intelligence layer synchronizes every known piece of content associated with connected channels into a standardized, indexed structure:

```typescript
export interface ContentIntelligenceItem {
  id: string;                               // Unique RIIQX internal ID (e.g. yt_vidId, ig_mediaId)
  platform: 'youtube' | 'instagram' | ...;
  accountId: string;                        // Foreign key to connected_accounts
  accountHandle: string;                    // Handle at time of sync (@riiqx, @iam.riik)
  contentId: string;                        // Platform native ID
  contentType: 'reel' | 'short' | 'video' | 'post' | 'carousel';
  title?: string;                           // YouTube title or top line of caption
  caption?: string;                         // Instagram caption or full description
  hashtags: string[];                       // Extracted regex tags (#durgapuja, #reels)
  publishedAt: string;                      // ISO 8601 publication timestamp
  permalink: string;                        // Direct public URL to content
  thumbnailUrl?: string;                    // Medium-resolution preview image
  mediaUrl?: string;                        // Direct media URL if accessible
  durationSeconds?: number;                 // Video length in seconds
  durationFormatted?: string;               // e.g. "0:25", "1:53"
  views: number | null;                     // Genuine view count
  likes: number | null;                     // Authentic like count
  comments: number | null;                  // Authentic comment count
  shares: number | null;
  saves: number | null;
  engagementRate: number | null;            // (likes + comments) / views or followers
  sourceProjectId?: string;                 // Linked RIIQX creator project if edited in app
  lastSyncedAt: string;
}
```

---

### 2. Format Classification Heuristics

Short-form video feeds on YouTube and Instagram have distinct algorithmic properties:

1. **YouTube Shorts vs. Standard Videos:**
   - Evaluated via `parseISO8601Duration()` against the ISO 8601 duration string (e.g., `PT9S`, `PT50S`, `PT1M53S`).
   - If `durationSeconds > 0 && durationSeconds <= 60`, the content is classified as `short`.
   - If `durationSeconds > 60`, it is classified as `video`.
2. **Instagram Reels vs. Posts:**
   - Evaluated via Meta Graph API `media_type`.
   - `VIDEO` $\rightarrow$ `reel`
   - `CAROUSEL_ALBUM` $\rightarrow$ `carousel`
   - `IMAGE` $\rightarrow$ `post`

---

### 3. Ingested Content Inventory (Sample of Authenticated Records)

| Platform | Native ID | Title / Caption Snippet | Format | Duration | Views | Likes | Comments | Published Date |
|---|---|---|---|---|---|---|---|---|
| **YouTube** | `gyzizgCC_0E` | Aura of Bengali Food | **Short** | 9s | 43 | 0 | 0 | 2026-09-17 |
| **YouTube** | `YaSJ96dC60A` | Popular Indian Recipe | **Short** | 9s | 159 | 0 | 0 | 2026-09-17 |
| **YouTube** | `lBoXIIEXzJc` | green chilli chicken recipe in Bengali | **Short** | 50s | 29 | 2 | 0 | 2026-09-10 |
| **YouTube** | `ytBtTykrMeE` | Chirer polau #poha #chirerpolao | **Short** | 25s | 26 | 1 | 0 | 2026-09-10 |
| **YouTube** | `ro4gwXlSa3A` | Best Chicken Chap Roast 🤤 | **Video** | 1m 53s | 17 | 0 | 0 | 2026-09-10 |
| **Instagram** | `18036509090847479` | "Tomar favourite pandal kon ta?..." | **Reel** | — | — | 21 | 0 | 2026-10-27 |
| **Instagram** | `18117729413106946` | ✨ আলো, ঢাক আর মা দুর্গার টান… ❤️🔱 | **Reel** | 26s | — | 28 | 0 | 2026-10-22 |
| **Instagram** | `18198937972386832` | Aacha Bochor Abar Hbe 🌸❤️ | **Post** | — | — | 32 | 0 | 2026-10-21 |
| **Instagram** | `17965847765980348` | Pujo magic hits different. ❤️‍🔥🥁✨ | **Reel** | — | — | 32 | 0 | 2026-10-17 |
| **Instagram** | `18398277334204846` | You've never been seen like this one🔥 | **Reel** | 24s | — | 31 | 1 | 2026-10-16 |

---

### 4. Storage & Persistence Safeguards

1. **Duplicate Prevention:**
   - Content items are indexed by `platform_contentId`. Upserts update views, likes, and comments without creating redundant rows.
2. **Local & Cloud Mirroring:**
   - Synchronized items write to `%TEMP%/riiqx/social_content_history.json` and mirror to Supabase PostgreSQL when database credentials are active.
3. **Inaccessible Content Transparency:**
   - Deleted, private, or archived items that return 404 from platform APIs are flagged as `UNAVAILABLE` rather than generating ghost estimates.

