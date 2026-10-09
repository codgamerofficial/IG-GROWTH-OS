// =============================================================================
// PujaHop Kolkata Mobile: Push Notification Registration Service
// Connects Expo Mobile Device Push Tokens to Supabase (public.device_tokens)
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import { Platform } from 'react-native';
import { supabase } from './supabase';

export interface PushRegistrationResult {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Registers an Expo push token in Supabase
 */
export async function registerDevicePushToken(
  pushToken: string,
  userId?: string
): Promise<PushRegistrationResult> {
  try {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';

    // 1. Try Supabase RPC register_device_token
    const { data, error } = await supabase.rpc('register_device_token', {
      p_push_token: pushToken,
      p_platform: platform,
      p_user_id: userId || null,
    });

    if (error) {
      // Fallback direct upsert
      const { error: upsertErr } = await supabase.from('device_tokens').upsert(
        {
          push_token: pushToken,
          platform,
          user_id: userId || null,
          is_active: true,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'push_token' }
      );

      if (upsertErr) {
        return { success: false, error: upsertErr.message };
      }
    }

    return { success: true, token: pushToken };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
