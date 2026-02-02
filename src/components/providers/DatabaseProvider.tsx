'use client';

import { useEffect, useState, useCallback } from 'react';
import { SWRConfig } from 'swr';

type DbStatus = 'loading' | 'ready' | 'error';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<DbStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(data.message ?? 'Database not ready');
      setStatus('ready');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown database error';
      console.error('[DatabaseProvider] Health check failed:', err);
      setErrorMessage(message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  if (status === 'loading') {
    return (
      <div
        role="status"
        aria-label="Loading application data"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          fontFamily: 'var(--font-sans)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: 'var(--space-6)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Unable to connect to database
          </h2>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-4)',
            }}
          >
            DeepLearn could not reach the database server. Please check your
            connection and try again.
          </p>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-tertiary)',
              fontFamily: 'var(--font-mono)',
              wordBreak: 'break-word',
            }}
          >
            {errorMessage}
          </p>
          <button
            onClick={() => {
              setStatus('loading');
              setErrorMessage('');
              checkHealth();
            }}
            style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-2) var(--space-6)',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--weight-medium)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
