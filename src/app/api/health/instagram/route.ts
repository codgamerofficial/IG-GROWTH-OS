import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!token || token.includes('your-instagram') || token.trim().length < 10) {
    return NextResponse.json(
      {
        service: 'instagram',
        status: 'blocked_config_required',
        healthy: false,
        checkedAt: new Date().toISOString(),
        latencyMs: 0,
        configured: false,
        businessAccountId: businessAccountId || null,
        message: 'BLOCKED — EXTERNAL CONFIGURATION REQUIRED: INSTAGRAM_ACCESS_TOKEN is not configured.',
        actionRequired: 'Provide a valid Meta Graph API Long-Lived User Access Token in .env.local or complete the Meta OAuth flow.',
      },
      { status: 200 }
    );
  }

  const targetId = businessAccountId || 'me';
  const url = `https://graph.facebook.com/v20.0/${targetId}?fields=id,username,name,followers_count,media_count&access_token=${token}`;

  try {
    const res = await fetch(url);
    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          service: 'instagram',
          status: 'error',
          healthy: false,
          checkedAt: new Date().toISOString(),
          latencyMs,
          configured: true,
          httpStatus: res.status,
          error: errorData.error?.message || res.statusText,
          message: 'Meta Graph API returned an error for the provided token.',
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      service: 'instagram',
      status: 'healthy',
      healthy: true,
      checkedAt: new Date().toISOString(),
      latencyMs,
      configured: true,
      account: {
        id: data.id,
        username: data.username,
        name: data.name,
        followers_count: data.followers_count,
        media_count: data.media_count,
      },
      message: 'Meta Graph API connection verified and active.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        service: 'instagram',
        status: 'error',
        healthy: false,
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
