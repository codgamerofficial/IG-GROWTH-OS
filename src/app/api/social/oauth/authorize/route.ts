import { NextRequest, NextResponse } from 'next/server';
import {
  generateOAuthState,
  createYouTubeAuthUrl,
  createMetaAuthUrl,
  createXAuthUrl,
  createLinkedInAuthUrl,
} from '@/lib/riiqx/social/oauth-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const provider = url.searchParams.get('provider')?.toLowerCase();
  const userId = url.searchParams.get('userId') || 'usr_riiqx_primary';

  if (!provider || !['youtube', 'instagram', 'facebook', 'twitter', 'linkedin'].includes(provider)) {
    return NextResponse.json(
      { error: "Invalid provider specified. Must be 'youtube', 'instagram', 'facebook', 'twitter', or 'linkedin'." },
      { status: 400 }
    );
  }

  try {
    const { state, codeVerifier, codeChallenge } = generateOAuthState(provider, userId);

    let redirectUrl = '';
    if (provider === 'youtube') {
      redirectUrl = createYouTubeAuthUrl(state, codeChallenge);
    } else if (provider === 'instagram' || provider === 'facebook') {
      redirectUrl = createMetaAuthUrl(state);
    } else if (provider === 'twitter') {
      redirectUrl = createXAuthUrl(state, codeChallenge);
    } else if (provider === 'linkedin') {
      redirectUrl = createLinkedInAuthUrl(state);
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
