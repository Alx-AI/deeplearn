/**
 * React hook that surfaces review cards due today.
 *
 * Wraps the database-level `useReviewQueue` hook with a friendlier API
 * tailored to the dashboard and review-session entry points. Provides a
 * pre-computed `nextReviewTime` so the UI can display "next review in X
 * minutes/hours" without additional queries.
 *
 * Usage:
 *   const { dueCards, dueCount, nextReviewTime, isLoading } = useReviewDue();
 */

'use client';

import { useMemo } from 'react';
import { useReviewQueue } from '@/lib/db/hooks';
import type { UserCardState } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Public interface
// ---------------------------------------------------------------------------

export interface UseReviewDueReturn {
  /** Cards that are currently due for review (excludes new/unseen cards). */
  dueCards: UserCardState[];
  /** Convenience count of due cards. */
  dueCount: number;
  /**
   * The earliest `due` date among cards that are NOT yet due (i.e. the
   * soonest upcoming review). `null` when there are no future reviews
   * scheduled or while the query is loading.
   */
  nextReviewTime: Date | null;
  /** `true` while the underlying live query is still resolving. */
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useReviewDue(): UseReviewDueReturn {
  const { dueCards, dueCount, queue, isLoading } = useReviewQueue();

  // Derive the next upcoming review time from the full queue. Cards that
  // are already due have `due <= now`; we want the earliest card whose
  // `due` is still in the future.
  const nextReviewTime = useMemo<Date | null>(() => {
    if (isLoading) return null;

    const now = new Date();
    let earliest: Date | null = null;

    for (const card of queue) {
      if (card.due > now) {
        if (!earliest || card.due < earliest) {
          earliest = card.due;
        }
      }
    }

    return earliest;
  }, [queue, isLoading]);

  return {
    dueCards,
    dueCount,
    nextReviewTime,
    isLoading,
  };
}
