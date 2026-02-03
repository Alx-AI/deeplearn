'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { duration, easingArray } from '@/lib/design-tokens';
import type { QuizQuestion } from '@/lib/db/schema';
import { FormattedText } from '@/components/ui/FormattedText';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuizCardProps {
  question: QuizQuestion;
  /** Called when the user submits their answer. */
  onAnswer?: (questionId: string, answer: string, correct: boolean) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuizCard({ question, onAnswer, className = '' }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = submitted && selected === question.correctAnswer;
  const isIncorrect = submitted && selected !== question.correctAnswer;

  const handleSubmit = useCallback(() => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onAnswer?.(question.id, selected, selected === question.correctAnswer);
  }, [selected, submitted, question, onAnswer]);

  return (
    <div className={`rounded-xl border border-border bg-elevated overflow-hidden shadow-sm ${className}`}>
      <div className="p-5">
        {/* Question */}
        <FormattedText text={question.question} as="p" className="text-base font-medium text-primary leading-relaxed font-reading mb-5" />

        {/* Multiple-choice options */}
        {question.type === 'multiple-choice' && question.options && (
          <fieldset className="space-y-2 mb-5" disabled={submitted}>
            <legend className="sr-only">Answer options</legend>
            {question.options.map((option, i) => {
              const isOptionSelected = selected === option;
              const isOptionCorrect = submitted && option === question.correctAnswer;
              const isOptionWrong = submitted && isOptionSelected && !isOptionCorrect;

              return (
                <label
                  key={i}
                  className={[
                    'flex items-center gap-3 p-3 rounded-lg',
                    `border transition-colors ${submitted ? 'cursor-default' : 'cursor-pointer'}`,
                    !submitted && isOptionSelected
                      ? 'border-accent bg-accent-subtle'
                      : '',
                    !submitted && !isOptionSelected
                      ? 'border-border hover:border-accent/40'
                      : '',
                    isOptionCorrect
                      ? 'border-success bg-success-subtle'
                      : '',
                    isOptionWrong
                      ? 'border-error bg-error-subtle'
                      : '',
                    submitted && !isOptionCorrect && !isOptionWrong
                      ? 'border-border opacity-50'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <input
                    type="radio"
                    name={`quiz-${question.id}`}
                    value={option}
                    checked={isOptionSelected}
                    onChange={() => setSelected(option)}
                    className="sr-only"
                    aria-label={option}
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs font-medium shrink-0 ${
                      isOptionCorrect
                        ? 'border-success bg-success text-inverse'
                        : isOptionWrong
                          ? 'border-error bg-error text-inverse'
                          : isOptionSelected
                            ? 'border-accent bg-accent text-inverse'
                            : 'border-current text-tertiary'
                    }`}
                  >
                    {isOptionCorrect ? (
                      <Check size={10} aria-hidden="true" />
                    ) : isOptionWrong ? (
                      <X size={10} aria-hidden="true" />
                    ) : isOptionSelected ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <FormattedText text={option} as="span" className="text-sm text-primary" />
                </label>
              );
            })}
          </fieldset>
        )}

        {/* True/false */}
        {question.type === 'true-false' && (
          <fieldset className="flex gap-3 mb-5" disabled={submitted}>
            <legend className="sr-only">True or False</legend>
            {['True', 'False'].map((option) => {
              const isOptionSelected = selected === option;
              const isOptionCorrect = submitted && option === question.correctAnswer;
              const isOptionWrong = submitted && isOptionSelected && !isOptionCorrect;

              return (
                <label
                  key={option}
                  className={[
                    'flex-1 flex items-center justify-center gap-2 p-3',
                    `rounded-lg border transition-colors ${submitted ? 'cursor-default' : 'cursor-pointer'}`,
                    !submitted && isOptionSelected
                      ? 'border-accent bg-accent-subtle'
                      : '',
                    !submitted && !isOptionSelected
                      ? 'border-border hover:border-accent/40'
                      : '',
                    isOptionCorrect ? 'border-success bg-success-subtle' : '',
                    isOptionWrong ? 'border-error bg-error-subtle' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <input
                    type="radio"
                    name={`quiz-${question.id}`}
                    value={option}
                    checked={isOptionSelected}
                    onChange={() => setSelected(option)}
                    className="sr-only"
                    aria-label={option}
                  />
                  <span className="text-sm font-medium">{option}</span>
                </label>
              );
            })}
          </fieldset>
        )}

        {/* Fill-in-the-blank */}
        {question.type === 'fill-blank' && (
          <div className="mb-5">
            <input
              type="text"
              value={selected ?? ''}
              onChange={(e) => !submitted && setSelected(e.target.value)}
              disabled={submitted}
              placeholder="Type your answer..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitted && selected) handleSubmit();
              }}
              className={[
                'w-full px-3 py-2 rounded-lg border text-sm text-primary bg-background',
                'focus:outline-2 focus:outline-offset-2 focus:outline-accent',
                !submitted ? 'border-border' : '',
                isCorrect ? 'border-success bg-success-subtle' : '',
                isIncorrect ? 'border-error bg-error-subtle' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label="Your answer"
            />
          </div>
        )}

        {/* Submit / feedback */}
        {!submitted ? (
          <button
            disabled={!selected}
            onClick={handleSubmit}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-inverse transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Check
          </button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{
                duration: duration.normal / 1000,
                ease: easingArray.out,
              }}
            >
              <div
                className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${
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
              {question.explanation && (
                <FormattedText text={question.explanation} as="p" className="text-sm text-secondary leading-relaxed" />
              )}
              {isIncorrect && (
                <p className="mt-2 text-sm text-primary">
                  <span className="font-medium">Answer:</span>{' '}
                  <FormattedText text={question.correctAnswer} />
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default QuizCard;
