// =============================================================================
// RIIQX — User Data Ownership & DPDP Act Compliance API
// One-Click Full JSON Archive Export • Permanent User Memory Deletion
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const exportData = await TwinRepository.exportUserData(userId);

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="riiqx-twin-export-${userId}-${Date.now()}.json"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    await TwinRepository.deleteUserData(userId);

    return NextResponse.json({
      success: true,
      message: 'All personal twin profiles, memories, goals, and history permanently purged.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
