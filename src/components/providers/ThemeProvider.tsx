/**
 * Theme provider component.
 *
 * Initialises the theme store on mount, syncs the data-theme attribute to
 * the DOM, and listens for system colour scheme changes. Also injects a
 * blocking <script> to prevent flash of wrong theme (FOUC) on initial load.
 *
 * Must be rendered as a Client Component because it accesses browser APIs
 * (localStorage, matchMedia, document).
 *
 * Usage:
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 */

'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store';

// ---------------------------------------------------------------------------
// Inline script to prevent FOUC
// ---------------------------------------------------------------------------

/**
 * This script runs synchronously before React hydration to apply the correct
 * theme class immediately. It prevents the brief flash of the wrong theme
 * that would otherwise occur between HTML delivery and React mount.
 */
const ANTI_FOUC_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('deeplearn-theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    const cleanup = initTheme();
    return cleanup;
  }, [initTheme]);

  return (
    <>
      {/* Blocking script to prevent flash of wrong theme */}
      <script
        dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }}
        suppressHydrationWarning
      />
      {children}
    </>
  );
}
