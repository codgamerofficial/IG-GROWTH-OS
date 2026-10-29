// =============================================================================
// RIIQX — Master Social Token Encryption Vault
// AES-256-GCM Hardware-Accelerated Encryption • Zero Plaintext Exposure
// Separates sensitive credentials from public account metadata
// =============================================================================

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // Standard 96-bit IV for GCM
const PBKDF2_SALT = 'riiqx_vault_salt_v1_2026';
const PBKDF2_ITERATIONS = 100000;

/**
 * Derives or validates a 32-byte (256-bit) encryption key
 */
function getEncryptionKey(): Buffer {
  const envKey = process.env.TOKEN_ENCRYPTION_KEY;

  if (envKey && envKey.trim()) {
    const trimmed = envKey.trim();
    // 64-char hex string
    if (trimmed.length === 64 && /^[0-9a-fA-F]+$/.test(trimmed)) {
      return Buffer.from(trimmed, 'hex');
    }
    // 32-byte UTF8 string
    if (Buffer.byteLength(trimmed, 'utf8') === 32) {
      return Buffer.from(trimmed, 'utf8');
    }
    // Generic string: derive 32 bytes via PBKDF2
    return crypto.pbkdf2Sync(trimmed, PBKDF2_SALT, PBKDF2_ITERATIONS, 32, 'sha256');
  }

  // Safe fallback derivation from available server secrets (never exposed to browser)
  const fallbackSecret =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.META_APP_SECRET ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    'riiqx_local_development_secure_fallback_key_2026';

  return crypto.pbkdf2Sync(fallbackSecret, PBKDF2_SALT, PBKDF2_ITERATIONS, 32, 'sha256');
}

export interface EncryptedPayload {
  encrypted: string;
  iv: string;
  authTag: string;
  version: string;
}

/**
 * Encrypts a sensitive OAuth token using AES-256-GCM
 */
export function encryptToken(plaintext: string): EncryptedPayload {
  if (!plaintext) {
    throw new Error('Encryption error: plaintext cannot be empty.');
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag,
    version: 'v1-aes-256-gcm',
  };
}

/**
 * Decrypts an OAuth token and verifies GCM authentication tag
 */
export function decryptToken(encryptedHex: string, ivHex: string, authTagHex: string): string {
  if (!encryptedHex || !ivHex || !authTagHex) {
    throw new Error('Decryption error: missing required encrypted payload parameters.');
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Safely masks a token for logging or UI summaries (e.g. "ya29...3xyz")
 */
export function maskToken(token?: string | null): string {
  if (!token) return '••••••••';
  if (token.length <= 8) return '••••••••';
  return `${token.slice(0, 4)}••••••••${token.slice(-4)}`;
}
