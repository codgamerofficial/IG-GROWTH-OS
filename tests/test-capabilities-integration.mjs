// =============================================================================
// RIIQX — Capabilities & Open-Source Adapters Integration Test Suite
// Verifies Remotion, Video Clipping, Voice Studio & SEO Intelligence Adapters
// =============================================================================

async function runTests() {
  console.log('🚀 Running RIIQX Capabilities & Subsystem Adapters Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}\n     ${err.message}`);
    }
  }

  // 1. List Capabilities API
  await test('Registry API: List active adapters & health status', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.capabilities)) throw new Error('Invalid capabilities response');
    if (data.count < 10) throw new Error(`Expected at least 10 adapters, got ${data.count}`);
    const hasRemotion = data.capabilities.some(c => c.provider === 'remotion');
    const hasVoice = data.capabilities.some(c => c.provider === 'voicestudio');
    const hasClip = data.capabilities.some(c => c.provider === 'autoshorts');
    const hasSeo = data.capabilities.some(c => c.provider === 'openseo');
    const hasHiggsfield = data.capabilities.some(c => c.provider === 'higgsfield');
    const hasPurffle = data.capabilities.some(c => c.provider === 'purffleshorts');
    const hasCap = data.capabilities.some(c => c.provider === 'cap');
    const hasAppflowy = data.capabilities.some(c => c.provider === 'appflowy');
    if (!hasRemotion || !hasVoice || !hasClip || !hasSeo || !hasHiggsfield || !hasPurffle || !hasCap || !hasAppflowy) {
      throw new Error('Missing core capability adapters');
    }
  });

  // 2. Video Clipping Adapter (AI-Shorts & AutoShorts)
  await test('Video Clipping Adapter: Detect highlights & produce 9:16 vertical clips', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/video.clip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'autoshorts',
        payload: {
          sourceVideoUrl: '/uploads/sample_vertical.mp4',
          videoTitle: 'AI Cloud Intelligence Masterclass',
          targetAspectRatio: '9:16',
          maxClips: 3,
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Clipping failed');
    if (!data.result?.candidateClips || data.result.candidateClips.length === 0) throw new Error('No candidate clips generated');
    const clip = data.result.candidateClips[0];
    if (!clip.title || !clip.startSec || !clip.durationSeconds) throw new Error('Candidate clip missing timing metadata');
  });

  // 3. Voice Studio Adapter (VoiceStudio & OpenWhispr)
  await test('Voice Studio Adapter: Multilingual TTS & word-level timing (Bengali/English)', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/voice.synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'voicestudio',
        payload: {
          text: 'RIIQX is the unified AI creator operating system designed for exponential growth.',
          language: 'en',
          speed: 1.1,
          emotion: 'enthusiastic',
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Voice synthesis failed');
    if (!data.result?.audioUrl || !data.result?.durationSeconds) throw new Error('Invalid audio result');
    if (!Array.isArray(data.result?.wordTimestamps) || data.result.wordTimestamps.length === 0) throw new Error('Missing word timestamps');
  });

  // 4. SEO Intelligence Adapter (OpenSEO)
  await test('SEO Intelligence Adapter: Keyword search intent & cluster scoring', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/seo.keyword_research', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'openseo',
        payload: {
          keyword: 'ai video generator',
          countryCode: 'US',
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'SEO keyword query failed');
    if (!Array.isArray(data.result) || data.result.length === 0) throw new Error('No keyword clusters returned');
    if (data.result[0].searchVolume <= 0 || !data.result[0].intent) throw new Error('Invalid keyword metrics');
  });

  // 5. Remotion Video Composition Adapter
  await test('Remotion Composition Adapter: React video timeline composition', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/video.render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'remotion',
        payload: {
          projectId: 'proj_test_remotion',
          title: 'Autonomous AI Cloud Workflow',
          scenes: [
            { id: 'sc_1', text: 'Hook: The Speed Shift', durationSeconds: 5 },
            { id: 'sc_2', text: 'Body: Cloud Processing Scale', durationSeconds: 10 },
            { id: 'sc_3', text: 'CTA: Follow for more', durationSeconds: 5 },
          ],
          aspectRatio: '9:16',
          fps: 30,
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Remotion render failed');
    if (!data.result?.renderedVideoUrl || !data.result?.totalDurationSeconds) throw new Error('Invalid render output');
  });

  // 6. Media Generation Adapter (Open-Higgsfield-AI)
  await test('Media Generation Adapter: Cinema-style Text-to-Video generation', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/media.generate.video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'higgsfield',
        payload: {
          mode: 'text_to_video',
          prompt: 'Futuristic AI datacenter glowing in gold and obsidian neon, cinematic lighting, 8k',
          aspectRatio: '9:16',
          durationSeconds: 5,
          cinemaControls: {
            cameraMotion: 'pan_right',
            lightingStyle: 'cinematic',
            colorGrade: 'teal_orange',
          },
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Media generation failed');
    if (!data.result?.assetUrl || data.result.mediaType !== 'video') throw new Error('Invalid media generation output');
  });

  // 7. Voice Dubbing Adapter (VoiceStudio)
  await test('Voice Dubbing Adapter: Audio demuxing, translation & dubbing to Bengali', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/voice.dub', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'voicestudio',
        payload: {
          sourceVideoUrl: '/uploads/sample_vertical.mp4',
          targetLanguage: 'bn',
          preserveBackgroundMusic: true,
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Voice dubbing failed');
    if (!data.result?.dubbedVideoUrl || !Array.isArray(data.result?.translatedTranscript)) {
      throw new Error('Invalid dubbing result payload');
    }
  });

  // 8. Faceless Video Factory (PurffleShorts)
  await test('Faceless Video Factory: End-to-end viral hook, voice, stock matching & Remotion burn-in', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/video.faceless', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'purffleshorts',
        payload: {
          topic: '5 Unbreakable Mindset Habits of Top Founders',
          niche: 'motivation',
          durationSeconds: 30,
          language: 'en',
          stylePreset: 'viral_kinetic',
          aspectRatio: '9:16',
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Faceless video creation failed');
    if (!data.result?.renderedVideoUrl || !data.result?.script?.hook || !Array.isArray(data.result?.scenes)) {
      throw new Error('Invalid faceless video output structure');
    }
  });

  // 9. SEO Audit Adapter (OpenSEO)
  await test('SEO Audit Adapter: Technical crawling, performance scoring & AI visibility', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/seo.audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'openseo',
        payload: {
          targetUrl: 'https://riiqx.vercel.app',
          checkAiVisibility: true,
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'SEO audit failed');
    if (typeof data.result?.overallScore !== 'number' || !Array.isArray(data.result?.recommendations)) {
      throw new Error('Invalid SEO audit structure');
    }
  });

  // 10. Capture Studio Adapter (Cap)
  await test('Capture Studio Adapter: Screen/Camera stream recording & Whisper transcode hook', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/capture.record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'cap',
        payload: {
          recordingType: 'screen_and_camera_pip',
          durationSeconds: 24,
          autoTranscribeWithWhisper: true,
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Capture record failed');
    if (!data.result?.recordingId || !data.result?.videoAssetUrl) {
      throw new Error('Invalid capture recording output');
    }
  });

  // 11. Knowledge Workspace Adapter (AppFlowy & OpenProject)
  await test('Knowledge Hub Adapter: Document blocks & cross-platform task synchronization', async () => {
    const res = await fetch('http://localhost:3001/api/riiqx/capabilities/project.sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: 'appflowy',
        payload: {
          action: 'sync_tasks',
          tasks: [
            { id: 'tsk_1', title: 'Publish YouTube Short: AI Winners', status: 'scheduled', priority: 'high' },
            { id: 'tsk_2', title: 'Record Voice Dub in Bengali', status: 'in_progress', priority: 'urgent' },
          ],
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || data.status !== 'completed') throw new Error(data.errorMessage || 'Knowledge sync failed');
    if (!data.result?.syncId || data.result.syncedTasksCount < 2) {
      throw new Error('Invalid knowledge sync result');
    }
  });

  console.log('\n============================================================');
  console.log(`🎉 TEST SUMMARY: ${passed}/${total} CAPABILITY TESTS PASSED CLEANLY!`);
  console.log('============================================================\n');

  if (passed !== total) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

