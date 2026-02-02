/**
 * Component barrel exports.
 *
 * Import components from '@/components' for convenience:
 *   import { Button, Card, ReviewCard } from '@/components';
 */

// ---------------------------------------------------------------------------
// UI primitives
// ---------------------------------------------------------------------------

export { Button } from './ui/Button';
export type { ButtonProps } from './ui/Button';

export { Card } from './ui/Card';
export type { CardProps } from './ui/Card';

export { ProgressBar } from './ui/ProgressBar';
export type { ProgressBarProps } from './ui/ProgressBar';

export { Badge } from './ui/Badge';
export type { BadgeProps } from './ui/Badge';

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------

export { ReviewCard } from './review/ReviewCard';
export type { ReviewCardProps, Rating } from './review/ReviewCard';

export { ReviewSession } from './review/ReviewSession';
export type {
  ReviewSessionProps,
  ReviewSessionCard,
  SessionStats,
} from './review/ReviewSession';

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export { QuizCard } from './quiz/QuizCard';
export type { QuizCardProps } from './quiz/QuizCard';

export { QuizSession } from './quiz/QuizSession';
export type { QuizSessionProps } from './quiz/QuizSession';

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

export { LessonContent } from './lesson/LessonContent';
export type {
  LessonContentProps,
  LessonSection,
} from './lesson/LessonContent';

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export { Sidebar } from './navigation/Sidebar';
export type { SidebarProps, SidebarModule } from './navigation/Sidebar';

export { Header } from './navigation/Header';
export type { HeaderProps } from './navigation/Header';

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export { ModuleCard } from './dashboard/ModuleCard';
export type {
  ModuleCardProps,
  ModuleCardLesson,
} from './dashboard/ModuleCard';

export { StatsBar } from './dashboard/StatsBar';
export type { StatsBarProps } from './dashboard/StatsBar';

// ---------------------------------------------------------------------------
// Flashcard (simplified two-button review)
// ---------------------------------------------------------------------------

export { FlashcardStack } from './flashcard/FlashcardStack';
export type { FlashcardStackProps, FlashcardStackStats } from './flashcard/FlashcardStack';

export { Flashcard } from './flashcard/Flashcard';
export type { FlashcardProps } from './flashcard/Flashcard';
