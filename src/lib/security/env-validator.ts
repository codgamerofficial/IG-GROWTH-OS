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
    authMethod: 'BEARER_TOKEN' | 'IAM_KEYS' | 'AWS_PROFILE' | 'NONE';
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

  // 3. AMAZON BEDROCK VALIDATION (Section 8 & 64)
  const region = process.env.AWS_REGION || 'ap-southeast-2';
  const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.BEDROCK_API_KEY;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const awsProfile = process.env.AWS_PROFILE;
  const modelId = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';

  let authMethod: 'BEARER_TOKEN' | 'IAM_KEYS' | 'AWS_PROFILE' | 'NONE' = 'NONE';
  if (accessKeyId && secretAccessKey) {
    authMethod = 'IAM_KEYS';
  } else if (bearerToken) {
    authMethod = 'BEARER_TOKEN';
  } else if (awsProfile) {
    authMethod = 'AWS_PROFILE';
  }

  const isBedrockConfigured = authMethod !== 'NONE';
  if (!isBedrockConfigured) {
    warnings.push('AWS Bedrock authentication credentials (AWS_BEARER_TOKEN_BEDROCK or AWS_ACCESS_KEY_ID) not configured.');
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
      configured: isBedrockConfigured,
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
