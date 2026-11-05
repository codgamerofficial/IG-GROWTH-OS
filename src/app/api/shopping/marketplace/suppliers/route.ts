// =============================================================================
// RIIQX — Supplier Onboarding & Registry API Route
// GET & POST /api/shopping/marketplace/suppliers
// =============================================================================

import { NextResponse } from 'next/server';
import { CommerceService, SupplierRegistrationInput } from '@/services/shopping/commerce-service';

export async function GET() {
  try {
    const suppliers = CommerceService.listRegisteredSuppliers();
    return NextResponse.json({
      success: true,
      count: suppliers.length,
      suppliers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SupplierRegistrationInput;
    const result = CommerceService.registerSupplier(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message, errors: result.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      supplierId: result.supplierId,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to register supplier' },
      { status: 500 }
    );
  }
}
