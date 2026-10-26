import { NextRequest, NextResponse } from 'next/server';
import { generateStoryboard, validateVideoOutput } from '@/lib/nuvexa/creator-engine';
import { CreatorBrief } from '@/lib/nuvexa/creator-types';

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
      durationSeconds: raw.durationSeconds || 30,
      brandVoice: raw.brandVoice || 'authoritative',
      goal: raw.goal || 'Educate and Engage',
      includeSubtitles: raw.includeSubtitles ?? true,
      backgroundMusic: raw.backgroundMusic || 'ambient_synth',
      callToAction: raw.callToAction || 'Follow for daily breakdowns',
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
