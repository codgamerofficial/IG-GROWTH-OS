import fs from 'node:fs';

function loadEnv() {
  const content = fs.readFileSync('.env.local', 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0 && !line.trim().startsWith('#')) {
      env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const env = loadEnv();
const key = env.OPENROUTER_API_KEY || env['sk-or-v1-openrouter_api_key'];

async function scanAllFree() {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${key}` },
  });
  const data = await res.json();
  const freeModels = (data.data || []).filter(m => m.id.endsWith(':free'));
  console.log(`Auditing all ${freeModels.length} free models on OpenRouter:\n`);

  const results = [];
  for (const m of freeModels) {
    try {
      const t0 = Date.now();
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://riiqx.ai',
          'X-Title': 'RIIQX AI',
        },
        body: JSON.stringify({
          model: m.id,
          messages: [{ role: 'user', content: 'Say "Hi".' }],
          max_tokens: 30,
        }),
        signal: AbortSignal.timeout(6000),
      });
      const text = await r.text();
      let d = {};
      try { d = JSON.parse(text.trim()); } catch {}
      const latency = Date.now() - t0;
      if (r.ok) {
        console.log(`  ✅ ${m.id} (${latency}ms) [context: ${m.context_length}]`);
        results.push({
          id: m.id,
          name: m.name,
          context: m.context_length,
          latency,
          status: 'AVAILABLE',
          description: m.description,
          architecture: m.architecture,
        });
      } else {
        const err = d.error?.message || `HTTP ${r.status}`;
        console.log(`  ❌ ${m.id}: ${err.slice(0, 60)}`);
        results.push({
          id: m.id,
          name: m.name,
          context: m.context_length,
          status: r.status === 429 ? 'RATE_LIMITED' : 'MODEL_UNAVAILABLE',
          error: err,
        });
      }
    } catch (e) {
      console.log(`  ❌ ${m.id}: ${e.message}`);
      results.push({ id: m.id, name: m.name, status: 'TIMEOUT', error: e.message });
    }
  }

  fs.writeFileSync('tests/openrouter-free-audit.json', JSON.stringify(results, null, 2));
  console.log(`\nSaved ${results.length} model audit records to tests/openrouter-free-audit.json.`);
}

scanAllFree();

