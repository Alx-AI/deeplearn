'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Lock,
  Circle,
  PlayCircle,
  CheckCircle2,
  Star,
  Clock,
} from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';
import { PageTransition } from '@/components/ui/PageTransition';
import type { MasteryLevel } from '@/lib/srs/mastery';
import { MASTERY_LABELS, MASTERY_COLORS, masteryToScore } from '@/lib/srs/mastery';
import type { UserLessonProgress, Lesson } from '@/lib/db/schema';
import { modules, getLessonsForModule } from '@/content';
import { useLessonProgress } from '@/lib/db/hooks';

// ---------------------------------------------------------------------------
// Status Icon
// ---------------------------------------------------------------------------

function StatusIcon({ status }: { status: UserLessonProgress['status'] }) {
  switch (status) {
    case 'locked':
      return <Lock className="h-4 w-4 text-disabled" />;
    case 'available':
      return <Circle className="h-4 w-4 text-tertiary" />;
    case 'in-progress':
      return <PlayCircle className="h-4 w-4 text-accent" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case 'mastered':
      return <Star className="h-4 w-4 text-[var(--color-mastery-mastered-fill)]" />;
  }
}

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

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
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
// Derived data types for display
// ---------------------------------------------------------------------------

interface LessonDisplayData {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: UserLessonProgress['status'];
}

interface ModuleDisplayData {
  id: string;
  title: string;
  description: string;
  order: number;
  mastery: MasteryLevel;
  lessons: LessonDisplayData[];
}

// ---------------------------------------------------------------------------
// Helper: derive effective lesson status from DB progress
// ---------------------------------------------------------------------------

/**
 * Determines the effective status for a lesson given its DB progress record
 * and whether it should be unlocked based on sequential progression.
 *
 * Rules:
 *   - If a DB progress record exists, use its status directly.
 *   - If no record exists and isFirstAvailable is true, default to 'available'.
 *   - Otherwise default to 'locked'.
 */
function deriveLessonStatus(
  progress: UserLessonProgress | undefined,
  isFirstAvailable: boolean,
): UserLessonProgress['status'] {
  if (progress) return progress.status;
  return isFirstAvailable ? 'available' : 'locked';
}

/**
 * Derive module mastery from the count of completed/mastered lessons.
 *   - 0 completed         => 'new'
 *   - 1+ but not all      => 'learning'
 *   - all completed       => 'proficient'
 *   - all mastered        => 'mastered'
 */
function deriveModuleMastery(
  lessons: LessonDisplayData[],
): MasteryLevel {
  const total = lessons.length;
  if (total === 0) return 'new';

  const completedCount = lessons.filter(
    (l) => l.status === 'completed' || l.status === 'mastered',
  ).length;
  const masteredCount = lessons.filter(
    (l) => l.status === 'mastered',
  ).length;

  if (masteredCount === total) return 'mastered';
  if (completedCount === total) return 'proficient';
  if (completedCount > 0) return 'learning';
  return 'new';
}

// ---------------------------------------------------------------------------
// Hook: build display data from real content + DB progress
// ---------------------------------------------------------------------------

function useModuleDisplayData(): {
  moduleData: ModuleDisplayData[];
  isLoading: boolean;
} {
  const { getProgress, isLoading } = useLessonProgress();

  const moduleData = useMemo(() => {
    // Track whether the previous lesson (globally, across modules in order)
    // was completed/mastered, so we can unlock the next one.
    let previousLessonDone = true; // First lesson of first module is always available

    return modules
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((mod) => {
        const contentLessons: Lesson[] = getLessonsForModule(mod.id);

        const displayLessons: LessonDisplayData[] = contentLessons.map(
          (lesson, lessonIndex) => {
            const progress = getProgress(lesson.id);

            // Determine if this lesson should default to 'available' when
            // there is no progress record:
            //   - The very first lesson (mod-1, lesson index 0) is always available.
            //   - Any lesson whose previous lesson is completed/mastered is available.
            const isFirstAvailable = previousLessonDone;

            const status = deriveLessonStatus(progress, isFirstAvailable);

            // Update the tracker: the "previous lesson" for the next iteration
            // is considered done if its effective status is completed or mastered.
            previousLessonDone =
              status === 'completed' || status === 'mastered';

            return {
              id: lesson.id,
              title: lesson.title,
              description: lesson.description,
              estimatedMinutes: lesson.estimatedMinutes,
              status,
            };
          },
        );

        const mastery = deriveModuleMastery(displayLessons);

        return {
          id: mod.id,
          title: mod.title,
          description: mod.description,
          order: mod.order,
          mastery,
          lessons: displayLessons,
        };
      });
  }, [getProgress]);

  return { moduleData, isLoading };
}

// ---------------------------------------------------------------------------
// Module Accordion
// ---------------------------------------------------------------------------

function ModuleAccordion({ module, index }: { module: ModuleDisplayData; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const score = masteryToScore(module.mastery);
  const completedCount = module.lessons.filter(
    (l) => l.status === 'completed' || l.status === 'mastered',
  ).length;
  const progressPercent = module.lessons.length > 0 ? (completedCount / module.lessons.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="overflow-hidden rounded-xl border border-border bg-elevated shadow-sm"
    >
      {/* Module Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-surface/40 cursor-pointer"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-lg font-semibold text-secondary">
          {module.order}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-primary truncate">
              {module.title}
            </h3>
            <MasteryBadge level={module.mastery} />
          </div>
          <p className="mt-0.5 text-sm text-secondary truncate">
            {module.description}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <ProgressBar value={progressPercent} />
            <span className="shrink-0 text-xs text-tertiary">
              {completedCount}/{module.lessons.length}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-tertiary"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>

      {/* Lesson List */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0.38, 0.9] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {module.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  moduleId={module.id}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Lesson Row
// ---------------------------------------------------------------------------

function LessonRow({
  lesson,
  moduleId,
}: {
  lesson: LessonDisplayData;
  moduleId: string;
}) {
  const isClickable = lesson.status !== 'locked';

  const content = (
    <div
      className={`group/row flex items-center gap-3 px-5 py-3.5 transition-all duration-150 ${
        isClickable
          ? 'hover:bg-surface/50 cursor-pointer active:bg-surface/70'
          : 'opacity-50 cursor-not-allowed'
      } ${lesson.status === 'in-progress' ? 'bg-accent-subtle/30' : ''}`}
    >
      <div className="flex h-6 w-6 items-center justify-center shrink-0">
        <StatusIcon status={lesson.status} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium transition-colors duration-150 ${
            lesson.status === 'locked' ? 'text-disabled' : 'text-primary group-hover/row:text-accent'
          }`}
        >
          {lesson.title}
        </p>
        <p className="text-xs text-tertiary line-clamp-2">{lesson.description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 text-xs text-secondary">
          <Clock className="h-3.5 w-3.5" />
          {lesson.estimatedMinutes}m
        </span>
        {isClickable && (
          <ChevronRight className="h-4 w-4 text-tertiary transition-transform duration-150 group-hover/row:translate-x-0.5 group-hover/row:text-accent" />
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <Link
        href={`/learn/${moduleId}/${lesson.id}`}
        className="block no-underline border-b border-border-secondary last:border-b-0"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border-b border-border-secondary last:border-b-0">
      {content}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Learn Page
// ---------------------------------------------------------------------------

export default function LearnPage() {
  const { moduleData, isLoading } = useModuleDisplayData();

  const totalLessons = moduleData.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = moduleData.reduce(
    (sum, m) =>
      sum +
      m.lessons.filter((l) => l.status === 'completed' || l.status === 'mastered').length,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <PageTransition>
        <div className="container-wide py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Learning Path
            </h1>
            <p className="mt-2 text-base text-secondary">
              {completedLessons} of {totalLessons} lessons completed across {moduleData.length} modules
            </p>
          </motion.div>

          <div className="flex flex-col gap-3">
            {moduleData.map((mod, i) => (
              <ModuleAccordion key={mod.id} module={mod} index={i} />
            ))}
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
