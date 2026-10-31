# RIIQX Social Publishing & Scheduling Engine Report
## Meta Graph API v26.0, YouTube Data API v3, and Human-in-the-Loop Safety

---

## 1. Supported Publishing Channels & Scope Matrix

| Platform | Official API Endpoint | Required Scopes | Media Formats Supported |
|---|---|---|---|
| **Instagram Reels** | Meta Graph API v26.0 (`/{ig-user-id}/media`) | `instagram_basic`, `instagram_content_publish` | 9:16 MP4/MOV, H.264/AAC, Max 60s |
| **Facebook Pages** | Meta Graph API v26.0 (`/{page-id}/videos`) | `pages_show_list`, `pages_manage_posts` | MP4, MOV, Landscape & Vertical |
| **YouTube Shorts** | YouTube Data API v3 (`/videos?part=snippet,status`) | `youtube.upload`, `youtube.readonly` | MP4, WebM, MOV, Vertical <= 60s |

---

## 2. Meta OAuth v26.0 Integration & Account Linking

### Account Requirement:
Meta Graph API strictly requires that the destination Instagram account be an **Instagram Professional (Creator or Business)** account and that it is linked to an authorized **Facebook Page** (e.g. `MVF Official`).

### Resilient Discovery Architecture:
1. Queries `/me/accounts?fields=id,name,access_token,instagram_business_account,connected_instagram_account`.
2. For any page where the user-level token does not expand the business account, the engine probes the page directly using that Page's own **Page Access Token** (`GET /{page-id}?access_token={page_token}`).
3. Falls back to querying `/me?fields=instagram_accounts`.

---

## 3. Human-in-the-Loop Safety Brake

Automatic publishing is governed by a mandatory creator approval gate:
- No video or reel is published autonomously without explicit human verification.
- In the Autopilot & Task Planner workspaces, social dispatch steps trigger an amber **Approve & Dispatch** confirmation banner.
- Users can review the rendered 9:16 playable video, edit captions, and verify scheduled time before release.

