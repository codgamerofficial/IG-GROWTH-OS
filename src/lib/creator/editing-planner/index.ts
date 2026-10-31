// =============================================================================
// RIIQX Creator Studio — AI Editing Planner
// Prompt-to-Edit Plan Translation • Style Mapping • Incremental Revision Engine
// Supports Bengali & Multilingual Directives • Action Sequence Decomposition
// =============================================================================

import { EditingPlan, EditingStyle, ColorFilter, CaptionPreset, EditingAction } from '../types';

/**
 * Parses natural language prompt into concrete editing style and parameters
 */
export function createEditingPlanFromPrompt(
  prompt: string,
  targetDurationSeconds = 30,
  currentPlan?: EditingPlan
): EditingPlan {
  const p = prompt.toLowerCase();

  // Style inference
  let style: EditingStyle = currentPlan?.style || 'viral_fast';
  if (p.includes('cinematic') || p.includes('মুভি') || p.includes('ফিল্ম')) {
    style = 'cinematic';
  } else if (p.includes('minimal') || p.includes('মিনিমাল')) {
    style = 'minimal';
  } else if (p.includes('aesthetic') || p.includes('এস্থেটিক')) {
    style = 'aesthetic';
  } else if (p.includes('podcast') || p.includes('পডকাস্ট')) {
    style = 'podcast_clip';
  } else if (p.includes('vlog') || p.includes('ভ্লগ')) {
    style = 'vlog';
  } else if (p.includes('product') || p.includes('প্রোডাক্ট')) {
    style = 'product_showcase';
  }

  // Filter inference
  let selectedFilter: ColorFilter = currentPlan?.selectedFilter || 'teal_orange';
  if (p.includes('noir') || p.includes('black and white') || p.includes('সাদাকালো')) {
    selectedFilter = 'noir';
  } else if (p.includes('cyberpunk') || p.includes('neon') || p.includes('নিয়ম')) {
    selectedFilter = 'cyberpunk';
  } else if (p.includes('vintage') || p.includes('retro') || p.includes('পুরনো')) {
    selectedFilter = 'vintage';
  } else if (p.includes('golden') || p.includes('warm') || p.includes('সূর্যাস্ত')) {
    selectedFilter = 'golden_hour';
  } else if (p.includes('clean') || p.includes('natural') || p.includes('ন্যাচারাল')) {
    selectedFilter = 'clean';
  }

  // Speed inference
  let speedMultiplier = currentPlan?.speedMultiplier || 1.0;
  if (p.includes('fast') || p.includes('2x') || p.includes('দ্রুত')) {
    speedMultiplier = 1.5;
  } else if (p.includes('slow motion') || p.includes('slow') || p.includes('স্লো')) {
    speedMultiplier = 0.5;
  }

  // Caption preset inference
  let captionPreset: CaptionPreset = currentPlan?.captionPreset || 'mrbeast';
  if (p.includes('minimal subtitles') || p.includes('simple subtitles')) {
    captionPreset = 'minimal';
  } else if (p.includes('karaoke') || p.includes('bounce')) {
    captionPreset = 'karaoke';
  } else if (p.includes('yellow') || p.includes('bold')) {
    captionPreset = 'bold_yellow';
  } else if (p.includes('neon')) {
    captionPreset = 'neon_glow';
  }

  const actions: EditingAction[] = [];

  // Action 1: 9:16 Vertical reframing
  actions.push({
    type: 'crop_vertical',
    parameters: { targetRatio: '9:16', standard: '1080x1920' },
    explanation: 'Crop and center frame to 9:16 vertical for Instagram Reels & YouTube Shorts.',
  });

  // Action 2: Color LUT / Filter
  actions.push({
    type: 'filter',
    parameters: { filter: selectedFilter },
    explanation: `Apply ${selectedFilter.replace('_', ' ')} color grade for cinematic contrast.`,
  });

  // Action 3: Speed adjust
  if (speedMultiplier !== 1.0) {
    actions.push({
      type: 'speed',
      parameters: { speed: speedMultiplier },
      explanation: `Set playback velocity to ${speedMultiplier}x speed.`,
    });
  }

  // Action 4: Kinetic Subtitles
  actions.push({
    type: 'subtitles',
    parameters: { preset: captionPreset },
    explanation: `Render animated ${captionPreset} captions with high readability safe-margins.`,
  });

  return {
    id: `plan_${Date.now()}`,
    userPrompt: prompt,
    style,
    targetDurationSeconds,
    targetAspectRatio: '9:16',
    selectedFilter,
    speedMultiplier,
    captionPreset,
    language: p.includes('bengali') || p.includes('বাংলা') ? 'bn' : 'en',
    actions,
    version: currentPlan ? currentPlan.version + 1 : 1,
    createdAt: new Date().toISOString(),
  };
}

