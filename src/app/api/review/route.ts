import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function POST(req: NextRequest) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const body = await req.json();
  const { cardState, reviewLog } = body;

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO user_card_states (user_id, card_id, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review, fsrs_card)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
         fsrs_card = EXCLUDED.fsrs_card`,
      [
        userId,
        cardState.cardId,
        cardState.due,
        cardState.stability,
        cardState.difficulty,
        cardState.elapsed_days,
        cardState.scheduled_days,
        cardState.reps,
        cardState.lapses,
        cardState.state,
        cardState.lastReview,
        JSON.stringify(cardState.fsrsCard),
      ],
    );

    await client.query(
      `INSERT INTO review_logs (user_id, card_id, lesson_id, rating, timestamp, scheduled_days, elapsed_days, state, duration, context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        reviewLog.cardId,
        reviewLog.lessonId,
        reviewLog.rating,
        reviewLog.timestamp,
        reviewLog.scheduledDays,
        reviewLog.elapsedDays,
        reviewLog.state,
        reviewLog.duration,
        reviewLog.context,
      ],
    );

    await client.query('COMMIT');
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}
