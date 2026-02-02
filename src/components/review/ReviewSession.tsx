'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ReviewCard, type Rating } from '@/components/review/ReviewCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { duration, easingArray } from '@/lib/design-tokens';
import type { ReviewCard as ReviewCardData } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewSessionCard extends ReviewCardData {
  /** Pre-computed intervals for display on rating buttons. */
  intervals?: Record<Rating, string>;
}

export interface ReviewSessionProps {
  /** The cards to review in this session. */
  cards: ReviewSessionCard[];
  /** Called when a card is rated. */
  onRate?: (cardId: string, rating: Rating) => void;
  /** Called when the session is complete. */
  onComplete?: (stats: SessionStats) => void;
  /** Called when the user exits the session. */
  onExit?: () => void;
  className?: string;
}

export interface SessionStats {
  totalCards: number;
  ratings: Record<Rating, number>;
  /** Cards rated Good (3) or Easy (4) as a fraction. */
  accuracy: number;
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const cardTransition = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: {
    duration: duration.normal / 1000,
    ease: easingArray.out,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReviewSession({
  cards,
  onRate,
  onComplete,
  onExit,
  className = '',
}: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<Rating, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const isFinished = currentIndex >= cards.length;
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;

  const stats: SessionStats = useMemo(() => {
    const total = Object.values(ratings).reduce((a, b) => a + b, 0);
    return {
      totalCards: total,
      ratings,
      accuracy: total > 0 ? (ratings[3] + ratings[4]) / total : 0,
    };
  }, [ratings]);

  const handleRate = useCallback(
    (rating: Rating) => {
      const card = cards[currentIndex];
      if (!card) return;

      setRatings((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
      onRate?.(card.id, rating);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= cards.length) {
        // Defer onComplete so stats are up-to-date
        setTimeout(() => {
          const total = Object.values(ratings).reduce((a, b) => a + b, 0) + 1;
          const good = ratings[3] + ratings[4] + (rating >= 3 ? 1 : 0);
          onComplete?.({
            totalCards: total,
            ratings: { ...ratings, [rating]: ratings[rating] + 1 },
            accuracy: total > 0 ? good / total : 0,
          });
        }, 0);
      }
    },
    [cards, currentIndex, onRate, onComplete, ratings],
  );

  // -------------------------------------------------------------------------
  // Summary screen
  // -------------------------------------------------------------------------

  if (isFinished) {
    return (
      <div className={['max-w-lg mx-auto', className].join(' ')}>
        <Card padding="lg">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal / 1000 }}
            className="text-center"
          >
            <CheckCircle2
              size={40}
              className="mx-auto mb-4 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <h2 className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mb-1">
              Session Complete
            </h2>
            <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-6">
              {stats.totalCards} card{stats.totalCards !== 1 ? 's' : ''} reviewed
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-left">
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
                <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">
                  Accuracy
                </span>
                <span className="text-[var(--text-xl)] font-semibold text-[var(--color-text-primary)] tabular-nums">
                  {Math.round(stats.accuracy * 100)}%
                </span>
              </div>
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
                <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">
                  Again
                </span>
                <span className="text-[var(--text-xl)] font-semibold text-[var(--color-error)] tabular-nums">
                  {stats.ratings[1]}
                </span>
              </div>
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
                <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">
                  Hard
                </span>
                <span className="text-[var(--text-xl)] font-semibold text-[var(--color-warning)] tabular-nums">
                  {stats.ratings[2]}
                </span>
              </div>
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
                <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-0.5">
                  Good / Easy
                </span>
                <span className="text-[var(--text-xl)] font-semibold text-[var(--color-success)] tabular-nums">
                  {stats.ratings[3] + stats.ratings[4]}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={onExit}
              icon={<ArrowRight size={16} />}
            >
              Continue
            </Button>
          </motion.div>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Active session
  // -------------------------------------------------------------------------

  const current = cards[currentIndex];

  return (
    <div className={['max-w-lg mx-auto', className].join(' ')}>
      {/* Header: card count and progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
            {currentIndex + 1} / {cards.length}
          </span>
          {onExit && (
            <Button variant="ghost" size="sm" onClick={onExit}>
              Exit
            </Button>
          )}
        </div>
        <ProgressBar value={progress} color="accent" size="sm" />
      </div>

      {/* Current card with enter/exit animation */}
      <AnimatePresence mode="wait">
        <motion.div key={current.id} {...cardTransition}>
          <ReviewCard
            card={current}
            intervals={current.intervals}
            onRate={handleRate}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ReviewSession;
