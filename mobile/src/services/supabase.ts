// =============================================================================
// RIIQX Mobile — Supabase Native Client
// AsyncStorage Session Persistence · SSR-Safe · Strict Anon Key · Zero Service Role
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
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

// SSR-Safe Storage wrapper preventing "window is not defined" during web static rendering
const isBrowser = typeof window !== 'undefined';

const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && !isBrowser) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && !isBrowser) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignored
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && !isBrowser) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignored
    }
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
