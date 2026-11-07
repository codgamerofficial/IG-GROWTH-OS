// =============================================================================
// RIIQX — Snap-to-Pantry Visual Scanner API
// POST /api/twin/lifestyle/scan-pantry
// Multimodal recognition of fridge/pantry ingredients + zero-waste recipes
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PantryVisionScanner } from '@/services/lifestyle/pantry-vision-scanner';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = 'image/jpeg', diet = 'High Protein / Low Carb' } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid fridge or pantry photo in base64 format.',
        },
        { status: 400 }
      );
    }

    const scanResult = await PantryVisionScanner.scanPantryImage(imageBase64, mimeType, diet);

    return NextResponse.json({
      success: true,
      result: scanResult,
    });
  } catch (error: any) {
    console.error('[API /twin/lifestyle/scan-pantry] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to scan pantry image.',
      },
      { status: 500 }
    );
  }
}

