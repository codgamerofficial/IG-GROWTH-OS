-- =============================================================================
-- IG GrowthOS: Initial Database Seed
-- Brand: RIIQX (Fashion / Clothing / Lifestyle)
-- =============================================================================

-- Clean up existing data for a clean seed
TRUNCATE TABLE public.audit_logs, public.automation_jobs, public.approvals, public.analytics, 
               public.content_variants, public.content_items, public.products, public.trends, 
               public.content_pillars, public.brands CASCADE;

-- 1. INSERT BRAND: RIIQX
INSERT INTO public.brands (
    id, name, slug, description, website, instagram_account_id, instagram_username, 
    target_audience, brand_voice, content_language, timezone, active
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'RIIQX',
    'riiqx-fashion',
    'High-end contemporary streetwear and avant-garde lifestyle fashion for the modern vanguard.',
    'https://riiqx.com',
    '17841405309281745',
    'riiqx.official',
    'Gen Z & early-career millennials, streetwear enthusiasts, fashion innovators, aesthetics connoisseurs',
    'Premium, unapologetic, confident, trend-forward, sleek, highly visual, concise',
    'en',
    'America/New_York',
    true
);

-- 2. INSERT 8 CONTENT PILLARS FOR RIIQX
INSERT INTO public.content_pillars (id, brand_id, name, description, percentage, active) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Outfit Inspiration', 'Curated looks, full fit checks, layering masterclasses, aesthetic color matching', 25.0, true),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Product Showcase', 'Fabric macro shots, garment hardware details, silhouette showcases, drop announcements', 20.0, true),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'UGC', 'Customer unboxings, tagged styling reactions, street fit checks, real-world wear', 15.0, true),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Fashion Tips', 'Proportions, color theory, capsule wardrobe tips, shoe pairing rules', 10.0, true),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Styling', '1 item styled 3 ways, transitioning day to night, dressing for seasonal transitions', 10.0, true),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Behind the Scenes', 'Studio design sessions, fabric sourcing, packaging process, sample room leaks', 10.0, true),
('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Trend Content', 'Runway breakdowns, microtrend analysis, aesthetic forecasting, meme-culture commentary', 5.0, true),
('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Community', 'Q&As, fit battles, poll responses, styling advice for followers', 5.0, true);

-- 3. INSERT PRODUCTS CATALOG FOR RIIQX
INSERT INTO public.products (id, brand_id, name, description, price, sale_price, product_url, image_url, category, active) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Cyber Acid Oversized Heavyweight Tee', '280 GSM luxury combed cotton with mineral wash and subtle high-density tonal rubber branding.', 52.00, 44.00, 'https://riiqx.com/products/cyber-acid-tee', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 'Tops', true),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Tactical Wide-Leg Pleated Cargo Pants', 'Structured technical twill with articulated knee darts, cobra buckle cinch system, and 8 deep utility pockets.', 95.00, 85.00, 'https://riiqx.com/products/tactical-cargo-pants', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80', 'Bottoms', true),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Modular Double-Zip Boxy Hoodie', '460 GSM French terry with custom matte gunmetal double two-way zipper and oversized double-layer hood.', 120.00, 110.00, 'https://riiqx.com/products/boxy-double-zip-hoodie', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80', 'Outerwear', true),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Minimalist Weatherproof Tech Sling', 'Cordura nylon ballistic fabric with Fidlock magnetic buckle and padded modular dividers.', 48.00, 42.00, 'https://riiqx.com/products/tech-nylon-sling', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 'Accessories', true),
('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Raw-Hem Distressed Japanese Denim Jacket', '14oz selvedge denim in charcoal wash with dropped shoulders and raw fringe cuffs.', 140.00, 125.00, 'https://riiqx.com/products/raw-hem-denim-jacket', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80', 'Outerwear', true);

-- 4. INSERT CURRENT TRENDS
INSERT INTO public.trends (id, topic, source, source_url, trend_score, relevance_score, content_angle, discovered_at, expires_at) VALUES
('30000000-0000-0000-0000-000000000001', 'Deconstructed Utilitarian Denim', 'Instagram Explore & Highsnobiety', 'https://instagram.com/explore/tags/streetwear', 94.0, 96.0, 'Contrast structured tactical garments with raw hem denim to emphasize drape and texture.', now() - INTERVAL '2 days', now() + INTERVAL '14 days'),
('30000000-0000-0000-0000-000000000002', '3-Second Fast Cut Outfit Transitions', 'Reels Audio & Creator Dashboard', 'https://instagram.com/reels', 91.0, 98.0, 'Synch boot snap and hoodie zipper pull to trending heavy bass kick transition sound.', now() - INTERVAL '1 day', now() + INTERVAL '10 days'),
('30000000-0000-0000-0000-000000000003', 'Monochrome Earth Tones vs Acid Wash', 'Vogue Street Style 2026', 'https://vogue.com', 88.0, 90.0, 'Break conventional monotone rules with acid wash graphic tee under tailored charcoal outerwear.', now() - INTERVAL '3 days', now() + INTERVAL '21 days'),
('30000000-0000-0000-0000-000000000004', 'POV: Finding Your Uniform in 2026', 'TikTok Fashion & Reels Trends', 'https://tiktok.com', 95.0, 94.0, 'Relatable storytelling on moving past fast fashion to high-density timeless silhouette staples.', now() - INTERVAL '1 day', now() + INTERVAL '12 days');

-- 5. INSERT INITIAL CONTENT ITEMS (Covering all lifecycle states)
INSERT INTO public.content_items (
    id, brand_id, title, content_type, content_pillar, hook, script, caption, hashtags, cta, 
    thumbnail_url, cover_text, scheduled_at, published_at, instagram_media_id, status, approval_status, 
    ai_score, ai_score_breakdown
) VALUES
-- Item 1: Published Reel with live analytics
(
    '40000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Stop buying hoodies that lose their shape after 2 washes',
    'Reel',
    'Product Showcase',
    'Why your $80 hoodie feels like cardboard after wash #1.',
    '{"hook": "0-3s: Macro crop of 460 GSM ribbed weave stretching back instantly", "problem": "3-8s: Compare flimsy high-street cotton vs structured French terry", "story": "8-20s: Explaining high-density loopback yarn and double-lined hood architecture", "payoff": "20-28s: Full fit 360 spin showcasing boxy drape", "cta": "28-30s: Drop link in bio for the Modular Zip Hoodie"}',
    'The anatomy of a hoodie that actually holds its boxy structure forever. 460 GSM combed French terry, custom two-way matte gunmetal hardware, and zero synthetic filler.\n\nWhich colorway are you rocking this season? Drop a comment below.',
    ARRAY['#riiqx', '#streetwearfits', '#hoodieaesthetic', '#mensfashiontips', '#outfitinspiration', '#y2kfashion', '#highsnobiety'],
    'Comment HOODIE to receive the secret drop link & fabric guide.',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    'The 460 GSM Heavyweight Masterclass',
    now() - INTERVAL '3 days',
    now() - INTERVAL '3 days',
    '17983419082347101',
    'PUBLISHED',
    'APPROVED',
    94.5,
    '{"hook_strength": 96, "audience_relevance": 95, "trend_relevance": 92, "shareability": 94, "save_potential": 98, "conversion_potential": 92, "brand_fit": 96}'
),
-- Item 2: Scheduled Post
(
    '40000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '3 Ways to Style Tactical Cargo Pants Without Looking Like a Camper',
    'Carousel',
    'Styling',
    'If your cargos swallow your shoes, you are wearing the wrong cut.',
    '{"slide_1": "Slide 1: High-contrast fit with chunky platform loafers", "slide_2": "Slide 2: Minimalist tucked silhouette with cropped heavyweight tee", "slide_3": "Slide 3: Technical outerwear layering with cinched ankle toggles"}',
    'Cargos don''t have to mean baggy and shapeless. Here is how we balance proportions with structured wide-leg pleats and tactical hardware.\n\nSwipe through all 3 looks and save this for your next weekend fit breakdown.',
    ARRAY['#cargopants', '#stylingguide', '#streetwearinspo', '#widesilhouette', '#fashiontips', '#riiqxstyle'],
    'Save this post so you have the cheat-sheet when getting dressed.',
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
    'CARGO PROPORTIONS: 1 Pant, 3 Clean Looks',
    now() + INTERVAL '1 day',
    NULL,
    NULL,
    'SCHEDULED',
    'APPROVED',
    91.0,
    '{"hook_strength": 92, "audience_relevance": 94, "trend_relevance": 90, "shareability": 89, "save_potential": 95, "conversion_potential": 88, "brand_fit": 92}'
),
-- Item 3: Pending Approval
(
    '40000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'POV: You finally stopped dressing for everyone else',
    'Reel',
    'UGC',
    'The exact moment you realize clothes are armor, not costume.',
    '{"hook": "0-3s: Low angle walking shot against concrete minimalist brutalist building", "problem": "3-7s: Voiceover on breaking free from microtrend fatigue", "story": "7-18s: Quick cut details of Japanese denim texture and heavyweight tee collar", "payoff": "18-26s: Confident step into crosswalk, sunglasses reflection", "cta": "26-30s: Text on screen: Wear RIIQX. Move different."}',
    'Confidence isn''t bought; it''s cut into the silhouette. Heavyweight, unapologetic, built to outlast seasons.\n\nFeaturing the Raw-Hem Selvedge Denim Jacket & Cyber Acid Tee.',
    ARRAY['#pov', '#minimalstreetwear', '#fitcheck', '#darkaesthetic', '#riiqx', '#rawdenim'],
    'Tag your style partner in the comments.',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    'POV: Your 2026 Style Shift',
    NULL,
    NULL,
    NULL,
    'READY',
    'PENDING',
    88.5,
    '{"hook_strength": 89, "audience_relevance": 91, "trend_relevance": 93, "shareability": 90, "save_potential": 84, "conversion_potential": 82, "brand_fit": 91}'
),
-- Item 4: Draft Reel Idea
(
    '40000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Behind The Seams: Why We Rejected 14 Zipper Prototypes',
    'Reel',
    'Behind the Scenes',
    'Most brands use $0.15 plastic zippers. Here is why we spent 6 months designing ours.',
    '{"hook": "Macro drop test of custom metal teeth zipper", "story": "Explaining durability and smooth slide on heavy fleece", "payoff": "Finished hoodie zip sound design ASMR"}',
    'Obsession with details separates garments from collectibles. Inside our development process for the Modular Double-Zip Hoodie.',
    ARRAY['#behindthescenes', '#garmentconstruction', '#clothingproduction', '#riiqx', '#fashiondesign'],
    'Would you rather have a single or two-way zipper? Vote below.',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    'THE HARDWARE OBSESSION',
    NULL,
    NULL,
    NULL,
    'DRAFT',
    'DRAFT',
    86.0,
    '{"hook_strength": 88, "audience_relevance": 85, "trend_relevance": 84, "shareability": 86, "save_potential": 89, "conversion_potential": 83, "brand_fit": 92}'
);

-- 6. INSERT APPROVAL RECORD FOR PENDING ITEM
INSERT INTO public.approvals (id, content_id, status, requested_at) VALUES
('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 'PENDING', now() - INTERVAL '4 hours');

-- 7. INSERT REALISTIC HISTORICAL ANALYTICS FOR RIIQX (Last 14 days)
INSERT INTO public.analytics (
    brand_id, content_id, instagram_media_id, date, impressions, reach, likes, comments, 
    shares, saves, video_views, profile_visits, followers_gained, engagement_rate
) VALUES
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '13 days', 18450, 14200, 1140, 68, 245, 412, 12600, 310, 84, 5.82),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '12 days', 21300, 16900, 1380, 82, 310, 520, 14800, 395, 102, 6.18),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '11 days', 24100, 18500, 1520, 95, 340, 590, 16900, 430, 115, 6.25),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '10 days', 22800, 17800, 1410, 78, 290, 510, 15500, 380, 96, 5.92),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '9 days', 26500, 20400, 1690, 110, 385, 670, 18200, 490, 138, 6.42),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '8 days', 29400, 22800, 1890, 134, 430, 760, 20600, 560, 155, 6.64),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '7 days', 31200, 24100, 2010, 145, 480, 820, 21900, 610, 172, 6.78),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '6 days', 34500, 26900, 2240, 162, 540, 910, 24300, 680, 198, 6.91),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '5 days', 38200, 29800, 2490, 184, 620, 1020, 27100, 760, 225, 7.12),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '4 days', 42100, 32900, 2780, 205, 710, 1140, 30100, 840, 260, 7.35),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '3 days', 45800, 35700, 3050, 228, 790, 1260, 33200, 920, 290, 7.54),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '2 days', 47200, 36800, 3180, 240, 830, 1310, 34500, 960, 310, 7.62),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE - INTERVAL '1 day', 49100, 38400, 3340, 258, 880, 1390, 36100, 1020, 335, 7.71),
('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '17983419082347101', CURRENT_DATE, 51300, 40100, 3510, 275, 930, 1460, 38000, 1080, 355, 7.82);

-- 8. INSERT AUTOMATION JOBS
INSERT INTO public.automation_jobs (brand_id, job_type, status, started_at, completed_at, result) VALUES
('00000000-0000-0000-0000-000000000001', 'daily_trend_research', 'COMPLETED', now() - INTERVAL '6 hours', now() - INTERVAL '5 hours 58 minutes', '{"trends_discovered": 4, "top_category": "Streetwear Silhouettes"}'),
('00000000-0000-0000-0000-000000000001', 'daily_content_ideas', 'COMPLETED', now() - INTERVAL '4 hours', now() - INTERVAL '3 hours 57 minutes', '{"ideas_generated": 10, "top_score": 94.5}'),
('00000000-0000-0000-0000-000000000001', 'daily_analytics', 'COMPLETED', now() - INTERVAL '2 hours', now() - INTERVAL '1 hour 59 minutes', '{"engagement_delta": "+14.8%", "follower_net": "+355"}');

-- 9. AUDIT LOG INITIAL SEED
INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata) VALUES
('system_init', 'BRAND_INITIALIZED', 'brand', '00000000-0000-0000-0000-000000000001', '{"brand_name": "RIIQX", "category": "Fashion / Lifestyle"}'),
('system_init', 'PILLARS_CONFIGURED', 'content_pillars', '00000000-0000-0000-0000-000000000001', '{"pillar_count": 8}'),
('system_init', 'PRODUCTS_CATALOG_SYNCED', 'products', '00000000-0000-0000-0000-000000000001', '{"product_count": 5}');
