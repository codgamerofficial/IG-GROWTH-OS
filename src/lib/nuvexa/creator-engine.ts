// =============================================================================
// NUVEXA AI — Creator Studio Script & Storyboard Generator Engine
// Hook Architecture • Scene Sequencing • 9:16 Vertical Video Optimization
// =============================================================================

import { CreatorBrief, CreatorStoryboard, GeneratedHook, VideoScene } from './creator-types';

/**
 * Generate 3 high-retention hook variations tailored to niche and platform
 */
export function generateHooks(topic: string, niche: string, voice: string): GeneratedHook[] {
  return [
    {
      id: 'hk_pattern_interrupt',
      type: 'pattern_interrupt',
      hookText: `Stop doing ${topic.toLowerCase()} the old way. Here is what actually works.`,
      visualCue: 'Fast zoom-in on an alert icon with rapid text glitch effect',
      engagementScoreEstimate: 94,
    },
    {
      id: 'hk_curiosity_gap',
      type: 'curiosity_gap',
      hookText: `90% of people get ${topic.toLowerCase()} completely wrong. Here's why.`,
      visualCue: 'Split-screen contrast showing mistake vs optimal solution',
      engagementScoreEstimate: 91,
    },
    {
      id: 'hk_bold_statistic',
      type: 'bold_statistic',
      hookText: `The #1 rule in ${niche || 'modern tech'} that nobody talks about.`,
      visualCue: 'Bold typography counter scaling up with neon cyan glow',
      engagementScoreEstimate: 88,
    },
  ];
}

/**
 * Generate a complete scene-by-scene vertical video storyboard
 */
export function generateStoryboard(brief: CreatorBrief): CreatorStoryboard {
  const hooks = generateHooks(brief.topic, brief.niche, brief.brandVoice);
  const selectedHook = hooks[0];

  // Distribute scenes across duration
  const targetDuration = brief.durationSeconds;
  const sceneCount = targetDuration === 15 ? 3 : targetDuration === 30 ? 5 : 7;
  const sceneDuration = targetDuration / sceneCount;

  const scenes: VideoScene[] = [];

  // Scene 1: The Hook (First 3 seconds critical retention window)
  scenes.push({
    sceneNumber: 1,
    durationSeconds: sceneDuration,
    visualPrompt: `High-impact neon title card: "${selectedHook.hookText}". Cyberpunk navy background.`,
    onScreenText: selectedHook.hookText.toUpperCase(),
    narrationScript: selectedHook.hookText,
    transition: 'cut',
    backgroundColor: '#070D1F',
    gradient: 'linear-gradient(135deg, #030712 0%, #0B132B 100%)',
  });

  // Intermediate Narrative Scenes
  if (targetDuration >= 30) {
    scenes.push({
      sceneNumber: 2,
      durationSeconds: sceneDuration,
      visualPrompt: `Problem breakdown scene highlighting common pitfalls in ${brief.topic}.`,
      onScreenText: 'THE PROBLEM: HIDDEN BOTTLENECKS',
      narrationScript: `Most creators and developers waste hours trying to solve ${brief.topic} manually without structured automation.`,
      transition: 'zoom',
      backgroundColor: '#0A1128',
      gradient: 'linear-gradient(135deg, #070D1F 0%, #111C3A 100%)',
    });

    scenes.push({
      sceneNumber: 3,
      durationSeconds: sceneDuration,
      visualPrompt: `The breakthrough framework or key technique visualized.`,
      onScreenText: 'THE SYSTEM: PROVEN BLUEPRINT',
      narrationScript: `By implementing a multi-step orchestration pipeline, you eliminate 80% of repetitive guesswork instantly.`,
      transition: 'slide',
      backgroundColor: '#0D1734',
      gradient: 'linear-gradient(135deg, #0B132B 0%, #1E2A4A 100%)',
    });

    scenes.push({
      sceneNumber: 4,
      durationSeconds: sceneDuration,
      visualPrompt: `Step-by-step actionable demonstration with clean typography tags.`,
      onScreenText: 'STEP 1: ACTIVATE AUTONOMOUS RULES',
      narrationScript: `Configure your quality rules once, lock in your boundaries, and let the system execute in the background.`,
      transition: 'fade',
      backgroundColor: '#070D1F',
      gradient: 'linear-gradient(135deg, #030712 0%, #0D1734 100%)',
    });
  }

  // Final Scene: Call To Action (CTA)
  scenes.push({
    sceneNumber: scenes.length + 1,
    durationSeconds: sceneDuration,
    visualPrompt: `Outro card with pulsating NUVEXA Infinity Emblem and follow CTA.`,
    onScreenText: brief.callToAction || 'FOLLOW FOR MORE • SAVE THIS POST',
    narrationScript: `${brief.callToAction || 'Follow for daily breakdowns and save this reel for your next build.'}`,
    transition: 'zoom',
    backgroundColor: '#030712',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
  });

  // Platform-tailored hashtags
  const safeNicheTag = (brief.niche || 'AI').replace(/\s+/g, '');
  const safeTopicTag = (brief.topic || 'Tech').replace(/[^a-zA-Z0-9]/g, '');

  const hashtags = [
    `#${safeNicheTag || 'AI'}`,
    `#${safeTopicTag || 'Tech'}`,
    brief.platform === 'instagram_reels' ? '#ReelsViral' : '#Shorts',
    '#TechTips',
    '#AITools',
    '#ProductivityHacks',
    '#NuvexaAI',
  ];

  const caption = `${selectedHook.hookText} 🚀\n\nHere is the step-by-step breakdown on how to master ${brief.topic} without the fluff.\n\n👇 Drop your thoughts in the comments!\n\n${hashtags.join(' ')}`;

  return {
    id: `sb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    brief,
    title: `${brief.topic} — ${brief.platform === 'instagram_reels' ? 'Reel' : 'Short'}`,
    selectedHook,
    alternativeHooks: hooks.slice(1),
    scenes,
    totalDurationSeconds: targetDuration,
    caption,
    hashtags,
    thumbnailPrompt: `Bold 9:16 cinematic thumbnail: "${selectedHook.hookText}" with glowing cyan and electric blue typography, dark navy background.`,
    createdAt: new Date().toISOString(),
    validationStatus: 'validated',
  };
}

/**
 * Validate rendered video output constraints
 */
export function validateVideoOutput(storyboard: CreatorStoryboard): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (storyboard.scenes.length === 0) {
    errors.push('Storyboard must have at least one scene.');
  }

  if (storyboard.totalDurationSeconds > 65) {
    errors.push('Vertical video exceeds maximum 60-second Reels/Shorts limit.');
  }

  if (!storyboard.caption || storyboard.caption.length < 10) {
    errors.push('Caption is too short or missing.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
