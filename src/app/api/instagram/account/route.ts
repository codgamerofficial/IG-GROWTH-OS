import { NextResponse } from 'next/server';
import { instagramService } from '@/lib/instagram/service';

export async function GET() {
  try {
    const account = await instagramService.getAccount();
    const media = await instagramService.getMedia();
    const insights = await instagramService.getInsights();

    return NextResponse.json({
      success: true,
      mode: instagramService.getMode(),
      account,
      recentMedia: media,
      insights,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
