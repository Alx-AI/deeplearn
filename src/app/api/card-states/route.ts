import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const rows = await sql`SELECT * FROM user_card_states WHERE user_id = ${userId} ORDER BY due ASC`;
  return NextResponse.json(rows);
}
