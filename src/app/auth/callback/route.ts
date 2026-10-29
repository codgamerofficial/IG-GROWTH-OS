// =============================================================================
// RIIQX — Supabase Auth OAuth & Email Confirmation Callback Handler
// Exchanges Code for Session, Seeds User Profile & Guards Against Open Redirects
// =============================================================================

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/lib/riiqx/profiles';
import { createSessionToken } from '@/lib/riiqx/auth';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle provider cancellations or errors (e.g. user dismissed Google modal)
  if (error) {
    const errorMsg = errorDescription || error;
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(errorMsg)}`);
  }

  // Sanitize target destination to prevent open redirects
  const safeNext = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && data?.user) {
        // Ensure user profile is registered in public.profiles
        await ensureUserProfile({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        });

        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        const targetUrl = isLocalEnv
          ? `${origin}${safeNext}`
          : forwardedHost
          ? `https://${forwardedHost}${safeNext}`
          : `${origin}${safeNext}`;

        const response = NextResponse.redirect(targetUrl);

        // Set dual-mode resilient local session token
        const token = createSessionToken(data.user.id);
        response.cookies.set('riiqx_session', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'lax',
        });

        return response;
      }

      if (exchangeError) {
        return NextResponse.redirect(
          `${origin}/auth/login?error=${encodeURIComponent(exchangeError.message || 'auth_exchange_failed')}`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication exchange error';
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
    }
  }

  // Redirect to login with error if verification/exchange fails
  return NextResponse.redirect(`${origin}/auth/login?error=auth_exchange_failed`);
}
