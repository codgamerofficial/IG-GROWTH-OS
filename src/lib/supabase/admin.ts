// =============================================================================
// PujaHop Kolkata: Supabase Admin / Service Role Client
// STRICT SERVER-SIDE ONLY • NEVER BUNDLED IN CLIENT JAVASCRIPT
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isServiceRoleConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  return !url.includes('mock') && !key.includes('mock');
};

export const createAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: createAdminClient cannot be called from the browser client.');
  }

  if (!serviceRoleKey) {
    throw new Error('FATAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY is missing in server environment.');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
