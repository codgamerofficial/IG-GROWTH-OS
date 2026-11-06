-- =============================================================================
-- RIIQX — Real Product Intelligence & Purchase Verification Schema
-- Migration: 20261107120000_riiqx_product_intelligence_verification_schema.sql
-- "Know your needs. Make smarter moves."
-- Zero Simulation • Verifiable Sources • True Final Price • Strict RLS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PRODUCT RESEARCH SESSIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_research_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'screenshot', 'query', 'hybrid')),
  input_raw TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.product_research_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_research_sessions_user_manage" ON public.product_research_sessions;
CREATE POLICY "product_research_sessions_user_manage" ON public.product_research_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_prod_research_user ON public.product_research_sessions(user_id);

-- -----------------------------------------------------------------------------
-- 2. PRODUCT CANDIDATES & IDENTITIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.product_research_sessions(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  title TEXT NOT NULL,
  model TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  image_url TEXT,
  canonical_identifier TEXT,
  variant_attributes JSONB DEFAULT '{}'::jsonb,
  specifications JSONB DEFAULT '[]'::jsonb,
  identity_confidence NUMERIC(4,3) NOT NULL DEFAULT 0.900 CHECK (identity_confidence BETWEEN 0.000 AND 1.000),
  verification_source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.product_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_candidates_user_manage" ON public.product_candidates;
CREATE POLICY "product_candidates_user_manage" ON public.product_candidates
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.product_research_sessions s 
      WHERE s.id = product_candidates.session_id AND s.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_prod_candidates_session ON public.product_candidates(session_id);

-- -----------------------------------------------------------------------------
-- 3. RETAILER OFFERS & PRICE TRUTH
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.retailer_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.product_candidates(id) ON DELETE CASCADE,
  retailer_name TEXT NOT NULL,
  retailer_domain TEXT NOT NULL,
  seller_name TEXT,
  product_url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  listed_price NUMERIC(14,2),
  selling_price NUMERIC(14,2),
  delivery_charge NUMERIC(14,2),
  delivery_status TEXT NOT NULL DEFAULT 'unknown' CHECK (delivery_status IN ('free', 'charged', 'unknown')),
  mandatory_fees NUMERIC(14,2) NOT NULL DEFAULT 0,
  final_comparable_price NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'INR',
  availability TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability IN ('in_stock', 'out_of_stock', 'pre_order', 'unknown')),
  variant_match_status TEXT NOT NULL DEFAULT 'exact' CHECK (variant_match_status IN ('exact', 'similar_alternative', 'unverified')),
  verification_status TEXT NOT NULL 
    CHECK (verification_status IN ('live_verified', 'provider_reported', 'extracted_from_image', 'partially_verified', 'link_verified_price_pending', 'unverified', 'unavailable')),
  verification_method TEXT NOT NULL,
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_evidence JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.retailer_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "retailer_offers_user_manage" ON public.retailer_offers;
CREATE POLICY "retailer_offers_user_manage" ON public.retailer_offers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.product_candidates c
      JOIN public.product_research_sessions s ON s.id = c.session_id
      WHERE c.id = retailer_offers.candidate_id AND s.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_retailer_offers_candidate ON public.retailer_offers(candidate_id);

-- -----------------------------------------------------------------------------
-- 4. UPLOADED RESEARCH ASSETS (SCREENSHOTS & IMAGES)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.uploaded_research_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.product_research_sessions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  extracted_ocr_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.uploaded_research_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uploaded_research_assets_user_manage" ON public.uploaded_research_assets;
CREATE POLICY "uploaded_research_assets_user_manage" ON public.uploaded_research_assets
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 5. PRODUCT MATCH EVIDENCE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_match_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES public.product_candidates(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_reference TEXT NOT NULL,
  evidence_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0.900,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.product_match_evidence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_match_evidence_user_manage" ON public.product_match_evidence;
CREATE POLICY "product_match_evidence_user_manage" ON public.product_match_evidence
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.product_candidates c
      JOIN public.product_research_sessions s ON s.id = c.session_id
      WHERE c.id = product_match_evidence.candidate_id AND s.user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.product_research_sessions IS 'RIIQX Real Product Intelligence & Verification Sessions';
