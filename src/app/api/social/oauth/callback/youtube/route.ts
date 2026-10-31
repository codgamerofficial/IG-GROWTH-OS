import { NextRequest, NextResponse } from 'next/server';
import { exchangeYouTubeCode } from '@/lib/riiqx/social/oauth-engine';
import { saveConnectedAccount } from '@/lib/riiqx/social/account-repository';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  const cookieState = req.cookies.get('riiqx_oauth_state')?.value;
  const codeVerifier = req.cookies.get('riiqx_oauth_verifier')?.value;
  const cookieRedirectUri = req.cookies.get('riiqx_oauth_redirect_uri')?.value;
  const resolvedAuthId = await resolveAuthUserId(req);
  const cookieUserId = req.cookies.get('riiqx_oauth_user')?.value;
  const userId = resolvedAuthId || cookieUserId || 'usr_riiqx_primary';

  // Derive origin directly from the request host to never cross-contaminate local and production
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
  const proto = req.headers.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;

  const appUrl = origin;
  const redirectUri = cookieRedirectUri || `${origin}/api/social/oauth/callback/youtube`;

  if (error) {
    const errorMsg = errorDescription || error;
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'youtube');
    dest.searchParams.set('message', errorMsg);
    return NextResponse.redirect(dest.toString());
  }

  if (!code || !state || !cookieState || state !== cookieState || !codeVerifier) {
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'youtube');
    dest.searchParams.set('message', 'OAuth state verification failed. Possible CSRF or expired session.');
    return NextResponse.redirect(dest.toString());
  }

  try {
    const tokenResult = await exchangeYouTubeCode(code, codeVerifier, redirectUri);

    const expiresAt = new Date(Date.now() + tokenResult.expiresIn * 1000).toISOString();

    const saved = await saveConnectedAccount({
      userId,
      provider: 'youtube',
      platformAccountId: tokenResult.channel.channelId,
      accountName: tokenResult.channel.title,
      accountHandle: tokenResult.channel.handle,
      avatarUrl: tokenResult.channel.thumbnailUrl,
      scopes: tokenResult.scopes,
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiresAt: expiresAt,
      tokenType: tokenResult.tokenType,
      platformMetadata: {
        subscriberCount: tokenResult.channel.subscriberCount,
        videoCount: tokenResult.channel.videoCount,
      },
    });

    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'success');
    dest.searchParams.set('provider', 'youtube');
    dest.searchParams.set('account_name', saved.account_name);

    const response = NextResponse.redirect(dest.toString());

    // Clean up temporary OAuth cookies
    response.cookies.delete('riiqx_oauth_state');
    response.cookies.delete('riiqx_oauth_verifier');
    response.cookies.delete('riiqx_oauth_redirect_uri');
    response.cookies.delete('riiqx_oauth_provider');
    response.cookies.delete('riiqx_oauth_user');

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to finalize YouTube authorization.';
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'youtube');
    dest.searchParams.set('message', errorMsg);
    return NextResponse.redirect(dest.toString());
  }
}
