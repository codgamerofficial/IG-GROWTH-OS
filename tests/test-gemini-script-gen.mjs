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

console.log('Testing Gemini Structured Script Generation...');

const prompt = `You are the lead viral video director for RIIQX AI Creator OS.
Create a high-retention 30-second vertical video script for YouTube Shorts and Instagram Reels.
Topic: "How AI Agents Automate Content Creation in 2026"
Niche: "Tech & AI"
Tone: "authoritative"
Language: "en"

Return ONLY a valid JSON object matching this schema:
{
  "title": "...",
  "hooks": [
    {
      "type": "curiosity_gap",
      "hookText": "...",
      "visualCue": "...",
      "engagementScoreEstimate": 95,
      "estimatedRetentionRate": 90
    },
    {
      "type": "pattern_interrupt",
      "hookText": "...",
      "visualCue": "...",
      "engagementScoreEstimate": 92,
      "estimatedRetentionRate": 86
    },
    {
      "type": "bold_statistic",
      "hookText": "...",
      "visualCue": "...",
      "engagementScoreEstimate": 96,
      "estimatedRetentionRate": 92
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Hook",
      "durationSeconds": 3,
      "narration": "...",
      "onScreenText": "...",
      "visualDirections": "...",
      "bRollSuggestion": "...",
      "cameraMotion": "slow_zoom_in",
      "soundNote": "..."
    },
    {
      "sceneNumber": 2,
      "title": "The Bottleneck",
      "durationSeconds": 7,
      "narration": "...",
      "onScreenText": "...",
      "visualDirections": "...",
      "bRollSuggestion": "...",
      "cameraMotion": "pan_right",
      "soundNote": "..."
    },
    {
      "sceneNumber": 3,
      "title": "The Solution",
      "durationSeconds": 12,
      "narration": "...",
      "onScreenText": "...",
      "visualDirections": "...",
      "bRollSuggestion": "...",
      "cameraMotion": "dynamic_orbit",
      "soundNote": "..."
    },
    {
      "sceneNumber": 4,
      "title": "Call to Action",
      "durationSeconds": 8,
      "narration": "...",
      "onScreenText": "...",
      "visualDirections": "...",
      "bRollSuggestion": "...",
      "cameraMotion": "static",
      "soundNote": "..."
    }
  ],
  "totalDurationSeconds": 30,
  "caption": "...",
  "hashtags": "..."
}`;

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  })
});

console.log('Gemini Status:', res.status);
if (res.ok) {
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(text);
  console.log('Script title:', parsed.title);
  console.log('Hooks count:', parsed.hooks?.length);
  console.log('Hook 1:', parsed.hooks?.[0]?.hookText);
  console.log('Scenes count:', parsed.scenes?.length);
} else {
  console.log('Gemini Error:', await res.text());
}

