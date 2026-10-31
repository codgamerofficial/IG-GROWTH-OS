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

async function run() {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://riiqx.ai',
      'X-Title': 'RIIQX AI',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3.5-lightning:free',
      messages: [{ role: 'user', content: 'Say "RIIQX Nemotron active" in 3 words.' }],
      max_tokens: 150,
    }),
  });
  const text = await res.text();
  console.log('HTTP Status:', res.status);
  const json = JSON.parse(text.trim());
  console.log('CHOICE:', JSON.stringify(json.choices?.[0], null, 2));
}

run();
