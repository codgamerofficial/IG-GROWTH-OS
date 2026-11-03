import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

console.log('Testing AIML API Image Generation...');
try {
  const res = await fetch('https://api.aimlapi.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.AIML_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'blackforestlabs/flux-dev',
      prompt: 'Cinematic glowing neon AI cube, high resolution 8K dark studio',
      n: 1,
      size: '1024x1024'
    })
  });
  console.log('AIML Image status:', res.status);
  const data = await res.json();
  console.log('AIML Image response:', JSON.stringify(data).slice(0, 300));
} catch (e) {
  console.log('AIML Image Error:', e.message);
}

