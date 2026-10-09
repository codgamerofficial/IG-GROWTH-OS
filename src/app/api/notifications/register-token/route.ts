// =============================================================================
// PujaHop Kolkata: Device Push Token Registration API
// Binds Web Push and Expo Mobile Tokens to Supabase (public.device_tokens)
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { createAdminClient, isServiceRoleConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { push_token, platform, user_id } = body;

    if (!push_token || typeof push_token !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid push_token is required' },
        { status: 400 }
      );
    }

    const validPlatform = ['android', 'ios', 'web'].includes(platform) ? platform : 'web';

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const client = isServiceRoleConfigured() ? createAdminClient() : supabase;

    // Use Postgres RPC function register_device_token
    const { data, error } = await client.rpc('register_device_token', {
      p_push_token: push_token,
      p_platform: validPlatform,
      p_user_id: user_id || null,
    });

    if (error) {
      // Fallback direct upsert if RPC has permission constraint
      const { data: upsertData, error: upsertErr } = await client
        .from('device_tokens')
        .upsert(
          {
            push_token,
            platform: validPlatform,
            user_id: user_id || null,
            is_active: true,
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: 'push_token' }
        )
        .select()
        .single();

      if (upsertErr) {
        return NextResponse.json(
          { success: false, error: upsertErr.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Device token registered successfully',
        token_id: upsertData.id,
        platform: validPlatform,
        registered_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Device token registered successfully',
      data,
      platform: validPlatform,
      registered_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
