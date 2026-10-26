import { NextRequest, NextResponse } from 'next/server';
import { analyzeMediaAssets, generateTrendAssistIdeas } from '@/lib/riiqx/creator-engine';
import { UploadedAsset } from '@/lib/riiqx/creator-types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload.' }, { status: 400 });
    }

    const assets: UploadedAsset[] = body.assets || [];
    const topic: string = body.topic || '';
    const niche: string = body.niche || 'Technology';

    // 1. Run contextual media analysis
    const analysis = analyzeMediaAssets(assets, topic);

    // 2. Fetch Trend Assist recommendations
    const trends = generateTrendAssistIdeas(niche);

    return NextResponse.json({
      success: true,
      analysis,
      trends,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Media analysis error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
