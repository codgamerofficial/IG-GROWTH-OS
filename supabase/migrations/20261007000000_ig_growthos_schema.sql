-- =============================================================================
-- IG GrowthOS: Supabase Database Schema & Row Level Security (RLS)
-- Brand: RIIQX (Fashion / Clothing / Lifestyle)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website TEXT,
    instagram_account_id TEXT,
    instagram_username TEXT,
    target_audience TEXT,
    brand_voice TEXT,
    content_language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CONTENT PILLARS TABLE
CREATE TABLE IF NOT EXISTS public.content_pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    percentage NUMERIC DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CONTENT ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- Reel, Carousel, Single Image, Stories, Product Posts, UGC, etc.
    content_pillar TEXT,
    hook TEXT,
    script JSONB, -- scene-by-scene script, voiceover, b-roll, notes
    caption TEXT,
    hashtags TEXT[] DEFAULT '{}',
    cta TEXT,
    media_url TEXT,
    thumbnail_url TEXT,
    cover_text TEXT,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    instagram_media_id TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, READY, PENDING, APPROVED, SCHEDULED, PUBLISHING, PUBLISHED, REJECTED, FAILED
    approval_status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, READY, PENDING, APPROVED, REJECTED
    ai_score NUMERIC DEFAULT 0, -- 0 to 100 AI Opportunity Score
    ai_score_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CONTENT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.content_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL, -- hook, caption, hashtags, cta, script
    content TEXT NOT NULL,
    score NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. PRODUCTS TABLE (Clean recreate for IG GrowthOS)
DROP TABLE IF EXISTS public.looks CASCADE;
DROP TABLE IF EXISTS public.skin_analyses CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    sale_price NUMERIC,
    product_url TEXT,
    image_url TEXT,
    affiliate_url TEXT,
    commission NUMERIC,
    category TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TRENDS TABLE
CREATE TABLE IF NOT EXISTS public.trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    source TEXT NOT NULL,
    source_url TEXT,
    trend_score NUMERIC DEFAULT 0,
    relevance_score NUMERIC DEFAULT 0,
    content_angle TEXT,
    discovered_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
    instagram_media_id TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,
    video_views BIGINT DEFAULT 0,
    profile_visits BIGINT DEFAULT 0,
    followers_gained BIGINT DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. APPROVALS TABLE
CREATE TABLE IF NOT EXISTS public.approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- PENDING, APPROVED, REJECTED
    requested_at TIMESTAMPTZ DEFAULT now(),
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. AUTOMATION JOBS TABLE
CREATE TABLE IF NOT EXISTS public.automation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    job_type TEXT NOT NULL, -- daily_trend_research, daily_content_ideas, daily_workflow, etc.
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_content_brand_status ON public.content_items(brand_id, status);
CREATE INDEX IF NOT EXISTS idx_content_scheduled ON public.content_items(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_approval ON public.content_items(approval_status);
CREATE INDEX IF NOT EXISTS idx_analytics_brand_date ON public.analytics(brand_id, date);
CREATE INDEX IF NOT EXISTS idx_automation_brand_type ON public.automation_jobs(brand_id, job_type);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read / Authenticated full access policies for development & production
CREATE POLICY "Allow public read access to active brands" ON public.brands FOR SELECT USING (active = true);
CREATE POLICY "Allow authenticated read/write on brands" ON public.brands FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read/write on content_pillars" ON public.content_pillars FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read on content_pillars" ON public.content_pillars FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read/write on content_items" ON public.content_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read on content_items" ON public.content_items FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read/write on content_variants" ON public.content_variants FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read on content_variants" ON public.content_variants FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read/write on products" ON public.products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);

CREATE POLICY "Allow public read on trends" ON public.trends FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write on trends" ON public.trends FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read/write on analytics" ON public.analytics FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read on analytics" ON public.analytics FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read/write on approvals" ON public.approvals FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read on approvals" ON public.approvals FOR SELECT USING (true);

CREATE POLICY "Allow authenticated read/write on automation_jobs" ON public.automation_jobs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated read/write on audit_logs" ON public.audit_logs FOR ALL TO authenticated USING (true);
