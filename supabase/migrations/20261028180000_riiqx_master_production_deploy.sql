-- =============================================================================
-- RIIQX 2.0 — MASTER PRODUCTION DATABASE SCHEMA & DEPLOYMENT SCRIPT
-- Unified Personal Finance, Multi-Asset Intelligence, Social Media Autopilot,
-- AES-256 OAuth Token Vault, Autonomous Publishing & Row Level Security
-- =============================================================================
-- Execution Guide:
-- Copy and run this script in the Supabase Dashboard SQL Editor.
-- Fully idempotent: safe to run against blank or partially initialized databases.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. CORE EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. USER PROFILES & IDENTITY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'investor', 'analyst', 'admin')),
  preferred_language TEXT DEFAULT 'en',
  country TEXT DEFAULT 'IN',
  base_currency TEXT DEFAULT 'INR' CHECK (base_currency IN ('INR', 'USD', 'EUR', 'GBP')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Automatic Profile Onboarding Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    preferred_language,
    role,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'RIIQX Creator'
    ),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'en'),
    'creator',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
    SET display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. CONNECTED SOCIAL ACCOUNTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('youtube', 'instagram', 'facebook', 'whatsapp', 'threads', 'tiktok', 'twitter', 'linkedin')),
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_handle TEXT,
  avatar_url TEXT,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'error', 'revoked', 'permission_required')),
  platform_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  token_expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_provider_account UNIQUE (user_id, provider, platform_account_id)
);

CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_provider ON public.connected_accounts(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_status ON public.connected_accounts(status);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can manage their own connected accounts"
  ON public.connected_accounts FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 3. OAUTH CREDENTIALS VAULT (AES-256-GCM Encrypted)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oauth_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_account_id UUID NOT NULL REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  encryption_version TEXT NOT NULL DEFAULT 'v1-aes-256-gcm',
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_oauth_credentials_account UNIQUE (connected_account_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_credentials_user ON public.oauth_credentials(user_id);

ALTER TABLE public.oauth_credentials ENABLE ROW LEVEL SECURITY;

-- Deny all direct client SELECT; only service_role (backend) can access decrypted credentials
DROP POLICY IF EXISTS "Service role exclusive access to credentials vault" ON public.oauth_credentials;
CREATE POLICY "Service role exclusive access to credentials vault"
  ON public.oauth_credentials FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 4. SOCIAL PUBLISHING & SCHEDULING JOBS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_publishing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id TEXT,
  connected_account_id UUID REFERENCES public.connected_accounts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'facebook', 'whatsapp', 'threads', 'tiktok', 'twitter', 'linkedin')),
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  media_url TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'uploading', 'processing', 'published', 'failed', 'cancelled')),
  scheduled_for TIMESTAMPTZ,
  platform_media_id TEXT,
  platform_permalink TEXT,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  processing_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publishing_jobs_user_status ON public.social_publishing_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_scheduled ON public.social_publishing_jobs(scheduled_for, status);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_idempotency ON public.social_publishing_jobs(idempotency_key);

ALTER TABLE public.social_publishing_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their publishing jobs" ON public.social_publishing_jobs;
CREATE POLICY "Users can manage their publishing jobs"
  ON public.social_publishing_jobs FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 5. SOCIAL AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  provider TEXT NOT NULL,
  account_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_audit_user ON public.social_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_social_audit_created ON public.social_audit_logs(created_at);

ALTER TABLE public.social_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own audit logs" ON public.social_audit_logs;
CREATE POLICY "Users can read own audit logs"
  ON public.social_audit_logs FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.social_audit_logs;
CREATE POLICY "Service role can insert audit logs"
  ON public.social_audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 6. MARKET DATA SOURCES & INSTRUMENTS (Financial Intelligence)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.market_data_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'curated', 'official', 'licensed')),
  daily_call_limit INT DEFAULT 1000,
  calls_used_today INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  status_message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_class TEXT NOT NULL CHECK (asset_class IN ('indian_stock', 'us_stock', 'mutual_fund', 'etf', 'government_bond', 'corporate_bond', 'gold', 'silver', 'reit', 'fixed_deposit', 'crypto')),
  exchange TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'IN',
  currency TEXT NOT NULL DEFAULT 'INR',
  expense_ratio NUMERIC(5,4),
  pe_ratio NUMERIC(8,2),
  pb_ratio NUMERIC(8,2),
  dividend_yield NUMERIC(6,4),
  market_cap_category TEXT CHECK (market_cap_category IN ('large_cap', 'mid_cap', 'small_cap', 'micro_cap', 'sovereign', 'banking')),
  risk_rating TEXT CHECK (risk_rating IN ('low', 'low_to_moderate', 'moderate', 'moderately_high', 'high', 'very_high')),
  is_tradeable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instruments_symbol ON public.instruments(symbol);
CREATE INDEX IF NOT EXISTS idx_instruments_class ON public.instruments(asset_class);

CREATE TABLE IF NOT EXISTS public.instrument_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('isin', 'ticker', 'nse_symbol', 'bse_code', 'mfapi_code')),
  identifier_value TEXT NOT NULL,
  CONSTRAINT uq_identifier_type_value UNIQUE (identifier_type, identifier_value)
);

CREATE TABLE IF NOT EXISTS public.market_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  data_timestamp TIMESTAMPTZ NOT NULL,
  price NUMERIC(15,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  source_id TEXT REFERENCES public.market_data_sources(id),
  is_delayed BOOLEAN DEFAULT FALSE,
  day_change_pct NUMERIC(6,2),
  CONSTRAINT uq_instrument_timestamp UNIQUE (instrument_id, data_timestamp)
);

CREATE INDEX IF NOT EXISTS idx_mdp_instrument_timestamp ON public.market_data_points(instrument_id, data_timestamp DESC);

-- Public read access for universal instruments and market data
ALTER TABLE public.market_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instrument_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read market data sources" ON public.market_data_sources;
CREATE POLICY "Public read market data sources" ON public.market_data_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read instruments catalog" ON public.instruments;
CREATE POLICY "Public read instruments catalog" ON public.instruments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read instrument identifiers" ON public.instrument_identifiers;
CREATE POLICY "Public read instrument identifiers" ON public.instrument_identifiers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read market data points" ON public.market_data_points;
CREATE POLICY "Public read market data points" ON public.market_data_points FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 7. PORTFOLIOS & HOLDINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Main Portfolio',
  description TEXT,
  base_currency TEXT DEFAULT 'INR',
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their portfolios" ON public.user_portfolios;
CREATE POLICY "Users can manage their portfolios"
  ON public.user_portfolios FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.user_portfolios(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  quantity NUMERIC(15,4) NOT NULL,
  average_buy_price NUMERIC(15,4) NOT NULL,
  cost_basis NUMERIC(15,2) GENERATED ALWAYS AS (quantity * average_buy_price) STORED,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their portfolio holdings" ON public.portfolio_holdings;
CREATE POLICY "Users can manage their portfolio holdings"
  ON public.portfolio_holdings FOR ALL
  USING (
    portfolio_id IN (SELECT id FROM public.user_portfolios WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    portfolio_id IN (SELECT id FROM public.user_portfolios WHERE user_id = auth.uid())
    OR auth.role() = 'service_role'
  );

-- =============================================================================
-- SEED DATA: VERIFIED INSTRUMENTS & MARKET SOURCES
-- =============================================================================
INSERT INTO public.market_data_sources (id, name, tier, daily_call_limit, calls_used_today, is_active, status_message)
VALUES 
  ('mfapi', 'MFAPI.in Public API', 'free', 10000, 42, true, 'Healthy · Daily updated historical NAVs'),
  ('tapetide', 'Tapetide Indian Market Gateway', 'free', 50, 6, true, 'Healthy · Rate-limited to 50 calls/day'),
  ('alphavantage', 'Alpha Vantage Global API', 'free', 25, 4, true, 'Healthy · US equities and commodities'),
  ('rbi_retail', 'RBI Retail Direct Sovereign Catalog', 'official', 5000, 10, true, 'Healthy · Verified sovereign coupon rates'),
  ('institutional_fd', 'Indian Banks Published Term Deposit Rates', 'curated', 1000, 15, true, 'Healthy · DICGC insured up to ₹5 Lakh')
ON CONFLICT (id) DO UPDATE SET is_active = EXCLUDED.is_active;

INSERT INTO public.instruments (id, symbol, name, asset_class, exchange, country, currency, expense_ratio, pe_ratio, pb_ratio, dividend_yield, market_cap_category, risk_rating, is_tradeable)
VALUES
  ('11111111-1111-1111-1111-111111110001', 'RELIANCE', 'Reliance Industries Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 26.80, 2.30, 0.0035, 'large_cap', 'moderate', true),
  ('11111111-1111-1111-1111-111111110002', 'TCS', 'Tata Consultancy Services Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 30.15, 12.80, 0.0125, 'large_cap', 'moderate', true),
  ('11111111-1111-1111-1111-111111110003', 'HDFCBANK', 'HDFC Bank Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 18.50, 2.75, 0.0110, 'large_cap', 'moderate', true),
  ('22222222-2222-2222-2222-222222220001', '122639', 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', 'mutual_fund', 'MF', 'IN', 'INR', 0.0061, NULL, NULL, NULL, 'large_cap', 'moderately_high', true),
  ('33333333-3333-3333-3333-333333330001', 'NVDA', 'NVIDIA Corporation', 'us_stock', 'NASDAQ', 'US', 'USD', NULL, 48.20, 38.50, 0.0003, 'large_cap', 'high', true),
  ('44444444-4444-4444-4444-444444440001', 'NIFTYBEES', 'Nippon India Nifty 50 BeES ETF', 'etf', 'NSE', 'IN', 'INR', 0.0004, 23.40, 3.80, 0.0120, 'large_cap', 'moderate', true),
  ('88888888-8888-8888-8888-888888880001', 'GOLD999', '24K Physical Gold Bullion (99.9% Purity)', 'gold', 'MCX', 'IN', 'INR', NULL, NULL, NULL, NULL, 'sovereign', 'moderate', true)
ON CONFLICT (id) DO NOTHING;

-- Verification notification
DO $$
BEGIN
  RAISE NOTICE 'RIIQX 2.0 Master Production Schema & Seed Fixtures deployed successfully.';
END $$;
