-- =============================================================================
-- RIIQX — Personal AI Twin & Intelligence Platform Schema
-- Migration: 20261107000000_riiqx_personal_ai_twin_schema.sql
-- "Know your needs. Make smarter moves."
-- Non-Destructive • Strict RLS • DPDP Act Compliance • Append-Only Ledger
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. TWIN PROFILES & CONFIGURATION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.twin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  twin_name TEXT NOT NULL DEFAULT 'RIIQX Twin',
  autonomy_level INT NOT NULL DEFAULT 1 CHECK (autonomy_level BETWEEN 1 AND 3),
  tone TEXT NOT NULL DEFAULT 'pragmatic_analytical' CHECK (tone IN ('pragmatic_analytical', 'warm_supportive', 'direct_concise')),
  budget_tier TEXT NOT NULL DEFAULT 'balanced' CHECK (budget_tier IN ('frugal', 'balanced', 'premium', 'luxury')),
  skin_type TEXT,
  preferred_brands TEXT[] DEFAULT '{}',
  avoid_keywords TEXT[] DEFAULT '{}',
  notification_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (notification_frequency IN ('daily', 'weekly', 'important_only', 'off')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_twin_profiles_user UNIQUE (user_id)
);

ALTER TABLE public.twin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "twin_profiles_user_manage" ON public.twin_profiles;
CREATE POLICY "twin_profiles_user_manage" ON public.twin_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_twin_profiles_user_id ON public.twin_profiles(user_id);

-- -----------------------------------------------------------------------------
-- 2. TWIN MEMORIES & PREFERENCES TAXONOMY
-- Types: confirmed_preference, inferred_preference, temporary_context, unverified_assumption
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.twin_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('brand', 'budget', 'food', 'lifestyle', 'tech', 'health', 'travel', 'general')),
  memory_text TEXT NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'confirmed_preference' 
    CHECK (memory_type IN ('confirmed_preference', 'inferred_preference', 'temporary_context', 'unverified_assumption')),
  confidence_score NUMERIC(4,3) NOT NULL DEFAULT 1.000 CHECK (confidence_score BETWEEN 0.000 AND 1.000),
  source_type TEXT NOT NULL DEFAULT 'direct_user_statement' 
    CHECK (source_type IN ('direct_user_statement', 'purchase_analysis', 'user_feedback', 'inferred_pattern')),
  verified_by_user BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.twin_memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "twin_memories_user_manage" ON public.twin_memories;
CREATE POLICY "twin_memories_user_manage" ON public.twin_memories
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_twin_memories_user_category ON public.twin_memories(user_id, category);
CREATE INDEX IF NOT EXISTS idx_twin_memories_type ON public.twin_memories(memory_type);

-- -----------------------------------------------------------------------------
-- 3. TWIN PERSONAL GOALS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.twin_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('savings', 'purchase_budget', 'lifestyle', 'career', 'custom')),
  target_amount NUMERIC(14,2) DEFAULT 0,
  current_amount NUMERIC(14,2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.twin_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "twin_goals_user_manage" ON public.twin_goals;
CREATE POLICY "twin_goals_user_manage" ON public.twin_goals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_twin_goals_user_status ON public.twin_goals(user_id, status);

-- -----------------------------------------------------------------------------
-- 4. DECISION LAB & PERSISTENT SESSIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decision_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'purchase' CHECK (category IN ('purchase', 'subscription', 'career', 'travel', 'food', 'lifestyle')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'archived')),
  constraints JSONB DEFAULT '{}'::jsonb,
  evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  summary_verdict TEXT,
  confidence_score NUMERIC(4,3) DEFAULT 0.900,
  trade_offs TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.decision_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "decision_sessions_user_manage" ON public.decision_sessions;
CREATE POLICY "decision_sessions_user_manage" ON public.decision_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.decision_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.decision_sessions(id) ON DELETE CASCADE,
  option_name TEXT NOT NULL,
  merchant TEXT,
  price NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  score NUMERIC(4,2) NOT NULL DEFAULT 0,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  evidence JSONB DEFAULT '[]'::jsonb,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.decision_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "decision_candidates_user_manage" ON public.decision_candidates;
CREATE POLICY "decision_candidates_user_manage" ON public.decision_candidates
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.decision_sessions s 
      WHERE s.id = decision_candidates.session_id AND s.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- 5. PURCHASE INTELLIGENCE & PRICE TRUTH
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.purchase_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  merchant TEXT NOT NULL,
  product_url TEXT,
  image_url TEXT,
  input_type TEXT NOT NULL DEFAULT 'manual' CHECK (input_type IN ('url', 'screenshot', 'manual', 'query')),
  base_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(14,2) NOT NULL DEFAULT 0,
  taxes NUMERIC(14,2) NOT NULL DEFAULT 0,
  platform_fee NUMERIC(14,2) NOT NULL DEFAULT 0,
  coupon_discount NUMERIC(14,2) NOT NULL DEFAULT 0,
  card_discount NUMERIC(14,2) NOT NULL DEFAULT 0,
  conditional_cashback NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_payable NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  confidence_score NUMERIC(4,3) NOT NULL DEFAULT 0.950,
  assumptions JSONB DEFAULT '[]'::jsonb,
  evidence JSONB DEFAULT '[]'::jsonb,
  verdict TEXT NOT NULL,
  user_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.purchase_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchase_analyses_user_manage" ON public.purchase_analyses;
CREATE POLICY "purchase_analyses_user_manage" ON public.purchase_analyses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_purchase_analyses_user ON public.purchase_analyses(user_id);

-- -----------------------------------------------------------------------------
-- 6. OPPORTUNITIES & DEALS RADAR
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('coupon', 'deal', 'cashback', 'event', 'learning', 'lifestyle')),
  provider TEXT NOT NULL,
  source_url TEXT NOT NULL,
  terms TEXT,
  discount_type TEXT NOT NULL DEFAULT 'flat' CHECK (discount_type IN ('flat', 'percentage', 'cashback', 'free_shipping')),
  discount_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  minimum_order_value NUMERIC(14,2) DEFAULT 0,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'expired')),
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "opportunities_public_read" ON public.opportunities;
CREATE POLICY "opportunities_public_read" ON public.opportunities
  FOR SELECT TO authenticated, anon
  USING (verification_status != 'expired');

-- -----------------------------------------------------------------------------
-- 7. WEEKLY PERSONAL INTELLIGENCE DIGEST
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  title TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.weekly_digests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weekly_digests_user_manage" ON public.weekly_digests;
CREATE POLICY "weekly_digests_user_manage" ON public.weekly_digests
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_weekly_digests_user_week ON public.weekly_digests(user_id, week_start_date);

-- -----------------------------------------------------------------------------
-- 8. REWARD ACCOUNTS & APPEND-ONLY REWARD LEDGER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reward_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
  pending_balance NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
  lifetime_earned NUMERIC(14,2) NOT NULL DEFAULT 0.00 CHECK (lifetime_earned >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_reward_accounts_user UNIQUE (user_id)
);

ALTER TABLE public.reward_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reward_accounts_user_read" ON public.reward_accounts;
CREATE POLICY "reward_accounts_user_read" ON public.reward_accounts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.reward_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.reward_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  entry_type TEXT NOT NULL CHECK (entry_type IN ('credit', 'debit')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'redeemed')),
  source_type TEXT NOT NULL CHECK (source_type IN ('funded_merchant_campaign', 'referral', 'brand_feedback', 'partner_cashback', 'redemption')),
  reference_id TEXT,
  description TEXT NOT NULL,
  proof_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reward_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reward_ledger_user_read" ON public.reward_ledger;
CREATE POLICY "reward_ledger_user_read" ON public.reward_ledger
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 9. SECURE REFERRAL SYSTEM
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referral_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_signup' CHECK (status IN ('pending_signup', 'signed_up', 'verified', 'disqualified', 'rewarded')),
  reward_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.referral_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referral_records_referrer_read" ON public.referral_records;
CREATE POLICY "referral_records_referrer_read" ON public.referral_records
  FOR SELECT TO authenticated
  USING (auth.uid() = referrer_user_id);

CREATE INDEX IF NOT EXISTS idx_referral_records_code ON public.referral_records(referral_code);

-- -----------------------------------------------------------------------------
-- 10. ACTION APPROVALS & EXECUTION AUDIT ENGINE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed', 'failed')),
  explanation TEXT NOT NULL,
  idempotency_key TEXT UNIQUE,
  approved_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.action_approvals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "action_approvals_user_manage" ON public.action_approvals;
CREATE POLICY "action_approvals_user_manage" ON public.action_approvals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.action_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id UUID REFERENCES public.action_approvals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'retrying')),
  result JSONB DEFAULT '{}'::jsonb,
  error_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.action_execution_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "action_execution_logs_user_read" ON public.action_execution_logs;
CREATE POLICY "action_execution_logs_user_read" ON public.action_execution_logs
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 11. DATA OWNERSHIP, CONSENT & DPDP ACT COMPLIANCE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  is_granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT
);

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consent_records_user_manage" ON public.consent_records;
CREATE POLICY "consent_records_user_manage" ON public.consent_records
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'downloaded', 'failed', 'expired')),
  download_url TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "data_export_requests_user_manage" ON public.data_export_requests;
CREATE POLICY "data_export_requests_user_manage" ON public.data_export_requests
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verification comment
COMMENT ON SCHEMA public IS 'RIIQX Personal AI Twin & Intelligence Platform Schema (20261107)';
