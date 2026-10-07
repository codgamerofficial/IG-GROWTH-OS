import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  serviceRoleKey &&
  serviceRoleKey !== 'your-supabase-service-role-key'
);

export function getServiceSupabase() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL SECURITY VIOLATION: Service role Supabase client accessed on browser!');
  }

  if (!isServerSupabaseConfigured) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
