-- =============================================================================
-- PujaHop Kolkata: Master PostgreSQL Database Schema & Row Level Security (RLS)
-- Product: PujaHop Kolkata — One Day. One City. Maximum Puja.
-- Schema Version: 2026-10-08
-- =============================================================================

-- 0. EXTENSIONS (Pre-installed in Supabase PostgreSQL 15+)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PANDALS TABLE
CREATE TABLE IF NOT EXISTS public.pandals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    area TEXT NOT NULL, -- North Kolkata, Central Kolkata, South Kolkata, East Kolkata / Salt Lake, Howrah
    neighborhood TEXT NOT NULL, -- Bagbazar, Kumartuli, College Square, Gariahat, Ballygunge, etc.
    nearest_metro TEXT NOT NULL,
    metro_line TEXT NOT NULL, -- Blue Line, Green Line, Purple Line, Orange Line
    walking_distance_meters INTEGER NOT NULL,
    opening_date DATE NOT NULL DEFAULT '2026-10-14',
    opening_time TIME NOT NULL DEFAULT '14:00:00',
    closing_time TIME NOT NULL DEFAULT '04:00:00',
    theme TEXT NOT NULL DEFAULT 'Not officially announced',
    theme_source TEXT,
    traditional_score NUMERIC(3,1) DEFAULT 7.5,
    theme_score NUMERIC(3,1) DEFAULT 8.0,
    art_score NUMERIC(3,1) DEFAULT 8.5,
    photo_score NUMERIC(3,1) DEFAULT 8.0,
    accessibility_score NUMERIC(3,1) DEFAULT 7.0,
    crowd_score NUMERIC(3,1) DEFAULT 8.5, -- 1 to 10 typical congestion
    overall_score NUMERIC(3,1) DEFAULT 8.2,
    estimated_visit_minutes INTEGER NOT NULL DEFAULT 45,
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, EARLY OPENING, INAUGURATION, UNDER PREPARATION, UNKNOWN, CLOSED
    source TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'OFFICIAL', -- OFFICIAL, POLICE_GUIDE, USER_REPORT, ON_GROUND_SURVEY
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PANDAL SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.pandal_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PANDAL VERIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.pandal_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    verified_by TEXT NOT NULL,
    verification_type TEXT NOT NULL, -- PHYSICAL_INSPECTION, POLICE_CIRCULAR, TRUSTED_MEDIA, CALL_VERIFIED
    previous_status TEXT,
    new_status TEXT NOT NULL,
    evidence_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 4. METRO LINES TABLE
CREATE TABLE IF NOT EXISTS public.metro_lines (
    id TEXT PRIMARY KEY, -- blue, green, purple, orange
    name TEXT NOT NULL, -- Blue Line (North-South), Green Line (East-West), etc.
    color TEXT NOT NULL, -- #005691, #008751, #7B1FA2, #E65100
    operating_status TEXT NOT NULL DEFAULT 'NORMAL', -- NORMAL, EXTENDED_NIGHT_SERVICE, DELAYED, DISRUPTED
    first_train TIME NOT NULL DEFAULT '06:50:00',
    last_train TIME NOT NULL DEFAULT '23:45:00',
    puja_all_night_service BOOLEAN DEFAULT true,
    source TEXT NOT NULL DEFAULT 'Kolkata Metro Railway Official',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. METRO STATIONS TABLE
CREATE TABLE IF NOT EXISTS public.metro_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    line_id TEXT NOT NULL REFERENCES public.metro_lines(id) ON DELETE CASCADE,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    is_interchange BOOLEAN DEFAULT false,
    interchange_lines TEXT[] DEFAULT '{}',
    operating_status TEXT NOT NULL DEFAULT 'OPEN',
    crowd_level TEXT NOT NULL DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, EXTREME
    source TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'OFFICIAL',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. WALKING ROUTES CACHE TABLE
CREATE TABLE IF NOT EXISTS public.walking_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin_lat NUMERIC(9,6) NOT NULL,
    origin_lng NUMERIC(9,6) NOT NULL,
    dest_lat NUMERIC(9,6) NOT NULL,
    dest_lng NUMERIC(9,6) NOT NULL,
    distance_meters INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL,
    geometry_geojson JSONB,
    source TEXT NOT NULL DEFAULT 'OSRM Foot Router',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. TRAFFIC ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.traffic_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- ROAD_CLOSURE, ONE_WAY, NO_ENTRY, PEDESTRIAN_ONLY, VEHICLE_RESTRICTION, BUS_DIVERSION, AUTO_RESTRICTION, TRAFFIC_WARNING
    area TEXT NOT NULL,
    affected_roads TEXT[] NOT NULL DEFAULT '{}',
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'KOLKATA_TRAFFIC_POLICE',
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. CROWD REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.crowd_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE CASCADE,
    metro_station_id UUID REFERENCES public.metro_stations(id) ON DELETE CASCADE,
    crowd_level TEXT NOT NULL, -- LOW, MODERATE, HIGH, EXTREME
    wait_time_minutes INTEGER NOT NULL DEFAULT 30,
    source TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'USER_REPORT', -- USER_REPORT, POLICE_NOTICE, ADMIN_VERIFIED, SENSOR
    confidence NUMERIC(3,2) NOT NULL DEFAULT 0.85,
    verified BOOLEAN DEFAULT true,
    reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. RESTAURANTS / FOOD STOPS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- BIRYANI, ROLL, STREET_FOOD, SWEETS, COFFEE, RESTAURANT
    specialty TEXT,
    address TEXT NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    area TEXT NOT NULL,
    nearest_metro TEXT,
    rating NUMERIC(2,1) DEFAULT 4.5,
    price_level TEXT DEFAULT '$$',
    is_pure_veg BOOLEAN DEFAULT false,
    opening_time TIME DEFAULT '11:00:00',
    closing_time TIME DEFAULT '02:00:00',
    status TEXT NOT NULL DEFAULT 'OPEN',
    source TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'VERIFIED_DIRECTORY',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    area TEXT NOT NULL,
    nearest_metro TEXT,
    emergency_number TEXT NOT NULL DEFAULT '112',
    ambulance_number TEXT NOT NULL DEFAULT '102',
    has_emergency_icu BOOLEAN DEFAULT true,
    status TEXT NOT NULL DEFAULT 'OPEN_24_7',
    source TEXT NOT NULL DEFAULT 'Govt of West Bengal Health Department',
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'OFFICIAL',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. POLICE STATIONS TABLE
CREATE TABLE IF NOT EXISTS public.police_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    area TEXT NOT NULL,
    nearest_metro TEXT,
    phone TEXT NOT NULL,
    control_room TEXT NOT NULL DEFAULT '033-2214-3230',
    status TEXT NOT NULL DEFAULT 'OPEN_24_7',
    source TEXT NOT NULL DEFAULT 'Kolkata Police Directory',
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'OFFICIAL',
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. PUJA CALENDAR TABLE
CREATE TABLE IF NOT EXISTS public.puja_calendar (
    id TEXT PRIMARY KEY, -- 2026-10-10, 2026-10-14, etc.
    year INTEGER NOT NULL DEFAULT 2026,
    date DATE NOT NULL,
    tithi_name TEXT NOT NULL, -- Mahalaya, Chaturthi, Panchami, Shashthi, Saptami, Ashtami, Navami, Dashami
    is_pre_puja BOOLEAN NOT NULL DEFAULT false,
    metro_service_type TEXT NOT NULL DEFAULT 'NORMAL', -- NORMAL, EXTENDED, ALL_NIGHT
    crowd_expectation TEXT NOT NULL DEFAULT 'HIGH', -- LOW, MODERATE, HIGH, EXTREME
    description TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'Official Bengal Almanac 2026',
    source_url TEXT,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. TRIP PLANS TABLE
CREATE TABLE IF NOT EXISTS public.trip_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    start_location_name TEXT NOT NULL,
    start_lat NUMERIC(9,6) NOT NULL,
    start_lng NUMERIC(9,6) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    group_size INTEGER NOT NULL DEFAULT 2,
    walking_tolerance TEXT NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    transport_preference TEXT NOT NULL DEFAULT 'METRO_AND_WALK', -- METRO_AND_WALK, WALK_ONLY, CAB_PREFERRED
    interests TEXT[] DEFAULT '{}',
    total_pandals INTEGER NOT NULL DEFAULT 0,
    total_walking_distance_meters INTEGER NOT NULL DEFAULT 0,
    total_travel_time_minutes INTEGER NOT NULL DEFAULT 0,
    estimated_visit_minutes INTEGER NOT NULL DEFAULT 0,
    metro_rides INTEGER NOT NULL DEFAULT 0,
    route_confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    status TEXT NOT NULL DEFAULT 'SAVED', -- DRAFT, SAVED, IN_PROGRESS, COMPLETED, CANCELLED
    ai_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. TRIP STOPS TABLE
CREATE TABLE IF NOT EXISTS public.trip_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trip_plans(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL,
    stop_type TEXT NOT NULL, -- PANDAL, METRO_BOARD, METRO_ALIGHT, FOOD, REST
    pandal_id UUID REFERENCES public.pandals(id) ON DELETE SET NULL,
    metro_station_id UUID REFERENCES public.metro_stations(id) ON DELETE SET NULL,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    custom_name TEXT,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    arrival_time TIME,
    departure_time TIME,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    distance_from_prev_meters INTEGER DEFAULT 0,
    walking_time_from_prev_minutes INTEGER DEFAULT 0,
    crowd_status TEXT DEFAULT 'MODERATE',
    road_status TEXT DEFAULT 'NORMAL',
    navigation_url TEXT,
    visited BOOLEAN DEFAULT false,
    visited_at TIMESTAMP WITH TIME ZONE
);

-- 15. TRIP SESSIONS TABLE (Live tracking)
CREATE TABLE IF NOT EXISTS public.trip_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trip_plans(id) ON DELETE CASCADE,
    current_stop_order INTEGER NOT NULL DEFAULT 1,
    current_lat NUMERIC(9,6),
    current_lng NUMERIC(9,6),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_pandals_visited INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE' -- ACTIVE, PAUSED, COMPLETED
);

-- 16. PANDAL VISITS TABLE (Passport tracker)
CREATE TABLE IF NOT EXISTS public.pandal_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    user_id UUID,
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    photo_url TEXT,
    notes TEXT,
    crowd_experienced TEXT, -- LOW, MODERATE, HIGH, EXTREME
    source TEXT NOT NULL DEFAULT 'USER_CHECKIN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    preferred_language TEXT DEFAULT 'en', -- en, bn
    walking_tolerance TEXT DEFAULT 'MEDIUM',
    transport_preference TEXT DEFAULT 'METRO_AND_WALK',
    interest_tags TEXT[] DEFAULT '{"traditional", "art", "lighting"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. USER SAVED PANDALS TABLE
CREATE TABLE IF NOT EXISTS public.user_saved_pandals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    notes TEXT,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, pandal_id)
);

-- 19. PANDAL PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.pandal_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandal_id UUID NOT NULL REFERENCES public.pandals(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    taken_at TIMESTAMP WITH TIME ZONE,
    verified BOOLEAN DEFAULT true,
    source TEXT NOT NULL DEFAULT 'OFFICIAL_ARCHIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. ROUTE RECALCULATIONS TABLE
CREATE TABLE IF NOT EXISTS public.route_recalculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trip_plans(id) ON DELETE CASCADE,
    trigger_reason TEXT NOT NULL, -- CROWD_SURGE, ROAD_CLOSED, USER_SKIPPED, RAIN_ALERT
    old_route_summary JSONB NOT NULL,
    new_route_summary JSONB NOT NULL,
    time_saved_minutes INTEGER NOT NULL DEFAULT 0,
    distance_change_meters INTEGER NOT NULL DEFAULT 0,
    accepted_by_user BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. WEATHER SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS public.weather_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT NOT NULL DEFAULT 'Kolkata',
    lat NUMERIC(9,6) NOT NULL DEFAULT 22.5726,
    lng NUMERIC(9,6) NOT NULL DEFAULT 88.3639,
    temperature_c NUMERIC(4,1) NOT NULL,
    apparent_temp_c NUMERIC(4,1) NOT NULL,
    humidity_percent INTEGER NOT NULL,
    precipitation_mm NUMERIC(4,1) NOT NULL,
    weather_code INTEGER NOT NULL,
    wind_speed_kmh NUMERIC(4,1) NOT NULL,
    source TEXT NOT NULL DEFAULT 'Open-Meteo',
    source_url TEXT DEFAULT 'https://api.open-meteo.com/v1/forecast',
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 22. API HEALTH & AUDIT LOGS TABLES
CREATE TABLE IF NOT EXISTS public.api_health (
    id TEXT PRIMARY KEY, -- supabase, bedrock, maps, weather, metro, traffic
    service_name TEXT NOT NULL,
    status TEXT NOT NULL, -- CONNECTED, DEGRADED, BLOCKED, ERROR
    endpoint TEXT,
    latency_ms INTEGER,
    last_tested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT,
    details JSONB
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'system',
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.pandals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metro_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traffic_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crowd_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puja_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandal_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES: Public read access for verified directory
CREATE POLICY "Public read pandals" ON public.pandals FOR SELECT USING (active = true);
CREATE POLICY "Public read metro stations" ON public.metro_stations FOR SELECT USING (true);
CREATE POLICY "Public read traffic alerts" ON public.traffic_alerts FOR SELECT USING (true);
CREATE POLICY "Public read crowd reports" ON public.crowd_reports FOR SELECT USING (true);
CREATE POLICY "Public read restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Public read hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public read police stations" ON public.police_stations FOR SELECT USING (true);
CREATE POLICY "Public read puja calendar" ON public.puja_calendar FOR SELECT USING (true);
CREATE POLICY "Public read api health" ON public.api_health FOR SELECT USING (true);

-- INDEXES FOR GEOGRAPHIC & SEARCH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_pandals_lat_lng ON public.pandals (lat, lng);
CREATE INDEX IF NOT EXISTS idx_pandals_area ON public.pandals (area);
CREATE INDEX IF NOT EXISTS idx_pandals_nearest_metro ON public.pandals (nearest_metro);
CREATE INDEX IF NOT EXISTS idx_metro_stations_line ON public.metro_stations (line_id);
CREATE INDEX IF NOT EXISTS idx_traffic_alerts_status ON public.traffic_alerts (status);
