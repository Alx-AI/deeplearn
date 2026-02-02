'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { duration } from '@/lib/design-tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  padding?: CardPadding;
  hoverable?: boolean;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = 'md',
      hoverable = false,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverable
            ? { y: -2, boxShadow: 'var(--shadow-md)' }
            : undefined
        }
        transition={{ duration: duration.fast / 1000 }}
        className={[
          'bg-[var(--color-bg-elevated)]',
          'border border-[var(--color-border-secondary)]',
          'rounded-[var(--radius-lg)]',
          'shadow-sm',
          hoverable && 'cursor-pointer',
          paddingClasses[padding],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...(props as HTMLMotionProps<'div'>)}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = 'Card';

export { Card };
export default Card;
