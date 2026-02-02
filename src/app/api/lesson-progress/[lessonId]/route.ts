import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';
import { getAuthUserId } from '@/lib/db/get-user-id';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { lessonId } = await params;
  const rows = await sql`SELECT * FROM lesson_progress WHERE user_id = ${userId} AND lesson_id = ${lessonId}`;
  if (rows.length === 0) {
    return NextResponse.json(null);
  }
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const userId = await getAuthUserId();
  if (userId instanceof NextResponse) return userId;

  const { lessonId } = await params;
  const body = await req.json();

  // Read existing row (if any) to merge partial updates
  const existing = await sql`SELECT * FROM lesson_progress WHERE user_id = ${userId} AND lesson_id = ${lessonId}`;

  const status = body.status ?? existing[0]?.status ?? 'available';
  const sectionsRead = JSON.stringify(body.sectionsRead ?? (existing[0]?.sections_read ?? []));
  const quizAttempts = body.quizAttempts ?? existing[0]?.quiz_attempts ?? 0;
  const bestQuizScore = body.bestQuizScore ?? existing[0]?.best_quiz_score ?? 0;
  const lastAccessedAt = body.lastAccessedAt ?? existing[0]?.last_accessed_at ?? null;
  const completedAt = body.completedAt ?? existing[0]?.completed_at ?? null;
  const totalTimeSpent = body.totalTimeSpent ?? existing[0]?.total_time_spent ?? 0;

  await sql`
    INSERT INTO lesson_progress (user_id, lesson_id, status, sections_read, quiz_attempts, best_quiz_score, last_accessed_at, completed_at, total_time_spent)
    VALUES (${userId}, ${lessonId}, ${status}, ${sectionsRead}::jsonb, ${quizAttempts}, ${bestQuizScore}, ${lastAccessedAt}, ${completedAt}, ${totalTimeSpent})
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      status = ${status},
      sections_read = ${sectionsRead}::jsonb,
      quiz_attempts = ${quizAttempts},
      best_quiz_score = ${bestQuizScore},
      last_accessed_at = ${lastAccessedAt},
      completed_at = ${completedAt},
      total_time_spent = ${totalTimeSpent}
  `;

  return NextResponse.json({ ok: true });
}
