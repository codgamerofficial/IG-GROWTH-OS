const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgEmblem = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#24143D" />
      <stop offset="65%" stop-color="#100C22" />
      <stop offset="100%" stop-color="#070611" />
    </radialGradient>
    <linearGradient id="festiveGrad" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#E11D48" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Maskable Safe Squircle / Circle -->
  <rect x="0" y="0" width="512" height="512" rx="115" fill="url(#bgGrad)" />
  <circle cx="256" cy="256" r="215" fill="#141028" stroke="#F59E0B" stroke-width="7" stroke-opacity="0.8" />

  <!-- Outer Divine Radiance -->
  <circle cx="256" cy="256" r="180" fill="#E11D48" opacity="0.16" filter="url(#glow)" />

  <!-- Central Flame / Durga Third Eye Motif -->
  <path
    d="M256 70 C272 150 375 170 375 260 C375 330 318 390 256 440 C194 390 137 330 137 260 C137 170 240 150 256 70 Z"
    fill="url(#festiveGrad)"
    filter="url(#glow)"
  />

  <!-- Golden Inner Core / Bindu -->
  <circle cx="256" cy="260" r="48" fill="#FDE047" />
  <circle cx="256" cy="260" r="22" fill="#FFFFFF" opacity="0.9" />

  <!-- Traditional Alpona Smile Arc -->
  <path
    d="M205 355 C230 380 282 380 307 355"
    stroke="#FDE047"
    stroke-width="14"
    stroke-linecap="round"
  />

  <!-- Dhak Flank Curves -->
  <path
    d="M120 260 C155 230 155 290 190 260"
    stroke="#FFFBEB"
    stroke-width="10"
    stroke-linecap="round"
    opacity="0.9"
  />
  <path
    d="M392 260 C357 230 357 290 322 260"
    stroke="#FFFBEB"
    stroke-width="10"
    stroke-linecap="round"
    opacity="0.9"
  />
</svg>`;

async function generate() {
  const buf = Buffer.from(svgEmblem);
  fs.writeFileSync('public/brand/icon.svg', svgEmblem);

  const targets = [
    { file: 'public/icon-192.png', size: 192 },
    { file: 'public/icon-512.png', size: 512 },
    { file: 'public/brand/icon-192.png', size: 192 },
    { file: 'public/brand/icon-512.png', size: 512 },
    { file: 'public/icon-maskable-192.png', size: 192 },
    { file: 'public/icon-maskable-512.png', size: 512 },
    { file: 'public/favicon.ico', size: 48 },
  ];

  for (const t of targets) {
    await sharp(buf)
      .resize(t.size, t.size)
      .png()
      .toFile(t.file);
    console.log(`Generated ${t.file} (${t.size}x${t.size})`);
  }

  // Also generate 2 Android screenshot previews for manifest
  const masterPoster = 'public/images/pujahop-campaign-master.jpg';
  if (fs.existsSync(masterPoster)) {
    // Narrow screenshot (phone: 540x960)
    await sharp(masterPoster)
      .resize(540, 960, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 90 })
      .toFile('public/screenshot-mobile.jpg');
    console.log('Generated public/screenshot-mobile.jpg (540x960)');

    // Wide screenshot (tablet / desktop: 1024x576)
    await sharp(masterPoster)
      .resize(1024, 576, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 90 })
      .toFile('public/screenshot-wide.jpg');
    console.log('Generated public/screenshot-wide.jpg (1024x576)');
  }

  console.log('🎉 All Android WebApp visual assets generated successfully!');
}

generate().catch(console.error);
