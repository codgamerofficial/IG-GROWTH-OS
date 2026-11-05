-- =============================================================================
-- RIIQX 2.5 — Price Intelligence, Price History Observations & Watchlist Schema
-- Non-Destructive • Strict RLS • Multi-Platform Observations & Target Alerts
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Product Price Observations History
CREATE TABLE IF NOT EXISTS public.product_price_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_identifier TEXT NOT NULL, -- ASIN, FSN, Barcode or Canonical Key
  product_title TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'tatacliq', 'nykaa', 'riiqx')),
  observed_price NUMERIC(10, 2) NOT NULL,
  observed_mrp NUMERIC(10, 2) NOT NULL,
  discount_pct NUMERIC(5, 2),
  seller_name TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  coupon_code TEXT,
  coupon_discount NUMERIC(10, 2) DEFAULT 0,
  bank_discount NUMERIC(10, 2) DEFAULT 0,
  source_url TEXT,
  verified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_obs_identifier ON public.product_price_observations(product_identifier);
CREATE INDEX IF NOT EXISTS idx_obs_platform ON public.product_price_observations(platform);
CREATE INDEX IF NOT EXISTS idx_obs_verified ON public.product_price_observations(verified_at DESC);

-- 2. User Price Drop Alert Watchlists
CREATE TABLE IF NOT EXISTS public.price_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  product_identifier TEXT NOT NULL,
  target_price NUMERIC(10, 2) NOT NULL,
  initial_price NUMERIC(10, 2) NOT NULL,
  lowest_recorded_price NUMERIC(10, 2) NOT NULL,
  preferred_platform TEXT DEFAULT 'any',
  notification_channel TEXT DEFAULT 'in_app' CHECK (notification_channel IN ('in_app', 'email', 'push')),
  is_active BOOLEAN DEFAULT TRUE,
  last_alerted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.price_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_active ON public.price_watchlists(is_active);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.product_price_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_watchlists ENABLE ROW LEVEL SECURITY;

-- Price Observations: Public read
DROP POLICY IF EXISTS "Public can view price observations" ON public.product_price_observations;
CREATE POLICY "Public can view price observations" ON public.product_price_observations FOR SELECT USING (true);

-- Watchlists: User-specific access
DROP POLICY IF EXISTS "Users can view their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can view their own watchlists"
  ON public.price_watchlists FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can insert their own watchlists"
  ON public.price_watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can update their own watchlists"
  ON public.price_watchlists FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can delete their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can delete their own watchlists"
  ON public.price_watchlists FOR DELETE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');
