'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  ChevronRight,
  Flame,
  Target,
  Zap,
} from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';
import { PageTransition } from '@/components/ui/PageTransition';
import type { MasteryLevel } from '@/lib/srs/mastery';
import { MASTERY_LABELS, MASTERY_COLORS, masteryToScore } from '@/lib/srs/mastery';
import { modules, getLessonsForModule } from '@/content';
import { useReviewDue } from '@/lib/hooks/useReviewDue';
import { useReviewStats, useLessonProgress } from '@/lib/db/hooks';

// ---------------------------------------------------------------------------
// Mastery Badge
// ---------------------------------------------------------------------------

function MasteryBadge({ level }: { level: MasteryLevel }) {
  const colors = MASTERY_COLORS[level];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {MASTERY_LABELS[level]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary ${className}`}>
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.38, 0.9] }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Module Card
// ---------------------------------------------------------------------------

interface ModuleCardData {
  id: string;
  title: string;
  description: string;
  order: number;
  lessonCount: number;
}

function ModuleCard({
  module,
  mastery,
  index,
}: {
  module: ModuleCardData;
  mastery: MasteryLevel;
  index: number;
}) {
  const score = masteryToScore(mastery);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.2, 0, 0.38, 0.9] }}
    >
      <Link
        href={`/learn?module=${module.id}`}
        className="group block min-h-[180px] rounded-xl border border-border bg-elevated p-5 no-underline shadow-sm transition-all duration-200 hover:border-accent/30 hover:shadow-lg hover:bg-[color-mix(in_srgb,var(--color-bg-elevated)_97%,var(--color-accent)_3%)] cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-sm font-semibold text-secondary">
            {module.order}
          </div>
          <MasteryBadge level={mastery} />
        </div>
        <h3 className="mt-3 text-lg font-semibold text-primary group-hover:text-accent transition-colors">
          {module.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-secondary">
          {module.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-tertiary">
          <span>{module.lessonCount} lessons</span>
          <span>{score}%</span>
        </div>
        <ProgressBar value={score} className="mt-2" />
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Stats Cards
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
  // Real data from hooks
  const { dueCount } = useReviewDue();
  const { todayCount: reviewedToday } = useReviewStats();
  const { allProgress, statusCounts } = useLessonProgress();

  // Derive module data from real content
  const moduleData: ModuleCardData[] = useMemo(
    () =>
      modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        order: m.order,
        lessonCount: m.lessonIds.length,
      })),
    [],
  );

  // Compute per-module mastery from lesson progress
  const moduleMastery: Record<string, MasteryLevel> = useMemo(() => {
    const result: Record<string, MasteryLevel> = {};
    for (const mod of modules) {
      const moduleLessons = getLessonsForModule(mod.id);
      const completedCount = moduleLessons.filter((l) => {
        const p = allProgress.find((ap) => ap.lessonId === l.id);
        return p && (p.status === 'completed' || p.status === 'mastered');
      }).length;
      const startedCount = moduleLessons.filter((l) => {
        const p = allProgress.find((ap) => ap.lessonId === l.id);
        return p && p.status === 'in-progress';
      }).length;

      if (completedCount === moduleLessons.length && moduleLessons.length > 0) {
        // All completed -- check if mastered
        const masteredCount = moduleLessons.filter((l) => {
          const p = allProgress.find((ap) => ap.lessonId === l.id);
          return p && p.status === 'mastered';
        }).length;
        result[mod.id] = masteredCount >= moduleLessons.length * 0.9 ? 'mastered' : 'proficient';
      } else if (completedCount >= moduleLessons.length * 0.5) {
        result[mod.id] = 'familiar';
      } else if (completedCount > 0 || startedCount > 0) {
        result[mod.id] = 'learning';
      } else {
        result[mod.id] = 'new';
      }
    }
    return result;
  }, [allProgress]);

  // Compute overall mastery as percentage of completed lessons
  const totalLessons = modules.reduce((sum, m) => sum + m.lessonIds.length, 0);
  const overallMastery = useMemo(() => {
    if (totalLessons === 0) return 0;
    const completedOrMastered = allProgress.filter(
      (p) => p.status === 'completed' || p.status === 'mastered',
    ).length;
    return Math.round((completedOrMastered / totalLessons) * 100);
  }, [allProgress, totalLessons]);

  const cardsDue = dueCount;

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
              Deep Learning with Python, mastered through spaced repetition
            </p>
          </motion.div>

          {/* Stats Bar */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={<Target className="h-4.5 w-4.5" />}
              label="Cards Due"
              value={cardsDue}
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
        {cardsDue > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-10"
          >
            <Link
              href="/review"
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
                    {cardsDue} card{cardsDue !== 1 ? 's' : ''} ready for review
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        )}

        {/* Module Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-primary">Modules</h2>
          <p className="mt-1 text-sm text-secondary">
            {modules.length} modules, {totalLessons} lessons, covering the complete deep learning curriculum
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moduleData.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              mastery={moduleMastery[mod.id] || 'new'}
              index={i}
            />
          ))}
        </div>
        </div>
      </PageTransition>
    </div>
  );
}
