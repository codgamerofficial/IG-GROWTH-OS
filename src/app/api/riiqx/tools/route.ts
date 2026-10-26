// =============================================================================
// RIIQX 2.0 — Server Tool Registry & Execution API Endpoint
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getRegisteredTools, executeToolSafe, getToolAuditLogs } from '@/lib/riiqx/tools';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tools = getRegisteredTools().map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    parameters: t.parameters,
    permissionLevel: t.permissionLevel,
    requiresAuth: t.requiresAuth,
    timeoutMs: t.timeoutMs,
  }));

  const auditLogs = getToolAuditLogs(20);

  return NextResponse.json({
    status: 'active',
    toolsCount: tools.length,
    tools,
    recentAudits: auditLogs,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, args, context } = body;

    if (!toolId || typeof toolId !== 'string') {
      return NextResponse.json(
        { error: 'Missing required "toolId" string field' },
        { status: 400 }
      );
    }

    const result = await executeToolSafe(toolId, args || {}, context || {});
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid request payload';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
