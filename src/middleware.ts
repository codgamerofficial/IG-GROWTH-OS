// =============================================================================
// RIIQX — Next.js Application Middleware
// Protects Private Modules and Refreshes Supabase SSR Auth Cookies
// =============================================================================

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public and static assets (svg, png, jpg, jpeg, gif, webp, mp4, webm, css, js, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|css|js|html|txt|xml)$).*)',
  ],
};
