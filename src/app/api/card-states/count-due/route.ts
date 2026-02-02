import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const cutoff = req.nextUrl.searchParams.get('cutoff') ?? new Date().toISOString();
  const rows = await sql`
    SELECT COUNT(*)::int AS count FROM user_card_states
    WHERE user_id = ${userId} AND due <= ${cutoff}::timestamptz AND state != 0
  `;
  return NextResponse.json({ count: rows[0].count });
}
