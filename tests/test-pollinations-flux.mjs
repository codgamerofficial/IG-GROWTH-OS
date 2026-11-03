import fs from 'node:fs';

const prompt = encodeURIComponent('Cinematic 9:16 vertical shot of a futuristic creator studio with glowing holographic yellow UI');
const url = `https://image.pollinations.ai/prompt/${prompt}?width=720&height=1280&model=flux&nologo=true&seed=42`;

console.log('Fetching real image from Pollinations FLUX engine...');
const res = await fetch(url);
console.log('Status:', res.status, res.headers.get('content-type'));

if (res.ok) {
  const buf = Buffer.from(await res.arrayBuffer());
  console.log('Image buffer size in bytes:', buf.length);
  fs.writeFileSync('tests/sample-generated-flux.jpg', buf);
  console.log('Saved test image to tests/sample-generated-flux.jpg!');
} else {
  console.log('Failed:', await res.text());
}
