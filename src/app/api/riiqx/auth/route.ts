// =============================================================================
// RIIQX — Master Authentication API Route Handler
// Real Supabase Auth Integration with Dual-Mode Resilient Local Persistence
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  saveLocalCredentials,
  verifyLocalCredentials,
  createSessionToken,
  verifySessionToken,
} from '@/lib/riiqx/auth';
import { getUserProfile, upsertUserProfile, ensureUserProfile } from '@/lib/riiqx/profiles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      const profile = await getUserProfile(user.id);
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

    // Verify local session cookie
    const localToken = req.cookies.get('riiqx_session')?.value;
    if (localToken) {
      const verified = verifySessionToken(localToken);
      if (verified.valid && verified.userId) {
        const profile = await getUserProfile(verified.userId);
        return NextResponse.json({
          authenticated: true,
          user: {
            id: verified.userId,
            email: profile?.email || 'user@riiqx.local',
            name: profile?.displayName || 'RIIQX User',
            role: profile?.role || 'creator',
            createdAt: profile?.createdAt || new Date().toISOString(),
            avatarUrl: profile?.avatarUrl,
          },
          profile,
          provider: 'local_secure',
        });
      }
    }

    // Unauthenticated
    return NextResponse.json({
      authenticated: false,
      user: null,
      profile: null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Session verification error';
    return NextResponse.json({ authenticated: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, email, password, name } = body;

    if (action === 'signout') {
      const supabase = await createClient();
      await supabase.auth.signOut();
      const res = NextResponse.json({ success: true, message: 'Signed out successfully' });
      res.cookies.set('riiqx_session', '', { path: '/', maxAge: 0 });
      return res;
    }

    // -------------------------------------------------------------------------
    // ACTION: DEMO LOGIN (DISABLED FOR SECURITY)
    // -------------------------------------------------------------------------
    if (action === 'demo_login') {
      return NextResponse.json(
        { error: 'Unauthorized: Demo login bypass has been removed for production security.' },
        { status: 403 }
      );
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // -------------------------------------------------------------------------
    // ACTION: REGISTER
    // -------------------------------------------------------------------------
    if (action === 'register') {
      const supabase = await createClient();
      let supabaseSuccess = false;
      let registeredUser: any = null;
      let requiresConfirmation = false;

      try {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: name || normalizedEmail.split('@')[0],
              display_name: name || normalizedEmail.split('@')[0],
            },
          },
        });

        if (error) {
          // If Supabase returned an explicit error (e.g. user already registered or weak password)
          if (!error.message.includes('fetch failed') && !error.message.includes('ENOTFOUND')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
          }
        } else if (data?.user) {
          supabaseSuccess = true;
          registeredUser = data.user;
          requiresConfirmation = !data.session;

          await ensureUserProfile({
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
          });
        }
      } catch {
        // Fall through to resilient local vault
      }

      if (!supabaseSuccess) {
        // Save to local credential vault
        const localCred = saveLocalCredentials(normalizedEmail, password);
        const profile = await upsertUserProfile({
          id: localCred.userId,
          email: normalizedEmail,
          displayName: name || normalizedEmail.split('@')[0],
          role: 'creator',
        });

        const token = createSessionToken(localCred.userId);
        const res = NextResponse.json({
          success: true,
          user: {
            id: localCred.userId,
            email: normalizedEmail,
            name: profile.displayName,
            role: profile.role,
            createdAt: localCred.createdAt,
          },
          token,
          requiresConfirmation: false,
          provider: 'local_secure',
        });

        res.cookies.set('riiqx_session', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'lax',
        });

        return res;
      }

      const token = createSessionToken(registeredUser.id);
      const res = NextResponse.json({
        success: true,
        user: {
          id: registeredUser.id,
          email: registeredUser.email,
          name: name || normalizedEmail.split('@')[0],
          role: 'creator',
          createdAt: registeredUser.created_at,
        },
        token,
        requiresConfirmation,
        provider: 'supabase',
      });

      res.cookies.set('riiqx_session', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });

      return res;
    }

    // -------------------------------------------------------------------------
    // ACTION: LOGIN
    // -------------------------------------------------------------------------
    if (action === 'login') {
      const supabase = await createClient();
      let supabaseSuccess = false;
      let authenticatedUser: any = null;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          // If Supabase gave an explicit invalid credentials error
          if (!error.message.includes('fetch failed') && !error.message.includes('ENOTFOUND')) {
            return NextResponse.json({ error: error.message }, { status: 401 });
          }
        } else if (data?.user) {
          supabaseSuccess = true;
          authenticatedUser = data.user;
        }
      } catch {
        // Fall through to resilient local vault
      }

      if (!supabaseSuccess) {
        // Verify against local PBKDF2 credential vault
        const validCred = verifyLocalCredentials(normalizedEmail, password);
        if (!validCred) {
          return NextResponse.json(
            { error: 'Invalid email or password. Please verify your credentials.' },
            { status: 401 }
          );
        }

        const profile = await getUserProfile(validCred.userId);
        const token = createSessionToken(validCred.userId);

        const res = NextResponse.json({
          success: true,
          user: {
            id: validCred.userId,
            email: validCred.email,
            name: profile?.displayName || validCred.email.split('@')[0],
            role: profile?.role || 'creator',
            createdAt: validCred.createdAt,
          },
          token,
          provider: 'local_secure',
        });

        res.cookies.set('riiqx_session', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
          sameSite: 'lax',
        });

        return res;
      }

      const profile = await getUserProfile(authenticatedUser.id);
      const token = createSessionToken(authenticatedUser.id);

      const res = NextResponse.json({
        success: true,
        user: {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          name: profile?.displayName || authenticatedUser.email.split('@')[0],
          role: profile?.role || 'creator',
          createdAt: authenticatedUser.created_at,
          avatarUrl: profile?.avatarUrl,
        },
        token,
        provider: 'supabase',
      });

      res.cookies.set('riiqx_session', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });

      return res;
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Auth error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
