// =============================================================================
// RIIQX — Sign Out Route Handler
// Clears Supabase Session and Deletes All Session Cookies
// =============================================================================

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

    const cookieStore = cookies();
    cookieStore.getAll().forEach((c) => {
      if (
        c.name.includes('supabase') ||
        c.name.includes('sb-') ||
        c.name === 'riiqx_session' ||
        c.name === 'riiqx_auth_next'
      ) {
        response.cookies.set(c.name, '', {
          path: '/',
          maxAge: 0,
        });
      }
    });

    // Explicitly guarantee riiqx_session is purged
    response.cookies.set('riiqx_session', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Sign out error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
