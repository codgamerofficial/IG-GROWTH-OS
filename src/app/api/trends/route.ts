import { NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';
import { aiProvider } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const trends = await repository.getTrends();
    return NextResponse.json({ success: true, trends });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // If requested to research new trends using AI
    if (body.action === 'research') {
      const discovered = await aiProvider.researchTrends({
        category: body.category || 'streetwear',
        brandName: body.brandName || 'RIIQX',
      });

      const added = [];
      for (const t of discovered) {
        const record = await repository.addTrend({
          topic: t.topic,
          source: t.source,
          source_url: t.source_url,
          trend_score: t.trend_score,
          relevance_score: t.relevance_score,
          content_angle: t.recommended_content_angle || null,
          discovered_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
        });
        added.push(record);
      }

      return NextResponse.json({ success: true, count: added.length, trends: added });
    }

    const newTrend = await repository.addTrend(body);
    return NextResponse.json({ success: true, trend: newTrend });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
