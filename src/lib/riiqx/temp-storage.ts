// =============================================================================
// RIIQX — Safe Cross-Platform Runtime Storage Utility
// Universal Temporary Directory & Ephemeral File Handler
// Supports Vercel Serverless (/tmp), AWS Lambda (/tmp), Windows, and macOS/Linux
// =============================================================================

import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * Returns a guaranteed writable directory for runtime caches, temporary files,
 * and fallback offline stores.
 *
 * In serverless environments (Vercel, AWS Lambda):
 * - `process.cwd()` evaluates to `/var/task`, which is strictly read-only.
 * - `os.tmpdir()` evaluates to `/tmp`, the only writable ephemeral storage.
 *
 * In local development:
 * - On Windows: `%TEMP%\riiqx`
 * - On Linux/macOS: `/tmp/riiqx`
 */
export function getSafeTempDir(subDir = 'riiqx'): string {
  const baseTmp = os.tmpdir() || '/tmp';
  const targetDir = path.join(baseTmp, subDir);

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  } catch (err) {
    // If sub-directory creation fails, fallback to root temporary directory directly
    return baseTmp;
  }
}

/**
 * Returns a safe, fully resolved file path inside the writable temporary directory.
 */
export function getSafeTempFilePath(fileName: string, subDir = 'riiqx'): string {
  const dir = getSafeTempDir(subDir);
  return path.join(dir, fileName);
}

/**
 * Safely reads JSON from disk with fallback to default value on any filesystem error.
 */
export function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safely writes JSON data to disk, ensuring directory existence and suppressing crashes.
 */
export function safeWriteJson<T>(filePath: string, data: T): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.warn(`[SafeStorage] Warning: Failed to write to ${filePath}:`, err);
    return false;
  }
}

