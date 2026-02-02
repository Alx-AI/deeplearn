/**
 * Adaptive quiz engine.
 *
 * Manages end-of-lesson quizzes with adaptive re-learning. When a learner
 * answers a question incorrectly, the system:
 *   1. Records which concepts were missed
 *   2. Links missed concepts to their related review cards
 *   3. After the initial pass, re-presents missed questions
 *   4. Provides targeted feedback based on the specific concept
 *
 * Usage:
 *   const quiz = new AdaptiveQuiz({ questions, lessonId });
 *   while (quiz.hasNext()) {
 *     const q = quiz.currentQuestion();
 *     const result = quiz.submitAnswer(userAnswer);
 *     // show result.isCorrect, result.explanation, result.feedback
 *   }
 *   const summary = quiz.getSummary();
 */

import type { QuizQuestion, ReviewCard } from '../db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration for an adaptive quiz. */
export interface AdaptiveQuizConfig {
  /** The quiz questions in display order */
  questions: QuizQuestion[];
  /** Lesson identifier */
  lessonId: string;
  /** Optional lookup of related review cards for targeted feedback */
  relatedCards?: Map<string, ReviewCard>;
  /**
   * Maximum number of retry rounds for missed questions.
   * After this many rounds, the quiz ends regardless. (default: 2)
   */
  maxRetryRounds?: number;
  /**
   * Minimum correct percentage on retry to stop re-presenting.
   * For example, 1.0 means the learner must get all retries correct.
   * (default: 1.0)
   */
  retryPassThreshold?: number;
}

/** Result of submitting an answer to a single question. */
export interface AnswerResult {
  /** The question that was answered */
  questionId: string;
  /** Whether the answer was correct */
  isCorrect: boolean;
  /** The correct answer */
  correctAnswer: string;
  /** Explanation for the correct answer */
  explanation: string;
  /** Targeted feedback based on the concept that was missed (only on wrong answers) */
  feedback: string | null;
  /** IDs of review cards related to this concept (for re-learning) */
  relatedCardIds: string[];
  /** Whether this was a retry attempt */
  isRetry: boolean;
  /** Which round this answer belongs to (0 = initial, 1+ = retry) */
  round: number;
}

/** Per-question attempt tracking. */
interface QuestionAttempt {
  questionId: string;
  answers: Array<{
    answer: string;
    isCorrect: boolean;
    round: number;
    timestamp: Date;
    responseTimeMs: number;
  }>;
}

/** Overall quiz score and mastery assessment. */
export interface QuizSummary {
  /** Lesson this quiz belongs to */
  lessonId: string;
  /** Total questions in the quiz */
  totalQuestions: number;
  /** Questions answered correctly on the first attempt */
  correctFirstAttempt: number;
  /** Questions answered correctly (including retries) */
  correctTotal: number;
  /** Questions never answered correctly */
  neverCorrect: number;
  /** First-attempt score as a percentage (0-100) */
  firstAttemptScore: number;
  /** Final score accounting for retries, with partial credit (0-100) */
  finalScore: number;
  /** Mastery assessment */
  mastery: QuizMastery;
  /** IDs of concepts that were missed */
  missedConceptIds: string[];
  /** IDs of review cards that should be prioritized for re-learning */
  cardsForRelearning: string[];
  /** Total time spent on the quiz (ms) */
  totalTimeMs: number;
  /** Number of retry rounds completed */
  retryRoundsCompleted: number;
  /** Whether the quiz should be considered "passed" */
  passed: boolean;
  /** Per-question breakdown */
  questionResults: QuestionResult[];
}

/** Per-question result in the summary. */
export interface QuestionResult {
  questionId: string;
  conceptId: string;
  isCorrectFirstAttempt: boolean;
  isCorrectFinal: boolean;
  totalAttempts: number;
  totalTimeMs: number;
}

/** Mastery levels determined by quiz performance. */
export type QuizMastery =
  | 'not-attempted'
  | 'needs-review'
  | 'developing'
  | 'proficient'
  | 'mastered';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Score thresholds for determining quiz mastery. */
const MASTERY_THRESHOLDS = {
  mastered: 95,     // 95%+ first attempt = mastered
  proficient: 80,   // 80%+ first attempt = proficient
  developing: 60,   // 60%+ first attempt = developing
  needsReview: 0,   // Below 60% = needs review
} as const;

/** Minimum score to "pass" a quiz and mark the lesson as completed. */
const PASSING_SCORE = 70;

// ---------------------------------------------------------------------------
// AdaptiveQuiz class
// ---------------------------------------------------------------------------

export class AdaptiveQuiz {
  private questions: QuizQuestion[];
  private relatedCards: Map<string, ReviewCard>;
  private lessonId: string;

  // Queue management
  private currentQueue: QuizQuestion[] = [];
  private currentIndex = 0;
  private currentRound = 0;
  private maxRetryRounds: number;
  private retryPassThreshold: number;

  // Tracking
  private attempts: Map<string, QuestionAttempt> = new Map();
  private missedThisRound: Set<string> = new Set();
  private currentQuestionStartTime: number | null = null;
  private quizStartTime: Date;
  private isComplete = false;

  constructor(config: AdaptiveQuizConfig) {
    this.questions = [...config.questions];
    this.lessonId = config.lessonId;
    this.relatedCards = config.relatedCards ?? new Map();
    this.maxRetryRounds = config.maxRetryRounds ?? 2;
    this.retryPassThreshold = config.retryPassThreshold ?? 1.0;
    this.quizStartTime = new Date();

    // Initialize the first round queue
    this.currentQueue = [...this.questions];
    this.currentIndex = 0;

    // Initialize attempt tracking for all questions
    for (const q of this.questions) {
      this.attempts.set(q.id, {
        questionId: q.id,
        answers: [],
      });
    }
  }

  // -----------------------------------------------------------------------
  // Quiz flow
  // -----------------------------------------------------------------------

  /**
   * Get the current question to display.
   * Returns null if the quiz is complete.
   */
  currentQuestion(): QuizQuestion | null {
    if (this.isComplete) return null;
    if (this.currentIndex >= this.currentQueue.length) return null;

    if (this.currentQuestionStartTime === null) {
      this.currentQuestionStartTime = Date.now();
    }

    return this.currentQueue[this.currentIndex];
  }

  /**
   * Submit an answer for the current question.
   *
   * @param answer The learner's answer (option text for MC, "true"/"false" for T/F)
   * @returns The result including correctness, explanation, and feedback
   */
  submitAnswer(answer: string): AnswerResult | null {
    const question = this.currentQuestion();
    if (!question) return null;

    const responseTimeMs = this.currentQuestionStartTime
      ? Date.now() - this.currentQuestionStartTime
      : 0;

    const isCorrect = this.checkAnswer(question, answer);

    // Record the attempt
    const attempt = this.attempts.get(question.id)!;
    attempt.answers.push({
      answer,
      isCorrect,
      round: this.currentRound,
      timestamp: new Date(),
      responseTimeMs,
    });

    // Track missed questions for retry
    if (!isCorrect) {
      this.missedThisRound.add(question.id);
    }

    // Build feedback
    const feedback = isCorrect
      ? null
      : this.buildFeedback(question);

    const result: AnswerResult = {
      questionId: question.id,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      feedback,
      relatedCardIds: isCorrect ? [] : question.relatedCardIds,
      isRetry: this.currentRound > 0,
      round: this.currentRound,
    };

    // Advance to next question
    this.currentIndex++;
    this.currentQuestionStartTime = null;

    // Check if the current round is complete
    if (this.currentIndex >= this.currentQueue.length) {
      this.tryStartRetryRound();
    }

    return result;
  }

  /** Whether there are more questions to answer. */
  hasNext(): boolean {
    if (this.isComplete) return false;
    return this.currentIndex < this.currentQueue.length;
  }

  /** Whether the quiz has been completed (no more questions or retries). */
  isQuizComplete(): boolean {
    return this.isComplete;
  }

  /** The current round number (0 = initial, 1+ = retry rounds). */
  getCurrentRound(): number {
    return this.currentRound;
  }

  /** Progress within the current round. */
  getProgress(): { current: number; total: number; round: number } {
    return {
      current: Math.min(this.currentIndex + 1, this.currentQueue.length),
      total: this.currentQueue.length,
      round: this.currentRound,
    };
  }

  // -----------------------------------------------------------------------
  // Summary and scoring
  // -----------------------------------------------------------------------

  /**
   * Get the complete quiz summary.
   *
   * Can be called at any time, but most useful after the quiz is complete.
   */
  getSummary(): QuizSummary {
    const questionResults: QuestionResult[] = this.questions.map((q) => {
      const attempt = this.attempts.get(q.id)!;
      const firstAnswer = attempt.answers.find((a) => a.round === 0);
      const lastAnswer = attempt.answers[attempt.answers.length - 1];

      return {
        questionId: q.id,
        conceptId: this.getConceptId(q),
        isCorrectFirstAttempt: firstAnswer?.isCorrect ?? false,
        isCorrectFinal: lastAnswer?.isCorrect ?? false,
        totalAttempts: attempt.answers.length,
        totalTimeMs: attempt.answers.reduce(
          (sum, a) => sum + a.responseTimeMs,
          0,
        ),
      };
    });

    const correctFirstAttempt = questionResults.filter(
      (r) => r.isCorrectFirstAttempt,
    ).length;
    const correctTotal = questionResults.filter(
      (r) => r.isCorrectFinal,
    ).length;
    const neverCorrect = questionResults.filter(
      (r) => !r.isCorrectFinal,
    ).length;

    const totalQuestions = this.questions.length;
    const firstAttemptScore =
      totalQuestions > 0
        ? Math.round((correctFirstAttempt / totalQuestions) * 100)
        : 0;

    // Final score: full credit for first attempt, partial for retries
    const finalScore = this.calculateFinalScore(questionResults);

    const mastery = this.assessMastery(firstAttemptScore);

    // Collect missed concept IDs
    const missedConceptIds = [
      ...new Set(
        questionResults
          .filter((r) => !r.isCorrectFirstAttempt)
          .map((r) => r.conceptId),
      ),
    ];

    // Collect review card IDs for re-learning
    const cardsForRelearning = [
      ...new Set(
        this.questions
          .filter((q) => {
            const result = questionResults.find(
              (r) => r.questionId === q.id,
            );
            return result && !result.isCorrectFirstAttempt;
          })
          .flatMap((q) => q.relatedCardIds),
      ),
    ];

    const totalTimeMs = questionResults.reduce(
      (sum, r) => sum + r.totalTimeMs,
      0,
    );

    return {
      lessonId: this.lessonId,
      totalQuestions,
      correctFirstAttempt,
      correctTotal,
      neverCorrect,
      firstAttemptScore,
      finalScore,
      mastery,
      missedConceptIds,
      cardsForRelearning,
      totalTimeMs,
      retryRoundsCompleted: this.currentRound,
      passed: firstAttemptScore >= PASSING_SCORE,
      questionResults,
    };
  }

  /**
   * Get the IDs of review cards that should be immediately surfaced
   * for re-learning based on missed questions so far.
   */
  getCardsForRelearning(): string[] {
    const missedQuestionIds = new Set<string>();
    for (const [questionId, attempt] of this.attempts) {
      const hasWrong = attempt.answers.some((a) => !a.isCorrect);
      if (hasWrong) missedQuestionIds.add(questionId);
    }

    return [
      ...new Set(
        this.questions
          .filter((q) => missedQuestionIds.has(q.id))
          .flatMap((q) => q.relatedCardIds),
      ),
    ];
  }

  // -----------------------------------------------------------------------
  // Internal
  // -----------------------------------------------------------------------

  /**
   * Check if the learner's answer matches the correct answer.
   * Performs case-insensitive, whitespace-trimmed comparison.
   */
  private checkAnswer(question: QuizQuestion, answer: string): boolean {
    const normalise = (s: string) => s.trim().toLowerCase();
    return normalise(answer) === normalise(question.correctAnswer);
  }

  /**
   * Build targeted feedback for an incorrect answer.
   */
  private buildFeedback(question: QuizQuestion): string {
    // If we have related review cards, reference the concept
    if (question.relatedCardIds.length > 0) {
      const relatedCard = question.relatedCardIds
        .map((id) => this.relatedCards.get(id))
        .find((card) => card !== undefined);

      if (relatedCard) {
        return (
          `This question tests the same concept as: "${relatedCard.prompt}" ` +
          `Review this concept to strengthen your understanding.`
        );
      }
    }

    return `Review the explanation carefully and revisit the related section of the lesson.`;
  }

  /**
   * After completing a round, check if we should start a retry round
   * with the missed questions.
   */
  private tryStartRetryRound(): void {
    const missedQuestions = [...this.missedThisRound];

    // Check if we should stop retrying
    if (
      missedQuestions.length === 0 ||
      this.currentRound >= this.maxRetryRounds
    ) {
      this.isComplete = true;
      return;
    }

    // Check if the pass threshold is met for this round
    const roundTotal = this.currentQueue.length;
    const roundCorrect = roundTotal - missedQuestions.length;
    const roundRate = roundTotal > 0 ? roundCorrect / roundTotal : 1;

    if (roundRate >= this.retryPassThreshold) {
      this.isComplete = true;
      return;
    }

    // Start a new retry round with only the missed questions
    this.currentRound++;
    this.currentQueue = this.questions.filter((q) =>
      missedQuestions.includes(q.id),
    );
    this.currentIndex = 0;
    this.missedThisRound = new Set();
  }

  /**
   * Calculate the final score with partial credit for retries.
   *
   * Scoring:
   *   - Correct on first attempt: 100% credit
   *   - Correct on retry: 50% credit
   *   - Never correct: 0% credit
   */
  private calculateFinalScore(results: QuestionResult[]): number {
    if (results.length === 0) return 0;

    const totalPoints = results.reduce((sum, r) => {
      if (r.isCorrectFirstAttempt) return sum + 1;
      if (r.isCorrectFinal) return sum + 0.5;
      return sum;
    }, 0);

    return Math.round((totalPoints / results.length) * 100);
  }

  /**
   * Determine mastery level from the first-attempt score.
   */
  private assessMastery(firstAttemptScore: number): QuizMastery {
    if (firstAttemptScore >= MASTERY_THRESHOLDS.mastered) return 'mastered';
    if (firstAttemptScore >= MASTERY_THRESHOLDS.proficient) return 'proficient';
    if (firstAttemptScore >= MASTERY_THRESHOLDS.developing) return 'developing';
    return 'needs-review';
  }

  /**
   * Extract a concept identifier from a quiz question.
   *
   * Uses the first related card ID's concept, or falls back to
   * a combination of lesson ID and question ID.
   */
  private getConceptId(question: QuizQuestion): string {
    // The question itself may have tags or a related concept --
    // for now, derive a concept key from the question's ID namespace
    return `${question.lessonId}:${question.id}`;
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { MASTERY_THRESHOLDS, PASSING_SCORE };
