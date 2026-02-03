'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { duration, easingArray } from '@/lib/design-tokens';
import type { ReviewCard as ReviewCardData } from '@/lib/db/schema';
import { FormattedText } from '@/components/ui/FormattedText';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Rating = 1 | 2 | 3 | 4;

export interface ReviewCardProps {
  /** The review card data to display. */
  card: ReviewCardData;
  /** Next review intervals to show on each rating button (e.g. "10m", "1d"). */
  intervals?: Record<Rating, string>;
  /** Called when the user selects a rating. */
  onRate?: (rating: Rating) => void;
  /** Whether this card is embedded inline within reading content. */
  inline?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Rating button config
// ---------------------------------------------------------------------------

const ratingConfig: {
  rating: Rating;
  label: string;
  className: string;
}[] = [
  {
    rating: 1,
    label: 'Again',
    className:
      'text-[var(--color-error)] border-[var(--color-error)] hover:bg-[var(--color-error-subtle)]',
  },
  {
    rating: 2,
    label: 'Hard',
    className:
      'text-[var(--color-warning)] border-[var(--color-warning)] hover:bg-[var(--color-warning-subtle)]',
  },
  {
    rating: 3,
    label: 'Good',
    className:
      'text-[var(--color-success)] border-[var(--color-success)] hover:bg-[var(--color-success-subtle)]',
  },
  {
    rating: 4,
    label: 'Easy',
    className:
      'text-[var(--color-info)] border-[var(--color-info)] hover:bg-[var(--color-info-subtle)]',
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const answerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: duration.normal / 1000,
      ease: easingArray.out,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: duration.fast / 1000 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReviewCard({
  card,
  intervals,
  onRate,
  inline = false,
  className = '',
}: ReviewCardProps) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const handleRate = useCallback(
    (rating: Rating) => {
      onRate?.(rating);
      setRevealed(false);
    },
    [onRate],
  );

  return (
    <Card
      padding="none"
      className={[
        inline ? 'my-6' : '',
        'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Accent top bar */}
      <div className="h-0.5 bg-[var(--color-accent)]" />

      <div className="p-5">
        {/* Prompt */}
        <FormattedText text={card.prompt} as="p" className="text-[var(--text-base)] font-reading text-[var(--color-text-primary)] leading-relaxed" />

        {/* Answer area */}
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="show-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <Button
                variant="secondary"
                size="sm"
                icon={<Eye size={14} />}
                onClick={handleReveal}
                aria-label="Show answer"
              >
                Show Answer
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              variants={answerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Divider */}
              <div className="border-t border-[var(--color-border-secondary)] my-4" />

              {/* Answer text */}
              <FormattedText text={card.answer} as="p" className="text-[var(--text-base)] font-reading text-[var(--color-text-primary)] leading-relaxed mb-4" />

              {/* Rating buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {ratingConfig.map(({ rating, label, className: btnClass }) => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    className={[
                      'flex flex-col items-center',
                      'px-3 py-2 rounded-[var(--radius-md)]',
                      'border bg-transparent',
                      'text-[var(--text-sm)] font-medium',
                      'transition-colors cursor-pointer',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
                      btnClass,
                    ].join(' ')}
                    aria-label={`Rate: ${label}`}
                  >
                    <span>{label}</span>
                    {intervals && (
                      <span className="text-[var(--text-xs)] opacity-70 mt-0.5">
                        {intervals[rating]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default ReviewCard;
