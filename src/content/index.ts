/**
 * Content layer barrel export.
 *
 * Provides a unified API for accessing all static content: modules, lessons,
 * lesson prose, review cards, and quiz questions. Components should import
 * from `@/content` rather than reaching into subdirectories directly.
 *
 * Review cards and quiz questions are imported from dedicated content files
 * (`review-cards.ts` and `quiz-questions.ts`). These may start as empty
 * placeholders and are progressively populated as content is authored.
 */

import type { Lesson, ReviewCard, QuizQuestion } from '@/lib/db/schema';
import { modules } from './modules';
import { lessons } from './lessons';
import { getLessonContent, lessonContentMap } from './lessons/index';
import type { LessonContentData, LessonSection, CodeExample } from './lessons/index';
import { reviewCardsByLesson as _reviewCardsByLesson } from './review-cards';
import { quizQuestionsByLesson as _quizQuestionsByLesson } from './quiz-questions';

// ---------------------------------------------------------------------------
// Re-exports
// ---------------------------------------------------------------------------

export { modules } from './modules';
export { lessons } from './lessons';
export { getLessonContent, lessonContentMap } from './lessons/index';
export type { LessonContentData, LessonSection, CodeExample } from './lessons/index';

// ---------------------------------------------------------------------------
// Module helpers
// ---------------------------------------------------------------------------

/** Look up a module by its ID (e.g. "mod-1"). */
export function getModule(moduleId: string) {
  return modules.find((m) => m.id === moduleId) ?? null;
}

/** Get the module that a given lesson belongs to. */
export function getModuleForLesson(lessonId: string) {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return modules.find((m) => m.id === lesson.moduleId) ?? null;
}

// ---------------------------------------------------------------------------
// Lesson helpers
// ---------------------------------------------------------------------------

/** Look up a lesson metadata record by its ID (e.g. "1.1"). */
export function getLesson(lessonId: string): Lesson | null {
  return lessons.find((l) => l.id === lessonId) ?? null;
}

/** Get all lessons for a given module, ordered by `order`. */
export function getLessonsForModule(moduleId: string): Lesson[] {
  return lessons
    .filter((l) => l.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}

/** Get the next lesson in sequence after the given lesson, or null. */
export function getNextLesson(lessonId: string): Lesson | null {
  const current = lessons.find((l) => l.id === lessonId);
  if (!current) return null;

  // First look for the next lesson in the same module.
  const sibling = lessons.find(
    (l) => l.moduleId === current.moduleId && l.order === current.order + 1,
  );
  if (sibling) return sibling;

  // Otherwise jump to the first lesson of the next module.
  const currentModule = modules.find((m) => m.id === current.moduleId);
  if (!currentModule) return null;
  const nextModule = modules.find((m) => m.order === currentModule.order + 1);
  if (!nextModule) return null;

  return (
    lessons.find(
      (l) => l.moduleId === nextModule.id && l.order === 1,
    ) ?? null
  );
}

/** Get the previous lesson in sequence before the given lesson, or null. */
export function getPreviousLesson(lessonId: string): Lesson | null {
  const current = lessons.find((l) => l.id === lessonId);
  if (!current) return null;

  if (current.order > 1) {
    return (
      lessons.find(
        (l) => l.moduleId === current.moduleId && l.order === current.order - 1,
      ) ?? null
    );
  }

  // Jump to the last lesson of the previous module.
  const currentModule = modules.find((m) => m.id === current.moduleId);
  if (!currentModule || currentModule.order <= 1) return null;
  const prevModule = modules.find((m) => m.order === currentModule.order - 1);
  if (!prevModule) return null;

  const moduleLessons = lessons
    .filter((l) => l.moduleId === prevModule.id)
    .sort((a, b) => b.order - a.order);
  return moduleLessons[0] ?? null;
}

// ---------------------------------------------------------------------------
// Review card helpers
// ---------------------------------------------------------------------------

/**
 * Review cards indexed by lesson ID, sourced from `./review-cards.ts`.
 * Returns empty arrays for lessons without authored cards.
 */
const reviewCardsByLesson: Record<string, ReviewCard[]> = _reviewCardsByLesson;

/** Get all review cards for a lesson. Returns `[]` if none exist yet. */
export function getCardsForLesson(lessonId: string): ReviewCard[] {
  return reviewCardsByLesson[lessonId] ?? [];
}

/** Look up a single review card by its global ID. */
export function getCardById(cardId: string): ReviewCard | null {
  for (const cards of Object.values(reviewCardsByLesson)) {
    const found = cards.find((c) => c.id === cardId);
    if (found) return found;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Quiz question helpers
// ---------------------------------------------------------------------------

/**
 * Quiz questions indexed by lesson ID, sourced from `./quiz-questions.ts`.
 * Returns empty arrays for lessons without authored quizzes.
 */
const quizQuestionsByLesson: Record<string, QuizQuestion[]> = _quizQuestionsByLesson;

/** Get all quiz questions for a lesson. Returns `[]` if none exist yet. */
export function getQuizForLesson(lessonId: string): QuizQuestion[] {
  return quizQuestionsByLesson[lessonId] ?? [];
}

/** Look up a single quiz question by its global ID. */
export function getQuizQuestionById(questionId: string): QuizQuestion | null {
  for (const questions of Object.values(quizQuestionsByLesson)) {
    const found = questions.find((q) => q.id === questionId);
    if (found) return found;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Aggregate helpers
// ---------------------------------------------------------------------------

/** Count the total number of lessons across all modules. */
export function getTotalLessonCount(): number {
  return lessons.length;
}

/** Count the total number of review cards across all lessons. */
export function getTotalCardCount(): number {
  return Object.values(reviewCardsByLesson).reduce(
    (sum, cards) => sum + cards.length,
    0,
  );
}

/** Check whether a lesson ID is valid (exists in the content registry). */
export function isValidLessonId(lessonId: string): boolean {
  return lessons.some((l) => l.id === lessonId);
}
