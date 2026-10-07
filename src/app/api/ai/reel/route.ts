import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ai = getAIProvider();

    const reel = await ai.generateReel({
      topic: body.topic || 'The Anatomy of Heavyweight Streetwear',
      product: body.product,
      audience: body.audience,
      goal: body.goal,
      tone: body.tone,
      durationSeconds: body.durationSeconds || 30,
      brandName: body.brandName || 'RIIQX',
    });

    return NextResponse.json({ success: true, reel });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
