// =============================================================================
// RIIQX — Storyboard Approval Checkpoint API
// Section 6: Mandatory Approval Gate • Beat Editing • Persistent Approval State
// Rendering is strictly locked until explicit user approval
// =============================================================================

import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const storyboardsDir = path.join(process.cwd(), 'AI Video Editor', 'metadata', 'storyboards');

function getLatestStoryboard(): { filePath: string; data: any } | null {
  if (!fs.existsSync(storyboardsDir)) return null;
  const files = fs.readdirSync(storyboardsDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) return null;
  files.sort().reverse();
  const filePath = path.join(storyboardsDir, files[0]);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return { filePath, data };
  } catch {
    return null;
  }
}

export async function GET() {
  const latest = getLatestStoryboard();
  if (!latest) {
    return NextResponse.json({
      success: true,
      hasStoryboard: false,
      message: 'No storyboard found. Run Footage Analysis to generate a storyboard.',
    });
  }

  return NextResponse.json({
    success: true,
    hasStoryboard: true,
    storyboard: latest.data,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, storyboardId, updatedBeats, changeNotes } = body;

    const latest = getLatestStoryboard();
    if (!latest) {
      return NextResponse.json({ success: false, error: 'No active storyboard to update.' }, { status: 404 });
    }

    const currentData = latest.data;

    if (action === 'approve') {
      currentData.isApproved = true;
      currentData.approvalStatus = 'approved';
      currentData.approvedAt = new Date().toISOString();
      currentData.gateUnlocked = true;
    } else if (action === 'request_changes') {
      currentData.isApproved = false;
      currentData.approvalStatus = 'changes_requested';
      currentData.changeNotes = changeNotes || 'User requested beat pacing changes.';
      currentData.gateUnlocked = false;
    } else if (action === 'update_beats') {
      if (Array.isArray(updatedBeats)) {
        currentData.beats = updatedBeats;
        // Re-evaluating duration
        currentData.totalDurationSeconds = updatedBeats.reduce(
          (sum: number, b: any) => sum + (b.durationSeconds || b.outSec - b.inSec),
          0
        );
      }
    }

    // Persist updated state
    fs.writeFileSync(latest.filePath, JSON.stringify(currentData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      actionApplied: action,
      storyboard: currentData,
      isApproved: currentData.isApproved,
      message: currentData.isApproved
        ? 'Storyboard approved! Rendering pipeline is now unlocked.'
        : 'Storyboard updated. Approval required before rendering.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

