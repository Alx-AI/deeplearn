'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from './ThemeProvider';
import { DatabaseProvider } from './DatabaseProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <DatabaseProvider>
          {children}
        </DatabaseProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
