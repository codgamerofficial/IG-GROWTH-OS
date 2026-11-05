import { NextRequest, NextResponse } from 'next/server';
import { AIShoppingAssistant } from '@/services/shopping/ai-shopping-assistant';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing required field: message (string)' },
        { status: 400 }
      );
    }

    const result = await AIShoppingAssistant.processQuery({
      message: body.message,
      conversationHistory: body.conversationHistory,
      screenshotBase64: body.screenshotBase64,
      screenshotMimeType: body.screenshotMimeType,
      preferredLanguage: body.preferredLanguage || 'auto',
    });

    return NextResponse.json({
      success: true,
      response: result,
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/assistant/chat POST:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process assistant query' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      status: 'active',
      cascadeTiers: [
        { tier: 1, provider: 'Google Gemini', model: 'gemini-2.5-flash', role: 'Multimodal Vision OCR & Fast Reasoning' },
        { tier: 2, provider: 'Groq Cloud LPU', model: 'openai/gpt-oss-120b', role: 'Ultra-Low Latency Script & Copy Synthesis' },
        { tier: 3, provider: 'OpenRouter Unified', model: 'meta-llama/llama-3.3-70b-instruct', role: 'Global Fallback & Deep Reasoning' },
        { tier: 4, provider: 'RIIQX Autonomous Engine', model: 'Grounded Rule & Price Synthesizer', role: 'Zero-Downtime Deterministic Fallback' },
      ],
      sampleQueries: [
        'Find the best deal for Sony WH-1000XM5 across all retailers including coupons and gift cards',
        'Compare Noise Colorfit Pro 5 across Amazon, Flipkart and Meesho',
        'Which ambient desk lamp has the highest dropshipping profit margin?',
        'How can I get maximum cashback on Flipkart using gift card arbitrage?',
      ],
    });
  } catch (error: any) {
    console.error('API Error in /api/shopping/assistant/chat GET:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
