// =============================================================================
// RIIQX — Supabase Auth OAuth & Email Confirmation Callback Handler
// Exchanges Code for Session, Synchronizes Cookies on Redirect & Protects Navigation
// =============================================================================

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ensureUserProfile } from '@/lib/riiqx/profiles';
import { createSessionToken } from '@/lib/riiqx/auth';
import type { Database } from '@/lib/types/database.types';

export const dynamic = 'force-dynamic';

function sanitizeRedirectDestination(destination: string | null | undefined): string {
  if (!destination || typeof destination !== 'string') return '/';
  if (!destination.startsWith('/') || destination.startsWith('//') || destination.startsWith('/\\')) {
    return '/';
  }
  if (/[\u0000-\u001F\u007F-\u009F]/.test(destination)) {
    return '/';
  }
  try {
    const parsed = new URL(destination, 'http://localhost');
    if (parsed.origin !== 'http://localhost') {
      return '/';
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return '/';
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorCode = searchParams.get('error_code');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host && host.includes('localhost') ? 'http' : 'https');
  const effectiveOrigin = host ? `${proto}://${host}` : origin;

  // Read destination: check cookie first (cleanest, avoids allowlist query param issues), then searchParams fallback
  const cookieStore = cookies();
  const cookieNext = cookieStore.get('riiqx_auth_next')?.value;
  const paramNext = searchParams.get('next');
  const safeNext = sanitizeRedirectDestination(cookieNext || paramNext);

  console.info('[OAuth Callback Diagnostic]', {
    hasCode: Boolean(code),
    hasError: Boolean(error),
    safeNext,
    origin: effectiveOrigin,
  });

  // Handle provider cancellations or errors
  if (error) {
    const errorMsg = errorDescription || error;
    console.warn('[OAuth Callback] Provider returned error:', { error, errorDescription, errorCode });
    return NextResponse.redirect(
      `${effectiveOrigin}/auth/login?error=${encodeURIComponent(errorMsg)}&error_code=${encodeURIComponent(errorCode || error)}`
    );
  }

  if (code) {
    const targetUrl = `${effectiveOrigin}${safeNext}`;

    // 1. Create the redirect response object FIRST so Supabase sets auth cookies directly on it
    const response = NextResponse.redirect(targetUrl);

    // 2. Clear the temporary destination cookie
    response.cookies.delete('riiqx_auth_next');

    // 3. Create SSR server client bound directly to the response object with explicit root path
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              path: '/', // Crucial: ensure all auth tokens apply across all application routes
            });
          });
        },
      },
    });

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError && data?.user) {
        // Ensure user profile is registered in public.profiles (guarded against runtime storage glitches)
        try {
          await ensureUserProfile({
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          });
        } catch (profileErr) {
          console.warn('[OAuth Callback] User profile sync warning (proceeding with session):', profileErr);
        }

        // Set dual-mode resilient local session token with path='/'
        const token = createSessionToken(data.user.id);
        response.cookies.set('riiqx_session', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'lax',
        });

        console.info('[OAuth Callback Success] User session established for:', data.user.id);
        return response;
      }

      if (exchangeError) {
        console.error('[OAuth Callback] Supabase exchangeCodeForSession failed:', {
          name: exchangeError.name,
          status: exchangeError.status,
          message: exchangeError.message,
        });
        return NextResponse.redirect(
          `${effectiveOrigin}/auth/login?error=${encodeURIComponent(exchangeError.message)}&error_code=${encodeURIComponent(
            exchangeError.name || 'exchange_failed'
          )}`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication exchange error';
      console.error('[OAuth Callback] Unexpected error during exchange:', err);
      return NextResponse.redirect(
        `${effectiveOrigin}/auth/login?error=${encodeURIComponent(msg)}&error_code=unexpected_exchange_error`
      );
    }
  }

  // Redirect to login if code was missing from the callback URL
  console.warn('[OAuth Callback] No code parameter received in query. Full URL:', request.url);
  return NextResponse.redirect(
    `${effectiveOrigin}/auth/login?error=${encodeURIComponent(
      'No authorization code was returned by the identity provider. Please sign in again.'
    )}&error_code=missing_code`
  );
}
