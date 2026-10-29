// =============================================================================
// RIIQX — Supabase Server Client (SSR-Compatible)
// Next.js App Router Server Actions, Route Handlers & Server Components
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  serviceRoleKey !== 'your-supabase-service-role-key'
);

/**
 * Creates an SSR-compatible server client for Route Handlers and Server Actions
 */
export async function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored if called from a Server Component where cookies are read-only
        }
      },
    },
  });
}

/**
 * Backwards-compatible alias for existing server usages
 */
export async function getServerSupabase() {
  return createClient();
}

/**
 * Elevated Service Role client — NEVER expose to the browser
 */
export function getServiceSupabase() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL SECURITY VIOLATION: Service role Supabase client accessed on browser!');
  }

  if (!isServerSupabaseConfigured) {
    return null;
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Helper to get the authenticated user from the server session
 */
export async function getAuthUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}
