-- ========================================================
-- GLOWFIT AI: SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCTS CATALOG
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Base', 'Lips', 'Cheeks', 'Eyes', 'Skincare'
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  image_url TEXT,
  shade TEXT,
  undertone TEXT, -- 'Warm', 'Cool', 'Neutral', 'Olive'
  style TEXT,
  skin_type TEXT, -- 'Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. LOOKS TABLE
CREATE TABLE IF NOT EXISTS public.looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  occasion TEXT NOT NULL, -- 'Everyday', 'Work', 'Date Night', 'Wedding Guest', 'Party', 'Photoshoot'
  style TEXT NOT NULL,    -- 'Natural', 'Soft Glow', 'Soft Glam', 'Bold', 'Classic', 'Minimal'
  budget_min NUMERIC NOT NULL DEFAULT 500,
  budget_max NUMERIC NOT NULL DEFAULT 3000,
  youcam_template_id TEXT,
  thumbnail_url TEXT,
  product_ids UUID[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SKIN ANALYSES
CREATE TABLE IF NOT EXISTS public.skin_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_image_url TEXT,
  result_image_url TEXT,
  analysis_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  mode TEXT NOT NULL DEFAULT 'demo', -- 'live' or 'demo'
  status TEXT NOT NULL DEFAULT 'completed',
  task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. BEAUTY PREFERENCES
CREATE TABLE IF NOT EXISTS public.beauty_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion TEXT NOT NULL,
  style TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. SAVED LOOKS
CREATE TABLE IF NOT EXISTS public.saved_looks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  look_id UUID REFERENCES public.looks(id) ON DELETE SET NULL,
  look_name TEXT NOT NULL,
  occasion TEXT,
  style TEXT,
  total_price NUMERIC NOT NULL DEFAULT 0,
  products_json JSONB DEFAULT '[]'::jsonb,
  vto_result_url TEXT,
  selfie_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. API TASKS (Asynchronous AI Task Tracking & Deduplication)
CREATE TABLE IF NOT EXISTS public.api_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'youcam',
  feature TEXT NOT NULL, -- 'skin_analysis', 'makeup_vto', 'look_vto'
  external_task_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  request_metadata JSONB DEFAULT '{}'::jsonb,
  response_metadata JSONB DEFAULT '{}'::jsonb,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ========================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_looks_occasion_style ON public.looks(occasion, style);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user ON public.skin_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_looks_user ON public.saved_looks(user_id);
CREATE INDEX IF NOT EXISTS idx_api_tasks_external ON public.api_tasks(external_task_id);
CREATE INDEX IF NOT EXISTS idx_api_tasks_status ON public.api_tasks(status);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skin_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beauty_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_tasks ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products
CREATE POLICY "Public read active products"
  ON public.products FOR SELECT
  USING (active = true);

-- Looks: Everyone can read active looks
CREATE POLICY "Public read active looks"
  ON public.looks FOR SELECT
  USING (active = true);

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Skin Analyses: Users read and insert their own analyses
CREATE POLICY "Users read own skin analyses"
  ON public.skin_analyses FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users insert own skin analyses"
  ON public.skin_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Beauty Preferences: Users manage own preferences
CREATE POLICY "Users read own beauty preferences"
  ON public.beauty_preferences FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users insert own beauty preferences"
  ON public.beauty_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Saved Looks: Users manage own saved looks
CREATE POLICY "Users read own saved looks"
  ON public.saved_looks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own saved looks"
  ON public.saved_looks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own saved looks"
  ON public.saved_looks FOR DELETE
  USING (auth.uid() = user_id);

-- API Tasks: Users read own tasks (service role has full access)
CREATE POLICY "Users read own tasks"
  ON public.api_tasks FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);
