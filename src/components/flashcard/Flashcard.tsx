'use client';

import { motion } from 'framer-motion';
import { easingArray } from '@/lib/design-tokens';
import type { ReviewCard } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FlashcardProps {
  /** The review card data to display. */
  card: ReviewCard;
  /** Whether the card is flipped to show the answer. */
  isFlipped: boolean;
  /** Called when the card is tapped/clicked to flip. */
  onFlip: () => void;
  /** Called when the user taps "Study Again" (maps to FSRS Rating 1). */
  onStudyAgain: () => void;
  /** Called when the user taps "Got It" (maps to FSRS Rating 3). */
  onGotIt: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FLIP_DURATION = 0.4;
const FLIP_EASE = easingArray.out as unknown as [number, number, number, number];

// ---------------------------------------------------------------------------
// Type-to-label map
// ---------------------------------------------------------------------------

const typeLabel: Record<ReviewCard['type'], string> = {
  recall: 'Recall',
  concept: 'Concept',
  application: 'Apply',
  cloze: 'Cloze',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Flashcard({
  card,
  isFlipped,
  onFlip,
  onStudyAgain,
  onGotIt,
  className = '',
}: FlashcardProps) {
  return (
    <div
      className={['w-full', className].filter(Boolean).join(' ')}
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: FLIP_DURATION, ease: FLIP_EASE }}
        style={{ transformStyle: 'preserve-3d', display: 'grid' }}
        className="w-full [&>*]:[grid-area:1/1]"
      >
        {/* ----------------------------------------------------------------- */}
        {/* Front face -- prompt                                              */}
        {/* ----------------------------------------------------------------- */}
        <div
          onClick={!isFlipped ? onFlip : undefined}
          onKeyDown={
            !isFlipped
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onFlip();
                  }
                }
              : undefined
          }
          role={!isFlipped ? 'button' : undefined}
          tabIndex={!isFlipped ? 0 : -1}
          aria-label={!isFlipped ? 'Tap to reveal answer' : undefined}
          className={[
            'w-full min-h-[320px]',
            'bg-[var(--color-bg-elevated)]',
            'border border-[var(--color-border-secondary)]',
            'rounded-[var(--radius-xl)]',
            'shadow-md',
            'flex flex-col',
            !isFlipped ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : 'pointer-events-none',
          ].join(' ')}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Accent strip */}
          <div className="h-[3px] rounded-t-[var(--radius-xl)] bg-[var(--color-accent)]" />

          <div className="flex flex-col flex-1 p-6">
            {/* Card type badge */}
            <span className="self-start text-[var(--text-xs)] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] rounded-md px-2 py-0.5 mb-4">
              {typeLabel[card.type]}
            </span>

            {/* Prompt */}
            <p className="flex-1 text-[var(--text-lg)] font-reading text-[var(--color-text-primary)] leading-relaxed">
              {card.prompt}
            </p>

            {/* Tap hint */}
            <span className="mt-6 text-[var(--text-xs)] text-[var(--color-text-tertiary)] text-center select-none">
              Tap to reveal
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Back face -- answer + action buttons                              */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={[
            'w-full min-h-[320px]',
            'bg-[var(--color-bg-elevated)]',
            'border border-[var(--color-border-secondary)]',
            'rounded-[var(--radius-xl)]',
            'shadow-[var(--shadow-lg)]',
            'flex flex-col',
          ].join(' ')}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          aria-hidden={!isFlipped}
        >
          {/* Accent strip */}
          <div className="h-[3px] rounded-t-[var(--radius-xl)] bg-[var(--color-accent)]" />

          <div className="flex flex-col flex-1 p-6">
            {/* Type badge */}
            <span className="self-start text-[var(--text-xs)] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] rounded-md px-2 py-0.5 mb-2">
              Answer
            </span>

            {/* Answer */}
            <p className="flex-1 text-[var(--text-lg)] font-reading text-[var(--color-text-primary)] leading-relaxed max-h-[500px] overflow-y-auto">
              {card.answer}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-6">
              <motion.button
                onClick={onStudyAgain}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.075 }}
                tabIndex={isFlipped ? 0 : -1}
                className={[
                  'flex-1 py-3 px-4',
                  'rounded-[var(--radius-lg)]',
                  'border border-[var(--color-border-primary)]',
                  'bg-transparent',
                  'text-[var(--text-base)] font-medium',
                  'text-[var(--color-text-secondary)]',
                  'transition-colors cursor-pointer',
                  'hover:bg-[var(--color-error-subtle)] hover:text-[var(--color-error)]',
                  'active:bg-[var(--color-bg-secondary)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
                ].join(' ')}
                aria-label="Study Again"
              >
                Study Again
              </motion.button>
              <motion.button
                onClick={onGotIt}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.075 }}
                tabIndex={isFlipped ? 0 : -1}
                className={[
                  'flex-1 py-3 px-4',
                  'rounded-[var(--radius-lg)]',
                  'bg-[var(--color-accent)]',
                  'text-[var(--color-text-inverse)]',
                  'text-[var(--text-base)] font-medium',
                  'transition-colors cursor-pointer',
                  'hover:bg-[var(--color-accent-hover)]',
                  'active:bg-[var(--color-accent-active)]',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
                ].join(' ')}
                aria-label="Got It"
              >
                Got It
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Flashcard;
