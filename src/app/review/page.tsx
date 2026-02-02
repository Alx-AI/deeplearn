'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';
import { PageTransition } from '@/components/ui/PageTransition';
import { FlashcardSkeleton } from '@/components/ui/Skeleton';

import { FlashcardStack } from '@/components/flashcard';
import type { FlashcardStackStats } from '@/components/flashcard';
import { useReviewQueue } from '@/lib/db/hooks';
import { getCardById } from '@/content';
import { srsEngine, Rating } from '@/lib/srs/engine';
import type { Grade } from '@/lib/srs/engine';
import { getOrCreateCardState, updateCardAfterReview } from '@/lib/db/api-client';
import type { ReviewCard } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Time-until helper
// ---------------------------------------------------------------------------

function formatTimeUntil(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'now';
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
  const diffHrs = Math.round(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''}`;
  const diffDays = Math.round(diffHrs / 24);
  return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}

// ---------------------------------------------------------------------------
// Review Page
// ---------------------------------------------------------------------------

export default function ReviewPage() {
  const { queue, isLoading } = useReviewQueue();
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionStats, setSessionStats] = useState<FlashcardStackStats | null>(null);

  // Resolve card content for each due card
  const reviewCards: ReviewCard[] = useMemo(() => {
    return queue
      .map((cardState) => getCardById(cardState.cardId))
      .filter((c): c is ReviewCard => c !== null);
  }, [queue]);

  // Compute next review time
  const nextReviewTime = useMemo(() => {
    if (isLoading || queue.length === 0) return null;
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

  // Handle FSRS persistence when a card is rated
  const handleRate = useCallback(
    async (cardId: string, rating: 1 | 2 | 3 | 4) => {
      try {
        const cardState = await getOrCreateCardState(cardId);
        const result = srsEngine.reviewCard(cardState.fsrsCard, rating as Grade);
        const content = getCardById(cardId);
        await updateCardAfterReview(cardId, result.card, {
          cardId,
          lessonId: content?.lessonId ?? '',
          rating,
          timestamp: new Date(),
          scheduledDays: result.card.scheduled_days,
          elapsedDays: result.card.elapsed_days,
          state: result.card.state,
          duration: 0,
          context: 'review-session',
        });
      } catch (err) {
        console.error('Failed to record review:', err);
      }
    },
    [],
  );

  const handleComplete = useCallback((stats: FlashcardStackStats) => {
    setSessionDone(true);
    setSessionStats(stats);
  }, []);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container-content py-8 sm:py-12">
          <div className="mb-8 text-center">
            <div className="mx-auto h-7 w-24 animate-pulse rounded bg-surface-tertiary mb-2" />
            <div className="mx-auto h-4 w-36 animate-pulse rounded bg-surface-tertiary" />
          </div>
          <FlashcardSkeleton />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // "All caught up" state (no cards due)
  // ---------------------------------------------------------------------------
  if (reviewCards.length === 0 && !sessionDone) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <PageTransition>
        <div className="container-content py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle">
              <Check className="h-10 w-10 text-success" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-primary">All Caught Up!</h1>
            <p className="mt-3 text-lg text-secondary">
              No cards are due for review right now.
            </p>
            {nextReviewTime && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-elevated px-5 py-3 text-sm text-secondary">
                <Clock className="h-4 w-4 text-tertiary" aria-hidden="true" />
                Next review in{' '}
                <span className="font-semibold text-primary">
                  {formatTimeUntil(nextReviewTime)}
                </span>
              </div>
            )}
            <div className="mt-8">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-inverse no-underline transition-colors hover:bg-accent-hover"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
        </PageTransition>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Session Complete (FlashcardStack shows its own summary, but we add nav)
  // ---------------------------------------------------------------------------
  if (sessionDone) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <PageTransition>
          <div className="container-content py-12">
            <FlashcardStack
              cards={reviewCards}
              onRate={handleRate}
              onComplete={handleComplete}
            />
            <div className="mt-10 flex justify-center gap-3">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-inverse no-underline transition-colors hover:bg-accent-hover active:scale-[0.98]"
              >
                Continue Learning
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </PageTransition>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Active Review with FlashcardStack
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <PageTransition>
        <div className="container-content py-8 sm:py-12">
          {/* Session Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center"
          >
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              Review
            </h1>
            <p className="mt-1 text-sm text-secondary">
              {reviewCards.length} card{reviewCards.length !== 1 ? 's' : ''} to study
            </p>
          </motion.div>

          {/* FlashcardStack */}
          <FlashcardStack
            cards={reviewCards}
            onRate={handleRate}
            onComplete={handleComplete}
          />
        </div>
      </PageTransition>
    </div>
  );
}
