import { NextResponse } from 'next/server';
import { getDefaultUser } from '@/lib/nuvexa/auth';
import { exportUserData } from '@/lib/nuvexa/storage';

export async function GET() {
  const user = getDefaultUser();
  const data = exportUserData(user.id);

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="nuvexa_export_${user.id}_${Date.now()}.json"`,
    },
  });
}
