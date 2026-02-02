/**
 * React hook for loading all data related to a single lesson.
 *
 * Fetches lesson metadata, rich prose content, review cards, and quiz
 * questions in parallel so the lesson view can render as soon as any piece
 * is ready. Returns unified loading / error state so the consuming component
 * only needs one guard.
 *
 * Usage:
 *   const { lesson, content, reviewCards, quizQuestions, isLoading, error } =
 *     useLesson('1.1');
 */

'use client';

import { useState, useEffect } from 'react';
import { type LessonContentData } from '@/content/books/deep-learning-python/lessons/index';
import { getCardsForLesson, getQuizForLesson, getLesson, getLessonContent } from '@/content';
import type { Lesson, ReviewCard, QuizQuestion } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

export interface UseLessonReturn {
  /** Lesson metadata (title, objectives, prerequisites, etc.). */
  lesson: Lesson | null;
  /** Rich prose content (sections, inline card references, summary). */
  content: LessonContentData | null;
  /** Review cards embedded in this lesson. */
  reviewCards: ReviewCard[];
  /** End-of-lesson quiz questions. */
  quizQuestions: QuizQuestion[];
  /** `true` while the async content load is in progress. */
  isLoading: boolean;
  /** Human-readable error message, or `null` on success. */
  error: string | null;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useLesson(lessonId: string, bookId?: string): UseLessonReturn {
  const [content, setContent] = useState<LessonContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronous lookups -- these hit in-memory arrays and never suspend.
  const lesson = getLesson(lessonId, bookId);
  const reviewCards = getCardsForLesson(lessonId, bookId);
  const quizQuestions = getQuizForLesson(lessonId, bookId);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const loaded = bookId
          ? await getLessonContent(bookId, lessonId)
          : await getLessonContent(lessonId);

        if (cancelled) return;

        if (!loaded && !lesson) {
          setError(`Lesson "${lessonId}" was not found.`);
        }
        setContent(loaded);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : `Failed to load content for lesson "${lessonId}".`,
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [lessonId, bookId, lesson]);

  return {
    lesson,
    content,
    reviewCards,
    quizQuestions,
    isLoading,
    error,
  };
}
