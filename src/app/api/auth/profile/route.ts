// =============================================================================
// RIIQX — Profile Management API Route Handler
// Handles Profile Updates with Row Level Security (RLS)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, upsertUserProfile } from '@/lib/riiqx/profiles';
import { verifySessionToken } from '@/lib/riiqx/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetUserId = user?.id;

    if (!targetUserId) {
      const localToken = req.cookies.get('riiqx_session')?.value;
      if (localToken) {
        const verified = verifySessionToken(localToken);
        if (verified.valid) {
          targetUserId = verified.userId;
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(targetUserId);
    return NextResponse.json({ success: true, profile });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching profile';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let targetUserId = user?.id;

    if (!targetUserId) {
      const localToken = req.cookies.get('riiqx_session')?.value;
      if (localToken) {
        const verified = verifySessionToken(localToken);
        if (verified.valid) {
          targetUserId = verified.userId;
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { displayName, avatarUrl, preferredLanguage, role } = body;

    const updated = await upsertUserProfile({
      id: targetUserId,
      displayName,
      avatarUrl,
      preferredLanguage,
      role,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating profile';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
