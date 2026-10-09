// =============================================================================
// PujaHop Kolkata: Supabase Server Client
// Server-side Route Handler & Server Component Client
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  serviceRoleKey !== 'your-supabase-service-role-key'
);

export function getServerSupabase() {
  return createClient<Database>(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function getServiceSupabase() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL SECURITY VIOLATION: Service role Supabase client accessed on browser!');
  }

  if (!isServerSupabaseConfigured) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
