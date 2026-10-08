import { NextRequest, NextResponse } from 'next/server';
import { pujaCopilotAgent } from '@/lib/ai';
import { CopilotMessage } from '@/lib/ai/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: CopilotMessage[] = body.messages || [
      {
        id: 'msg-1',
        role: 'user',
        content: body.message || 'Help me plan my Kolkata Durga Puja trip',
        timestamp: new Date().toISOString(),
      },
    ];

    const result = await pujaCopilotAgent.chat(messages);

    return NextResponse.json({
      success: true,
      reply: result.reply,
      proposedItinerary: result.proposedItinerary,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
