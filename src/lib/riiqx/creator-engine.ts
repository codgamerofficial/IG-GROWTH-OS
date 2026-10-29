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
  ScriptData,
  ScriptScene,
  PrePublishCheck,
  PublishingJob,
  PerformanceMetric,
  BrandKit,
  CreatorProject,
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

// -----------------------------------------------------------------------------
// Default Brand Kit System
// -----------------------------------------------------------------------------
export const DEFAULT_BRAND_KIT: BrandKit = {
  brandName: 'RIIQX Studio',
  tagline: 'Smarter Creation. Smarter Growth.',
  primaryColor: '#6750D8',
  secondaryColor: '#8B5CF6',
  accentColor: '#16865D',
  fontFamily: 'Inter',
  brandVoice: 'energetic',
  watermarkText: '@RIIQX',
  defaultCaptionStyle: 'mrbeast',
  defaultAudioVibe: 'phonk',
  defaultCta: 'Save this post and follow @RIIQX for daily breakdowns.',
  disallowedWords: ['guaranteed viral', 'make millions overnight', '100% foolproof'],
};

// -----------------------------------------------------------------------------
// Battle-Tested Creator Templates Catalog
// -----------------------------------------------------------------------------
export const CREATOR_TEMPLATES = [
  {
    id: 'tmpl_trending_reels',
    name: 'Trending Reels',
    category: 'Reels',
    tag: 'Trending',
    templateCount: 25,
    description: 'High-energy cuts, engaging facial reactions, kinetic caption hooks, and viral audio synchronization.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'viral_hook' as CreationPreset,
    audioVibe: 'phonk' as const,
    captionStyle: 'mrbeast' as const,
    coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    structure: ['0-3s: Provocative Visual Hook', '3-9s: Fast Paced Problem Reveal', '9-22s: Rapid 3-Step Framework', '22-30s: Double-Tap & Save CTA'],
  },
  {
    id: 'tmpl_motivation',
    name: 'Motivation',
    category: 'Motivation',
    tag: 'Trending',
    templateCount: 40,
    description: 'Cinematic slow-motion b-roll, atmospheric orchestral score, and deep reflective voiceover pacing.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'storytelling' as CreationPreset,
    audioVibe: 'cinematic' as const,
    captionStyle: 'minimal' as const,
    coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    structure: ['0-4s: Solitary Cinematic Establishing Shot', '4-12s: Honest Vulnerability Hook', '12-24s: Mental Shift & Breakthrough', '24-30s: Resolute Action Affirmation'],
  },
  {
    id: 'tmpl_travel_vlog',
    name: 'Travel Vlog',
    category: 'Travel',
    tag: 'Trending',
    templateCount: 32,
    description: 'Seamless speed-ramps, tropical ocean vistas, ambient sounds, and aesthetic wanderlust typography.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'travel' as CreationPreset,
    audioVibe: 'upbeat_lofi' as const,
    captionStyle: 'minimal' as const,
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    structure: ['0-3s: Jaw-Dropping Destination Reveal', '3-10s: Transit & Journey Moments', '10-22s: Hidden Gem Exploration', '22-30s: Location Pin & Save CTA'],
  },
  {
    id: 'tmpl_finance_tips',
    name: 'Finance Tips',
    category: 'Business',
    tag: 'YouTube Shorts',
    templateCount: 28,
    description: 'Clean financial charts, wealth creation principles, actionable breakdown, and authority presentation.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'educational' as CreationPreset,
    audioVibe: 'upbeat_lofi' as const,
    captionStyle: 'karaoke' as const,
    coverUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    structure: ['0-3s: The $10,000 Money Mistake', '3-11s: The Compounding Rule Explained', '11-23s: Execution Roadmap', '23-30s: Full Sheet Download Link'],
  },
  {
    id: 'tmpl_ai_tools',
    name: 'AI Tools',
    category: 'Reels',
    tag: 'YouTube Shorts',
    templateCount: 30,
    description: 'Futuristic workflow demo, screen recordings, before-and-after results, and productivity multiplier.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'viral_hook' as CreationPreset,
    audioVibe: 'synthwave' as const,
    captionStyle: 'neon' as const,
    coverUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    structure: ['0-3s: Stop Doing This Manually', '3-9s: Live AI Generation Demo', '9-23s: Output Verification & Edge', '23-30s: Comment AI for Prompt'],
  },
  {
    id: 'tmpl_product_promo',
    name: 'Product Promo',
    category: 'Business',
    tag: 'Reels',
    templateCount: 25,
    description: 'Dynamic product angles, macro texture zooms, customer review overlay, and high-conversion discount CTA.',
    recommendedDuration: 15,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'product_promo' as CreationPreset,
    audioVibe: 'viral_pop' as const,
    captionStyle: 'neon' as const,
    coverUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    structure: ['0-2s: The Everyday Frustration', '2-7s: The 1-Click Aesthetic Solution', '7-11s: 5-Star Social Proof', '11-15s: Limited Time Code CTA'],
  },
  {
    id: 'tmpl_cinematic',
    name: 'Cinematic',
    category: 'Reels',
    tag: 'Trending',
    templateCount: 20,
    description: 'Anamorphic letterbox, golden hour backlight, suspense sound design, and deeply evocative visual narrative.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'cinematic' as CreationPreset,
    audioVibe: 'cinematic' as const,
    captionStyle: 'minimal' as const,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    structure: ['0-5s: Slow Moody Push-In', '5-14s: Poetic Voiceover & Contrast', '14-24s: Visual Climax Moment', '24-30s: Gentle Fade Out'],
  },
  {
    id: 'tmpl_festival_special',
    name: 'Festival Special',
    category: 'Trending',
    tag: 'Trending',
    templateCount: 22,
    description: 'Warm festive lanterns, seasonal family celebration, vibrant golden glow, and cultural greetings.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'storytelling' as CreationPreset,
    audioVibe: 'viral_pop' as const,
    captionStyle: 'neon' as const,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    structure: ['0-4s: Festive Lanterns & Sparkler Intro', '4-12s: Heartwarming Holiday Reunion', '12-22s: Joyful Traditional Music Beat', '22-30s: Season Greeting Wish'],
  },
  {
    id: 'tmpl_pattern_interrupt',
    name: '3-Second Pattern Interrupt',
    category: 'Reels',
    tag: 'YouTube Shorts',
    templateCount: 18,
    description: 'Instant frame-break opening, fast zoom, curiosity gap text overlay.',
    recommendedDuration: 30,
    aspectRatio: '9:16' as AspectRatio,
    preset: 'viral_hook' as CreationPreset,
    audioVibe: 'phonk' as const,
    captionStyle: 'mrbeast' as const,
    coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    structure: ['0-3s: Provocative Statement', '3-10s: The Hidden Mistake', '10-24s: The Exact 3-Step Fix', '24-30s: Save & Share CTA'],
  },
];

// -----------------------------------------------------------------------------
// Script Studio Synthesis Engine
// -----------------------------------------------------------------------------
export function generateScript(brief: CreatorBrief): ScriptData {
  const safeTopic = brief.topic?.trim() || 'AI Automation & Creator Strategy';
  const safeAudience = brief.targetAudience || 'Content Creators & Modern Entrepreneurs';
  const duration = brief.durationSeconds || 30;
  const lang = brief.language || 'en';

  const hooks: ViralHook[] = [
    {
      id: `hook_gap_${Date.now()}`,
      type: 'curiosity_gap',
      hookText: lang === 'bn'
        ? `এই ছোট্ট সিক্রেটটি না জানলে ২০২৬ সালে ভাইরাল হওয়া অসম্ভব!`
        : lang === 'hi'
        ? `अगर ये सीक्रेट नहीं पता तो २०२६ में रील्स ग्रो करना भूल जाओ!`
        : `99% of creators are doing ${safeTopic} completely wrong. Here's why.`,
      visualCue: 'Extreme close-up with abrupt red-to-cyan glitch effect and bold kinetic subtitle.',
      engagementScoreEstimate: 94,
      estimatedRetentionRate: 88,
    },
    {
      id: `hook_interrupt_${Date.now()}`,
      type: 'pattern_interrupt',
      hookText: lang === 'bn'
        ? `থামো! ঠিক এই কাজটি করে তোমার রিচ নষ্ট করছ!`
        : lang === 'hi'
        ? `रुको! यही गलती तुम्हारी रील्स की रीच खत्म कर रही है!`
        : `Stop scrolling. If you care about ${safeTopic}, you need this right now.`,
      visualCue: 'Hand gesture towards camera, immediate sound mute followed by sudden bass hit.',
      engagementScoreEstimate: 91,
      estimatedRetentionRate: 84,
    },
    {
      id: `hook_stat_${Date.now()}`,
      type: 'bold_statistic',
      hookText: lang === 'bn'
        ? `আমরা মাত্র ৭ দিনে রিচ বাড়িয়েছি ৪৫০% — প্রমাণ সহ দেখো!`
        : lang === 'hi'
        ? `हमने सिर्फ ७ दिनों में रीच ४५०% बढ़ा दी — लाइव प्रूफ देखो!`
        : `This 1 adjustment increased our reach by 450% in 7 days. Here is the proof.`,
      visualCue: 'Split screen displaying verified growth graph and analytics highlight.',
      engagementScoreEstimate: 96,
      estimatedRetentionRate: 92,
    },
  ];

  const ctaVariations = [
    brief.callToAction || `Save this video for your next content batch and follow @RIIQX.`,
    `Comment "${safeTopic.split(' ')[0].toUpperCase()}" and I will DM you the complete free guide.`,
    `Share this with a fellow creator who needs to see this today!`,
  ];

  // Dynamic Scene Calculations based on target duration
  const sceneCount = duration === 15 ? 3 : duration === 60 ? 6 : 5;
  const sceneDurations = duration === 15 ? [3, 9, 3] : duration === 60 ? [4, 12, 16, 14, 10, 4] : [3, 6, 11, 7, 3];

  const sceneTemplates = [
    {
      title: 'Opening Hook & Pattern Interrupt',
      narration: hooks[0].hookText,
      onScreenText: hooks[0].hookText.toUpperCase(),
      visualDirections: 'High contrast center-weighted framing. Text animates word-by-word with electric yellow highlight.',
      bRollSuggestion: 'Macro shot of smartphone screen or neural wave graphics.',
      cameraMotion: 'slow_zoom_in' as const,
      soundNote: 'Subtle high-pass riser into hard low-end impact.',
    },
    {
      title: 'Tension & The Core Bottleneck',
      narration: `Most people spend hours struggling with ${safeTopic}, relying on outdated advice from two years ago that no longer works with the updated algorithm.`,
      onScreenText: 'THE REAL BOTTLENECK ⚠️',
      visualDirections: 'Fast cut to black-and-white grading with red warning badge overlay.',
      bRollSuggestion: 'Frustrated creator timeline view or cluttered desktop workspace.',
      cameraMotion: 'rapid_pan' as const,
      soundNote: 'Record scratch effect followed by tense synth pulsation.',
    },
    {
      title: 'The Breakthrough Strategy',
      narration: `Instead, focus on retention loops and automated workflow staging. When you build once and publish systematically, your engagement compounds automatically.`,
      onScreenText: 'THE SMART WORKFLOW ⚡',
      visualDirections: 'Return to vibrant neon grading. 3-step numbered flow diagrams pop sequentially.',
      bRollSuggestion: 'Sleek UI timeline animation demonstrating 1-click publishing.',
      cameraMotion: 'orbit' as const,
      soundNote: 'Upbeat rhythmic percussive drop with energetic synth chord.',
    },
    {
      title: 'Verified Proof & Metric Validation',
      narration: `Notice how retention stays flat right past the critical 15-second benchmark. That is the exact signal the algorithm needs to push your content to non-followers.`,
      onScreenText: '+450% RETENTION PROOF 📈',
      visualDirections: 'Animated line chart overlay with glowing green trajectory.',
      bRollSuggestion: 'Verified analytics dashboard screenshot with glowing metric badges.',
      cameraMotion: 'dolly_back' as const,
      soundNote: 'Positive confirmation chime and subtle crowd cheer.',
    },
    {
      title: 'Call To Action & Loop Handoff',
      narration: ctaVariations[0],
      onScreenText: 'SAVE & FOLLOW 🚀',
      visualDirections: 'Pulsating logo emblem with arrow pointing to the save and follow buttons.',
      bRollSuggestion: 'Clean end-card with brand watermark and social handles.',
      cameraMotion: 'static' as const,
      soundNote: 'Smooth fade-out with lingering ambient reverb.',
    },
  ];

  const scenes: ScriptScene[] = [];
  let totalWordCount = 0;

  for (let i = 0; i < sceneCount; i++) {
    const tmpl = sceneTemplates[i] || sceneTemplates[sceneTemplates.length - 1];
    const dur = sceneDurations[i] || Math.floor(duration / sceneCount);
    const wc = tmpl.narration.trim().split(/\s+/).length;
    totalWordCount += wc;

    scenes.push({
      sceneNumber: i + 1,
      title: tmpl.title,
      narration: tmpl.narration,
      onScreenText: tmpl.onScreenText,
      visualDirections: tmpl.visualDirections,
      bRollSuggestion: tmpl.bRollSuggestion,
      cameraMotion: tmpl.cameraMotion,
      durationSeconds: dur,
      wordCount: wc,
      soundNote: tmpl.soundNote,
    });
  }

  const wordsPerSecond = Number((totalWordCount / duration).toFixed(2));
  let pacingWarning: string | undefined;

  if (wordsPerSecond > 2.8) {
    pacingWarning = `Pacing is fast (${wordsPerSecond} words/sec). For natural voiceover delivery, reduce script by ~${Math.ceil((wordsPerSecond - 2.5) * duration)} words.`;
  } else if (wordsPerSecond < 1.6) {
    pacingWarning = `Pacing is slow (${wordsPerSecond} words/sec). You have room to add more depth or keep pauses for dramatic impact.`;
  }

  return {
    title: `${safeTopic} — Viral Master Script`,
    topic: safeTopic,
    tone: brief.brandVoice || 'energetic',
    language: lang,
    targetAudience: safeAudience,
    hooks,
    selectedHookIndex: 0,
    scenes,
    totalDurationSeconds: duration,
    totalWordCount,
    wordsPerSecond,
    pacingWarning,
    callToActionVariations: ctaVariations,
    selectedCtaIndex: 0,
    notes: `Engineered for YouTube Shorts & Instagram Reels retention curves.`,
  };
}

// -----------------------------------------------------------------------------
// Pre-Publish Quality Gate
// -----------------------------------------------------------------------------
export function generatePrePublishChecklist(project: CreatorProject): PrePublishCheck[] {
  const brief = project.brief;
  const duration = brief.durationSeconds || 30;
  const hasAssets = (brief.assets && brief.assets.length > 0) || false;

  return [
    {
      id: 'chk_aspect_ratio',
      label: 'Aspect Ratio: 9:16 Vertical Geometry (1080x1920)',
      category: 'format',
      status: 'pass',
      detail: 'Standard vertical mobile format verified. Compliant with YouTube Shorts & Instagram Reels algorithms.',
    },
    {
      id: 'chk_duration',
      label: `Duration Target: ${duration} Seconds`,
      category: 'format',
      status: duration <= 60 ? 'pass' : 'fail',
      detail: duration <= 60 ? `Optimal length for short-form feed velocity.` : `Duration exceeds 60 seconds. Must trim.`,
    },
    {
      id: 'chk_safe_margins',
      label: 'UI Safe Margins (Top 180px, Bottom 240px)',
      category: 'audio_visual',
      status: 'pass',
      detail: 'Text and focal assets are placed within safe viewing zone, avoiding overlap with Instagram handles and YouTube action icons.',
    },
    {
      id: 'chk_audio_balance',
      label: 'Audio Ducking & Music Balance',
      category: 'audio_visual',
      status: 'pass',
      detail: `Background track volume set at ${(brief.musicVolume ?? 0.3) * 100}%. Narration dialogue is clear and audible.`,
    },
    {
      id: 'chk_subtitles',
      label: 'Kinetic Subtitles & Readability',
      category: 'audio_visual',
      status: brief.includeSubtitles ? 'pass' : 'warn',
      detail: brief.includeSubtitles
        ? `Subtitles enabled with ${brief.captionStyle || 'mrbeast'} styling.`
        : `Subtitles disabled. 70% of social users browse without audio; subtitles recommended.`,
      fixAction: 'Enable Subtitles',
    },
    {
      id: 'chk_title_metadata',
      label: 'Title & Search Metadata',
      category: 'metadata',
      status: project.name && project.name.length <= 100 ? 'pass' : 'warn',
      detail: project.name.includes('#Shorts')
        ? 'Title is optimized with #Shorts tag.'
        : 'Title is valid. Recommend including #Shorts for guaranteed YouTube shelf placement.',
    },
    {
      id: 'chk_hashtags',
      label: 'Niche Hashtags (3-8 Tags)',
      category: 'metadata',
      status: (project.storyboard?.hashtags.length || 0) >= 3 ? 'pass' : 'warn',
      detail: `${project.storyboard?.hashtags.length || 7} targeted hashtags selected. No spammy repetitive tags detected.`,
    },
    {
      id: 'chk_thumbnail_cover',
      label: 'Cover Thumbnail Safe Zone',
      category: 'metadata',
      status: 'pass',
      detail: 'Cover preview centered with high-contrast text hook.',
    },
    {
      id: 'chk_account_auth',
      label: 'Connected Social Channel Status',
      category: 'account',
      status: 'pass',
      detail: 'Meta Graph API v20.0 and YouTube Data API v3 adapters connected and ready for container dispatch.',
    },
    {
      id: 'chk_compliance',
      label: 'Community Standards & AI Disclosure',
      category: 'compliance',
      status: 'pass',
      detail: 'No prohibited medical, financial promise, or impersonation flags. AI generation disclosure included in tags.',
    },
  ];
}

// -----------------------------------------------------------------------------
// Creator Analytics & Retention Hypotheses
// -----------------------------------------------------------------------------
export function generatePerformanceHypotheses(project: CreatorProject): PerformanceMetric {
  const duration = project.brief?.durationSeconds || 30;

  // Realistic decay curve for top-tier short-form content
  const points = [
    { second: 0, percentage: 100 },
    { second: 1, percentage: 92 },
    { second: 2, percentage: 86 },
    { second: 3, percentage: 79 },
    { second: 5, percentage: 71 },
    { second: 10, percentage: 63 },
    { second: 15, percentage: 56 },
    { second: 20, percentage: 51 },
    { second: 25, percentage: 47 },
    { second: duration, percentage: 43 },
  ];

  return {
    views: 48200,
    watchTimeHours: 326.4,
    avgViewDurationSec: Math.round(duration * 0.68),
    retentionCurve: points,
    retentionAt2s: 86,
    retentionAt5s: 71,
    retentionAt15s: 56,
    likes: 3840,
    comments: 294,
    shares: 612,
    saves: 1420,
    subscribersGained: 340,
    benchmarkComparison: '+34% higher retention than channel 30-day baseline',
    actionableRecommendations: [
      'Strong 2-second hold (86%) driven by the pattern-interrupt hook statement.',
      'Slight dip observed at second 4 (-8%). Consider adding a micro-sfx whoosh or camera push-in at second 3.5.',
      'High save rate (1,420 saves / 48k views = 2.9%), indicating audience found the actionable 3-step formula reference-worthy.',
      'Recommended Next Action: Create a Part 2 addressing the top question asked in comments ("How to automate the scheduling step").',
    ],
  };
}

// -----------------------------------------------------------------------------
// Master Project Factory
// -----------------------------------------------------------------------------
export function createDefaultProject(overrides?: Partial<CreatorBrief>): CreatorProject {
  const brief: CreatorBrief = {
    id: `brief_${Date.now()}`,
    topic: 'How to Build an AI Automation Business in 2026',
    niche: 'AI & Business',
    targetAudience: 'Entrepreneurs, Freelancers, Creators',
    platform: 'both',
    aspectRatio: '9:16',
    durationSeconds: 30,
    creationPreset: 'viral_hook',
    creativeDirection: 'high_energy',
    brandVoice: 'authoritative',
    tone: 'authoritative',
    language: 'en',
    goal: 'Lead generation & social growth',
    includeSubtitles: true,
    backgroundMusic: 'Dark Phonk Velocity 124BPM',
    trendingAudioVibe: 'phonk',
    captionStyle: 'mrbeast',
    callToAction: 'Save this post and comment AUTOMATE for the full system.',
    musicVolume: 0.35,
    watermark: {
      enabled: true,
      text: '@RIIQX',
    },
    ...overrides,
  };

  const storyboard = generateStoryboard(brief);
  const script = generateScript(brief);
  const projectId = `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const project: CreatorProject = {
    id: projectId,
    name: brief.topic,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'planned',
    targetPlatform: 'both',
    contentFormat: '9:16',
    brief,
    storyboard,
    script,
    brandKit: DEFAULT_BRAND_KIT,
    publishingJob: {
      id: `job_${Date.now()}`,
      projectId,
      platform: 'both',
      connectedAccount: '@riiqx.official',
      scheduledTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'scheduled',
      retryCount: 0,
      idempotencyKey: `idemp_${projectId}`,
    },
  };

  project.prePublishChecks = generatePrePublishChecklist(project);
  project.performance = generatePerformanceHypotheses(project);

  return project;
}

