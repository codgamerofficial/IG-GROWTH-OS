import fs from 'node:fs';
import path from 'node:path';

function getFiles(dir, exts, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') getFiles(full, exts, list);
    } else if (exts.some(e => f.endsWith(e))) {
      list.push(full);
    }
  }
  return list;
}

const files = getFiles('src', ['.tsx', '.ts']);
const hrefs = new Set();
const hrefRegex = /href=['"`](\/[^'"`]*?)['"`]/g;
const routerRegex = /router\.push\(['"`](\/[^'"`]*?)['"`]/g;
const windowLocRegex = /window\.location\.href\s*=\s*['"`](\/[^'"`]*?)['"`]/g;
const linkRegex = /href=\{`(\/[^`$]*)/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = hrefRegex.exec(content)) !== null) {
    const clean = m[1].split('?')[0].split('#')[0];
    hrefs.add(clean);
  }
  while ((m = routerRegex.exec(content)) !== null) {
    const clean = m[1].split('?')[0].split('#')[0];
    hrefs.add(clean);
  }
  while ((m = windowLocRegex.exec(content)) !== null) {
    const clean = m[1].split('?')[0].split('#')[0];
    hrefs.add(clean);
  }
}

console.log('Detected internal routes referenced in UI:');
const sorted = Array.from(hrefs).sort();
console.log(sorted);

console.log('\nChecking which routes exist in src/app:');
for (const route of sorted) {
  if (route === '/' || route === '') {
    console.log(`  ✔ / (exists: src/app/page.tsx)`);
    continue;
  }
  if (route.startsWith('/api')) {
    const apiPath = path.join('src', 'app', route, 'route.ts');
    const apiPathJs = path.join('src', 'app', route, 'route.js');
    const exists = fs.existsSync(apiPath) || fs.existsSync(apiPathJs);
    console.log(`  ${exists ? '✔' : '❌ MISSING'} ${route}`);
    continue;
  }
  // Check static files in public
  const publicPath = path.join('public', route);
  if (fs.existsSync(publicPath)) {
    console.log(`  ✔ ${route} (public asset)`);
    continue;
  }
  // Check page route
  const pagePath = path.join('src', 'app', route, 'page.tsx');
  const pagePathTs = path.join('src', 'app', route, 'page.ts');
  const exists = fs.existsSync(pagePath) || fs.existsSync(pagePathTs);
  console.log(`  ${exists ? '✔' : '❌ MISSING'} ${route} (path: ${pagePath})`);
}
