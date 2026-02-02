/**
 * Book registry for the DeepLearn platform.
 *
 * Each book represents a complete learning source with its own modules,
 * lessons, review cards, quiz questions, and illustrations.
 */

export interface Book {
  /** URL slug used in routing, e.g. "deep-learning-python" */
  id: string;
  /** Full title shown in detail views */
  title: string;
  /** Abbreviated title for the nav dropdown and cards */
  shortTitle: string;
  /** One-line description */
  description: string;
  /** Author(s) */
  authors: string;
  /** Display order in the book selector */
  order: number;
}

export const books: Book[] = [
  {
    id: 'deep-learning-python',
    title: 'Deep Learning with Python, 3rd Ed.',
    shortTitle: 'Deep Learning',
    description:
      'Master neural networks from foundations through mastery with Keras, TensorFlow, and PyTorch.',
    authors: 'Fran\u00e7ois Chollet & Mark Watson',
    order: 1,
  },
  {
    id: 'marl',
    title: 'Multi-Agent Reinforcement Learning',
    shortTitle: 'Multi-Agent RL',
    description:
      'Foundations and modern approaches to multi-agent reinforcement learning, from game theory to deep MARL.',
    authors: 'Stefano V. Albrecht, Filippos Christianos & Lukas Sch\u00e4fer',
    order: 2,
  },
];

/** Look up a book by its slug. */
export function getBook(bookId: string): Book | null {
  return books.find((b) => b.id === bookId) ?? null;
}

/** Check whether a book ID exists. */
export function isValidBookId(bookId: string): boolean {
  return books.some((b) => b.id === bookId);
}
