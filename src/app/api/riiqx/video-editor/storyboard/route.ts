// =============================================================================
// RIIQX / GlowFit AI — Storyboard Notes & Brand Kit Sync API
// Route: GET & POST /api/riiqx/video-editor/storyboard
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const RAW_DIR = path.join(process.cwd(), 'AI Video Editor', 'Raw');
const BRAND_KIT_PATH = path.join(process.cwd(), 'AI Video Editor', 'Brand Kit', 'brand-kit.md');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectName = searchParams.get('project') || 'Product Showcase Launch';
    const projectDir = path.join(RAW_DIR, projectName);
    const notesPath = path.join(projectDir, 'notes.json');

    if (!fs.existsSync(notesPath)) {
      return NextResponse.json(
        { success: false, error: `notes.json not found for project: ${projectName}` },
        { status: 404 }
      );
    }

    const data = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
    return NextResponse.json({ success: true, notes: data, projectName });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName = 'Product Showcase Launch', notes, brandKitUpdates } = body;

    const projectDir = path.join(RAW_DIR, projectName);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    const notesPath = path.join(projectDir, 'notes.json');
    notes.updatedAt = new Date().toISOString();
    fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2), 'utf8');

    // If Brand Kit updates were submitted from creator feedback
    if (brandKitUpdates && typeof brandKitUpdates === 'string') {
      fs.appendFileSync(
        BRAND_KIT_PATH,
        `\n\n<!-- Update from ${projectName} on ${new Date().toLocaleDateString()} -->\n${brandKitUpdates}\n`,
        'utf8'
      );
    }

    return NextResponse.json({
      success: true,
      message: 'notes.json and Brand Kit updated successfully.',
      notes,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
