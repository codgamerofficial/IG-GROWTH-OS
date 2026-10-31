import { NextRequest, NextResponse } from 'next/server';
import {
  generateOAuthState,
  createYouTubeAuthUrl,
  createMetaAuthUrl,
  createXAuthUrl,
  createLinkedInAuthUrl,
  getTrustedAppOrigin,
} from '@/lib/riiqx/social/oauth-engine';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const provider = url.searchParams.get('provider')?.toLowerCase();
  const resolvedAuthId = await resolveAuthUserId(req);
  const userId = resolvedAuthId || url.searchParams.get('userId') || 'usr_riiqx_primary';

  if (!provider || !['youtube', 'instagram', 'facebook', 'twitter', 'linkedin'].includes(provider)) {
    return NextResponse.json(
      { error: "Invalid provider specified. Must be 'youtube', 'instagram', 'facebook', 'twitter', or 'linkedin'." },
      { status: 400 }
    );
  }

  try {
    const { state, codeVerifier, codeChallenge } = generateOAuthState(provider, userId);

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
    const proto = req.headers.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
    const origin = getTrustedAppOrigin(host, proto);

    let redirectUrl = '';
    let callbackPath = '';

    if (provider === 'youtube') {
      callbackPath = '/api/social/oauth/callback/youtube';
      const redirectUri = `${origin}${callbackPath}`;
      redirectUrl = createYouTubeAuthUrl(state, codeChallenge, redirectUri);
    } else if (provider === 'instagram' || provider === 'facebook') {
      callbackPath = '/api/social/oauth/callback/meta';
      const redirectUri = `${origin}${callbackPath}`;
      redirectUrl = createMetaAuthUrl(state, redirectUri);
    } else if (provider === 'twitter') {
      callbackPath = '/api/social/oauth/callback/twitter';
      const redirectUri = `${origin}${callbackPath}`;
      redirectUrl = createXAuthUrl(state, codeChallenge, redirectUri);
    } else if (provider === 'linkedin') {
      callbackPath = '/api/social/oauth/callback/linkedin';
      const redirectUri = `${origin}${callbackPath}`;
      redirectUrl = createLinkedInAuthUrl(state, redirectUri);
    }

    const response = NextResponse.redirect(redirectUrl);

    // Set secure HTTP-only cookies with short 10-minute expiry for OAuth handshake
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 600, // 10 minutes
    };

    response.cookies.set('riiqx_oauth_state', state, cookieOptions);
    response.cookies.set('riiqx_oauth_verifier', codeVerifier, cookieOptions);
    response.cookies.set('riiqx_oauth_provider', provider, cookieOptions);
    response.cookies.set('riiqx_oauth_user', userId, cookieOptions);
    if (callbackPath) {
      response.cookies.set('riiqx_oauth_redirect_uri', `${origin}${callbackPath}`, cookieOptions);
    }

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to initialize OAuth handshake';
    return NextResponse.json(
      {
        error: errorMsg,
        provider,
        resolution: `Please ensure your OAuth credentials for ${provider} are configured in .env.local`,
      },
      { status: 400 }
    );
  }
}
