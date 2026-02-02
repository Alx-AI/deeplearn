/**
 * Global application state store (Zustand).
 *
 * Manages ephemeral UI state that does not need to be persisted to IndexedDB.
 * Persistent data (user progress, card states, settings) lives in Dexie --
 * this store handles navigation context, active session tracking, and
 * transient UI flags.
 *
 * Usage:
 *   import { useAppStore } from '@/lib/store';
 *   const sidebarOpen = useAppStore((s) => s.sidebarOpen);
 *   const toggleSidebar = useAppStore((s) => s.toggleSidebar);
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AppState {
  // -- Navigation --
  /** Whether the sidebar / drawer is open (desktop: always visible; mobile: toggle) */
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // -- Current learning context --
  /** The module the learner is currently working in */
  currentModuleId: string | null;
  /** The lesson the learner is currently viewing */
  currentLessonId: string | null;
  /** Set the current module + lesson context (e.g. when navigating to a lesson) */
  setCurrentLesson: (moduleId: string, lessonId: string) => void;
  /** Clear the current lesson context (e.g. when leaving lesson view) */
  clearCurrentLesson: () => void;

  // -- Review session --
  /** Whether a dedicated review session is in progress */
  isReviewSessionActive: boolean;
  /** Number of cards queued in the active review session */
  reviewSessionCardCount: number;
  /** Begin a new review session with the given card count */
  startReviewSession: (cardCount: number) => void;
  /** End the current review session */
  endReviewSession: () => void;

  // -- Quiz --
  /** Whether an end-of-lesson quiz is in progress */
  isQuizActive: boolean;
  /** Begin a quiz */
  startQuiz: () => void;
  /** End the quiz */
  endQuiz: () => void;

  // -- UI --
  /** How far the learner has scrolled through the current reading (0-1) */
  readingScrollProgress: number;
  /** Update the scroll progress for the current reading */
  setReadingScrollProgress: (progress: number) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState>((set) => ({
  // -- Navigation --
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // -- Current context --
  currentModuleId: null,
  currentLessonId: null,
  setCurrentLesson: (moduleId, lessonId) =>
    set({ currentModuleId: moduleId, currentLessonId: lessonId }),
  clearCurrentLesson: () =>
    set({ currentModuleId: null, currentLessonId: null }),

  // -- Review session --
  isReviewSessionActive: false,
  reviewSessionCardCount: 0,
  startReviewSession: (cardCount) =>
    set({ isReviewSessionActive: true, reviewSessionCardCount: cardCount }),
  endReviewSession: () =>
    set({ isReviewSessionActive: false, reviewSessionCardCount: 0 }),

  // -- Quiz --
  isQuizActive: false,
  startQuiz: () => set({ isQuizActive: true }),
  endQuiz: () => set({ isQuizActive: false }),

  // -- UI --
  readingScrollProgress: 0,
  setReadingScrollProgress: (progress) =>
    set({ readingScrollProgress: Math.min(1, Math.max(0, progress)) }),
}));
