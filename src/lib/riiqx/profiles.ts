// =============================================================================
// RIIQX — User Profile Management Service
// Interacts with public.profiles in Supabase with Local Encrypted Persistence Fallback
// =============================================================================

import { getServiceSupabase } from '@/lib/supabase/server';
import { getSafeTempFilePath, safeReadJson, safeWriteJson } from './temp-storage';

export interface RiiqxProfile {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'bn' | 'hi';
  role: 'creator' | 'developer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORE_PATH = getSafeTempFilePath('user_profiles_store.json');
const inMemoryProfiles: Record<string, RiiqxProfile> = {};

function readLocalProfiles(): Record<string, RiiqxProfile> {
  const disk = safeReadJson<Record<string, RiiqxProfile>>(LOCAL_STORE_PATH, {});
  return { ...inMemoryProfiles, ...disk };
}

function writeLocalProfiles(data: Record<string, RiiqxProfile>) {
  Object.assign(inMemoryProfiles, data);
  safeWriteJson(LOCAL_STORE_PATH, data);
}

/**
 * Retrieves a user's profile by their Supabase Auth User ID
 */
export async function getUserProfile(userId: string): Promise<RiiqxProfile | null> {
  if (!userId) return null;

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          displayName: data.display_name || 'RIIQX Creator',
          avatarUrl: data.avatar_url || undefined,
          preferredLanguage: (data.preferred_language as 'en' | 'bn' | 'hi') || 'en',
          role: (data.role as 'creator' | 'developer' | 'admin') || 'creator',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // Fall through to local store
    }
  }

  // Local store lookup
  const local = readLocalProfiles();
  return local[userId] || null;
}

/**
 * Creates or updates a user profile
 */
export async function upsertUserProfile(profile: {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  preferredLanguage?: 'en' | 'bn' | 'hi';
  role?: 'creator' | 'developer' | 'admin';
}): Promise<RiiqxProfile> {
  const now = new Date().toISOString();
  const existing = await getUserProfile(profile.id);

  const merged: RiiqxProfile = {
    id: profile.id,
    email: profile.email || existing?.email,
    displayName: profile.displayName || existing?.displayName || profile.email?.split('@')[0] || 'RIIQX Creator',
    avatarUrl: profile.avatarUrl || existing?.avatarUrl,
    preferredLanguage: profile.preferredLanguage || existing?.preferredLanguage || 'en',
    role: profile.role || existing?.role || 'creator',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await (supabase as any).from('profiles').upsert(
        {
          id: merged.id,
          display_name: merged.displayName,
          avatar_url: merged.avatarUrl || null,
          preferred_language: merged.preferredLanguage,
          role: merged.role,
          updated_at: now,
        },
        { onConflict: 'id' }
      );
    } catch {
      // Fall through to local store
    }
  }

  const local = readLocalProfiles();
  local[merged.id] = merged;
  writeLocalProfiles(local);

  return merged;
}

/**
 * Ensures a profile exists for an authenticated user, creating one if absent
 */
export async function ensureUserProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}): Promise<RiiqxProfile> {
  const existing = await getUserProfile(user.id);
  if (existing) {
    return existing;
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'RIIQX Creator';

  const avatarUrl = user.user_metadata?.avatar_url || undefined;
  const preferredLanguage = user.user_metadata?.preferred_language || 'en';

  return await upsertUserProfile({
    id: user.id,
    email: user.email,
    displayName,
    avatarUrl,
    preferredLanguage,
    role: 'creator',
  });
}
