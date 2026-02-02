'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { ReviewCard, type Rating } from '@/components/review/ReviewCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { duration, easingArray } from '@/lib/design-tokens';
import type {
  Lesson,
  ReviewCard as ReviewCardData,
} from '@/lib/db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A section of lesson content with optional inline review cards. */
export interface LessonSection {
  /** Unique section identifier. */
  id: string;
  /** Section title (optional -- for display in progress). */
  title?: string;
  /** The rendered content for this section (HTML string or plain text). */
  content: string;
  /** Review cards to display after this section's content. */
  reviewCards?: ReviewCardData[];
}

export interface LessonContentProps {
  /** Lesson metadata. */
  lesson: Lesson;
  /** Ordered sections that compose the lesson. */
  sections: LessonSection[];
  /** Pre-computed review intervals for inline cards. */
  cardIntervals?: Record<string, Record<1 | 2 | 3 | 4, string>>;
  /** Sections the user has already read (from persisted progress). */
  completedSections?: string[];
  /** Called when the user finishes reading a section. */
  onSectionComplete?: (sectionId: string) => void;
  /** Called when a review card is rated inline. */
  onRate?: (cardId: string, rating: Rating) => void;
  /** Called when all sections are read and user clicks Continue. */
  onLessonComplete?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LessonContent({
  lesson,
  sections,
  cardIntervals,
  completedSections = [],
  onSectionComplete,
  onRate,
  onLessonComplete,
  className = '',
}: LessonContentProps) {
  // Track which section the user is currently viewing
  const initialSection = useMemo(() => {
    // Start at the first un-read section, or 0
    const idx = sections.findIndex((s) => !completedSections.includes(s.id));
    return idx >= 0 ? idx : 0;
  }, [sections, completedSections]);

  const [activeSectionIndex, setActiveSectionIndex] = useState(initialSection);
  const [readSections, setReadSections] = useState<Set<string>>(
    new Set(completedSections),
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeSection = sections[activeSectionIndex];
  const isLastSection = activeSectionIndex === sections.length - 1;
  const allRead = sections.every((s) => readSections.has(s.id));

  const progress = useMemo(() => {
    if (sections.length === 0) return 0;
    return (readSections.size / sections.length) * 100;
  }, [readSections, sections]);

  // Mark the current section as read when user scrolls to the bottom or clicks Continue
  const markCurrentRead = useCallback(() => {
    if (!activeSection) return;
    setReadSections((prev) => {
      const next = new Set(prev);
      next.add(activeSection.id);
      return next;
    });
    onSectionComplete?.(activeSection.id);
  }, [activeSection, onSectionComplete]);

  const handleContinue = useCallback(() => {
    markCurrentRead();

    if (isLastSection) {
      onLessonComplete?.();
    } else {
      setActiveSectionIndex((i) => i + 1);
      // Scroll to top of new section
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [markCurrentRead, isLastSection, onLessonComplete]);

  // Auto-scroll to top on section change
  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeSectionIndex]);

  return (
    <div className={['container-reading', className].join(' ')}>
      {/* Lesson header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2 text-overline">
          <BookOpen size={14} aria-hidden="true" />
          <span>Lesson {lesson.order}</span>
        </div>
        <h1 className="text-[var(--text-3xl)] font-semibold text-[var(--color-text-primary)] leading-tight tracking-[-0.015em]">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="mt-2 text-[var(--text-base)] text-[var(--color-text-secondary)]">
            {lesson.description}
          </p>
        )}
      </header>

      {/* Section progress */}
      <ProgressBar
        value={progress}
        color="accent"
        size="sm"
        label={`Section ${activeSectionIndex + 1} of ${sections.length}`}
        showValue
        className="mb-8"
      />

      {/* Active section */}
      <div ref={sectionRef}>
        <AnimatePresence mode="wait">
          <motion.article
            key={activeSection?.id ?? 'empty'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: duration.normal / 1000,
              ease: easingArray.out,
            }}
          >
            {/* Section title */}
            {activeSection?.title && (
              <h2 className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-primary)] leading-snug mb-4">
                {activeSection.title}
              </h2>
            )}

            {/* Section content (rendered as HTML for MDX support) */}
            <div
              className="prose-reading"
              dangerouslySetInnerHTML={{
                __html: activeSection?.content ?? '',
              }}
            />

            {/* Inline review cards */}
            {activeSection?.reviewCards?.map((card) => (
              <ReviewCard
                key={card.id}
                card={card}
                inline
                intervals={cardIntervals?.[card.id]}
                onRate={(rating) => onRate?.(card.id, rating)}
              />
            ))}
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Continue button */}
      <div className="mt-8 mb-12 flex justify-end">
        <Button
          variant="primary"
          icon={<ArrowRight size={16} />}
          onClick={handleContinue}
        >
          {isLastSection
            ? allRead
              ? 'Complete Lesson'
              : 'Finish Reading'
            : 'Continue'}
        </Button>
      </div>

      {/* Section dots navigation */}
      {sections.length > 1 && (
        <nav
          className="flex items-center justify-center gap-2 pb-8"
          aria-label="Section navigation"
        >
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                markCurrentRead();
                setActiveSectionIndex(i);
              }}
              className={[
                'w-2 h-2 rounded-full transition-colors cursor-pointer',
                i === activeSectionIndex
                  ? 'bg-[var(--color-accent)]'
                  : readSections.has(s.id)
                    ? 'bg-[var(--color-text-tertiary)]'
                    : 'bg-[var(--color-border-secondary)]',
              ].join(' ')}
              aria-label={`Go to section ${i + 1}${s.title ? ': ' + s.title : ''}`}
              aria-current={i === activeSectionIndex ? 'step' : undefined}
            />
          ))}
        </nav>
      )}
    </div>
  );
}

export default LessonContent;
