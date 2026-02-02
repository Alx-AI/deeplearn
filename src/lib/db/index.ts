/**
 * Database layer barrel export.
 *
 * Usage:
 *   import { useSettings, useReviewQueue } from '@/lib/db';
 */

// Schema types and defaults
export type {
  Module,
  Lesson,
  ReviewCard,
  QuizQuestion,
  UserCardState,
  ReviewLog,
  UserLessonProgress,
  UserSettings,
} from './schema';

export {
  DEFAULT_USER_SETTINGS,
  createDefaultLessonProgress,
} from './schema';

// API client helpers
export {
  getOrCreateCardState,
  updateCardAfterReview,
  getCardsDueForReview,
  getNewCards,
  countCardsDue,
  getAllCardStates,
  getOrCreateLessonProgress,
  updateLessonProgress,
  getAllLessonProgress,
  getOrCreateSettings,
  updateSettings,
  getCardReviewHistory,
  getLessonReviewHistory,
  getTodayReviewCount,
  exportAllData,
  clearAllData,
} from './api-client';

// React hooks (client-side only)
export {
  useUserProgress,
  useCardState,
  useReviewQueue,
  useLessonProgress,
  useSettings,
  useReviewStats,
  useAllCardStates,
  useReviewLogsByRange,
} from './hooks';

export type {
  UseUserProgressReturn,
  UseCardStateReturn,
  UseReviewQueueReturn,
  UseLessonProgressReturn,
  UseSettingsReturn,
  UseReviewStatsReturn,
  UseAllCardStatesReturn,
  UseReviewLogsByRangeReturn,
} from './hooks';
