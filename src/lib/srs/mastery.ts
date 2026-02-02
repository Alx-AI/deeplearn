/**
 * Mastery calculation system.
 *
 * Computes mastery levels at multiple granularities:
 *   - Per-card:   based on FSRS state (New, Learning, Review, Relearning)
 *   - Per-lesson: based on card states + quiz scores
 *   - Per-module: aggregate of lesson mastery
 *   - Overall:    aggregate of all modules
 *
 * Mastery levels (from lowest to highest):
 *   'new'        -- No cards reviewed
 *   'learning'   -- <50% of cards in Review state
 *   'familiar'   -- 50-80% of cards in Review state
 *   'proficient' -- 80%+ cards in Review state AND quiz score >= 80%
 *   'mastered'   -- 90%+ cards in Review state with stability > 30 days
 */

import { State } from 'ts-fsrs';
import type { Card } from 'ts-fsrs';

import type {
  UserCardState,
  UserLessonProgress,
} from '../db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MasteryLevel =
  | 'new'
  | 'learning'
  | 'familiar'
  | 'proficient'
  | 'mastered';

/** Mastery information for a single review card. */
export interface CardMastery {
  cardId: string;
  level: MasteryLevel;
  /** FSRS state name for display */
  stateName: 'new' | 'learning' | 'review' | 'relearning';
  /** Probability of recall right now (0-1) */
  retrievability: number;
  /** Stability in days (time for retrievability to decay to 90%) */
  stabilityDays: number;
  /** Whether this card is currently due for review */
  isDue: boolean;
}

/** Mastery information for a lesson. */
export interface LessonMastery {
  lessonId: string;
  level: MasteryLevel;
  /** Fraction of cards in each FSRS state */
  stateDistribution: {
    new: number;
    learning: number;
    review: number;
    relearning: number;
  };
  /** Best quiz score (0-100) */
  quizScore: number;
  /** Number of quiz attempts */
  quizAttempts: number;
  /** Total number of review cards in this lesson */
  totalCards: number;
  /** Number of cards in Review state */
  reviewStateCards: number;
  /** Average stability (days) across all cards */
  averageStabilityDays: number;
  /** Overall retrievability (average across all cards) */
  averageRetrievability: number;
  /** Individual card mastery entries */
  cards: CardMastery[];
}

/** Mastery information for a module (aggregate of lessons). */
export interface ModuleMastery {
  moduleId: string;
  level: MasteryLevel;
  /** Number of lessons at each mastery level */
  lessonDistribution: Record<MasteryLevel, number>;
  /** Total lessons in the module */
  totalLessons: number;
  /** Number of lessons completed (reading + quiz attempted) */
  completedLessons: number;
  /** Average quiz score across all lessons */
  averageQuizScore: number;
  /** Fraction of all cards across all lessons in Review state */
  overallReviewFraction: number;
  /** Per-lesson mastery */
  lessons: LessonMastery[];
}

/** Overall mastery (aggregate of all modules). */
export interface OverallMastery {
  level: MasteryLevel;
  /** Number of modules at each mastery level */
  moduleDistribution: Record<MasteryLevel, number>;
  /** Total modules */
  totalModules: number;
  /** Total lessons across all modules */
  totalLessons: number;
  /** Total review cards across all modules */
  totalCards: number;
  /** Overall fraction of cards in Review state */
  overallReviewFraction: number;
  /** Average quiz score across everything */
  averageQuizScore: number;
  /** Average stability in days across all cards */
  averageStabilityDays: number;
  /** Per-module mastery */
  modules: ModuleMastery[];
}

// ---------------------------------------------------------------------------
// Thresholds
// ---------------------------------------------------------------------------

export const MASTERY_THRESHOLDS = {
  /** Fraction of cards in Review state needed for "familiar" */
  familiarReviewFraction: 0.5,
  /** Fraction of cards in Review state needed for "proficient" */
  proficientReviewFraction: 0.8,
  /** Quiz score needed for "proficient" (0-100) */
  proficientQuizScore: 80,
  /** Fraction of cards in Review state needed for "mastered" */
  masteredReviewFraction: 0.9,
  /** Minimum stability in days for cards to count as "mastered" */
  masteredStabilityDays: 30,
} as const;

// ---------------------------------------------------------------------------
// Card-level mastery
// ---------------------------------------------------------------------------

/**
 * Calculate mastery for a single review card.
 */
export function calculateCardMastery(
  cardId: string,
  state: UserCardState | null,
  now?: Date,
): CardMastery {
  if (!state) {
    return {
      cardId,
      level: 'new',
      stateName: 'new',
      retrievability: 0,
      stabilityDays: 0,
      isDue: false,
    };
  }

  const currentTime = now ?? new Date();
  const card = state.fsrsCard;
  const isDue = new Date(state.due) <= currentTime;

  // Map FSRS State enum to our state name
  const stateName = mapStateName(card.state);

  // Calculate retrievability (for New cards, it's 0)
  let retrievability = 0;
  if (card.state !== State.New && card.stability > 0 && card.last_review) {
    const elapsedDays =
      (currentTime.getTime() - new Date(card.last_review).getTime()) /
      (1000 * 60 * 60 * 24);
    // Approximate retrievability using the FSRS power forgetting curve
    // R(t) = (1 + FACTOR * t / (9 * S))^DECAY
    // Using FSRS5 defaults: DECAY = -0.5, FACTOR = 19/81
    const factor = 19 / 81;
    const decay = -0.5;
    retrievability = Math.pow(
      1 + (factor * elapsedDays) / (9 * card.stability),
      decay,
    );
    retrievability = Math.max(0, Math.min(1, retrievability));
  }

  // Determine card-level mastery
  let level: MasteryLevel;
  if (card.state === State.New) {
    level = 'new';
  } else if (
    card.state === State.Learning ||
    card.state === State.Relearning
  ) {
    level = 'learning';
  } else if (card.stability >= MASTERY_THRESHOLDS.masteredStabilityDays) {
    level = 'mastered';
  } else if (card.stability >= 7) {
    level = 'proficient';
  } else {
    level = 'familiar';
  }

  return {
    cardId,
    level,
    stateName,
    retrievability,
    stabilityDays: card.stability,
    isDue,
  };
}

// ---------------------------------------------------------------------------
// Lesson-level mastery
// ---------------------------------------------------------------------------

/**
 * Calculate mastery for a lesson based on its cards and quiz performance.
 */
export function calculateLessonMastery(
  lessonId: string,
  cardStates: UserCardState[],
  lessonProgress: UserLessonProgress | null,
  totalCardCount: number,
  now?: Date,
): LessonMastery {
  const currentTime = now ?? new Date();

  // Calculate per-card mastery
  const cards = cardStates.map((state) =>
    calculateCardMastery(state.cardId, state, currentTime),
  );

  // Add entries for cards that have never been reviewed (no UserCardState)
  const reviewedCardIds = new Set(cardStates.map((s) => s.cardId));
  const unreviewedCount = totalCardCount - reviewedCardIds.size;

  // State distribution
  const newCount =
    cards.filter((c) => c.stateName === 'new').length + unreviewedCount;
  const learningCount = cards.filter(
    (c) => c.stateName === 'learning',
  ).length;
  const reviewCount = cards.filter((c) => c.stateName === 'review').length;
  const relearningCount = cards.filter(
    (c) => c.stateName === 'relearning',
  ).length;

  const effectiveTotalCards = Math.max(totalCardCount, 1);

  const stateDistribution = {
    new: newCount / effectiveTotalCards,
    learning: learningCount / effectiveTotalCards,
    review: reviewCount / effectiveTotalCards,
    relearning: relearningCount / effectiveTotalCards,
  };

  const reviewFraction = reviewCount / effectiveTotalCards;

  // Quiz data
  const quizScore = lessonProgress?.bestQuizScore ?? 0;
  const quizAttempts = lessonProgress?.quizAttempts ?? 0;

  // Averages across reviewed cards
  const averageStabilityDays =
    cardStates.length > 0
      ? cardStates.reduce((sum, s) => sum + s.stability, 0) /
        cardStates.length
      : 0;

  const averageRetrievability =
    cards.length > 0
      ? cards.reduce((sum, c) => sum + c.retrievability, 0) / cards.length
      : 0;

  // Determine lesson mastery level
  const level = determineLessonMastery(
    reviewFraction,
    averageStabilityDays,
    quizScore,
    cardStates.length,
    totalCardCount,
  );

  return {
    lessonId,
    level,
    stateDistribution,
    quizScore,
    quizAttempts,
    totalCards: totalCardCount,
    reviewStateCards: reviewCount,
    averageStabilityDays,
    averageRetrievability,
    cards,
  };
}

// ---------------------------------------------------------------------------
// Module-level mastery
// ---------------------------------------------------------------------------

/**
 * Calculate mastery for a module (aggregate of its lessons).
 */
export function calculateModuleMastery(
  moduleId: string,
  lessonMasteries: LessonMastery[],
  completedLessonCount: number,
): ModuleMastery {
  const totalLessons = lessonMasteries.length;

  // Distribution of lesson mastery levels
  const lessonDistribution: Record<MasteryLevel, number> = {
    new: 0,
    learning: 0,
    familiar: 0,
    proficient: 0,
    mastered: 0,
  };
  for (const lm of lessonMasteries) {
    lessonDistribution[lm.level]++;
  }

  // Average quiz score across lessons that have been attempted
  const attemptedLessons = lessonMasteries.filter(
    (lm) => lm.quizAttempts > 0,
  );
  const averageQuizScore =
    attemptedLessons.length > 0
      ? attemptedLessons.reduce((sum, lm) => sum + lm.quizScore, 0) /
        attemptedLessons.length
      : 0;

  // Overall review fraction across all cards in the module
  const totalCards = lessonMasteries.reduce(
    (sum, lm) => sum + lm.totalCards,
    0,
  );
  const totalReviewCards = lessonMasteries.reduce(
    (sum, lm) => sum + lm.reviewStateCards,
    0,
  );
  const overallReviewFraction =
    totalCards > 0 ? totalReviewCards / totalCards : 0;

  // Determine module mastery
  const level = determineModuleMastery(
    lessonMasteries,
    overallReviewFraction,
    averageQuizScore,
  );

  return {
    moduleId,
    level,
    lessonDistribution,
    totalLessons,
    completedLessons: completedLessonCount,
    averageQuizScore,
    overallReviewFraction,
    lessons: lessonMasteries,
  };
}

// ---------------------------------------------------------------------------
// Overall mastery
// ---------------------------------------------------------------------------

/**
 * Calculate overall mastery across all modules.
 */
export function calculateOverallMastery(
  moduleMasteries: ModuleMastery[],
): OverallMastery {
  const totalModules = moduleMasteries.length;

  // Distribution of module mastery levels
  const moduleDistribution: Record<MasteryLevel, number> = {
    new: 0,
    learning: 0,
    familiar: 0,
    proficient: 0,
    mastered: 0,
  };
  for (const mm of moduleMasteries) {
    moduleDistribution[mm.level]++;
  }

  // Aggregate stats
  const totalLessons = moduleMasteries.reduce(
    (sum, mm) => sum + mm.totalLessons,
    0,
  );
  const totalCards = moduleMasteries.reduce(
    (sum, mm) =>
      sum + mm.lessons.reduce((ls, lm) => ls + lm.totalCards, 0),
    0,
  );
  const totalReviewCards = moduleMasteries.reduce(
    (sum, mm) =>
      sum + mm.lessons.reduce((ls, lm) => ls + lm.reviewStateCards, 0),
    0,
  );
  const overallReviewFraction =
    totalCards > 0 ? totalReviewCards / totalCards : 0;

  // Average quiz score
  const allLessons = moduleMasteries.flatMap((mm) => mm.lessons);
  const attemptedLessons = allLessons.filter((lm) => lm.quizAttempts > 0);
  const averageQuizScore =
    attemptedLessons.length > 0
      ? attemptedLessons.reduce((sum, lm) => sum + lm.quizScore, 0) /
        attemptedLessons.length
      : 0;

  // Average stability
  const allCards = allLessons.flatMap((lm) => lm.cards);
  const averageStabilityDays =
    allCards.length > 0
      ? allCards.reduce((sum, c) => sum + c.stabilityDays, 0) /
        allCards.length
      : 0;

  // Determine overall mastery
  const level = determineOverallMastery(
    moduleMasteries,
    overallReviewFraction,
    averageQuizScore,
  );

  return {
    level,
    moduleDistribution,
    totalModules,
    totalLessons,
    totalCards,
    overallReviewFraction,
    averageQuizScore,
    averageStabilityDays,
    modules: moduleMasteries,
  };
}

// ---------------------------------------------------------------------------
// Utility: mastery level labels and colours
// ---------------------------------------------------------------------------

/** Human-readable labels for mastery levels. */
export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  new: 'New',
  learning: 'Learning',
  familiar: 'Familiar',
  proficient: 'Proficient',
  mastered: 'Mastered',
};

/** Mastery level badge colours using CSS custom properties for dark mode compatibility. */
export const MASTERY_COLORS: Record<
  MasteryLevel,
  { bg: string; text: string; border: string }
> = {
  new: {
    bg: 'bg-[var(--color-mastery-new-bg)]',
    text: 'text-[var(--color-mastery-new-text)]',
    border: 'border-[var(--color-mastery-new-border)]',
  },
  learning: {
    bg: 'bg-[var(--color-mastery-learning-bg)]',
    text: 'text-[var(--color-mastery-learning-text)]',
    border: 'border-[var(--color-mastery-learning-border)]',
  },
  familiar: {
    bg: 'bg-[var(--color-mastery-familiar-bg)]',
    text: 'text-[var(--color-mastery-familiar-text)]',
    border: 'border-[var(--color-mastery-familiar-border)]',
  },
  proficient: {
    bg: 'bg-[var(--color-mastery-proficient-bg)]',
    text: 'text-[var(--color-mastery-proficient-text)]',
    border: 'border-[var(--color-mastery-proficient-border)]',
  },
  mastered: {
    bg: 'bg-[var(--color-mastery-mastered-bg)]',
    text: 'text-[var(--color-mastery-mastered-text)]',
    border: 'border-[var(--color-mastery-mastered-border)]',
  },
};

/**
 * Get a numeric mastery score (0-100) from a MasteryLevel.
 * Useful for progress bars and sorting.
 */
export function masteryToScore(level: MasteryLevel): number {
  switch (level) {
    case 'new':        return 0;
    case 'learning':   return 25;
    case 'familiar':   return 50;
    case 'proficient': return 75;
    case 'mastered':   return 100;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function mapStateName(
  state: State,
): 'new' | 'learning' | 'review' | 'relearning' {
  switch (state) {
    case State.New:        return 'new';
    case State.Learning:   return 'learning';
    case State.Review:     return 'review';
    case State.Relearning: return 'relearning';
    default:               return 'new';
  }
}

/**
 * Determine lesson mastery from card and quiz metrics.
 */
function determineLessonMastery(
  reviewFraction: number,
  averageStabilityDays: number,
  quizScore: number,
  reviewedCardCount: number,
  totalCardCount: number,
): MasteryLevel {
  // No cards reviewed at all -> "new"
  if (reviewedCardCount === 0) return 'new';

  // Mastered: 90%+ review state + stability > 30 days
  if (
    reviewFraction >= MASTERY_THRESHOLDS.masteredReviewFraction &&
    averageStabilityDays >= MASTERY_THRESHOLDS.masteredStabilityDays
  ) {
    return 'mastered';
  }

  // Proficient: 80%+ review state + quiz score >= 80
  if (
    reviewFraction >= MASTERY_THRESHOLDS.proficientReviewFraction &&
    quizScore >= MASTERY_THRESHOLDS.proficientQuizScore
  ) {
    return 'proficient';
  }

  // Familiar: 50-80% review state
  if (reviewFraction >= MASTERY_THRESHOLDS.familiarReviewFraction) {
    return 'familiar';
  }

  // Learning: at least some cards reviewed but <50% in review state
  return 'learning';
}

/**
 * Determine module mastery from its constituent lesson masteries.
 */
function determineModuleMastery(
  lessons: LessonMastery[],
  overallReviewFraction: number,
  averageQuizScore: number,
): MasteryLevel {
  if (lessons.length === 0) return 'new';

  // If all lessons are new, module is new
  if (lessons.every((l) => l.level === 'new')) return 'new';

  // Count lesson levels
  const masteredCount = lessons.filter(
    (l) => l.level === 'mastered',
  ).length;
  const proficientOrBetter = lessons.filter(
    (l) => l.level === 'proficient' || l.level === 'mastered',
  ).length;
  const familiarOrBetter = lessons.filter(
    (l) =>
      l.level === 'familiar' ||
      l.level === 'proficient' ||
      l.level === 'mastered',
  ).length;

  const total = lessons.length;

  // Mastered: 90%+ lessons mastered
  if (masteredCount / total >= 0.9) return 'mastered';

  // Proficient: 80%+ lessons proficient or better + quiz score >= 80
  if (
    proficientOrBetter / total >= 0.8 &&
    averageQuizScore >= MASTERY_THRESHOLDS.proficientQuizScore
  ) {
    return 'proficient';
  }

  // Familiar: 50%+ lessons familiar or better
  if (familiarOrBetter / total >= 0.5) return 'familiar';

  // Learning: at least one lesson is beyond "new"
  return 'learning';
}

/**
 * Determine overall mastery from all module masteries.
 */
function determineOverallMastery(
  modules: ModuleMastery[],
  overallReviewFraction: number,
  averageQuizScore: number,
): MasteryLevel {
  if (modules.length === 0) return 'new';

  // If all modules are new, overall is new
  if (modules.every((m) => m.level === 'new')) return 'new';

  const masteredCount = modules.filter(
    (m) => m.level === 'mastered',
  ).length;
  const proficientOrBetter = modules.filter(
    (m) => m.level === 'proficient' || m.level === 'mastered',
  ).length;
  const familiarOrBetter = modules.filter(
    (m) =>
      m.level === 'familiar' ||
      m.level === 'proficient' ||
      m.level === 'mastered',
  ).length;

  const total = modules.length;

  if (masteredCount / total >= 0.9) return 'mastered';
  if (
    proficientOrBetter / total >= 0.8 &&
    averageQuizScore >= MASTERY_THRESHOLDS.proficientQuizScore
  ) {
    return 'proficient';
  }
  if (familiarOrBetter / total >= 0.5) return 'familiar';

  return 'learning';
}
