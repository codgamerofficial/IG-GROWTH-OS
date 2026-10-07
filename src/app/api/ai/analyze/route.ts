import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';
import { repository } from '@/lib/supabase/repository';

export async function POST(request: Request) {
  try {
    const ai = getAIProvider();
    const brand = await repository.getBrand('riiqx-fashion');
    const analytics = await repository.getAnalytics(brand.id, 14);
    const content = await repository.getContentItems(brand.id);

    const topPosts = content
      .filter((c) => c.status === 'PUBLISHED')
      .map((c) => ({
        title: c.title,
        reach: 40100,
        saves: 1460,
        shares: 930,
        type: c.content_type,
      }));

    const diagnostic = await ai.analyzePerformance({
      brandName: brand.name,
      recentMetrics: { recordsCount: analytics.length },
      topPosts,
    });

    return NextResponse.json({ success: true, diagnostic });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
