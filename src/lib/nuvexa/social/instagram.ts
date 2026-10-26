// =============================================================================
// NUVEXA AI — Official Instagram Reels Graph API Adapter
// Meta Graph API v20.0 • Container Creation • Status Polling • Publishing
// =============================================================================

export interface InstagramPublishRequest {
  videoUrl: string;
  caption: string;
  coverUrl?: string;
  shareToFeed?: boolean;
}

export interface InstagramPublishResult {
  success: boolean;
  mediaId?: string;
  permalink?: string;
  status: 'published' | 'processing' | 'failed' | 'unconfigured';
  errorMessage?: string;
}

const META_GRAPH_VERSION = 'v20.0';
const IG_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const IG_ACCOUNT_ID =
  process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || process.env.INSTAGRAM_ACCOUNT_ID || '';

export interface InstagramAccountStatus {
  isConfigured: boolean;
  isValid: boolean;
  accountId?: string;
  username?: string;
  followersCount?: number;
  mediaCount?: number;
  errorMessage?: string;
}

/**
 * Real-time probe of Instagram Graph API account health & token validity
 */
export async function getInstagramAccountStatus(): Promise<InstagramAccountStatus> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || '';
  const accountId =
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || process.env.INSTAGRAM_ACCOUNT_ID || '';

  if (!token || !accountId) {
    return {
      isConfigured: false,
      isValid: false,
      errorMessage: 'Instagram credentials not configured in environment (.env.local)',
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${accountId}?fields=id,name,username,followers_count,media_count&access_token=${token}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    if (!res.ok || data.error) {
      return {
        isConfigured: true,
        isValid: false,
        accountId,
        errorMessage: data.error?.message || 'Instagram access token invalid or expired.',
      };
    }

    return {
      isConfigured: true,
      isValid: true,
      accountId,
      username: data.username || data.name,
      followersCount: data.followers_count,
      mediaCount: data.media_count,
    };
  } catch (err: unknown) {
    return {
      isConfigured: true,
      isValid: false,
      accountId,
      errorMessage: err instanceof Error ? err.message : 'Network error probing Meta Graph API',
    };
  }
}

/**
 * Publish a vertical video to Instagram Reels via the official Meta Graph API
 */
export async function publishInstagramReel(
  req: InstagramPublishRequest
): Promise<InstagramPublishResult> {
  // Check if credentials exist
  if (!IG_ACCESS_TOKEN || !IG_ACCOUNT_ID) {
    return {
      success: false,
      status: 'unconfigured',
      errorMessage:
        'Instagram API credentials missing. Configure INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ACCOUNT_ID in environment settings to enable live publishing.',
    };
  }

  try {
    // 1. Initialize Reel Media Container
    const containerUrl = `https://graph.facebook.com/${META_GRAPH_VERSION}/${IG_ACCOUNT_ID}/media`;
    const containerParams = new URLSearchParams({
      media_type: 'REELS',
      video_url: req.videoUrl,
      caption: req.caption,
      share_to_feed: String(req.shareToFeed ?? true),
      access_token: IG_ACCESS_TOKEN,
    });

    const initRes = await fetch(`${containerUrl}?${containerParams.toString()}`, {
      method: 'POST',
    });

    const initData = await initRes.json();
    if (!initRes.ok || !initData.id) {
      return {
        success: false,
        status: 'failed',
        errorMessage: initData.error?.message || 'Failed to initialize Reels container with Meta Graph API',
      };
    }

    const containerId = initData.id;

    // 2. Poll Container Status (wait for processing)
    let isReady = false;
    let attempts = 0;
    while (!isReady && attempts < 8) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes = await fetch(
        `https://graph.facebook.com/${META_GRAPH_VERSION}/${containerId}?fields=status_code&access_token=${IG_ACCESS_TOKEN}`
      );
      const statusData = await statusRes.json();

      if (statusData.status_code === 'FINISHED') {
        isReady = true;
      } else if (statusData.status_code === 'ERROR') {
        return {
          success: false,
          status: 'failed',
          errorMessage: 'Meta video processing failed during ingestion.',
        };
      }
      attempts++;
    }

    if (!isReady) {
      return {
        success: false,
        status: 'processing',
        mediaId: containerId,
        errorMessage: 'Video container is still processing on Instagram. Will finalize asynchronously.',
      };
    }

    // 3. Publish the Container
    const publishUrl = `https://graph.facebook.com/${META_GRAPH_VERSION}/${IG_ACCOUNT_ID}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        creation_id: containerId,
        access_token: IG_ACCESS_TOKEN,
      }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok || !publishData.id) {
      return {
        success: false,
        status: 'failed',
        errorMessage: publishData.error?.message || 'Publication step failed on Instagram.',
      };
    }

    return {
      success: true,
      status: 'published',
      mediaId: publishData.id,
      permalink: `https://www.instagram.com/reel/${publishData.id}`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      success: false,
      status: 'failed',
      errorMessage: `Instagram Graph API network error: ${errorMsg}`,
    };
  }
}
