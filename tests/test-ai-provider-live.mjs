import fs from 'node:fs';
import path from 'node:path';

// Parse .env.local safely
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

console.log('🧪 Starting RIIQX Live Provider Discovery & Health Test Suite...\n');

const results = {};

// 1. Test Groq
async function testGroq() {
  const key = env.GROQ_API_KEY;
  if (!key) {
    results.groq = { status: 'NOT_CONFIGURED' };
    return;
  }
  console.log('--- Probing Groq Cloud ---');
  try {
    const t0 = Date.now();
    const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const modelsData = await modelsRes.json();
    const discoveryLatency = Date.now() - t0;
    
    if (!modelsRes.ok) {
      console.log(`  ❌ Groq Discovery Failed: ${modelsRes.status} ${modelsData.error?.message || ''}`);
      results.groq = { status: 'DISCOVERY_FAILED', error: modelsData.error?.message, statusHttp: modelsRes.status };
      return;
    }

    const modelIds = (modelsData.data || []).map(m => m.id);
    console.log(`  ✅ Groq Discovered ${modelIds.length} models in ${discoveryLatency}ms.`);
    console.log(`     Sample models: ${modelIds.slice(0, 6).join(', ')}`);

    // Pick a model for a minimal inference test
    // Usually llama-3.3-70b-versatile or qwen-2.5-32b or llama-3.1-8b-instant
    const testCandidate = modelIds.find(id => id.includes('llama-3.1-8b-instant') || id.includes('llama3-8b') || id.includes('qwen')) || modelIds[0];
    
    const tInfer0 = Date.now();
    const chatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: testCandidate,
        messages: [{ role: 'user', content: 'Say "RIIQX verified" in 3 words.' }],
        max_tokens: 20,
      }),
    });
    const chatData = await chatRes.json();
    const inferLatency = Date.now() - tInfer0;

    if (!chatRes.ok) {
      console.log(`  ❌ Groq Inference Failed on ${testCandidate}: ${chatRes.status} ${chatData.error?.message || ''}`);
      results.groq = { status: 'MODEL_UNAVAILABLE', error: chatData.error?.message, models: modelIds };
    } else {
      const reply = chatData.choices?.[0]?.message?.content?.trim();
      console.log(`  ✅ Groq Inference Success on ${testCandidate} (${inferLatency}ms): "${reply}"`);
      results.groq = {
        status: 'AVAILABLE',
        testedModel: testCandidate,
        reply,
        latencyMs: inferLatency,
        modelsCount: modelIds.length,
        models: modelIds,
        freeTier: true,
      };
    }
  } catch (err) {
    console.log(`  ❌ Groq Network Error: ${err.message}`);
    results.groq = { status: 'PROVIDER_ERROR', error: err.message };
  }
}

// 2. Test OpenRouter
async function testOpenRouter() {
  const key = env.OPENROUTER_API_KEY || env['sk-or-v1-openrouter_api_key'];
  if (!key) {
    results.openrouter = { status: 'NOT_CONFIGURED' };
    return;
  }
  console.log('\n--- Probing OpenRouter Multi-Cloud Gateway ---');
  try {
    const t0 = Date.now();
    const modelsRes = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const modelsData = await modelsRes.json();
    const discoveryLatency = Date.now() - t0;

    if (!modelsRes.ok) {
      console.log(`  ❌ OpenRouter Discovery Failed: ${modelsRes.status}`);
      results.openrouter = { status: 'DISCOVERY_FAILED', statusHttp: modelsRes.status };
      return;
    }

    const allModels = modelsData.data || [];
    const freeModels = allModels.filter(m => {
      const p = m.pricing;
      return m.id.endsWith(':free') || (p && parseFloat(p.prompt) === 0 && parseFloat(p.completion) === 0);
    });
    console.log(`  ✅ OpenRouter Discovered ${allModels.length} total models (${freeModels.length} 100% free variants) in ${discoveryLatency}ms.`);
    console.log(`     Sample free models: ${freeModels.slice(0, 5).map(m => m.id).join(', ')}`);

    // Test a free model inference
    const candidate = freeModels[0]?.id || 'google/gemini-2.0-flash-lite-preview-02-05:free';
    console.log(`     Testing inference with free candidate: ${candidate}...`);
    const tInfer0 = Date.now();
    const chatRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://riiqx.ai',
        'X-Title': 'RIIQX AI',
      },
      body: JSON.stringify({
        model: candidate,
        messages: [{ role: 'user', content: 'Say "RIIQX OpenRouter OK" in 4 words.' }],
        max_tokens: 25,
      }),
    });
    const chatData = await chatRes.json();
    const inferLatency = Date.now() - tInfer0;

    if (!chatRes.ok) {
      console.log(`  ❌ OpenRouter Inference Failed on ${candidate}: ${chatRes.status} ${chatData.error?.message || JSON.stringify(chatData)}`);
      results.openrouter = {
        status: 'MODEL_UNAVAILABLE',
        error: chatData.error?.message,
        modelsCount: allModels.length,
        freeModelsCount: freeModels.length,
        freeModels: freeModels.map(m => m.id),
      };
    } else {
      const reply = chatData.choices?.[0]?.message?.content?.trim();
      console.log(`  ✅ OpenRouter Inference Success on ${candidate} (${inferLatency}ms): "${reply}"`);
      results.openrouter = {
        status: 'AVAILABLE',
        testedModel: candidate,
        reply,
        latencyMs: inferLatency,
        modelsCount: allModels.length,
        freeModelsCount: freeModels.length,
        freeModels: freeModels.map(m => m.id),
      };
    }
  } catch (err) {
    console.log(`  ❌ OpenRouter Network Error: ${err.message}`);
    results.openrouter = { status: 'PROVIDER_ERROR', error: err.message };
  }
}

// 3. Test NVIDIA NIM
async function testNvidia() {
  const key = env.NVIDIA_NIM_API_KEY || env.Nvdia_nim_api_key;
  if (!key) {
    results.nvidia = { status: 'NOT_CONFIGURED' };
    return;
  }
  console.log('\n--- Probing NVIDIA NIM Cloud Microservices ---');
  try {
    const t0 = Date.now();
    const modelsRes = await fetch('https://integrate.api.nvidia.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const modelsData = await modelsRes.json();
    const discoveryLatency = Date.now() - t0;

    if (!modelsRes.ok) {
      console.log(`  ❌ NVIDIA NIM Discovery Failed: ${modelsRes.status} ${modelsData.detail || modelsData.error || ''}`);
      results.nvidia = { status: 'DISCOVERY_FAILED', statusHttp: modelsRes.status, error: modelsData.detail || modelsData.error };
      return;
    }

    const models = (modelsData.data || []).map(m => m.id);
    console.log(`  ✅ NVIDIA NIM Discovered ${models.length} models in ${discoveryLatency}ms.`);
    console.log(`     Sample models: ${models.slice(0, 6).join(', ')}`);

    // Pick Nemotron or Llama or Qwen candidate
    const candidate = models.find(m => m.includes('nemotron') || m.includes('llama-3.1-8b') || m.includes('llama3-8b')) || models[0];
    console.log(`     Testing inference with candidate: ${candidate}...`);
    const tInfer0 = Date.now();
    const chatRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: candidate,
        messages: [{ role: 'user', content: 'Say "RIIQX NVIDIA OK" in 3 words.' }],
        max_tokens: 20,
      }),
    });
    const chatData = await chatRes.json();
    const inferLatency = Date.now() - tInfer0;

    if (!chatRes.ok) {
      console.log(`  ❌ NVIDIA Inference Failed on ${candidate}: ${chatRes.status} ${chatData.detail || chatData.error || JSON.stringify(chatData)}`);
      results.nvidia = {
        status: 'MODEL_UNAVAILABLE',
        error: chatData.detail || chatData.error,
        modelsCount: models.length,
        models,
      };
    } else {
      const reply = chatData.choices?.[0]?.message?.content?.trim();
      console.log(`  ✅ NVIDIA Inference Success on ${candidate} (${inferLatency}ms): "${reply}"`);
      results.nvidia = {
        status: 'AVAILABLE',
        testedModel: candidate,
        reply,
        latencyMs: inferLatency,
        modelsCount: models.length,
        models,
      };
    }
  } catch (err) {
    console.log(`  ❌ NVIDIA Network Error: ${err.message}`);
    results.nvidia = { status: 'PROVIDER_ERROR', error: err.message };
  }
}

// 4. Test Cohere
async function testCohere() {
  const key = env.COHERE_API_KEY || env.cohera_api_key;
  if (!key) {
    results.cohere = { status: 'NOT_CONFIGURED' };
    return;
  }
  console.log('\n--- Probing Cohere Intelligence Cloud ---');
  try {
    const t0 = Date.now();
    const modelsRes = await fetch('https://api.cohere.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const modelsData = await modelsRes.json();
    const discoveryLatency = Date.now() - t0;

    if (!modelsRes.ok) {
      console.log(`  ❌ Cohere Discovery Failed: ${modelsRes.status} ${modelsData.message || ''}`);
      results.cohere = { status: 'DISCOVERY_FAILED', statusHttp: modelsRes.status, error: modelsData.message };
      return;
    }

    const models = (modelsData.models || []).map(m => m.name);
    console.log(`  ✅ Cohere Discovered ${models.length} models in ${discoveryLatency}ms.`);
    console.log(`     Sample models: ${models.slice(0, 6).join(', ')}`);

    const candidate = 'command-r-08-2024';
    console.log(`     Testing inference with candidate: ${candidate}...`);
    const tInfer0 = Date.now();
    const chatRes = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: candidate,
        messages: [{ role: 'user', content: 'Say "RIIQX Cohere OK" in 3 words.' }],
        max_tokens: 20,
      }),
    });
    const chatData = await chatRes.json();
    const inferLatency = Date.now() - tInfer0;

    if (!chatRes.ok) {
      console.log(`  ❌ Cohere Inference Failed on ${candidate}: ${chatRes.status} ${chatData.message || JSON.stringify(chatData)}`);
      results.cohere = {
        status: 'MODEL_UNAVAILABLE',
        error: chatData.message,
        modelsCount: models.length,
        models,
      };
    } else {
      const reply = chatData.message?.content?.[0]?.text?.trim();
      console.log(`  ✅ Cohere Inference Success on ${candidate} (${inferLatency}ms): "${reply}"`);
      results.cohere = {
        status: 'AVAILABLE',
        testedModel: candidate,
        reply,
        latencyMs: inferLatency,
        modelsCount: models.length,
        models,
      };
    }
  } catch (err) {
    console.log(`  ❌ Cohere Network Error: ${err.message}`);
    results.cohere = { status: 'PROVIDER_ERROR', error: err.message };
  }
}

// 5. Test AIML API
async function testAiml() {
  const key = env.AIML_API_KEY || env.aiml_api_key;
  if (!key) {
    results.aiml = { status: 'NOT_CONFIGURED' };
    return;
  }
  console.log('\n--- Probing AIML API ---');
  try {
    const modelsRes = await fetch('https://api.aimlapi.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    const modelsData = await modelsRes.json();
    if (!modelsRes.ok) {
      console.log(`  ❌ AIML API Failed: ${modelsRes.status} ${modelsData.message || ''}`);
      results.aiml = { status: 'AUTHENTICATION_FAILED', error: modelsData.message };
    } else {
      const count = modelsData.data?.length || 0;
      console.log(`  ✅ AIML API Discovered ${count} models.`);
      results.aiml = { status: 'AVAILABLE', modelsCount: count };
    }
  } catch (err) {
    console.log(`  ❌ AIML API Network Error: ${err.message}`);
    results.aiml = { status: 'PROVIDER_ERROR', error: err.message };
  }
}

async function run() {
  await testGroq();
  await testOpenRouter();
  await testNvidia();
  await testCohere();
  await testAiml();

  console.log('\n=============================================');
  console.log('📊 RIIQX PROVIDER DISCOVERY SUMMARY');
  console.log('=============================================');
  for (const [p, r] of Object.entries(results)) {
    console.log(`${p.toUpperCase()}: status=${r.status}, modelsCount=${r.modelsCount || 0}, latency=${r.latencyMs || 'N/A'}ms`);
  }
  fs.writeFileSync('tests/provider-audit-results.json', JSON.stringify(results, null, 2));
}

run();

