import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const since = req.nextUrl.searchParams.get('since');
  const cardId = req.nextUrl.searchParams.get('cardId');
  const lessonId = req.nextUrl.searchParams.get('lessonId');

  if (cardId) {
    const rows = await sql`
      SELECT * FROM review_logs WHERE user_id = ${userId} AND card_id = ${cardId} ORDER BY timestamp ASC
    `;
    return NextResponse.json(rows);
  }

  if (lessonId) {
    const rows = await sql`
      SELECT * FROM review_logs WHERE user_id = ${userId} AND lesson_id = ${lessonId} ORDER BY timestamp ASC
    `;
    return NextResponse.json(rows);
  }

  if (since) {
    const rows = await sql`
      SELECT * FROM review_logs WHERE user_id = ${userId} AND timestamp >= ${since}::timestamptz ORDER BY timestamp ASC
    `;
    return NextResponse.json(rows);
  }

  const rows = await sql`SELECT * FROM review_logs WHERE user_id = ${userId} ORDER BY timestamp DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const body = await req.json();
  await sql`
    INSERT INTO review_logs (user_id, card_id, lesson_id, rating, timestamp, scheduled_days, elapsed_days, state, duration, context)
    VALUES (${userId}, ${body.cardId}, ${body.lessonId}, ${body.rating}, ${body.timestamp}, ${body.scheduledDays}, ${body.elapsedDays}, ${body.state}, ${body.duration}, ${body.context})
  `;
  return NextResponse.json({ ok: true });
}
