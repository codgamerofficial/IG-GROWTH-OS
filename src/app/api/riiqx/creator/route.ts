// =============================================================================
// RIIQX — Creator Studio & Project Persistence API Gateway
// Multi-Device Synchronized Workspace (Web + Mobile Parity)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { generateStoryboard, validateVideoOutput } from '@/lib/riiqx/creator-engine';
import { CreatorBrief, CreatorProject } from '@/lib/riiqx/creator-types';
import {
  listCreatorProjects,
  saveCreatorProject,
  saveAllCreatorProjects,
  deleteCreatorProject,
  getCreatorProject,
  getStoredBrandKit,
  saveStoredBrandKit,
} from '@/lib/riiqx/creator-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const project = getCreatorProject(id);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, project });
    }

    if (searchParams.get('type') === 'brand_kit') {
      const kit = getStoredBrandKit();
      return NextResponse.json({ success: true, brandKit: kit });
    }

    const projects = listCreatorProjects();
    return NextResponse.json({
      success: true,
      projects,
      total: projects.length,
      activeProjectsCount: projects.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve creator projects';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid or missing JSON payload.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Request body must be a JSON object.' }, { status: 400 });
    }

    // 1. Save or Update Single Project
    if (body.action === 'save_project' && body.project) {
      const saved = saveCreatorProject(body.project as CreatorProject);
      return NextResponse.json({ success: true, project: saved });
    }

    // 2. Synchronize Batch of Projects
    if (body.action === 'sync_projects' && Array.isArray(body.projects)) {
      saveAllCreatorProjects(body.projects as CreatorProject[]);
      return NextResponse.json({
        success: true,
        projects: listCreatorProjects(),
        total: listCreatorProjects().length,
      });
    }

    // 3. Delete Project Action
    if (body.action === 'delete_project' && body.id) {
      const deleted = deleteCreatorProject(body.id);
      return NextResponse.json({ success: deleted });
    }

    // 3.5 Brand Kit Save
    if (body.action === 'save_brand_kit' && body.brandKit) {
      const saved = saveStoredBrandKit(body.brandKit);
      return NextResponse.json({ success: true, brandKit: saved });
    }

    // 4. Default: Storyboard & Script Generation
    if (!body.topic || !body.topic.trim()) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const brief: CreatorBrief = {
      id: body.id || `brief_${Date.now()}`,
      topic: body.topic.trim(),
      niche: body.niche?.trim() || 'Tech & AI',
      targetAudience: body.targetAudience?.trim() || 'General Audience',
      platform: body.platform || 'instagram_reels',
      aspectRatio: body.aspectRatio || '9:16',
      durationSeconds: body.durationSeconds || 30,
      creationPreset: body.creationPreset || 'viral_hook',
      creativeDirection: body.creativeDirection || 'safe_relevant',
      brandVoice: body.brandVoice || body.tone || 'energetic',
      tone: body.tone || body.brandVoice || 'energetic',
      language: body.language || 'en',
      goal: body.goal || 'Educate and Engage',
      includeSubtitles: body.includeSubtitles ?? true,
      backgroundMusic: body.backgroundMusic || 'ambient_synth',
      trendingAudioVibe: body.trendingAudioVibe || 'phonk',
      captionStyle: body.captionStyle || 'mrbeast',
      callToAction: body.callToAction || 'Follow @RIIQX for daily breakdowns',
      watermark: body.watermark,
      voiceoverEnabled: body.voiceoverEnabled ?? true,
      musicVolume: body.musicVolume ?? 0.6,
      assets: body.assets || [],
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing project id parameter' }, { status: 400 });
    }
    const success = deleteCreatorProject(id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete project';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
