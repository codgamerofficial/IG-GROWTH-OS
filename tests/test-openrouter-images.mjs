import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

// 1. Check OpenRouter models for image generation
try {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` }
  });
  const data = await res.json();
  const models = data.data || [];
  const imageModels = models.filter(m => m.id.includes('flux') || m.id.includes('diffusion') || m.id.includes('image'));
  console.log('OpenRouter image-capable models:', imageModels.map(m => ({ id: m.id, name: m.name, pricing: m.pricing })));
} catch (e) {
  console.log('OpenRouter error:', e.message);
}

// 2. Check OpenAI API Key if present
if (env.OPENAI_API_KEY) {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` }
    });
    console.log('OpenAI Key Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('OpenAI models:', data.data?.map(m => m.id).filter(id => id.includes('dall') || id.includes('gpt')).slice(0, 5));
    } else {
      console.log('OpenAI text:', (await res.text()).slice(0, 200));
    }
  } catch (e) {
    console.log('OpenAI error:', e.message);
  }
}

