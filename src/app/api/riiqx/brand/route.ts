// =============================================================================
// RIIQX — Brand DNA CRUD & Persistence API Route
// GET, POST /api/riiqx/brand
// =============================================================================

import { NextResponse } from 'next/server';
import { BrandDNASynthesizer } from '@/services/brand/brand-dna-synthesizer';
import { BrandDNA } from '@/services/brand/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const brand = BrandDNASynthesizer.getActiveBrandDNA();
  return NextResponse.json({
    success: true,
    brandDNA: brand,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BrandDNA;

    if (!body || !body.brandName) {
      return NextResponse.json(
        { success: false, error: 'Valid Brand DNA object with brandName is required.' },
        { status: 400 }
      );
    }

    const updated: BrandDNA = {
      ...body,
      updatedAt: new Date().toISOString(),
      version: (body.version || 1) + 1,
    };

    BrandDNASynthesizer.persistBrandDNA(updated);

    return NextResponse.json({
      success: true,
      brandDNA: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save Brand DNA.' },
      { status: 500 }
    );
  }
}
