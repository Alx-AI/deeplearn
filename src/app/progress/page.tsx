'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Calendar,
  Target,
  Flame,
  Star,
  Layers,
} from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';
import { PageTransition } from '@/components/ui/PageTransition';
import type { MasteryLevel } from '@/lib/srs/mastery';
import { MASTERY_LABELS, MASTERY_COLORS, masteryToScore } from '@/lib/srs/mastery';
import { modules, getLessonsForModule, getTotalCardCount, getTotalLessonCount } from '@/content';
import {
  useLessonProgress,
  useReviewStats,
  useAllCardStates,
  useReviewLogsByRange,
} from '@/lib/db/hooks';
import { State as FSRSState } from 'ts-fsrs';

// ---------------------------------------------------------------------------
// Types for derived module data
// ---------------------------------------------------------------------------

interface ModuleData {
  id: string;
  title: string;
  lessonCount: number;
  completedCount: number;
  mastery: MasteryLevel;
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-elevated p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-secondary">
          {icon}
        </div>
        <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-3xl font-bold text-primary">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-secondary">{subtitle}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress Bar for module
// ---------------------------------------------------------------------------

function ModuleProgress({
  module,
  index,
}: {
  module: ModuleData;
  index: number;
}) {
  const pct = module.lessonCount > 0 ? (module.completedCount / module.lessonCount) * 100 : 0;
  const colors = MASTERY_COLORS[module.mastery];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex items-center gap-3 sm:gap-4"
    >
      <div className="w-28 sm:w-36 shrink-0">
        <p className="text-sm font-medium text-primary truncate" title={module.title}>{module.title}</p>
        <p className="text-xs text-tertiary">
          {module.completedCount}/{module.lessonCount} lessons
        </p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-tertiary">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay: index * 0.04 + 0.2 }}
          />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {MASTERY_LABELS[module.mastery]}
        </span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Card State Distribution
// ---------------------------------------------------------------------------

function CardStateBar({
  cardStates,
}: {
  cardStates: { new: number; learning: number; review: number; relearning: number };
}) {
  const total = Object.values(cardStates).reduce((a, b) => a + b, 0);
  const segments = [
    { key: 'new', label: 'New', count: cardStates.new, color: 'bg-[var(--color-text-tertiary)]' },
    { key: 'learning', label: 'Learning', count: cardStates.learning, color: 'bg-[var(--color-warning)]' },
    { key: 'review', label: 'Review', count: cardStates.review, color: 'bg-[var(--color-success)]' },
    { key: 'relearning', label: 'Relearning', count: cardStates.relearning, color: 'bg-[var(--color-error)]' },
  ];

  return (
    <div className="rounded-xl border border-border bg-elevated p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
        <Layers className="h-4 w-4 text-accent" />
        Cards by State
      </h2>

      {/* Stacked bar */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-surface-tertiary mb-4">
        {segments.map((seg) => (
          <motion.div
            key={seg.key}
            className={`h-full ${seg.color}`}
            initial={{ width: 0 }}
            animate={{ width: total > 0 ? `${(seg.count / total) * 100}%` : '0%' }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0.38, 0.9] }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
            <div>
              <p className="text-xs text-tertiary">{seg.label}</p>
              <p className="text-sm font-semibold text-primary">{seg.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly Bar Chart
// ---------------------------------------------------------------------------

function WeeklyChart({
  weeklyReviews,
}: {
  weeklyReviews: { day: string; count: number }[];
}) {
  const maxCount = Math.max(...weeklyReviews.map((d) => d.count), 1);
  const allZero = weeklyReviews.every((d) => d.count === 0);

  return (
    <div className="rounded-xl border border-border bg-elevated p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
        <TrendingUp className="h-4 w-4 text-accent" />
        Reviews This Week
      </h2>
      {allZero ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <TrendingUp className="h-6 w-6 text-tertiary/40 mb-2" />
          <p className="text-sm text-tertiary">No reviews yet</p>
          <p className="text-xs text-disabled mt-0.5">Complete some reviews to see your weekly chart</p>
        </div>
      ) : (
        <div className="flex items-end gap-1.5 sm:gap-2 h-32">
          {weeklyReviews.map((day, i) => {
            const height = (day.count / maxCount) * 100;
            return (
              <div key={`${day.day}-${i}`} className="flex flex-1 flex-col items-center gap-1 min-w-0">
                <span className="text-xs font-medium text-primary tabular-nums truncate w-full text-center">{day.count}</span>
                <div className="w-full relative" style={{ height: '100%' }}>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-accent/80"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    style={{ minHeight: day.count > 0 ? 4 : 0 }}
                  />
                </div>
                <span className="text-xs text-tertiary">{day.day}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity Heatmap (simplified)
// ---------------------------------------------------------------------------

function ActivityHeatmap({
  heatmapData,
}: {
  heatmapData: { date: Date; count: number }[];
}) {
  const maxCount = Math.max(...heatmapData.map((d) => d.count), 1);
  const allZero = heatmapData.every((d) => d.count === 0);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-surface-tertiary';
    const ratio = count / maxCount;
    if (ratio < 0.25) return 'bg-accent/20';
    if (ratio < 0.5) return 'bg-accent/40';
    if (ratio < 0.75) return 'bg-accent/60';
    return 'bg-accent/90';
  };

  return (
    <div className="rounded-xl border border-border bg-elevated p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
        <Calendar className="h-4 w-4 text-accent" />
        Activity (Last 28 Days)
      </h2>
      {allZero ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Calendar className="h-6 w-6 text-tertiary/40 mb-2" />
          <p className="text-sm text-tertiary">No activity yet</p>
          <p className="text-xs text-disabled mt-0.5">Start reviewing cards to build your streak</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5">
            {heatmapData.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.01 }}
                className={`aspect-square rounded-[3px] ${getIntensity(day.count)} transition-transform hover:scale-110`}
                title={`${day.date.toLocaleDateString()}: ${day.count} reviews`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-1 text-xs text-tertiary">
            <span className="mr-0.5">Less</span>
            <div className="h-2.5 w-2.5 rounded-[2px] bg-surface-tertiary" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/20" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/40" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/60" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-accent/90" />
            <span className="ml-0.5">More</span>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Derive a simple mastery level from completed vs total lesson counts. */
function deriveModuleMastery(completedCount: number, lessonCount: number): MasteryLevel {
  if (completedCount === 0) return 'new';
  if (completedCount >= lessonCount) return 'proficient';
  return 'learning';
}

// ---------------------------------------------------------------------------
// Progress Page
// ---------------------------------------------------------------------------

export default function ProgressPage() {
  // -- DB hooks (SWR-based) ---------------------------------------------------
  const { allProgress, isLoading: progressLoading, getProgress } = useLessonProgress();
  const { todayCount, totalCount: totalReviewCount, isLoading: statsLoading } = useReviewStats();

  // Card states from SWR
  const { allCardStates } = useAllCardStates();

  // Review logs for the last 7 days (for weekly chart)
  const sevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 6);
    return d;
  }, []);

  const { logs: weeklyLogs } = useReviewLogsByRange(sevenDaysAgo);

  // Review logs for the last 28 days (for heatmap)
  const twentyEightDaysAgo = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 27);
    return d;
  }, []);

  const { logs: heatmapLogs } = useReviewLogsByRange(twentyEightDaysAgo);

  // -- Derive module data ---------------------------------------------------
  const moduleData: ModuleData[] = useMemo(() => {
    return modules.map((mod) => {
      const lessonCount = mod.lessonIds.length;
      const completedCount = mod.lessonIds.filter((lid) => {
        const p = getProgress(lid);
        return p && (p.status === 'completed' || p.status === 'mastered');
      }).length;
      return {
        id: mod.id,
        title: mod.title,
        lessonCount,
        completedCount,
        mastery: deriveModuleMastery(completedCount, lessonCount),
      };
    });
  }, [getProgress]);

  // -- Derive card state counts ---------------------------------------------
  const cardStateCounts = useMemo(() => {
    const counts = { new: 0, learning: 0, review: 0, relearning: 0 };
    for (const card of allCardStates) {
      switch (card.state) {
        case FSRSState.New:
          counts.new++;
          break;
        case FSRSState.Learning:
          counts.learning++;
          break;
        case FSRSState.Review:
          counts.review++;
          break;
        case FSRSState.Relearning:
          counts.relearning++;
          break;
      }
    }
    // Add cards that exist in content but have no UserCardState yet
    const totalContentCards = getTotalCardCount();
    const trackedCount = allCardStates.length;
    if (totalContentCards > trackedCount) {
      counts.new += totalContentCards - trackedCount;
    }
    return counts;
  }, [allCardStates]);

  // -- Derive weekly reviews ------------------------------------------------
  const weeklyReviews = useMemo(() => {
    const days: { day: string; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({ day: DAY_LABELS[d.getDay()], count: 0 });
    }
    for (const log of weeklyLogs) {
      const logDate = new Date(log.timestamp);
      const diffMs = now.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        days[6 - diffDays].count++;
      }
    }
    return days;
  }, [weeklyLogs]);

  // -- Derive heatmap data --------------------------------------------------
  const heatmapData = useMemo(() => {
    const days: { date: Date; count: number }[] = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({ date: d, count: 0 });
    }
    for (const log of heatmapLogs) {
      const logDate = new Date(log.timestamp);
      const diffMs = now.getTime() - logDate.getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays >= 0 && diffDays < 28) {
        days[27 - diffDays].count++;
      }
    }
    return days;
  }, [heatmapLogs]);

  // -- Aggregate stats ------------------------------------------------------
  const totalLessons = getTotalLessonCount();
  const completedLessons = moduleData.reduce((sum, m) => sum + m.completedCount, 0);
  const totalCards = Object.values(cardStateCounts).reduce((a, b) => a + b, 0);
  const weeklyTotal = weeklyReviews.reduce((a, b) => a + b.count, 0);

  // Mastery percentage: fraction of lessons completed across all modules
  const masteryPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
            Progress
          </h1>
          <p className="mt-2 text-base text-secondary">
            Track your learning journey across all modules
          </p>
        </motion.div>

        {/* Overview Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<BookOpen className="h-4 w-4" />}
            label="Lessons"
            value={`${completedLessons}/${totalLessons}`}
            subtitle="completed"
          />
          <StatCard
            icon={<Layers className="h-4 w-4" />}
            label="Total Cards"
            value={totalCards}
            subtitle={`${cardStateCounts.review} in review`}
          />
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            label="This Week"
            value={weeklyTotal}
            subtitle="reviews"
          />
          <StatCard
            icon={<Star className="h-4 w-4" />}
            label="Mastery"
            value={`${masteryPct}%`}
            subtitle="overall"
          />
        </div>

        {/* Two-column layout for charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-8">
          <CardStateBar cardStates={cardStateCounts} />
          <WeeklyChart weeklyReviews={weeklyReviews} />
        </div>

        {/* Activity Heatmap */}
        <div className="mb-8">
          <ActivityHeatmap heatmapData={heatmapData} />
        </div>

        {/* Per-Module Progress */}
        <div className="rounded-xl border border-border bg-elevated p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-primary mb-5">
            <Target className="h-4 w-4 text-accent" />
            Module Progress
          </h2>
          <div className="flex flex-col gap-4">
            {moduleData.map((mod, i) => (
              <ModuleProgress key={mod.id} module={mod} index={i} />
            ))}
          </div>
        </div>
      </div>
      </PageTransition>
    </div>
  );
}
