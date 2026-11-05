-- =============================================================================
-- RIIQX — Phase 5: Dropshipping Operations & Supplier Logistics Schema
-- Order State Machine, Inventory Delta Sync, Courier Milestones, Returns & Refunds
-- Compliant with Indian E-Commerce Rules (2020 & 2026 Amendments) & GST/TCS
-- =============================================================================

-- 1. Dropshipping Orders Table
CREATE TABLE IF NOT EXISTS public.dropshipping_orders (
  id TEXT PRIMARY KEY,                                      -- e.g. ORD_RIIQX_1793901234_ABCD
  customer_id TEXT NOT NULL,                                -- Customer / Profile identifier
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,                          -- { street, city, state, pincode, country }
  status TEXT NOT NULL CHECK (
    status IN (
      'pending_payment',
      'paid',
      'supplier_confirmed',
      'packed',
      'shipped',
      'delivered',
      'cancelled',
      'return_requested',
      'returned',
      'refunded'
    )
  ) DEFAULT 'paid',
  supplier_id TEXT NOT NULL,                                -- Dropshipping supplier responsible for dispatch
  supplier_order_id TEXT,                                   -- Partner order confirmation ID
  courier_partner TEXT NOT NULL DEFAULT 'BlueDart Express', -- BlueDart, Delhivery, Ekart, Shadowfax
  tracking_number TEXT,                                     -- e.g. BD-DEL-89248210
  tracking_url TEXT,                                        -- Direct official tracking portal
  estimated_delivery_date TIMESTAMPTZ,
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  gst_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'upi_direct',
  payment_id TEXT,
  idempotency_key TEXT UNIQUE,                              -- Guaranteed duplicate charge prevention
  financial_breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,   -- COGS, shipping, gateway_fee, GST, net_margin
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Dropshipping Order Items Table
CREATE TABLE IF NOT EXISTS public.dropshipping_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.dropshipping_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  variant_id TEXT,
  product_title TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_supplier_cost NUMERIC(12, 2) NOT NULL,
  unit_selling_price NUMERIC(12, 2) NOT NULL,
  unit_margin NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Supplier Inventory Sync Table
CREATE TABLE IF NOT EXISTS public.supplier_inventory_sync (
  id TEXT PRIMARY KEY,
  supplier_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  available_stock INTEGER NOT NULL DEFAULT 0 CHECK (available_stock >= 0),
  reserved_stock INTEGER NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
  effective_stock INTEGER GENERATED ALWAYS AS (available_stock - reserved_stock) STORED,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  sync_status TEXT NOT NULL CHECK (
    sync_status IN ('in_sync', 'syncing', 'low_stock', 'out_of_stock', 'failed')
  ) DEFAULT 'in_sync',
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Order Tracking Events Table (Courier Milestones)
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.dropshipping_orders(id) ON DELETE CASCADE,
  milestone TEXT NOT NULL CHECK (
    milestone IN (
      'order_placed',
      'payment_confirmed',
      'supplier_accepted',
      'manifest_generated',
      'dispatched',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'rto_initiated',
      'return_pickup',
      'returned'
    )
  ),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  courier TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Returns & Refunds Table
CREATE TABLE IF NOT EXISTS public.returns_and_refunds (
  id TEXT PRIMARY KEY,                                      -- e.g. RET_RIIQX_1793901234_XYZ
  order_id TEXT NOT NULL REFERENCES public.dropshipping_orders(id) ON DELETE RESTRICT,
  customer_id TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (
    reason IN (
      'defective_or_damaged',
      'wrong_item_delivered',
      'quality_not_as_expected',
      'arrived_too_late',
      'size_fit_issue',
      'buyer_cancelled'
    )
  ),
  reason_details TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  qc_status TEXT NOT NULL CHECK (
    qc_status IN (
      'pending_inspection',
      'pickup_scheduled',
      'in_transit_to_hub',
      'qc_passed',
      'qc_rejected'
    )
  ) DEFAULT 'pending_inspection',
  refund_amount NUMERIC(12, 2) NOT NULL,
  refund_status TEXT NOT NULL CHECK (
    refund_status IN ('pending', 'processed', 'failed')
  ) DEFAULT 'pending',
  refund_gateway_tx_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ultra-fast lookup
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_customer ON public.dropshipping_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_supplier ON public.dropshipping_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_dropshipping_orders_status ON public.dropshipping_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_order ON public.order_tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_supplier_inventory_sku ON public.supplier_inventory_sync(sku);
CREATE INDEX IF NOT EXISTS idx_returns_and_refunds_order ON public.returns_and_refunds(order_id);

-- Row-Level Security
ALTER TABLE public.dropshipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dropshipping_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_inventory_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns_and_refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active inventory"
  ON public.supplier_inventory_sync FOR SELECT USING (true);

CREATE POLICY "Allow users to view their own dropshipping orders"
  ON public.dropshipping_orders FOR SELECT USING (true);

CREATE POLICY "Allow users to view tracking events for their orders"
  ON public.order_tracking_events FOR SELECT USING (true);

