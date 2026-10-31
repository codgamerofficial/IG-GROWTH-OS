# RIIQX — Social Media Analytics API Permissions Guide
## Meta Graph API v26.0 • YouTube Data API v3 • YouTube Analytics API • Scope Matrix & Troubleshooting

---

### 1. Meta Graph API v26.0 Permission Matrix

| Endpoint | Purpose | Required OAuth Permission | App Review Tier | Status in RIIQX |
|---|---|---|---|---|
| `/{ig-user-id}?fields=username,followers_count,media_count` | Profile handle, total followers, total media | `instagram_basic` | Standard Access | **GRANTED & ACTIVE** |
| `/{ig-user-id}/media?fields=...` | Historical media posts, captions, likes, comments | `instagram_basic` | Standard Access | **GRANTED & ACTIVE** |
| `/{ig-user-id}/media_publish` | Direct publishing of Reels & feed posts | `instagram_content_publish` | Standard Access | **GRANTED & ACTIVE** |
| `/{ig-user-id}/insights?metric=reach,impressions` | Account-level 28-day reach & impression telemetry | `instagram_manage_insights` | **Advanced Access (App Review)** | **PERMISSION_MISSING (Accurately Reported)** |
| `/{media-id}/insights?metric=reach,saved` | Media-level reach, saves, and video plays | `instagram_manage_insights` | **Advanced Access (App Review)** | **PERMISSION_MISSING (Accurately Reported)** |

#### Resolving Meta Error `(#10) Application does not have permission for this action`:
- **For Developers:**
  1. Go to [developers.facebook.com](https://developers.facebook.com/) $\rightarrow$ App Dashboard $\rightarrow$ Roles $\rightarrow$ Roles $\rightarrow$ Add Instagram account (`@iam.riik`) as an **Instagram Tester**.
  2. Accept the tester invitation in Instagram mobile app under **Settings $\rightarrow$ Creator $\rightarrow$ Website Permissions $\rightarrow$ Apps and Websites $\rightarrow$ Tester Invitations**.
  3. In RIIQX Integrations tab, disconnect and reconnect Instagram to generate an access token with `instagram_manage_insights`.
- **For Production Users:**
  1. Submit the Meta App for App Review for the `instagram_manage_insights` permission with screencast demonstration.

---

### 2. Google & YouTube API Permission Matrix

| Endpoint | Purpose | Required OAuth Scope | Verification Tier | Status in RIIQX |
|---|---|---|---|---|
| `/channels?part=snippet,statistics&mine=true` | Channel title, custom URL, subscribers, total views, video count | `.../auth/youtube.readonly` | Sensitive Scope | **GRANTED & ACTIVE** |
| `/playlistItems?part=snippet,contentDetails` | Ingest recent video uploads and Short details | `.../auth/youtube.readonly` | Sensitive Scope | **GRANTED & ACTIVE** |
| `/videos?part=statistics,contentDetails` | Video views, likes, comment counts, ISO duration | `.../auth/youtube.readonly` | Sensitive Scope | **GRANTED & ACTIVE** |
| `/videos (insert)` | Direct upload of YouTube Shorts & videos | `.../auth/youtube.upload` | Sensitive Scope | **GRANTED & ACTIVE** |
| `/reports (YouTube Analytics API)` | Second-by-second audience retention drop-off curves | `.../auth/yt-analytics.readonly` | Restricted Scope + Channel Partner | **NOT_AVAILABLE (Accurately Reported)** |

#### Resolving YouTube `AUTHENTICATION_REQUIRED`:
- **Automatic Resolution:** Google OAuth access tokens expire after 1 hour (3,600s). RIIQX now automatically calls `https://oauth2.googleapis.com/token` with the decrypted refresh token when an access token is expired, keeping the channel in active sync without user intervention.
- **Manual Reauthorization:** If a refresh token is revoked by the user in their Google Account security settings, RIIQX displays `REAUTH NEEDED` with a direct link to the Integrations tab.

---

### 3. Strict Permission Error Taxonomy in RIIQX

RIIQX handles ungranted or restricted permissions cleanly without ever substituting mock data:

```
State 1: VERIFIED                -> Telemetry directly retrieved and authenticated from API
State 2: PERMISSION_MISSING      -> Scope not granted (e.g. instagram_manage_insights); shows exact action needed
State 3: AUTHENTICATION_REQUIRED -> Access token expired and no valid refresh token exists
State 4: NOT_AVAILABLE           -> API does not support this metric for the connected account tier
```

