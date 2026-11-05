import { NextRequest, NextResponse } from 'next/server';
import {
  getInventoryStatus,
  syncSupplierInventoryDelta,
} from '@/services/shopping/dropshipping-operations';

export async function GET() {
  try {
    const inventory = getInventoryStatus();
    const lowStockCount = inventory.filter((i) => i.syncStatus === 'low_stock').length;
    const outOfStockCount = inventory.filter((i) => i.syncStatus === 'out_of_stock').length;

    return NextResponse.json({
      success: true,
      count: inventory.length,
      health: {
        totalSkus: inventory.length,
        inSync: inventory.length - (lowStockCount + outOfStockCount),
        lowStock: lowStockCount,
        outOfStock: outOfStockCount,
      },
      inventory,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/inventory GET:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('supplierId') || undefined;

    const result = syncSupplierInventoryDelta(supplierId);

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${result.syncedCount} SKU records with verified supplier catalog.`,
      syncedCount: result.syncedCount,
      updatedItems: result.updatedItems,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/dropshipping/inventory POST:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
