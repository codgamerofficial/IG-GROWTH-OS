import { NextRequest, NextResponse } from 'next/server';
import { getDefaultUser, authenticateUser, validateSession } from '@/lib/nuvexa/auth';
import { deleteUserData } from '@/lib/nuvexa/storage';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('nvx_session')?.value;
  const user = token ? validateSession(token) || getDefaultUser() : getDefaultUser();

  return NextResponse.json({
    success: true,
    user,
    isAuthenticated: Boolean(user),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const session = authenticateUser(email, password);
    const response = NextResponse.json({
      success: true,
      user: session.user,
      token: session.token,
    });

    response.cookies.set('nvx_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Auth failure';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = getDefaultUser();
    const result = deleteUserData(user.id);
    return NextResponse.json({
      success: true,
      message: 'All user data permanently deleted.',
      recordsRemoved: result.recordsRemoved,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Deletion failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
