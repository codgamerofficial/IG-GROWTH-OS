// =============================================================================
// RIIQX — Server-Side Cryptographic Authentication & Session Vault
// PBKDF2 HMAC SHA-256 • 16-Byte Cryptographic Salt • Constant-Time Comparison
// =============================================================================

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type { RiiqxUser } from './user';
export { getDefaultUser } from './user';

export interface StoredCredentials {
  userId: string;
  email: string;
  saltHex: string;
  hashHex: string;
  iterations: number;
  createdAt: string;
}

const DEFAULT_ITERATIONS = 10000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

const CREDENTIALS_STORE_PATH = path.resolve(process.cwd(), '.temp/local_credentials_store.json');

function ensureTempDir() {
  const dir = path.dirname(CREDENTIALS_STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readStoredCredentials(): StoredCredentials[] {
  ensureTempDir();
  if (!fs.existsSync(CREDENTIALS_STORE_PATH)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(CREDENTIALS_STORE_PATH, 'utf8'));
  } catch {
    return [];
  }
}

function writeStoredCredentials(creds: StoredCredentials[]) {
  ensureTempDir();
  fs.writeFileSync(CREDENTIALS_STORE_PATH, JSON.stringify(creds, null, 2), 'utf8');
}

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

export function saveLocalCredentials(email: string, password: string, userId?: string): StoredCredentials {
  const creds = readStoredCredentials();
  const normalizedEmail = email.toLowerCase().trim();
  const existingIndex = creds.findIndex((c) => c.email === normalizedEmail);

  const { saltHex, hashHex } = hashPassword(password);
  const record: StoredCredentials = {
    userId: userId || `usr_${crypto.randomBytes(8).toString('hex')}`,
    email: normalizedEmail,
    saltHex,
    hashHex,
    iterations: DEFAULT_ITERATIONS,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    creds[existingIndex] = record;
  } else {
    creds.push(record);
  }

  writeStoredCredentials(creds);
  return record;
}

export function verifyLocalCredentials(email: string, password: string): StoredCredentials | null {
  const creds = readStoredCredentials();
  const normalizedEmail = email.toLowerCase().trim();
  const record = creds.find((c) => c.email === normalizedEmail);

  if (!record) return null;

  const valid = verifyPassword(password, record.saltHex, record.hashHex, record.iterations);
  return valid ? record : null;
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
