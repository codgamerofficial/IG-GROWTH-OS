-- =============================================================================
-- RIIQX — Master Social Media OAuth & Autonomous Publishing Schema
-- YouTube Data API v3 • Meta Graph API v20.0 (Instagram & Facebook) • WhatsApp Cloud
-- AES-256 Encrypted Token Storage • Row Level Security • Strict Audit Logging
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. CONNECTED SOCIAL ACCOUNTS
-- Stores public metadata, channel/profile identity, permissions, and health status.
-- SENSITIVE TOKENS ARE NEVER STORED HERE.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('youtube', 'instagram', 'facebook', 'whatsapp', 'threads', 'tiktok', 'twitter', 'linkedin')),
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_handle TEXT,
  avatar_url TEXT,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'error', 'revoked', 'permission_required')),
  platform_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  token_expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_provider_account UNIQUE (user_id, provider, platform_account_id)
);

CREATE INDEX IF NOT EXISTS idx_connected_accounts_user_provider ON public.connected_accounts(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_status ON public.connected_accounts(status);

-- -----------------------------------------------------------------------------
-- 2. OAUTH CREDENTIALS VAULT
-- Strictly isolated table storing AES-256-GCM encrypted access and refresh tokens.
-- Protected by RLS: Never queried directly by frontend client code.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oauth_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_account_id UUID NOT NULL REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  encryption_version TEXT NOT NULL DEFAULT 'v1-aes-256-gcm',
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_oauth_credentials_account UNIQUE (connected_account_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_credentials_user ON public.oauth_credentials(user_id);

-- -----------------------------------------------------------------------------
-- 3. SOCIAL PUBLISHING JOBS
-- Real-time and scheduled publishing queue with idempotency guards and retry tracking.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_publishing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id TEXT,
  connected_account_id UUID REFERENCES public.connected_accounts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'facebook', 'whatsapp', 'threads', 'tiktok', 'twitter', 'linkedin')),
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  media_url TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'uploading', 'processing', 'published', 'failed', 'cancelled')),
  scheduled_for TIMESTAMPTZ,
  platform_media_id TEXT,
  platform_permalink TEXT,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  processing_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publishing_jobs_user_status ON public.social_publishing_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_scheduled ON public.social_publishing_jobs(scheduled_for, status);
CREATE INDEX IF NOT EXISTS idx_publishing_jobs_idempotency ON public.social_publishing_jobs(idempotency_key);

-- -----------------------------------------------------------------------------
-- 4. SOCIAL AUDIT & TELEMETRY LOGS
-- Immutable log of all OAuth authorisations, token refreshes, and publishing operations.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'oauth_initiated',
    'oauth_callback_success',
    'oauth_callback_error',
    'account_connected',
    'account_disconnected',
    'token_refreshed',
    'publish_queued',
    'publish_started',
    'publish_success',
    'publish_failed',
    'emergency_stop_triggered',
    'emergency_stop_resumed'
  )),
  provider TEXT NOT NULL,
  account_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_audit_logs_user_action ON public.social_audit_logs(user_id, action, created_at DESC);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict isolation ensuring zero cross-tenant access to credentials or publishing queues.
-- -----------------------------------------------------------------------------

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_publishing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_audit_logs ENABLE ROW LEVEL SECURITY;

-- Connected Accounts: Users can only view and manage their own connected accounts
DROP POLICY IF EXISTS "Users can view own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can view own connected accounts"
  ON public.connected_accounts FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can insert own connected accounts"
  ON public.connected_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can update own connected accounts"
  ON public.connected_accounts FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can delete own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can delete own connected accounts"
  ON public.connected_accounts FOR DELETE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- OAuth Credentials: Read/write permitted ONLY for service_role or authenticated user matching user_id
DROP POLICY IF EXISTS "Service role and user can manage oauth credentials" ON public.oauth_credentials;
CREATE POLICY "Service role and user can manage oauth credentials"
  ON public.oauth_credentials FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Publishing Jobs: Users can only see and manage their own jobs
DROP POLICY IF EXISTS "Users can view own publishing jobs" ON public.social_publishing_jobs;
CREATE POLICY "Users can view own publishing jobs"
  ON public.social_publishing_jobs FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert own publishing jobs" ON public.social_publishing_jobs;
CREATE POLICY "Users can insert own publishing jobs"
  ON public.social_publishing_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update own publishing jobs" ON public.social_publishing_jobs;
CREATE POLICY "Users can update own publishing jobs"
  ON public.social_publishing_jobs FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Audit Logs: Users can view their own audit trail; insert allowed for service_role or user
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.social_audit_logs;
CREATE POLICY "Users can view own audit logs"
  ON public.social_audit_logs FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users and service can append audit logs" ON public.social_audit_logs;
CREATE POLICY "Users and service can append audit logs"
  ON public.social_audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- Automatic updated_at timestamp triggers
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_connected_accounts_updated_at ON public.connected_accounts;
CREATE TRIGGER set_connected_accounts_updated_at
  BEFORE UPDATE ON public.connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at_column();

DROP TRIGGER IF EXISTS set_oauth_credentials_updated_at ON public.oauth_credentials;
CREATE TRIGGER set_oauth_credentials_updated_at
  BEFORE UPDATE ON public.oauth_credentials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at_column();

DROP TRIGGER IF EXISTS set_social_publishing_jobs_updated_at ON public.social_publishing_jobs;
CREATE TRIGGER set_social_publishing_jobs_updated_at
  BEFORE UPDATE ON public.social_publishing_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at_column();
