-- =============================================================================
-- PujaHop Kolkata: Autonomous Migration 3
-- PWA Offline • Push Notification Tokens • Pandal Gallery EXIF Geocoding
-- =============================================================================

-- 1. Enhance pandal_photos Table with PostGIS Geocoding & EXIF Metadata
ALTER TABLE public.pandal_photos 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6),
    ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6),
    ADD COLUMN IF NOT EXISTS location extensions.geography(Point, 4326),
    ADD COLUMN IF NOT EXISTS exif_metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS storage_path TEXT,
    ADD COLUMN IF NOT EXISTS file_size INTEGER,
    ADD COLUMN IF NOT EXISTS mime_type TEXT,
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false;

-- Auto-populate spatial location when latitude and longitude are supplied
CREATE OR REPLACE FUNCTION public.set_pandal_photo_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location := extensions.ST_SetSRID(extensions.ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pandal_photo_location ON public.pandal_photos;
CREATE TRIGGER trg_pandal_photo_location
    BEFORE INSERT OR UPDATE OF latitude, longitude
    ON public.pandal_photos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_pandal_photo_location();

-- Spatial & Filter Indexes
CREATE INDEX IF NOT EXISTS idx_pandal_photos_pandal_id ON public.pandal_photos(pandal_id);
CREATE INDEX IF NOT EXISTS idx_pandal_photos_location ON public.pandal_photos USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_pandal_photos_created_at ON public.pandal_photos(created_at DESC);

-- Enable RLS on pandal_photos
ALTER TABLE public.pandal_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified pandal photos" ON public.pandal_photos;
CREATE POLICY "Public can view verified pandal photos" ON public.pandal_photos
    FOR SELECT USING (is_verified = true AND is_flagged = false);

DROP POLICY IF EXISTS "Anyone can upload pandal photos" ON public.pandal_photos;
CREATE POLICY "Anyone can upload pandal photos" ON public.pandal_photos
    FOR INSERT WITH CHECK (pandal_id IS NOT NULL AND photo_url IS NOT NULL);

-- 2. Storage Bucket 'pandal-gallery' Permissions
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'pandal-gallery',
    'pandal-gallery',
    true,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage Object Policies for pandal-gallery
DROP POLICY IF EXISTS "Public can view gallery photos" ON storage.objects;
CREATE POLICY "Public can view gallery photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'pandal-gallery');

DROP POLICY IF EXISTS "Anyone can upload to gallery bucket" ON storage.objects;
CREATE POLICY "Anyone can upload to gallery bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'pandal-gallery');

-- 3. Device Tokens RLS & Management RPC
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous token registration" ON public.device_tokens;
CREATE POLICY "Allow anonymous token registration" ON public.device_tokens
    FOR ALL USING (true) WITH CHECK (true);

-- RPC: Upsert Device Token (Handles Web Push & Expo Push Tokens idempotently)
CREATE OR REPLACE FUNCTION public.register_device_token(
    p_push_token TEXT,
    p_platform TEXT,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_token_id UUID;
BEGIN
    INSERT INTO public.device_tokens (push_token, platform, user_id, last_seen_at, is_active)
    VALUES (p_push_token, p_platform, p_user_id, CURRENT_TIMESTAMP, true)
    ON CONFLICT (push_token) DO UPDATE SET
        last_seen_at = CURRENT_TIMESTAMP,
        is_active = true,
        user_id = COALESCE(p_user_id, public.device_tokens.user_id)
    RETURNING id INTO v_token_id;

    RETURN jsonb_build_object(
        'success', true,
        'token_id', v_token_id,
        'registered_at', CURRENT_TIMESTAMP
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Broadcast Emergency Notification
CREATE OR REPLACE FUNCTION public.broadcast_emergency_notification(
    p_title TEXT,
    p_body TEXT,
    p_type TEXT,
    p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    v_active_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_active_count
    FROM public.device_tokens
    WHERE is_active = true;

    -- Return stats for sender
    RETURN jsonb_build_object(
        'success', true,
        'broadcast_type', p_type,
        'recipients_count', v_active_count,
        'dispatched_at', CURRENT_TIMESTAMP
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PostGIS RPC: Get Nearby Community Darshan Photos
CREATE OR REPLACE FUNCTION public.get_nearby_pandal_photos(
    p_latitude NUMERIC,
    p_longitude NUMERIC,
    p_radius_meters INTEGER DEFAULT 2000,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    pandal_id UUID,
    photo_url TEXT,
    caption TEXT,
    taken_at TIMESTAMP WITH TIME ZONE,
    latitude NUMERIC,
    longitude NUMERIC,
    distance_meters NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ph.id,
        ph.pandal_id,
        ph.photo_url,
        ph.caption,
        ph.taken_at,
        ph.latitude,
        ph.longitude,
        ROUND(extensions.ST_Distance(
            ph.location,
            extensions.ST_SetSRID(extensions.ST_MakePoint(p_longitude, p_latitude), 4326)::extensions.geography
        )::NUMERIC, 1) AS distance_meters,
        ph.created_at
    FROM public.pandal_photos ph
    WHERE ph.is_verified = true
      AND ph.is_flagged = false
      AND ph.location IS NOT NULL
      AND extensions.ST_DWithin(
          ph.location,
          extensions.ST_SetSRID(extensions.ST_MakePoint(p_longitude, p_latitude), 4326)::extensions.geography,
          p_radius_meters
      )
    ORDER BY ph.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;
