import { NextResponse } from 'next/server';
import { bedrockConnection } from '@/lib/ai/bedrock-connection';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetModel = body.modelId || undefined;

    const result = await bedrockConnection.testConnection(targetModel);
    const config = bedrockConnection.getConfigurationStatus();

    return NextResponse.json({
      success: result.inferenceSuccessful,
      result,
      config,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await bedrockConnection.testConnection();
  const config = bedrockConnection.getConfigurationStatus();

  return NextResponse.json({
    success: result.inferenceSuccessful,
    result,
    config,
  });
}
