'use client';

import { useCallback, useMemo } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import { State as FSRSState } from 'ts-fsrs';

import {
  getOrCreateCardState,
  updateCardAfterReview,
  updateLessonProgress as apiUpdateLessonProgress,
  updateSettings as apiUpdateSettings,
  getOrCreateLessonProgress,
  getAllCardStates,
  getReviewLogsSince,
} from './api-client';

import type {
  UserCardState,
  UserLessonProgress,
  UserSettings,
  ReviewLog,
} from './schema';
import {
  DEFAULT_USER_SETTINGS,
  createDefaultLessonProgress,
} from './schema';

// ---------------------------------------------------------------------------
// SWR fetcher
// ---------------------------------------------------------------------------

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Row mappers (snake_case API -> camelCase TS)
// ---------------------------------------------------------------------------

function mapCardState(row: Record<string, unknown>): UserCardState {
  const fsrsCard = typeof row.fsrs_card === 'string'
    ? JSON.parse(row.fsrs_card)
    : row.fsrs_card;
  // Revive dates inside fsrsCard
  if (fsrsCard) {
    if (typeof fsrsCard.due === 'string') fsrsCard.due = new Date(fsrsCard.due);
    if (typeof fsrsCard.last_review === 'string') fsrsCard.last_review = new Date(fsrsCard.last_review);
  }
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

function mapLessonProgress(row: Record<string, unknown>): UserLessonProgress {
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

function mapSettings(row: Record<string, unknown>): UserSettings {
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
// useUserProgress -- single lesson progress
// ---------------------------------------------------------------------------

export interface UseUserProgressReturn {
  progress: UserLessonProgress;
  isLoading: boolean;
  updateProgress: (
    update: Partial<Omit<UserLessonProgress, 'lessonId'>>,
  ) => Promise<void>;
  markStarted: () => Promise<void>;
  markCompleted: () => Promise<void>;
  markSectionRead: (sectionId: string) => Promise<void>;
  addTimeSpent: (milliseconds: number) => Promise<void>;
  recordQuizAttempt: (score: number) => Promise<void>;
}

export function useUserProgress(lessonId: string): UseUserProgressReturn {
  const defaultProgress = useMemo(
    () => createDefaultLessonProgress(lessonId),
    [lessonId],
  );

  const { data: rawData, isLoading: swrLoading } = useSWR(
    `/api/lesson-progress/${encodeURIComponent(lessonId)}`,
    fetcher<Record<string, unknown> | null>,
  );

  const progress = rawData ? mapLessonProgress(rawData) : undefined;
  const isLoading = swrLoading;
  const resolved = progress ?? defaultProgress;

  const invalidate = useCallback(() => {
    globalMutate(`/api/lesson-progress/${encodeURIComponent(lessonId)}`);
    globalMutate('/api/lesson-progress');
  }, [lessonId]);

  const updateProgress = useCallback(
    async (update: Partial<Omit<UserLessonProgress, 'lessonId'>>) => {
      await apiUpdateLessonProgress(lessonId, update);
      invalidate();
    },
    [lessonId, invalidate],
  );

  const markStarted = useCallback(async () => {
    const now = new Date();
    const existing = await getOrCreateLessonProgress(lessonId);
    if (!existing || existing.status === 'available' || existing.status === 'locked') {
      await apiUpdateLessonProgress(lessonId, {
        status: 'in-progress',
        lastAccessedAt: now,
      });
    } else {
      await apiUpdateLessonProgress(lessonId, { lastAccessedAt: now });
    }
    invalidate();
  }, [lessonId, invalidate]);

  const markCompleted = useCallback(async () => {
    await apiUpdateLessonProgress(lessonId, {
      status: 'completed',
      completedAt: new Date(),
    });
    invalidate();
  }, [lessonId, invalidate]);

  const markSectionRead = useCallback(
    async (sectionId: string) => {
      const current = await getOrCreateLessonProgress(lessonId);
      if (!current.sectionsRead.includes(sectionId)) {
        await apiUpdateLessonProgress(lessonId, {
          sectionsRead: [...current.sectionsRead, sectionId],
        });
        invalidate();
      }
    },
    [lessonId, invalidate],
  );

  const addTimeSpent = useCallback(
    async (milliseconds: number) => {
      const current = await getOrCreateLessonProgress(lessonId);
      await apiUpdateLessonProgress(lessonId, {
        totalTimeSpent: current.totalTimeSpent + milliseconds,
      });
      invalidate();
    },
    [lessonId, invalidate],
  );

  const recordQuizAttempt = useCallback(
    async (score: number) => {
      const current = await getOrCreateLessonProgress(lessonId);
      await apiUpdateLessonProgress(lessonId, {
        quizAttempts: current.quizAttempts + 1,
        bestQuizScore: Math.max(current.bestQuizScore, score),
      });
      invalidate();
    },
    [lessonId, invalidate],
  );

  return {
    progress: resolved,
    isLoading,
    updateProgress,
    markStarted,
    markCompleted,
    markSectionRead,
    addTimeSpent,
    recordQuizAttempt,
  };
}

// ---------------------------------------------------------------------------
// useCardState -- single card SRS state
// ---------------------------------------------------------------------------

export interface UseCardStateReturn {
  cardState: UserCardState | undefined;
  isLoading: boolean;
  ensureExists: () => Promise<UserCardState>;
  recordReview: (
    updatedCard: import('ts-fsrs').Card,
    log: Omit<ReviewLog, 'id'>,
  ) => Promise<void>;
}

export function useCardState(cardId: string): UseCardStateReturn {
  const { data: rawData, isLoading: swrLoading } = useSWR(
    `/api/card-states/${encodeURIComponent(cardId)}`,
    fetcher<Record<string, unknown> | null>,
  );

  const cardState = rawData ? mapCardState(rawData) : undefined;
  const isLoading = swrLoading;

  const ensureExists = useCallback(
    () => getOrCreateCardState(cardId),
    [cardId],
  );

  const recordReview = useCallback(
    async (
      updatedCard: import('ts-fsrs').Card,
      log: Omit<ReviewLog, 'id'>,
    ) => {
      await updateCardAfterReview(cardId, updatedCard, log);
      globalMutate(`/api/card-states/${encodeURIComponent(cardId)}`);
      globalMutate('/api/card-states/due');
      globalMutate('/api/card-states/new');
      globalMutate('/api/card-states/count-due');
      globalMutate('/api/review-logs/today-count');
      globalMutate('/api/review-logs/count');
    },
    [cardId],
  );

  return { cardState, isLoading, ensureExists, recordReview };
}

// ---------------------------------------------------------------------------
// useReviewQueue -- cards due for review
// ---------------------------------------------------------------------------

export interface UseReviewQueueReturn {
  dueCards: UserCardState[];
  dueCount: number;
  newCards: UserCardState[];
  queue: UserCardState[];
  isLoading: boolean;
  estimatedMinutes: number;
}

export function useReviewQueue(): UseReviewQueueReturn {
  const now = useMemo(() => new Date().toISOString(), []);

  const { data: rawDue, isLoading: dueLoading } = useSWR(
    `/api/card-states/due?cutoff=${now}`,
    fetcher<Record<string, unknown>[]>,
  );

  const { data: rawSettings } = useSWR('/api/settings', fetcher<Record<string, unknown>>);
  const newCardsPerDay = rawSettings
    ? (rawSettings.new_cards_per_day as number)
    : DEFAULT_USER_SETTINGS.newCardsPerDay;

  const { data: rawNew, isLoading: newLoading } = useSWR(
    `/api/card-states/new?limit=${newCardsPerDay}`,
    fetcher<Record<string, unknown>[]>,
  );

  const dueCards = useMemo(
    () => (rawDue ?? []).map(mapCardState),
    [rawDue],
  );

  const newCards = useMemo(
    () => (rawNew ?? []).map(mapCardState),
    [rawNew],
  );

  const queue = useMemo(
    () => [...dueCards, ...newCards],
    [dueCards, newCards],
  );

  const estimatedMinutes = Math.max(1, Math.round(queue.length * 0.5));

  return {
    dueCards,
    dueCount: dueCards.length,
    newCards,
    queue,
    isLoading: dueLoading || newLoading,
    estimatedMinutes,
  };
}

// ---------------------------------------------------------------------------
// useLessonProgress -- all lesson progress for dashboard
// ---------------------------------------------------------------------------

export interface UseLessonProgressReturn {
  allProgress: UserLessonProgress[];
  isLoading: boolean;
  statusCounts: Record<UserLessonProgress['status'], number>;
  getProgress: (lessonId: string) => UserLessonProgress | undefined;
}

export function useLessonProgress(): UseLessonProgressReturn {
  const { data: rawData, isLoading: swrLoading } = useSWR(
    '/api/lesson-progress',
    fetcher<Record<string, unknown>[]>,
  );

  const allProgress = useMemo(
    () => (rawData ?? []).map(mapLessonProgress),
    [rawData],
  );

  const isLoading = swrLoading;

  const statusCounts = useMemo(() => {
    const counts: Record<UserLessonProgress['status'], number> = {
      locked: 0,
      available: 0,
      'in-progress': 0,
      completed: 0,
      mastered: 0,
    };
    for (const p of allProgress) {
      counts[p.status]++;
    }
    return counts;
  }, [allProgress]);

  const progressMap = useMemo(() => {
    const map = new Map<string, UserLessonProgress>();
    for (const p of allProgress) {
      map.set(p.lessonId, p);
    }
    return map;
  }, [allProgress]);

  const getProgress = useCallback(
    (lessonId: string) => progressMap.get(lessonId),
    [progressMap],
  );

  return { allProgress, isLoading, statusCounts, getProgress };
}

// ---------------------------------------------------------------------------
// useSettings -- user preferences
// ---------------------------------------------------------------------------

export interface UseSettingsReturn {
  settings: UserSettings;
  isLoading: boolean;
  updateSettings: (
    update: Partial<UserSettings>,
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const { data: rawData, isLoading: swrLoading } = useSWR(
    '/api/settings',
    fetcher<Record<string, unknown>>,
  );

  const settings = rawData ? mapSettings(rawData) : undefined;
  const isLoading = swrLoading;
  const resolved = settings ?? DEFAULT_USER_SETTINGS;

  const updateSettingsHook = useCallback(
    async (update: Partial<UserSettings>) => {
      await apiUpdateSettings(update);
      globalMutate('/api/settings');
    },
    [],
  );

  const resetSettings = useCallback(async () => {
    await apiUpdateSettings(DEFAULT_USER_SETTINGS);
    globalMutate('/api/settings');
  }, []);

  return {
    settings: resolved,
    isLoading,
    updateSettings: updateSettingsHook,
    resetSettings,
  };
}

// ---------------------------------------------------------------------------
// useReviewStats -- aggregate review statistics
// ---------------------------------------------------------------------------

export interface UseReviewStatsReturn {
  todayCount: number;
  totalCount: number;
  isLoading: boolean;
}

export function useReviewStats(): UseReviewStatsReturn {
  const { data: todayData, isLoading: todayLoading } = useSWR(
    '/api/review-logs/today-count',
    fetcher<{ count: number }>,
  );

  const { data: totalData, isLoading: totalLoading } = useSWR(
    '/api/review-logs/count',
    fetcher<{ count: number }>,
  );

  return {
    todayCount: todayData?.count ?? 0,
    totalCount: totalData?.count ?? 0,
    isLoading: todayLoading || totalLoading,
  };
}

// ---------------------------------------------------------------------------
// useAllCardStates -- for progress page
// ---------------------------------------------------------------------------

export interface UseAllCardStatesReturn {
  allCardStates: UserCardState[];
  isLoading: boolean;
}

export function useAllCardStates(): UseAllCardStatesReturn {
  const { data: rawData, isLoading: swrLoading } = useSWR(
    '/api/card-states',
    fetcher<Record<string, unknown>[]>,
  );

  const allCardStates = useMemo(
    () => (rawData ?? []).map(mapCardState),
    [rawData],
  );

  return { allCardStates, isLoading: swrLoading };
}

// ---------------------------------------------------------------------------
// useReviewLogsByRange -- for progress page charts
// ---------------------------------------------------------------------------

export interface UseReviewLogsByRangeReturn {
  logs: ReviewLog[];
  isLoading: boolean;
}

function mapReviewLog(row: Record<string, unknown>): ReviewLog {
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

export function useReviewLogsByRange(since: Date): UseReviewLogsByRangeReturn {
  const sinceIso = useMemo(() => since.toISOString(), [since]);

  const { data: rawData, isLoading: swrLoading } = useSWR(
    `/api/review-logs?since=${sinceIso}`,
    fetcher<Record<string, unknown>[]>,
  );

  const logs = useMemo(
    () => (rawData ?? []).map(mapReviewLog),
    [rawData],
  );

  return { logs, isLoading: swrLoading };
}
