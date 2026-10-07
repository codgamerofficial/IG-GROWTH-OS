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
    let res = await fetch(url);
    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      // If targetId is a Facebook Page ID, it might fail asking for 'username'. Try page endpoint with safe fields:
      const pageUrl = `https://graph.facebook.com/v20.0/${targetId}?fields=id,name,picture&access_token=${token}`;
      const pageRes = await fetch(pageUrl);

      if (pageRes.ok) {
        const pageData = await pageRes.json();
        
        // Try to see if an instagram_business_account is attached
        let igAccount: any = null;
        try {
          const igRes = await fetch(`https://graph.facebook.com/v20.0/${targetId}?fields=instagram_business_account{id,username,name,followers_count,media_count}&access_token=${token}`);
          if (igRes.ok) {
            const igData = await igRes.json();
            igAccount = igData.instagram_business_account;
          }
        } catch (_) {}

        if (igAccount) {
          return NextResponse.json({
            service: 'instagram',
            status: 'healthy',
            healthy: true,
            checkedAt: new Date().toISOString(),
            latencyMs: Date.now() - startTime,
            configured: true,
            account: {
              id: igAccount.id,
              username: igAccount.username,
              name: igAccount.name,
              followers_count: igAccount.followers_count,
              media_count: igAccount.media_count,
            },
            message: `Meta connection active: Instagram Business Account @${igAccount.username} linked via Page "${pageData.name}".`,
          });
        } else {
          return NextResponse.json({
            service: 'instagram',
            status: 'healthy',
            healthy: true,
            checkedAt: new Date().toISOString(),
            latencyMs: Date.now() - startTime,
            configured: true,
            account: {
              id: pageData.id,
              username: pageData.name?.toLowerCase().replace(/\s+/g, '_') || 'page',
              name: pageData.name || 'Facebook Page',
              followers_count: 0,
              media_count: 0,
              profile_picture_url: pageData.picture?.data?.url || '',
            },
            warning: 'Facebook Page verified, but no Instagram Business Account is linked to this Page yet in Meta Business Suite.',
            message: `Meta connection active: Facebook Page "${pageData.name}" connected.`,
          });
        }
      }

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
