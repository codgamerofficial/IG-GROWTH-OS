// =============================================================================
// RIIQX — Active User Session Route Handler
// Returns the Authenticated Identity & Profile from Supabase SSR
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, ensureUserProfile } from '@/lib/riiqx/profiles';
import { verifySessionToken } from '@/lib/riiqx/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      let profile = await getUserProfile(user.id);
      if (!profile) {
        profile = await ensureUserProfile({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: profile?.displayName || user.email?.split('@')[0] || 'RIIQX User',
          role: profile?.role || 'creator',
          createdAt: user.created_at,
          avatarUrl: profile?.avatarUrl,
        },
        profile,
        provider: 'supabase',
      });
    }

    // Check fallback local session cookie (for offline/local testing)
    const localSession = req.cookies.get('riiqx_session')?.value;
    if (localSession) {
      const verified = verifySessionToken(localSession);
      if (verified.valid && verified.userId) {
        const profile = await getUserProfile(verified.userId);
        return NextResponse.json({
          authenticated: true,
          user: {
            id: verified.userId,
            email: profile?.email || 'user@riiqx.local',
            name: profile?.displayName || 'Local Creator',
            role: profile?.role || 'creator',
            createdAt: profile?.createdAt || new Date().toISOString(),
            avatarUrl: profile?.avatarUrl,
          },
          profile,
          provider: 'local_secure',
        });
      }
    }

    return NextResponse.json({
      authenticated: false,
      user: null,
      profile: null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Session verification error';
    return NextResponse.json(
      {
        authenticated: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}
