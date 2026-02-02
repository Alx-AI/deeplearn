/**
 * Client-side API helpers that replace the Dexie database functions.
 *
 * Every function matches the signature of its predecessor in database.ts,
 * but delegates to the server-side API routes instead of IndexedDB.
 */

import type { Card as FSRSCard } from 'ts-fsrs';
import { createEmptyCard } from 'ts-fsrs';
import type {
  UserCardState,
  ReviewLog,
  UserLessonProgress,
  UserSettings,
} from './schema';
import { DEFAULT_USER_SETTINGS, createDefaultLessonProgress } from './schema';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Revive ISO date strings into Date objects for FSRS fields. */
function reviveDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // ISO 8601 pattern
    if (/^\d{4}-\d{2}-\d{2}T/.test(obj)) {
      return new Date(obj) as unknown as T;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(reviveDates) as unknown as T;
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = reviveDates(value);
    }
    return result as T;
  }
  return obj;
}

/** Map a snake_case DB row to a camelCase UserCardState. */
function rowToCardState(row: Record<string, unknown>): UserCardState {
  const fsrsCard = reviveDates(
    typeof row.fsrs_card === 'string' ? JSON.parse(row.fsrs_card) : row.fsrs_card,
  ) as FSRSCard;
  return {
    cardId: row.card_id as string,
    due: new Date(row.due as string),
    stability: row.stability as number,
    difficulty: row.difficulty as number,
    elapsed_days: row.elapsed_days as number,
    scheduled_days: row.scheduled_days as number,
    reps: row.reps as number,
    lapses: row.lapses as number,
    state: row.state as number,
    lastReview: row.last_review ? new Date(row.last_review as string) : null,
    fsrsCard,
  };
}

/** Map a snake_case DB row to a camelCase ReviewLog. */
function rowToReviewLog(row: Record<string, unknown>): ReviewLog {
  return {
    id: row.id as number,
    cardId: row.card_id as string,
    lessonId: row.lesson_id as string,
    rating: row.rating as 1 | 2 | 3 | 4,
    timestamp: new Date(row.timestamp as string),
    scheduledDays: row.scheduled_days as number,
    elapsedDays: row.elapsed_days as number,
    state: row.state as number,
    duration: row.duration as number,
    context: row.context as 'inline' | 'quiz' | 'review-session',
  };
}

/** Map a snake_case DB row to a camelCase UserLessonProgress. */
function rowToLessonProgress(row: Record<string, unknown>): UserLessonProgress {
  const sectionsRead = typeof row.sections_read === 'string'
    ? JSON.parse(row.sections_read)
    : row.sections_read;
  return {
    lessonId: row.lesson_id as string,
    status: row.status as UserLessonProgress['status'],
    sectionsRead: (sectionsRead ?? []) as string[],
    quizAttempts: row.quiz_attempts as number,
    bestQuizScore: row.best_quiz_score as number,
    lastAccessedAt: row.last_accessed_at ? new Date(row.last_accessed_at as string) : null,
    completedAt: row.completed_at ? new Date(row.completed_at as string) : null,
    totalTimeSpent: row.total_time_spent as number,
  };
}

/** Map a snake_case DB row to a camelCase UserSettings. */
function rowToSettings(row: Record<string, unknown>): UserSettings {
  return {
    theme: row.theme as UserSettings['theme'],
    dailyReviewGoal: row.daily_review_goal as number,
    newCardsPerDay: row.new_cards_per_day as number,
    fontSize: row.font_size as UserSettings['fontSize'],
    reducedMotion: row.reduced_motion as boolean,
    desiredRetention: row.desired_retention as number,
  };
}

// ---------------------------------------------------------------------------
// Card State Functions
// ---------------------------------------------------------------------------

export async function getOrCreateCardState(cardId: string): Promise<UserCardState> {
  const res = await fetch(`/api/card-states/${encodeURIComponent(cardId)}`);
  const row = await res.json();
  if (row) return rowToCardState(row);

  // Create a new card
  const now = new Date();
  const fsrsCard: FSRSCard = createEmptyCard(now);
  const newState: UserCardState = {
    cardId,
    due: fsrsCard.due,
    stability: fsrsCard.stability,
    difficulty: fsrsCard.difficulty,
    elapsed_days: fsrsCard.elapsed_days,
    scheduled_days: fsrsCard.scheduled_days,
    reps: fsrsCard.reps,
    lapses: fsrsCard.lapses,
    state: fsrsCard.state,
    lastReview: fsrsCard.last_review ?? null,
    fsrsCard,
  };

  await fetch(`/api/card-states/${encodeURIComponent(cardId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newState),
  });

  return newState;
}

export async function updateCardAfterReview(
  cardId: string,
  updatedFsrsCard: FSRSCard,
  log: Omit<ReviewLog, 'id'>,
): Promise<void> {
  const cardState: UserCardState = {
    cardId,
    due: updatedFsrsCard.due,
    stability: updatedFsrsCard.stability,
    difficulty: updatedFsrsCard.difficulty,
    elapsed_days: updatedFsrsCard.elapsed_days,
    scheduled_days: updatedFsrsCard.scheduled_days,
    reps: updatedFsrsCard.reps,
    lapses: updatedFsrsCard.lapses,
    state: updatedFsrsCard.state,
    lastReview: updatedFsrsCard.last_review ?? null,
    fsrsCard: updatedFsrsCard,
  };

  await fetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardState, reviewLog: log }),
  });
}

export async function getCardsDueForReview(
  cutoff: Date = new Date(),
): Promise<UserCardState[]> {
  const res = await fetch(`/api/card-states/due?cutoff=${cutoff.toISOString()}`);
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToCardState);
}

export async function getNewCards(limit: number = 20): Promise<UserCardState[]> {
  const res = await fetch(`/api/card-states/new?limit=${limit}`);
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToCardState);
}

export async function countCardsDue(cutoff: Date = new Date()): Promise<number> {
  const res = await fetch(`/api/card-states/count-due?cutoff=${cutoff.toISOString()}`);
  const data = await res.json();
  return data.count;
}

export async function getAllCardStates(): Promise<UserCardState[]> {
  const res = await fetch('/api/card-states');
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToCardState);
}

// ---------------------------------------------------------------------------
// Lesson Progress Functions
// ---------------------------------------------------------------------------

export async function getOrCreateLessonProgress(
  lessonId: string,
  initialStatus: UserLessonProgress['status'] = 'available',
): Promise<UserLessonProgress> {
  const res = await fetch(`/api/lesson-progress/${encodeURIComponent(lessonId)}`);
  const row = await res.json();
  if (row) return rowToLessonProgress(row);

  const progress = createDefaultLessonProgress(lessonId, initialStatus);
  await fetch(`/api/lesson-progress/${encodeURIComponent(lessonId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress),
  });
  return progress;
}

export async function updateLessonProgress(
  lessonId: string,
  update: Partial<Omit<UserLessonProgress, 'lessonId'>>,
): Promise<void> {
  await fetch(`/api/lesson-progress/${encodeURIComponent(lessonId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
}

export async function getAllLessonProgress(): Promise<UserLessonProgress[]> {
  const res = await fetch('/api/lesson-progress');
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToLessonProgress);
}

// ---------------------------------------------------------------------------
// Settings Functions
// ---------------------------------------------------------------------------

export async function getOrCreateSettings(): Promise<UserSettings> {
  const res = await fetch('/api/settings');
  const row = await res.json();
  return rowToSettings(row);
}

export async function updateSettings(
  update: Partial<UserSettings>,
): Promise<void> {
  await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
}

// ---------------------------------------------------------------------------
// Review Log Functions
// ---------------------------------------------------------------------------

export async function getCardReviewHistory(cardId: string): Promise<ReviewLog[]> {
  const res = await fetch(`/api/review-logs?cardId=${encodeURIComponent(cardId)}`);
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToReviewLog);
}

export async function getLessonReviewHistory(lessonId: string): Promise<ReviewLog[]> {
  const res = await fetch(`/api/review-logs?lessonId=${encodeURIComponent(lessonId)}`);
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToReviewLog);
}

export async function getTodayReviewCount(): Promise<number> {
  const res = await fetch('/api/review-logs/today-count');
  const data = await res.json();
  return data.count;
}

export async function getReviewLogsSince(since: Date): Promise<ReviewLog[]> {
  const res = await fetch(`/api/review-logs?since=${since.toISOString()}`);
  const rows: Record<string, unknown>[] = await res.json();
  return rows.map(rowToReviewLog);
}

// ---------------------------------------------------------------------------
// Data Management
// ---------------------------------------------------------------------------

export async function exportAllData(): Promise<{
  userCardStates: unknown[];
  reviewLogs: unknown[];
  lessonProgress: unknown[];
  settings: unknown[];
}> {
  const res = await fetch('/api/data/export');
  return res.json();
}

export async function clearAllData(): Promise<void> {
  await fetch('/api/data/clear', { method: 'DELETE' });
}
