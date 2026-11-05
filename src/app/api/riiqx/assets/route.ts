// =============================================================================
// RIIQX — Creative Assets API Route
// GET, POST, DELETE /api/riiqx/assets
// =============================================================================

import { NextResponse } from 'next/server';
import { AssetService, CreativeAssetCategory } from '@/services/assets/asset-service';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId') || undefined;
  const category = (url.searchParams.get('category') as CreativeAssetCategory) || undefined;
  const tag = url.searchParams.get('tag') || undefined;
  const search = url.searchParams.get('search') || undefined;

  const assets = AssetService.listAssets({ userId, category, tag, search });
  return NextResponse.json({
    success: true,
    total: assets.length,
    count: assets.length,
    assets,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'default_user', category, name, mimeType, fileSizeBytes, publicUrl, tags = [], dimensions, metadata } = body;

    if (!category || !name || !mimeType || !publicUrl) {
      return NextResponse.json(
        { success: false, error: 'category, name, mimeType, and publicUrl are required.' },
        { status: 400 }
      );
    }

    const created = AssetService.registerAsset({
      userId,
      category,
      name,
      mimeType,
      fileSizeBytes: fileSizeBytes || 0,
      publicUrl,
      tags,
      dimensions,
      metadata,
    });

    return NextResponse.json({
      success: true,
      asset: created,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const assetId = url.searchParams.get('assetId');

    if (!assetId) {
      return NextResponse.json({ success: false, error: 'assetId is required.' }, { status: 400 });
    }

    const deleted = AssetService.deleteAsset(assetId);
    return NextResponse.json({
      success: true,
      deleted,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

