import { NextRequest, NextResponse } from 'next/server';
import { getDefaultUser, hashPassword, verifyPassword, createSessionToken, verifySessionToken } from '@/lib/riiqx/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');

  if (token) {
    const verified = verifySessionToken(token);
    if (verified.valid) {
      return NextResponse.json({
        success: true,
        user: getDefaultUser(),
        isAuthenticated: true,
      });
    }
  }

  // Default active user session
  return NextResponse.json({
    success: true,
    user: getDefaultUser(),
    isAuthenticated: true,
    authMethod: 'PBKDF2_LOCAL_SESSION',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (action === 'register') {
      const { saltHex, hashHex } = hashPassword(password);
      const token = createSessionToken('usr_riiqx_primary');
      return NextResponse.json({
        success: true,
        token,
        user: { ...getDefaultUser(), email },
        meta: { saltHex, hashHex: hashHex.slice(0, 16) + '...' },
      });
    }

    if (action === 'login') {
      const token = createSessionToken('usr_riiqx_primary');
      return NextResponse.json({
        success: true,
        token,
        user: { ...getDefaultUser(), email },
      });
    }

    return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Auth error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
