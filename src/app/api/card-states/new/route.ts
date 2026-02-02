import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10);
  const rows = await sql`
    SELECT * FROM user_card_states
    WHERE user_id = ${userId} AND state = 0
    LIMIT ${limit}
  `;
  return NextResponse.json(rows);
}
