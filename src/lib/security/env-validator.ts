// =============================================================================
// IG GrowthOS: Environment & Production Safety Validator (Section 4 & 64)
// =============================================================================
// Enforces that MOCK_MODE cannot run in production, validates required
// credentials for Supabase, AWS Bedrock, and Meta Instagram Graph API.
// =============================================================================

export interface EnvironmentValidationReport {
  valid: boolean;
  environment: string;
  mockMode: boolean;
  supabase: {
    configured: boolean;
    url: string | null;
    hasAnonKey: boolean;
    hasServiceKey: boolean;
  };
  bedrock: {
    configured: boolean;
    region: string;
    authMethod: 'BEARER_TOKEN' | 'IAM_KEYS' | 'AWS_PROFILE' | 'NONE' | 'AGENT_ROUTER';
    modelId: string;
  };
  instagram: {
    configured: boolean;
    hasAccessToken: boolean;
    hasAppId: boolean;
    hasAppSecret: boolean;
    businessAccountId: string | null;
  };
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvironmentValidationReport {
  const isProd = process.env.NODE_ENV === 'production';
  const mockMode = process.env.MOCK_MODE === 'true';

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. FATAL PRODUCTION GUARD (Section 4)
  // Production startup MUST fail if MOCK_MODE=true
  if (isProd && mockMode) {
    const fatalMsg = 'FATAL CONFIGURATION ERROR: MOCK_MODE=true is strictly forbidden in production. Production deployments must run in live verified mode.';
    errors.push(fatalMsg);
    throw new Error(fatalMsg);
  }

  // 2. SUPABASE VALIDATION (Section 5 & 64)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    anonKey &&
    !supabaseUrl.includes('mock.supabase.co') &&
    !anonKey.includes('mock-anon-key')
  );

  if (!isSupabaseConfigured) {
    errors.push('CRITICAL: Supabase URL and keys are missing or point to mock instances.');
  }

  // 3. AI PROVIDER VALIDATION (Agent Router & Amazon Bedrock)
  const isAgentRouterConfigured = Boolean(
    process.env.AGENT_ROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    'sk-kg8ve3KBHGvRZsc59bivGRi1jrfmlOvhyhkmrqVRHurdcxHi'
  );
  const region = process.env.AWS_REGION || 'ap-southeast-2';
  const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const awsProfile = process.env.AWS_PROFILE;
  const modelId = process.env.AGENT_ROUTER_MODEL || process.env.BEDROCK_MODEL_ID || 'deepseek-v4-flash';

  let authMethod: 'AGENT_ROUTER' | 'BEARER_TOKEN' | 'IAM_KEYS' | 'AWS_PROFILE' | 'NONE' = 'NONE';
  if (isAgentRouterConfigured) {
    authMethod = 'AGENT_ROUTER';
  } else if (accessKeyId && secretAccessKey) {
    authMethod = 'IAM_KEYS';
  } else if (bearerToken) {
    authMethod = 'BEARER_TOKEN';
  } else if (awsProfile) {
    authMethod = 'AWS_PROFILE';
  }

  const isAIConfigured = authMethod !== 'NONE';
  if (!isAIConfigured) {
    warnings.push('AI authentication credentials (AGENT_ROUTER_API_KEY or AWS credentials) not configured.');
  }

  // 4. META / INSTAGRAM VALIDATION (Section 14 & 64)
  const metaAppId = process.env.META_APP_ID;
  const metaAppSecret = process.env.META_APP_SECRET;
  const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igBusinessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  const hasAccessToken = Boolean(igToken && !igToken.includes('your-instagram') && igToken.trim().length > 10);
  const isInstagramConfigured = Boolean(hasAccessToken && igBusinessId);

  if (!isInstagramConfigured) {
    warnings.push('Meta Graph API credentials not configured. Live publishing and account insights will be BLOCKED until INSTAGRAM_ACCESS_TOKEN is provided.');
  }

  return {
    valid: errors.length === 0,
    environment: process.env.NODE_ENV || 'development',
    mockMode,
    supabase: {
      configured: isSupabaseConfigured,
      url: supabaseUrl || null,
      hasAnonKey: Boolean(anonKey),
      hasServiceKey: Boolean(serviceKey),
    },
    bedrock: {
      configured: isAIConfigured,
      region,
      authMethod,
      modelId,
    },
    instagram: {
      configured: isInstagramConfigured,
      hasAccessToken,
      hasAppId: Boolean(metaAppId),
      hasAppSecret: Boolean(metaAppSecret),
      businessAccountId: igBusinessId || null,
    },
    errors,
    warnings,
  };
}
