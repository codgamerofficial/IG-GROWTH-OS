# 📸 Meta / Instagram API Setup Guide for IG GrowthOS

This guide explains how to connect your **Meta Developer App** and **Instagram Professional Account** to **IG GrowthOS** for brand **RIIQX**.

---

## 1. Prerequisites

1. An **Instagram Professional Account** (Business or Creator account).
   - Personal accounts are **not supported** by Meta Graph API.
2. A **Facebook Page** linked to the Instagram Professional account.
3. A **Meta for Developers** account ([developers.facebook.com](https://developers.facebook.com)).

---

## 2. Create and Configure Meta Developer App

### Step 1: Create Business App
1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps).
2. Click **Create App** and select **Other** → **Business** as the app type.
3. Name your app (e.g., `IG GrowthOS - RIIQX`) and enter your contact email.

### Step 2: Add Products
In the App Dashboard, add the following products:
- **Instagram Graph API**
- **Facebook Login for Business**

### Step 3: Configure Facebook Login Settings
1. Navigate to **Facebook Login** → **Settings**.
2. Add your OAuth Redirect URIs:
   - For local development: `http://localhost:3000/api/instagram/callback`
   - For production: `https://your-domain.com/api/instagram/callback`
3. Save changes.

---

## 3. Required Permissions

When authorizing IG GrowthOS, the following permissions are requested:

| Permission | Purpose |
| :--- | :--- |
| `instagram_basic` | Retrieve Instagram profile, username, and media list |
| `instagram_content_publish` | Create media containers and publish Reels/Posts |
| `instagram_manage_insights` | Access reach, impressions, saves, shares, and metrics |
| `instagram_manage_comments` | Read and monitor audience engagement and comments |
| `pages_show_list` | Discover Facebook Pages linked to the Instagram account |
| `pages_read_engagement` | Verify page management permissions |

---

## 4. Environment Variables Configuration

Add your Meta credentials to `.env.local` or production settings:

```env
# Meta Developer App
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=http://localhost:3000/api/instagram/callback

# Optional Direct Token (for testing without OAuth redirect)
INSTAGRAM_ACCESS_TOKEN=your_long_lived_user_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_id
```

---

## 5. Connecting Your Account in IG GrowthOS

1. Open **IG GrowthOS** and click **Instagram Connection** in the sidebar.
2. Click **Connect Professional Account**.
3. Log in with your Facebook credentials and grant the requested permissions.
4. Select the Facebook Page connected to **RIIQX** (`@riiqx.official`).
5. IG GrowthOS will securely verify the token, fetch your profile metadata, and display `● Connected`.

---

## 6. Official Meta API Limitations & Publishing Rules

1. **Reel Video Specs**:
   - Aspect Ratio: **9:16** (recommended: 1080×1920)
   - Duration: Between 3 seconds and 15 minutes
   - Video Codec: H.264 or HEVC, Audio: AAC
2. **Publishing Rate Limits**:
   - Meta limits accounts to 50 published posts per rolling 24-hour window.
3. **Safety Gate (Section 28)**:
   - Content item must have `approval_status === 'APPROVED'` before publishing.
   - Autonomous publishing is disabled by default (`AUTONOMOUS_PUBLISHING=false`).
