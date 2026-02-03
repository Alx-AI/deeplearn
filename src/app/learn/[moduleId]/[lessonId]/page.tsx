'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Clock,
  Target,
  Eye,
  Check,
  X,
  ArrowRight,
  Hash,
  List,
  AlertCircle,
} from 'lucide-react';

import { NavHeader } from '@/components/navigation/NavHeader';
import { useLesson } from '@/lib/hooks/useLesson';
import { useUserProgress } from '@/lib/db/hooks';
import { useBookId } from '@/components/providers/BookProvider';
import { PageTransition } from '@/components/ui/PageTransition';
import type { IllustrationMap } from '@/content/books/deep-learning-python/illustration-map';
import {
  getModule,
  getNextLesson,
  getPreviousLesson,
  getCardsForLesson,
  getQuizForLesson,
} from '@/content';
import type { LessonSection } from '@/content';
import { SectionCodeExamples } from '@/components/ui/CodeBlock';
import type { ReviewCard, QuizQuestion } from '@/lib/db/schema';
import { srsEngine } from '@/lib/srs/engine';
import type { Grade } from '@/lib/srs/engine';
import { getOrCreateCardState, updateCardAfterReview } from '@/lib/db/api-client';

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container-wide py-6 sm:py-10">
        <div className="flex gap-12">
          <div className="min-w-0 flex-1 animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-4 w-12 rounded bg-surface-tertiary" />
              <div className="h-4 w-4 rounded bg-surface-tertiary" />
              <div className="h-4 w-24 rounded bg-surface-tertiary" />
              <div className="h-4 w-4 rounded bg-surface-tertiary" />
              <div className="h-4 w-8 rounded bg-surface-tertiary" />
            </div>
            {/* Title skeleton */}
            <div className="mb-10">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-4 w-20 rounded bg-surface-tertiary" />
                <div className="h-4 w-16 rounded bg-surface-tertiary" />
              </div>
              <div className="h-10 w-3/4 rounded bg-surface-tertiary" />
              {/* Objectives skeleton */}
              <div className="mt-6 rounded-xl border border-border bg-surface/50 p-5">
                <div className="mb-3 h-5 w-40 rounded bg-surface-tertiary" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-surface-tertiary" />
                  <div className="h-4 w-5/6 rounded bg-surface-tertiary" />
                  <div className="h-4 w-4/6 rounded bg-surface-tertiary" />
                </div>
              </div>
            </div>
            {/* Content skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-12">
                <div className="mb-6 h-8 w-1/3 rounded bg-surface-tertiary" />
                <div className="space-y-4">
                  <div className="h-4 w-full rounded bg-surface-tertiary" />
                  <div className="h-4 w-full rounded bg-surface-tertiary" />
                  <div className="h-4 w-5/6 rounded bg-surface-tertiary" />
                  <div className="h-4 w-full rounded bg-surface-tertiary" />
                  <div className="h-4 w-3/4 rounded bg-surface-tertiary" />
                </div>
              </div>
            ))}
          </div>
          <div className="w-52 shrink-0 hidden xl:block">
            <div className="sticky top-24 animate-pulse">
              <div className="mb-3 h-4 w-16 rounded bg-surface-tertiary" />
              <div className="space-y-2">
                <div className="h-6 w-full rounded bg-surface-tertiary" />
                <div className="h-6 w-full rounded bg-surface-tertiary" />
                <div className="h-6 w-full rounded bg-surface-tertiary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function ErrorState({ message, lessonId }: { message: string; lessonId: string }) {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container-content py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-subtle">
            <AlertCircle className="h-10 w-10 text-error" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Lesson Not Found</h1>
          <p className="mt-3 text-lg text-secondary">{message}</p>
          <p className="mt-2 text-sm text-tertiary font-mono">{lessonId}</p>
          <div className="mt-8">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-inverse no-underline transition-colors hover:bg-accent-hover"
            >
              Back to Lessons
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline Review Card Component
// ---------------------------------------------------------------------------

function InlineCard({ card }: { card: ReviewCard }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  // Simplified two-button rating: "Study Again" (1) or "Got It" (3)
  const handleRate = useCallback(
    async (grade: 1 | 3) => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        const cardState = await getOrCreateCardState(card.id);
        const result = srsEngine.reviewCard(cardState.fsrsCard, grade as Grade);
        await updateCardAfterReview(card.id, result.card, {
          cardId: card.id,
          lessonId: card.lessonId,
          rating: grade,
          timestamp: new Date(),
          scheduledDays: result.card.scheduled_days,
          elapsedDays: result.card.elapsed_days,
          state: result.card.state,
          duration: 0,
          context: 'inline',
        });
        setIsDone(true);
      } catch (err) {
        console.error('Failed to record review:', err);
        setIsDone(true);
      } finally {
        setIsProcessing(false);
      }
    },
    [card.id, card.lessonId, isProcessing],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="my-8 mx-auto max-w-[65ch]"
    >
      <div className="rounded-xl border border-accent/15 bg-[color-mix(in_srgb,var(--color-accent-subtle)_50%,var(--color-bg-elevated)_50%)] overflow-hidden shadow-sm">
        {/* Card Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-accent/10 bg-accent-subtle/30">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-accent/10">
            <Target className="h-3 w-3 text-accent" />
          </div>
          <span className="text-xs font-medium text-accent uppercase tracking-wider">
            Review Card
          </span>
        </div>

        {/* Prompt */}
        <div className="px-5 py-4">
          <p className="text-[15px] font-semibold text-primary leading-relaxed">
            {card.prompt}
          </p>
        </div>

        {/* Answer (hidden or revealed) */}
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="hidden"
              exit={{ opacity: 0 }}
              className="px-5 pb-4"
            >
              <button
                onClick={handleReveal}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-inverse hover:border-accent cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                Reveal Answer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0.38, 0.9] }}
              className="border-t border-accent/10"
            >
              <div className="px-5 py-4 bg-background/40">
                <p className="text-[15px] text-secondary leading-relaxed font-reading">
                  {card.answer}
                </p>
              </div>

              {/* Simplified two-button rating */}
              {!isDone ? (
                <div className="flex gap-2 px-5 pb-4">
                  <button
                    onClick={() => handleRate(1)}
                    disabled={isProcessing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-accent/30 bg-background px-4 py-3 text-sm font-medium text-secondary transition-all hover:border-error/40 hover:bg-error-subtle hover:text-error disabled:opacity-50 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Study Again
                  </button>
                  <button
                    onClick={() => handleRate(3)}
                    disabled={isProcessing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-accent/30 bg-accent px-4 py-3 text-sm font-medium text-inverse transition-all hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Got It
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.2, 0, 0.38, 0.9] }}
                  className="flex items-center gap-2 px-5 pb-4 text-sm text-success"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                  <span>Recorded. Keep reading!</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// (RatingButton removed -- replaced by simplified two-button inline cards)

// ---------------------------------------------------------------------------
// Illustration renderer — dynamically loads per-book illustration map
// ---------------------------------------------------------------------------

const illustrationMapImporters: Record<string, () => Promise<{ default: IllustrationMap }>> = {
  'deep-learning-python': () => import('@/content/books/deep-learning-python/illustration-map'),
  'marl': () => import('@/content/books/marl/illustration-map'),
};

function useIllustrationMap(bookId: string): IllustrationMap {
  const [map, setMap] = useState<IllustrationMap>({});

  useEffect(() => {
    const importer = illustrationMapImporters[bookId];
    if (!importer) return;
    let cancelled = false;
    importer().then((mod) => {
      if (!cancelled) setMap(mod.default);
    });
    return () => { cancelled = true; };
  }, [bookId]);

  return map;
}

function SectionIllustrations({ ids, illustrationMap }: { ids?: string[]; illustrationMap: IllustrationMap }) {
  if (!ids || ids.length === 0) return null;
  return (
    <div className="my-8 space-y-6">
      {ids.map((id) => {
        const Component = illustrationMap[id];
        if (!Component) return null;
        return <Component key={id} className="mx-auto max-w-[65ch]" />;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quiz Component (uses the shared QuizSession with round-based re-attempts)
// ---------------------------------------------------------------------------

import { QuizSession } from '@/components/quiz/QuizSession';

// ---------------------------------------------------------------------------
// Sidebar Outline
// ---------------------------------------------------------------------------

function LessonOutline({
  sections,
  activeSection,
  onSectionClick,
}: {
  sections: { id: string; title: string }[];
  activeSection: string;
  onSectionClick: (id: string) => void;
}) {
  return (
    <div>
      <div className="sticky top-24">
        <div className="flex items-center gap-2 mb-3">
          <List className="h-4 w-4 text-tertiary" />
          <span className="text-xs font-medium text-tertiary uppercase tracking-wider">
            Outline
          </span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`block text-left rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                activeSection === section.id
                  ? 'bg-accent-subtle text-accent font-medium'
                  : 'text-secondary hover:text-primary hover:bg-surface'
              }`}
            >
              {section.title}
            </button>
          ))}
          <button
            onClick={() => onSectionClick('quiz')}
            className={`block text-left rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer ${
              activeSection === 'quiz'
                ? 'bg-accent-subtle text-accent font-medium'
                : 'text-secondary hover:text-primary hover:bg-surface'
            }`}
          >
            Quiz
          </button>
        </nav>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lesson Page
// ---------------------------------------------------------------------------

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const moduleId = params.moduleId as string;
  const bookId = useBookId();

  // Build link prefix based on whether we're in a book route
  const linkPrefix = bookId !== 'deep-learning-python' ? `/books/${bookId}` : '';

  // Load per-book illustration map
  const illustrationMap = useIllustrationMap(bookId);

  // Load real lesson data
  const { lesson, content, reviewCards, quizQuestions, isLoading, error } =
    useLesson(lessonId, bookId);

  // User progress tracking
  const {
    markStarted,
    markCompleted,
    markSectionRead: persistSectionRead,
    recordQuizAttempt,
  } = useUserProgress(lessonId);

  // Real module and navigation
  const mod = useMemo(() => getModule(moduleId, bookId), [moduleId, bookId]);
  const nextLesson = useMemo(() => getNextLesson(lessonId, bookId), [lessonId, bookId]);
  const prevLesson = useMemo(() => getPreviousLesson(lessonId, bookId), [lessonId, bookId]);

  // Local UI state
  const [activeSection, setActiveSection] = useState<string>('');
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const previousSectionRef = useRef<string>('');

  const { scrollYProgress } = useScroll();

  // Mark lesson started when it loads
  useEffect(() => {
    if (lesson && !isLoading) {
      markStarted();
    }
  }, [lesson, isLoading, markStarted]);

  // Build sections for display from content data
  const sections = useMemo(() => {
    if (content?.sections) {
      return content.sections;
    }
    return [];
  }, [content]);

  // Build review cards map: sectionId -> ReviewCard[]
  const reviewCardsBySectionId = useMemo(() => {
    const map: Record<string, ReviewCard[]> = {};
    if (content?.sections) {
      for (const section of content.sections) {
        if (section.reviewCardIds && section.reviewCardIds.length > 0) {
          const cards = section.reviewCardIds
            .map((id) => reviewCards.find((c) => c.id === id))
            .filter((c): c is ReviewCard => c !== undefined);
          if (cards.length > 0) {
            map[section.id] = cards;
          }
        }
      }
    }
    return map;
  }, [content, reviewCards]);

  // Quiz questions are used directly by QuizSession (no conversion needed)

  // Set initial active section once content loads
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  // Total sections for progress
  const totalSections = sections.length + (quizQuestions.length > 0 ? 1 : 0);
  const progress = totalSections > 0 ? (readSections.size / totalSections) * 100 : 0;

  const handleSectionClick = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const markRead = useCallback(
    (sectionId: string) => {
      setReadSections((prev) => {
        if (prev.has(sectionId)) return prev;
        const next = new Set(prev).add(sectionId);
        return next;
      });
      // Persist to IndexedDB
      persistSectionRead(sectionId);
    },
    [persistSectionRead],
  );

  // When a section enters the viewport, mark the PREVIOUS section as read
  // (the user has scrolled past it) and set the new section as active.
  const handleSectionEnter = useCallback(
    (sectionId: string) => {
      const prev = previousSectionRef.current;
      if (prev && prev !== sectionId) {
        markRead(prev);
      }
      setActiveSection(sectionId);
      previousSectionRef.current = sectionId;
    },
    [markRead],
  );

  const [lessonCompleted, setLessonCompleted] = useState(false);

  const handleQuizComplete = useCallback(
    (score: number) => {
      recordQuizAttempt(score);
      // Mark quiz section as read so the completion effect can detect it
      if (score >= 60) {
        markRead('quiz');
      }
    },
    [recordQuizAttempt, markRead],
  );

  // Auto-complete lesson when all content sections have been read AND quiz is done
  useEffect(() => {
    if (lessonCompleted) return; // already completed
    if (sections.length === 0) return; // no content loaded yet
    const allContentRead = sections.every((s) => readSections.has(s.id));
    // If there are quiz questions, require quiz completion; otherwise just sections
    const quizDone = quizQuestions.length === 0 || readSections.has('quiz');
    if (allContentRead && quizDone) {
      markCompleted();
      setLessonCompleted(true);
    }
  }, [readSections, sections, quizQuestions.length, lessonCompleted, markCompleted]);

  const handleQuizExit = useCallback(() => {
    // Scroll to the Next Lesson CTA
    const nextCta = document.getElementById('next-lesson-cta');
    if (nextCta) {
      nextCta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // ---------------------------------------------------------------------------
  // Error state (lesson ID not found at all)
  // ---------------------------------------------------------------------------
  if (error && !lesson) {
    return <ErrorState message={error} lessonId={lessonId} />;
  }

  // ---------------------------------------------------------------------------
  // Lesson metadata exists but content not yet authored
  // ---------------------------------------------------------------------------
  const moduleTitle = mod?.title ?? 'Module';
  const lessonTitle = lesson?.title ?? 'Lesson';
  const lessonNumber = lessonId;
  const estimatedMinutes = lesson?.estimatedMinutes ?? 15;
  const learningObjectives = lesson?.learningObjectives ?? [];

  const hasContent = sections.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-14 left-0 right-0 z-10 h-0.5 origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />

      <PageTransition>
      <div className="container-wide py-6 sm:py-10">
        <div className="flex gap-12">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-secondary">
              <Link href={`${linkPrefix}/learn`} className="no-underline text-secondary hover:text-primary transition-colors">
                Learn
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-tertiary" />
              <Link href={`${linkPrefix}/learn?module=${moduleId}`} className="no-underline text-secondary hover:text-primary transition-colors">
                {moduleTitle}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-tertiary" />
              <span className="text-primary font-medium">
                {lessonNumber}
              </span>
            </nav>

            {/* Lesson Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-overline">
                  Lesson {lessonNumber}
                </span>
                <span className="flex items-center gap-1 text-xs text-tertiary">
                  <Clock className="h-3.5 w-3.5" />
                  {estimatedMinutes} min
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {lessonTitle}
              </h1>

              {/* Learning Objectives */}
              {learningObjectives.length > 0 && (
                <div className="mt-6 rounded-xl border border-border bg-surface/50 p-5">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
                    <Target className="h-4 w-4 text-accent" />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2">
                    {learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-xs font-medium text-accent">
                          {i + 1}
                        </span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Content Sections with Inline Review Cards */}
            {hasContent ? (
              <>
                {sections.map((section) => (
                  <div key={section.id}>
                    {/* Reading Section */}
                    <motion.section
                      id={section.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      onViewportEnter={() => handleSectionEnter(section.id)}
                      className="mb-8"
                    >
                      <h2 className="font-sans text-2xl font-semibold text-primary mb-5 mt-12 first:mt-0">
                        {section.title}
                      </h2>
                      <div className="prose-reading">
                        {parseContentBlocks(section.content).map((block, i) =>
                          block.type === 'code' ? (
                            <div
                              key={i}
                              className="my-5 rounded-xl border border-border overflow-hidden"
                              style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                            >
                              <div
                                className="flex items-center px-4 py-2 border-b border-border"
                                style={{ backgroundColor: 'var(--color-bg-secondary)' }}
                              >
                                <span
                                  className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                                  style={{
                                    backgroundColor: 'var(--color-accent-subtle)',
                                    color: 'var(--color-accent)',
                                  }}
                                >
                                  {formatLanguageLabel(block.language)}
                                </span>
                              </div>
                              <pre
                                className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed"
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  color: 'var(--color-text-primary)',
                                  margin: 0,
                                  backgroundColor: 'transparent',
                                }}
                              >
                                <code>{block.content}</code>
                              </pre>
                            </div>
                          ) : isListBlock(block.content) ? (
                            <div key={i} dangerouslySetInnerHTML={{ __html: formatParagraph(block.content) }} />
                          ) : (
                            <p key={i} dangerouslySetInnerHTML={{ __html: formatParagraph(block.content) }} />
                          ),
                        )}
                      </div>
                    </motion.section>

                    {/* Illustrations for this section */}
                    <SectionIllustrations ids={section.illustrations} illustrationMap={illustrationMap} />

                    {/* Code examples for this section */}
                    {section.codeExamples && section.codeExamples.length > 0 && (
                      <div className="my-8 space-y-6 [&>div]:my-0 [&>div]:space-y-6">
                        <SectionCodeExamples examples={section.codeExamples} />
                      </div>
                    )}

                    {/* Inline Review Cards (placed after this section) */}
                    {(reviewCardsBySectionId[section.id] ?? []).map((card) => (
                      <InlineCard key={card.id} card={card} />
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary">Content Coming Soon</h3>
                <p className="mt-2 text-sm text-secondary">
                  This lesson&apos;s content is being prepared. Check back soon!
                </p>
                {lesson?.keyConcepts && lesson.keyConcepts.length > 0 && (
                  <div className="mt-6 text-left max-w-lg mx-auto">
                    <h4 className="text-sm font-semibold text-primary mb-2">Key Concepts Preview</h4>
                    <ul className="space-y-1">
                      {lesson.keyConcepts.map((concept, i) => (
                        <li key={i} className="text-sm text-secondary flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Section */}
            {quizQuestions.length > 0 && (
              <motion.section
                id="quiz"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onViewportEnter={() => {
                  // Mark the last content section as read when quiz enters view
                  const prev = previousSectionRef.current;
                  if (prev && prev !== 'quiz') {
                    markRead(prev);
                  }
                  setActiveSection('quiz');
                  previousSectionRef.current = 'quiz';
                }}
                className="mt-16 mb-12"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Hash className="h-4 w-4 text-accent" />
                  </div>
                  <h2 className="text-2xl font-semibold text-primary">
                    Check Your Understanding
                  </h2>
                </div>
                <QuizSession
                  questions={quizQuestions}
                  onComplete={(score) => handleQuizComplete(score)}
                  onExit={handleQuizExit}
                />
              </motion.section>
            )}

            {/* Next Lesson CTA */}
            <motion.div
              id="next-lesson-cta"
              className="mt-12 mb-12 flex items-center justify-between rounded-xl border border-border bg-elevated p-5"
              viewport={{ once: true }}
              onViewportEnter={() => {
                // Mark the last viewed section as read when user reaches the bottom
                const prev = previousSectionRef.current;
                if (prev) {
                  markRead(prev);
                }
              }}
            >
              <div>
                {nextLesson ? (
                  <>
                    <p className="text-sm text-tertiary">Next Lesson</p>
                    <p className="text-base font-semibold text-primary">
                      {nextLesson.title}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-tertiary">Congratulations!</p>
                    <p className="text-base font-semibold text-primary">
                      You&apos;ve reached the end of the curriculum
                    </p>
                  </>
                )}
              </div>
              {nextLesson ? (
                <Link
                  href={`${linkPrefix}/learn/${getModule(nextLesson.moduleId, bookId)?.id ?? moduleId}/${nextLesson.id}`}
                  className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-inverse no-underline transition-colors hover:bg-accent-hover"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href={`${linkPrefix}/review`}
                  className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-inverse no-underline transition-colors hover:bg-accent-hover"
                >
                  Review Cards
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>

            {/* Previous Lesson Link */}
            {prevLesson && (
              <div className="mb-8">
                <Link
                  href={`${linkPrefix}/learn/${getModule(prevLesson.moduleId, bookId)?.id ?? moduleId}/${prevLesson.id}`}
                  className="inline-flex items-center gap-2 text-sm text-secondary no-underline hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous: {prevLesson.title}
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar Outline */}
          <div className="hidden xl:block w-52 shrink-0">
            <LessonOutline
              sections={sections.map((s) => ({ id: s.id, title: s.title }))}
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>
      </div>
      </PageTransition>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content parsing helpers
// ---------------------------------------------------------------------------

interface ContentBlock {
  type: 'paragraph' | 'code';
  content: string;
  language?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python',
  py: 'Python',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  bash: 'Bash',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  sql: 'SQL',
  text: 'Text',
  plaintext: 'Text',
};

function formatLanguageLabel(lang?: string): string {
  if (!lang) return 'Text';
  return LANGUAGE_LABELS[lang.toLowerCase()] ?? lang;
}

/**
 * Parse section content into blocks, properly handling fenced code blocks.
 * Code blocks (```lang ... ```) are extracted as separate blocks so they
 * don't get broken by paragraph splitting.
 */
function parseContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const codeBlockRegex = /```(\w*)\s*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add any text before this code block as paragraph blocks
    const before = content.slice(lastIndex, match.index);
    if (before.trim()) {
      for (const para of before.split('\n\n')) {
        if (para.trim()) {
          blocks.push({ type: 'paragraph', content: para.trim() });
        }
      }
    }

    // Add the code block
    blocks.push({
      type: 'code',
      content: match[2].replace(/\n$/, ''),
      language: match[1] || 'text',
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last code block
  const remaining = content.slice(lastIndex);
  if (remaining.trim()) {
    for (const para of remaining.split('\n\n')) {
      if (para.trim()) {
        blocks.push({ type: 'paragraph', content: para.trim() });
      }
    }
  }

  return blocks;
}

function isListBlock(text: string): boolean {
  const lines = text.split('\n');
  const isUl = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '') &&
    lines.some((l) => l.trim().startsWith('- '));
  const isOl = lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === '') &&
    lines.some((l) => /^\d+\.\s/.test(l.trim()));
  return isUl || isOl;
}

function formatParagraph(text: string): string {
  // Check if it's a list (starts with "- " or "1. " etc.)
  const lines = text.split('\n');
  const isUnorderedList = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '');
  const isOrderedList = lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === '');

  if (isUnorderedList && lines.some((l) => l.trim().startsWith('- '))) {
    const items = lines
      .filter((l) => l.trim().startsWith('- '))
      .map((l) => `<li>${formatInline(l.trim().slice(2))}</li>`)
      .join('');
    return `<ul class="my-3 ml-4 space-y-1.5 list-disc list-outside">${items}</ul>`;
  }

  if (isOrderedList && lines.some((l) => /^\d+\.\s/.test(l.trim()))) {
    const items = lines
      .filter((l) => /^\d+\.\s/.test(l.trim()))
      .map((l) => `<li>${formatInline(l.trim().replace(/^\d+\.\s/, ''))}</li>`)
      .join('');
    return `<ol class="my-3 ml-4 space-y-1.5 list-decimal list-outside">${items}</ol>`;
  }

  return formatInline(text);
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-surface px-1.5 py-0.5 text-sm font-mono text-accent">$1</code>');
}
