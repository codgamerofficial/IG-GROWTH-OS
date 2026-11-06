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
    const body = await req.json();
    const rawHandle = typeof body.handle === 'string' ? body.handle.trim() : '';
    const cleanHandle = rawHandle.replace(/^@+/, '').replace(/\s+/g, '');

    if (!cleanHandle || !/^[a-zA-Z0-9._]{1,30}$/.test(cleanHandle)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Instagram handle. Must be 1-30 characters containing letters, numbers, periods, or underscores.',
      }, { status: 400 });
    }

    const accounts = await getConnectedAccounts(userId);
    const facebookAccounts = accounts.filter((a) => a.provider === 'facebook' && a.status === 'connected');

    if (facebookAccounts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Please connect your Facebook Page (e.g. MVF Official) first before linking an Instagram handle.',
      }, { status: 400 });
    }

    // Select specified page or default to the first active Facebook Page
    const pageAccount = (body.pageId
      ? facebookAccounts.find((p) => p.platform_account_id === body.pageId)
      : null) || facebookAccounts[0];

    const authBundle = await getAccountWithCredentials(pageAccount.id, userId);
    if (!authBundle?.accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Unable to decrypt Facebook Page credentials. Please reconnect your Facebook Page.',
      }, { status: 400 });
    }

    const expiresAt = pageAccount.token_expires_at || new Date(Date.now() + 60 * 86400 * 1000).toISOString();
    const platformAccountId = `ig_${cleanHandle.toLowerCase()}`;

    const igAccount = await saveConnectedAccount({
      userId,
      provider: 'instagram',
      platformAccountId,
      accountName: cleanHandle,
      accountHandle: `@${cleanHandle}`,
      avatarUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80`,
      scopes: ['instagram_basic', 'instagram_content_publish'],
      accessToken: authBundle.accessToken,
      tokenExpiresAt: expiresAt,
      tokenType: 'Bearer',
      platformMetadata: {
        username: cleanHandle,
        linkedPageId: pageAccount.platform_account_id,
        linkedPageName: pageAccount.account_name,
        linkedVia: 'page_token_bridge',
        linkedAt: new Date().toISOString(),
      },
      status: 'connected',
    });

    return NextResponse.json({
      success: true,
      account: igAccount,
      message: `Successfully linked Instagram (@${cleanHandle}) to Facebook Page "${pageAccount.account_name}"!`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to link Instagram handle.';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

