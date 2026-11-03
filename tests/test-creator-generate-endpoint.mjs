console.log('Testing /api/riiqx/creator/generate endpoint...');

// 1. Test Prompt Assist
const assistRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'prompt_assist',
    userPrompt: 'AI robot coding in neon room',
    subAction: 'rewrite',
    niche: 'Tech & AI'
  })
});
console.log('Prompt assist status:', assistRes.status);
const assistData = await assistRes.json();
console.log('Enhanced prompt preview:', assistData.enhancedPrompt?.slice(0, 150));

// 2. Test Real Script Generation
const scriptRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_script',
    brief: {
      topic: 'How Top Creators 10x Output With Autonomous AI Agents',
      niche: 'Tech & AI',
      durationSeconds: 30,
      language: 'en'
    }
  })
});
console.log('Script gen status:', scriptRes.status);
const scriptData = await scriptRes.json();
console.log('Script title:', scriptData.script?.title);
console.log('Hooks:', scriptData.script?.hooks?.map(h => h.hookText).slice(0, 2));

// 3. Test Truthful Video Model Status check
const videoRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_video',
    modelId: 'luma-dream-machine',
    prompt: 'Cinematic drone shot over futuristic city',
    durationSeconds: 5
  })
});
console.log('Video Luma status (truthful quota exceeded):', videoRes.status);
const videoData = await videoRes.json();
console.log('Video error response:', videoData.error);

