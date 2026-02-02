'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Something went wrong');
      setLoading(false);
      return;
    }

    // Auto sign-in after successful signup
    const signInRes = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (signInRes?.error) {
      setError('Account created but sign-in failed. Please sign in manually.');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line
                x1="4.5" y1="13.5" x2="13.5" y2="4.5"
                stroke="var(--color-accent)" strokeWidth="1.25" strokeLinecap="round" opacity="0.45"
              />
              <circle cx="4.5" cy="13.5" r="3" fill="var(--color-accent)" opacity="0.55" />
              <circle cx="13.5" cy="4.5" r="3" fill="var(--color-accent)" />
            </svg>
            <span className="text-2xl leading-none text-primary" style={{ letterSpacing: '-0.04em' }}>
              <span className="font-semibold">Deep</span>
              <span className="font-bold text-accent">Learn</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-secondary">
            Master deep learning through spaced repetition
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-elevated p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-primary text-center mb-1">
            Create an account
          </h1>
          <p className="text-sm text-secondary text-center mb-6">
            Start tracking your learning progress
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-primary mb-1">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-secondary">
            Already have an account?{' '}
            <Link href="/signin" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
