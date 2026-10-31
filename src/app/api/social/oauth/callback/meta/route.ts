import { NextRequest, NextResponse } from 'next/server';
import { exchangeMetaCode, getTrustedAppOrigin } from '@/lib/riiqx/social/oauth-engine';
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
  const cookieRedirectUri = req.cookies.get('riiqx_oauth_redirect_uri')?.value;
  const resolvedAuthId = await resolveAuthUserId(req);
  const cookieUserId = req.cookies.get('riiqx_oauth_user')?.value;
  const userId = resolvedAuthId || cookieUserId || 'usr_riiqx_primary';

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
  const proto = req.headers.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
  const appUrl = getTrustedAppOrigin(host, proto);
  const redirectUri = cookieRedirectUri || `${appUrl}/api/social/oauth/callback/meta`;

  if (error) {
    const errorMsg = errorDescription || error;
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'meta');
    dest.searchParams.set('message', errorMsg);
    return NextResponse.redirect(dest.toString());
  }

  if (!code || !state || !cookieState || state !== cookieState) {
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'meta');
    dest.searchParams.set('message', 'Meta OAuth state verification failed. Possible CSRF or expired session.');
    return NextResponse.redirect(dest.toString());
  }

  try {
    const { longLivedToken, expiresIn, accounts } = await exchangeMetaCode(code, redirectUri);
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    let facebookPagesCount = 0;
    let instagramAccountsCount = 0;
    let primaryInstagramUsername = '';

    for (const page of accounts) {
      // 1. Connect Facebook Page
      await saveConnectedAccount({
        userId,
        provider: 'facebook',
        platformAccountId: page.pageId,
        accountName: page.pageName,
        accountHandle: `@page_${page.pageId}`,
        scopes: ['pages_show_list', 'pages_manage_posts', 'pages_read_engagement'],
        accessToken: page.pageAccessToken || longLivedToken,
        tokenExpiresAt: expiresAt,
        tokenType: 'Bearer',
        platformMetadata: { pageId: page.pageId, pageName: page.pageName },
      });
      facebookPagesCount++;

      // 2. Connect linked Instagram Professional / Creator account if present
      if (page.instagramAccount) {
        await saveConnectedAccount({
          userId,
          provider: 'instagram',
          platformAccountId: page.instagramAccount.id,
          accountName: page.instagramAccount.name || page.instagramAccount.username,
          accountHandle: `@${page.instagramAccount.username}`,
          avatarUrl: page.instagramAccount.profilePictureUrl,
          scopes: ['instagram_basic', 'instagram_content_publish'],
          accessToken: page.pageAccessToken || longLivedToken,
          tokenExpiresAt: expiresAt,
          tokenType: 'Bearer',
          platformMetadata: {
            instagramId: page.instagramAccount.id,
            username: page.instagramAccount.username,
            linkedPageId: page.pageId,
          },
        });
        instagramAccountsCount++;
        if (!primaryInstagramUsername) {
          primaryInstagramUsername = page.instagramAccount.username;
        }
      }
    }

    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');

    if (instagramAccountsCount > 0) {
      dest.searchParams.set('connection_status', 'success');
      dest.searchParams.set('provider', 'instagram');
      dest.searchParams.set('account_name', `@${primaryInstagramUsername}`);
      dest.searchParams.set('connected_count', String(instagramAccountsCount + facebookPagesCount));
    } else if (facebookPagesCount > 0) {
      dest.searchParams.set('connection_status', 'warning');
      dest.searchParams.set('provider', 'facebook');
      dest.searchParams.set('pages_connected', String(facebookPagesCount));
      dest.searchParams.set(
        'message',
        `Authorized ${facebookPagesCount} Facebook Page(s), but no linked Instagram Professional account was found. To publish to Instagram, link your Instagram Creator or Business account to your Facebook Page in Instagram Settings.`
      );
    } else {
      dest.searchParams.set('connection_status', 'error');
      dest.searchParams.set('provider', 'meta');
      dest.searchParams.set(
        'message',
        'Meta authorization completed, but no Facebook Pages or Instagram accounts were returned. Ensure your Facebook account administers at least one Page.'
      );
    }

    const response = NextResponse.redirect(dest.toString());

    // Clean up temporary OAuth cookies
    response.cookies.delete('riiqx_oauth_state');
    response.cookies.delete('riiqx_oauth_verifier');
    response.cookies.delete('riiqx_oauth_redirect_uri');
    response.cookies.delete('riiqx_oauth_provider');
    response.cookies.delete('riiqx_oauth_user');

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to finalize Meta authorization.';
    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'error');
    dest.searchParams.set('provider', 'meta');
    dest.searchParams.set('message', errorMsg);
    return NextResponse.redirect(dest.toString());
  }
}
