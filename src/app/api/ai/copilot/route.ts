import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ai = getAIProvider();

    const reply = await ai.chatCopilot(body.messages || [], body.context);
    return NextResponse.json({ success: true, message: reply });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
