'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <div className="container-content py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Large 404 */}
          <p
            className="text-[8rem] font-bold leading-none tracking-tighter text-accent/15 select-none sm:text-[10rem]"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="-mt-6 text-2xl font-bold text-primary sm:text-3xl">
            Page Not Found
          </h1>
          <p className="mt-3 text-base text-secondary max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back on track.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-inverse no-underline transition-colors hover:bg-accent-hover"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/learn"
              className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-5 py-2.5 text-sm font-medium text-primary no-underline transition-colors hover:bg-surface"
            >
              <BookOpen className="h-4 w-4" />
              Browse Lessons
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
