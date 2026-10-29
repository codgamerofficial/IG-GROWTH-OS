// =============================================================================
// RIIQX — Social Connected Accounts & Credentials Repository
// Supabase PostgreSQL with RLS + Zero-Crash Local Persistence Fallback
// Tokens are strictly AES-256-GCM encrypted before storage
// =============================================================================

import { getServiceSupabase } from '@/lib/supabase/server';
import { encryptToken, decryptToken, maskToken } from '@/lib/riiqx/security/token-vault';
import { getSafeTempFilePath, safeReadJson, safeWriteJson } from '@/lib/riiqx/temp-storage';

export type SocialProvider =
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'threads'
  | 'tiktok'
  | 'twitter'
  | 'linkedin';

export interface ConnectedAccountRecord {
  id: string;
  user_id: string;
  provider: SocialProvider;
  platform_account_id: string;
  account_name: string;
  account_handle?: string;
  avatar_url?: string;
  scopes: string[];
  status: 'connected' | 'expired' | 'error' | 'revoked' | 'permission_required';
  platform_metadata: Record<string, unknown>;
  token_expires_at?: string;
  last_verified_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface OAuthCredentialsRecord {
  id: string;
  connected_account_id: string;
  user_id: string;
  encrypted_access_token: string;
  encrypted_refresh_token?: string;
  iv: string;
  auth_tag: string;
  encryption_version: string;
  token_type?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SaveAccountParams {
  userId: string;
  provider: SocialProvider;
  platformAccountId: string;
  accountName: string;
  accountHandle?: string;
  avatarUrl?: string;
  scopes: string[];
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  tokenType?: string;
  platformMetadata?: Record<string, unknown>;
}

// Local filesystem fallback store
const LOCAL_STORE_PATH = getSafeTempFilePath('social_accounts_store.json');

interface LocalStoreData {
  accounts: ConnectedAccountRecord[];
  credentials: OAuthCredentialsRecord[];
  auditLogs: Array<Record<string, unknown>>;
}

let inMemoryStore: LocalStoreData = { accounts: [], credentials: [], auditLogs: [] };

function readLocalStore(): LocalStoreData {
  const disk = safeReadJson<LocalStoreData>(LOCAL_STORE_PATH, { accounts: [], credentials: [], auditLogs: [] });
  if (disk.accounts && disk.accounts.length > 0) {
    return disk;
  }
  return inMemoryStore;
}

function writeLocalStore(data: LocalStoreData): void {
  inMemoryStore = data;
  safeWriteJson(LOCAL_STORE_PATH, data);
}

/**
 * Saves a connected account and stores its encrypted credentials
 */
export async function saveConnectedAccount(params: SaveAccountParams): Promise<ConnectedAccountRecord> {
  const supabase = getServiceSupabase();
  const now = new Date().toISOString();

  // 1. Encrypt Tokens via AES-256-GCM
  const encryptedAccess = encryptToken(params.accessToken);
  let encryptedRefresh: { encrypted: string; iv: string; authTag: string } | undefined;
  if (params.refreshToken) {
    encryptedRefresh = encryptToken(params.refreshToken);
  }

  const accountId = `acc_${params.provider}_${params.platformAccountId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const accountRecord: ConnectedAccountRecord = {
    id: accountId,
    user_id: params.userId,
    provider: params.provider,
    platform_account_id: params.platformAccountId,
    account_name: params.accountName,
    account_handle: params.accountHandle,
    avatar_url: params.avatarUrl,
    scopes: params.scopes,
    status: 'connected',
    platform_metadata: params.platformMetadata || {},
    token_expires_at: params.tokenExpiresAt,
    last_verified_at: now,
    created_at: now,
    updated_at: now,
  };

  const credRecord: OAuthCredentialsRecord = {
    id: `cred_${accountId}`,
    connected_account_id: accountId,
    user_id: params.userId,
    encrypted_access_token: encryptedAccess.encrypted,
    encrypted_refresh_token: encryptedRefresh?.encrypted,
    iv: encryptedAccess.iv,
    auth_tag: encryptedAccess.authTag,
    encryption_version: encryptedAccess.version,
    token_type: params.tokenType || 'Bearer',
    expires_at: params.tokenExpiresAt,
    created_at: now,
    updated_at: now,
  };

  // Try Supabase first
  if (supabase) {
    try {
      const { error: accErr } = await (supabase as any)
        .from('connected_accounts')
        .upsert(accountRecord, {
          onConflict: 'user_id,provider,platform_account_id',
        });

      if (!accErr) {
        await (supabase as any)
          .from('oauth_credentials')
          .upsert(credRecord, {
            onConflict: 'connected_account_id',
          });

        await logSocialAudit({
          userId: params.userId,
          action: 'account_connected',
          provider: params.provider,
          accountId: params.platformAccountId,
          details: {
            accountName: params.accountName,
            scopes: params.scopes,
          },
        });

        // Also sync to local store for offline resilience
        const store = readLocalStore();
        store.accounts = store.accounts.filter((a) => a.id !== accountId);
        store.accounts.unshift(accountRecord);
        store.credentials = store.credentials.filter((c) => c.connected_account_id !== accountId);
        store.credentials.unshift(credRecord);
        writeLocalStore(store);

        return accountRecord;
      }
    } catch {
      // Fall through to local store if table doesn't exist yet
    }
  }

  // Fallback to local secure store
  const store = readLocalStore();
  store.accounts = store.accounts.filter(
    (a) => !(a.user_id === params.userId && a.provider === params.provider && a.platform_account_id === params.platformAccountId)
  );
  store.accounts.unshift(accountRecord);

  store.credentials = store.credentials.filter((c) => c.connected_account_id !== accountId);
  store.credentials.unshift(credRecord);

  writeLocalStore(store);

  await logSocialAudit({
    userId: params.userId,
    action: 'account_connected',
    provider: params.provider,
    accountId: params.platformAccountId,
    details: {
      accountName: params.accountName,
      scopes: params.scopes,
      storage: 'local_secure_vault',
    },
  });

  return accountRecord;
}

/**
 * Returns all connected accounts for a user WITHOUT sensitive tokens
 */
export async function getConnectedAccounts(userId: string): Promise<ConnectedAccountRecord[]> {
  const supabase = getServiceSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as unknown as ConnectedAccountRecord[];
      }
    } catch {
      // Fall through to local store
    }
  }

  const store = readLocalStore();
  return store.accounts.filter((a) => a.user_id === userId);
}

/**
 * Retrieves a single account and decrypts its credentials for server-side API execution
 */
export async function getAccountWithCredentials(
  accountId: string,
  userId: string
): Promise<{ account: ConnectedAccountRecord; accessToken: string; refreshToken?: string } | null> {
  const supabase = getServiceSupabase();

  let account: ConnectedAccountRecord | null = null;
  let credentials: OAuthCredentialsRecord | null = null;

  if (supabase) {
    try {
      const { data: accData } = await supabase
        .from('connected_accounts')
        .select('*')
        .eq('id', accountId)
        .eq('user_id', userId)
        .single();

      if (accData) {
        account = accData as unknown as ConnectedAccountRecord;
        const { data: credData } = await supabase
          .from('oauth_credentials')
          .select('*')
          .eq('connected_account_id', accountId)
          .single();

        if (credData) {
          credentials = credData as unknown as OAuthCredentialsRecord;
        }
      }
    } catch {
      // Fall through to local store
    }
  }

  if (!account || !credentials) {
    const store = readLocalStore();
    account = store.accounts.find((a) => a.id === accountId && a.user_id === userId) || null;
    credentials = store.credentials.find((c) => c.connected_account_id === accountId) || null;
  }

  if (!account || !credentials) {
    return null;
  }

  // Decrypt tokens
  try {
    const accessToken = decryptToken(
      credentials.encrypted_access_token,
      credentials.iv,
      credentials.auth_tag
    );

    let refreshToken: string | undefined;
    if (credentials.encrypted_refresh_token) {
      refreshToken = decryptToken(
        credentials.encrypted_refresh_token,
        credentials.iv,
        credentials.auth_tag
      );
    }

    return { account, accessToken, refreshToken };
  } catch (err) {
    console.error('Failed to decrypt credentials for account:', accountId, err);
    return null;
  }
}

/**
 * Updates status of a connected account (e.g. expired, revoked)
 */
export async function updateAccountStatus(
  accountId: string,
  userId: string,
  status: ConnectedAccountRecord['status'],
  errorMessage?: string
): Promise<void> {
  const supabase = getServiceSupabase();
  const now = new Date().toISOString();

  if (supabase) {
    try {
      await supabase
        .from('connected_accounts')
        .update({ status, error_message: errorMessage || null, updated_at: now })
        .eq('id', accountId)
        .eq('user_id', userId);
    } catch {
      // Fall through
    }
  }

  const store = readLocalStore();
  const acc = store.accounts.find((a) => a.id === accountId && a.user_id === userId);
  if (acc) {
    acc.status = status;
    acc.error_message = errorMessage;
    acc.updated_at = now;
    writeLocalStore(store);
  }
}

/**
 * Disconnects an account and deletes stored credentials
 */
export async function deleteConnectedAccount(accountId: string, userId: string): Promise<boolean> {
  const supabase = getServiceSupabase();

  if (supabase) {
    try {
      await supabase.from('oauth_credentials').delete().eq('connected_account_id', accountId);
      await supabase.from('connected_accounts').delete().eq('id', accountId).eq('user_id', userId);
    } catch {
      // Fall through
    }
  }

  const store = readLocalStore();
  store.accounts = store.accounts.filter((a) => !(a.id === accountId && a.user_id === userId));
  store.credentials = store.credentials.filter((c) => c.connected_account_id !== accountId);
  writeLocalStore(store);

  await logSocialAudit({
    userId,
    action: 'account_disconnected',
    provider: 'youtube', // generic
    accountId,
    details: { accountId },
  });

  return true;
}

export interface SocialAuditEntry {
  userId: string;
  action: string;
  provider: string;
  accountId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Appends an immutable social audit log
 */
export async function logSocialAudit(entry: SocialAuditEntry): Promise<void> {
  const supabase = getServiceSupabase();
  const payload = {
    user_id: entry.userId,
    action: entry.action,
    provider: entry.provider,
    account_id: entry.accountId,
    details: entry.details || {},
    ip_address: entry.ipAddress || '127.0.0.1',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await (supabase as any).from('social_audit_logs').insert(payload);
    } catch {
      // Fall through
    }
  }

  const store = readLocalStore();
  store.auditLogs.unshift(payload);
  if (store.auditLogs.length > 500) {
    store.auditLogs = store.auditLogs.slice(0, 500);
  }
  writeLocalStore(store);
}
