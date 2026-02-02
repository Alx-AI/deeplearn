import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const rows = await sql`SELECT * FROM settings WHERE user_id = ${userId}`;
  if (rows.length === 0) {
    // Insert defaults and return
    await sql`INSERT INTO settings (user_id) VALUES (${userId}) ON CONFLICT DO NOTHING`;
    const created = await sql`SELECT * FROM settings WHERE user_id = ${userId}`;
    return NextResponse.json(created[0]);
  }
  return NextResponse.json(rows[0]);
}

export async function PUT(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const body = await req.json();

  // Ensure user has a settings row
  await sql`INSERT INTO settings (user_id) VALUES (${userId}) ON CONFLICT DO NOTHING`;

  await sql`
    UPDATE settings SET
      theme = COALESCE(${body.theme ?? null}, theme),
      daily_review_goal = COALESCE(${body.dailyReviewGoal ?? null}, daily_review_goal),
      new_cards_per_day = COALESCE(${body.newCardsPerDay ?? null}, new_cards_per_day),
      font_size = COALESCE(${body.fontSize ?? null}, font_size),
      reduced_motion = COALESCE(${body.reducedMotion ?? null}, reduced_motion),
      desired_retention = COALESCE(${body.desiredRetention ?? null}, desired_retention)
    WHERE user_id = ${userId}
  `;

  const rows = await sql`SELECT * FROM settings WHERE user_id = ${userId}`;
  return NextResponse.json(rows[0]);
}
