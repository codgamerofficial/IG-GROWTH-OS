import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

const res = await fetch('https://api.aimlapi.com/v1/models', {
  headers: { Authorization: `Bearer ${env.AIML_API_KEY}` }
});
const data = await res.json();
const all = data.data || [];

console.log('AIML Video models:');
const video = all.filter(m => m.id.toLowerCase().includes('video') || m.id.toLowerCase().includes('luma') || m.id.toLowerCase().includes('runway') || m.id.toLowerCase().includes('kling') || m.id.toLowerCase().includes('minimax'));
console.log(video.map(m => m.id));

console.log('AIML Image models:');
const images = all.filter(m => m.id.toLowerCase().includes('flux') || m.id.toLowerCase().includes('dall') || m.id.toLowerCase().includes('stable-diffusion') || m.id.toLowerCase().includes('imagen'));
console.log(images.map(m => m.id).slice(0, 20));
