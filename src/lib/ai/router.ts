// =============================================================================
// IG GrowthOS: Amazon Bedrock Dynamic Model Router (Section 49)
// =============================================================================
// Allows dedicated model routing per workflow without hard-coding model IDs:
// - Content Generation -> CONTENT_MODEL_ID
// - Analytics Analysis -> ANALYTICS_MODEL_ID
// - Trend Research     -> TREND_MODEL_ID
// - Growth Copilot Chat -> CHAT_MODEL_ID
// Fallback: BEDROCK_MODEL_ID -> Default Production Model
// =============================================================================

export type AIWorkflowType = 'content' | 'analytics' | 'trend' | 'chat' | 'default';

export class ModelRouter {
  /**
   * Resolves the appropriate Amazon Bedrock model ID for a specific task.
   * Priority: Task-specific env var -> BEDROCK_MODEL_ID -> Default Amazon Bedrock Model ID
   */
  public static getModelId(workflow: AIWorkflowType = 'default'): string {
    const fallbackDefault = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';

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

  public static getContentModel(): string {
    return this.getModelId('content');
  }

  public static getAnalyticsModel(): string {
    return this.getModelId('analytics');
  }

  public static getTrendModel(): string {
    return this.getModelId('trend');
  }

  public static getChatModel(): string {
    return this.getModelId('chat');
  }

  public static getRegion(): string {
    return process.env.AWS_REGION || 'us-east-1';
  }

  public static isBedrockConfigured(): boolean {
    const hasRegion = Boolean(process.env.AWS_REGION);
    const hasKeys = Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
    // On AWS (ECS/Lambda/EC2), IAM instance profile or task roles provide credentials without env vars
    const isAwsEnvironment = Boolean(process.env.AWS_EXECUTION_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME);
    return hasRegion && (hasKeys || isAwsEnvironment);
  }
}
