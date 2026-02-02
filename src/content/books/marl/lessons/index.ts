/**
 * Barrel export for MARL lesson content modules.
 *
 * Each lesson content file exports a `LessonContentData` default export.
 * Lessons are lazy-loaded via dynamic import to keep the initial bundle small.
 */

// Re-export shared types from the DL book (canonical location for the interfaces).
export type {
  LessonContentData,
  LessonSection,
  CodeExample,
} from '../../deep-learning-python/lessons/lesson-1-1';

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

type ContentModule = { default: LessonContentData };
type Loader = () => Promise<ContentModule>;

// ---------------------------------------------------------------------------
// All 65 lesson IDs across the 9 modules
// ---------------------------------------------------------------------------

export const ALL_LESSON_IDS: string[] = [
  // Module 1: Introduction to Multi-Agent Systems (4)
  'marl-1.1', 'marl-1.2', 'marl-1.3', 'marl-1.4',
  // Module 2: Single-Agent Reinforcement Learning (7)
  'marl-2.1', 'marl-2.2', 'marl-2.3', 'marl-2.4', 'marl-2.5', 'marl-2.6', 'marl-2.7',
  // Module 3: Game Theory Foundations (6)
  'marl-3.1', 'marl-3.2', 'marl-3.3', 'marl-3.4', 'marl-3.5', 'marl-3.6',
  // Module 4: Solution Concepts for Games (8)
  'marl-4.1', 'marl-4.2', 'marl-4.3', 'marl-4.4', 'marl-4.5', 'marl-4.6', 'marl-4.7', 'marl-4.8',
  // Module 5: MARL First Steps and Challenges (7)
  'marl-5.1', 'marl-5.2', 'marl-5.3', 'marl-5.4', 'marl-5.5', 'marl-5.6', 'marl-5.7',
  // Module 6: Foundational MARL Algorithms (10)
  'marl-6.1', 'marl-6.2', 'marl-6.3', 'marl-6.4', 'marl-6.5',
  'marl-6.6', 'marl-6.7', 'marl-6.8', 'marl-6.9', 'marl-6.10',
  // Module 7: Deep Learning and Deep RL (9)
  'marl-7.1', 'marl-7.2', 'marl-7.3', 'marl-7.4', 'marl-7.5',
  'marl-7.6', 'marl-7.7', 'marl-7.8', 'marl-7.9',
  // Module 8: Multi-Agent Deep Reinforcement Learning (10)
  'marl-8.1', 'marl-8.2', 'marl-8.3', 'marl-8.4', 'marl-8.5',
  'marl-8.6', 'marl-8.7', 'marl-8.8', 'marl-8.9', 'marl-8.10',
  // Module 9: MARL in Practice and Environments (4)
  'marl-9.1', 'marl-9.2', 'marl-9.3', 'marl-9.4',
];

function buildLessonContentMap(): Record<string, Loader> {
  const map: Record<string, Loader> = {};

  for (const id of ALL_LESSON_IDS) {
    const fileName = `./lesson-${id.replace('.', '-')}`;
    map[id] = () =>
      import(/* webpackChunkName: "marl-lesson-[request]" */ `${fileName}`) as Promise<ContentModule>;
  }

  return map;
}

export const lessonContentMap: Record<string, Loader> = buildLessonContentMap();

export async function getLessonContent(
  lessonId: string,
): Promise<LessonContentData | null> {
  const loader = lessonContentMap[lessonId];
  if (!loader) return null;

  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
