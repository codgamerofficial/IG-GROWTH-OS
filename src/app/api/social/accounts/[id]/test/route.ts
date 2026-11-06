import { NextRequest, NextResponse } from 'next/server';
import {
  getAccountWithCredentials,
  updateAccountStatus,
  saveConnectedAccount,
} from '@/lib/riiqx/social/account-repository';
import { refreshYouTubeAccessToken } from '@/lib/riiqx/social/oauth-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const accountId = params.id;
  const url = new URL(req.url);
  const resolvedAuthId = await resolveAuthUserId(req);
  const userId = resolvedAuthId || url.searchParams.get('userId') || 'usr_riiqx_primary';

  const authBundle = await getAccountWithCredentials(accountId, userId);
  if (!authBundle) {
    return NextResponse.json(
      { success: false, error: 'Connected account not found or credentials unavailable.' },
      { status: 404 }
    );
  }

  const { account, accessToken } = authBundle;
  const startTime = Date.now();

  try {
    if (account.provider === 'youtube') {
      const res = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );
      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok || !data.items || data.items.length === 0) {
        // Attempt automatic refresh if refresh token is available
        if (authBundle.refreshToken) {
          try {
            const refreshed = await refreshYouTubeAccessToken(authBundle.refreshToken);
            await saveConnectedAccount({
              userId,
              provider: 'youtube',
              platformAccountId: account.platform_account_id,
              accountName: account.account_name,
              accountHandle: account.account_handle,
              avatarUrl: account.avatar_url,
              scopes: account.scopes,
              accessToken: refreshed.accessToken,
              refreshToken: authBundle.refreshToken,
              tokenExpiresAt: new Date(Date.now() + refreshed.expiresIn * 1000).toISOString(),
              tokenType: 'Bearer',
              platformMetadata: account.platform_metadata,
              status: 'connected',
            });

            const retryRes = await fetch(
              'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
              {
                headers: {
                  Authorization: `Bearer ${refreshed.accessToken}`,
                  Accept: 'application/json',
                },
              }
            );
            const retryData = await retryRes.json();
            if (retryRes.ok && retryData.items?.[0]) {
              const retryItem = retryData.items[0];
              await updateAccountStatus(accountId, userId, 'connected');
              return NextResponse.json({
                success: true,
                latencyMs: Date.now() - startTime,
                provider: 'youtube',
                status: 'connected',
                details: {
                  title: retryItem.snippet?.title,
                  handle: retryItem.snippet?.customUrl,
                  subscriberCount: retryItem.statistics?.subscriberCount,
                  videoCount: retryItem.statistics?.videoCount,
                },
              });
            }
          } catch {
            // Fall through to error response below
          }
        }

        const errorMsg = data.error?.message || 'YouTube token invalid or scope missing.';
        await updateAccountStatus(accountId, userId, 'expired', errorMsg);
        return NextResponse.json({
          success: false,
          latencyMs,
          status: 'expired',
          error: errorMsg,
        });
      }

      const item = data.items[0];
      await updateAccountStatus(accountId, userId, 'connected');

      return NextResponse.json({
        success: true,
        latencyMs,
        provider: 'youtube',
        status: 'connected',
        details: {
          title: item.snippet?.title,
          handle: item.snippet?.customUrl,
          subscriberCount: item.statistics?.subscriberCount,
          videoCount: item.statistics?.videoCount,
        },
      });
    }

    if (account.provider === 'instagram') {
      const isCustomHandle = account.platform_account_id.startsWith('ig_');
      const linkedPageId = account.platform_metadata?.linkedPageId as string | undefined;

      let res: Response;
      let data: Record<string, any>;

      if (isCustomHandle && linkedPageId) {
        // Probe via the bound Facebook Page Access Token
        res = await fetch(
          `https://graph.facebook.com/v26.0/${linkedPageId}?fields=id,name,instagram_business_account{id,username,name,followers_count,media_count}&access_token=${accessToken}`
        );
      } else {
        res = await fetch(
          `https://graph.facebook.com/v26.0/${account.platform_account_id}?fields=id,name,username,followers_count,media_count&access_token=${accessToken}`
        );
      }

      const latencyMs = Date.now() - startTime;
      data = await res.json();

      if (!res.ok || data.error) {
        // Fallback: If direct IG ID probe failed but has linkedPageId, probe page token
        if (linkedPageId && !isCustomHandle) {
          const pageRes = await fetch(
            `https://graph.facebook.com/v26.0/${linkedPageId}?fields=id,name&access_token=${accessToken}`
          );
          if (pageRes.ok) {
            await updateAccountStatus(accountId, userId, 'connected');
            return NextResponse.json({
              success: true,
              latencyMs: Date.now() - startTime,
              provider: 'instagram',
              status: 'connected',
              details: {
                username: account.account_handle?.replace(/^@/, '') || account.account_name,
                name: account.account_name,
                linkedPage: account.platform_metadata?.linkedPageName || 'Meta Page',
              },
            });
          }
        }

        const rawError = data.error?.message || 'Meta token invalid or permissions expired.';
        const errorMsg = rawError.includes('Application has been deleted')
          ? 'Token was issued by a deleted Meta App. Please reconnect via OAuth.'
          : rawError;
        await updateAccountStatus(accountId, userId, 'expired', errorMsg);
        return NextResponse.json({
          success: false,
          latencyMs,
          status: 'expired',
          error: errorMsg,
        });
      }

      await updateAccountStatus(accountId, userId, 'connected');

      const igDetail = data.instagram_business_account || data;
      return NextResponse.json({
        success: true,
        latencyMs,
        provider: 'instagram',
        status: 'connected',
        details: {
          username: igDetail.username || account.account_handle?.replace(/^@/, ''),
          name: igDetail.name || account.account_name,
          followersCount: igDetail.followers_count ?? igDetail.followersCount,
          mediaCount: igDetail.media_count ?? igDetail.mediaCount,
        },
      });
    }

    if (account.provider === 'facebook') {
      const res = await fetch(
        `https://graph.facebook.com/v26.0/${account.platform_account_id}?fields=id,name,fan_count&access_token=${accessToken}`
      );
      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok || data.error) {
        const errorMsg = data.error?.message || 'Facebook Page access token expired.';
        await updateAccountStatus(accountId, userId, 'expired', errorMsg);
        return NextResponse.json({
          success: false,
          latencyMs,
          status: 'expired',
          error: errorMsg,
        });
      }

      await updateAccountStatus(accountId, userId, 'connected');

      return NextResponse.json({
        success: true,
        latencyMs,
        provider: 'facebook',
        status: 'connected',
        details: {
          name: data.name,
          followersCount: data.fan_count,
        },
      });
    }

    if (account.provider === 'twitter') {
      const res = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok || data.errors) {
        const errorMsg = data.detail || data.title || 'Twitter / X OAuth token expired or invalid.';
        await updateAccountStatus(accountId, userId, 'expired', errorMsg);
        return NextResponse.json({
          success: false,
          latencyMs,
          status: 'expired',
          error: errorMsg,
        });
      }

      await updateAccountStatus(accountId, userId, 'connected');
      return NextResponse.json({
        success: true,
        latencyMs,
        provider: 'twitter',
        status: 'connected',
        details: {
          name: data.data?.name,
          username: data.data?.username,
          followersCount: data.data?.public_metrics?.followers_count,
        },
      });
    }

    if (account.provider === 'linkedin') {
      const res = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok || data.status === 401) {
        const errorMsg = data.message || 'LinkedIn OAuth token expired or unauthorized.';
        await updateAccountStatus(accountId, userId, 'expired', errorMsg);
        return NextResponse.json({
          success: false,
          latencyMs,
          status: 'expired',
          error: errorMsg,
        });
      }

      await updateAccountStatus(accountId, userId, 'connected');
      return NextResponse.json({
        success: true,
        latencyMs,
        provider: 'linkedin',
        status: 'connected',
        details: {
          name: data.name,
          email: data.email,
        },
      });
    }

    return NextResponse.json({
      success: true,
      latencyMs: Date.now() - startTime,
      status: 'connected',
      message: 'Account connection verified.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network failure testing connection';
    return NextResponse.json(
      { success: false, error: errorMsg, latencyMs: Date.now() - startTime },
      { status: 500 }
    );
  }
}
