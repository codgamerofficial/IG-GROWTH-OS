// =============================================================================
// RIIQX / GlowFit AI — Reference Video 1-FPS Frame & Style Analysis API
// Route: POST & GET /api/riiqx/video-editor/analyze-references
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { FrameStyleAnalyzerService } from '@/services/video/frame-style-analyzer';

const REFERENCES_DIR = path.join(process.cwd(), 'AI Video Editor', 'References');

export async function GET() {
  try {
    if (!fs.existsSync(REFERENCES_DIR)) {
      fs.mkdirSync(REFERENCES_DIR, { recursive: true });
    }

    const files = fs
      .readdirSync(REFERENCES_DIR)
      .filter((f) => f.endsWith('.mp4') || f.endsWith('.mov') || f.endsWith('.webm'));

    return NextResponse.json({
      success: true,
      totalReferenceVideos: files.length,
      videos: files,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const videoName = body.videoName || 'ref_viral_hook_01.mp4';
    const videoPath = path.join(REFERENCES_DIR, videoName);
    const outputDir = path.join(REFERENCES_DIR, 'frames', path.parse(videoName).name);

    // 1. Extract 1 frame per second with FFmpeg
    let framePaths: string[] = [];
    if (fs.existsSync(videoPath)) {
      framePaths = FrameStyleAnalyzerService.extractFramesAtOneFps(videoPath, outputDir);
    }

    // 2. Perform visual multimodal inspection
    const analysis = await FrameStyleAnalyzerService.analyzeFramesWithVision(
      framePaths,
      videoName
    );

    // 3. Write Brand Kit and Editing Style
    FrameStyleAnalyzerService.updateBrandKitAndStyle(analysis);

    return NextResponse.json({
      success: true,
      message: `Extracted and analyzed visual style from ${videoName}. Updated brand-kit.md!`,
      analysis,
    });
  } catch (err: any) {
    console.error('[API /api/riiqx/video-editor/analyze-references] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
