import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

const key = env.GEMINI_API_KEY;

// Test 1: imagen-3.0-generate-002
console.log('Testing Gemini Imagen-3 API...');
try {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [
        { prompt: 'A futuristic obsidian and neon yellow creator workspace, cinematic lighting, 8k resolution' }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: '9:16'
      }
    })
  });
  console.log('Imagen-3 predict status:', res.status);
  const data = await res.json();
  if (res.ok) {
    console.log('Imagen-3 success! Prediction bytes available:', !!data.predictions?.[0]?.bytesBase64Encoded);
  } else {
    console.log('Imagen-3 error response:', JSON.stringify(data).slice(0, 300));
  }
} catch (e) {
  console.log('Imagen-3 fetch error:', e.message);
}
