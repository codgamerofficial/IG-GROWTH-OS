import { NextRequest, NextResponse } from 'next/server';
import { pujaCopilotAgent } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await pujaCopilotAgent.chat(body.messages || []);
    return NextResponse.json({
      success: true,
      message: result.reply,
      proposedItinerary: result.proposedItinerary,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
