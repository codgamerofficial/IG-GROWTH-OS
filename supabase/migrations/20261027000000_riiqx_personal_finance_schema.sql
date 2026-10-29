-- =============================================================================
-- RIIQX — Master Database Schema Migration
-- AI-Powered Personal Finance & Multi-Asset Investment Intelligence Platform
-- Compliant with SEBI Research/Adviser boundaries, RLS data isolation & strict typing
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'IN',
  base_currency TEXT DEFAULT 'INR' CHECK (base_currency IN ('INR', 'USD', 'EUR', 'GBP')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  risk_tolerance TEXT DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'growth', 'aggressive')),
  investment_horizon TEXT DEFAULT '3_to_5_years' CHECK (investment_horizon IN ('under_1_year', '1_to_3_years', '3_to_5_years', '5_plus_years')),
  monthly_income NUMERIC(15,2) DEFAULT 0,
  monthly_savings_budget NUMERIC(15,2) DEFAULT 0,
  theme_mode TEXT DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'system')),
  enable_push_alerts BOOLEAN DEFAULT TRUE,
  enable_email_digest BOOLEAN DEFAULT TRUE,
  stale_data_warning_threshold_hours INT DEFAULT 24,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FINANCIAL GOALS
CREATE TABLE IF NOT EXISTS public.financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('emergency_fund', 'retirement', 'home_purchase', 'education', 'wealth_creation', 'travel', 'custom')),
  target_amount NUMERIC(15,2) NOT NULL,
  current_amount NUMERIC(15,2) DEFAULT 0,
  target_date DATE NOT NULL,
  expected_annual_return_pct NUMERIC(5,2) DEFAULT 8.00,
  assumed_inflation_pct NUMERIC(5,2) DEFAULT 6.00,
  monthly_sip_target NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ACCOUNTS (Brokers, Banks, Physical Vaults)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('demat_broker', 'bank_savings', 'fixed_deposit', 'mutual_fund_folio', 'crypto_wallet', 'physical_vault', 'other')),
  account_number_mask TEXT,
  currency TEXT DEFAULT 'INR',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACCOUNT CONSENTS (RBI Account Aggregator & explicit user consents)
CREATE TABLE IF NOT EXISTS public.account_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  consent_handle TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('requested', 'active', 'revoked', 'expired')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  data_scope TEXT[] DEFAULT ARRAY['balances', 'transactions', 'holdings']
);

-- 6. INSTRUMENTS (Universal Asset Master Catalog)
CREATE TABLE IF NOT EXISTS public.instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_class TEXT NOT NULL CHECK (asset_class IN ('indian_stock', 'mutual_fund', 'us_stock', 'etf', 'government_bond', 'corporate_bond', 'reit', 'invit', 'fixed_deposit', 'gold', 'silver', 'other')),
  exchange TEXT,
  country TEXT DEFAULT 'IN',
  currency TEXT DEFAULT 'INR',
  isin TEXT,
  expense_ratio NUMERIC(5,4),
  pe_ratio NUMERIC(8,2),
  pb_ratio NUMERIC(8,2),
  dividend_yield NUMERIC(6,4),
  market_cap_category TEXT CHECK (market_cap_category IN ('large_cap', 'mid_cap', 'small_cap', 'micro_cap', 'sovereign', 'banking')),
  risk_rating TEXT CHECK (risk_rating IN ('low', 'low_to_moderate', 'moderate', 'moderately_high', 'high', 'very_high')),
  is_tradeable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INSTRUMENT IDENTIFIERS (ISIN, CUSIP, Scheme Codes)
CREATE TABLE IF NOT EXISTS public.instrument_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('isin', 'mfapi_code', 'nse_symbol', 'bse_code', 'ticker', 'cusip')),
  identifier_value TEXT NOT NULL,
  UNIQUE(identifier_type, identifier_value)
);

-- 8. MARKET DATA SOURCES & HEALTH
CREATE TABLE IF NOT EXISTS public.market_data_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT DEFAULT 'free',
  daily_call_limit INT,
  calls_used_today INT DEFAULT 0,
  last_call_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  status_message TEXT
);

-- 9. MARKET DATA POINTS (Historical & Live Quotes)
CREATE TABLE IF NOT EXISTS public.market_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  data_timestamp TIMESTAMPTZ NOT NULL,
  price NUMERIC(15,4) NOT NULL,
  currency TEXT DEFAULT 'INR',
  source_id TEXT REFERENCES public.market_data_sources(id),
  is_delayed BOOLEAN DEFAULT FALSE,
  delay_minutes INT DEFAULT 0,
  day_high NUMERIC(15,4),
  day_low NUMERIC(15,4),
  day_change_pct NUMERIC(6,3),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(instrument_id, data_timestamp)
);

-- 10. HOLDINGS
CREATE TABLE IF NOT EXISTS public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE RESTRICT,
  quantity NUMERIC(18,6) NOT NULL,
  average_buy_price NUMERIC(15,4) NOT NULL,
  invested_amount NUMERIC(15,2) GENERATED ALWAYS AS (ROUND((quantity * average_buy_price)::numeric, 2)) STORED,
  current_price NUMERIC(15,4) NOT NULL,
  current_value NUMERIC(15,2) GENERATED ALWAYS AS (ROUND((quantity * current_price)::numeric, 2)) STORED,
  currency TEXT DEFAULT 'INR',
  interest_rate_pct NUMERIC(5,2),
  tenure_months INT,
  maturity_date DATE,
  last_price_updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TRANSACTIONS (Ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE RESTRICT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'dividend', 'interest', 'maturity', 'deposit', 'withdrawal', 'split')),
  transaction_date DATE NOT NULL,
  quantity NUMERIC(18,6) DEFAULT 0,
  price_per_unit NUMERIC(15,4) DEFAULT 0,
  gross_amount NUMERIC(15,2) NOT NULL,
  fees_and_charges NUMERIC(10,2) DEFAULT 0,
  net_amount NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CASH FLOWS (For XIRR & Money-Weighted Return Calculation)
CREATE TABLE IF NOT EXISTS public.cash_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  holding_id UUID REFERENCES public.holdings(id) ON DELETE CASCADE,
  flow_date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL, -- Negative for outflows (investments), Positive for inflows (proceeds/dividends)
  flow_type TEXT NOT NULL CHECK (flow_type IN ('investment', 'redemption', 'dividend', 'coupon_interest')),
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. DIVIDENDS & INTEREST RECEIVED
CREATE TABLE IF NOT EXISTS public.dividends_and_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE RESTRICT,
  payment_date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  tax_deducted_tds NUMERIC(10,2) DEFAULT 0,
  net_received NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. WATCHLISTS
CREATE TABLE IF NOT EXISTS public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. WATCHLIST ITEMS
CREATE TABLE IF NOT EXISTS public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  target_buy_price NUMERIC(15,4),
  notes TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(watchlist_id, instrument_id)
);

-- 16. SAVED SCREENS (Custom Screener Filters)
CREATE TABLE IF NOT EXISTS public.saved_screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  filter_config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PORTFOLIO SNAPSHOTS (Daily / Weekly Balance Series)
CREATE TABLE IF NOT EXISTS public.portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  total_invested NUMERIC(15,2) NOT NULL,
  total_current_value NUMERIC(15,2) NOT NULL,
  total_unrealized_pnl NUMERIC(15,2) NOT NULL,
  total_realized_pnl NUMERIC(15,2) DEFAULT 0,
  asset_allocation_breakdown JSONB NOT NULL,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);

-- 18. ANALYSIS REPORTS (AI-assisted & Quantitative Research Artifacts)
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('portfolio_health', 'risk_concentration', 'bull_bear_scenario', 'asset_comparison', 'tax_drag_audit')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  quantitative_metrics JSONB NOT NULL,
  assumptions_and_sources JSONB NOT NULL,
  disclaimer_level TEXT DEFAULT 'educational_research',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. ALERTS (Price, Maturity, Portfolio Drift)
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instrument_id UUID REFERENCES public.instruments(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('price_above', 'price_below', 'percent_move', 'fd_maturity', 'bond_coupon', 'allocation_drift')),
  threshold_value NUMERIC(15,4),
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  push_token TEXT,
  fd_maturity_reminders_days_before INT[] DEFAULT ARRAY[15, 7, 1],
  weekly_portfolio_digest BOOLEAN DEFAULT TRUE,
  rebalance_alerts BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. PROVIDER HEALTH & QUOTA MONITORING
CREATE TABLE IF NOT EXISTS public.provider_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status_code INT,
  latency_ms INT,
  is_success BOOLEAN NOT NULL,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. AUDIT LOGS (Privacy, Data Export, Account Deletion)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation ensuring no user can read or modify another user's finance data
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dividends_and_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_screens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Catalog tables are publicly readable
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for instruments" ON public.instruments FOR SELECT USING (true);

ALTER TABLE public.instrument_identifiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for instrument identifiers" ON public.instrument_identifiers FOR SELECT USING (true);

ALTER TABLE public.market_data_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for market data points" ON public.market_data_points FOR SELECT USING (true);

ALTER TABLE public.market_data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for data sources" ON public.market_data_sources FOR SELECT USING (true);

-- User-scoped policies
CREATE POLICY "User read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "User full access preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access goals" ON public.financial_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access accounts" ON public.accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access consents" ON public.account_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access holdings" ON public.holdings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access cash flows" ON public.cash_flows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access dividends" ON public.dividends_and_interest FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access watchlists" ON public.watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access saved screens" ON public.saved_screens FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access snapshots" ON public.portfolio_snapshots FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access reports" ON public.analysis_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access alerts" ON public.alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User full access notification prefs" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User read own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
