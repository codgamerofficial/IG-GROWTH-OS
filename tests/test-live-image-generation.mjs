import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

console.log('Testing Live Image Generation via OpenRouter...');

try {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://riiqx.ai',
      'X-Title': 'RIIQX Studio',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-image',
      messages: [
        {
          role: 'user',
          content: 'Generate a high quality visual image of a sleek yellow futuristic robot creator in an obsidian dark room. Return the image.',
        },
      ],
      modalities: ['image', 'text'],
    }),
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response choice:', JSON.stringify(data.choices?.[0]?.message || data).slice(0, 500));
} catch (e) {
  console.log('Error:', e.message);
}

