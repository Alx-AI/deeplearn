/**
 * Data model types for the Deep Learning Learning Platform.
 *
 * These interfaces define the shape of all data stored in IndexedDB (via Dexie)
 * and referenced throughout the application. The types align with the FSRS
 * spaced-repetition algorithm (ts-fsrs) and the master plan's data model.
 *
 * Entity relationships:
 *   Module (1) ---< (many) Lesson
 *   Lesson (1) ---< (many) ReviewCard
 *   Lesson (1) ---< (many) QuizQuestion
 *   ReviewCard (1) ---< (many) UserCardState (one per user -- local-first, so exactly one)
 *   ReviewCard (1) ---< (many) ReviewLog
 *   Lesson (1) ---< (many) UserLessonProgress
 */

import type { Card as FSRSCard, State as FSRSState } from 'ts-fsrs';

// ---------------------------------------------------------------------------
// Core content types (defined at build time, loaded from static JSON/MDX)
// ---------------------------------------------------------------------------

/** A high-level grouping of lessons (e.g. "Foundations", "Computer Vision"). */
export interface Module {
  /** Unique module identifier, e.g. "mod-1" */
  id: string;
  /** Human-readable title */
  title: string;
  /** Brief overview shown on the module card */
  description: string;
  /** Display order (1-6) */
  order: number;
  /** Ordered list of lesson IDs belonging to this module */
  lessonIds: string[];
}

/** A single 15-minute learning unit within a module. */
export interface Lesson {
  /** Unique lesson identifier, e.g. "1.1" */
  id: string;
  /** Parent module reference */
  moduleId: string;
  /** Human-readable title */
  title: string;
  /** Short subtitle or descriptor */
  description: string;
  /** Display order within the module */
  order: number;
  /** Source chapter section references from Chollet's book */
  sourceSections: string[];
  /** Lesson IDs that should be completed before this one */
  prerequisites: string[];
  /** What the learner will be able to do after this lesson */
  learningObjectives: string[];
  /** The 3-4 new concepts introduced (respecting Miller's Law) */
  keyConcepts: string[];
  /** Target completion time in minutes (default: 15) */
  estimatedMinutes: number;
  /** Path to the MDX content file, relative to content root */
  contentPath: string;
}

/**
 * A spaced-repetition review card embedded within a lesson.
 *
 * Cards are the atomic unit of the mnemonic medium: expert-authored prompts
 * that test recall, comprehension, or application of a single concept.
 */
export interface ReviewCard {
  /** Globally unique card identifier */
  id: string;
  /** The lesson this card belongs to */
  lessonId: string;
  /** The question or prompt text (supports Markdown and LaTeX) */
  prompt: string;
  /** The answer text (supports Markdown and LaTeX) */
  answer: string;
  /** The type of recall demanded by this card */
  type: 'recall' | 'concept' | 'application' | 'cloze';
  /** Bloom's taxonomy level targeted by this card */
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze';
  /** Concept tags for filtering and interleaving, e.g. ["backpropagation", "chain-rule"] */
  tags: string[];
  /** Display order within the lesson */
  order: number;
}

/**
 * An end-of-lesson quiz question.
 *
 * Quiz questions assess understanding after reading and inline review.
 * Wrong answers trigger targeted re-learning by linking back to review cards.
 */
export interface QuizQuestion {
  /** Globally unique question identifier */
  id: string;
  /** The lesson this question assesses */
  lessonId: string;
  /** The question text */
  question: string;
  /** Question format */
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  /** Answer options (for multiple-choice questions) */
  options?: string[];
  /** The correct answer (must match one of options for multiple-choice) */
  correctAnswer: string;
  /** Explanation shown after answering (especially on wrong answers) */
  explanation: string;
  /** ReviewCard IDs to resurface if the learner answers incorrectly */
  relatedCardIds: string[];
  /** Display order within the quiz */
  order: number;
}

// ---------------------------------------------------------------------------
// User progress types (persisted in IndexedDB)
// ---------------------------------------------------------------------------

/**
 * The FSRS memory state for a single review card.
 *
 * This is the core data structure that drives the spaced-repetition scheduler.
 * Each card the user has encountered gets exactly one UserCardState record.
 * The `fsrsCard` field holds the full ts-fsrs Card object used for scheduling.
 */
export interface UserCardState {
  /** ReviewCard reference -- primary key */
  cardId: string;
  /** When this card is next due for review */
  due: Date;
  /** FSRS stability: time in days for retrievability to drop to 90% */
  stability: number;
  /** FSRS difficulty rating (1-10) */
  difficulty: number;
  /** Days since the last review (deprecated in ts-fsrs v6, kept for compat) */
  elapsed_days: number;
  /** Days until next scheduled review */
  scheduled_days: number;
  /** Total number of reviews */
  reps: number;
  /** Number of times forgotten after learning */
  lapses: number;
  /** FSRS state: 0=New, 1=Learning, 2=Review, 3=Relearning */
  state: FSRSState;
  /** Timestamp of the most recent review, null if never reviewed */
  lastReview: Date | null;
  /** The full ts-fsrs Card object, serialised for scheduling calls */
  fsrsCard: FSRSCard;
}

/**
 * An append-only log entry for a single review interaction.
 *
 * Every time the learner rates a card (during inline review, quiz, or
 * dedicated review session), a ReviewLog entry is appended. This immutable
 * history supports analytics, FSRS parameter optimization, and data export.
 */
export interface ReviewLog {
  /** Auto-incremented primary key */
  id?: number;
  /** ReviewCard reference */
  cardId: string;
  /** Lesson in which this review occurred (for context) */
  lessonId: string;
  /** Learner's self-rating: 1=Again, 2=Hard, 3=Good, 4=Easy */
  rating: 1 | 2 | 3 | 4;
  /** When the review occurred */
  timestamp: Date;
  /** Interval scheduled after this review (in days) */
  scheduledDays: number;
  /** Days elapsed since the previous review */
  elapsedDays: number;
  /** FSRS state at time of review */
  state: number;
  /** Time the learner spent on this card (milliseconds) */
  duration: number;
  /** Where the review occurred */
  context: 'inline' | 'quiz' | 'review-session';
}

/**
 * Tracks the learner's progress through a single lesson.
 *
 * Status transitions:
 *   locked -> available -> in-progress -> completed -> mastered
 */
export interface UserLessonProgress {
  /** Lesson reference -- primary key */
  lessonId: string;
  /** Current progress status */
  status: 'locked' | 'available' | 'in-progress' | 'completed' | 'mastered';
  /** Section IDs the learner has scrolled through / read */
  sectionsRead: string[];
  /** Number of end-of-lesson quiz attempts */
  quizAttempts: number;
  /** Best quiz score achieved (0-100) */
  bestQuizScore: number;
  /** Last time the learner opened this lesson */
  lastAccessedAt: Date | null;
  /** When the lesson was first completed */
  completedAt: Date | null;
  /** Cumulative time spent in this lesson (milliseconds) */
  totalTimeSpent: number;
}

/**
 * User-configurable settings.
 *
 * There is always exactly one record with id='default'.
 * All fields have sensible defaults so the platform works on first visit.
 */
export interface UserSettings {
  /** Color theme preference */
  theme: 'light' | 'dark' | 'system';
  /** Target number of reviews per day */
  dailyReviewGoal: number;
  /** Maximum new cards introduced per day */
  newCardsPerDay: number;
  /** Reading text size preference */
  fontSize: 'small' | 'medium' | 'large';
  /** Respect prefers-reduced-motion */
  reducedMotion: boolean;
  /** FSRS desired retention (0.7 - 0.97, default 0.9) */
  desiredRetention: number;
}

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

/** Sensible defaults for first-visit users. */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  dailyReviewGoal: 50,
  newCardsPerDay: 20,
  fontSize: 'medium',
  reducedMotion: false,
  desiredRetention: 0.9,
};

/** Create a default UserLessonProgress for a lesson not yet visited. */
export function createDefaultLessonProgress(
  lessonId: string,
  status: UserLessonProgress['status'] = 'available',
): UserLessonProgress {
  return {
    lessonId,
    status,
    sectionsRead: [],
    quizAttempts: 0,
    bestQuizScore: 0,
    lastAccessedAt: null,
    completedAt: null,
    totalTimeSpent: 0,
  };
}
