'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function SignInPage() {
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
            Sign in to continue
          </h1>
          <p className="text-sm text-secondary text-center mb-6">
            Your progress is saved to your account
          </p>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-surface cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
