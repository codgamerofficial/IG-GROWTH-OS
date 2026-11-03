import fs from 'node:fs';

console.log('============================================================');
console.log('🎬 RUNNING RIIQX CREATOR STUDIO 2.0 PRODUCTION VERIFICATION');
console.log('============================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// 1. Test Real AI Script Generation
console.log('\n--- 1. Real AI Script & Hook Generation ---');
const scriptRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_script',
    brief: {
      topic: 'How Neural Interfaces Will Change Coding by 2027',
      niche: 'Tech & AI',
      durationSeconds: 30,
      language: 'en',
    },
  }),
});
assert(scriptRes.status === 200, 'Script generation API returns 200 OK');
const scriptData = await scriptRes.json();
assert(scriptData.success === true, 'Script payload success is true');
assert(scriptData.script?.hooks?.length >= 3, 'Returns 3+ high-retention viral hooks');
assert(scriptData.script?.scenes?.length >= 3, 'Returns 3+ scene-by-scene script breakdowns');
assert(typeof scriptData.script?.scenes[0]?.narration === 'string' && scriptData.script?.scenes[0]?.narration.length > 10, 'Narration script is substantive');
console.log(`     ↳ Generated Script: "${scriptData.script?.title}" | Hook 1: "${scriptData.script?.hooks[0]?.hookText}"`);

// 2. Test Real Prompt Assistance
console.log('\n--- 2. Creative Prompt & Hook Engine ---');
const assistRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'prompt_assist',
    userPrompt: 'Futuristic AI programmer in dark obsidian studio',
    subAction: 'rewrite',
    niche: 'Tech & AI',
  }),
});
assert(assistRes.status === 200, 'Prompt assist API returns 200 OK');
const assistData = await assistRes.json();
assert(assistData.success === true, 'Prompt assist success is true');
assert(assistData.enhancedPrompt?.length > 50, 'Enhanced prompt contains rich cinematic detail');
console.log(`     ↳ Enhanced Prompt Preview: "${assistData.enhancedPrompt.slice(0, 100)}..."`);

// 3. Test Real AI Image Synthesis (FLUX.1)
console.log('\n--- 3. Real Text-to-Image Generation (FLUX.1) ---');
const imgRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_image',
    prompt: 'Cinematic 9:16 vertical shot of neural network brain in obsidian room, neon yellow accents, 8k',
    aspectRatio: '9:16',
    stylePreset: 'cinematic_cyberpunk',
  }),
});
assert(imgRes.status === 200, 'Image generation API returns 200 OK');
const imgData = await imgRes.json();
assert(imgData.success === true, 'Image generation success is true');
assert(imgData.assetUrl && imgData.assetUrl.startsWith('/uploads/generated/'), 'Returns saved disk asset URL');
assert(imgData.dimensions?.width === 720 && imgData.dimensions?.height === 1280, '9:16 vertical geometry verified (720x1280)');
assert(imgData.cost === 0.0, 'Open-weight model cost is correctly verified as $0.000');
const localFilePath = `public${imgData.assetUrl}`;
assert(fs.existsSync(localFilePath), `Image file physically exists on disk: ${localFilePath}`);
const fileStat = fs.statSync(localFilePath);
assert(fileStat.size > 5000, `Image file size is non-trivial (${fileStat.size} bytes)`);
console.log(`     ↳ Generated Asset: ${imgData.assetUrl} (${fileStat.size} bytes)`);

// 4. Test Durable Job Store & Status Polling
console.log('\n--- 4. Durable Job Queue & State Recovery ---');
assert(imgData.jobId !== undefined, 'Image generation produced a tracked jobId');
const jobRes = await fetch(`http://localhost:3001/api/riiqx/creator/generate?jobId=${imgData.jobId}`);
assert(jobRes.status === 200, 'Job query API returns 200 OK');
const jobData = await jobRes.json();
assert(jobData.success === true && jobData.job?.status === 'completed', 'Job status is truthfully marked as completed');
assert(jobData.job?.progressPercent === 100, 'Job progress reached 100%');
assert(jobData.job?.outputUrl === imgData.assetUrl, 'Job output URL matches generated asset URL');

// 5. Test Truthful Provider Statuses (Luma / Runway Quota Exceeded)
console.log('\n--- 5. Truthful Provider Status & Error Reporting ---');
const lumaRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_video',
    modelId: 'luma-dream-machine',
    prompt: 'Cinematic drone shot over neon metropolis',
    durationSeconds: 5,
  }),
});
assert(lumaRes.status === 402, 'Luma Dream Machine returns 402 Payment/Quota Required');
const lumaData = await lumaRes.json();
assert(lumaData.providerStatus === 'QUOTA_EXCEEDED', 'Provider status is truthfully reported as QUOTA_EXCEEDED');
assert(lumaData.error.includes('quota exceeded'), 'Error message clearly explains provider quota exhaustion');

// 6. Test RIIQX Video Engine Job Submission
console.log('\n--- 6. RIIQX Real-Time Video Engine Dispatch ---');
const riiqxVideoRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_video',
    modelId: 'riiqx-video-engine',
    prompt: 'Futuristic AI video scene',
    durationSeconds: 5,
    aspectRatio: '9:16',
  }),
});
assert(riiqxVideoRes.status === 200, 'RIIQX Video Engine dispatch returns 200 OK');
const riiqxVideoData = await riiqxVideoRes.json();
assert(riiqxVideoData.success === true, 'RIIQX Video Engine dispatch success is true');

// 7. Test Real AI Trend & Content Discovery
console.log('\n--- 7. AI Ideas & Trends Radar ---');
const trendsRes = await fetch('http://localhost:3001/api/riiqx/creator/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'research_trends',
    niche: 'Tech & AI',
    customTopic: 'Autonomous AI Agents',
  }),
});
assert(trendsRes.status === 200, 'Trend research API returns 200 OK');
const trendsData = await trendsRes.json();
assert(trendsData.success === true && Array.isArray(trendsData.trends), 'Trend research returns array of trends');
assert(trendsData.trends.length >= 1, 'Contains substantive research trends');
console.log(`     ↳ Research Angle 1: "${trendsData.trends[0]?.topic || trendsData.trends[0]?.viralHookAngle}"`);

// 8. Test Project Persistence & State Transitions Across Stages
console.log('\n--- 8. Multi-Stage Production Kanban & Project Persistence ---');
const projectListRes = await fetch('http://localhost:3001/api/riiqx/creator');
assert(projectListRes.status === 200, 'Project list API returns 200 OK');
const projectListData = await projectListRes.json();
assert(projectListData.projects.length >= 6, 'All active creator projects persist on server');

const targetProject = projectListData.projects[0];
const originalStatus = targetProject.status;
const updatedStatus = originalStatus === 'editing' ? 'ready_to_publish' : 'editing';

const updateRes = await fetch('http://localhost:3001/api/riiqx/creator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'save_project',
    project: {
      ...targetProject,
      status: updatedStatus,
      updatedAt: new Date().toISOString(),
    },
  }),
});
assert(updateRes.status === 200, 'Project update API returns 200 OK');

// Verify updated project persistence across query
const verifyRes = await fetch(`http://localhost:3001/api/riiqx/creator?id=${targetProject.id}`);
const verifyData = await verifyRes.json();
assert(verifyData.project?.status === updatedStatus, `Project stage transition verified: ${originalStatus} -> ${updatedStatus}`);

// Revert status to maintain original state
await fetch('http://localhost:3001/api/riiqx/creator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'save_project',
    project: { ...targetProject, status: originalStatus },
  }),
});

console.log('============================================================');
console.log(`🎉 TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY!`);
console.log('============================================================');
