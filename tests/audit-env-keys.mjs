import fs from 'node:fs';
import path from 'node:path';

function inspectEnv(file) {
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const keys = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      keys.push({
        key,
        hasValue: val.length > 0 && val !== '""' && val !== "''",
        len: val.length,
      });
    }
  }
  return keys;
}

console.log('--- .env.local keys ---');
const local = inspectEnv('.env.local');
local.forEach(k => console.log(`${k.key}: configured=${k.hasValue} (len=${k.len})`));

console.log('\n--- .env keys ---');
const prod = inspectEnv('.env');
prod.forEach(k => console.log(`${k.key}: configured=${k.hasValue} (len=${k.len})`));

