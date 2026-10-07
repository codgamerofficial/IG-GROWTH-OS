import { NextResponse } from 'next/server';
import { MetaOAuthManager } from '@/lib/instagram/oauth';

export async function GET() {
  try {
    const isLiveConfigured = Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
    const authUrl = MetaOAuthManager.getAuthorizationUrl();

    return NextResponse.json({
      success: true,
      authUrl,
      isConfigured: isLiveConfigured,
      requiredPermissions: [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_insights',
        'instagram_manage_comments',
        'pages_show_list',
        'pages_read_engagement',
      ],
      setupInstructions: [
        '1. Create an app in Meta Developer Portal (https://developers.facebook.com).',
        '2. Add the "Instagram Graph API" and "Facebook Login for Business" products.',
        '3. Add valid OAuth Redirect URI: ' + (process.env.META_REDIRECT_URI || 'http://localhost:3000/api/auth/instagram/callback'),
        '4. Link your Instagram Professional / Creator account to a Facebook Page.',
        '5. Set META_APP_ID and META_APP_SECRET in your environment variables.',
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
