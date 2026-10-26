import { NextRequest, NextResponse } from 'next/server';
import { generateStoryboard, validateVideoOutput } from '@/lib/riiqx/creator-engine';
import { CreatorBrief } from '@/lib/riiqx/creator-types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let raw: Partial<CreatorBrief>;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload.' }, { status: 400 });
    }

    if (!raw || typeof raw !== 'object') {
      return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
    }

    if (!raw.topic || !raw.topic.trim()) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const brief: CreatorBrief = {
      id: raw.id || `brief_${Date.now()}`,
      topic: raw.topic.trim(),
      niche: raw.niche?.trim() || 'Tech & AI',
      targetAudience: raw.targetAudience?.trim() || 'General Audience',
      platform: raw.platform || 'instagram_reels',
      aspectRatio: raw.aspectRatio || '9:16',
      durationSeconds: raw.durationSeconds || 30,
      creationPreset: raw.creationPreset || 'viral_hook',
      creativeDirection: raw.creativeDirection || 'safe_relevant',
      brandVoice: raw.brandVoice || raw.tone || 'energetic',
      tone: raw.tone || raw.brandVoice || 'energetic',
      language: raw.language || 'en',
      goal: raw.goal || 'Educate and Engage',
      includeSubtitles: raw.includeSubtitles ?? true,
      backgroundMusic: raw.backgroundMusic || 'ambient_synth',
      trendingAudioVibe: raw.trendingAudioVibe || 'phonk',
      captionStyle: raw.captionStyle || 'mrbeast',
      callToAction: raw.callToAction || 'Follow @RIIQX for daily breakdowns',
      watermark: raw.watermark,
      voiceoverEnabled: raw.voiceoverEnabled ?? true,
      musicVolume: raw.musicVolume ?? 0.6,
      assets: raw.assets || [],
    };

    const storyboard = generateStoryboard(brief);
    const validation = validateVideoOutput(storyboard);

    return NextResponse.json({
      success: true,
      storyboard,
      validation,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Creator Studio error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
