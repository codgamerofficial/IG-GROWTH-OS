import { NextRequest, NextResponse } from 'next/server';
import { parseUploadedTextFile } from '@/lib/riiqx/documents';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { content, filename, mimeType } = body;

    if (!content || !filename) {
      return NextResponse.json({ error: 'File content and filename are required.' }, { status: 400 });
    }

    const doc = parseUploadedTextFile(content, filename, mimeType || 'text/plain');

    return NextResponse.json({
      success: true,
      document: doc,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Document processing error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    documents: [],
    message: 'Send POST with file content to sanitize and sandbox.',
  });
}
