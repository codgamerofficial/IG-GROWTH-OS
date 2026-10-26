// =============================================================================
// RIIQX — Non-Firebase Cryptographic Authentication & Session Vault
// PBKDF2 HMAC SHA-256 • 16-Byte Cryptographic Salt • Constant-Time Comparison
// =============================================================================

import crypto from 'crypto';

export interface RiiqxUser {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'developer' | 'admin';
  createdAt: string;
  preferences: {
    theme: 'dark' | 'midnight';
    defaultLanguage: 'en' | 'bn' | 'hi';
    autoSave: boolean;
    streamResponses: boolean;
  };
}

export interface StoredCredentials {
  userId: string;
  email: string;
  saltHex: string;
  hashHex: string;
  iterations: number;
}

const DEFAULT_ITERATIONS = 10000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

export function hashPassword(password: string): { saltHex: string; hashHex: string } {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, DEFAULT_ITERATIONS, KEY_LENGTH, DIGEST);
  return {
    saltHex: salt.toString('hex'),
    hashHex: hash.toString('hex'),
  };
}

export function verifyPassword(
  attempt: string,
  saltHex: string,
  storedHashHex: string,
  iterations = DEFAULT_ITERATIONS
): boolean {
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const storedHash = Buffer.from(storedHashHex, 'hex');
    const attemptHash = crypto.pbkdf2Sync(attempt, salt, iterations, KEY_LENGTH, DIGEST);

    if (storedHash.length !== attemptHash.length) {
      return false;
    }

    return crypto.timingSafeEqual(storedHash, attemptHash);
  } catch {
    return false;
  }
}

export function createSessionToken(userId: string): string {
  const payload = JSON.stringify({
    uid: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(8).toString('hex'),
  });

  const hmac = crypto.createHmac('sha256', process.env.SESSION_SECRET || 'riiqx_vault_fallback_secret_2026');
  hmac.update(payload);
  const signature = hmac.digest('hex');

  return Buffer.from(payload).toString('base64url') + '.' + signature;
}

export function verifySessionToken(token: string): { valid: boolean; userId?: string } {
  try {
    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) return { valid: false };

    const payload = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const hmac = crypto.createHmac('sha256', process.env.SESSION_SECRET || 'riiqx_vault_fallback_secret_2026');
    hmac.update(payload);
    const expectedSig = hmac.digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false };
    }

    const data = JSON.parse(payload);
    if (Date.now() > data.exp) {
      return { valid: false };
    }

    return { valid: true, userId: data.uid };
  } catch {
    return { valid: false };
  }
}

export function getDefaultUser(): RiiqxUser {
  return {
    id: 'usr_riiqx_primary',
    email: 'creator@riiqx.ai',
    name: 'RIIQX Creator',
    role: 'creator',
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      defaultLanguage: 'en',
      autoSave: true,
      streamResponses: true,
    },
  };
}
