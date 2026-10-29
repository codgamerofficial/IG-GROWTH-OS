// =============================================================================
// RIIQX — Master Social OAuth 2.0 Engine
// Google / YouTube Data API v3 • Meta Graph API v20.0 (Instagram & Facebook)
// Cryptographic State • PKCE Code Verifier • Server-Side Token Exchange
// =============================================================================

import crypto from 'crypto';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface OAuthStatePayload {
  state: string;
  codeVerifier: string;
  codeChallenge: string;
}

export interface DiscoveredChannel {
  channelId: string;
  title: string;
  handle?: string;
  thumbnailUrl?: string;
  subscriberCount?: number;
  videoCount?: number;
}

export interface DiscoveredMetaAccount {
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  instagramAccount?: {
    id: string;
    username: string;
    name?: string;
    profilePictureUrl?: string;
  };
}

function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * YouTube OAuth 2.0 Configuration
 */
export function getYouTubeOAuthConfig(): OAuthConfig {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.YOUTUBE_CLIENT_ID ||
    '';
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.YOUTUBE_CLIENT_SECRET ||
    '';
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    process.env.YOUTUBE_REDIRECT_URI ||
    `${getAppBaseUrl()}/api/social/oauth/callback/youtube`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  };
}

/**
 * Meta (Instagram & Facebook) OAuth Configuration
 */
export function getMetaOAuthConfig(): OAuthConfig {
  const clientId = process.env.META_APP_ID || '';
  const clientSecret = process.env.META_APP_SECRET || '';
  const redirectUri =
    process.env.META_REDIRECT_URI ||
    `${getAppBaseUrl()}/api/social/oauth/callback/meta`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes: [
      'instagram_basic',
      'instagram_content_publish',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
    ],
  };
}

/**
 * X / Twitter OAuth 2.0 Configuration (with PKCE)
 */
export function getXOAuthConfig(): OAuthConfig {
  const clientId = process.env.TWITTER_CLIENT_ID || process.env.X_CLIENT_ID || '';
  const clientSecret = process.env.TWITTER_CLIENT_SECRET || process.env.X_CLIENT_SECRET || '';
  const redirectUri =
    process.env.TWITTER_REDIRECT_URI ||
    process.env.X_REDIRECT_URI ||
    `${getAppBaseUrl()}/api/social/oauth/callback/twitter`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
  };
}

/**
 * LinkedIn OAuth 2.0 Configuration
 */
export function getLinkedInOAuthConfig(): OAuthConfig {
  const clientId = process.env.LINKEDIN_CLIENT_ID || '';
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI ||
    `${getAppBaseUrl()}/api/social/oauth/callback/linkedin`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    scopes: ['openid', 'profile', 'email', 'w_member_social'],
  };
}

/**
 * Generates cryptographically secure State & PKCE Code Verifier
 */
export function generateOAuthState(provider: string, userId: string): OAuthStatePayload {
  const randomHex = crypto.randomBytes(24).toString('hex');
  const timestamp = Date.now();
  // State encoded with provider, user reference, and random nonce
  const state = `rqx_${provider}_${userId.slice(0, 8)}_${randomHex}_${timestamp}`;

  // PKCE code_verifier: 43-128 characters unreserved
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // PKCE code_challenge: base64url(SHA256(verifier))
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return { state, codeVerifier, codeChallenge };
}

/**
 * Creates the official Google / YouTube authorization redirect URL
 */
export function createYouTubeAuthUrl(state: string, codeChallenge: string): string {
  const config = getYouTubeOAuthConfig();
  if (!config.clientId) {
    throw new Error('Google OAuth credentials not configured. Configure GOOGLE_CLIENT_ID in .env.local');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes.join(' '),
    access_type: 'offline', // Mandatory to receive refresh_token
    prompt: 'select_account consent', // Forces Google Account selector dialog & consent
    include_granted_scopes: 'true',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Creates the official Meta (Instagram & Facebook) authorization redirect URL
 */
export function createMetaAuthUrl(state: string): string {
  const config = getMetaOAuthConfig();
  if (!config.clientId) {
    throw new Error('Meta App credentials not configured. Configure META_APP_ID in .env.local');
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state,
    scope: config.scopes.join(','),
    response_type: 'code',
  });

  return `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`;
}

/**
 * Creates the official X / Twitter authorization redirect URL (OAuth 2.0 PKCE)
 */
export function createXAuthUrl(state: string, codeChallenge: string): string {
  const config = getXOAuthConfig();
  if (!config.clientId) {
    throw new Error('Twitter / X OAuth credentials not configured. Configure TWITTER_CLIENT_ID in .env.local');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}

/**
 * Creates the official LinkedIn authorization redirect URL (OAuth 2.0)
 */
export function createLinkedInAuthUrl(state: string): string {
  const config = getLinkedInOAuthConfig();
  if (!config.clientId) {
    throw new Error('LinkedIn OAuth credentials not configured. Configure LINKEDIN_CLIENT_ID in .env.local');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    state,
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Exchanges Google authorization code for tokens and discovers YouTube channel
 */
export async function exchangeYouTubeCode(code: string, codeVerifier: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scopes: string[];
  channel: DiscoveredChannel;
}> {
  const config = getYouTubeOAuthConfig();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange Google OAuth code.');
  }

  // Probe YouTube Data API for the authorized channel
  const channelRes = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    }
  );

  const channelData = await channelRes.json();
  if (!channelRes.ok || !channelData.items || channelData.items.length === 0) {
    throw new Error('No YouTube channel found for the authorized Google account. Please create a channel first.');
  }

  const item = channelData.items[0];
  const channel: DiscoveredChannel = {
    channelId: item.id,
    title: item.snippet?.title || 'YouTube Channel',
    handle: item.snippet?.customUrl,
    thumbnailUrl: item.snippet?.thumbnails?.default?.url || item.snippet?.thumbnails?.medium?.url,
    subscriberCount: parseInt(item.statistics?.subscriberCount || '0', 10),
    videoCount: parseInt(item.statistics?.videoCount || '0', 10),
  };

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in || 3600,
    tokenType: tokenData.token_type || 'Bearer',
    scopes: (tokenData.scope || '').split(' '),
    channel,
  };
}

/**
 * Exchanges Meta authorization code, upgrades to 60-day token, and discovers Instagram Business accounts
 */
export async function exchangeMetaCode(code: string): Promise<{
  userAccessToken: string;
  longLivedToken: string;
  expiresIn: number;
  accounts: DiscoveredMetaAccount[];
}> {
  const config = getMetaOAuthConfig();

  // 1. Exchange code for short-lived access token
  const tokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
  tokenUrl.searchParams.set('client_id', config.clientId);
  tokenUrl.searchParams.set('client_secret', config.clientSecret);
  tokenUrl.searchParams.set('redirect_uri', config.redirectUri);
  tokenUrl.searchParams.set('code', code);

  const tokenRes = await fetch(tokenUrl.toString());
  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error?.message || 'Failed to exchange Meta OAuth authorization code.');
  }

  const shortLivedToken = tokenData.access_token;

  // 2. Exchange short-lived token for 60-day long-lived token
  const longTokenUrl = new URL('https://graph.facebook.com/v20.0/oauth/access_token');
  longTokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
  longTokenUrl.searchParams.set('client_id', config.clientId);
  longTokenUrl.searchParams.set('client_secret', config.clientSecret);
  longTokenUrl.searchParams.set('fb_exchange_token', shortLivedToken);

  const longTokenRes = await fetch(longTokenUrl.toString());
  const longTokenData = await longTokenRes.json();

  const longLivedToken = longTokenData.access_token || shortLivedToken;
  const expiresIn = longTokenData.expires_in || 5184000; // default ~60 days

  // 3. Query Facebook Pages & linked Instagram Professional Accounts
  const pagesUrl = new URL('https://graph.facebook.com/v20.0/me/accounts');
  pagesUrl.searchParams.set(
    'fields',
    'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url}'
  );
  pagesUrl.searchParams.set('access_token', longLivedToken);

  const pagesRes = await fetch(pagesUrl.toString());
  const pagesData = await pagesRes.json();

  if (!pagesRes.ok || !pagesData.data) {
    throw new Error(pagesData.error?.message || 'Failed to fetch Facebook Pages and Instagram accounts.');
  }

  const accounts: DiscoveredMetaAccount[] = (pagesData.data as Array<Record<string, unknown>>).map((p) => {
    const ig = p.instagram_business_account as Record<string, string> | undefined;
    return {
      pageId: String(p.id),
      pageName: String(p.name),
      pageAccessToken: String(p.access_token || longLivedToken),
      instagramAccount: ig
        ? {
            id: String(ig.id),
            username: String(ig.username),
            name: ig.name ? String(ig.name) : undefined,
            profilePictureUrl: ig.profile_picture_url ? String(ig.profile_picture_url) : undefined,
          }
        : undefined,
    };
  });

  return {
    userAccessToken: shortLivedToken,
    longLivedToken,
    expiresIn,
    accounts,
  };
}

/**
 * Refreshes an expired YouTube OAuth access token using the stored refresh token
 */
export async function refreshYouTubeAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const config = getYouTubeOAuthConfig();
  if (!config.clientId || !config.clientSecret) {
    throw new Error('Google OAuth credentials missing for token refresh.');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to refresh YouTube access token.');
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in || 3600,
  };
}

/**
 * Exchanges X / Twitter OAuth code for tokens (PKCE) and queries user identity
 */
export async function exchangeXCode(code: string, codeVerifier: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scopes: string[];
  user: {
    id: string;
    name: string;
    username: string;
    profileImageUrl?: string;
  };
}> {
  const config = getXOAuthConfig();
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (config.clientSecret) {
    headers['Authorization'] = `Basic ${basicAuth}`;
  }

  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers,
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange Twitter / X OAuth code.');
  }

  // Probe Twitter API v2 users/me
  const userRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  const user = {
    id: userData.data?.id || 'x_user',
    name: userData.data?.name || 'X Creator',
    username: userData.data?.username || 'x_creator',
    profileImageUrl: userData.data?.profile_image_url,
  };

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in || 7200,
    tokenType: tokenData.token_type || 'Bearer',
    scopes: (tokenData.scope || '').split(' '),
    user,
  };
}

/**
 * Refreshes an expired X / Twitter OAuth token
 */
export async function refreshXAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const config = getXOAuthConfig();
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (config.clientSecret) {
    headers['Authorization'] = `Basic ${basicAuth}`;
  }

  const res = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers,
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to refresh Twitter / X access token.');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresIn: data.expires_in || 7200,
  };
}

/**
 * Exchanges LinkedIn OAuth code for tokens and fetches user profile
 */
export async function exchangeLinkedInCode(code: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scopes: string[];
  user: {
    id: string;
    name: string;
    email?: string;
    pictureUrl?: string;
  };
}> {
  const config = getLinkedInOAuthConfig();

  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange LinkedIn OAuth code.');
  }

  // Probe LinkedIn userinfo endpoint (OpenID standard)
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profileData = await profileRes.json();

  const user = {
    id: profileData.sub || 'linkedin_user',
    name: profileData.name || `${profileData.given_name || ''} ${profileData.family_name || ''}`.trim() || 'LinkedIn Member',
    email: profileData.email,
    pictureUrl: profileData.picture,
  };

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in || 5184000,
    scopes: (tokenData.scope || '').split(','),
    user,
  };
}

/**
 * Refreshes an expired LinkedIn OAuth access token
 */
export async function refreshLinkedInAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const config = getLinkedInOAuthConfig();

  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to refresh LinkedIn access token.');
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in || 5184000,
  };
}
