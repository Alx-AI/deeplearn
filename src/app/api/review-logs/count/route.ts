import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const rows = await sql`SELECT COUNT(*)::int AS count FROM review_logs WHERE user_id = ${userId}`;
  return NextResponse.json({ count: rows[0].count });
}
