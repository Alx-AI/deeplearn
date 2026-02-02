'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Lock,
  Circle,
  PlayCircle,
  CheckCircle2,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { duration, easingArray } from '@/lib/design-tokens';
import type { Module, Lesson, UserLessonProgress } from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LessonStatus = UserLessonProgress['status'];

export interface SidebarModule extends Module {
  lessons: (Lesson & { status: LessonStatus })[];
}

export interface SidebarProps {
  modules: SidebarModule[];
  currentLessonId?: string;
  onSelectLesson?: (lessonId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status icons
// ---------------------------------------------------------------------------

const statusIcons: Record<LessonStatus, React.ReactNode> = {
  locked: <Lock size={14} className="text-[var(--color-text-disabled)]" />,
  available: <Circle size={14} className="text-[var(--color-text-tertiary)]" />,
  'in-progress': <PlayCircle size={14} className="text-[var(--color-accent)]" />,
  completed: <CheckCircle2 size={14} className="text-[var(--color-success)]" />,
  mastered: <Star size={14} className="text-[var(--color-mastery-mastered-fill)]" />,
};

const statusLabels: Record<LessonStatus, string> = {
  locked: 'Locked',
  available: 'Available',
  'in-progress': 'In progress',
  completed: 'Completed',
  mastered: 'Mastered',
};

// ---------------------------------------------------------------------------
// Submenu animation
// ---------------------------------------------------------------------------

const submenuVariants = {
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

export function Sidebar({
  modules,
  currentLessonId,
  onSelectLesson,
  className = '',
}: SidebarProps) {
  // Track which modules are expanded -- default: the module containing the current lesson
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentLessonId) {
      const mod = modules.find((m) =>
        m.lessons.some((l) => l.id === currentLessonId),
      );
      if (mod) initial.add(mod.id);
    }
    return initial;
  });

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleModule = useCallback((moduleId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  const handleSelectLesson = useCallback(
    (lessonId: string, status: LessonStatus) => {
      if (status === 'locked') return;
      onSelectLesson?.(lessonId);
      setMobileOpen(false);
    },
    [onSelectLesson],
  );

  // -------------------------------------------------------------------------
  // Sidebar content (shared between desktop and mobile)
  // -------------------------------------------------------------------------

  const sidebarContent = (
    <nav
      className="h-full flex flex-col"
      aria-label="Course navigation"
    >
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {modules.map((mod) => {
          const isExpanded = expanded.has(mod.id);

          return (
            <div key={mod.id} className="mb-1">
              {/* Module toggle */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={[
                  'w-full flex items-center gap-2 px-3 py-2',
                  'rounded-[var(--radius-md)]',
                  'text-left text-[var(--text-sm)] font-medium',
                  'text-[var(--color-text-primary)]',
                  'hover:bg-[var(--color-bg-tertiary)]',
                  'transition-colors cursor-pointer',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
                ].join(' ')}
                aria-expanded={isExpanded}
              >
                <span className="shrink-0" aria-hidden="true">
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </span>
                <span className="truncate">{mod.title}</span>
              </button>

              {/* Lessons list */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    variants={submenuVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="overflow-hidden"
                  >
                    <ul className="ml-3 pl-3 border-l border-[var(--color-border-secondary)]">
                      {mod.lessons.map((lesson) => {
                        const isCurrent = lesson.id === currentLessonId;
                        const isLocked = lesson.status === 'locked';

                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() =>
                                handleSelectLesson(lesson.id, lesson.status)
                              }
                              disabled={isLocked}
                              className={[
                                'w-full flex items-center gap-2 px-3 py-1.5',
                                'rounded-[var(--radius-sm)]',
                                'text-left text-[var(--text-sm)]',
                                'transition-colors cursor-pointer',
                                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
                                isCurrent
                                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium'
                                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]',
                                isLocked && 'opacity-50 cursor-not-allowed',
                              ]
                                .filter(Boolean)
                                .join(' ')}
                              aria-current={isCurrent ? 'page' : undefined}
                              aria-label={`${lesson.title} - ${statusLabels[lesson.status]}`}
                            >
                              <span className="shrink-0" aria-hidden="true">
                                {statusIcons[lesson.status]}
                              </span>
                              <span className="truncate">{lesson.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={[
          'hidden lg:block',
          'w-64 shrink-0',
          'bg-[var(--color-bg-secondary)]',
          'border-r border-[var(--color-border-secondary)]',
          'h-screen sticky top-0',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {sidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className={[
          'lg:hidden fixed bottom-4 left-4 z-[var(--z-sticky)]',
          'w-12 h-12 rounded-full',
          'bg-[var(--color-accent)] text-[var(--color-text-inverse)]',
          'flex items-center justify-center',
          'shadow-lg cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]',
        ].join(' ')}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast / 1000 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-[var(--z-overlay)] bg-[var(--color-text-primary)]/40"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                duration: duration.normal / 1000,
                ease: easingArray.out,
              }}
              className={[
                'lg:hidden fixed inset-y-0 left-0 z-[var(--z-modal)]',
                'w-72',
                'bg-[var(--color-bg-secondary)]',
                'border-r border-[var(--color-border-secondary)]',
                'shadow-lg',
              ].join(' ')}
            >
              {/* Close button */}
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
