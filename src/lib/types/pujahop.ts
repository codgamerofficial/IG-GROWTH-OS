// =============================================================================
// PujaHop Kolkata: Core TypeScript Data Types & Interfaces
// Standard: Real Data Only • Strict Schemas • 2026 Durga Puja Support
// =============================================================================

export type PujaArea =
  | 'North Kolkata'
  | 'Central Kolkata'
  | 'South Kolkata'
  | 'East Kolkata / Salt Lake'
  | 'Howrah';

export type PandalOpeningStatus =
  | 'OPEN'
  | 'EARLY OPENING'
  | 'INAUGURATION'
  | 'UNDER PREPARATION'
  | 'UNKNOWN'
  | 'CLOSED';

export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type SourceType =
  | 'OFFICIAL'
  | 'POLICE_GUIDE'
  | 'USER_REPORT'
  | 'ON_GROUND_SURVEY'
  | 'METRO_RAILWAY'
  | 'VERIFIED_DIRECTORY';

export type WalkingTolerance = 'LOW' | 'MEDIUM' | 'HIGH';

export type TransportPreference =
  | 'METRO_AND_WALK'
  | 'WALK_ONLY'
  | 'CAB_PREFERRED';

export type RouteType =
  | 'BEST OF KOLKATA'
  | 'MAXIMUM PANDALS'
  | 'NORTH KOLKATA'
  | 'CENTRAL KOLKATA'
  | 'SOUTH KOLKATA'
  | 'TRADITIONAL PUJA'
  | 'THEME PUJA'
  | 'PHOTOGRAPHY ROUTE'
  | 'LOW WALKING'
  | 'FAMILY ROUTE'
  | 'METRO-FIRST'
  | 'LOW-CROWD'
  | 'ONE-DAY CHALLENGE';

export interface PandalScoreBreakdown {
  editorial_score: number; // 1-10 documented composite
  traditional_heritage: number; // 1-10
  art_and_craft: number; // 1-10
  photography: number; // 1-10
  accessibility: number; // 1-10
  transit_accessibility: number; // 1-10
  crowd_suitability: number; // 1-10
  methodology: string;
  data_confidence: number; // 0.0 - 1.0 (e.g. 0.85 = 85%)
}

export interface MetroServiceStatus {
  service_date: string;
  line: string;
  station?: string;
  first_train: string;
  last_train: string;
  frequency: string;
  special_service: boolean;
  status: 'SPECIAL PUJA SERVICE' | 'SPECIAL SERVICE NOT VERIFIED' | 'NORMAL TIMETABLE' | 'DISRUPTED';
  source: string;
  source_url?: string;
  retrieved_at: string;
  valid_from: string;
  valid_until: string;
  confidence: number;
}

export interface Pandal {
  id: string;
  slug: string;
  name: string;
  name_bn: string;
  address: string;
  lat: number;
  lng: number;
  area: PujaArea;
  neighborhood: string;
  nearest_metro: string;
  metro_line: string;
  walking_distance: number; // in meters from nearest metro
  opening_date: string; // YYYY-MM-DD
  opening_time: string; // HH:MM
  closing_time: string; // HH:MM
  theme: string;
  theme_source?: string;
  score_breakdown?: PandalScoreBreakdown;
  traditional_score: number;
  theme_score: number;
  art_score: number;
  photo_score: number;
  accessibility_score: number;
  crowd_score: number; // 1-10
  overall_score: number;
  estimated_visit_minutes: number;
  status: PandalOpeningStatus;
  opening_status?: PandalOpeningStatus;
  source: string;
  source_url?: string;
  source_type: SourceType;
  published_at?: string;
  retrieved_at?: string;
  verified_at: string;
  verification_status?: 'VERIFIED' | 'UNVERIFIED' | 'STATUS_UNKNOWN' | 'NOT_ANNOUNCED';
  confidence: number;
  last_updated: string;
  updated_at?: string;
  images?: string[];
  description?: string;
}

export interface MetroLine {
  id: 'blue' | 'green' | 'purple' | 'orange';
  name: string;
  color: string;
  operating_status: 'NORMAL' | 'EXTENDED_NIGHT_SERVICE' | 'DELAYED' | 'DISRUPTED';
  first_train: string;
  last_train: string;
  puja_all_night_service: boolean;
  source: string;
  verified_at: string;
}

export interface MetroStation {
  id: string;
  code: string;
  name: string;
  name_bn: string;
  line_id: 'blue' | 'green' | 'purple' | 'orange';
  line_name: string;
  lat: number;
  lng: number;
  is_interchange: boolean;
  interchange_lines?: string[];
  operating_status: 'OPEN' | 'CLOSED' | 'OVERCROWDED_EXIT_ONLY';
  crowd_level: CrowdLevel;
  nearest_pandals: string[]; // pandal names or IDs
  source: string;
  source_url?: string;
  source_type: SourceType;
  verified_at: string;
  confidence: number;
  last_updated: string;
}

export interface TrafficAlert {
  id: string;
  title: string;
  description: string;
  category:
    | 'ROAD_CLOSURE'
    | 'ONE_WAY'
    | 'NO_ENTRY'
    | 'PEDESTRIAN_ONLY'
    | 'VEHICLE_RESTRICTION'
    | 'BUS_DIVERSION'
    | 'AUTO_RESTRICTION'
    | 'TRAFFIC_WARNING';
  area: string;
  affected_roads: string[];
  valid_from: string;
  valid_until: string;
  source: string;
  source_url?: string;
  source_type: SourceType;
  confidence: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  published_at: string;
}

export interface CrowdReport {
  id: string;
  pandal_id?: string;
  metro_station_id?: string;
  crowd_level: CrowdLevel;
  wait_time_minutes: number;
  source: string;
  source_type: SourceType;
  confidence: number;
  verified: boolean;
  reported_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: 'BIRYANI' | 'ROLL' | 'STREET_FOOD' | 'SWEETS' | 'COFFEE' | 'RESTAURANT';
  specialty?: string;
  address: string;
  lat: number;
  lng: number;
  area: string;
  nearest_metro?: string;
  rating: number;
  price_level: '$' | '$$' | '$$$';
  is_pure_veg: boolean;
  opening_time: string;
  closing_time: string;
  status: 'OPEN' | 'CLOSED';
  source: string;
  source_url?: string;
  source_type: SourceType;
  verified_at: string;
  confidence: number;
  last_updated: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  area: string;
  nearest_metro?: string;
  emergency_number: string;
  ambulance_number: string;
  has_emergency_icu: boolean;
  status: 'OPEN_24_7';
  source: string;
  source_url?: string;
  verified_at: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  area: string;
  nearest_metro?: string;
  phone: string;
  control_room: string;
  status: 'OPEN_24_7';
  source: string;
  source_url?: string;
  verified_at: string;
}

export interface PujaCalendarDay {
  id: string; // YYYY-MM-DD
  year: number;
  date: string;
  day_of_week?: string;
  display_label?: string;
  tithi_name: string;
  is_pre_puja: boolean;
  is_main_puja?: boolean;
  metro_service_type: 'NORMAL' | 'EXTENDED' | 'ALL_NIGHT';
  crowd_expectation: CrowdLevel;
  description: string;
  source: string;
  source_url?: string;
  verified_at: string;
}

export interface WalkingLeg {
  from_name: string;
  from_lat: number;
  from_lng: number;
  to_name: string;
  to_lat: number;
  to_lng: number;
  distance_meters: number;
  estimated_walking_minutes: number;
  crowd_status: CrowdLevel;
  road_status: string;
  navigation_action_url: string; // Real Google Maps / Apple Maps directions link
  transit_mode: 'WALK' | 'METRO';
  metro_line?: string;
  metro_stations_count?: number;
}

export interface TripStop {
  id: string;
  stop_order: number;
  stop_type: 'START' | 'PANDAL' | 'METRO_BOARD' | 'METRO_ALIGHT' | 'FOOD' | 'END';
  pandal?: Pandal;
  metro_station?: MetroStation;
  restaurant?: Restaurant;
  custom_name: string;
  lat: number;
  lng: number;
  arrival_time: string;
  departure_time: string;
  duration_minutes: number;
  distance_from_prev_meters: number;
  walking_time_from_prev_minutes: number;
  crowd_status: CrowdLevel;
  road_status: string;
  navigation_url: string;
  visited: boolean;
  visited_at?: string;
}

export interface TripPlan {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start_location_name: string;
  start_lat: number;
  start_lng: number;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  group_size: number;
  walking_tolerance: WalkingTolerance;
  transport_preference: TransportPreference;
  interests: string[];
  route_type: RouteType;
  total_pandals: number;
  total_walking_distance_meters: number;
  total_travel_time_minutes: number;
  estimated_visit_minutes: number;
  metro_rides: number;
  food_stops_count: number;
  buffer_time_minutes: number;
  route_confidence: number;
  stops: TripStop[];
  legs: WalkingLeg[];
  return_route?: string;
  ai_reasoning?: string;
  status: 'DRAFT' | 'SAVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
}

export interface RouteRecalculation {
  id: string;
  trip_id: string;
  trigger_reason: string;
  old_stops_count: number;
  new_stops_count: number;
  time_saved_minutes: number;
  distance_change_meters: number;
  reason: string;
  old_route_summary: string;
  new_route_summary: string;
  old_route?: string;
  new_route?: string;
  timestamp: string;
}

export interface WeatherSnapshot {
  city: string;
  temperature_c: number;
  apparent_temp_c: number;
  humidity_percent: number;
  precipitation_mm: number;
  weather_code: number;
  wind_speed_kmh: number;
  condition_text: string;
  is_safe_for_walking: boolean;
  source: string;
  source_url: string;
  fetched_at?: string;
  retrieved_at?: string;
  precipitation_probability?: number;
  is_rain_likely?: boolean;
  uv_index?: number;
  confidence?: number;
}

export interface APIHealthItem {
  id: 'supabase' | 'maps' | 'places' | 'weather' | 'bedrock' | 'agentrouter' | 'ai' | 'metro' | 'traffic';
  service_name: string;
  status: 'CONNECTED' | 'DEGRADED' | 'BLOCKED' | 'ERROR';
  endpoint?: string;
  latency_ms?: number;
  last_tested_at: string;
  error_message?: string;
  required_action?: string;
  details?: Record<string, unknown>;
}

export interface PandalVisitRecord {
  id: string;
  pandal_id: string;
  pandal_name: string;
  area: string;
  visited_at: string;
  rating?: number;
  photo_url?: string;
  notes?: string;
  source?: string;
  source_type?: string;
  verified_by_user?: boolean;
  dwell_time_minutes?: number;
  crowd_experienced?: CrowdLevel;
}
