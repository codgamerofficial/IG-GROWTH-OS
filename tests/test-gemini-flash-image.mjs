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

console.log('Testing gemini-2.5-flash-image generateContent...');
try {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: 'Generate an image of a sleek yellow futuristic robot creator in an obsidian dark room.' }
          ]
        }
      ]
    })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response candidates:', JSON.stringify(data.candidates?.[0]?.content?.parts || data).slice(0, 500));
} catch (e) {
  console.log('Error:', e.message);
}

