'use client';

import { motion } from 'framer-motion';
import { duration, easingArray } from '@/lib/design-tokens';
import type { MasteryLevel } from '@/lib/srs/mastery';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProgressColor = 'accent' | 'success' | 'mastery';

export interface ProgressBarProps {
  /** Progress value from 0 to 100. */
  value: number;
  /** Color variant. 'mastery' auto-selects based on masteryLevel. */
  color?: ProgressColor;
  /** Used when color='mastery' to determine the fill color. */
  masteryLevel?: MasteryLevel;
  /** Optional label shown above the bar. */
  label?: string;
  /** Show the percentage value next to the label. */
  showValue?: boolean;
  /** Height variant. */
  size?: 'sm' | 'md';
  className?: string;
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

const colorClasses: Record<string, string> = {
  accent: 'bg-[var(--color-accent)]',
  success: 'bg-[var(--color-success)]',
  new: 'bg-[var(--color-mastery-new-fill)]',
  learning: 'bg-[var(--color-mastery-learning-fill)]',
  familiar: 'bg-[var(--color-mastery-familiar-fill)]',
  proficient: 'bg-[var(--color-mastery-proficient-fill)]',
  mastered: 'bg-[var(--color-mastery-mastered-fill)]',
};

function getFillClass(color: ProgressColor, masteryLevel?: MasteryLevel): string {
  if (color === 'mastery' && masteryLevel) {
    return colorClasses[masteryLevel] ?? colorClasses.accent;
  }
  return colorClasses[color] ?? colorClasses.accent;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProgressBar({
  value,
  color = 'accent',
  masteryLevel,
  label,
  showValue = false,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-[var(--text-sm)] font-medium text-[var(--color-text-secondary)]">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-[var(--text-sm)] tabular-nums text-[var(--color-text-tertiary)]">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={[
          'w-full overflow-hidden rounded-full',
          'bg-[var(--color-bg-tertiary)]',
          heightClass,
        ].join(' ')}
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <motion.div
          className={['h-full rounded-full', getFillClass(color, masteryLevel)].join(
            ' ',
          )}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{
            duration: duration.slow / 1000,
            ease: easingArray.out,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
