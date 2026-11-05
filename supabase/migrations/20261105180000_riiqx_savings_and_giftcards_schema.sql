-- =============================================================================
-- RIIQX Phase 4: Savings Engine, Rule-Based Offers & Authorized Gift Card Ledger
-- Database Migration: 20261105180000_riiqx_savings_and_giftcards_schema.sql
-- =============================================================================

-- 1. Verified Store Coupons Table
CREATE TABLE IF NOT EXISTS public.verified_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- 'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'tatacliq', 'nykaa'
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('flat', 'percentage')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    max_discount NUMERIC(10, 2), -- Cap limit for percentage discounts
    min_spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
    eligible_categories TEXT[] DEFAULT ARRAY['all']::TEXT[],
    terms_summary TEXT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(platform, code)
);

-- 2. Verified Bank and Card Offers Table
CREATE TABLE IF NOT EXISTS public.bank_card_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name TEXT NOT NULL, -- 'HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'
    card_type TEXT NOT NULL CHECK (card_type IN ('credit', 'debit', 'all')),
    card_network TEXT DEFAULT 'any', -- 'Visa', 'Mastercard', 'RuPay', 'any'
    discount_pct NUMERIC(5, 2) NOT NULL CHECK (discount_pct > 0 AND discount_pct <= 100),
    max_discount NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_instant_discount BOOLEAN NOT NULL DEFAULT true, -- true = instant discount upfront, false = statement cashback
    eligible_platforms TEXT[] DEFAULT ARRAY['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'tatacliq']::TEXT[],
    terms TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Authorized Branded Gift Cards Catalog Table
CREATE TABLE IF NOT EXISTS public.gift_card_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_key TEXT UNIQUE NOT NULL, -- 'amazon_pay', 'flipkart', 'myntra', 'ajio', 'tatacliq', 'nykaa', 'makemytrip', 'swiggy', 'zomato'
    brand_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'shopping', -- 'shopping', 'fashion', 'food', 'travel'
    min_denomination NUMERIC(10, 2) NOT NULL DEFAULT 100,
    max_denomination NUMERIC(10, 2) NOT NULL DEFAULT 10000,
    supported_denominations NUMERIC(10, 2)[] DEFAULT ARRAY[250, 500, 1000, 2000, 5000]::NUMERIC(10, 2)[],
    current_discount_pct NUMERIC(5, 2) NOT NULL DEFAULT 0, -- Upfront discount
    current_cashback_pct NUMERIC(5, 2) NOT NULL DEFAULT 3.5, -- Guaranteed future cashback
    wallet_redemption_url TEXT NOT NULL,
    terms_and_conditions TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Gift Card Orders & Purchase Ledger Table
CREATE TABLE IF NOT EXISTS public.gift_card_orders (
    id TEXT PRIMARY KEY, -- e.g. GC_GLOW_17938...
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    brand_key TEXT NOT NULL REFERENCES public.gift_card_brands(brand_key),
    face_value NUMERIC(10, 2) NOT NULL CHECK (face_value > 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(10, 2) NOT NULL CHECK (amount_paid > 0), -- Upfront cash outlay
    cashback_amount NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Separated future cashback
    payment_method TEXT NOT NULL DEFAULT 'upi', -- 'upi', 'card', 'netbanking'
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded')),
    payment_gateway_ref TEXT,
    voucher_code TEXT NOT NULL,
    voucher_pin TEXT,
    voucher_status TEXT NOT NULL CHECK (voucher_status IN ('issued', 'redeemed', 'expired')),
    wallet_sync_status TEXT NOT NULL DEFAULT 'manual_or_direct_link',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Customer Cashback Ledger (Strictly Separated Financial Ledger)
CREATE TABLE IF NOT EXISTS public.cashback_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    gift_card_order_id TEXT REFERENCES public.gift_card_orders(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'credited', 'withdrawn', 'cancelled')),
    credited_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_verified_coupons_platform ON public.verified_coupons(platform, is_active);
CREATE INDEX IF NOT EXISTS idx_gift_card_orders_user ON public.gift_card_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gift_card_orders_idempotency ON public.gift_card_orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_cashback_ledger_user ON public.cashback_ledger(user_id, status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.verified_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_card_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_ledger ENABLE ROW LEVEL SECURITY;

-- Public read access to active coupons, bank offers, and gift card brands
CREATE POLICY "Public read active coupons" ON public.verified_coupons
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active bank offers" ON public.bank_card_offers
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read gift card brands" ON public.gift_card_brands
    FOR SELECT USING (is_available = true);

-- Users can read their own gift card orders
CREATE POLICY "Users view own gift card orders" ON public.gift_card_orders
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can read their own cashback ledger
CREATE POLICY "Users view own cashback ledger" ON public.cashback_ledger
    FOR SELECT USING (auth.uid() = user_id);

