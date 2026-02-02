import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const [userCardStates, reviewLogs, lessonProgress, settings] = await Promise.all([
    sql`SELECT * FROM user_card_states WHERE user_id = ${userId} ORDER BY card_id`,
    sql`SELECT * FROM review_logs WHERE user_id = ${userId} ORDER BY id`,
    sql`SELECT * FROM lesson_progress WHERE user_id = ${userId} ORDER BY lesson_id`,
    sql`SELECT * FROM settings WHERE user_id = ${userId}`,
  ]);

  return NextResponse.json({
    userCardStates,
    reviewLogs,
    lessonProgress,
    settings,
  });
}
