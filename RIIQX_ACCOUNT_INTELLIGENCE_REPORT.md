# RIIQX — Multi-Account Intelligence Report
## Multi-Platform Architecture • Account Isolation • Granular Permissions & Credential Lifecycle

---

### 1. Unified Account Intelligence Model

RIIQX provides independent, isolated tracking for multiple accounts across supported social platforms, guaranteeing zero cross-contamination and zero double-counting.

Every registered account is governed by the `SocialAccountIntelligence` interface:

```typescript
export interface SocialAccountIntelligence {
  id: string;
  platform: 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  platformAccountId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  accountType: 'creator' | 'business' | 'personal' | 'channel' | 'page';
  connectionStatus: 'connected' | 'expired' | 'error' | 'revoked' | 'permission_required';
  authorizationStatus: 'valid' | 'refresh_needed' | 'expired';
  grantedScopes: string[];
  missingPermissions: string[];
  lastSyncAt: string;
  nextEligibleSyncAt: string;
  tokenExpiresAt?: string;
  isTokenExpired: boolean;
  historicalDataCoverageDays: number;
  metrics: Record<string, ProvenanceMetric>;
}
```

---

### 2. Connected Channel Roster & Capabilities

#### 1. `@riiqx` (YouTube Channel)
- **ID:** `acc_youtube_UCIMBMaomkNyX5uJjO9VVN1A`
- **Platform:** YouTube (Google OAuth 2.0)
- **Channel ID:** `UCIMBMaomkNyX5uJjO9VVN1A`
- **Scopes Granted:**
  - `https://www.googleapis.com/auth/youtube.readonly`
  - `https://www.googleapis.com/auth/youtube.upload`
  - `https://www.googleapis.com/auth/userinfo.profile`
- **Subscribers:** `2,900`
- **Channel Lifetime Views:** `1,718,200`
- **Video Count:** `373`
- **Token Health:** Automatic refresh via AES-256-GCM encrypted refresh token; 100% active.
- **Capabilities:**
  - Channel statistics (`subscribers`, `viewCount`, `videoCount`): **FULL ACCESS**
  - Recent uploads ingestion & video-level telemetry: **FULL ACCESS**
  - Video upload & scheduling: **FULL ACCESS**
  - Second-by-second retention curve: **Requires YouTube Analytics API scope**

#### 2. `@iam.riik` (Instagram Professional)
- **ID:** `acc_instagram_17841407056555088`
- **Platform:** Meta Graph API v26.0
- **Platform Account ID:** `17841407056555088`
- **Linked Facebook Page:** `Rik Gamer` (ID `108603637476395`)
- **Scopes Granted:**
  - `instagram_basic`
  - `instagram_content_publish`
- **Followers:** `1,335`
- **Media Count:** `677`
- **Token Health:** Valid 60-day long-lived access token expiring December 29, 2026.
- **Capabilities:**
  - Profile statistics (`followers_count`, `media_count`): **FULL ACCESS**
  - Recent media ingestion (`likes`, `comments`, `permalinks`, `captions`): **FULL ACCESS**
  - Reel & post publishing: **FULL ACCESS**
  - Account 28-day reach & impressions: **Requires `instagram_manage_insights` App Review**

#### 3. `@toptech24` (YouTube Channel)
- **ID:** `acc_youtube_UC7hgB_5FvrJpalDKTz3rUnw`
- **Platform:** YouTube (Google OAuth 2.0)
- **Subscribers:** `215`
- **Video Count:** `207`
- **Status:** Requires re-authorization via Integrations tab to renew refresh token.

---

### 3. Account-Level Isolation & Privacy Safeguards

1. **Cryptographic Credential Vault:**
   - Raw tokens are strictly isolated in `OAuthCredentialsRecord` and encrypted via hardware-accelerated AES-256-GCM before write.
   - Public account representations strip all ciphertext, IVs, and auth tags.
2. **Deterministic Aggregation:**
   - Consolidated views and followers sums only add non-null verified metrics.
   - Disconnected or expired accounts are never zeroed out; they are accurately marked as `AUTHENTICATION_REQUIRED` or `CACHED` with their last verified timestamp.

