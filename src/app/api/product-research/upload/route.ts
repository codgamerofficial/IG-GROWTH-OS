// =============================================================================
// RIIQX — Product Screenshot Upload Endpoint
// Secure File Validation • Mime & Size Verification • Buffer to Base64
// Supports Multipart FormData & JSON Base64 Payloads
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const contentType = req.headers.get('content-type') || '';

    const MAX_SIZE = 8 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    let fileName = 'screenshot.jpg';
    let mimeType = 'image/jpeg';
    let base64Data = '';
    let fileSize = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File size exceeds maximum limit of 8MB.' }, { status: 400 });
      }

      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { error: 'Invalid file format. Only JPG, PNG, and WEBP product screenshots are permitted.' },
          { status: 400 }
        );
      }

      fileName = file.name;
      mimeType = file.type;
      fileSize = file.size;
      const buffer = Buffer.from(await file.arrayBuffer());
      base64Data = buffer.toString('base64');
    } else {
      // JSON Base64 Payload
      const body = await req.json();
      const { fileBase64, mimeType: declaredMime, fileName: declaredName } = body || {};

      if (!fileBase64) {
        return NextResponse.json({ error: 'No image data provided.' }, { status: 400 });
      }

      mimeType = declaredMime || 'image/jpeg';
      fileName = declaredName || 'screenshot.jpg';

      if (!allowedTypes.includes(mimeType.toLowerCase())) {
        return NextResponse.json(
          { error: 'Invalid file format. Only JPG, PNG, and WEBP product screenshots are permitted.' },
          { status: 400 }
        );
      }

      // Extract raw base64 data
      const cleanB64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanB64, 'base64');
      fileSize = buffer.length;

      if (fileSize > MAX_SIZE) {
        return NextResponse.json({ error: 'File size exceeds maximum limit of 8MB.' }, { status: 400 });
      }

      base64Data = cleanB64;
    }

    return NextResponse.json({
      success: true,
      fileName,
      fileSize,
      mimeType,
      base64Data,
      base64: `data:${mimeType};base64,${base64Data}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'File upload failed.' }, { status: 400 });
  }
}
