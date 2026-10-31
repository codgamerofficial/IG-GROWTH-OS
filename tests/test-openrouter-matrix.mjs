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

const modelsToTest = [
  'nvidia/nemotron-3.5-lightning:free',
  'poolside/laguna-s-2.1:free',
  'liquid/lfm-2.5-2.6b:free',
  'dots-studio/dots-3-note-preview:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'deepseek/deepseek-chat:free',
];

async function testAll() {
  console.log('Testing OpenRouter models with 400 max_tokens:');
  for (const m of modelsToTest) {
    try {
      const t0 = Date.now();
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://riiqx.ai',
          'X-Title': 'RIIQX AI',
        },
        body: JSON.stringify({
          model: m,
          messages: [{ role: 'user', content: 'Say "RIIQX Verified" in 2 words.' }],
          max_tokens: 400,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const text = await res.text();
      const d = JSON.parse(text.trim());
      const latency = Date.now() - t0;
      if (res.ok) {
        const msg = d.choices?.[0]?.message;
        const out = msg?.content || `[Reasoning: ${msg?.reasoning?.slice(0, 40)}...]`;
        console.log(`  ✅ ${m} (${latency}ms): "${out.trim()}"`);
      } else {
        console.log(`  ❌ ${m}: HTTP ${res.status} ${d.error?.message?.slice(0, 50)}`);
      }
    } catch (e) {
      console.log(`  ❌ ${m}: ${e.message}`);
    }
  }
}

testAll();

