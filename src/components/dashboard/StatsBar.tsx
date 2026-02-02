'use client';

import { motion } from 'framer-motion';
import { BookOpen, Flame, Target, Clock } from 'lucide-react';
import { duration, easingArray } from '@/lib/design-tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatsBarProps {
  /** Number of cards reviewed today. */
  cardsReviewedToday: number;
  /** Current streak in days. */
  currentStreak: number;
  /** Overall mastery percentage (0-100). */
  masteryPercentage: number;
  /** Number of cards due for review right now. */
  cardsDue: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Stat item config
// ---------------------------------------------------------------------------

interface StatItem {
  label: string;
  icon: React.ReactNode;
  getValue: (props: StatsBarProps) => string;
}

const statItems: StatItem[] = [
  {
    label: 'Reviewed Today',
    icon: <BookOpen size={16} className="text-[var(--color-accent)]" />,
    getValue: (p) => String(p.cardsReviewedToday),
  },
  {
    label: 'Streak',
    icon: <Flame size={16} className="text-[var(--color-warning)]" />,
    getValue: (p) =>
      `${p.currentStreak} day${p.currentStreak !== 1 ? 's' : ''}`,
  },
  {
    label: 'Mastery',
    icon: <Target size={16} className="text-[var(--color-success)]" />,
    getValue: (p) => `${Math.round(p.masteryPercentage)}%`,
  },
  {
    label: 'Due',
    icon: <Clock size={16} className="text-[var(--color-info)]" />,
    getValue: (p) => String(p.cardsDue),
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StatsBar(props: StatsBarProps) {
  const { className = '' } = props;

  return (
    <div
      className={[
        'grid grid-cols-2 sm:grid-cols-4 gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="region"
      aria-label="Learning statistics"
    >
      {statItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration.normal / 1000,
            ease: easingArray.out,
            delay: i * 0.05,
          }}
          className={[
            'flex items-center gap-3 p-4',
            'bg-[var(--color-bg-elevated)]',
            'border border-[var(--color-border-secondary)]',
            'rounded-[var(--radius-lg)]',
          ].join(' ')}
        >
          <span className="shrink-0" aria-hidden="true">
            {item.icon}
          </span>
          <div className="min-w-0">
            <span className="block text-[var(--text-xs)] text-[var(--color-text-tertiary)] uppercase tracking-wider leading-none mb-1">
              {item.label}
            </span>
            <span className="block text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)] tabular-nums leading-none">
              {item.getValue(props)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsBar;
