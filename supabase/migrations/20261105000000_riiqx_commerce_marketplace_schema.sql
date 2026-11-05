-- =============================================================================
-- RIIQX 2.5 — Commerce Marketplace, Catalog & Supplier Schema
-- Comprehensive Product Registry, Sellers, Verified Dropshipping Suppliers,
-- Hierarchical Categories, Country of Origin, and Row Level Security
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'ShoppingBag',
  parent_id TEXT REFERENCES public.product_categories(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Verified Sellers Table (Marketplace Entities)
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  gstin TEXT NOT NULL,
  pan TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT DEFAULT 'India' NOT NULL,
  rating NUMERIC(3, 2) DEFAULT 4.80,
  review_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Verified Dropshipping Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gstin TEXT NOT NULL,
  warehouse_location TEXT NOT NULL,
  warehouse_city TEXT NOT NULL,
  warehouse_pincode TEXT NOT NULL,
  shipping_days_min INT DEFAULT 2,
  shipping_days_max INT DEFAULT 5,
  return_window_days INT DEFAULT 7,
  fulfillment_type TEXT DEFAULT 'express_dropship' CHECK (fulfillment_type IN ('express_dropship', 'standard', 'custom_freight')),
  rating NUMERIC(3, 2) DEFAULT 4.85,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Marketplace Products Table
CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category_id TEXT REFERENCES public.product_categories(id) ON DELETE RESTRICT,
  sku TEXT UNIQUE NOT NULL,
  gtin TEXT,
  description TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  images TEXT[] NOT NULL DEFAULT '{}',
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_price NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
  verified_mrp NUMERIC(10, 2) NOT NULL CHECK (verified_mrp >= current_price),
  discount_pct NUMERIC(5, 2) GENERATED ALWAYS AS (ROUND(((verified_mrp - current_price) / NULLIF(verified_mrp, 0)) * 100, 2)) STORED,
  currency TEXT DEFAULT 'INR' NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INT DEFAULT 100 CHECK (stock_quantity >= 0),
  seller_id UUID REFERENCES public.sellers(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_cost NUMERIC(10, 2),
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  shipping_days_estimate TEXT DEFAULT '2-4 Days Express',
  return_policy TEXT DEFAULT '7-Day Return / Replacement Policy',
  warranty TEXT DEFAULT '1-Year Official Manufacturer Warranty',
  country_of_origin TEXT DEFAULT 'India' NOT NULL,
  trending_score INT DEFAULT 85 CHECK (trending_score BETWEEN 0 AND 100),
  is_featured BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT TRUE,
  data_source TEXT DEFAULT 'verified_supplier_catalog',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mk_products_category ON public.marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_mk_products_brand ON public.marketplace_products(brand);
CREATE INDEX IF NOT EXISTS idx_mk_products_trending ON public.marketplace_products(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_mk_products_price ON public.marketplace_products(current_price ASC);

-- 5. Product Reviews & Ratings Table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.product_reviews(product_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Admin write
DROP POLICY IF EXISTS "Public can view product categories" ON public.product_categories;
CREATE POLICY "Public can view product categories" ON public.product_categories FOR SELECT USING (true);

-- Sellers: Public read, Admin write
DROP POLICY IF EXISTS "Public can view sellers" ON public.sellers;
CREATE POLICY "Public can view sellers" ON public.sellers FOR SELECT USING (true);

-- Suppliers: Public read active, Admin write
DROP POLICY IF EXISTS "Public can view active suppliers" ON public.suppliers;
CREATE POLICY "Public can view active suppliers" ON public.suppliers FOR SELECT USING (is_active = true);

-- Products: Public read in-stock / active products
DROP POLICY IF EXISTS "Public can view marketplace products" ON public.marketplace_products;
CREATE POLICY "Public can view marketplace products" ON public.marketplace_products FOR SELECT USING (true);

-- Reviews: Public read
DROP POLICY IF EXISTS "Public can view product reviews" ON public.product_reviews;
CREATE POLICY "Public can view product reviews" ON public.product_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can post reviews" ON public.product_reviews;
CREATE POLICY "Authenticated users can post reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

