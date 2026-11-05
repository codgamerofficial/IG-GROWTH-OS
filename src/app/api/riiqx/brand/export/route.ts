// =============================================================================
// RIIQX — Brand Guidelines Export API Route
// GET /api/riiqx/brand/export
// =============================================================================

import { NextResponse } from 'next/server';
import { BrandDNASynthesizer } from '@/services/brand/brand-dna-synthesizer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const brand = BrandDNASynthesizer.getActiveBrandDNA();

  if (!brand) {
    return NextResponse.json(
      { success: false, error: 'No active Brand DNA profile found.' },
      { status: 404 }
    );
  }

  const exportData = BrandDNASynthesizer.generateGuidelinesExport(brand);

  return NextResponse.json({
    success: true,
    export: exportData,
  });
}

