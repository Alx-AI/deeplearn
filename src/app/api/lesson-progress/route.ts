import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const rows = await sql`SELECT * FROM lesson_progress WHERE user_id = ${userId} ORDER BY last_accessed_at DESC NULLS LAST`;
  return NextResponse.json(rows);
}
