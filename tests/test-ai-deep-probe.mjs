import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();

async function deepProbe() {
  console.log('🔬 DEEP PROBE WITH 5S TIMEOUTS: Testing Models & Capabilities...\n');

  // A. Groq Direct Capabilities & Models
  const groqKey = env.GROQ_API_KEY;
  if (groqKey) {
    console.log('--- 1. Groq Models & Audio ---');
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${groqKey}` },
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      const groqModels = (data.data || []).map(m => m.id);
      const audioModels = groqModels.filter(m => m.includes('whisper'));
      const textModels = groqModels.filter(m => !m.includes('whisper') && !m.includes('guard'));
      console.log(`  Groq Active Text Models (${textModels.length}): ${textModels.join(', ')}`);
      console.log(`  Groq Active Whisper Models (${audioModels.length}): ${audioModels.join(', ')}`);
    } catch (e) {
      console.log(`  Groq Error: ${e.message}`);
    }
  }

  // B. NVIDIA NIM Models Test
  const nvKey = env.NVIDIA_NIM_API_KEY || env.Nvdia_nim_api_key;
  if (nvKey) {
    console.log('\n--- 2. NVIDIA NIM Direct Models ---');
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
        headers: { Authorization: `Bearer ${nvKey}` },
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      const models = (data.data || []).map(m => m.id);
      console.log(`  Total NVIDIA Models: ${models.length}`);

      // Test a few specific well-known NIM models
      const testList = [
        'meta/llama-3.1-8b-instruct',
        'meta/llama-3.3-70b-instruct',
        'mistralai/mistral-7b-instruct-v0.3',
        'nvidia/nemotron-4-340b-instruct',
      ];
      for (const m of testList) {
        if (!models.includes(m)) {
          console.log(`  Model ${m} not in account catalog`);
          continue;
        }
        try {
          const t0 = Date.now();
          const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${nvKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: m,
              messages: [{ role: 'user', content: 'Say "NVIDIA OK".' }],
              max_tokens: 10,
            }),
            signal: AbortSignal.timeout(5000),
          });
          const d = await r.json();
          if (r.ok) {
            console.log(`  ✅ ${m} (${Date.now() - t0}ms): "${d.choices?.[0]?.message?.content?.trim()}"`);
          } else {
            console.log(`  ❌ ${m}: HTTP ${r.status} ${d.detail || d.error || ''}`);
          }
        } catch (err) {
          console.log(`  ❌ ${m}: ${err.message}`);
        }
      }
    } catch (e) {
      console.log(`  NVIDIA Error: ${e.message}`);
    }
  }

  // C. OpenRouter Free Scan (Fast with 4s timeout)
  const orKey = env.OPENROUTER_API_KEY || env['sk-or-v1-openrouter_api_key'];
  if (orKey) {
    console.log('\n--- 3. OpenRouter Free Models Quick Scan ---');
    try {
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${orKey}` },
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      const freeModels = (data.data || []).filter(m => m.id.endsWith(':free'));
      console.log(`  Found ${freeModels.length} :free models.`);

      for (const m of freeModels.slice(0, 8)) {
        try {
          const t0 = Date.now();
          const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${orKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://riiqx.ai',
              'X-Title': 'RIIQX AI',
            },
            body: JSON.stringify({
              model: m.id,
              messages: [{ role: 'user', content: 'Reply "OK".' }],
              max_tokens: 10,
            }),
            signal: AbortSignal.timeout(4000),
          });
          const d = await r.json();
          if (r.ok && d.choices?.[0]?.message?.content) {
            console.log(`  ✅ ${m.id} (${Date.now() - t0}ms): "${d.choices[0].message.content.trim()}"`);
          } else {
            console.log(`  ❌ ${m.id}: HTTP ${r.status} ${d.error?.message?.slice(0, 50) || ''}`);
          }
        } catch (err) {
          console.log(`  ❌ ${m.id}: ${err.message}`);
        }
      }
    } catch (e) {
      console.log(`  OpenRouter Error: ${e.message}`);
    }
  }

  // D. AIML API Quick Test
  const aimlKey = env.AIML_API_KEY || env.aiml_api_key;
  if (aimlKey) {
    console.log('\n--- 4. AIML API Credit Check ---');
    try {
      const r = await fetch('https://api.aimlapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${aimlKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          messages: [{ role: 'user', content: 'Say "OK".' }],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(5000),
      });
      const d = await r.json();
      if (r.ok) {
        console.log(`  ✅ AIML API Success: "${d.choices?.[0]?.message?.content?.trim()}"`);
      } else {
        console.log(`  ❌ AIML API: HTTP ${r.status} ${d.message || JSON.stringify(d)}`);
      }
    } catch (e) {
      console.log(`  AIML API: ${e.message}`);
    }
  }

  console.log('\n✅ Probe Complete.');
}

deepProbe();
