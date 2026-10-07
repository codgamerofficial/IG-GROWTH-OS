import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ai = getAIProvider();

    const ideas = await ai.generateIdeas({
      brandName: body.brandName || 'RIIQX',
      category: body.category || 'Fashion / Clothing / Lifestyle',
      pillar: body.pillar,
      audience: body.audience,
      goal: body.goal,
      format: body.format,
      product: body.product,
      tone: body.tone,
      count: body.count || 10,
    });

    return NextResponse.json({ success: true, ideas });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
