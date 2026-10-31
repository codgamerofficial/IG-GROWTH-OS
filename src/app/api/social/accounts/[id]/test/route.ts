import { NextRequest, NextResponse } from 'next/server';
import {
  getAccountWithCredentials,
  updateAccountStatus,
} from '@/lib/riiqx/social/account-repository';
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
      const res = await fetch(
        `https://graph.facebook.com/v26.0/${account.platform_account_id}?fields=id,name,username,followers_count,media_count&access_token=${accessToken}`
      );
      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      if (!res.ok || data.error) {
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

      return NextResponse.json({
        success: true,
        latencyMs,
        provider: 'instagram',
        status: 'connected',
        details: {
          username: data.username,
          name: data.name,
          followersCount: data.followers_count,
          mediaCount: data.media_count,
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
