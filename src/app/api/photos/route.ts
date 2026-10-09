// =============================================================================
// PujaHop Kolkata: Community Darshan Photo Gallery & Direct Upload API
// Direct Uploads to Supabase Storage 'pandal-gallery' with PostGIS Geocoding
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { createAdminClient, isServiceRoleConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pandalId = searchParams.get('pandal_id');
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const client = isServiceRoleConfigured() ? createAdminClient() : supabase;

    let query = client
      .from('pandal_photos')
      .select('id, pandal_id, photo_url, caption, taken_at, latitude, longitude, created_at, source, is_verified')
      .eq('is_verified', true)
      .eq('is_flagged', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (pandalId) {
      query = query.eq('pandal_id', pandalId);
    }

    const { data: photos, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: photos?.length || 0,
      photos: photos || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable' },
        { status: 503 }
      );
    }

    const client = isServiceRoleConfigured() ? createAdminClient() : supabase;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const pandalId = formData.get('pandal_id') as string | null;
    const caption = (formData.get('caption') as string | null) || 'Darshan 2026';
    const latitudeStr = formData.get('latitude') as string | null;
    const longitudeStr = formData.get('longitude') as string | null;
    const takenAt = (formData.get('taken_at') as string | null) || new Date().toISOString();
    const exifRaw = formData.get('exif_metadata') as string | null;

    if (!file || !pandalId) {
      return NextResponse.json(
        { success: false, error: 'Both file and pandal_id are required' },
        { status: 400 }
      );
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, or WebP images are allowed' },
        { status: 400 }
      );
    }

    // File size limit (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image exceeds maximum 20MB limit' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${pandalId}/${Date.now()}_${cleanFileName}`;

    // Upload ArrayBuffer to Supabase Storage bucket 'pandal-gallery'
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await client.storage
      .from('pandal-gallery')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { success: false, error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Retrieve Public URL
    const { data: urlData } = client.storage
      .from('pandal-gallery')
      .getPublicUrl(storagePath);

    const photoUrl = urlData.publicUrl;

    const lat = latitudeStr ? parseFloat(latitudeStr) : null;
    const lng = longitudeStr ? parseFloat(longitudeStr) : null;
    let exifMetadata = {};
    try {
      if (exifRaw) exifMetadata = JSON.parse(exifRaw);
    } catch {
      // ignore json parse error
    }

    // Insert record in public.pandal_photos (trigger will automatically calculate ST_Point geography)
    const { data: newPhoto, error: insertError } = await client
      .from('pandal_photos')
      .insert({
        pandal_id: pandalId,
        photo_url: photoUrl,
        caption,
        taken_at: takenAt,
        latitude: lat,
        longitude: lng,
        exif_metadata: exifMetadata,
        storage_path: storagePath,
        file_size: file.size,
        mime_type: file.type,
        source: 'COMMUNITY_DARSHAN',
        is_verified: true,
        is_flagged: false,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: `Database insert failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Darshan photo uploaded and geocoded successfully',
      photo: newPhoto,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
