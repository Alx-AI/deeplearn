import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> },
) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { cardId } = await params;
  const rows = await sql`SELECT * FROM user_card_states WHERE user_id = ${userId} AND card_id = ${cardId}`;
  if (rows.length === 0) {
    return NextResponse.json(null);
  }
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ cardId: string }> },
) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { cardId } = await params;
  const body = await req.json();

  await sql`
    INSERT INTO user_card_states (user_id, card_id, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review, fsrs_card)
    VALUES (${userId}, ${cardId}, ${body.due}, ${body.stability}, ${body.difficulty}, ${body.elapsed_days}, ${body.scheduled_days}, ${body.reps}, ${body.lapses}, ${body.state}, ${body.lastReview}, ${JSON.stringify(body.fsrsCard)})
    ON CONFLICT (user_id, card_id) DO UPDATE SET
      due = EXCLUDED.due,
      stability = EXCLUDED.stability,
      difficulty = EXCLUDED.difficulty,
      elapsed_days = EXCLUDED.elapsed_days,
      scheduled_days = EXCLUDED.scheduled_days,
      reps = EXCLUDED.reps,
      lapses = EXCLUDED.lapses,
      state = EXCLUDED.state,
      last_review = EXCLUDED.last_review,
      fsrs_card = EXCLUDED.fsrs_card
  `;

  return NextResponse.json({ ok: true });
}
