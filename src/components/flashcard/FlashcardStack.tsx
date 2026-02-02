'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Flashcard } from './Flashcard';
import { duration, easingArray } from '@/lib/design-tokens';
import type { ReviewCard } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** FSRS rating values surfaced by this component. */
type FlashcardRating = 1 | 2 | 3 | 4;

export interface FlashcardStackStats {
  totalCards: number;
  gotIt: number;
  studyAgain: number;
}

export interface FlashcardStackProps {
  /** The initial set of review cards to study. */
  cards: ReviewCard[];
  /** Called each time the learner rates a card. */
  onRate?: (cardId: string, rating: FlashcardRating) => void;
  /** Called when the entire deck has been completed (no more cards to study). */
  onComplete?: (stats: FlashcardStackStats) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Internal queue item -- tracks re-queued cards
// ---------------------------------------------------------------------------

interface QueueItem {
  card: ReviewCard;
  /** A monotonically increasing key so AnimatePresence can distinguish re-queued cards. */
  instanceKey: number;
}

// ---------------------------------------------------------------------------
// Animation constants
// ---------------------------------------------------------------------------

const EASING = easingArray.out as unknown as [number, number, number, number];

/** Stack card visual offsets (index 0 = top card). */
const STACK_OFFSETS = [
  { scale: 1, y: 0 },
  { scale: 0.97, y: 4 },
  { scale: 0.94, y: 8 },
];

// ---------------------------------------------------------------------------
// Exit direction tracking
// ---------------------------------------------------------------------------

type ExitDirection = 'left' | 'right';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FlashcardStack({
  cards: initialCards,
  onRate,
  onComplete,
  className = '',
}: FlashcardStackProps) {
  // Build the initial queue
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    initialCards.map((card, i) => ({ card, instanceKey: i })),
  );

  // Monotonic counter for unique instance keys when re-queuing
  const [nextKey, setNextKey] = useState(initialCards.length);

  // Flip state for the top card
  const [isFlipped, setIsFlipped] = useState(false);

  // Stats
  const [gotIt, setGotIt] = useState(0);
  const [studyAgain, setStudyAgain] = useState(0);

  // Track exit direction so the exit animation slides the right way
  const [exitDirection, setExitDirection] = useState<ExitDirection>('right');

  // Whether we are in the middle of an exit animation (prevents double-tap)
  const [isAnimating, setIsAnimating] = useState(false);

  // The total number of unique ratings made (for the "X of Y" counter)
  const totalRated = gotIt + studyAgain;
  // Total cards = original deck size + any "study again" cards still pending
  // For the progress indicator, we treat the denominator as original + re-queued
  const totalCards = initialCards.length + studyAgain;
  const isFinished = queue.length === 0;
  const progress = totalCards > 0 ? Math.min((totalRated / totalCards) * 100, 100) : 0;

  // The top card
  const topItem = queue[0] ?? null;

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleFlip = useCallback(() => {
    if (isAnimating) return;
    setIsFlipped(true);
  }, [isAnimating]);

  const advanceCard = useCallback(
    (direction: ExitDirection, requeue: boolean) => {
      if (isAnimating || !topItem) return;
      setIsAnimating(true);
      setExitDirection(direction);

      // Rating
      const rating: FlashcardRating = requeue ? 1 : 3;
      onRate?.(topItem.card.id, rating);

      // Update stats
      if (requeue) {
        setStudyAgain((s) => s + 1);
      } else {
        setGotIt((g) => g + 1);
      }

      // After a short delay (to let the exit animation begin), update the queue
      // We use a tiny timeout so React batches the state updates for animation
      requestAnimationFrame(() => {
        setQueue((prev) => {
          const [removed, ...rest] = prev;
          if (requeue && removed) {
            // Re-queue at the end with a fresh instance key
            const newKey = nextKey;
            setNextKey((k) => k + 1);
            return [...rest, { card: removed.card, instanceKey: newKey }];
          }
          return rest;
        });
        setIsFlipped(false);

        // Check completion after queue update
        setQueue((current) => {
          if (current.length === 0) {
            // Build final stats -- need to compute from what we just set
            // Use a setTimeout to ensure state has settled
            setTimeout(() => {
              const finalGotIt = gotIt + (requeue ? 0 : 1);
              const finalStudyAgain = studyAgain + (requeue ? 1 : 0);
              onComplete?.({
                totalCards: finalGotIt + finalStudyAgain,
                gotIt: finalGotIt,
                studyAgain: finalStudyAgain,
              });
            }, 0);
          }
          return current;
        });

        // Allow next interaction after the enter animation
        setTimeout(() => setIsAnimating(false), 350);
      });
    },
    [isAnimating, topItem, onRate, onComplete, gotIt, studyAgain, nextKey],
  );

  const handleStudyAgain = useCallback(() => {
    advanceCard('left', true);
  }, [advanceCard]);

  const handleGotIt = useCallback(() => {
    advanceCard('right', false);
  }, [advanceCard]);

  // -------------------------------------------------------------------------
  // Keyboard navigation
  // -------------------------------------------------------------------------

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore if the user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (!isFlipped) {
        // Space or Enter flips the card
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      } else {
        // ArrowLeft / 1 = Study Again
        if (e.key === 'ArrowLeft' || e.key === '1') {
          e.preventDefault();
          handleStudyAgain();
        }
        // ArrowRight / 2 = Got It
        if (e.key === 'ArrowRight' || e.key === '2') {
          e.preventDefault();
          handleGotIt();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFlipped, handleFlip, handleStudyAgain, handleGotIt]);

  // -------------------------------------------------------------------------
  // Completion summary
  // -------------------------------------------------------------------------

  if (isFinished) {
    const accuracy = totalRated > 0 ? gotIt / totalRated : 0;

    return (
      <div className={['w-full max-w-md mx-auto', className].filter(Boolean).join(' ')}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: duration.normal / 1000, ease: EASING }}
          className={[
            'bg-[var(--color-bg-elevated)]',
            'border border-[var(--color-border-secondary)]',
            'rounded-[var(--radius-xl)]',
            'shadow-[var(--shadow-lg)]',
            'p-8 text-center',
          ].join(' ')}
        >
          <CheckCircle2
            size={40}
            className="mx-auto mb-4 text-[var(--color-success)]"
            aria-hidden="true"
          />
          <h2 className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] mb-1">
            Deck Complete
          </h2>
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-8">
            {totalRated} card{totalRated !== 1 ? 's' : ''} studied
          </p>

          {/* Stats row */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]">
              <span className="block text-[var(--text-xs)] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1">
                Got It
              </span>
              <span className="text-[var(--text-2xl)] font-semibold text-[var(--color-success)] tabular-nums">
                {gotIt}
              </span>
            </div>
            <div className="flex-1 p-4 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)]">
              <span className="block text-[var(--text-xs)] font-medium uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1">
                Study Again
              </span>
              <span className="text-[var(--text-2xl)] font-semibold text-[var(--color-accent)] tabular-nums">
                {studyAgain}
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-[var(--color-border-secondary)] my-4" />

          {/* Accuracy ring */}
          <div className="flex flex-col items-center mb-2">
            <div className="relative w-24 h-24 mb-2">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Background track */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--color-bg-tertiary)"
                  strokeWidth="6"
                />
                {/* Accuracy arc */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - accuracy) }}
                  transition={{ duration: duration.slow / 1000 * 2, ease: EASING, delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[var(--text-xl)] font-bold text-[var(--color-text-primary)] tabular-nums">
                  {Math.round(accuracy * 100)}%
                </span>
              </div>
            </div>
            <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
              Accuracy
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Active stack
  // -------------------------------------------------------------------------

  // Visible stack cards (max 3)
  const visibleStack = queue.slice(0, 3);

  return (
    <div className={['w-full max-w-md mx-auto', className].filter(Boolean).join(' ')}>
      {/* Header: card count + progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2" aria-live="polite" aria-atomic="true">
          <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)] tabular-nums">
            {totalRated + 1} of {totalCards}
          </span>
          <span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
            {queue.length} remaining
          </span>
        </div>
        {/* Thin progress bar */}
        <div
          className="w-full h-1 overflow-hidden rounded-full bg-[var(--color-bg-tertiary)]"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Review progress"
        >
          <motion.div
            className="h-full rounded-full bg-[var(--color-accent)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: duration.normal / 1000, ease: EASING }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative min-h-[340px]">
        {/* Background stack cards (rendered bottom-to-top so z-order is correct) */}
        {visibleStack
          .slice()
          .reverse()
          .map((item, reversedIndex) => {
            const stackIndex = visibleStack.length - 1 - reversedIndex;
            // Skip the top card -- it gets rendered separately with AnimatePresence
            if (stackIndex === 0) return null;
            const offset = STACK_OFFSETS[stackIndex] ?? STACK_OFFSETS[2];

            return (
              <motion.div
                key={`bg-${item.instanceKey}`}
                className="absolute inset-0 pointer-events-none"
                animate={{
                  scale: offset.scale,
                  y: offset.y,
                  opacity: stackIndex === 1 ? 0.75 : 0.5,
                }}
                transition={{ duration: duration.normal / 1000, ease: EASING }}
                style={{ zIndex: -stackIndex }}
              >
                <div
                  className={[
                    'w-full min-h-[320px]',
                    'bg-[var(--color-bg-elevated)]',
                    'border border-[var(--color-border-secondary)]',
                    'rounded-[var(--radius-xl)]',
                    'shadow-[var(--shadow-sm)]',
                  ].join(' ')}
                />
              </motion.div>
            );
          })}

        {/* Top card with enter/exit animations */}
        <AnimatePresence mode="popLayout" initial={false}>
          {topItem && (
            <motion.div
              key={topItem.instanceKey}
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{
                x: exitDirection === 'left' ? -300 : 300,
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.3, ease: EASING },
              }}
              transition={{ duration: 0.3, ease: EASING }}
              style={{ zIndex: 1 }}
            >
              <Flashcard
                card={topItem.card}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                onStudyAgain={handleStudyAgain}
                onGotIt={handleGotIt}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-4 text-center text-[var(--text-xs)] text-[var(--color-text-tertiary)] select-none"
      >
        {!isFlipped ? 'Press Space to flip' : 'Left arrow: Study Again \u00b7 Right arrow: Got It'}
      </motion.p>
    </div>
  );
}

export default FlashcardStack;
