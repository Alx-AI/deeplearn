'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { duration } from '@/lib/design-tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-text-inverse)] ' +
    'hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)]',
  secondary:
    'bg-transparent text-[var(--color-text-primary)] ' +
    'border border-[var(--color-border-primary)] ' +
    'hover:bg-[var(--color-bg-tertiary)] active:bg-[var(--color-bg-secondary)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] ' +
    'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-[var(--text-sm)] px-3 py-1.5 gap-1.5',
  md: 'text-[var(--text-base)] px-4 py-2 gap-2',
  lg: 'text-[var(--text-lg)] px-6 py-3 gap-2.5',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      disabled,
      children,
      className = '',
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ duration: duration.instant / 1000 }}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center',
          'font-medium leading-none',
          'rounded-[var(--radius-md)]',
          'transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
          'disabled:opacity-50 disabled:pointer-events-none',
          'cursor-pointer',
          'select-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {loading ? (
          <Loader2
            className="animate-spin"
            size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
            aria-hidden="true"
          />
        ) : icon ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{children}</span>
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export default Button;
