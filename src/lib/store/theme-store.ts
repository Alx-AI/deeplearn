/**
 * Theme management store (Zustand).
 *
 * Handles light/dark/system theme preferences with:
 *   - localStorage persistence (key: 'deeplearn-theme')
 *   - System `prefers-color-scheme` media query listener
 *   - DOM sync via `data-theme` attribute on `<html>`
 *   - Resolved theme computation (system -> actual light/dark)
 *
 * The store is initialised lazily on first access. The ThemeProvider component
 * calls `initTheme()` on mount to hydrate from localStorage and attach the
 * media query listener.
 *
 * Usage:
 *   import { useThemeStore } from '@/lib/store';
 *   const theme = useThemeStore((s) => s.theme);
 *   const setTheme = useThemeStore((s) => s.setTheme);
 */

import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'deeplearn-theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  /** The user's preference: explicit light/dark or follow system */
  theme: Theme;
  /** The actual rendered theme after resolving 'system' */
  resolvedTheme: 'light' | 'dark';
  /** Whether the store has been initialised (hydrated from localStorage) */
  isHydrated: boolean;
  /** Set the theme preference and persist to localStorage */
  setTheme: (theme: Theme) => void;
  /** Initialise from localStorage and attach system theme listener. Returns cleanup fn. */
  initTheme: () => () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read the system's preferred color scheme.
 * Returns 'dark' if the system prefers dark mode, 'light' otherwise.
 * Safe to call during SSR (returns 'light' when window is undefined).
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Resolve the user preference to an actual theme value.
 */
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

/**
 * Apply the resolved theme to the DOM.
 * Sets or removes the `data-theme` attribute on `<html>`.
 */
function applyThemeToDOM(theme: Theme, resolved: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (theme === 'system') {
    // Let the CSS `prefers-color-scheme` media queries handle it
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', resolved);
  }
}

/**
 * Read saved theme from localStorage. Returns null if nothing saved or invalid.
 */
function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable (e.g. private browsing in some browsers)
  }
  return null;
}

/**
 * Persist theme preference to localStorage.
 */
function writeStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',
  isHydrated: false,

  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    writeStoredTheme(theme);
    applyThemeToDOM(theme, resolved);
    set({ theme, resolvedTheme: resolved });
  },

  initTheme: () => {
    // Hydrate from localStorage
    const stored = readStoredTheme() ?? 'system';
    const resolved = resolveTheme(stored);

    applyThemeToDOM(stored, resolved);
    set({ theme: stored, resolvedTheme: resolved, isHydrated: true });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const current = get();
      if (current.theme === 'system') {
        const newResolved = getSystemTheme();
        applyThemeToDOM('system', newResolved);
        set({ resolvedTheme: newResolved });
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  },
}));
