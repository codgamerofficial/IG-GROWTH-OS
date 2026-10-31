// =============================================================================
// RIIQX — Master Social Media Publishing Engine
// YouTube Shorts • Meta Graph API Reels & FB • X/Twitter API v2 • LinkedIn UGC
// Idempotency Protection • Auto Token Refresh • Post Scheduling & State Tracking
// =============================================================================

import { getSafeTempFilePath, safeReadJson, safeWriteJson } from '@/lib/riiqx/temp-storage';
import {
  getAccountWithCredentials,
  updateAccountStatus,
  logSocialAudit,
  ConnectedAccountRecord,
} from './account-repository';
import {
  refreshYouTubeAccessToken,
  refreshXAccessToken,
  refreshLinkedInAccessToken,
} from './oauth-engine';
import { getServiceSupabase } from '@/lib/supabase/server';

export type PublishPlatform =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'twitter'
  | 'linkedin';

export interface PublishProjectParams {
  userId: string;
  projectId?: string;
  accountId: string;
  platform: PublishPlatform;
  title: string;
  caption: string;
  mediaUrl: string;
  idempotencyKey?: string;
  scheduledFor?: string;
}

export interface PublishResult {
  success: boolean;
  jobId: string;
  platform: string;
  status: 'published' | 'processing' | 'failed' | 'queued';
  platformMediaId?: string;
  platformPermalink?: string;
  errorMessage?: string;
}

export interface ScheduledPostRecord {
  id: string;
  user_id: string;
  project_id?: string;
  connected_account_id: string;
  platform: PublishPlatform;
  title: string;
  caption: string;
  media_url: string;
  idempotency_key: string;
  status: 'queued' | 'uploading' | 'processing' | 'published' | 'failed' | 'cancelled';
  scheduled_for: string;
  platform_media_id?: string;
  platform_permalink?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// In-memory or fallback cache for idempotency tracking
const processedIdempotencyKeys = new Map<string, PublishResult>();

// Local fallback store for scheduled posts when Supabase is offline
const SCHEDULED_STORE_PATH = getSafeTempFilePath('scheduled_posts_store.json');
let inMemoryScheduledStore: ScheduledPostRecord[] = [];

function readScheduledStore(): ScheduledPostRecord[] {
  const disk = safeReadJson<ScheduledPostRecord[]>(SCHEDULED_STORE_PATH, []);
  if (disk.length > 0) return disk;
  return inMemoryScheduledStore;
}

function writeScheduledStore(posts: ScheduledPostRecord[]): void {
  inMemoryScheduledStore = posts;
  safeWriteJson(SCHEDULED_STORE_PATH, posts);
}

/**
 * Schedules a post for future automated release
 */
export async function scheduleSocialPost(params: PublishProjectParams): Promise<ScheduledPostRecord> {
  const jobId =
    params.idempotencyKey ||
    `sched_${params.platform}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const scheduledTime = params.scheduledFor || now;

  const jobRecord: ScheduledPostRecord = {
    id: jobId,
    user_id: params.userId,
    project_id: params.projectId,
    connected_account_id: params.accountId,
    platform: params.platform,
    title: params.title,
    caption: params.caption,
    media_url: params.mediaUrl,
    idempotency_key: jobId,
    status: 'queued',
    scheduled_for: scheduledTime,
    created_at: now,
    updated_at: now,
  };

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await (supabase as any).from('social_publishing_jobs').insert({
        user_id: jobRecord.user_id,
        project_id: jobRecord.project_id,
        connected_account_id: jobRecord.connected_account_id,
        platform: jobRecord.platform,
        title: jobRecord.title,
        caption: jobRecord.caption,
        media_url: jobRecord.media_url,
        idempotency_key: jobRecord.idempotency_key,
        status: jobRecord.status,
        scheduled_for: jobRecord.scheduled_for,
      });
    } catch {
      // Fall through to local store
    }
  }

  const store = readScheduledStore();
  const existingIdx = store.findIndex((p) => p.idempotency_key === jobId);
  if (existingIdx >= 0) {
    store[existingIdx] = jobRecord;
  } else {
    store.unshift(jobRecord);
  }
  writeScheduledStore(store);

  await logSocialAudit({
    userId: params.userId,
    action: 'post_scheduled',
    provider: params.platform,
    accountId: params.accountId,
    details: {
      jobId,
      scheduledFor: scheduledTime,
      title: params.title,
    },
  });

  return jobRecord;
}

/**
 * Retrieves all scheduled posts for a user
 */
export async function getScheduledPosts(userId: string): Promise<ScheduledPostRecord[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from('social_publishing_jobs')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_for', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data as ScheduledPostRecord[];
      }
    } catch {
      // Fall through to local store
    }
  }

  const store = readScheduledStore();
  return store
    .filter((p) => p.user_id === userId)
    .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime());
}

/**
 * Cancels a scheduled post
 */
export async function cancelScheduledPost(jobId: string, userId: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await (supabase as any)
        .from('social_publishing_jobs')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', jobId)
        .eq('user_id', userId);
    } catch {
      // Fall through
    }
  }

  const store = readScheduledStore();
  const target = store.find((p) => (p.id === jobId || p.idempotency_key === jobId) && p.user_id === userId);
  if (target) {
    target.status = 'cancelled';
    target.updated_at = new Date().toISOString();
    writeScheduledStore(store);
    return true;
  }

  return false;
}

/**
 * Autonomous daemon processor: publishes any scheduled post whose scheduled_for <= NOW()
 */
export async function processDueScheduledPosts(): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const now = Date.now();
  const store = readScheduledStore();
  const duePosts = store.filter(
    (p) => p.status === 'queued' && new Date(p.scheduled_for).getTime() <= now
  );

  let succeeded = 0;
  let failed = 0;

  for (const post of duePosts) {
    post.status = 'uploading';
    writeScheduledStore(store);

    const pubResult = await publishProjectToSocial({
      userId: post.user_id,
      projectId: post.project_id,
      accountId: post.connected_account_id,
      platform: post.platform,
      title: post.title,
      caption: post.caption,
      mediaUrl: post.media_url,
      idempotencyKey: `due_${post.idempotency_key}_${Date.now()}`,
    });

    if (pubResult.success) {
      post.status = 'published';
      post.platform_media_id = pubResult.platformMediaId;
      post.platform_permalink = pubResult.platformPermalink;
      succeeded++;
    } else {
      post.status = 'failed';
      post.error_message = pubResult.errorMessage;
      failed++;
    }
    post.updated_at = new Date().toISOString();
    writeScheduledStore(store);
  }

  return { processed: duePosts.length, succeeded, failed };
}

/**
 * Executes or queues a social publication job with idempotency, token validation, and post scheduling
 */
export async function publishProjectToSocial(params: PublishProjectParams): Promise<PublishResult> {
  const idempotencyKey =
    params.idempotencyKey ||
    `pub_${params.platform}_${params.accountId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // 1. Idempotency Check: Prevent duplicate publishing during network retries
  if (processedIdempotencyKeys.has(idempotencyKey)) {
    const cached = processedIdempotencyKeys.get(idempotencyKey)!;
    if (cached.status === 'published' || cached.status === 'processing') {
      return cached;
    }
  }

  // 1.5. Scheduled Post Check: If scheduledFor is set in the future, persist to schedule queue
  if (params.scheduledFor) {
    const scheduledTime = new Date(params.scheduledFor).getTime();
    if (!isNaN(scheduledTime) && scheduledTime > Date.now()) {
      const scheduledJob = await scheduleSocialPost({
        ...params,
        idempotencyKey,
      });
      const schedResult: PublishResult = {
        success: true,
        jobId: scheduledJob.id,
        platform: params.platform,
        status: 'queued',
        errorMessage: `Post successfully scheduled for ${new Date(params.scheduledFor).toISOString()}`,
      };
      processedIdempotencyKeys.set(idempotencyKey, schedResult);
      return schedResult;
    }
  }

  // 2. Retrieve Account & Decrypted Credentials
  const authBundle = await getAccountWithCredentials(params.accountId, params.userId);
  if (!authBundle) {
    return {
      success: false,
      jobId: idempotencyKey,
      platform: params.platform,
      status: 'failed',
      errorMessage: 'Connected social account not found or credentials could not be decrypted.',
    };
  }

  const { account, accessToken, refreshToken } = authBundle;

  // 3. Dispatch to Provider Workflow
  try {
    let result: PublishResult;

    if (params.platform === 'youtube') {
      result = await executeYouTubePublish(params, account, accessToken, refreshToken, idempotencyKey);
    } else if (params.platform === 'instagram') {
      result = await executeInstagramPublish(params, account, accessToken, idempotencyKey);
    } else if (params.platform === 'facebook') {
      result = await executeFacebookPublish(params, account, accessToken, idempotencyKey);
    } else if (params.platform === 'twitter') {
      result = await executeTwitterPublish(params, account, accessToken, refreshToken, idempotencyKey);
    } else if (params.platform === 'linkedin') {
      result = await executeLinkedInPublish(params, account, accessToken, refreshToken, idempotencyKey);
    } else {
      return {
        success: false,
        jobId: idempotencyKey,
        platform: params.platform,
        status: 'failed',
        errorMessage: `Platform '${params.platform}' direct API publishing is not supported.`,
      };
    }

    processedIdempotencyKeys.set(idempotencyKey, result);

    await logSocialAudit({
      userId: params.userId,
      action: result.success ? 'publish_success' : 'publish_failed',
      provider: params.platform,
      accountId: account.platform_account_id,
      details: {
        title: params.title,
        status: result.status,
        mediaId: result.platformMediaId,
        permalink: result.platformPermalink,
        error: result.errorMessage,
      },
    });

    return result;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown publishing error';
    const failResult: PublishResult = {
      success: false,
      jobId: idempotencyKey,
      platform: params.platform,
      status: 'failed',
      errorMessage: errorMsg,
    };

    processedIdempotencyKeys.set(idempotencyKey, failResult);
    return failResult;
  }
}

/**
 * YouTube Shorts Resumable Upload
 */
async function executeYouTubePublish(
  params: PublishProjectParams,
  account: ConnectedAccountRecord,
  accessToken: string,
  refreshToken?: string,
  jobId: string = ''
): Promise<PublishResult> {
  let activeToken = accessToken;

  // Check if token expired and refresh if possible
  if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
    if (refreshToken) {
      try {
        const refreshed = await refreshYouTubeAccessToken(refreshToken);
        activeToken = refreshed.accessToken;
      } catch (refErr) {
        await updateAccountStatus(account.id, params.userId, 'expired', 'YouTube token expired. Re-authorization required.');
        throw refErr;
      }
    }
  }

  // Ensure title contains #Shorts for vertical recognition
  const title = params.title.includes('#Shorts') ? params.title : `${params.title} #Shorts`;

  // 1. Initiate Resumable Upload Session
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${activeToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify({
        snippet: {
          title: title.slice(0, 100),
          description: `${params.caption}\n\nAutomated via RIIQX Creator Studio & Social Autopilot.`,
          tags: ['Shorts', 'RIIQX', 'AI', 'Creator'],
          categoryId: '28', // Tech
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      }),
    }
  );

  if (!initRes.ok) {
    const errText = await initRes.text();
    throw new Error(`YouTube API upload initialization failed: ${initRes.status} ${errText}`);
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('YouTube did not return a resumable upload location URI.');
  }

  // 2. Fetch media file and upload stream/buffer
  const mediaFetchRes = await fetch(params.mediaUrl);
  if (!mediaFetchRes.ok) {
    throw new Error(`Failed to download source video from mediaUrl: ${params.mediaUrl}`);
  }
  const videoBuffer = await mediaFetchRes.arrayBuffer();

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(videoBuffer.byteLength),
    },
    body: videoBuffer,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || !uploadData.id) {
    throw new Error(uploadData.error?.message || 'YouTube video binary upload failed.');
  }

  const videoId = uploadData.id;
  return {
    success: true,
    jobId,
    platform: 'youtube',
    status: 'published',
    platformMediaId: videoId,
    platformPermalink: `https://youtube.com/shorts/${videoId}`,
  };
}

/**
 * Meta / Instagram Reels Publishing
 */
async function executeInstagramPublish(
  params: PublishProjectParams,
  account: ConnectedAccountRecord,
  accessToken: string,
  jobId: string = ''
): Promise<PublishResult> {
  const igAccountId = account.platform_account_id;

  // 1. Initialize Reels Container
  const containerUrl = `https://graph.facebook.com/v26.0/${igAccountId}/media`;
  const containerParams = new URLSearchParams({
    media_type: 'REELS',
    video_url: params.mediaUrl,
    caption: params.caption,
    share_to_feed: 'true',
    access_token: accessToken,
  });

  const initRes = await fetch(`${containerUrl}?${containerParams.toString()}`, {
    method: 'POST',
  });

  const initData = await initRes.json();
  if (!initRes.ok || !initData.id) {
    throw new Error(initData.error?.message || 'Failed to initialize Instagram Reels container.');
  }

  const containerId = initData.id;

  // 2. Poll Container Processing Status
  let isReady = false;
  let attempts = 0;
  while (!isReady && attempts < 10) {
    await new Promise((r) => setTimeout(r, 3000));
    const statusRes = await fetch(
      `https://graph.facebook.com/v26.0/${containerId}?fields=status_code&access_token=${accessToken}`
    );
    const statusData = await statusRes.json();

    if (statusData.status_code === 'FINISHED') {
      isReady = true;
    } else if (statusData.status_code === 'ERROR') {
      throw new Error('Meta video processing failed during ingestion on Instagram servers.');
    }
    attempts++;
  }

  if (!isReady) {
    return {
      success: true,
      jobId,
      platform: 'instagram',
      status: 'processing',
      platformMediaId: containerId,
      errorMessage: 'Video container is still processing on Instagram. Will finalize asynchronously.',
    };
  }

  // 3. Publish Container
  const publishUrl = `https://graph.facebook.com/v26.0/${igAccountId}/media_publish`;
  const publishRes = await fetch(publishUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  const publishData = await publishRes.json();
  if (!publishRes.ok || !publishData.id) {
    throw new Error(publishData.error?.message || 'Publication step failed on Instagram.');
  }

  return {
    success: true,
    jobId,
    platform: 'instagram',
    status: 'published',
    platformMediaId: publishData.id,
    platformPermalink: `https://www.instagram.com/reel/${publishData.id}`,
  };
}

/**
 * Facebook Page Video / Reels Publishing
 */
async function executeFacebookPublish(
  params: PublishProjectParams,
  account: ConnectedAccountRecord,
  accessToken: string,
  jobId: string = ''
): Promise<PublishResult> {
  const pageId = account.platform_account_id;

  const url = `https://graph.facebook.com/v26.0/${pageId}/videos`;
  const postParams = new URLSearchParams({
    file_url: params.mediaUrl,
    title: params.title,
    description: params.caption,
    access_token: accessToken,
  });

  const res = await fetch(`${url}?${postParams.toString()}`, {
    method: 'POST',
  });

  const data = await res.json();
  if (!res.ok || !data.id) {
    throw new Error(data.error?.message || 'Failed to publish video to Facebook Page.');
  }

  return {
    success: true,
    jobId,
    platform: 'facebook',
    status: 'published',
    platformMediaId: data.id,
    platformPermalink: `https://www.facebook.com/${data.id}`,
  };
}

/**
 * X / Twitter API v2 Tweet Publishing (with Token Refresh)
 */
async function executeTwitterPublish(
  params: PublishProjectParams,
  account: ConnectedAccountRecord,
  accessToken: string,
  refreshToken?: string,
  jobId: string = ''
): Promise<PublishResult> {
  let activeToken = accessToken;

  // Check token expiration and auto-refresh
  if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
    if (refreshToken) {
      try {
        const refreshed = await refreshXAccessToken(refreshToken);
        activeToken = refreshed.accessToken;
      } catch (refErr) {
        await updateAccountStatus(account.id, params.userId, 'expired', 'Twitter / X token expired. Re-authorization required.');
        throw refErr;
      }
    }
  }

  // Compose tweet text (max 280 chars or thread format)
  let text = params.title ? `${params.title}\n\n${params.caption}` : params.caption;
  if (params.mediaUrl && !text.includes(params.mediaUrl)) {
    const remainingLength = 280 - (params.mediaUrl.length + 2);
    if (text.length > remainingLength) {
      text = text.slice(0, remainingLength - 3) + '... ' + params.mediaUrl;
    } else {
      text = `${text}\n${params.mediaUrl}`;
    }
  } else if (text.length > 280) {
    text = text.slice(0, 277) + '...';
  }

  const res = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  if (!res.ok || !data.data?.id) {
    throw new Error(data.detail || data.title || data.error || 'Failed to post Tweet on X / Twitter.');
  }

  const tweetId = data.data.id;
  return {
    success: true,
    jobId,
    platform: 'twitter',
    status: 'published',
    platformMediaId: tweetId,
    platformPermalink: `https://x.com/i/status/${tweetId}`,
  };
}

/**
 * LinkedIn UGC Share / Post Publishing (with Token Refresh)
 */
async function executeLinkedInPublish(
  params: PublishProjectParams,
  account: ConnectedAccountRecord,
  accessToken: string,
  refreshToken?: string,
  jobId: string = ''
): Promise<PublishResult> {
  let activeToken = accessToken;

  // Check token expiration and auto-refresh
  if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
    if (refreshToken) {
      try {
        const refreshed = await refreshLinkedInAccessToken(refreshToken);
        activeToken = refreshed.accessToken;
      } catch (refErr) {
        await updateAccountStatus(account.id, params.userId, 'expired', 'LinkedIn token expired. Re-authorization required.');
        throw refErr;
      }
    }
  }

  const authorUrn = account.platform_account_id.startsWith('urn:li:')
    ? account.platform_account_id
    : `urn:li:person:${account.platform_account_id}`;

  const sharePayload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: params.title ? `${params.title}\n\n${params.caption}` : params.caption,
        },
        shareMediaCategory: params.mediaUrl ? 'ARTICLE' : 'NONE',
        ...(params.mediaUrl
          ? {
              media: [
                {
                  status: 'READY',
                  originalUrl: params.mediaUrl,
                  title: { text: params.title || 'RIIQX Video Post' },
                  description: { text: params.caption.slice(0, 200) },
                },
              ],
            }
          : {}),
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${activeToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(sharePayload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || (!data.id && !res.headers.get('x-restli-id'))) {
    throw new Error(data.message || `LinkedIn post publishing failed: HTTP ${res.status}`);
  }

  const postUrn = data.id || res.headers.get('x-restli-id') || `urn:li:share:${Date.now()}`;
  return {
    success: true,
    jobId,
    platform: 'linkedin',
    status: 'published',
    platformMediaId: postUrn,
    platformPermalink: `https://www.linkedin.com/feed/update/${postUrn}`,
  };
}
