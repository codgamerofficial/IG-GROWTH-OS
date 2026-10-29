// =============================================================================
// RIIQX — Sign Out Route Handler
// Clears Supabase Session and Deletes Session Cookies
// =============================================================================

import { NextResponse } from 'next/server';
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

    // Clear session cookies
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
