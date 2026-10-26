import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const exportData = {
    exportedAt: new Date().toISOString(),
    system: 'RIIQX Agentic Platform',
    version: '2.0.0',
    userId: 'usr_riiqx_primary',
    projects: [
      {
        id: 'prj_starter_intel',
        title: 'Enterprise AI Strategy',
        description: 'Online agent execution, AWS Bedrock integration, and autonomous content generation.',
      },
    ],
    conversations: [],
    tasks: [],
  };

  return NextResponse.json(exportData);
}
