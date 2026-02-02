import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function DELETE() {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM review_logs WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM user_card_states WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM lesson_progress WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM settings WHERE user_id = $1', [userId]);
    await client.query(
      'INSERT INTO settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [userId],
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
