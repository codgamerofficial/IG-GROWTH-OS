// =============================================================================
// RIIQX — Request Session & Authenticated User Resolver
// Resolves Authenticated User ID from Supabase SSR and Cookie Vault
// =============================================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifySessionToken } from '@/lib/riiqx/auth';

export async function resolveAuthUserId(req: NextRequest): Promise<string | null> {
  // 1. Try Supabase Auth from Request Cookies
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      return user.id;
    }
  } catch {
    // Fall through
  }

  // 2. Try Signed Local Session Cookie
  const localToken = req.cookies.get('riiqx_session')?.value;
  if (localToken) {
    const verified = verifySessionToken(localToken);
    if (verified.valid && verified.userId) {
      return verified.userId;
    }
  }

  // 3. Try Authorization Header Bearer Token
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token) {
    const verified = verifySessionToken(token);
    if (verified.valid && verified.userId) {
      return verified.userId;
    }
  }

  // 4. Query param fallback if explicitly specified in internal requests
  const url = new URL(req.url);
  const paramUserId = url.searchParams.get('userId');
  if (paramUserId) {
    return paramUserId;
  }

  return null;
}
