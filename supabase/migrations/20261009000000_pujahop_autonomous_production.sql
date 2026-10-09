-- =============================================================================
-- PujaHop Kolkata: Master Autonomous Production Migration
-- Specification: Section 5-25 of PujaHop Production Master Specification
-- Schema Version: 20261009000000
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;

-- -----------------------------------------------------------------------------
-- 1. REUSABLE TRIGGER FUNCTIONS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. SOURCES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    publisher TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('OFFICIAL', 'POLICE_GUIDE', 'GOVERNMENT_CIRCULAR', 'METRO_CIRCULAR', 'NEWS_MEDIA', 'USER_REPORT', 'ON_GROUND_SURVEY', 'COMMUNITY_VERIFIED')),
    base_url TEXT,
    trust_level TEXT NOT NULL DEFAULT 'HIGH' CHECK (trust_level IN ('VERY_HIGH', 'HIGH', 'MEDIUM', 'UNVERIFIED')),
    is_official BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.source_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    content_hash TEXT,
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    raw_reference JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'bn')),
    walking_tolerance TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (walking_tolerance IN ('LOW', 'MEDIUM', 'HIGH')),
    transport_preference TEXT NOT NULL DEFAULT 'METRO_AND_WALK' CHECK (transport_preference IN ('METRO_AND_WALK', 'WALK_ONLY', 'CAB_PREFERRED')),
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure columns exist in profiles if already created
DO $$
BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS walking_tolerance TEXT DEFAULT 'MEDIUM';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transport_preference TEXT DEFAULT 'METRO_AND_WALK';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 4. METRO STATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metro_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    line TEXT NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    location extensions.geography(Point, 4326),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile metro_stations columns
DO $$
BEGIN
    ALTER TABLE public.metro_stations ADD COLUMN IF NOT EXISTS line TEXT;
    ALTER TABLE public.metro_stations ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
    ALTER TABLE public.metro_stations ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);
    ALTER TABLE public.metro_stations ADD COLUMN IF NOT EXISTS location extensions.geography(Point, 4326);
    ALTER TABLE public.metro_stations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    ALTER TABLE public.metro_stations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    -- Populate if lat/lng were previously used
    UPDATE public.metro_stations SET latitude = lat WHERE latitude IS NULL AND lat IS NOT NULL;
    UPDATE public.metro_stations SET longitude = lng WHERE longitude IS NULL AND lng IS NOT NULL;
    UPDATE public.metro_stations SET line = line_id WHERE line IS NULL AND line_id IS NOT NULL;
    UPDATE public.metro_stations SET location = extensions.ST_SetSRID(extensions.ST_MakePoint(longitude, latitude), 4326) WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 5. PANDALS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pandals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    location extensions.geography(Point, 4326),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'EARLY_OPENING', 'INAUGURATION', 'UNDER_PREPARATION', 'UNKNOWN', 'CLOSED')),
    theme TEXT NOT NULL DEFAULT 'Not officially announced',
    heritage TEXT,
    category TEXT NOT NULL DEFAULT 'SARBOJANIN',
    nearest_metro_station_id UUID REFERENCES public.metro_stations(id) ON DELETE SET NULL,
    image_url TEXT,
    cover_image_url TEXT,
    puja_score NUMERIC(3,1) DEFAULT 8.0,
    score_methodology TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile pandals columns safely
DO $$
BEGIN
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6);
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6);
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS location extensions.geography(Point, 4326);
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS heritage TEXT;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'SARBOJANIN';
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS nearest_metro_station_id UUID REFERENCES public.metro_stations(id) ON DELETE SET NULL;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS puja_score NUMERIC(3,1) DEFAULT 8.0;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS score_methodology TEXT;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    ALTER TABLE public.pandals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

    -- Backfill from previous columns if existing
    UPDATE public.pandals SET latitude = lat WHERE latitude IS NULL AND lat IS NOT NULL;
    UPDATE public.pandals SET longitude = lng WHERE longitude IS NULL AND lng IS NOT NULL;
    UPDATE public.pandals SET is_active = active WHERE is_active IS NULL AND active IS NOT NULL;
    UPDATE public.pandals SET puja_score = overall_score WHERE puja_score IS NULL AND overall_score IS NOT NULL;
    UPDATE public.pandals SET location = extensions.ST_SetSRID(extensions.ST_MakePoint(longitude, latitude), 4326) WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 6. PANDAL SOURCES, STATUS HISTORY, THEMES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pandal_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'OFFICIAL',
    publisher TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    verification_method TEXT DEFAULT 'DOCUMENT_VERIFIED',
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile pandal_sources columns safely
DO $$
BEGIN
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL;
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS publisher TEXT;
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS valid_from TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE;
    ALTER TABLE public.pandal_sources ADD COLUMN IF NOT EXISTS verification_method TEXT DEFAULT 'DOCUMENT_VERIFIED';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.pandal_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'EARLY_OPENING', 'INAUGURATION', 'UNDER_PREPARATION', 'UNKNOWN', 'CLOSED')),
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    effective_until TIMESTAMP WITH TIME ZONE,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.pandal_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    theme TEXT NOT NULL,
    description TEXT,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 7. METRO SCHEDULE SNAPSHOTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metro_schedule_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id UUID REFERENCES public.metro_stations(id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    day_type TEXT NOT NULL DEFAULT 'REGULAR' CHECK (day_type IN ('REGULAR', 'PUJA_SPECIAL', 'MAHALAYA', 'SAPTAMI_NIGHT', 'ASHTAMI_NIGHT', 'NAVAMI_NIGHT', 'DASHAMI')),
    first_train TIME,
    last_train TIME,
    frequency_notes TEXT,
    special_service BOOLEAN NOT NULL DEFAULT false,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. TRAFFIC ADVISORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.traffic_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    area TEXT NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MODERATE' CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. WEATHER SNAPSHOTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    latitude NUMERIC(9,6) NOT NULL DEFAULT 22.5726,
    longitude NUMERIC(9,6) NOT NULL DEFAULT 88.3639,
    forecast_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature NUMERIC(4,1) NOT NULL,
    feels_like NUMERIC(4,1),
    rain_probability INTEGER DEFAULT 0,
    precipitation NUMERIC(4,1) DEFAULT 0.0,
    wind_speed NUMERIC(4,1) DEFAULT 0.0,
    weather_code INTEGER DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'Open-Meteo',
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 hours'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile weather_snapshots columns
DO $$
BEGIN
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6) DEFAULT 22.5726;
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6) DEFAULT 88.3639;
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS forecast_for TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS temperature NUMERIC(4,1);
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS feels_like NUMERIC(4,1);
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS rain_probability INTEGER DEFAULT 0;
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS precipitation NUMERIC(4,1) DEFAULT 0.0;
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS wind_speed NUMERIC(4,1) DEFAULT 0.0;
    ALTER TABLE public.weather_snapshots ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 hours');
    UPDATE public.weather_snapshots SET temperature = temperature_c WHERE temperature IS NULL AND temperature_c IS NOT NULL;
    UPDATE public.weather_snapshots SET feels_like = apparent_temp_c WHERE feels_like IS NULL AND apparent_temp_c IS NOT NULL;
    UPDATE public.weather_snapshots SET precipitation = precipitation_mm WHERE precipitation IS NULL AND precipitation_mm IS NOT NULL;
    UPDATE public.weather_snapshots SET wind_speed = wind_speed_kmh WHERE wind_speed IS NULL AND wind_speed_kmh IS NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 10. CROWD REPORTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crowd_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE CASCADE,
    crowd_level TEXT NOT NULL CHECK (crowd_level IN ('LOW', 'MODERATE', 'HIGH', 'EXTREME', 'UNKNOWN')),
    reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source_type TEXT NOT NULL DEFAULT 'USER_REPORT' CHECK (source_type IN ('USER_REPORT', 'POLICE_NOTICE', 'ADMIN_VERIFIED', 'SENSOR')),
    confidence NUMERIC(3,2) NOT NULL DEFAULT 0.85 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours'),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile crowd_reports columns
DO $$
BEGIN
    ALTER TABLE public.crowd_reports ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '2 hours');
    ALTER TABLE public.crowd_reports ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    ALTER TABLE public.crowd_reports ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 11. FOOD PLACES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('BIRYANI', 'ROLL', 'STREET_FOOD', 'SWEETS', 'COFFEE', 'RESTAURANT', 'HERITAGE_CABIN')),
    address TEXT NOT NULL,
    latitude NUMERIC(9,6) NOT NULL,
    longitude NUMERIC(9,6) NOT NULL,
    location extensions.geography(Point, 4326),
    phone TEXT,
    website TEXT,
    price_range TEXT DEFAULT '$$',
    opening_status TEXT NOT NULL DEFAULT 'OPEN' CHECK (opening_status IN ('OPEN', 'CLOSED', 'UNKNOWN')),
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 12. ROUTES & ROUTE LEGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_date DATE NOT NULL,
    start_location TEXT NOT NULL,
    start_latitude NUMERIC(9,6) NOT NULL,
    start_longitude NUMERIC(9,6) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    transport_preference TEXT NOT NULL DEFAULT 'METRO_AND_WALK' CHECK (transport_preference IN ('METRO_AND_WALK', 'WALK_ONLY', 'CAB_PREFERRED')),
    walking_tolerance TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (walking_tolerance IN ('LOW', 'MEDIUM', 'HIGH')),
    interests TEXT[] DEFAULT '{}',
    target_pandal_count INTEGER DEFAULT 0,
    total_distance_meters INTEGER NOT NULL DEFAULT 0,
    total_duration_seconds INTEGER NOT NULL DEFAULT 0,
    pandal_count INTEGER NOT NULL DEFAULT 0,
    metro_count INTEGER NOT NULL DEFAULT 0,
    route_status TEXT NOT NULL DEFAULT 'SAVED' CHECK (route_status IN ('DRAFT', 'SAVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.route_legs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    stop_type TEXT NOT NULL CHECK (stop_type IN ('START', 'PANDAL', 'METRO_BOARD', 'METRO_ALIGHT', 'FOOD', 'END')),
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE SET NULL,
    metro_station_id UUID REFERENCES public.metro_stations(id) ON DELETE SET NULL,
    food_place_id UUID REFERENCES public.food_places(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    distance_meters INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    arrival_time TIME,
    departure_time TIME,
    geometry JSONB,
    transport_mode TEXT NOT NULL DEFAULT 'WALK' CHECK (transport_mode IN ('WALK', 'METRO', 'CAB', 'TRANSIT')),
    source TEXT NOT NULL DEFAULT 'OSRM Foot Router',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Route Count Validation Trigger (Section 28)
CREATE OR REPLACE FUNCTION public.sync_route_pandal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.routes
    SET pandal_count = (
        SELECT COUNT(*)
        FROM public.route_legs
        WHERE route_id = COALESCE(NEW.route_id, OLD.route_id)
          AND stop_type = 'PANDAL'
    )
    WHERE id = COALESCE(NEW.route_id, OLD.route_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_route_pandal_count ON public.route_legs;
CREATE TRIGGER trg_sync_route_pandal_count
AFTER INSERT OR UPDATE OR DELETE ON public.route_legs
FOR EACH ROW EXECUTE FUNCTION public.sync_route_pandal_count();

-- -----------------------------------------------------------------------------
-- 13. TRIP SESSIONS & TRIP VISITS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'ABANDONED')),
    current_leg INTEGER NOT NULL DEFAULT 1,
    total_distance_meters INTEGER NOT NULL DEFAULT 0,
    actual_distance_meters INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile trip_sessions columns
DO $$
BEGIN
    ALTER TABLE public.trip_sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    ALTER TABLE public.trip_sessions ADD COLUMN IF NOT EXISTS route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE;
    ALTER TABLE public.trip_sessions ADD COLUMN IF NOT EXISTS current_leg INTEGER DEFAULT 1;
    ALTER TABLE public.trip_sessions ADD COLUMN IF NOT EXISTS total_distance_meters INTEGER DEFAULT 0;
    ALTER TABLE public.trip_sessions ADD COLUMN IF NOT EXISTS actual_distance_meters INTEGER DEFAULT 0;
    ALTER TABLE public.trip_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.trip_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_session_id UUID REFERENCES public.trip_sessions(id) ON DELETE CASCADE,
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_method TEXT NOT NULL DEFAULT 'GPS_PROXIMITY' CHECK (verification_method IN ('GPS_PROXIMITY', 'QR_SCAN', 'PHOTO_GEO', 'MANUAL_CHECKIN')),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    dwell_seconds INTEGER DEFAULT 0,
    photo_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 14. PASSPORT STAMPS & SAVED PLACES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.passport_stamps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    stamp_type TEXT NOT NULL DEFAULT 'VISIT' CHECK (stamp_type IN ('VISIT', 'PHOTO', 'HERITAGE_PILGRIM', 'MIDNIGHT_HOPPER', 'NORTH_CIRCUIT', 'SOUTH_CIRCUIT')),
    verification_method TEXT NOT NULL DEFAULT 'GPS_PROXIMITY',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, pandal_id, stamp_type)
);

CREATE TABLE IF NOT EXISTS public.user_saved_places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, pandal_id)
);

-- -----------------------------------------------------------------------------
-- 15. USER PREFERENCES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'bn')),
    walking_tolerance TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (walking_tolerance IN ('LOW', 'MEDIUM', 'HIGH')),
    transport_preference TEXT NOT NULL DEFAULT 'METRO_AND_WALK' CHECK (transport_preference IN ('METRO_AND_WALK', 'WALK_ONLY', 'CAB_PREFERRED')),
    notification_preferences JSONB DEFAULT '{"trip_reminders": true, "traffic_alerts": true, "weather_warnings": true}'::jsonb,
    theme TEXT NOT NULL DEFAULT 'DARK' CHECK (theme IN ('DARK', 'LIGHT', 'SYSTEM')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reconcile user_preferences columns
DO $$
BEGIN
    ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
    ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS walking_tolerance TEXT DEFAULT 'MEDIUM';
    ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS transport_preference TEXT DEFAULT 'METRO_AND_WALK';
    ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"trip_reminders": true, "traffic_alerts": true, "weather_warnings": true}'::jsonb;
    ALTER TABLE public.user_preferences ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'DARK';
    UPDATE public.user_preferences SET language = preferred_language WHERE language IS NULL AND preferred_language IS NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 16. NOTIFICATIONS & DEVICE TOKENS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('TRIP_REMINDER', 'WEATHER_WARNING', 'TRAFFIC_ALERT', 'PANDAL_STATUS', 'METRO_UPDATE', 'PASSPORT_UNLOCKED')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    push_token TEXT NOT NULL UNIQUE,
    last_seen_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 17. API HEALTH CHECKS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.api_health_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    service TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('CONFIGURED', 'REACHABLE', 'AUTHENTICATED', 'TESTED', 'VERIFIED', 'DEGRADED', 'BLOCKED')),
    latency_ms INTEGER,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_code INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 18. AI CONVERSATIONS, MESSAGES, AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
    tool_name TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    source_references JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 19. VERIFICATION LOGS & ADMIN USERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('VERIFY', 'UPDATE', 'STATUS_CHANGE', 'REJECT', 'ARCHIVE')),
    old_value JSONB,
    new_value JSONB,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'VERIFIER', 'EDITOR')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 20. FESTIVAL CALENDAR (2026 OFFICIAL CANONICAL CALENDAR)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.festival_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    festival TEXT NOT NULL DEFAULT 'Durga Puja',
    date DATE NOT NULL UNIQUE,
    phase TEXT NOT NULL CHECK (phase IN ('MAHALAYA', 'PRE_PUJA', 'MAHA_CHATURTHI', 'MAHA_PANCHAMI', 'MAHA_SHASHTHI', 'MAHA_SAPTAMI', 'MAHA_ASHTAMI', 'MAHA_NAVAMI', 'VIJAYA_DASHAMI')),
    label TEXT NOT NULL,
    description TEXT,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 21. APPLY UPDATED_AT TRIGGERS
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_sources_updated_at ON public.sources;
CREATE TRIGGER trg_sources_updated_at BEFORE UPDATE ON public.sources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_metro_stations_updated_at ON public.metro_stations;
CREATE TRIGGER trg_metro_stations_updated_at BEFORE UPDATE ON public.metro_stations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_pandals_updated_at ON public.pandals;
CREATE TRIGGER trg_pandals_updated_at BEFORE UPDATE ON public.pandals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_traffic_advisories_updated_at ON public.traffic_advisories;
CREATE TRIGGER trg_traffic_advisories_updated_at BEFORE UPDATE ON public.traffic_advisories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_food_places_updated_at ON public.food_places;
CREATE TRIGGER trg_food_places_updated_at BEFORE UPDATE ON public.food_places FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_routes_updated_at ON public.routes;
CREATE TRIGGER trg_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_trip_sessions_updated_at ON public.trip_sessions;
CREATE TRIGGER trg_trip_sessions_updated_at BEFORE UPDATE ON public.trip_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER trg_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER trg_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_festival_calendar_updated_at ON public.festival_calendar;
CREATE TRIGGER trg_festival_calendar_updated_at BEFORE UPDATE ON public.festival_calendar FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 22. PERFORMANCE INDEXES (Section 10)
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pandals_slug ON public.pandals(slug);
CREATE INDEX IF NOT EXISTS idx_pandals_area ON public.pandals(area);
CREATE INDEX IF NOT EXISTS idx_pandals_status ON public.pandals(status);
CREATE INDEX IF NOT EXISTS idx_pandals_is_active ON public.pandals(is_active);
CREATE INDEX IF NOT EXISTS idx_pandals_nearest_metro ON public.pandals(nearest_metro_station_id);
CREATE INDEX IF NOT EXISTS idx_pandals_location ON public.pandals USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_pandal_sources_pandal_id ON public.pandal_sources(pandal_id);
CREATE INDEX IF NOT EXISTS idx_pandal_sources_source_id ON public.pandal_sources(source_id);
CREATE INDEX IF NOT EXISTS idx_pandal_status_history_pandal_id ON public.pandal_status_history(pandal_id);

CREATE INDEX IF NOT EXISTS idx_metro_stations_code ON public.metro_stations(code);
CREATE INDEX IF NOT EXISTS idx_metro_stations_location ON public.metro_stations USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_metro_schedule_snapshots_station ON public.metro_schedule_snapshots(station_id);
CREATE INDEX IF NOT EXISTS idx_metro_schedule_snapshots_date ON public.metro_schedule_snapshots(service_date);

CREATE INDEX IF NOT EXISTS idx_traffic_advisories_valid_from ON public.traffic_advisories(valid_from);
CREATE INDEX IF NOT EXISTS idx_traffic_advisories_valid_until ON public.traffic_advisories(valid_until);
CREATE INDEX IF NOT EXISTS idx_traffic_advisories_active ON public.traffic_advisories(is_active);

CREATE INDEX IF NOT EXISTS idx_weather_snapshots_forecast ON public.weather_snapshots(forecast_for);
CREATE INDEX IF NOT EXISTS idx_weather_snapshots_expires ON public.weather_snapshots(expires_at);

CREATE INDEX IF NOT EXISTS idx_crowd_reports_pandal_id ON public.crowd_reports(pandal_id);
CREATE INDEX IF NOT EXISTS idx_crowd_reports_reported_at ON public.crowd_reports(reported_at);
CREATE INDEX IF NOT EXISTS idx_crowd_reports_expires_at ON public.crowd_reports(expires_at);

CREATE INDEX IF NOT EXISTS idx_food_places_slug ON public.food_places(slug);
CREATE INDEX IF NOT EXISTS idx_food_places_location ON public.food_places USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_routes_user_id ON public.routes(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_trip_date ON public.routes(trip_date);
CREATE INDEX IF NOT EXISTS idx_route_legs_route_id ON public.route_legs(route_id);

CREATE INDEX IF NOT EXISTS idx_trip_sessions_user_id ON public.trip_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_visits_pandal_id ON public.trip_visits(pandal_id);
CREATE INDEX IF NOT EXISTS idx_passport_stamps_user_id ON public.passport_stamps(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON public.ai_messages(conversation_id);

-- -----------------------------------------------------------------------------
-- 23. DATABASE FUNCTIONS (Section 19)
-- -----------------------------------------------------------------------------

-- Function 1: Get nearby pandals using PostGIS distance
CREATE OR REPLACE FUNCTION public.get_nearby_pandals(
    p_lat NUMERIC,
    p_lng NUMERIC,
    p_radius_meters INTEGER DEFAULT 3000
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    area TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    distance_meters NUMERIC,
    status TEXT,
    theme TEXT,
    puja_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.slug,
        p.area,
        p.latitude,
        p.longitude,
        ROUND(extensions.ST_Distance(
            p.location,
            extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography
        )::NUMERIC, 1) AS distance_meters,
        p.status,
        p.theme,
        p.puja_score
    FROM public.pandals p
    WHERE p.is_active = true
      AND p.location IS NOT NULL
      AND extensions.ST_DWithin(
          p.location,
          extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::extensions.geography,
          p_radius_meters
      )
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 2: Get pandal status with source information
CREATE OR REPLACE FUNCTION public.get_pandal_status(p_pandal_id UUID)
RETURNS JSONB AS $$
DECLARE
    res JSONB;
BEGIN
    SELECT jsonb_build_object(
        'pandal_id', p.id,
        'name', p.name,
        'status', p.status,
        'is_active', p.is_active,
        'latest_history', (
            SELECT jsonb_build_object(
                'status', h.status,
                'effective_from', h.effective_from,
                'confidence', h.confidence,
                'notes', h.notes
            )
            FROM public.pandal_status_history h
            WHERE h.pandal_id = p.id
            ORDER BY h.effective_from DESC
            LIMIT 1
        ),
        'latest_crowd', (
            SELECT jsonb_build_object(
                'crowd_level', c.crowd_level,
                'reported_at', c.reported_at,
                'is_stale', (c.expires_at < CURRENT_TIMESTAMP)
            )
            FROM public.crowd_reports c
            WHERE c.pandal_id = p.id
            ORDER BY c.reported_at DESC
            LIMIT 1
        )
    ) INTO res
    FROM public.pandals p
    WHERE p.id = p_pandal_id;

    RETURN res;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 3: Get user passport stamps summary
CREATE OR REPLACE FUNCTION public.get_user_passport(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    res JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user_id', p_user_id,
        'total_stamps', COUNT(ps.id),
        'stamps', COALESCE(jsonb_agg(
            jsonb_build_object(
                'id', ps.id,
                'pandal_id', ps.pandal_id,
                'pandal_name', p.name,
                'stamp_type', ps.stamp_type,
                'verified_at', ps.verified_at,
                'metadata', ps.metadata
            ) ORDER BY ps.verified_at DESC
        ), '[]'::jsonb)
    ) INTO res
    FROM public.passport_stamps ps
    JOIN public.pandals p ON ps.pandal_id = p.id
    WHERE ps.user_id = p_user_id;

    RETURN res;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 4: Get route summary with legs
CREATE OR REPLACE FUNCTION public.get_route_summary(p_route_id UUID)
RETURNS JSONB AS $$
DECLARE
    res JSONB;
BEGIN
    SELECT jsonb_build_object(
        'route_id', r.id,
        'trip_date', r.trip_date,
        'start_location', r.start_location,
        'total_distance_meters', r.total_distance_meters,
        'total_duration_seconds', r.total_duration_seconds,
        'pandal_count', r.pandal_count,
        'metro_count', r.metro_count,
        'legs', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'sequence', rl.sequence,
                    'stop_type', rl.stop_type,
                    'title', rl.title,
                    'distance_meters', rl.distance_meters,
                    'duration_seconds', rl.duration_seconds,
                    'transport_mode', rl.transport_mode
                ) ORDER BY rl.sequence ASC
            )
            FROM public.route_legs rl
            WHERE rl.route_id = r.id
        ), '[]'::jsonb)
    ) INTO res
    FROM public.routes r
    WHERE r.id = p_route_id;

    RETURN res;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 5: Get active traffic advisories
CREATE OR REPLACE FUNCTION public.get_active_traffic()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    area TEXT,
    severity TEXT,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    confidence NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.title,
        t.description,
        t.area,
        t.severity,
        t.valid_from,
        t.valid_until,
        t.confidence
    FROM public.traffic_advisories t
    WHERE t.is_active = true
      AND CURRENT_TIMESTAMP BETWEEN t.valid_from AND t.valid_until
    ORDER BY t.severity DESC, t.valid_from ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 6: Get current weather snapshot (fresh only)
CREATE OR REPLACE FUNCTION public.get_current_weather()
RETURNS JSONB AS $$
DECLARE
    res JSONB;
BEGIN
    SELECT jsonb_build_object(
        'temperature', w.temperature,
        'feels_like', w.feels_like,
        'rain_probability', w.rain_probability,
        'precipitation', w.precipitation,
        'wind_speed', w.wind_speed,
        'weather_code', w.weather_code,
        'source', w.source,
        'retrieved_at', w.retrieved_at,
        'expires_at', w.expires_at,
        'is_stale', (w.expires_at < CURRENT_TIMESTAMP)
    ) INTO res
    FROM public.weather_snapshots w
    ORDER BY w.retrieved_at DESC
    LIMIT 1;

    RETURN res;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 7: Get latest verified source for an entity
CREATE OR REPLACE FUNCTION public.get_latest_source(p_entity_id UUID)
RETURNS JSONB AS $$
DECLARE
    res JSONB;
BEGIN
    SELECT jsonb_build_object(
        'pandal_id', ps.pandal_id,
        'source_name', s.name,
        'publisher', s.publisher,
        'source_type', ps.source_type,
        'source_url', ps.source_url,
        'verified_at', ps.verified_at,
        'confidence', ps.confidence,
        'notes', ps.notes
    ) INTO res
    FROM public.pandal_sources ps
    LEFT JOIN public.sources s ON ps.source_id = s.id
    WHERE ps.pandal_id = p_entity_id
    ORDER BY ps.verified_at DESC
    LIMIT 1;

    RETURN res;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function 8: Get pandal verification dossier
CREATE OR REPLACE FUNCTION public.get_pandal_verification(p_pandal_id UUID)
RETURNS JSONB AS $$
DECLARE
    res JSONB;
BEGIN
    SELECT jsonb_build_object(
        'pandal_id', p.id,
        'pandal_name', p.name,
        'status', p.status,
        'puja_score', p.puja_score,
        'score_methodology', p.score_methodology,
        'sources', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'source_id', ps.source_id,
                    'publisher', ps.publisher,
                    'source_url', ps.source_url,
                    'verified_at', ps.verified_at,
                    'confidence', ps.confidence
                )
            )
            FROM public.pandal_sources ps
            WHERE ps.pandal_id = p.id
        ), '[]'::jsonb),
        'theme_record', (
            SELECT jsonb_build_object(
                'theme', pt.theme,
                'description', pt.description,
                'verified_at', pt.verified_at
            )
            FROM public.pandal_themes pt
            WHERE pt.pandal_id = p.id
            ORDER BY pt.verified_at DESC
            LIMIT 1
        )
    ) INTO res
    FROM public.pandals p
    WHERE p.id = p_pandal_id;

    RETURN res;
END;
$$ LANGUAGE plpgsql STABLE;

-- -----------------------------------------------------------------------------
-- 24. ROW LEVEL SECURITY (RLS) POLICIES (Sections 11–14)
-- -----------------------------------------------------------------------------

-- Enable RLS on all 29 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metro_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandal_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandal_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandal_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metro_schedule_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_legs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passport_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.festival_calendar ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- USER PROFILES POLICIES ---
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- --- USER PREFERENCES POLICIES ---
DROP POLICY IF EXISTS "Users can read own preferences" ON public.user_preferences;
CREATE POLICY "Users can read own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- --- USER ROUTES POLICIES ---
DROP POLICY IF EXISTS "Users can read own routes" ON public.routes;
CREATE POLICY "Users can read own routes" ON public.routes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own routes" ON public.routes;
CREATE POLICY "Users can insert own routes" ON public.routes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own routes" ON public.routes;
CREATE POLICY "Users can update own routes" ON public.routes FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own routes" ON public.routes;
CREATE POLICY "Users can delete own routes" ON public.routes FOR DELETE USING (auth.uid() = user_id);

-- --- ROUTE LEGS POLICIES ---
DROP POLICY IF EXISTS "Users can read own route legs" ON public.route_legs;
CREATE POLICY "Users can read own route legs" ON public.route_legs FOR SELECT
USING (EXISTS (SELECT 1 FROM public.routes r WHERE r.id = route_legs.route_id AND r.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own route legs" ON public.route_legs;
CREATE POLICY "Users can insert own route legs" ON public.route_legs FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.routes r WHERE r.id = route_legs.route_id AND r.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own route legs" ON public.route_legs;
CREATE POLICY "Users can delete own route legs" ON public.route_legs FOR DELETE
USING (EXISTS (SELECT 1 FROM public.routes r WHERE r.id = route_legs.route_id AND r.user_id = auth.uid()));

-- --- TRIP SESSIONS POLICIES ---
DROP POLICY IF EXISTS "Users can read own trip sessions" ON public.trip_sessions;
CREATE POLICY "Users can read own trip sessions" ON public.trip_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trip sessions" ON public.trip_sessions;
CREATE POLICY "Users can insert own trip sessions" ON public.trip_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trip sessions" ON public.trip_sessions;
CREATE POLICY "Users can update own trip sessions" ON public.trip_sessions FOR UPDATE USING (auth.uid() = user_id);

-- --- TRIP VISITS POLICIES ---
DROP POLICY IF EXISTS "Users can read own trip visits" ON public.trip_visits;
CREATE POLICY "Users can read own trip visits" ON public.trip_visits FOR SELECT
USING (EXISTS (SELECT 1 FROM public.trip_sessions s WHERE s.id = trip_visits.trip_session_id AND s.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own trip visits" ON public.trip_visits;
CREATE POLICY "Users can insert own trip visits" ON public.trip_visits FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.trip_sessions s WHERE s.id = trip_visits.trip_session_id AND s.user_id = auth.uid()));

-- --- PASSPORT STAMPS POLICIES ---
DROP POLICY IF EXISTS "Users can read own passport stamps" ON public.passport_stamps;
CREATE POLICY "Users can read own passport stamps" ON public.passport_stamps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own passport stamps" ON public.passport_stamps;
CREATE POLICY "Users can insert own passport stamps" ON public.passport_stamps FOR INSERT WITH CHECK (auth.uid() = user_id);

-- --- USER SAVED PLACES ---
DROP POLICY IF EXISTS "Users can read own saved places" ON public.user_saved_places;
CREATE POLICY "Users can read own saved places" ON public.user_saved_places FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved places" ON public.user_saved_places;
CREATE POLICY "Users can insert own saved places" ON public.user_saved_places FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved places" ON public.user_saved_places;
CREATE POLICY "Users can delete own saved places" ON public.user_saved_places FOR DELETE USING (auth.uid() = user_id);

-- --- NOTIFICATIONS POLICIES ---
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- --- DEVICE TOKENS POLICIES ---
DROP POLICY IF EXISTS "Users can manage own device tokens" ON public.device_tokens;
CREATE POLICY "Users can manage own device tokens" ON public.device_tokens FOR ALL USING (auth.uid() = user_id);

-- --- AI CONVERSATIONS & MESSAGES ---
DROP POLICY IF EXISTS "Users can read own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can read own AI conversations" ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can insert own AI conversations" ON public.ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own AI messages" ON public.ai_messages;
CREATE POLICY "Users can read own AI messages" ON public.ai_messages FOR SELECT
USING (EXISTS (SELECT 1 FROM public.ai_conversations c WHERE c.id = ai_messages.conversation_id AND c.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own AI messages" ON public.ai_messages;
CREATE POLICY "Users can insert own AI messages" ON public.ai_messages FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.ai_conversations c WHERE c.id = ai_messages.conversation_id AND c.user_id = auth.uid()));

-- --- PUBLIC DATA READ POLICIES (Active / Valid Only) ---
DROP POLICY IF EXISTS "Public read active pandals" ON public.pandals;
CREATE POLICY "Public read active pandals" ON public.pandals FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active metro stations" ON public.metro_stations;
CREATE POLICY "Public read active metro stations" ON public.metro_stations FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active food places" ON public.food_places;
CREATE POLICY "Public read active food places" ON public.food_places FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read active sources" ON public.sources;
CREATE POLICY "Public read active sources" ON public.sources FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read pandal sources" ON public.pandal_sources;
CREATE POLICY "Public read pandal sources" ON public.pandal_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read pandal status history" ON public.pandal_status_history;
CREATE POLICY "Public read pandal status history" ON public.pandal_status_history FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read pandal themes" ON public.pandal_themes;
CREATE POLICY "Public read pandal themes" ON public.pandal_themes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read metro schedules" ON public.metro_schedule_snapshots;
CREATE POLICY "Public read metro schedules" ON public.metro_schedule_snapshots FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read traffic advisories" ON public.traffic_advisories;
CREATE POLICY "Public read traffic advisories" ON public.traffic_advisories FOR SELECT
USING (is_active = true AND CURRENT_TIMESTAMP BETWEEN valid_from AND valid_until);

DROP POLICY IF EXISTS "Public read weather snapshots" ON public.weather_snapshots;
CREATE POLICY "Public read weather snapshots" ON public.weather_snapshots FOR SELECT USING (expires_at >= CURRENT_TIMESTAMP);

DROP POLICY IF EXISTS "Public read crowd reports" ON public.crowd_reports;
CREATE POLICY "Public read crowd reports" ON public.crowd_reports FOR SELECT USING (expires_at >= CURRENT_TIMESTAMP);

DROP POLICY IF EXISTS "Users can insert crowd reports" ON public.crowd_reports;
CREATE POLICY "Users can insert crowd reports" ON public.crowd_reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Public read festival calendar" ON public.festival_calendar;
CREATE POLICY "Public read festival calendar" ON public.festival_calendar FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read api health checks" ON public.api_health_checks;
CREATE POLICY "Public read api health checks" ON public.api_health_checks FOR SELECT USING (true);

-- --- ADMIN ACCESS POLICIES (Section 14) ---
DROP POLICY IF EXISTS "Admin write pandals" ON public.pandals;
CREATE POLICY "Admin write pandals" ON public.pandals FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin write sources" ON public.sources;
CREATE POLICY "Admin write sources" ON public.sources FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin write metro stations" ON public.metro_stations;
CREATE POLICY "Admin write metro stations" ON public.metro_stations FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin write traffic advisories" ON public.traffic_advisories;
CREATE POLICY "Admin write traffic advisories" ON public.traffic_advisories FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin write food places" ON public.food_places;
CREATE POLICY "Admin write food places" ON public.food_places FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin write verification logs" ON public.verification_logs;
CREATE POLICY "Admin write verification logs" ON public.verification_logs FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin write api health checks" ON public.api_health_checks;
CREATE POLICY "Admin write api health checks" ON public.api_health_checks FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin view admin users" ON public.admin_users;
CREATE POLICY "Admin view admin users" ON public.admin_users FOR SELECT USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 25. STORAGE BUCKETS & STORAGE POLICIES (Sections 16 & 17)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('pandal-images', 'pandal-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('pandal-gallery', 'pandal-gallery', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('passport-photos', 'passport-photos', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('social-share-cards', 'social-share-cards', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('app-assets', 'app-assets', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies
DROP POLICY IF EXISTS "Public read public buckets" ON storage.objects;
CREATE POLICY "Public read public buckets" ON storage.objects FOR SELECT
USING (bucket_id IN ('pandal-images', 'pandal-gallery', 'avatars', 'social-share-cards', 'app-assets'));

DROP POLICY IF EXISTS "Users can upload avatar" ON storage.objects;
CREATE POLICY "Users can upload avatar" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can manage own passport photos" ON storage.objects;
CREATE POLICY "Users can manage own passport photos" ON storage.objects FOR ALL
USING (bucket_id = 'passport-photos' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'passport-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- -----------------------------------------------------------------------------
-- 26. CANONICAL 2026 CALENDAR & SOURCES SEED (Section 25 & 45)
-- -----------------------------------------------------------------------------
INSERT INTO public.sources (name, publisher, source_type, base_url, trust_level, is_official, is_active)
VALUES
    ('Kolkata Police Puja Guide', 'Kolkata Police Headquarters', 'POLICE_GUIDE', 'https://kolkatapolice.gov.in', 'VERY_HIGH', true, true),
    ('Kolkata Metro Railway Timetable', 'Metro Railway Kolkata (Indian Railways)', 'METRO_CIRCULAR', 'https://mtp.indianrailways.gov.in', 'VERY_HIGH', true, true),
    ('West Bengal Tourism Festival Directorate', 'Department of Tourism, Govt of West Bengal', 'GOVERNMENT_CIRCULAR', 'https://wbtourism.gov.in', 'VERY_HIGH', true, true),
    ('Open-Meteo Kolkata Weather Service', 'Open-Meteo Meteorological Agency', 'OFFICIAL', 'https://open-meteo.com', 'HIGH', false, true),
    ('PujaHop Kolkata On-Ground Verification Desk', 'PujaHop Editorial & Field Verification Team', 'ON_GROUND_SURVEY', 'https://pujahop.kolkata', 'HIGH', false, true)
ON CONFLICT DO NOTHING;

-- Seed 2026 Official Durga Puja Calendar (Section 25)
INSERT INTO public.festival_calendar (festival, date, phase, label, description)
VALUES
    ('Durga Puja', '2026-10-10', 'MAHALAYA', 'Mahalaya', 'Tarpan and ceremonial invocation of Maa Durga across the Ghats of Kolkata.'),
    ('Durga Puja', '2026-10-13', 'PRE_PUJA', 'Pre-Puja Day 1', 'Early crowd-free pandal hopping across North and South Kolkata flagship pandals.'),
    ('Durga Puja', '2026-10-14', 'PRE_PUJA', 'Pre-Puja Day 2', 'Illumination switch-on and VIP walkthroughs before festive peak congestion.'),
    ('Durga Puja', '2026-10-15', 'MAHA_CHATURTHI', 'Maha Chaturthi', 'First evening of festive movement and inaugural ceremonies across heritage clubs.'),
    ('Durga Puja', '2026-10-16', 'MAHA_PANCHAMI', 'Maha Panchami', 'Grand public opening of theme pandals across South and Central Kolkata circuits.'),
    ('Durga Puja', '2026-10-17', 'MAHA_SHASHTHI', 'Maha Shashthi', 'Bodhon, Amantran, and Adhibas rituals; all night pedestrian pandal trails begin.'),
    ('Durga Puja', '2026-10-18', 'MAHA_SAPTAMI', 'Maha Saptami', 'Navapatrika Pravesh and Kolabou Snan; major all-night Kolkata crowd flow.'),
    ('Durga Puja', '2026-10-19', 'MAHA_ASHTAMI', 'Maha Ashtami', 'Kumari Puja and Sandhi Puja; the spiritual zenith of Kolkata Durga Puja.'),
    ('Durga Puja', '2026-10-20', 'MAHA_NAVAMI', 'Maha Navami', 'Maha Aarti, dhunuchi naach, and midnight food trails across traditional stalls.'),
    ('Durga Puja', '2026-10-21', 'VIJAYA_DASHAMI', 'Vijaya Dashami', 'Sindoor Khela, immersion processions along Ganga ghats, and Shubho Bijoya greetings.')
ON CONFLICT (date) DO UPDATE SET
    phase = EXCLUDED.phase,
    label = EXCLUDED.label,
    description = EXCLUDED.description;
