// =============================================================================
// RIIQX — Twin Memories API Endpoint
// 4-Tier Memory Taxonomy • Inspection • Correction • Deletion
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const memories = await TwinRepository.getMemories(userId);
    return NextResponse.json({ success: true, memories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();

    if (!body.memoryText) {
      return NextResponse.json({ error: 'memoryText is required' }, { status: 400 });
    }

    const memory = await TwinRepository.addMemory({
      userId,
      category: body.category || 'general',
      memoryText: body.memoryText,
      memoryType: body.memoryType || 'confirmed_preference',
      confidenceScore: typeof body.confidenceScore === 'number' ? body.confidenceScore : 1.0,
      sourceType: body.sourceType || 'direct_user_statement',
      verifiedByUser: Boolean(body.verifiedByUser ?? true),
      isActive: true,
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, memory });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const url = new URL(req.url);
    const memoryId = url.searchParams.get('id');

    if (!memoryId) {
      return NextResponse.json({ error: 'Memory ID parameter is required' }, { status: 400 });
    }

    await TwinRepository.deleteMemory(userId, memoryId);
    return NextResponse.json({ success: true, deletedId: memoryId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

