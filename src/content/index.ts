/**
 * Content layer barrel export.
 *
 * Provides a unified, book-aware API for accessing all static content:
 * modules, lessons, lesson prose, review cards, and quiz questions.
 *
 * Every helper accepts an optional `bookId` parameter. When omitted it
 * defaults to `'deep-learning-python'` for backward compatibility.
 */

import type { Module, Lesson, ReviewCard, QuizQuestion } from '@/lib/db/schema';

// Book registry
export { books, getBook, isValidBookId } from './books';
export type { Book } from './books';

// Types re-exported from DL lessons (canonical location for the interfaces)
export type { LessonContentData, LessonSection, CodeExample } from './books/deep-learning-python/lessons/index';

// ---------------------------------------------------------------------------
// Per-book content imports
// ---------------------------------------------------------------------------

import { modules as dlModules } from './books/deep-learning-python/modules';
import { lessons as dlLessons } from './books/deep-learning-python/lessons';
import { reviewCardsByLesson as dlReviewCardsByLesson } from './books/deep-learning-python/review-cards';
import { quizQuestionsByLesson as dlQuizQuestionsByLesson } from './books/deep-learning-python/quiz-questions';
import {
  getLessonContent as dlGetLessonContent,
  lessonContentMap as dlLessonContentMap,
} from './books/deep-learning-python/lessons/index';

import { modules as marlModules } from './books/marl/modules';
import { lessons as marlLessons } from './books/marl/lessons';
import { reviewCardsByLesson as marlReviewCardsByLesson } from './books/marl/review-cards';
import { quizQuestionsByLesson as marlQuizQuestionsByLesson } from './books/marl/quiz-questions';
import {
  getLessonContent as marlGetLessonContent,
  lessonContentMap as marlLessonContentMap,
} from './books/marl/lessons/index';

// ---------------------------------------------------------------------------
// Content registry
// ---------------------------------------------------------------------------

interface BookContent {
  modules: Module[];
  lessons: Lesson[];
  reviewCardsByLesson: Record<string, ReviewCard[]>;
  quizQuestionsByLesson: Record<string, QuizQuestion[]>;
  getLessonContent: (lessonId: string) => Promise<import('./books/deep-learning-python/lessons/index').LessonContentData | null>;
  lessonContentMap: Record<string, () => Promise<{ default: import('./books/deep-learning-python/lessons/index').LessonContentData }>>;
}

const contentRegistry: Record<string, BookContent> = {
  'deep-learning-python': {
    modules: dlModules,
    lessons: dlLessons,
    reviewCardsByLesson: dlReviewCardsByLesson,
    quizQuestionsByLesson: dlQuizQuestionsByLesson,
    getLessonContent: dlGetLessonContent,
    lessonContentMap: dlLessonContentMap,
  },
  marl: {
    modules: marlModules,
    lessons: marlLessons,
    reviewCardsByLesson: marlReviewCardsByLesson,
    quizQuestionsByLesson: marlQuizQuestionsByLesson,
    getLessonContent: marlGetLessonContent,
    lessonContentMap: marlLessonContentMap,
  },
};

const DEFAULT_BOOK = 'deep-learning-python';

function getBookContent(bookId?: string): BookContent {
  return contentRegistry[bookId ?? DEFAULT_BOOK] ?? contentRegistry[DEFAULT_BOOK];
}

// ---------------------------------------------------------------------------
// Legacy convenience re-exports (default to DL book)
// ---------------------------------------------------------------------------

export const modules = dlModules;
export const lessons = dlLessons;
export const lessonContentMap = dlLessonContentMap;
export async function getLessonContent(
  lessonIdOrBookId: string,
  maybeLessonId?: string,
) {
  if (maybeLessonId !== undefined) {
    return getBookContent(lessonIdOrBookId).getLessonContent(maybeLessonId);
  }
  return getBookContent().getLessonContent(lessonIdOrBookId);
}

// ---------------------------------------------------------------------------
// Book-aware helpers
// ---------------------------------------------------------------------------

/** Get all modules for a book. */
export function getModulesForBook(bookId: string): Module[] {
  return getBookContent(bookId).modules;
}

/** Get all lessons for a book. */
export function getLessonsForBook(bookId: string): Lesson[] {
  return getBookContent(bookId).lessons;
}

// ---------------------------------------------------------------------------
// Module helpers
// ---------------------------------------------------------------------------

/** Look up a module by its ID. Searches the specified book (or DL default). */
export function getModule(moduleId: string, bookId?: string) {
  return getBookContent(bookId).modules.find((m) => m.id === moduleId) ?? null;
}

/** Get the module that a given lesson belongs to. */
export function getModuleForLesson(lessonId: string, bookId?: string) {
  const bc = getBookContent(bookId);
  const lesson = bc.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return bc.modules.find((m) => m.id === lesson.moduleId) ?? null;
}

// ---------------------------------------------------------------------------
// Lesson helpers
// ---------------------------------------------------------------------------

/** Look up a lesson metadata record by its ID. */
export function getLesson(lessonId: string, bookId?: string): Lesson | null {
  return getBookContent(bookId).lessons.find((l) => l.id === lessonId) ?? null;
}

/** Get all lessons for a given module, ordered by `order`. */
export function getLessonsForModule(moduleId: string, bookId?: string): Lesson[] {
  return getBookContent(bookId)
    .lessons.filter((l) => l.moduleId === moduleId)
    .sort((a, b) => a.order - b.order);
}

/** Get the next lesson in sequence after the given lesson, or null. */
export function getNextLesson(lessonId: string, bookId?: string): Lesson | null {
  const bc = getBookContent(bookId);
  const current = bc.lessons.find((l) => l.id === lessonId);
  if (!current) return null;

  const sibling = bc.lessons.find(
    (l) => l.moduleId === current.moduleId && l.order === current.order + 1,
  );
  if (sibling) return sibling;

  const currentModule = bc.modules.find((m) => m.id === current.moduleId);
  if (!currentModule) return null;
  const nextModule = bc.modules.find((m) => m.order === currentModule.order + 1);
  if (!nextModule) return null;

  return (
    bc.lessons.find((l) => l.moduleId === nextModule.id && l.order === 1) ?? null
  );
}

/** Get the previous lesson in sequence before the given lesson, or null. */
export function getPreviousLesson(lessonId: string, bookId?: string): Lesson | null {
  const bc = getBookContent(bookId);
  const current = bc.lessons.find((l) => l.id === lessonId);
  if (!current) return null;

  if (current.order > 1) {
    return (
      bc.lessons.find(
        (l) => l.moduleId === current.moduleId && l.order === current.order - 1,
      ) ?? null
    );
  }

  const currentModule = bc.modules.find((m) => m.id === current.moduleId);
  if (!currentModule || currentModule.order <= 1) return null;
  const prevModule = bc.modules.find((m) => m.order === currentModule.order - 1);
  if (!prevModule) return null;

  const moduleLessons = bc.lessons
    .filter((l) => l.moduleId === prevModule.id)
    .sort((a, b) => b.order - a.order);
  return moduleLessons[0] ?? null;
}

// ---------------------------------------------------------------------------
// Review card helpers
// ---------------------------------------------------------------------------

/** Get all review cards for a lesson. Returns `[]` if none exist yet. */
export function getCardsForLesson(lessonId: string, bookId?: string): ReviewCard[] {
  return getBookContent(bookId).reviewCardsByLesson[lessonId] ?? [];
}

/** Look up a single review card by its global ID. Searches all books. */
export function getCardById(cardId: string): ReviewCard | null {
  for (const bc of Object.values(contentRegistry)) {
    for (const cards of Object.values(bc.reviewCardsByLesson)) {
      const found = cards.find((c) => c.id === cardId);
      if (found) return found;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Quiz question helpers
// ---------------------------------------------------------------------------

/** Get all quiz questions for a lesson. Returns `[]` if none exist yet. */
export function getQuizForLesson(lessonId: string, bookId?: string): QuizQuestion[] {
  return getBookContent(bookId).quizQuestionsByLesson[lessonId] ?? [];
}

/** Look up a single quiz question by its global ID. Searches all books. */
export function getQuizQuestionById(questionId: string): QuizQuestion | null {
  for (const bc of Object.values(contentRegistry)) {
    for (const questions of Object.values(bc.quizQuestionsByLesson)) {
      const found = questions.find((q) => q.id === questionId);
      if (found) return found;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Aggregate helpers
// ---------------------------------------------------------------------------

/** Count the total number of lessons for a book (or all books). */
export function getTotalLessonCount(bookId?: string): number {
  if (bookId) return getBookContent(bookId).lessons.length;
  return Object.values(contentRegistry).reduce(
    (sum, bc) => sum + bc.lessons.length,
    0,
  );
}

/** Count the total number of review cards for a book (or all books). */
export function getTotalCardCount(bookId?: string): number {
  if (bookId) {
    return Object.values(getBookContent(bookId).reviewCardsByLesson).reduce(
      (sum, cards) => sum + cards.length,
      0,
    );
  }
  return Object.values(contentRegistry).reduce(
    (sum, bc) =>
      sum +
      Object.values(bc.reviewCardsByLesson).reduce(
        (s, cards) => s + cards.length,
        0,
      ),
    0,
  );
}

/** Check whether a lesson ID is valid within a book. */
export function isValidLessonId(lessonId: string, bookId?: string): boolean {
  return getBookContent(bookId).lessons.some((l) => l.id === lessonId);
}
