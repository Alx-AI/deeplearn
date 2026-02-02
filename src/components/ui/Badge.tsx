'use client';

import {
  MASTERY_COLORS,
  MASTERY_LABELS,
  type MasteryLevel,
} from '@/lib/srs/mastery';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BadgeProps {
  level: MasteryLevel;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Badge({ level, className = '' }: BadgeProps) {
  const colors = MASTERY_COLORS[level];

  return (
    <span
      className={[
        'inline-flex items-center',
        'px-2 py-0.5',
        'rounded-full',
        'border',
        'text-[var(--text-xs)] font-medium leading-none',
        'select-none',
        colors.bg,
        colors.text,
        colors.border,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {MASTERY_LABELS[level]}
    </span>
  );
}

export default Badge;
