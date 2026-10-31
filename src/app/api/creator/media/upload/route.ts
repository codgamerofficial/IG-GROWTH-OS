import { NextRequest, NextResponse } from 'next/server';
import { validateMediaFile } from '@/lib/creator/media-ingestion';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    const body = await req.json();
    const { name, size, type } = body;

    if (!name || size === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required media metadata (name, size, type).' },
        { status: 400 }
      );
    }

    const validation = validateMediaFile({ name, size, type });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error, valid: false },
        { status: 422 }
      );
    }

    const assetId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      assetId,
      mediaType: validation.mediaType,
      message: 'Media passed format and bounds validation.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Media upload validation failed';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

