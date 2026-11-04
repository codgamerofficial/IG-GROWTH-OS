// =============================================================================
// RIIQX — Master Facebook Pages Discovery & Management API
// Official Meta Graph API v26.0 • Multi-Page Management • Granular Scopes
// Real-Time Discovery • Token Health • Linked Instagram Account Association
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getConnectedAccounts,
  getAccountWithCredentials,
  saveConnectedAccount,
  deleteConnectedAccount,
} from '@/lib/riiqx/social/account-repository';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export interface EligibleFacebookPage {
  id: string;
  name: string;
  username?: string;
  category?: string;
  avatarUrl?: string;
  followersCount: number;
  fanCount: number;
  isConnected: boolean;
  connectedAccountId?: string;
  tasks: string[];
  hasAnalyzePermission: boolean;
  insightsEligibility: 'eligible' | 'requires_app_review' | 'restricted';
  linkedInstagramAccount?: {
    id: string;
    username: string;
    name?: string;
    profilePictureUrl?: string;
    isConnected: boolean;
  };
}

/**
 * GET /api/social/pages
 * Discovers and lists all eligible Facebook Pages accessible to the authenticated Meta user
 */
export async function GET(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    const existingAccounts = await getConnectedAccounts(userId);
    const metaAccounts = existingAccounts.filter(
      (a) => (a.provider === 'facebook' || a.provider === 'instagram') && a.status === 'connected'
    );

    if (metaAccounts.length === 0) {
      return NextResponse.json({
        success: true,
        pages: [],
        message: 'No active Meta credentials found. Connect your Meta/Facebook account in Integrations first.',
      });
    }

    // Try finding a valid Meta user token or Page token
    let activeToken = '';
    for (const acc of metaAccounts) {
      const creds = await getAccountWithCredentials(acc.id, userId);
      if (creds?.accessToken) {
        activeToken = creds.accessToken;
        break;
      }
    }

    if (!activeToken) {
      return NextResponse.json({
        success: true,
        pages: [],
        message: 'Unable to decrypt Meta token. Please re-authenticate your connection.',
      });
    }

    // Query Meta Graph API for user's administered pages
    const pagesUrl = new URL('https://graph.facebook.com/v26.0/me/accounts');
    pagesUrl.searchParams.set(
      'fields',
      'id,name,username,category,followers_count,fan_count,picture{url},tasks,access_token,instagram_business_account{id,username,name,profile_picture_url},connected_instagram_account{id,username,name,profile_picture_url}'
    );
    pagesUrl.searchParams.set('access_token', activeToken);

    const res = await fetch(pagesUrl.toString());
    const data = await res.json();

    const discoveredPages: EligibleFacebookPage[] = [];

    if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
      for (const p of data.data) {
        const pageId = String(p.id);
        const pageName = String(p.name || `Page ${pageId}`);
        const pageUsername = p.username ? String(p.username) : undefined;
        const category = p.category ? String(p.category) : 'General';
        const avatarUrl = p.picture?.data?.url ? String(p.picture.data.url) : undefined;
        const followersCount = typeof p.followers_count === 'number' ? p.followers_count : 0;
        const fanCount = typeof p.fan_count === 'number' ? p.fan_count : 0;
        const tasks = Array.isArray(p.tasks) ? p.tasks.map(String) : [];

        const hasAnalyzePermission = tasks.includes('ANALYZE') || tasks.includes('MANAGE') || tasks.length > 0;

        // Check if this page is already saved in connected_accounts
        const existingPageAcc = existingAccounts.find(
          (a) => a.provider === 'facebook' && a.platform_account_id === pageId
        );

        // Check linked Instagram account
        const igRaw = p.instagram_business_account || p.connected_instagram_account;
        let linkedInstagramAccount: EligibleFacebookPage['linkedInstagramAccount'] = undefined;

        if (igRaw && igRaw.id) {
          const igId = String(igRaw.id);
          const isIgConnected = existingAccounts.some(
            (a) => a.provider === 'instagram' && a.platform_account_id === igId
          );
          linkedInstagramAccount = {
            id: igId,
            username: String(igRaw.username || ''),
            name: igRaw.name ? String(igRaw.name) : undefined,
            profilePictureUrl: igRaw.profile_picture_url ? String(igRaw.profile_picture_url) : undefined,
            isConnected: isIgConnected,
          };
        }

        discoveredPages.push({
          id: pageId,
          name: pageName,
          username: pageUsername,
          category,
          avatarUrl,
          followersCount,
          fanCount,
          isConnected: Boolean(existingPageAcc && existingPageAcc.status === 'connected'),
          connectedAccountId: existingPageAcc?.id,
          tasks,
          hasAnalyzePermission,
          insightsEligibility: hasAnalyzePermission ? 'eligible' : 'requires_app_review',
          linkedInstagramAccount,
        });
      }
    } else {
      // Fallback: If /me/accounts returned permission error with a Page token,
      // probe each already connected Facebook Page directly
      for (const acc of metaAccounts.filter((a) => a.provider === 'facebook')) {
        const creds = await getAccountWithCredentials(acc.id, userId);
        if (!creds?.accessToken) continue;

        try {
          const probeRes = await fetch(
            `https://graph.facebook.com/v26.0/${acc.platform_account_id}?fields=id,name,username,category,followers_count,fan_count,picture{url},link,instagram_business_account{id,username,name,profile_picture_url}&access_token=${creds.accessToken}`
          );
          if (probeRes.ok) {
            const p = await probeRes.json();
            const pageId = String(p.id);
            const igRaw = p.instagram_business_account;

            discoveredPages.push({
              id: pageId,
              name: String(p.name || acc.account_name),
              username: p.username ? String(p.username) : undefined,
              category: p.category ? String(p.category) : 'Creator',
              avatarUrl: p.picture?.data?.url || acc.avatar_url,
              followersCount: typeof p.followers_count === 'number' ? p.followers_count : 0,
              fanCount: typeof p.fan_count === 'number' ? p.fan_count : 0,
              isConnected: true,
              connectedAccountId: acc.id,
              tasks: Array.isArray(p.tasks) ? p.tasks.map(String) : ['MANAGE'],
              hasAnalyzePermission: true,
              insightsEligibility: 'eligible',
              linkedInstagramAccount: igRaw
                ? {
                    id: String(igRaw.id),
                    username: String(igRaw.username || ''),
                    name: igRaw.name ? String(igRaw.name) : undefined,
                    profilePictureUrl: igRaw.profile_picture_url ? String(igRaw.profile_picture_url) : undefined,
                    isConnected: existingAccounts.some(
                      (a) => a.provider === 'instagram' && a.platform_account_id === String(igRaw.id)
                    ),
                  }
                : undefined,
            });
          }
        } catch {
          // Keep loop going
        }
      }
    }

    return NextResponse.json({
      success: true,
      pages: discoveredPages,
      count: discoveredPages.length,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to discover Facebook Pages';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * POST /api/social/pages
 * Connects or activates a selected Facebook Page into the RIIQX unified registry
 */
export async function POST(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    const body = await req.json().catch(() => ({}));
    const { pageId, pageName, pageAccessToken } = body;

    if (!pageId) {
      return NextResponse.json({ error: 'pageId is required' }, { status: 400 });
    }

    const existingAccounts = await getConnectedAccounts(userId);
    let tokenToUse = pageAccessToken;

    if (!tokenToUse) {
      // Find an existing token from connected accounts
      for (const acc of existingAccounts) {
        if (acc.provider === 'facebook' || acc.provider === 'instagram') {
          const creds = await getAccountWithCredentials(acc.id, userId);
          if (creds?.accessToken) {
            tokenToUse = creds.accessToken;
            break;
          }
        }
      }
    }

    if (!tokenToUse) {
      return NextResponse.json(
        { error: 'No valid Meta token available to connect this Page. Please connect via OAuth in Integrations.' },
        { status: 400 }
      );
    }

    // Probe Page details from Meta Graph API
    const pageProbeRes = await fetch(
      `https://graph.facebook.com/v26.0/${pageId}?fields=id,name,username,category,followers_count,fan_count,picture{url}&access_token=${tokenToUse}`
    );
    const pageData = await pageProbeRes.json();

    const verifiedName = pageData.name || pageName || `Facebook Page ${pageId}`;
    const verifiedUsername = pageData.username ? `@${pageData.username}` : `@page_${pageId}`;
    const verifiedAvatar = pageData.picture?.data?.url;

    const account = await saveConnectedAccount({
      userId,
      provider: 'facebook',
      platformAccountId: pageId,
      accountName: verifiedName,
      accountHandle: verifiedUsername,
      avatarUrl: verifiedAvatar,
      scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
      accessToken: tokenToUse,
      tokenExpiresAt: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
      status: 'connected',
      platformMetadata: {
        pageId,
        pageName: verifiedName,
        category: pageData.category,
        followersCount: pageData.followers_count || 0,
        fanCount: pageData.fan_count || 0,
      },
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        name: account.account_name,
        handle: account.account_handle,
        status: account.status,
      },
      message: `Facebook Page "${verifiedName}" successfully connected to Social Intelligence OS.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to connect Facebook Page';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * DELETE /api/social/pages
 * Disconnects a Facebook Page
 */
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const accountId = url.searchParams.get('id');
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  if (!accountId) {
    return NextResponse.json({ error: 'accountId query param is required' }, { status: 400 });
  }

  try {
    const deleted = await deleteConnectedAccount(accountId, userId);
    return NextResponse.json({
      success: deleted,
      message: deleted
        ? 'Facebook Page disconnected successfully.'
        : 'Facebook Page not found or could not be removed.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to disconnect Facebook Page';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
