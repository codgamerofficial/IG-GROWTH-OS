import { NextRequest, NextResponse } from 'next/server';
import { exchangeXCode } from '@/lib/riiqx/social/oauth-engine';
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
  const resolvedAuthId = await resolveAuthUserId(req);
  const cookieUserId = req.cookies.get('riiqx_oauth_user')?.value;
  const userId = resolvedAuthId || cookieUserId || 'usr_riiqx_primary';

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
  const proto = req.headers.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
  const appUrl = `${proto}://${host}`;

  if (error) {
    const errorMsg = errorDescription || error;
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'twitter');
    dest.searchParams.set('message', errorMsg);
    return NextResponse.redirect(dest.toString());
  }

  if (!code || !state || !cookieState || state !== cookieState || !codeVerifier) {
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'twitter');
    dest.searchParams.set('message', 'OAuth state verification failed. Possible CSRF or expired session.');
    return NextResponse.redirect(dest.toString());
  }

  try {
    const tokenResult = await exchangeXCode(code, codeVerifier);

    const expiresAt = new Date(Date.now() + tokenResult.expiresIn * 1000).toISOString();

    const saved = await saveConnectedAccount({
      userId,
      provider: 'twitter',
      platformAccountId: tokenResult.user.id,
      accountName: tokenResult.user.name,
      accountHandle: `@${tokenResult.user.username}`,
      avatarUrl: tokenResult.user.profileImageUrl,
      scopes: tokenResult.scopes,
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiresAt: expiresAt,
      tokenType: tokenResult.tokenType,
      platformMetadata: {
        username: tokenResult.user.username,
      },
    });

    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'success');
    dest.searchParams.set('provider', 'twitter');
    dest.searchParams.set('account_name', saved.account_name);

    const response = NextResponse.redirect(dest.toString());

    // Clean up temporary OAuth cookies
    response.cookies.delete('riiqx_oauth_state');
    response.cookies.delete('riiqx_oauth_verifier');
    response.cookies.delete('riiqx_oauth_provider');
    response.cookies.delete('riiqx_oauth_user');

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to finalize Twitter / X authorization.';
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'twitter');
    dest.searchParams.set('message', errorMsg);
    return NextResponse.redirect(dest.toString());
  }
}
