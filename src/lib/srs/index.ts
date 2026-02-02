/**
 * Spaced Repetition System (SRS) -- barrel export.
 *
 * Import everything from '@/lib/srs' for convenience:
 *
 *   import { srsEngine, ReviewSession, AdaptiveQuiz, calculateLessonMastery } from '@/lib/srs';
 */

// Core engine
export { SRSEngine, srsEngine, Rating, State } from './engine';
export type { Card, Grade, RecordLogItem } from './engine';

// Review session
export { ReviewSession } from './review-session';
export type {
  SessionCard,
  ReviewSessionConfig,
  RatingResult,
  SessionStatistics,
} from './review-session';

// Adaptive quiz
export {
  AdaptiveQuiz,
  MASTERY_THRESHOLDS as QUIZ_MASTERY_THRESHOLDS,
  PASSING_SCORE,
} from './adaptive-quiz';
export type {
  AdaptiveQuizConfig,
  AnswerResult,
  QuizSummary,
  QuestionResult,
  QuizMastery,
} from './adaptive-quiz';

// Mastery calculations
export {
  calculateCardMastery,
  calculateLessonMastery,
  calculateModuleMastery,
  calculateOverallMastery,
  MASTERY_THRESHOLDS,
  MASTERY_LABELS,
  MASTERY_COLORS,
  masteryToScore,
} from './mastery';
export type {
  MasteryLevel,
  CardMastery,
  LessonMastery,
  ModuleMastery,
  OverallMastery,
} from './mastery';
