import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { ModelRouter } from '@/lib/ai/router';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const region = ModelRouter.getRegion();
  const modelId = ModelRouter.getModelId('default');
  const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (!ModelRouter.isBedrockConfigured()) {
    return NextResponse.json(
      {
        service: 'bedrock',
        status: 'blocked',
        healthy: false,
        checkedAt: new Date().toISOString(),
        latencyMs: 0,
        region,
        modelId,
        message: 'BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED: Credentials are missing.',
      },
      { status: 503 }
    );
  }

  let client: BedrockRuntimeClient;
  if (accessKeyId && secretAccessKey) {
    client = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
        ...(sessionToken ? { sessionToken } : {}),
      },
    });
  } else if (bearerToken) {
    client = new BedrockRuntimeClient({
      region,
      credentials: { accessKeyId: 'anonymous', secretAccessKey: 'anonymous' },
    });
    (client.middlewareStack as any).add(
      (next: any) => async (args: any) => {
        const request = args.request;
        if (request && request.headers) {
          request.headers['authorization'] = `Bearer ${bearerToken}`;
          delete request.headers['x-amz-date'];
          delete request.headers['x-amz-security-token'];
          delete request.headers['x-amz-content-sha256'];
        }
        return next(args);
      },
      { step: 'finalizeRequest', priority: 'low', name: 'healthCheckAuth' }
    );
  } else {
    client = new BedrockRuntimeClient({ region });
  }

  try {
    const res = await client.send(
      new ConverseCommand({
        modelId,
        messages: [{ role: 'user', content: [{ text: 'Respond with exactly: OK' }] }],
        inferenceConfig: { maxTokens: 10, temperature: 0.1 },
      })
    );

    const latencyMs = Date.now() - startTime;
    const outputText = res.output?.message?.content?.[0]?.text || '';

    return NextResponse.json({
      service: 'bedrock',
      status: 'healthy',
      healthy: true,
      checkedAt: new Date().toISOString(),
      latencyMs,
      region,
      modelId,
      response: outputText,
      usage: res.usage || null,
      message: 'Amazon Bedrock is online and actively returning model inferences.',
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;

    // Distinguish between authorization/verification/access errors vs connection failure
    const isAccessPending =
      err.message?.includes('use case details have not been submitted') ||
      err.message?.includes('being verified') ||
      err.name === 'ResourceNotFoundException';

    const isThrottled =
      err.message?.includes('Too many tokens per day') ||
      err.name === 'ThrottlingException';

    return NextResponse.json(
      {
        service: 'bedrock',
        status: isAccessPending ? 'blocked_model_access' : isThrottled ? 'rate_limited' : 'error',
        healthy: false,
        checkedAt: new Date().toISOString(),
        latencyMs,
        region,
        modelId,
        errorName: err.name || 'UnknownError',
        errorMessage: err.message,
        diagnostic: isAccessPending
          ? 'BLOCKED — Anthropic Claude model use case details form must be submitted in AWS Bedrock Console (Region: ap-southeast-2).'
          : isThrottled
          ? 'BLOCKED — AWS daily token quota limit reached on this free tier account. Wait for account verification or upgrade.'
          : 'Failed to communicate with Amazon Bedrock.',
      },
      { status: 200 }
    );
  }
}
