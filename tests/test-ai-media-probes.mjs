import fs from 'node:fs';
import path from 'node:path';

// Parse .env.local safely
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

console.log('=== RIIQX MEDIA PROBE ===');

// 1. Test OpenRouter Models
if (env.OPENROUTER_API_KEY) {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` }
    });
    const data = await res.json();
    console.log('OpenRouter Key Status:', res.status, data?.data ? { label: data.data.label, limit: data.data.limit, usage: data.data.usage } : data);
  } catch (e) {
    console.log('OpenRouter Auth Error:', e.message);
  }
}

// 2. Test AIML API
if (env.AIML_API_KEY) {
  try {
    const res = await fetch('https://api.aimlapi.com/v1/models', {
      headers: { Authorization: `Bearer ${env.AIML_API_KEY}` }
    });
    console.log('AIML API Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      const models = data.data?.map(m => m.id) || [];
      console.log('AIML Total Models:', models.length);
      console.log('AIML Video/Image Models sample:', models.filter(m => m.includes('video') || m.includes('flux') || m.includes('diffusion') || m.includes('dall') || m.includes('runway') || m.includes('luma')).slice(0, 10));
    } else {
      const err = await res.text();
      console.log('AIML API Response:', err.slice(0, 200));
    }
  } catch (e) {
    console.log('AIML API Error:', e.message);
  }
}

// 3. Test Groq
if (env.GROQ_API_KEY) {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${env.GROQ_API_KEY}` }
    });
    console.log('Groq Models Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Groq Models:', data.data?.map(m => m.id).slice(0, 5));
    }
  } catch (e) {
    console.log('Groq Error:', e.message);
  }
}

// 4. Test Google Gemini
if (env.GEMINI_API_KEY) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
    console.log('Gemini Models Status:', res.status);
    if (res.ok) {
      const data = await res.json();
      const geminiModels = data.models?.map(m => m.name.replace('models/', '')) || [];
      console.log('Gemini Models Sample:', geminiModels.filter(m => m.includes('flash') || m.includes('pro') || m.includes('imagen')).slice(0, 10));
    }
  } catch (e) {
    console.log('Gemini Error:', e.message);
  }
}
