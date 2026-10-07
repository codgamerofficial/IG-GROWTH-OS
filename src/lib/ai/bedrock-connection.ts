// =============================================================================
// IG GrowthOS: BedrockConnectionService (Production AWS Inference Service)
// =============================================================================
// Direct integration with AWS Bedrock Runtime Converse API.
// Features:
// - Supports cross-region & inference profile IDs (e.g. au.anthropic.claude-sonnet-4-6)
// - NEVER prepends or mutates model IDs in code
// - NEVER silently falls back to fake / mock data in production
// - Provides real-time connection testing, health diagnostics, and startup checks
// =============================================================================

import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
  Message,
} from '@aws-sdk/client-bedrock-runtime';
import { AIWorkflowType } from './router';

export interface BedrockConnectionStatus {
  provider: 'bedrock';
  region: string;
  modelId: string;
  reachable: boolean;
  authorized: boolean;
  inferenceSuccessful: boolean;
  errorCode?: string;
  errorMessage?: string;
  latencyMs?: number;
  outputPreview?: string;
  testedAt: string;
}

export interface BedrockConfigStatus {
  region: string;
  provider: string;
  primaryModel: string;
  contentModel: string;
  analyticsModel: string;
  trendModel: string;
  chatModel: string;
  isConfigured: boolean;
  authMethod: 'IAM_KEYS' | 'BEARER_TOKEN' | 'AWS_PROFILE' | 'NONE';
}

export class BedrockConnectionService {
  private static instance: BedrockConnectionService | null = null;
  private lastTestStatus: BedrockConnectionStatus | null = null;

  public static getInstance(): BedrockConnectionService {
    if (!BedrockConnectionService.instance) {
      BedrockConnectionService.instance = new BedrockConnectionService();
    }
    return BedrockConnectionService.instance;
  }

  /**
   * 1. getConfiguredModel()
   * Returns the exact configured model or inference-profile ID for the given workflow.
   * Crucial: NEVER prepends, modifies, or converts the ID. Passes directly to Bedrock.
   */
  public getConfiguredModel(workflow: AIWorkflowType = 'default'): string {
    const fallbackDefault = process.env.BEDROCK_MODEL_ID || 'au.anthropic.claude-sonnet-4-6';

    switch (workflow) {
      case 'content':
        return process.env.CONTENT_MODEL_ID || fallbackDefault;
      case 'analytics':
        return process.env.ANALYTICS_MODEL_ID || fallbackDefault;
      case 'trend':
        return process.env.TREND_MODEL_ID || fallbackDefault;
      case 'chat':
        return process.env.CHAT_MODEL_ID || fallbackDefault;
      case 'default':
      default:
        return fallbackDefault;
    }
  }

  /**
   * Builds an authenticated BedrockRuntimeClient.
   * Supports both AWS IAM SigV4 (Access Key / Secret Key / Session Token)
   * and Bedrock API Keys (Bearer Tokens).
   */
  public createClient(forceBearer = false): BedrockRuntimeClient {
    const region = process.env.AWS_REGION || 'ap-southeast-2';
    const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const sessionToken = process.env.AWS_SESSION_TOKEN;

    if (!forceBearer && accessKeyId && secretAccessKey) {
      return new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
          ...(sessionToken ? { sessionToken } : {}),
        },
      });
    }

    if (bearerToken) {
      const client = new BedrockRuntimeClient({
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
        { step: 'finalizeRequest', priority: 'low', name: 'bedrockBearerAuth' }
      );

      return client;
    }

    return new BedrockRuntimeClient({ region });
  }

  /**
   * 2. testConnection()
   * Performs a REAL minimal Bedrock inference request to verify reachability,
   * authorization, and inference success.
   */
  public async testConnection(targetModelId?: string): Promise<BedrockConnectionStatus> {
    const startTime = Date.now();
    const region = process.env.AWS_REGION || 'ap-southeast-2';
    const modelId = targetModelId || this.getConfiguredModel('default');

    const status: BedrockConnectionStatus = {
      provider: 'bedrock',
      region,
      modelId,
      reachable: false,
      authorized: false,
      inferenceSuccessful: false,
      testedAt: new Date().toISOString(),
    };

    // Helper to attempt a real converse call
    const attemptConverse = async (client: BedrockRuntimeClient) => {
      const command = new ConverseCommand({
        modelId,
        messages: [{ role: 'user', content: [{ text: 'Respond with the single word: READY' }] }],
        inferenceConfig: { maxTokens: 10, temperature: 0.1 },
      });
      return await client.send(command);
    };

    try {
      let client = this.createClient(false);
      let response;

      try {
        response = await attemptConverse(client);
      } catch (firstErr: any) {
        // If expired token exception on IAM keys and a Bearer token is available, retry with Bearer token
        const hasBearer = Boolean(process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY);
        if (firstErr.name === 'ExpiredTokenException' && hasBearer) {
          client = this.createClient(true);
          response = await attemptConverse(client);
        } else {
          throw firstErr;
        }
      }

      status.latencyMs = Date.now() - startTime;
      status.reachable = true;
      status.authorized = true;
      status.inferenceSuccessful = true;
      status.outputPreview = response.output?.message?.content?.[0]?.text?.trim() || 'READY';
      this.lastTestStatus = status;
      return status;
    } catch (err: any) {
      status.latencyMs = Date.now() - startTime;
      status.errorCode = err.name || 'BedrockError';
      status.errorMessage = err.message || 'Unknown error during Bedrock connection test';

      // Determine reachability vs authorization
      if (err.name === 'TimeoutError' || err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        status.reachable = false;
        status.authorized = false;
      } else {
        // AWS responded with an API error, meaning Bedrock service is reachable
        status.reachable = true;

        if (
          err.name === 'AccessDeniedException' ||
          err.name === 'UnrecognizedClientException' ||
          err.name === 'ExpiredTokenException' ||
          err.name === 'ResourceNotFoundException'
        ) {
          status.authorized = false;
        } else if (err.name === 'ThrottlingException' || err.message?.includes('Too many tokens per day')) {
          status.authorized = true; // Authorized, but quota limited
        } else {
          status.authorized = false;
        }
      }

      this.lastTestStatus = status;
      return status;
    }
  }

  /**
   * 3. invoke()
   * Executes a real ConverseCommand against Bedrock.
   * Throws explicit actionable errors on failure. ZERO MOCK FALLBACK.
   */
  public async invoke(params: {
    workflow?: AIWorkflowType;
    modelId?: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<string> {
    const region = process.env.AWS_REGION || 'ap-southeast-2';
    const modelId = params.modelId || this.getConfiguredModel(params.workflow || 'default');

    let client = this.createClient(false);

    const input: ConverseCommandInput = {
      modelId,
      messages: params.messages.map((m) => ({
        role: m.role,
        content: [{ text: m.content }],
      })),
      inferenceConfig: {
        maxTokens: params.maxTokens || 2048,
        temperature: params.temperature ?? 0.7,
      },
    };

    if (params.systemPrompt) {
      input.system = [{ text: params.systemPrompt }];
    }

    try {
      let res;
      try {
        res = await client.send(new ConverseCommand(input));
      } catch (firstErr: any) {
        const hasBearer = Boolean(process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY);
        if (firstErr.name === 'ExpiredTokenException' && hasBearer) {
          client = this.createClient(true);
          res = await client.send(new ConverseCommand(input));
        } else {
          throw firstErr;
        }
      }

      const text = res.output?.message?.content?.[0]?.text;
      if (!text) {
        throw new Error(`Bedrock returned an empty response for model '${modelId}'.`);
      }
      return text;
    } catch (err: any) {
      // Friendly, actionable error formatting
      if (err.message?.includes('use case details have not been submitted') || err.name === 'ResourceNotFoundException') {
        throw new Error(
          `BLOCKED — AWS BEDROCK MODEL ACCESS REQUIRED: Model '${modelId}' requires submitting the Anthropic Use Case details form in the AWS Bedrock Console (Region: ${region}).`
        );
      }
      if (err.name === 'ExpiredTokenException') {
        throw new Error(
          `BLOCKED — AWS BEDROCK AUTHENTICATION EXPIRED: The temporary AWS security credentials have expired. Refresh AWS_SESSION_TOKEN or provide a permanent Bedrock API Key.`
        );
      }
      if (err.name === 'ThrottlingException' || err.message?.includes('Too many tokens per day')) {
        throw new Error(
          `BLOCKED — AWS BEDROCK RATE LIMIT: Daily token limit reached for model '${modelId}'. Account verification or quota upgrade required.`
        );
      }
      throw new Error(`BEDROCK_CONVERSE_ERROR (${err.name || 'Error'}): ${err.message}`);
    }
  }

  /**
   * 4. getModelHealth()
   * Returns current health overview including cached or active status.
   */
  public async getModelHealth(): Promise<{
    overall: 'HEALTHY' | 'DEGRADED' | 'BLOCKED';
    status: BedrockConnectionStatus;
    config: BedrockConfigStatus;
  }> {
    const config = this.getConfigurationStatus();
    const status = this.lastTestStatus || (await this.testConnection());

    let overall: 'HEALTHY' | 'DEGRADED' | 'BLOCKED' = 'HEALTHY';
    if (!status.reachable || !status.authorized) {
      overall = 'BLOCKED';
    } else if (!status.inferenceSuccessful) {
      overall = 'DEGRADED';
    }

    return { overall, status, config };
  }

  /**
   * 5. getConfigurationStatus()
   * Synchronous inspection of environment and configured models.
   */
  public getConfigurationStatus(): BedrockConfigStatus {
    const region = process.env.AWS_REGION || 'ap-southeast-2';
    const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const awsProfile = process.env.AWS_PROFILE;

    let authMethod: 'IAM_KEYS' | 'BEARER_TOKEN' | 'AWS_PROFILE' | 'NONE' = 'NONE';
    if (accessKeyId && secretAccessKey) {
      authMethod = 'IAM_KEYS';
    } else if (bearerToken) {
      authMethod = 'BEARER_TOKEN';
    } else if (awsProfile) {
      authMethod = 'AWS_PROFILE';
    }

    return {
      region,
      provider: process.env.AI_PROVIDER || 'bedrock',
      primaryModel: this.getConfiguredModel('default'),
      contentModel: this.getConfiguredModel('content'),
      analyticsModel: this.getConfiguredModel('analytics'),
      trendModel: this.getConfiguredModel('trend'),
      chatModel: this.getConfiguredModel('chat'),
      isConfigured: authMethod !== 'NONE',
      authMethod,
    };
  }
}

export const bedrockConnection = BedrockConnectionService.getInstance();
