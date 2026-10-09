import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

console.log('Generating Supabase TypeScript types from remote linked project...');
try {
  const output = execSync('npx supabase gen types --linked', { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });

  const webPath = path.join(process.cwd(), 'src', 'lib', 'types', 'database.types.ts');
  const mobileDir = path.join(process.cwd(), 'mobile', 'src', 'types');
  if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir, { recursive: true });
  const mobilePath = path.join(mobileDir, 'database.types.ts');

  fs.writeFileSync(webPath, output, 'utf-8');
  fs.writeFileSync(mobilePath, output, 'utf-8');

  console.log(`✓ Generated types written to:\n  - ${webPath}\n  - ${mobilePath}`);
} catch (err) {
  console.error('Failed to generate types:', err.message);
  process.exit(1);
}
