// =============================================================================
// GlowFit AI / RIIQX — High-Margin Dropshipping Products Catalog API
// Route: GET /api/shopping/dropshipping/products
// =============================================================================

import { NextResponse } from 'next/server';
import { DROPSHIPPING_CATALOG } from '@/services/shopping/catalog';

export async function GET() {
  return NextResponse.json({
    success: true,
    totalProducts: DROPSHIPPING_CATALOG.length,
    products: DROPSHIPPING_CATALOG,
    currency: 'INR',
    averageMarginPct: 72.2,
  });
}
