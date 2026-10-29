import { NextRequest, NextResponse } from 'next/server';
import { exchangeMetaCode } from '@/lib/riiqx/social/oauth-engine';
import { saveConnectedAccount } from '@/lib/riiqx/social/account-repository';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  const cookieState = req.cookies.get('riiqx_oauth_state')?.value;
  const userId = req.cookies.get('riiqx_oauth_user')?.value || 'usr_riiqx_primary';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
    const { longLivedToken, expiresIn, accounts } = await exchangeMetaCode(code);
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    let connectedCount = 0;

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
      connectedCount++;

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
        connectedCount++;
      }
    }

    const dest = new URL(appUrl);
    dest.searchParams.set('tab', 'integrations');
    dest.searchParams.set('connection_status', 'success');
    dest.searchParams.set('provider', 'meta');
    dest.searchParams.set('connected_count', String(connectedCount));

    const response = NextResponse.redirect(dest.toString());

    // Clean up temporary OAuth cookies
    response.cookies.delete('riiqx_oauth_state');
    response.cookies.delete('riiqx_oauth_verifier');
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
