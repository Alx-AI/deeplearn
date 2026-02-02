'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Target,
  Flame,
  BarChart3,
  Zap,
} from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';
import { PageTransition } from '@/components/ui/PageTransition';
import { books } from '@/content/books';
import { getModulesForBook, getLessonsForBook, getTotalCardCount } from '@/content';
import { useReviewDue } from '@/lib/hooks/useReviewDue';
import { useReviewStats, useLessonProgress } from '@/lib/db/hooks';

// ---------------------------------------------------------------------------
// Book Card
// ---------------------------------------------------------------------------

function BookCard({
  bookId,
  title,
  shortTitle,
  authors,
  description,
  moduleCount,
  lessonCount,
  cardCount,
  completedLessons,
  index,
}: {
  bookId: string;
  title: string;
  shortTitle: string;
  authors: string;
  description: string;
  moduleCount: number;
  lessonCount: number;
  cardCount: number;
  completedLessons: number;
  index: number;
}) {
  const progressPct = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.2, 0, 0.38, 0.9] }}
    >
      <Link
        href={`/books/${bookId}/learn`}
        className="group block rounded-xl border border-border bg-elevated p-6 no-underline shadow-sm transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:bg-[color-mix(in_srgb,var(--color-bg-elevated)_97%,var(--color-accent)_3%)] cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          {progressPct > 0 && (
            <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent">
              {progressPct}%
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
          {shortTitle}
        </h3>
        <p className="mt-0.5 text-xs text-tertiary">
          {authors}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-secondary line-clamp-2">
          {description}
        </p>

        <div className="mt-5 flex items-center gap-4 text-xs text-tertiary">
          <span>{moduleCount} modules</span>
          <span className="h-3 w-px bg-border" />
          <span>{lessonCount} lessons</span>
          <span className="h-3 w-px bg-border" />
          <span>{cardCount} cards</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0.38, 0.9] }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
            {completedLessons > 0 ? 'Continue Learning' : 'Start Learning'}
          </span>
          <ChevronRight className="h-4 w-4 text-tertiary transition-transform group-hover:translate-x-1 group-hover:text-accent" />
        </div>
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  accent = false,
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08, ease: [0.2, 0, 0.38, 0.9] }}
      whileHover={{ y: -2, boxShadow: 'var(--shadow-lg)' }}
      className="flex items-center gap-3 rounded-xl border border-border bg-elevated px-4 py-3 shadow-sm transition-all duration-200"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ${
          accent ? 'bg-accent/90 text-inverse' : 'bg-surface text-secondary'
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-tertiary uppercase tracking-wider">{label}</p>
        <p className="text-lg font-semibold text-primary tabular-nums">{value}</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Home Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const { dueCount } = useReviewDue();
  const { todayCount: reviewedToday } = useReviewStats();
  const { allProgress } = useLessonProgress();

  // Compute per-book stats
  const bookStats = useMemo(() => {
    return books.map((book) => {
      const bookModules = getModulesForBook(book.id);
      const bookLessons = getLessonsForBook(book.id);
      const cardCount = getTotalCardCount(book.id);

      const completedLessons = bookLessons.filter((l) => {
        const p = allProgress.find((ap) => ap.lessonId === l.id);
        return p && (p.status === 'completed' || p.status === 'mastered');
      }).length;

      return {
        ...book,
        moduleCount: bookModules.length,
        lessonCount: bookLessons.length,
        cardCount,
        completedLessons,
      };
    });
  }, [allProgress]);

  // Overall stats
  const totalLessons = bookStats.reduce((sum, b) => sum + b.lessonCount, 0);
  const totalCompleted = bookStats.reduce((sum, b) => sum + b.completedLessons, 0);
  const overallMastery = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <PageTransition>
        <div className="container-wide py-8 sm:py-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              DeepLearn
            </h1>
            <p className="mt-2 text-lg text-secondary">
              Master deep learning and multi-agent RL through spaced repetition
            </p>
          </motion.div>

          {/* Stats Bar */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={<Target className="h-4.5 w-4.5" />}
              label="Cards Due"
              value={dueCount}
              accent
              index={0}
            />
            <StatCard
              icon={<Flame className="h-4.5 w-4.5" />}
              label="Reviewed Today"
              value={reviewedToday}
              index={1}
            />
            <StatCard
              icon={<BarChart3 className="h-4.5 w-4.5" />}
              label="Overall Mastery"
              value={`${overallMastery}%`}
              index={2}
            />
          </div>

          {/* Review CTA */}
          {dueCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-10"
            >
              <Link
                href="/books/deep-learning-python/review"
                className="group flex items-center justify-between rounded-xl border border-accent/25 bg-accent-subtle px-6 py-4 no-underline transition-all duration-200 hover:border-accent/40 hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                    <span className="absolute inset-0 rounded-xl bg-accent animate-[cta-pulse_2.5s_ease-in-out_infinite] opacity-0" />
                    <Zap className="relative h-5 w-5 text-inverse" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-primary">
                      Review Now
                    </p>
                    <p className="text-sm text-secondary">
                      {dueCount} card{dueCount !== 1 ? 's' : ''} ready for review
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          )}

          {/* Book Selector Grid */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-primary">Books</h2>
            <p className="mt-1 text-sm text-secondary">
              {books.length} learning sources, {totalLessons} total lessons
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {bookStats.map((book, i) => (
              <BookCard
                key={book.id}
                bookId={book.id}
                title={book.title}
                shortTitle={book.shortTitle}
                authors={book.authors}
                description={book.description}
                moduleCount={book.moduleCount}
                lessonCount={book.lessonCount}
                cardCount={book.cardCount}
                completedLessons={book.completedLessons}
                index={i}
              />
            ))}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
