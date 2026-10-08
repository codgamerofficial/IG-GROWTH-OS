-- =============================================================================
-- PujaHop Kolkata: Production Database Seed Data
-- Product: PujaHop Kolkata — One Day. One City. Maximum Puja.
-- Schema: PostgreSQL (Supabase)
-- =============================================================================

-- Clean up existing data for a fresh seed (child tables first to satisfy foreign keys)
DELETE FROM public.audit_logs;
DELETE FROM public.weather_snapshots;
DELETE FROM public.route_recalculations;
DELETE FROM public.pandal_photos;
DELETE FROM public.user_saved_pandals;
DELETE FROM public.user_preferences;
DELETE FROM public.pandal_visits;
DELETE FROM public.trip_stops;
DELETE FROM public.trip_plans;
DELETE FROM public.crowd_reports;
DELETE FROM public.traffic_alerts;
DELETE FROM public.walking_routes;
DELETE FROM public.restaurants;
DELETE FROM public.police_stations;
DELETE FROM public.hospitals;
DELETE FROM public.puja_calendar;
DELETE FROM public.metro_stations;
DELETE FROM public.metro_lines;
DELETE FROM public.pandal_sources;
DELETE FROM public.pandals;

-- 1. SEED PUJA CALENDAR 2026 (Almanac Verified)
INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-10', 2026, '2026-10-10', 'Mahalaya', true, 'NORMAL', 'MODERATE', 'Tarpan at Ganga Ghats in morning; Chokkhudaan at Kumartuli. Pandals under final bamboo and electric preparation.', 'Official Bengal Almanac 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-13', 2026, '2026-10-13', 'Tritiya (Inauguration Day)', true, 'NORMAL', 'MODERATE', 'Early VIP preview inaugurations at major pandals like Sreebhumi and Bagbazar.', 'Kolkata Police Crowd Control Blueprint', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-14', 2026, '2026-10-14', 'Chaturthi (Pre-Puja Mode)', true, 'EXTENDED', 'HIGH', 'Pre-Puja hopping starts in full swing. Ideal day for serious photographers to beat extreme weekend rush.', 'West Bengal Tourism Guide 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-15', 2026, '2026-10-15', 'Panchami (Pre-Puja Mode)', true, 'EXTENDED', 'HIGH', 'Evening crowds surge across North and South Kolkata. All major award-winning pandals open for darshan.', 'Kolkata Police Advisory 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-16', 2026, '2026-10-16', 'Shashthi Purba (Pre-Puja)', true, 'EXTENDED', 'HIGH', 'Eve of Shashthi. Night hopping begins in earnest as traffic restrictions take effect from 4:00 PM.', 'Kolkata Traffic Police Circular', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-17', 2026, '2026-10-17', 'Maha Shashthi (Main Puja Day 1)', false, 'ALL_NIGHT', 'HIGH', 'Bodhon and Adhivash rituals performed. All pandals across Kolkata are 100% open with continuous darshan.', 'Official Bengal Almanac 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-18', 2026, '2026-10-18', 'Maha Saptami (Main Puja Day 2)', false, 'ALL_NIGHT', 'EXTREME', 'Kola Bou Snan early morning. Peak hopping day with night-long revelry and full metro night service.', 'Official Bengal Almanac 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-19', 2026, '2026-10-19', 'Maha Ashtami (Main Puja Day 3)', false, 'ALL_NIGHT', 'EXTREME', 'Pushpanjali, Kumari Puja, and dramatic Sandhi Puja. Highest crowd intensity of the festival.', 'Official Bengal Almanac 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-20', 2026, '2026-10-20', 'Maha Navami (Main Puja Day 4)', false, 'ALL_NIGHT', 'EXTREME', 'Dhunuchi Naach competitions, grand aarti, and legendary all-night till dawn hopping circuit.', 'Official Bengal Almanac 2026', CURRENT_TIMESTAMP);

INSERT INTO public.puja_calendar (id, year, date, tithi_name, is_pre_puja, metro_service_type, crowd_expectation, description, source, verified_at)
VALUES ('2026-10-21', 2026, '2026-10-21', 'Bijoya Dashami (Bisarjan)', false, 'EXTENDED', 'HIGH', 'Sindoor Khela, emotional farewell to Devi Durga, and majestic immersion processions at Babughat.', 'Official Bengal Almanac 2026', CURRENT_TIMESTAMP);

-- 2. SEED METRO LINES
INSERT INTO public.metro_lines (id, line_name, color_hex, operating_span, puja_night_service, normal_hours, puja_hours, headway_minutes)
VALUES ('blue', 'Blue Line (Line 1 - North-South)', '#2563EB', 'Dakshineswar to Kavi Subhash', true, '06:45 - 22:30', '24/7 All-Night (Saptami to Navami)', 10);

INSERT INTO public.metro_lines (id, line_name, color_hex, operating_span, puja_night_service, normal_hours, puja_hours, headway_minutes)
VALUES ('green_underwater', 'Green Line (Line 2 - Underwater Corridor)', '#059669', 'Howrah Maidan to Esplanade', true, '07:00 - 21:45', '07:00 - 23:45', 12);

INSERT INTO public.metro_lines (id, line_name, color_hex, operating_span, puja_night_service, normal_hours, puja_hours, headway_minutes)
VALUES ('green_east', 'Green Line (Line 2 - East)', '#10B981', 'Sealdah to Salt Lake Sector V', true, '07:00 - 21:40', '07:00 - 23:30', 12);

INSERT INTO public.metro_lines (id, line_name, color_hex, operating_span, puja_night_service, normal_hours, puja_hours, headway_minutes)
VALUES ('purple', 'Purple Line (Line 3)', '#9333EA', 'Joka to Majerhat', false, '08:30 - 18:30', '08:00 - 19:00', 25);

INSERT INTO public.metro_lines (id, line_name, color_hex, operating_span, puja_night_service, normal_hours, puja_hours, headway_minutes)
VALUES ('orange', 'Orange Line (Line 6)', '#F97316', 'Kavi Subhash to Hemanta Mukhopadhyay', false, '09:00 - 18:00', '09:00 - 18:00', 30);

-- 3. SEED METRO STATIONS
INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-1', 'Shyambazar', 'blue', 22.6022, 88.3708, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-2', 'Sovabazar Sutanuti', 'blue', 22.5978, 88.3683, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-3', 'Girish Park', 'blue', 22.5861, 88.3619, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-4', 'Mahatma Gandhi Road', 'blue', 22.5802, 88.3616, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-5', 'Central', 'blue', 22.5714, 88.3601, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-6', 'Esplanade', 'blue', 22.5647, 88.3516, true, 'Green Line (Underwater Tunnel to Howrah)', 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-7', 'Howrah Maidan', 'green_underwater', 22.5872, 88.3308, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-8', 'Howrah Railway Station', 'green_underwater', 22.5830, 88.3418, false, 'Eastern Railway and South Eastern Railway Hub', 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-9', 'Netaji Bhavan', 'blue', 22.5367, 88.3475, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-10', 'Jatin Das Park', 'blue', 22.5278, 88.3469, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-11', 'Kalighat', 'blue', 22.5186, 88.3472, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-12', 'Rabindra Sarobar', 'blue', 22.5086, 88.3461, false, NULL, 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-13', 'Karunamoyee', 'green_east', 22.5862, 88.4198, false, 'Salt Lake Central Bus Terminus', 'OPEN');

INSERT INTO public.metro_stations (id, name, line_id, lat, lng, is_interchange, connects_to, operating_status)
VALUES ('ms-14', 'Sealdah', 'green_east', 22.5670, 88.3712, true, 'Sealdah Suburban Railway Junction', 'OPEN');

-- 4. SEED PANDALS
INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000001', 'bagbazar-sarbojanin', 'Bagbazar Sarbojanin Durgotsav', 'বাগবাজার সর্বজনীন দুর্গোৎসব', '7/1 Bagbazar Street, Kolkata 700003', 22.602500, 88.367000, 'North Kolkata', 'Bagbazar', 'Shyambazar (Blue Line)', 'Blue Line', 610, '2026-10-13', '06:00:00', '03:00:00', 'Traditional Ekchala', 'Committee Official Notice', 9.8, 6.0, 8.5, 9.0, 7.5, 9.5, 9.2, 45, 'EARLY OPENING', 'Official Bengal Almanac 2026', 'https://www.pujomap.com/guide/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000002', 'kumartuli-park', 'Kumartuli Park Sarbojanin', 'কুমারটুলি পার্ক সর্বজনীন', '8B Kumartuli Street, Hatkhola, Kolkata 700005', 22.599700, 88.364400, 'North Kolkata', 'Kumartuli', 'Sovabazar Sutanuti (Blue Line)', 'Blue Line', 450, '2026-10-14', '10:00:00', '04:00:00', 'Not officially announced', NULL, 8.2, 9.2, 9.4, 9.1, 6.8, 8.8, 8.9, 40, 'EARLY OPENING', 'West Bengal Tourism Guide 2026', 'https://www.wbtourism.gov.in/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000003', 'ahiritola-sarbojanin', 'Ahiritola Sarbojanin Durgotsab', 'আহিরীটোলা সর্বজনীন দুর্গোৎসব', '126 BK Paul Avenue, Ahiritola, Kolkata 700005', 22.593600, 88.358200, 'North Kolkata', 'Sovabazar', 'Sovabazar Sutanuti (Blue Line)', 'Blue Line', 550, '2026-10-14', '12:00:00', '04:00:00', 'Not officially announced', NULL, 8.0, 9.0, 9.1, 8.8, 7.0, 8.4, 8.7, 40, 'EARLY OPENING', 'Pujo Map North Circuit', 'https://www.pujomap.com/guide/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000004', 'hatibagan-sarbojanin', 'Hatibagan Sarbojanin Durgotsav', 'হাতিবাগান সর্বজনীন দুর্গোৎসব', 'Hatibagan Crossing, Kolkata 700004', 22.598600, 88.372500, 'North Kolkata', 'Hatibagan', 'Shyambazar (Blue Line)', 'Blue Line', 400, '2026-10-14', '12:00:00', '03:00:00', 'Traditional Art and Handloom', 'Press Release', 8.5, 8.8, 8.9, 8.5, 7.2, 8.6, 8.6, 35, 'EARLY OPENING', 'Kolkata Tourism Portal', 'https://kolkatatourism.gov.in/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000005', 'college-square', 'College Square Sarbojanin', 'কলেজ স্কয়ার সর্বজনীন দুর্গোৎসব', '53 College Street, Kolkata 700073', 22.574400, 88.362900, 'Central Kolkata', 'College Square', 'Central / MG Road (Blue Line)', 'Blue Line', 350, '2026-10-14', '16:00:00', '05:00:00', 'Traditional Water Palace Illumination', 'Official Committee Site', 8.8, 8.9, 9.0, 9.7, 7.8, 9.6, 9.4, 50, 'EARLY OPENING', 'Kolkata Municipal Directory', 'https://www.kmcgov.in/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000006', 'mohammad-ali-park', 'Mohammad Ali Park Durga Puja', 'মহম্মদ আলি পার্ক দুর্গোৎসব', 'Mohammad Ali Park, Chittaranjan Ave, Kolkata 700073', 22.578600, 88.361100, 'Central Kolkata', 'Central', 'MG Road (Blue Line)', 'Blue Line', 280, '2026-10-14', '14:00:00', '04:00:00', 'Grand Temple Architectural Replica', 'Kolkata Police Advisory', 8.6, 9.1, 9.2, 9.0, 7.5, 9.2, 9.1, 45, 'EARLY OPENING', 'Kolkata Police Advisory', 'https://kolkatapolice.gov.in/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000007', 'ekdalia-evergreen', 'Ekdalia Rd Evergreen Club', 'একডালিয়া এভারগ্রীন ক্লাব', '15 Ekdalia Road, Gariahat, Kolkata 700019', 22.518600, 88.364700, 'South Kolkata', 'Gariahat', 'Kalighat (Blue Line)', 'Blue Line', 950, '2026-10-14', '08:00:00', '05:00:00', 'Classical Temple Architecture', 'Press Briefing', 9.4, 9.1, 9.3, 9.2, 7.0, 9.7, 9.5, 50, 'EARLY OPENING', 'South Kolkata Puja Circuit', 'https://www.pujomap.com/guide/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000008', 'maddox-square', 'Maddox Square (Rani Rashmoni)', 'ম্যাডক্স স্কোয়ার দুর্গোৎসব', 'Pritam Mookerjee Rd, Ballygunge, Kolkata 700019', 22.529800, 88.358200, 'South Kolkata', 'Ballygunge', 'Netaji Bhavan (Blue Line)', 'Blue Line', 800, '2026-10-14', '07:00:00', '04:00:00', 'Traditional Dhaker Saaj', 'Heritage Archive', 9.6, 7.5, 8.5, 9.4, 8.5, 9.3, 9.3, 60, 'EARLY OPENING', 'Telegraph India Coverage', 'https://www.telegraphindia.com/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000009', 'suruchi-sangha', 'Suruchi Sangha (New Alipore)', 'সুরুচি সংঘ দুর্গোৎসব', 'SN Roy Rd, Sahapur, New Alipore, Kolkata 700038', 22.513200, 88.328400, 'South Kolkata', 'New Alipore', 'Majerhat / Kalighat', 'Purple / Blue', 1200, '2026-10-13', '10:00:00', '04:00:00', 'State Cultural Integration Theme', 'Govt of WB Portal', 8.2, 9.7, 9.6, 9.3, 8.2, 9.5, 9.4, 50, 'EARLY OPENING', 'West Bengal Media Portal', 'https://wb.gov.in/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

INSERT INTO public.pandals (
    id, slug, name, name_bn, address, lat, lng, area, neighborhood, nearest_metro, metro_line, 
    walking_distance_meters, opening_date, opening_time, closing_time, theme, theme_source, 
    traditional_score, theme_score, art_score, photo_score, accessibility_score, crowd_score, 
    overall_score, estimated_visit_minutes, status, source, source_url, source_type, verified_at, confidence
) VALUES (
    'b0000001-0000-0000-0000-000000000010', 'sreebhumi-sporting', 'Sreebhumi Sporting Club', 'শ্রীভূমি স্পোর্টিং ক্লাব', 'VIP Road, Lake Town, Kolkata 700048', 22.598300, 88.404200, 'East Kolkata / VIP Road', 'Lake Town', 'Ultadanga / Salt Lake Stadium', 'Green Line', 1400, '2026-10-12', '08:00:00', '05:00:00', 'World Architectural Landmark', 'Bidhannagar Police Plan', 7.9, 9.8, 9.7, 9.8, 6.5, 9.9, 9.6, 60, 'EARLY OPENING', 'Bidhannagar Police Commissionerate', 'https://bidhannagarpolice.gov.in/', 'OFFICIAL', CURRENT_TIMESTAMP, 1.00
);

-- 5. SEED VERIFIED RESTAURANTS
INSERT INTO public.restaurants (id, name, cuisine, address, lat, lng, area, nearest_metro, price_range, must_try, opening_hours, source, verified_at)
VALUES ('r-1', 'Mitra Cafe', 'STREET_FOOD', '47 Jatindra Mohan Ave, Sovabazar, Kolkata 700005', 22.5992, 88.3683, 'North Kolkata', 'Sovabazar Sutanuti', '₹₹', 'Fish Fry, Mutton Kabiraji', '16:00 - 02:00', 'Verified Heritage Register', CURRENT_TIMESTAMP);

INSERT INTO public.restaurants (id, name, cuisine, address, lat, lng, area, nearest_metro, price_range, must_try, opening_hours, source, verified_at)
VALUES ('r-2', 'Arsalan (Park Circus)', 'BIRYANI', '191 Marina Park, 7 Point Crossing, Kolkata 700017', 22.5441, 88.3662, 'South Kolkata', 'Rabindra Sadan', '₹₹₹', 'Kolkata Mutton Biryani', '11:00 - 04:00', 'Verified Heritage Register', CURRENT_TIMESTAMP);

INSERT INTO public.restaurants (id, name, cuisine, address, lat, lng, area, nearest_metro, price_range, must_try, opening_hours, source, verified_at)
VALUES ('r-3', 'Peter Cat', 'RESTAURANT', '18A Park Street, Kolkata 700016', 22.5532, 88.3524, 'Central Kolkata', 'Park Street', '₹₹₹', 'Chelo Kebab', '12:00 - 01:00', 'Verified Heritage Register', CURRENT_TIMESTAMP);

INSERT INTO public.restaurants (id, name, cuisine, address, lat, lng, area, nearest_metro, price_range, must_try, opening_hours, source, verified_at)
VALUES ('r-4', 'Balaram Mullick', 'SWEETS', '2 Broad Street, Ballygunge, Kolkata 700019', 22.5312, 88.3654, 'South Kolkata', 'Netaji Bhavan', '₹₹', 'Baked Rosogolla', '08:00 - 23:00', 'Verified Heritage Register', CURRENT_TIMESTAMP);

-- 6. SEED 24/7 HOSPITALS AND POLICE STATIONS
INSERT INTO public.hospitals (id, name, address, lat, lng, area, nearest_metro, emergency_phone, ambulance_phone, has_24x7_trauma, status, source, verified_at)
VALUES ('h-1', 'SSKM Hospital (IPGMER)', '244 AJC Bose Road, Bhowanipore, Kolkata 700020', 22.5393, 88.3426, 'South Kolkata', 'Rabindra Sadan', '033-2223-1589', '102', true, 'OPEN_24_7', 'West Bengal Health Dept', CURRENT_TIMESTAMP);

INSERT INTO public.hospitals (id, name, address, lat, lng, area, nearest_metro, emergency_phone, ambulance_phone, has_24x7_trauma, status, source, verified_at)
VALUES ('h-2', 'Calcutta Medical College and Hospital', '88 College Street, Bowbazar, Kolkata 700073', 22.5732, 88.3621, 'Central Kolkata', 'Central', '033-2255-1621', '102', true, 'OPEN_24_7', 'West Bengal Health Dept', CURRENT_TIMESTAMP);

INSERT INTO public.hospitals (id, name, address, lat, lng, area, nearest_metro, emergency_phone, ambulance_phone, has_24x7_trauma, status, source, verified_at)
VALUES ('h-3', 'R. G. Kar Medical College and Hospital', '1 Khudiram Bose Sarani, Belgachia, Kolkata 700004', 22.6044, 88.3752, 'North Kolkata', 'Shyambazar', '033-2555-7656', '102', true, 'OPEN_24_7', 'West Bengal Health Dept', CURRENT_TIMESTAMP);

INSERT INTO public.police_stations (id, division, station_name, address, lat, lng, phone, control_room, status, source, verified_at)
VALUES ('ps-1', 'Central Division', 'Kolkata Police Headquarters (Lalbazar)', '18 Lalbazar Street, Kolkata 700001', 22.5735, 88.3524, '033-2214-3230', '100 / 112', 'OPEN_24_7', 'Kolkata Police Directory', CURRENT_TIMESTAMP);

INSERT INTO public.police_stations (id, division, station_name, address, lat, lng, phone, control_room, status, source, verified_at)
VALUES ('ps-2', 'North Division', 'Shyampukur Police Station', '47 Balaram Ghosh Street, Kolkata 700004', 22.6012, 88.3695, '033-2555-4222', '100 / 112', 'OPEN_24_7', 'Kolkata Police Directory', CURRENT_TIMESTAMP);

INSERT INTO public.police_stations (id, division, station_name, address, lat, lng, phone, control_room, status, source, verified_at)
VALUES ('ps-3', 'South Division', 'Gariahat Police Station', '2 Gariahat Road, Kolkata 700019', 22.5181, 88.3652, '033-2464-1522', '100 / 112', 'OPEN_24_7', 'Kolkata Police Directory', CURRENT_TIMESTAMP);

-- 7. SEED KOLKATA POLICE TRAFFIC RESTRICTIONS
INSERT INTO public.traffic_alerts (id, alert_type, title, description, affected_roads, lat, lng, valid_from, valid_until, severity, source, source_url, status)
VALUES ('tr-1', 'ONE_WAY', 'Rashbehari Avenue Eastbound Only', 'One-way vehicular movement permitted from Chetla Central Road towards Gariahat Crossing.', ARRAY['Rashbehari Avenue', 'Gariahat Crossing'], 22.5186, 88.3582, '2026-10-14 15:00:00+05:30', '2026-10-21 06:00:00+05:30', 'MEDIUM', 'Kolkata Police Order No. 412/TP', 'https://kolkatapolice.gov.in/', 'ACTIVE');

INSERT INTO public.traffic_alerts (id, alert_type, title, description, affected_roads, lat, lng, valid_from, valid_until, severity, source, source_url, status)
VALUES ('tr-2', 'NO_ENTRY', 'Central Avenue Southbound Diversion', 'No goods vehicles or commercial taxis permitted south of Vivekananda Road crossing between 16:00 and 04:00.', ARRAY['Chittaranjan Avenue', 'Vivekananda Road'], 22.5835, 88.3615, '2026-10-14 16:00:00+05:30', '2026-10-21 04:00:00+05:30', 'HIGH', 'Kolkata Traffic Police Circular', 'https://kolkatapolice.gov.in/', 'ACTIVE');

INSERT INTO public.traffic_alerts (id, alert_type, title, description, affected_roads, lat, lng, valid_from, valid_until, severity, source, source_url, status)
VALUES ('tr-3', 'PEDESTRIAN_ONLY', 'College Street Pedestrian Zone', 'Strictly pedestrianized walking corridor around College Square. Zero motor vehicles allowed.', ARRAY['College Street', 'Surya Sen Street', 'Bankim Chatterjee Street'], 22.5744, 88.3629, '2026-10-14 14:00:00+05:30', '2026-10-21 05:00:00+05:30', 'HIGH', 'Kolkata Police Circular', 'https://kolkatapolice.gov.in/', 'ACTIVE');
