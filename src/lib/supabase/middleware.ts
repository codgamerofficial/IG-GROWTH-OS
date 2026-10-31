// =============================================================================
// RIIQX — Supabase SSR Middleware Session Handler & Route Guard
// Manages Cookie-Backed Sessions and Protects Private Application Routes
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Public routes accessible without authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/confirm',
  '/api/auth',
  '/api/riiqx/auth',
  '/api/riiqx/chat',
  '/api/riiqx/health',
  '/api/riiqx/models',
  '/api/riiqx/tasks',
  '/api/creator',
  '/api/health',
  '/api/social/oauth',
  '/api/social/accounts',
  '/api/social/analytics',
  '/terms',
  '/privacy',
  '/about',
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // Static assets and internal next paths bypass middleware
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // favicon.ico, images, fonts, etc.
  ) {
    return supabaseResponse;
  }

  // Create an SSR client with request/response cookie binding
  const supabase = createServerClient<Database>(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Check Supabase authenticated user
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch {
    // If Supabase remote service is unreachable, check local session cookie fallback
    user = null;
  }

  // Check fallback local session cookie (for offline/local testing)
  const localSession = request.cookies.get('riiqx_session')?.value;
  const isAuthenticated = Boolean(user || localSession);

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));

  // 1. Unauthenticated user trying to access private route
  if (!isAuthenticated && !isPublicPath) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const loginUrl = new URL('/auth/login', request.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('next', pathname);
    }
    const redirectRes = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie.name, cookie.value);
    });
    return redirectRes;
  }

  // 2. Authenticated user trying to access login/signup -> Redirect to App
  if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    const nextParam = request.nextUrl.searchParams.get('next');
    const redirectUrl = new URL(nextParam && nextParam.startsWith('/') ? nextParam : '/', request.url);
    const redirectRes = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie.name, cookie.value);
    });
    return redirectRes;
  }

  return supabaseResponse;
}
