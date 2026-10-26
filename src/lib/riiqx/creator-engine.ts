// =============================================================================
// RIIQX — AI Creator Studio 2.0 Synthesis & Storyboard Engine
// Multi-Asset Analysis • 10 Creation Presets • 9:16 / 1:1 / 16:9 Aspect Ratios
// Trend Assist Intelligence • Multilingual (EN / BN / HI) • Safe Margins Validator
// =============================================================================

import {
  CreatorBrief,
  CreatorStoryboard,
  ViralHook,
  VideoScene,
  CreationPreset,
  CreativeDirection,
  MediaAnalysisResult,
  TrendSuggestion,
  UploadedAsset,
  AspectRatio,
} from './creator-types';

// Preset Configuration Profiles
export const PRESET_PROFILES: Record<
  CreationPreset,
  {
    name: string;
    description: string;
    recommendedVibe: CreatorBrief['trendingAudioVibe'];
    recommendedCaptionStyle: CreatorBrief['captionStyle'];
    defaultTransition: VideoScene['transition'];
    pacingMultiplier: number; // 1.0 = normal, 0.8 = fast
  }
> = {
  viral_hook: {
    name: 'Viral Hook',
    description: 'Aggressive opening pattern interrupt, high-retention cuts',
    recommendedVibe: 'phonk',
    recommendedCaptionStyle: 'mrbeast',
    defaultTransition: 'cut',
    pacingMultiplier: 0.8,
  },
  cinematic: {
    name: 'Cinematic',
    description: 'Moody lighting, slow atmospheric zooms, crescendo score',
    recommendedVibe: 'cinematic',
    recommendedCaptionStyle: 'minimal',
    defaultTransition: 'fade',
    pacingMultiplier: 1.2,
  },
  podcast_clips: {
    name: 'Podcast Clips',
    description: 'Speaker-focused punchlines with synchronized karaoke subtitles',
    recommendedVibe: 'upbeat_lofi',
    recommendedCaptionStyle: 'karaoke',
    defaultTransition: 'cut',
    pacingMultiplier: 1.0,
  },
  storytelling: {
    name: 'Storytelling',
    description: '3-Act narrative structure: Conflict, Struggle, and Breakthrough',
    recommendedVibe: 'cinematic',
    recommendedCaptionStyle: 'minimal',
    defaultTransition: 'zoom',
    pacingMultiplier: 1.0,
  },
  product_promo: {
    name: 'Product Promo',
    description: 'Feature callouts, social proof badges, and clear action CTA',
    recommendedVibe: 'viral_pop',
    recommendedCaptionStyle: 'neon',
    defaultTransition: 'slide',
    pacingMultiplier: 0.9,
  },
  travel: {
    name: 'Travel & Vibe',
    description: 'Dynamic scenery transitions, location tags, and energetic beat',
    recommendedVibe: 'upbeat_lofi',
    recommendedCaptionStyle: 'minimal',
    defaultTransition: 'slide',
    pacingMultiplier: 1.0,
  },
  fashion: {
    name: 'Fashion & Style',
    description: 'Aesthetic speed-ramps, editorial typography, sleek rhythm',
    recommendedVibe: 'synthwave',
    recommendedCaptionStyle: 'minimal',
    defaultTransition: 'fade',
    pacingMultiplier: 1.1,
  },
  emotional: {
    name: 'Emotional',
    description: 'Intimate perspective, relatable truths, heartfelt message',
    recommendedVibe: 'cinematic',
    recommendedCaptionStyle: 'minimal',
    defaultTransition: 'fade',
    pacingMultiplier: 1.3,
  },
  educational: {
    name: 'Educational',
    description: 'Numbered steps, concept diagrams, concise mental models',
    recommendedVibe: 'upbeat_lofi',
    recommendedCaptionStyle: 'karaoke',
    defaultTransition: 'slide',
    pacingMultiplier: 0.95,
  },
  trending_news: {
    name: 'Trending News',
    description: 'Urgent breaking headline badge, ticker bar, immediate context',
    recommendedVibe: 'phonk',
    recommendedCaptionStyle: 'neon',
    defaultTransition: 'cut',
    pacingMultiplier: 0.85,
  },
};

// Hook Generator with Creative Directions and Multi-Language Support
export function generateHooks(
  topic: string,
  niche: string,
  lang: 'en' | 'bn' | 'hi' = 'en',
  preset: CreationPreset = 'viral_hook'
): ViralHook[] {
  const cleanTopic = (topic || 'AI & Automation').trim();
  const cleanNiche = (niche || 'Tech').trim();

  if (lang === 'bn') {
    return [
      {
        id: 'hk_safe_bn',
        type: 'pattern_interrupt',
        hookText: `এই একটা ভুল ${cleanTopic} নিয়ে আপনার পুরো সময় নষ্ট করছে!`,
        visualCue: 'দ্রুত জুম-ইন এবং স্ক্রিনে অ্যালার্ট আইকন গ্লিচ এফেক্ট',
        engagementScoreEstimate: 95,
        creativeDirection: 'safe_relevant',
      },
      {
        id: 'hk_energy_bn',
        type: 'bold_statistic',
        hookText: `${cleanNiche}-এর সেরা ১টি গোপন নিয়ম যা কেউ আপনাকে বলবে না।`,
        visualCue: 'বোল্ড টেক্সট কাউন্টার নিয়ন সায়ান রঙে স্কেল আপ হচ্ছে',
        engagementScoreEstimate: 93,
        creativeDirection: 'high_energy',
      },
      {
        id: 'hk_experiment_bn',
        type: 'curiosity_gap',
        hookText: `৯০% মানুষ ${cleanTopic} নিয়ে যা ভাবছে তা আসলে সম্পূর্ণ ভুল।`,
        visualCue: 'স্প্লিট-স্ক্রিন তুলনা: সনাতন পদ্ধতি বনাম নতুন অটোমেশন',
        engagementScoreEstimate: 90,
        creativeDirection: 'creative_experiment',
      },
    ];
  }

  if (lang === 'hi') {
    return [
      {
        id: 'hk_safe_hi',
        type: 'pattern_interrupt',
        hookText: `रुकिए! ${cleanTopic} करने का पुराना तरीका अब काम नहीं करेगा।`,
        visualCue: 'फास्ट ज़ूम-इन और स्क्रीन पर नियॉन ग्लिच अलर्ट',
        engagementScoreEstimate: 94,
        creativeDirection: 'safe_relevant',
      },
      {
        id: 'hk_energy_hi',
        type: 'bold_statistic',
        hookText: `${cleanNiche} का यह एक सीक्रेट आपका घंटों का समय बचाएगा।`,
        visualCue: 'बोल्ड 3D टाइपोग्राफी के साथ काउंटअप एनीमेशन',
        engagementScoreEstimate: 92,
        creativeDirection: 'high_energy',
      },
      {
        id: 'hk_experiment_hi',
        type: 'curiosity_gap',
        hookText: `क्या आप जानते हैं कि ${cleanTopic} में असली सफलता कैसे मिलती है?`,
        visualCue: 'स्प्लिट-स्क्रीन तुलना: साधारण तरीका बनाम प्रो सिस्टम',
        engagementScoreEstimate: 89,
        creativeDirection: 'creative_experiment',
      },
    ];
  }

  // English default with preset-tailored hooks
  if (preset === 'educational') {
    return [
      {
        id: 'hk_edu_1',
        type: 'pattern_interrupt',
        hookText: `The 3-step blueprint for ${cleanTopic.toLowerCase()} you need in 2026.`,
        visualCue: 'Numbered badge counter scaling up with crisp kinetic outline',
        engagementScoreEstimate: 94,
        creativeDirection: 'safe_relevant',
      },
      {
        id: 'hk_edu_2',
        type: 'curiosity_gap',
        hookText: `Why most tutorials on ${cleanTopic.toLowerCase()} leave out step two.`,
        visualCue: 'Split screen highlighting hidden workflow step',
        engagementScoreEstimate: 91,
        creativeDirection: 'creative_experiment',
      },
      {
        id: 'hk_edu_3',
        type: 'bold_statistic',
        hookText: `Master ${cleanTopic.toLowerCase()} in 30 seconds: here is the cheat code.`,
        visualCue: 'High-speed timer graphic with neon border glow',
        engagementScoreEstimate: 95,
        creativeDirection: 'high_energy',
      },
    ];
  }

  return [
    {
      id: 'hk_safe_en',
      type: 'pattern_interrupt',
      hookText: `Stop doing ${cleanTopic.toLowerCase()} the old way. Here is what actually works in 2026.`,
      visualCue: 'Fast zoom-in on an alert badge with subtle electric cyan text glitch',
      engagementScoreEstimate: 95,
      creativeDirection: 'safe_relevant',
    },
    {
      id: 'hk_energy_en',
      type: 'bold_statistic',
      hookText: `The #1 rule in ${cleanNiche} that top performers never talk about publicly.`,
      visualCue: 'Bold typography counter scaling up with electric neon glow',
      engagementScoreEstimate: 93,
      creativeDirection: 'high_energy',
    },
    {
      id: 'hk_experiment_en',
      type: 'curiosity_gap',
      hookText: `90% of creators get ${cleanTopic.toLowerCase()} completely wrong. Here is why.`,
      visualCue: 'Split-screen contrast showing common mistake vs optimal solution',
      engagementScoreEstimate: 91,
      creativeDirection: 'creative_experiment',
    },
  ];
}

// Media Assets Context Analysis Engine
export function analyzeMediaAssets(
  assets: UploadedAsset[],
  userTopic?: string
): MediaAnalysisResult {
  const count = assets.length;
  const videoCount = assets.filter((a) => a.type === 'video').length;
  const imageCount = assets.filter((a) => a.type === 'image').length;

  let detectedTheme = userTopic || 'Autonomous AI Workflows';
  let recommendedPreset: CreationPreset = 'viral_hook';
  let recommendedAudioVibe: CreatorBrief['trendingAudioVibe'] = 'phonk';
  let pacing: MediaAnalysisResult['pacing'] = 'rapid';

  if (assets.length > 0) {
    const first = assets[0];
    const nameLower = first.name.toLowerCase();

    if (nameLower.includes('travel') || nameLower.includes('vlog') || nameLower.includes('tour')) {
      recommendedPreset = 'travel';
      recommendedAudioVibe = 'upbeat_lofi';
      pacing = 'moderate';
    } else if (nameLower.includes('podcast') || nameLower.includes('interview') || nameLower.includes('talk')) {
      recommendedPreset = 'podcast_clips';
      recommendedAudioVibe = 'upbeat_lofi';
      pacing = 'moderate';
    } else if (nameLower.includes('cinematic') || nameLower.includes('movie') || nameLower.includes('broll')) {
      recommendedPreset = 'cinematic';
      recommendedAudioVibe = 'cinematic';
      pacing = 'cinematic';
    } else if (nameLower.includes('product') || nameLower.includes('demo') || nameLower.includes('app')) {
      recommendedPreset = 'product_promo';
      recommendedAudioVibe = 'viral_pop';
      pacing = 'rapid';
    } else if (nameLower.includes('news') || nameLower.includes('update') || nameLower.includes('alert')) {
      recommendedPreset = 'trending_news';
      recommendedAudioVibe = 'phonk';
      pacing = 'rapid';
    }
  }

  const visualSummary =
    count === 0
      ? 'No user media attached. Using procedural high-contrast Obsidian graphics.'
      : `${count} total assets (${videoCount} video clips, ${imageCount} photos). Automatically assigned to hook, proof, and closing scenes.`;

  return {
    detectedTheme,
    visualSummary,
    strongestOpeningAssetId: assets[0]?.id,
    recommendedPreset,
    recommendedAudioVibe,
    pacing,
    suggestedHooks: [
      `The fastest way to achieve ${detectedTheme} in 2026.`,
      `Stop wasting time: here is the real secret behind ${detectedTheme}.`,
      `What nobody tells you about mastering ${detectedTheme}.`,
    ],
  };
}

// Trend Assist Engine
export function generateTrendAssistIdeas(niche = 'Technology'): TrendSuggestion[] {
  return [
    {
      id: 'trend_1',
      niche,
      topic: 'Autonomous Agent Workflows vs Manual Prompting',
      source: 'verified_creator_matrix',
      freshness: 'Trending This Week',
      suggestedAngle: 'Contrast the time wasted manually copying prompts against fully automated agent loops.',
      creativeDirections: {
        safeRelevant: 'Step-by-step breakdown of how autonomous agents replace 3 daily repetitive tasks.',
        highEnergy: 'Fast-paced countdown: 3 tasks you should NEVER do manually in 2026.',
        creativeExperiment: 'Silent screen recording with ambient lofi audio revealing an agent completing a full goal.',
      },
      recommendedHashtags: ['#AIAgents', '#AutonomousAI', '#ProductivityHacks', '#TechTips', '#RIIQX'],
    },
    {
      id: 'trend_2',
      niche,
      topic: 'Online-First Cloud Intelligence vs Local Model Bottlenecks',
      source: 'ai_evergreen_analysis',
      freshness: 'High-Retention Evergreen',
      suggestedAngle: 'Explain why cloud-scale multi-model orchestration beats local laptop overheating.',
      creativeDirections: {
        safeRelevant: 'Objective benchmark showing speed and quality gains of online-first infrastructure.',
        highEnergy: 'Stop melting your laptop! Why cloud AI architecture is the only way to scale in 2026.',
        creativeExperiment: 'A side-by-side split screen showing a local model loading vs cloud instant execution.',
      },
      recommendedHashtags: ['#CloudAI', '#TechArchitecture', '#DeveloperTools', '#FutureOfTech'],
    },
    {
      id: 'trend_3',
      niche,
      topic: 'Building an Audience on Autopilot without Burning Out',
      source: 'verified_creator_matrix',
      freshness: 'Trending High-Demand',
      suggestedAngle: 'Reveal how creators post daily viral short-form content without editing for 4 hours every day.',
      creativeDirections: {
        safeRelevant: 'Case study of a creator publishing 30 reels a month using a 1-click synthesis studio.',
        highEnergy: 'The 10-minute weekly workflow that keeps your Instagram & Shorts feed active 24/7.',
        creativeExperiment: 'A transparent creator confession: "How I stopped editing videos manually forever".',
      },
      recommendedHashtags: ['#CreatorEconomy', '#ShortsAutopilot', '#ViralReels', '#ContentSystem'],
    },
  ];
}

// Master Storyboard Generator
export function generateStoryboard(brief: CreatorBrief): CreatorStoryboard {
  const safeTopic = (brief.topic || 'AI Automation').trim();
  const safeNiche = (brief.niche || 'Technology').trim();
  const safePlatform = brief.platform || 'instagram_reels';
  const aspectRatio: AspectRatio = brief.aspectRatio || '9:16';
  const duration = brief.durationSeconds || 30;
  const lang = brief.language || 'en';
  const preset = brief.creationPreset || 'viral_hook';
  const presetConfig = PRESET_PROFILES[preset] || PRESET_PROFILES.viral_hook;
  const captionStyle = brief.captionStyle || presetConfig.recommendedCaptionStyle;

  const assets = brief.assets || [];
  const analysis = analyzeMediaAssets(assets, safeTopic);

  const hooks = generateHooks(safeTopic, safeNiche, lang, preset);
  const selectedHook =
    hooks.find((h) => h.creativeDirection === brief.creativeDirection) || hooks[0];

  const sceneDuration = Math.round(duration / 5);

  const getAssetForScene = (idx: number) => {
    if (assets.length === 0) return undefined;
    return assets[idx % assets.length];
  };

  const a0 = getAssetForScene(0);
  const a1 = getAssetForScene(1);
  const a2 = getAssetForScene(2);
  const a3 = getAssetForScene(3);
  const a4 = getAssetForScene(4);

  // Multilingual scene content templates tailored to presets
  let scene2Text = 'THE PROBLEM: HIDDEN BOTTLENECKS';
  let scene2Script = `Most people waste hours trying to solve ${safeTopic} manually without structured automation.`;
  let scene3Text = 'THE SYSTEM: PROVEN BLUEPRINT';
  let scene3Script = `By implementing an autonomous pipeline, you eliminate 80% of repetitive guesswork instantly.`;
  let scene4Text = 'STEP 1: ACTIVATE AUTONOMOUS RULES';
  let scene4Script = `Configure your rules once, lock in your quality standards, and let the system execute in the background.`;

  if (lang === 'bn') {
    scene2Text = 'সমস্যা: সময় নষ্টকারী পদ্ধতি';
    scene2Script = `বেশিরভাগ মানুষ কোনো স্ট্রাকচার্ড সিস্টেম ছাড়া কাজ করতে গিয়ে প্রতিদিন ঘণ্টার পর ঘণ্টা অপচয় করেন।`;
    scene3Text = 'সমাধান: স্বয়ংক্রিয় ফ্রেমওয়ার্ক';
    scene3Script = `কিন্তু একটি সঠিক এন্ড-টু-এন্ড ফ্রেমওয়ার্ক ব্যবহার করলে আপনি এই পুরো কাজটি স্বয়ংক্রিয় করতে পারেন।`;
    scene4Text = 'প্রথম ধাপ: রুলস সেট করুন';
    scene4Script = `আপনার কোয়ালিটি রুলস একবার সেট করুন, আর সিস্টেম ব্যাকগ্রাউন্ডে নির্ভুলভাবে এক্সিকিউট করবে।`;
  } else if (lang === 'hi') {
    scene2Text = 'समस्या: समय की भारी बर्बादी';
    scene2Script = `ज्यादातर लोग बिना किसी स्ट्रक्चर्ड ऑटोमेशन के काम करते हैं और अपना कीमती समय गंवाते हैं।`;
    scene3Text = 'समाधान: प्रूवन ब्लूप्रिंट';
    scene3Script = `लेकिन सही एंड-टू-एंड पाइपलाइन से आप 80% दोहराव वाले काम को तुरंत खत्म कर सकते हैं।`;
    scene4Text = 'स्टेप 1: रूल्स एक्टिवेट करें';
    scene4Script = `अपने नियम एक बार सेट करें, और सिस्टम को बैकग्राउंड में निर्बाध रूप से काम करने दें।`;
  }

  const scenes: VideoScene[] = [
    {
      sceneNumber: 1,
      durationSeconds: sceneDuration,
      visualPrompt: a0
        ? `User Media [${a0.name}] (${a0.type.toUpperCase()}): High-impact viral hook overlay with dynamic kinetic typography.`
        : `High-impact neon title card: "${selectedHook.hookText}". Dark obsidian navy background.`,
      onScreenText: selectedHook.hookText.toUpperCase(),
      narrationScript: selectedHook.hookText,
      transition: presetConfig.defaultTransition,
      backgroundColor: '#070D1F',
      gradient: 'linear-gradient(135deg, #030712 0%, #0B132B 100%)',
      assetId: a0?.id,
      assetUrl: a0?.url,
      assetType: a0?.type,
      captionStyle,
      cropMode: 'cover',
    },
    {
      sceneNumber: 2,
      durationSeconds: sceneDuration,
      visualPrompt: a1
        ? `User Media [${a1.name}] (${a1.type.toUpperCase()}): Problem breakdown visual with dynamic text emphasis.`
        : `Problem breakdown scene highlighting common bottlenecks in ${safeTopic}.`,
      onScreenText: scene2Text,
      narrationScript: scene2Script,
      transition: 'zoom',
      backgroundColor: '#0A1128',
      gradient: 'linear-gradient(135deg, #070D1F 0%, #111C3A 100%)',
      assetId: a1?.id,
      assetUrl: a1?.url,
      assetType: a1?.type,
      captionStyle,
      cropMode: 'cover',
    },
    {
      sceneNumber: 3,
      durationSeconds: sceneDuration,
      visualPrompt: a2
        ? `User Media [${a2.name}] (${a2.type.toUpperCase()}): Breakthrough proof and system demonstration.`
        : `The breakthrough framework or key technique visualized with glowing node lines.`,
      onScreenText: scene3Text,
      narrationScript: scene3Script,
      transition: 'slide',
      backgroundColor: '#0D1734',
      gradient: 'linear-gradient(135deg, #0B132B 0%, #1E2A4A 100%)',
      assetId: a2?.id,
      assetUrl: a2?.url,
      assetType: a2?.type,
      captionStyle,
      cropMode: 'cover',
    },
    {
      sceneNumber: 4,
      durationSeconds: sceneDuration,
      visualPrompt: a3
        ? `User Media [${a3.name}] (${a3.type.toUpperCase()}): Step-by-step actionable demonstration with kinetic typography.`
        : `Step-by-step actionable demonstration with clean typography tags and metrics.`,
      onScreenText: scene4Text,
      narrationScript: scene4Script,
      transition: 'fade',
      backgroundColor: '#070D1F',
      gradient: 'linear-gradient(135deg, #030712 0%, #0D1734 100%)',
      assetId: a3?.id,
      assetUrl: a3?.url,
      assetType: a3?.type,
      captionStyle,
      cropMode: 'cover',
    },
    {
      sceneNumber: 5,
      durationSeconds: duration - sceneDuration * 4,
      visualPrompt: a4
        ? `User Media [${a4.name}] (${a4.type.toUpperCase()}): Outro call-to-action visual.`
        : `Outro card with pulsating RIIQX emblem and follow call-to-action.`,
      onScreenText: brief.callToAction || 'Follow @RIIQX for daily breakdowns',
      narrationScript: brief.callToAction || 'Follow @RIIQX for daily breakdowns',
      transition: 'zoom',
      backgroundColor: '#030712',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
      assetId: a4?.id,
      assetUrl: a4?.url,
      assetType: a4?.type,
      captionStyle,
      cropMode: 'cover',
    },
  ];

  const tagNiche = safeNiche.replace(/[^a-zA-Z0-9]/g, '');
  const tagTopic = safeTopic.replace(/[^a-zA-Z0-9]/g, '');
  const hashtags = [
    `#${tagNiche || 'Tech'}`,
    `#${tagTopic || 'AI'}`,
    '#ViralReels',
    '#Shorts',
    '#RIIQX',
    '#Automation',
    '#CreatorEconomy',
  ];

  return {
    id: `sb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    brief,
    title: `${safeTopic} — ${safePlatform === 'instagram_reels' ? 'Reel' : 'Short'}`,
    aspectRatio,
    selectedHook,
    alternativeHooks: hooks.filter((h) => h.id !== selectedHook.id),
    scenes,
    totalDurationSeconds: duration,
    caption: `${selectedHook.hookText} 🚀\n\nHere is the step-by-step breakdown on how to master ${safeTopic} without the fluff.\n\n👇 Drop your thoughts in the comments!\n\n${hashtags.join(' ')}`,
    hashtags,
    thumbnailPrompt: `Cinematic ${aspectRatio} thumbnail: "${selectedHook.hookText}" with glowing cyan and electric blue typography, dark navy background.`,
    createdAt: new Date().toISOString(),
    validationStatus: 'validated',
    assetsAttachedCount: assets.length,
    analysis,
  };
}

export function validateVideoOutput(storyboard: CreatorStoryboard): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (storyboard.totalDurationSeconds > 60) {
    errors.push('Reels and Shorts duration must not exceed 60 seconds.');
  }

  if (storyboard.scenes.length === 0) {
    errors.push('Storyboard must contain at least 1 scene.');
  }

  for (const scene of storyboard.scenes) {
    if (scene.durationSeconds < 2) {
      errors.push(`Scene ${scene.sceneNumber} duration is too short (< 2 seconds).`);
    }
    if (!scene.onScreenText || scene.onScreenText.trim().length === 0) {
      errors.push(`Scene ${scene.sceneNumber} missing on-screen text.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
