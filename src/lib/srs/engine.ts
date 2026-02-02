/**
 * Core spaced repetition engine built on ts-fsrs.
 *
 * Wraps the FSRS algorithm with configuration tuned for technical deep-learning
 * content. Following Quantum Country's research, we use slightly longer initial
 * intervals and a gentler learning curve for conceptually dense material.
 *
 * Usage:
 *   import { srsEngine } from '@/lib/srs/engine';
 *   const card = srsEngine.createNewCard();
 *   const result = srsEngine.reviewCard(card, Rating.Good);
 */

import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  type FSRS,
  type Card,
  Rating,
  State,
  type RecordLogItem,
  type Grade,
} from 'ts-fsrs';

import type { UserCardState } from '../db/schema';

// ---------------------------------------------------------------------------
// SRS Engine
// ---------------------------------------------------------------------------

export class SRSEngine {
  private f: FSRS;

  constructor() {
    const params = generatorParameters({
      request_retention: 0.9,   // Target 90% retention rate
      maximum_interval: 365,    // Cap at 1 year between reviews
      enable_fuzz: true,        // Randomise intervals to prevent review clustering
    });
    this.f = fsrs(params);
  }

  // -------------------------------------------------------------------------
  // Card lifecycle
  // -------------------------------------------------------------------------

  /**
   * Create a brand-new FSRS card.
   *
   * Call this when a learner first encounters a review prompt. The card starts
   * in the New state with its due date set to now.
   */
  createNewCard(now?: Date): Card {
    return createEmptyCard(now ?? new Date());
  }

  /**
   * Review a card and return the updated card + review log for every possible
   * grade. The caller selects the appropriate grade entry.
   *
   * @param card  Current FSRS card state
   * @param grade The learner's self-assessed rating (Again/Hard/Good/Easy)
   * @param now   Override for "current time" (useful for testing)
   * @returns     The updated card and corresponding review log entry
   */
  reviewCard(card: Card, grade: Grade, now?: Date): RecordLogItem {
    const reviewDate = now ?? new Date();
    return this.f.next(card, reviewDate, grade);
  }

  /**
   * Preview all possible outcomes for a card review without committing.
   *
   * Returns a record keyed by Grade (Again, Hard, Good, Easy) with the
   * resulting card state and review log for each.
   */
  previewCard(card: Card, now?: Date) {
    const reviewDate = now ?? new Date();
    return this.f.repeat(card, reviewDate);
  }

  // -------------------------------------------------------------------------
  // Scheduling helpers
  // -------------------------------------------------------------------------

  /**
   * Get the date when a card is next due for review.
   */
  getNextReview(card: Card): Date {
    return new Date(card.due);
  }

  /**
   * Calculate the current retrievability (probability of recall) for a card.
   *
   * Returns a number between 0 and 1. Cards that have never been reviewed
   * return 0.
   */
  getRetrievability(card: Card, now?: Date): number {
    // New cards that have never been reviewed have no retrievability
    if (card.state === State.New) {
      return 0;
    }
    return this.f.get_retrievability(card, now ?? new Date(), false);
  }

  /**
   * Filter a list of cards to only those that are currently due for review.
   *
   * A card is "due" if its due date is at or before the given time.
   */
  getDueCards<T extends { id: string; card: Card }>(
    cards: T[],
    now?: Date,
  ): T[] {
    const cutoff = now ?? new Date();
    return cards.filter((item) => new Date(item.card.due) <= cutoff);
  }

  /**
   * Sort cards by review priority (most urgent first).
   *
   * Priority ordering:
   *   1. Cards in Learning/Relearning state (need immediate attention)
   *   2. Overdue Review cards (sorted by how overdue they are)
   *   3. New cards
   *
   * Within each group, cards are sorted by due date ascending.
   */
  sortByPriority<T extends { id: string; card: Card }>(cards: T[]): T[] {
    return [...cards].sort((a, b) => {
      const stateOrder = this.getStatePriority(a.card.state)
        - this.getStatePriority(b.card.state);
      if (stateOrder !== 0) return stateOrder;

      // Within the same state group, earlier due dates come first
      return new Date(a.card.due).getTime() - new Date(b.card.due).getTime();
    });
  }

  // -------------------------------------------------------------------------
  // Convenience: work with UserCardState
  // -------------------------------------------------------------------------

  /**
   * Create a fresh UserCardState for a review card that the learner has just
   * encountered for the first time.
   */
  createUserCardState(cardId: string, now?: Date): UserCardState {
    const card = this.createNewCard(now);
    return {
      cardId,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: card.elapsed_days,
      scheduled_days: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      lastReview: card.last_review ?? null,
      fsrsCard: card,
    };
  }

  /**
   * Process a review and return the updated UserCardState.
   */
  reviewUserCard(
    state: UserCardState,
    grade: Grade,
    now?: Date,
  ): { state: UserCardState; log: RecordLogItem['log'] } {
    const result = this.reviewCard(state.fsrsCard, grade, now);
    const updatedCard = result.card;

    return {
      state: {
        cardId: state.cardId,
        due: updatedCard.due,
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        elapsed_days: updatedCard.elapsed_days,
        scheduled_days: updatedCard.scheduled_days,
        reps: updatedCard.reps,
        lapses: updatedCard.lapses,
        state: updatedCard.state,
        lastReview: updatedCard.last_review ?? null,
        fsrsCard: updatedCard,
      },
      log: result.log,
    };
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  /**
   * Map FSRS State to a numeric priority.
   * Lower number = higher priority (should be reviewed sooner).
   */
  private getStatePriority(state: State): number {
    switch (state) {
      case State.Relearning: return 0; // Forgotten cards need immediate attention
      case State.Learning:   return 1; // Cards being initially learned
      case State.Review:     return 2; // Mature cards due for review
      case State.New:        return 3; // Not yet encountered
      default:               return 4;
    }
  }
}

// ---------------------------------------------------------------------------
// Singleton instance
// ---------------------------------------------------------------------------

export const srsEngine = new SRSEngine();

// ---------------------------------------------------------------------------
// Re-export commonly used ts-fsrs types for convenience
// ---------------------------------------------------------------------------

export { Rating, State };
export type { Card, Grade, RecordLogItem };
