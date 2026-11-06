import { NextRequest, NextResponse } from 'next/server';
import {
  getConnectedAccounts,
  getAccountWithCredentials,
  saveConnectedAccount,
} from '@/lib/riiqx/social/account-repository';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const resolvedAuthId = await resolveAuthUserId(req);
  const userId = resolvedAuthId || 'usr_riiqx_primary';

  try {
    const accounts = await getConnectedAccounts(userId);
    const facebookAccounts = accounts.filter((a) => a.provider === 'facebook' && a.status === 'connected');

    if (facebookAccounts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active Facebook Pages found. Connect a Facebook Page first.',
      }, { status: 400 });
    }

    // Try probing each connected Facebook Page for attached Instagram accounts
    for (const fb of facebookAccounts) {
      const authBundle = await getAccountWithCredentials(fb.id, userId);
      if (!authBundle?.accessToken) continue;

      const pageId = fb.platform_account_id;
      const accessToken = authBundle.accessToken;

      const probeUrl = new URL(`https://graph.facebook.com/v26.0/${pageId}`);
      probeUrl.searchParams.set(
        'fields',
        'id,name,instagram_business_account{id,username,name,profile_picture_url},connected_instagram_account{id,username,name,profile_picture_url}'
      );
      probeUrl.searchParams.set('access_token', accessToken);

      const probeRes = await fetch(probeUrl.toString());
      if (probeRes.ok) {
        const probeData = await probeRes.json();
        const igRaw = (probeData.instagram_business_account || probeData.connected_instagram_account) as
          | { id: string; username: string; name?: string; profile_picture_url?: string }
          | undefined;

        if (igRaw?.id && igRaw.username) {
          const expiresAt = fb.token_expires_at || new Date(Date.now() + 60 * 86400 * 1000).toISOString();
          const igAccount = await saveConnectedAccount({
            userId,
            provider: 'instagram',
            platformAccountId: igRaw.id,
            accountName: igRaw.name || igRaw.username,
            accountHandle: `@${igRaw.username}`,
            avatarUrl: igRaw.profile_picture_url,
            scopes: ['instagram_basic', 'instagram_content_publish'],
            accessToken,
            tokenExpiresAt: expiresAt,
            tokenType: 'Bearer',
            platformMetadata: {
              instagramId: igRaw.id,
              username: igRaw.username,
              linkedPageId: pageId,
              linkedPageName: fb.account_name,
              syncedAt: new Date().toISOString(),
            },
            status: 'connected',
          });

          return NextResponse.json({
            success: true,
            synced: true,
            account: igAccount,
            message: `Successfully synced Instagram (@${igRaw.username}) from ${fb.account_name}!`,
          });
        }
      }
    }

    const primaryPage = facebookAccounts[0];
    return NextResponse.json({
      success: true,
      synced: false,
      pageName: primaryPage.account_name,
      pageId: primaryPage.platform_account_id,
      message: `No Instagram Professional account is linked to "${primaryPage.account_name}" in Meta Business Suite yet. You can link your handle directly below or connect it in Instagram settings.`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to sync Instagram account from Meta.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

