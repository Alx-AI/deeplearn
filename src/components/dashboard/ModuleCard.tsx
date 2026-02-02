'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Lock,
  Circle,
  PlayCircle,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { duration, easingArray } from '@/lib/design-tokens';
import type { MasteryLevel } from '@/lib/srs/mastery';
import type { Module, Lesson, UserLessonProgress } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LessonStatus = UserLessonProgress['status'];

export interface ModuleCardLesson extends Lesson {
  status: LessonStatus;
}

export interface ModuleCardProps {
  module: Module;
  lessons: ModuleCardLesson[];
  masteryLevel: MasteryLevel;
  /** 0-100 completion percentage. */
  progress: number;
  /** Whether the card starts expanded. */
  defaultExpanded?: boolean;
  onSelectLesson?: (lessonId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status display
// ---------------------------------------------------------------------------

const statusIcons: Record<LessonStatus, React.ReactNode> = {
  locked: <Lock size={14} className="text-[var(--color-text-disabled)]" />,
  available: <Circle size={14} className="text-[var(--color-text-tertiary)]" />,
  'in-progress': <PlayCircle size={14} className="text-[var(--color-accent)]" />,
  completed: <CheckCircle2 size={14} className="text-[var(--color-success)]" />,
  mastered: <Star size={14} className="text-[var(--color-mastery-mastered-fill)]" />,
};

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const expandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: duration.fast / 1000, ease: easingArray.default },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: duration.normal / 1000, ease: easingArray.out },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ModuleCard({
  module: mod,
  lessons,
  masteryLevel,
  progress,
  defaultExpanded = false,
  onSelectLesson,
  className = '',
}: ModuleCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  return (
    <Card padding="none" className={className}>
      {/* Header (clickable to expand) */}
      <button
        onClick={toggle}
        className={[
          'w-full flex items-start gap-4 p-5 text-left',
          'cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-border-focus)]',
          'rounded-[var(--radius-lg)]',
        ].join(' ')}
        aria-expanded={expanded}
      >
        {/* Expand icon */}
        <span className="shrink-0 mt-1 text-[var(--color-text-tertiary)]" aria-hidden="true">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)] truncate">
              {mod.title}
            </h3>
            <Badge level={masteryLevel} />
          </div>

          {/* Description */}
          <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mb-3 line-clamp-2">
            {mod.description}
          </p>

          {/* Progress + lesson count */}
          <div className="flex items-center gap-3">
            <ProgressBar
              value={progress}
              color="mastery"
              masteryLevel={masteryLevel}
              size="sm"
              className="flex-1"
            />
            <span className="shrink-0 flex items-center gap-1 text-[var(--text-xs)] text-[var(--color-text-tertiary)]">
              <BookOpen size={12} aria-hidden="true" />
              {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded lesson list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            variants={expandVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border-secondary)]">
              <ul className="divide-y divide-[var(--color-border-secondary)]">
                {lessons.map((lesson) => {
                  const isLocked = lesson.status === 'locked';

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() =>
                          !isLocked && onSelectLesson?.(lesson.id)
                        }
                        disabled={isLocked}
                        className={[
                          'w-full flex items-center gap-3 px-5 py-3',
                          'text-left text-[var(--text-sm)]',
                          'transition-colors cursor-pointer',
                          'hover:bg-[var(--color-bg-secondary)]',
                          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-border-focus)]',
                          isLocked && 'opacity-50 cursor-not-allowed',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span className="shrink-0" aria-hidden="true">
                          {statusIcons[lesson.status]}
                        </span>
                        <span className="truncate text-[var(--color-text-primary)]">
                          {lesson.title}
                        </span>
                        <span className="ml-auto text-[var(--text-xs)] text-[var(--color-text-tertiary)] tabular-nums shrink-0">
                          {lesson.estimatedMinutes}m
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default ModuleCard;
