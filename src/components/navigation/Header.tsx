'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Sun, Moon, Monitor } from 'lucide-react';
import { duration } from '@/lib/design-tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ThemeMode = 'light' | 'dark' | 'system';

export interface HeaderProps {
  /** Number of review cards currently due. */
  reviewsDue?: number;
  /** Current theme mode. */
  theme?: ThemeMode;
  /** Called when the theme is toggled. */
  onThemeChange?: (theme: ThemeMode) => void;
  /** Called when the settings icon is clicked. */
  onSettingsClick?: () => void;
  /** Called when the review badge is clicked. */
  onReviewClick?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Theme cycle: system -> light -> dark -> system
// ---------------------------------------------------------------------------

const themeCycle: ThemeMode[] = ['system', 'light', 'dark'];

const themeIcons: Record<ThemeMode, React.ReactNode> = {
  system: <Monitor size={18} />,
  light: <Sun size={18} />,
  dark: <Moon size={18} />,
};

const themeLabels: Record<ThemeMode, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Header({
  reviewsDue = 0,
  theme = 'system',
  onThemeChange,
  onSettingsClick,
  onReviewClick,
  className = '',
}: HeaderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(theme);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    const idx = themeCycle.indexOf(currentTheme);
    const next = themeCycle[(idx + 1) % themeCycle.length];
    setCurrentTheme(next);
    onThemeChange?.(next);
  }, [currentTheme, onThemeChange]);

  return (
    <header
      className={[
        'sticky top-0 z-[var(--z-sticky)]',
        'h-14',
        'bg-[var(--color-bg-primary)]/95 backdrop-blur-sm',
        'border-b border-[var(--color-border-secondary)]',
        'px-[var(--grid-margin)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="h-full max-w-[var(--width-max)] mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-[var(--text-lg)] font-semibold tracking-[-0.015em] text-[var(--color-text-primary)] no-underline hover:text-[var(--color-accent)] transition-colors"
          aria-label="DeepLearn home"
        >
          DeepLearn
        </a>

        {/* Right-side actions */}
        <div className="flex items-center gap-1">
          {/* Review badge */}
          {reviewsDue > 0 && (
            <button
              onClick={onReviewClick}
              className={[
                'relative flex items-center gap-1.5 px-3 py-1.5',
                'rounded-[var(--radius-md)]',
                'text-[var(--text-sm)] font-medium',
                'text-[var(--color-accent)]',
                'hover:bg-[var(--color-accent-subtle)]',
                'transition-colors cursor-pointer',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
              ].join(' ')}
              aria-label={`${reviewsDue} cards due for review`}
            >
              <motion.span
                key={reviewsDue}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: duration.fast / 1000 }}
                className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[var(--color-accent)] text-[var(--color-text-inverse)] text-[var(--text-xs)] font-semibold tabular-nums"
              >
                {reviewsDue > 99 ? '99+' : reviewsDue}
              </motion.span>
              <span className="hidden sm:inline">Review</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className={[
              'p-2 rounded-[var(--radius-md)]',
              'text-[var(--color-text-secondary)]',
              'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
              'transition-colors cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
            ].join(' ')}
            aria-label={themeLabels[currentTheme]}
            title={themeLabels[currentTheme]}
          >
            {themeIcons[currentTheme]}
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className={[
              'p-2 rounded-[var(--radius-md)]',
              'text-[var(--color-text-secondary)]',
              'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
              'transition-colors cursor-pointer',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
            ].join(' ')}
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
