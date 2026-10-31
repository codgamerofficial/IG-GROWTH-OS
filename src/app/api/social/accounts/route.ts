import { NextRequest, NextResponse } from 'next/server';
import {
  getConnectedAccounts,
  deleteConnectedAccount,
  saveConnectedAccount,
  updateAccountStatus,
  ConnectedAccountRecord,
} from '@/lib/riiqx/social/account-repository';
import { getInstagramAccountStatus } from '@/lib/riiqx/social/instagram';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  try {
    let accounts = await getConnectedAccounts(userId);

    // Auto-detect direct environment variables only if validly configured in .env.local
    const igToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const igAccountId =
      process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || process.env.INSTAGRAM_ACCOUNT_ID;

    const hasIgInDb = accounts.some((a) => a.provider === 'instagram');

    if (!hasIgInDb && igToken && igAccountId) {
      // Probe Meta Graph API - only auto-register if valid
      const status = await getInstagramAccountStatus();
      if (status.isConfigured && status.isValid) {
        const directAccount = await saveConnectedAccount({
          userId,
          provider: 'instagram',
          platformAccountId: igAccountId,
          accountName: status.username ? `@${status.username}` : 'Instagram Professional',
          accountHandle: status.username ? `@${status.username}` : undefined,
          scopes: ['instagram_basic', 'instagram_content_publish'],
          accessToken: igToken,
          status: 'connected',
          platformMetadata: {
            source: 'env_direct_credentials',
            followersCount: status.followersCount,
            mediaCount: status.mediaCount,
          },
        });
        accounts = [directAccount, ...accounts];
      }
    } else if (hasIgInDb) {
      // Keep existing direct env credential accounts synced with actual token validity
      for (const acc of accounts) {
        if (
          acc.provider === 'instagram' &&
          acc.platform_metadata?.source === 'env_direct_credentials'
        ) {
          const status = await getInstagramAccountStatus();
          if (!status.isValid) {
            const clearMessage = status.errorMessage?.includes('Application has been deleted')
              ? 'Legacy environment token (INSTAGRAM_ACCESS_TOKEN) was issued by a deleted Meta App. Connect via OAuth above.'
              : status.errorMessage;
            await updateAccountStatus(acc.id, userId, 'expired', clearMessage);
            acc.status = 'expired';
            acc.error_message = clearMessage;
          }
        }
      }
    }

    // Sanitize account objects to ensure NO sensitive credential fields can leak
    const sanitized = accounts.map((acc) => ({
      id: acc.id,
      provider: acc.provider,
      platformAccountId: acc.platform_account_id,
      accountName: acc.account_name,
      accountHandle: acc.account_handle,
      avatarUrl: acc.avatar_url,
      scopes: acc.scopes,
      status: acc.status,
      tokenExpiresAt: acc.token_expires_at,
      lastVerifiedAt: acc.last_verified_at,
      platformMetadata: acc.platform_metadata,
      errorMessage: acc.error_message,
    }));

    return NextResponse.json({
      success: true,
      accounts: sanitized,
      count: sanitized.length,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to retrieve connected accounts';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const accountId = url.searchParams.get('id');
  const userId = (await resolveAuthUserId(req)) || 'usr_riiqx_primary';

  if (!accountId) {
    return NextResponse.json({ error: 'Account ID is required.' }, { status: 400 });
  }

  try {
    const deleted = await deleteConnectedAccount(accountId, userId);
    return NextResponse.json({ success: deleted, accountId });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to disconnect account';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
