/**
 * Review session manager.
 *
 * Orchestrates a single review session: pulls due cards, mixes in new cards,
 * presents them in priority order, collects ratings, and tracks statistics.
 *
 * Usage:
 *   const session = new ReviewSession({ dueCards, newCards, maxCards: 20 });
 *   while (session.hasNext()) {
 *     const item = session.current();
 *     // show item.prompt / item.answer to the user, collect rating
 *     session.rateCurrentCard(Rating.Good);
 *   }
 *   const stats = session.getStats();
 */

import { Rating, State } from 'ts-fsrs';
import type { Card, Grade, RecordLogItem } from 'ts-fsrs';

import { srsEngine } from './engine';
import type { UserCardState, ReviewCard } from '../db/schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A card queued for review within a session. */
export interface SessionCard {
  /** The static review card content (prompt, answer, etc.) */
  reviewCard: ReviewCard;
  /** The learner's current FSRS state for this card */
  userState: UserCardState;
  /** Whether this is a new card the learner has never seen */
  isNew: boolean;
}

/** Configuration for a review session. */
export interface ReviewSessionConfig {
  /** Cards that are currently due for review */
  dueCards: SessionCard[];
  /** New cards the learner has not yet encountered */
  newCards: SessionCard[];
  /** Maximum total cards to review in this session (default: 20) */
  maxCards?: number;
  /** Maximum new cards to introduce in this session (default: 10) */
  maxNewCards?: number;
  /**
   * Interleave ratio: fraction of the session dedicated to new cards.
   * For example, 0.3 means roughly 30% new cards, 70% review cards.
   * Only applies when both types are available. (default: 0.3)
   */
  newCardRatio?: number;
}

/** Outcome of rating a single card within a session. */
export interface RatingResult {
  /** The card that was rated */
  cardId: string;
  /** The rating given */
  grade: Grade;
  /** Updated FSRS card state after the review */
  updatedState: UserCardState;
  /** The FSRS review log entry */
  log: RecordLogItem['log'];
  /** Time in milliseconds the user spent on this card */
  responseTimeMs: number;
}

/** Summary statistics for a completed (or in-progress) session. */
export interface SessionStatistics {
  /** Total cards reviewed so far */
  totalReviewed: number;
  /** Cards remaining in the queue */
  remaining: number;
  /** Breakdown by rating */
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  /** New cards studied */
  newCardsStudied: number;
  /** Review cards studied */
  reviewCardsStudied: number;
  /** Total session duration so far (ms) */
  totalTimeMs: number;
  /** Average time per card (ms) */
  averageTimeMs: number;
  /**
   * Retention rate: fraction of review cards (not new) rated Good or Easy.
   * Returns 0 if no review cards have been studied yet.
   */
  retentionRate: number;
  /** Session start time */
  startedAt: Date;
}

// ---------------------------------------------------------------------------
// ReviewSession class
// ---------------------------------------------------------------------------

export class ReviewSession {
  private queue: SessionCard[];
  private results: RatingResult[] = [];
  private currentIndex = 0;
  private currentCardStartTime: number | null = null;
  private sessionStartTime: Date;
  private config: Required<ReviewSessionConfig>;

  constructor(config: ReviewSessionConfig) {
    this.sessionStartTime = new Date();
    this.config = {
      dueCards: config.dueCards,
      newCards: config.newCards,
      maxCards: config.maxCards ?? 20,
      maxNewCards: config.maxNewCards ?? 10,
      newCardRatio: config.newCardRatio ?? 0.3,
    };

    this.queue = this.buildQueue();
  }

  // -----------------------------------------------------------------------
  // Session flow
  // -----------------------------------------------------------------------

  /**
   * Get the current card to present to the learner.
   * Returns null if the session is complete.
   */
  current(): SessionCard | null {
    if (this.currentIndex >= this.queue.length) return null;

    // Start timing when the card is first presented
    if (this.currentCardStartTime === null) {
      this.currentCardStartTime = Date.now();
    }

    return this.queue[this.currentIndex];
  }

  /**
   * Rate the current card and advance to the next one.
   *
   * @param grade  The learner's self-assessed rating
   * @param now    Override for current time (testing)
   * @returns      The rating result, or null if no card is active
   */
  rateCurrentCard(grade: Grade, now?: Date): RatingResult | null {
    const card = this.current();
    if (!card) return null;

    const responseTimeMs = this.currentCardStartTime
      ? Date.now() - this.currentCardStartTime
      : 0;

    // Run through the FSRS engine
    const { state: updatedState, log } = srsEngine.reviewUserCard(
      card.userState,
      grade,
      now,
    );

    const result: RatingResult = {
      cardId: card.reviewCard.id,
      grade,
      updatedState,
      log,
      responseTimeMs,
    };

    this.results.push(result);
    this.currentIndex++;
    this.currentCardStartTime = null;

    return result;
  }

  /** Whether there are more cards to review. */
  hasNext(): boolean {
    return this.currentIndex < this.queue.length;
  }

  /** How many cards remain in the queue (including the current one). */
  remaining(): number {
    return Math.max(0, this.queue.length - this.currentIndex);
  }

  /** Total number of cards in this session's queue. */
  totalCards(): number {
    return this.queue.length;
  }

  /**
   * Inject additional cards into the session queue.
   *
   * Useful when the adaptive quiz identifies concepts that need re-learning
   * -- those cards can be added to the current review session.
   */
  addCards(cards: SessionCard[]): void {
    // Insert after current position so they come up soon
    this.queue.splice(this.currentIndex + 1, 0, ...cards);
  }

  // -----------------------------------------------------------------------
  // Statistics
  // -----------------------------------------------------------------------

  /** Get current session statistics. */
  getStats(): SessionStatistics {
    const againCount = this.results.filter(
      (r) => r.grade === Rating.Again,
    ).length;
    const hardCount = this.results.filter(
      (r) => r.grade === Rating.Hard,
    ).length;
    const goodCount = this.results.filter(
      (r) => r.grade === Rating.Good,
    ).length;
    const easyCount = this.results.filter(
      (r) => r.grade === Rating.Easy,
    ).length;

    const newCardsStudied = this.results.filter((r) => {
      const sessionCard = this.queue.find(
        (q) => q.reviewCard.id === r.cardId,
      );
      return sessionCard?.isNew ?? false;
    }).length;

    const reviewCardsStudied = this.results.length - newCardsStudied;

    const totalTimeMs = this.results.reduce(
      (sum, r) => sum + r.responseTimeMs,
      0,
    );

    // Retention: fraction of review (non-new) cards rated Good or Easy
    const reviewResults = this.results.filter((r) => {
      const sessionCard = this.queue.find(
        (q) => q.reviewCard.id === r.cardId,
      );
      return !(sessionCard?.isNew ?? true);
    });

    const correctReviews = reviewResults.filter(
      (r) => r.grade === Rating.Good || r.grade === Rating.Easy,
    ).length;

    const retentionRate =
      reviewResults.length > 0 ? correctReviews / reviewResults.length : 0;

    return {
      totalReviewed: this.results.length,
      remaining: this.remaining(),
      againCount,
      hardCount,
      goodCount,
      easyCount,
      newCardsStudied,
      reviewCardsStudied,
      totalTimeMs,
      averageTimeMs:
        this.results.length > 0 ? totalTimeMs / this.results.length : 0,
      retentionRate,
      startedAt: this.sessionStartTime,
    };
  }

  /** Get all individual rating results from the session so far. */
  getResults(): readonly RatingResult[] {
    return this.results;
  }

  // -----------------------------------------------------------------------
  // Queue construction (private)
  // -----------------------------------------------------------------------

  /**
   * Build the review queue by interleaving due cards and new cards according
   * to the configured ratio and limits.
   */
  private buildQueue(): SessionCard[] {
    const { dueCards, newCards, maxCards, maxNewCards, newCardRatio } =
      this.config;

    // Sort due cards by priority (most urgent first)
    const sortedDue = srsEngine.sortByPriority(
      dueCards.map((sc) => ({ id: sc.reviewCard.id, card: sc.userState.fsrsCard })),
    );
    const orderedDue = sortedDue.map(
      (sorted) => dueCards.find((dc) => dc.reviewCard.id === sorted.id)!,
    );

    // Determine how many of each type to include
    const targetNew = Math.min(
      newCards.length,
      maxNewCards,
      Math.floor(maxCards * newCardRatio),
    );
    const targetReview = Math.min(orderedDue.length, maxCards - targetNew);
    const actualNew = Math.min(targetNew, maxCards - targetReview);

    const reviewPool = orderedDue.slice(0, targetReview);
    const newPool = newCards.slice(0, actualNew);

    // Interleave: insert new cards at roughly even intervals among review cards
    return this.interleave(reviewPool, newPool);
  }

  /**
   * Interleave new cards among review cards at roughly even intervals.
   *
   * For example, with 14 review cards and 6 new cards, a new card is
   * inserted roughly every 3-4 positions.
   */
  private interleave(
    reviewCards: SessionCard[],
    newCards: SessionCard[],
  ): SessionCard[] {
    if (newCards.length === 0) return reviewCards;
    if (reviewCards.length === 0) return newCards;

    const result: SessionCard[] = [];
    const interval = (reviewCards.length + newCards.length) / newCards.length;
    let newIndex = 0;
    let reviewIndex = 0;
    let nextNewAt = Math.floor(interval / 2); // Start inserting partway in

    for (let i = 0; i < reviewCards.length + newCards.length; i++) {
      if (newIndex < newCards.length && i >= nextNewAt) {
        result.push(newCards[newIndex]);
        newIndex++;
        nextNewAt = Math.floor(interval / 2 + interval * newIndex);
      } else if (reviewIndex < reviewCards.length) {
        result.push(reviewCards[reviewIndex]);
        reviewIndex++;
      } else if (newIndex < newCards.length) {
        result.push(newCards[newIndex]);
        newIndex++;
      }
    }

    return result;
  }
}
