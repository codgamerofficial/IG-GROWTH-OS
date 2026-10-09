// =============================================================================
// PujaHop Kolkata Mobile: Supabase Native Client
// AsyncStorage Session Persistence • Strict Anon Key Only • Zero Service Role
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database.types';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ojtngzqsrdralrhipjzt.supabase.co';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdG5nenFzcmRyYWxyaGlwanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODA1NzcsImV4cCI6MjEwNjk1NjU3N30.TuZdeSyZpWSYJmUz6VP3EJPduM9t5dxeV1rPQrrnMko';

export const isMobileSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl && supabaseAnonKey) &&
    !supabaseUrl.includes('mock') &&
    !supabaseAnonKey.includes('mock')
  );
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
