'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  Flame,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { duration, easingArray } from '@/lib/design-tokens';
import type { QuizQuestion } from '@/lib/db/schema';
import { FormattedText } from '@/components/ui/FormattedText';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QuestionResult {
  questionId: string;
  answer: string;
  correct: boolean;
  round: number;
}

export interface QuizSessionProps {
  /** The quiz questions to present. */
  questions: QuizQuestion[];
  /** Called when the entire quiz is finished (all rounds). */
  onComplete?: (score: number, results: QuestionResult[]) => void;
  /** Called when user clicks "Done" on the results screen. */
  onExit?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ---------------------------------------------------------------------------
// Question Card (self-contained single question)
// ---------------------------------------------------------------------------

function QuestionCard({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
}: {
  question: QuizQuestion;
  onAnswer: (questionId: string, answer: string, correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === question.correctAnswer;
  const isIncorrect = submitted && selected !== question.correctAnswer;

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (!selected) return;
    onAnswer(question.id, selected, selected === question.correctAnswer);
  };

  return (
    <div className="rounded-xl border border-border bg-elevated overflow-hidden shadow-sm">
      {/* Question Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/30">
        <span className="text-sm font-medium text-secondary">
          {questionNumber} of {totalQuestions}
        </span>
        <span className="text-xs text-tertiary uppercase tracking-wider font-medium">
          {question.type === 'multiple-choice'
            ? 'Choose one'
            : question.type === 'true-false'
              ? 'True or false'
              : 'Fill in'}
        </span>
      </div>

      <div className="px-5 py-5">
        {/* Question */}
        <FormattedText text={question.question} as="p" className="text-base font-medium text-primary leading-relaxed font-reading" />

        {/* Multiple-choice options */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="mt-5 flex flex-col gap-2">
            {question.options.map((option, i) => {
              let style =
                'border-border hover:border-accent/30 hover:bg-accent-subtle/30';
              if (submitted) {
                if (option === question.correctAnswer) {
                  style = 'border-success bg-success-subtle';
                } else if (option === selected) {
                  style = 'border-error bg-error-subtle';
                } else {
                  style = 'border-border opacity-40';
                }
              } else if (option === selected) {
                style = 'border-accent bg-accent-subtle';
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => !submitted && setSelected(option)}
                  disabled={submitted}
                  whileTap={!submitted ? { scale: 0.99 } : undefined}
                  transition={{ duration: 0.075 }}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all cursor-pointer disabled:cursor-default ${style}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                      submitted && option === question.correctAnswer
                        ? 'border-success bg-success text-inverse'
                        : submitted && option === selected
                          ? 'border-error bg-error text-inverse'
                          : option === selected
                            ? 'border-accent bg-accent text-inverse'
                            : 'border-border text-tertiary'
                    }`}
                  >
                    {submitted && option === question.correctAnswer ? (
                      <Check size={12} aria-hidden="true" />
                    ) : submitted && option === selected ? (
                      <X size={12} aria-hidden="true" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <FormattedText
                    text={option}
                    as="span"
                    className={submitted ? '' : 'text-primary'}
                  />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* True/false options */}
        {question.type === 'true-false' && (
          <div className="mt-5 flex gap-3">
            {['True', 'False'].map((option) => {
              let style =
                'border-border hover:border-accent/30 hover:bg-accent-subtle/30';
              if (submitted) {
                if (option === question.correctAnswer) {
                  style = 'border-success bg-success-subtle';
                } else if (option === selected) {
                  style = 'border-error bg-error-subtle';
                } else {
                  style = 'border-border opacity-40';
                }
              } else if (option === selected) {
                style = 'border-accent bg-accent-subtle';
              }

              return (
                <motion.button
                  key={option}
                  onClick={() => !submitted && setSelected(option)}
                  disabled={submitted}
                  whileTap={!submitted ? { scale: 0.98 } : undefined}
                  transition={{ duration: 0.075 }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all cursor-pointer disabled:cursor-default ${style}`}
                >
                  {submitted && option === question.correctAnswer && (
                    <Check size={14} className="text-success" aria-hidden="true" />
                  )}
                  {submitted &&
                    option === selected &&
                    option !== question.correctAnswer && (
                      <X size={14} className="text-error" aria-hidden="true" />
                    )}
                  <FormattedText text={option} as="span" className={submitted ? '' : 'text-primary'} />
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Fill-in-the-blank */}
        {question.type === 'fill-blank' && (
          <div className="mt-5">
            <input
              type="text"
              value={selected ?? ''}
              onChange={(e) => !submitted && setSelected(e.target.value)}
              disabled={submitted}
              placeholder="Type your answer..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitted && selected) handleSubmit();
              }}
              className={`w-full px-4 py-3 rounded-lg border text-sm text-primary bg-background transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-accent ${
                !submitted
                  ? 'border-border'
                  : isCorrect
                    ? 'border-success bg-success-subtle'
                    : 'border-error bg-error-subtle'
              }`}
            />
          </div>
        )}

        {/* Feedback (shown after submit) */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: duration.normal / 1000,
                ease: easingArray.out,
              }}
            >
              {/* Result badge */}
              <div
                className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 ${
                  isCorrect
                    ? 'bg-success-subtle text-success'
                    : 'bg-error-subtle text-error'
                }`}
              >
                {isCorrect ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                <span className="text-sm font-semibold">
                  {isCorrect ? 'Correct!' : 'Not quite'}
                </span>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <FormattedText text={question.explanation} as="p" className="mt-3 text-sm text-secondary leading-relaxed font-reading" />
              )}

              {/* Correct answer (when wrong) */}
              {isIncorrect && (
                <p className="mt-2 text-sm text-primary">
                  <span className="font-semibold">Answer:</span>{' '}
                  <FormattedText text={question.correctAnswer} />
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action bar */}
      <div className="flex justify-end border-t border-border px-5 py-3">
        {!submitted ? (
          <motion.button
            onClick={handleSubmit}
            disabled={!selected}
            whileTap={selected ? { scale: 0.97 } : undefined}
            transition={{ duration: 0.075 }}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-inverse transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Check
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleContinue}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-inverse transition-colors hover:bg-accent-hover cursor-pointer"
          >
            Continue
            <ArrowRight size={14} aria-hidden="true" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Round Summary (shown between rounds)
// ---------------------------------------------------------------------------

function RoundSummary({
  round,
  correctCount,
  totalCount,
  wrongCount,
  onRetry,
  onFinish,
}: {
  round: number;
  correctCount: number;
  totalCount: number;
  wrongCount: number;
  onRetry: () => void;
  onFinish: () => void;
}) {
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const isPerfect = wrongCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow / 1000, ease: easingArray.out }}
      className="max-w-md mx-auto"
    >
      <div className="rounded-xl border border-border bg-elevated p-8 text-center shadow-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: easingArray.spring }}
        >
          {isPerfect ? (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle">
              <Trophy className="h-8 w-8 text-success" aria-hidden="true" />
            </div>
          ) : (
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle">
              <Target className="h-8 w-8 text-accent" aria-hidden="true" />
            </div>
          )}
        </motion.div>

        <h3 className="text-xl font-semibold text-primary">
          {isPerfect
            ? round === 1
              ? 'Perfect Score!'
              : 'All Correct!'
            : `Round ${round} Complete`}
        </h3>

        <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
          {pct}%
        </p>
        <p className="mt-1 text-sm text-secondary">
          {correctCount} of {totalCount} correct
        </p>

        {!isPerfect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-sm text-secondary mb-4">
              {wrongCount} question{wrongCount !== 1 ? 's' : ''} to review.
              Wrong answers will be shuffled and presented again.
            </p>
            <motion.button
              onClick={onRetry}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.075 }}
              className="flex items-center gap-2 mx-auto rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-inverse transition-colors hover:bg-accent-hover cursor-pointer"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Retry Wrong Answers
            </motion.button>
            <button
              onClick={onFinish}
              className="mt-3 text-sm text-tertiary hover:text-secondary transition-colors cursor-pointer mx-auto block"
            >
              Skip and finish
            </button>
          </motion.div>
        )}

        {isPerfect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <motion.button
              onClick={onFinish}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.075 }}
              className="flex items-center gap-2 mx-auto rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-inverse transition-colors hover:bg-accent-hover cursor-pointer"
            >
              Continue
              <ArrowRight size={14} aria-hidden="true" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Final Summary
// ---------------------------------------------------------------------------

function FinalSummary({
  results,
  questions,
  totalRounds,
  onExit,
}: {
  results: QuestionResult[];
  questions: QuizQuestion[];
  totalRounds: number;
  onExit?: () => void;
}) {
  // Count first-attempt correct answers
  const firstAttemptResults = results.filter((r) => r.round === 1);
  const firstAttemptCorrect = firstAttemptResults.filter((r) => r.correct).length;
  const firstAttemptPct =
    firstAttemptResults.length > 0
      ? Math.round((firstAttemptCorrect / firstAttemptResults.length) * 100)
      : 0;

  // All questions eventually answered correctly
  const allCorrectIds = new Set(
    results.filter((r) => r.correct).map((r) => r.questionId),
  );
  const masteredAll = allCorrectIds.size === questions.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow / 1000 }}
      className="max-w-lg mx-auto"
    >
      <div className="rounded-xl border border-border bg-elevated overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: easingArray.spring }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-subtle">
              <Trophy className="h-8 w-8 text-success" aria-hidden="true" />
            </div>
          </motion.div>

          <h3 className="text-xl font-semibold text-primary">
            {masteredAll ? 'Quiz Mastered!' : 'Quiz Complete'}
          </h3>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold tabular-nums text-primary">
                {firstAttemptPct}%
              </p>
              <p className="text-xs text-tertiary mt-0.5">First try</p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-primary">
                {totalRounds}
              </p>
              <p className="text-xs text-tertiary mt-0.5">
                Round{totalRounds !== 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-primary">
                {questions.length}
              </p>
              <p className="text-xs text-tertiary mt-0.5">Questions</p>
            </div>
          </div>
        </div>

        {/* Question breakdown */}
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs font-medium text-tertiary uppercase tracking-wider mb-3">
            Results
          </p>
          <div className="space-y-2">
            {questions.map((q, i) => {
              const firstResult = results.find(
                (r) => r.questionId === q.id && r.round === 1,
              );
              const wasCorrectFirstTry = firstResult?.correct ?? false;
              const totalAttempts = results.filter(
                (r) => r.questionId === q.id,
              ).length;

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`flex items-start gap-2.5 rounded-lg px-3.5 py-3 ${
                    wasCorrectFirstTry ? 'bg-success-subtle/50' : 'bg-surface'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {wasCorrectFirstTry ? (
                      <Check size={14} className="text-success" aria-hidden="true" />
                    ) : (
                      <RotateCcw size={14} className="text-warning" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <FormattedText text={q.question} as="p" className="text-sm text-primary leading-snug line-clamp-2" />
                    {!wasCorrectFirstTry && (
                      <p className="text-xs text-tertiary mt-0.5">
                        Correct after {totalAttempts} attempt
                        {totalAttempts !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action */}
        <div className="border-t border-border px-5 py-4 flex justify-center">
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight size={14} />}
            onClick={onExit}
          >
            Continue
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main QuizSession Component
// ---------------------------------------------------------------------------

export function QuizSession({
  questions,
  onComplete,
  onExit,
  className = '',
}: QuizSessionProps) {
  // All results across all rounds
  const [allResults, setAllResults] = useState<QuestionResult[]>([]);

  // Current round state
  const [round, setRound] = useState(1);
  const [roundQuestions, setRoundQuestions] = useState<QuizQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundResults, setRoundResults] = useState<QuestionResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Phase: 'answering' | 'round-summary' | 'finished'
  const [phase, setPhase] = useState<'answering' | 'round-summary' | 'finished'>(
    'answering',
  );

  const progress =
    roundQuestions.length > 0
      ? ((currentIndex) / roundQuestions.length) * 100
      : 0;

  const handleAnswer = useCallback(
    (questionId: string, answer: string, correct: boolean) => {
      const result: QuestionResult = { questionId, answer, correct, round };

      setRoundResults((prev) => [...prev, result]);
      setAllResults((prev) => [...prev, result]);

      if (correct) {
        setStreak((s) => {
          const next = s + 1;
          setBestStreak((best) => Math.max(best, next));
          return next;
        });
      } else {
        setStreak(0);
      }

      const nextIndex = currentIndex + 1;
      if (nextIndex >= roundQuestions.length) {
        // Round is over
        const wrongInRound = [...roundResults, result].filter((r) => !r.correct);
        if (wrongInRound.length === 0) {
          // Perfect round — finish
          setPhase('finished');
          const firstAttemptResults = [...allResults, result].filter(
            (r) => r.round === 1,
          );
          const firstCorrect = firstAttemptResults.filter((r) => r.correct).length;
          const score =
            firstAttemptResults.length > 0
              ? Math.round((firstCorrect / firstAttemptResults.length) * 100)
              : 0;
          onComplete?.(score, [...allResults, result]);
        } else {
          setPhase('round-summary');
        }
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [round, currentIndex, roundQuestions, roundResults, allResults, onComplete],
  );

  const handleRetry = useCallback(() => {
    // Get wrong question IDs from current round
    const wrongIds = new Set(
      roundResults.filter((r) => !r.correct).map((r) => r.questionId),
    );
    const wrongQuestions = roundQuestions.filter((q) => wrongIds.has(q.id));

    // Shuffle the wrong questions for the next round
    setRound((r) => r + 1);
    setRoundQuestions(shuffleArray(wrongQuestions));
    setCurrentIndex(0);
    setRoundResults([]);
    setPhase('answering');
  }, [roundResults, roundQuestions]);

  const handleFinish = useCallback(() => {
    setPhase('finished');
    const firstAttemptResults = allResults.filter((r) => r.round === 1);
    const firstCorrect = firstAttemptResults.filter((r) => r.correct).length;
    const score =
      firstAttemptResults.length > 0
        ? Math.round((firstCorrect / firstAttemptResults.length) * 100)
        : 0;
    onComplete?.(score, allResults);
  }, [allResults, onComplete]);

  // ----- Phase: Round Summary -----
  if (phase === 'round-summary') {
    const correctCount = roundResults.filter((r) => r.correct).length;
    const wrongCount = roundResults.filter((r) => !r.correct).length;

    return (
      <div className={className}>
        <RoundSummary
          round={round}
          correctCount={correctCount}
          totalCount={roundResults.length}
          wrongCount={wrongCount}
          onRetry={handleRetry}
          onFinish={handleFinish}
        />
      </div>
    );
  }

  // ----- Phase: Finished -----
  if (phase === 'finished') {
    return (
      <div className={className}>
        <FinalSummary
          results={allResults}
          questions={questions}
          totalRounds={round}
          onExit={onExit}
        />
      </div>
    );
  }

  // ----- Phase: Answering -----
  const current = roundQuestions[currentIndex];
  if (!current) return null;

  return (
    <div className={['max-w-lg mx-auto', className].join(' ')}>
      {/* Round & Progress Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {round > 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent">
                <RotateCcw size={10} aria-hidden="true" />
                Round {round}
              </span>
            )}
            <span className="text-sm font-medium text-secondary">
              {currentIndex + 1} of {roundQuestions.length}
            </span>
          </div>
          {streak >= 2 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 text-sm font-medium text-accent"
            >
              <Flame size={14} aria-hidden="true" />
              {streak}
            </motion.span>
          )}
        </div>
        <ProgressBar value={progress} color="accent" size="sm" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${round}-${current.id}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{
            duration: duration.normal / 1000,
            ease: easingArray.out,
          }}
        >
          <QuestionCard
            question={current}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
            totalQuestions={roundQuestions.length}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default QuizSession;
