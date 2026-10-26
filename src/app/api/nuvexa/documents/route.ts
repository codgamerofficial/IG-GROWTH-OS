import { NextRequest, NextResponse } from 'next/server';
import { sanitizeAndExtractDocument, createDocumentRecord } from '@/lib/nuvexa/documents';
import { listDocuments, saveDocument } from '@/lib/nuvexa/storage';
import { getDefaultUser } from '@/lib/nuvexa/auth';

export async function GET() {
  const user = getDefaultUser();
  const docs = listDocuments(user.id);
  return NextResponse.json({ success: true, documents: docs });
}

export async function POST(req: NextRequest) {
  try {
    const user = getDefaultUser();
    const body = await req.json();
    const { fileName, rawContent, fileType } = body;

    if (!fileName || !rawContent) {
      return NextResponse.json({ error: 'fileName and rawContent are required' }, { status: 400 });
    }

    const parsed = sanitizeAndExtractDocument(fileName, rawContent, fileType);
    const docRecord = createDocumentRecord(user.id, parsed);
    saveDocument(docRecord);

    return NextResponse.json({
      success: true,
      document: docRecord,
      warnings: parsed.warnings,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Upload extraction failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
