import { NextResponse } from 'next/server';
import { bedrockConnection } from '@/lib/ai/bedrock-connection';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = bedrockConnection.getConfigurationStatus();

    if (!config.isConfigured) {
      return NextResponse.json(
        {
          provider: 'bedrock',
          region: config.region,
          modelId: config.primaryModel,
          reachable: false,
          authorized: false,
          inferenceSuccessful: false,
          errorCode: 'MISSING_CREDENTIALS',
          errorMessage: 'BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED: Credentials are missing.',
          status: 'blocked',
          healthy: false,
          config,
        },
        { status: 200 }
      );
    }

    const testResult = await bedrockConnection.testConnection();

    return NextResponse.json(
      {
        ...testResult,
        service: 'bedrock',
        status: testResult.inferenceSuccessful ? 'healthy' : testResult.authorized ? 'rate_limited' : 'blocked_model_access',
        healthy: testResult.inferenceSuccessful,
        config,
        diagnostic: !testResult.inferenceSuccessful
          ? testResult.errorMessage?.includes('use case details have not been submitted')
            ? `BLOCKED — AWS BEDROCK MODEL ACCESS REQUIRED: Model '${testResult.modelId}' requires submitting the Anthropic Use Case details form in the AWS Bedrock Console (Region: ${testResult.region}).`
            : testResult.errorMessage?.includes('ExpiredTokenException')
            ? 'BLOCKED — AWS security token has expired. Please refresh credentials.'
            : testResult.errorMessage?.includes('Too many tokens per day')
            ? 'BLOCKED — AWS Bedrock daily token limit reached. Quota increase or account upgrade required.'
            : testResult.errorMessage
          : 'Amazon Bedrock is online and actively returning model inferences.',
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        provider: 'bedrock',
        region: process.env.AWS_REGION || 'ap-southeast-2',
        modelId: process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6',
        reachable: false,
        authorized: false,
        inferenceSuccessful: false,
        errorCode: err.name || 'InternalError',
        errorMessage: err.message,
        status: 'error',
        healthy: false,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
