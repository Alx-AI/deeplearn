/**
 * Barrel export for lesson content modules.
 *
 * Each lesson content file exports a `LessonContentData` default export
 * containing the full prose, section structure, and review card references.
 * Lessons are lazy-loaded via dynamic import to keep the initial bundle
 * small -- only the lesson the learner is currently reading gets fetched.
 *
 * Missing lesson files are handled gracefully: `getLessonContent` returns
 * `null` when the import fails (file not yet authored, typo in ID, etc.).
 */

// Re-export shared types so consumers can import them from a single location.
export type { LessonContentData, LessonSection, CodeExample } from './lesson-1-1';

import type { LessonContentData } from './lesson-1-1';

// ---------------------------------------------------------------------------
// Type alias for a lazy-loading function
// ---------------------------------------------------------------------------

type ContentModule = { default: LessonContentData };
type Loader = () => Promise<ContentModule>;

// ---------------------------------------------------------------------------
// All 72 lesson IDs across the 7 modules
// ---------------------------------------------------------------------------

/** Complete ordered list of every lesson ID in the curriculum. */
export const ALL_LESSON_IDS: string[] = [
  // Module 1: Foundations (10)
  '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10',
  // Module 2: Getting Started (10)
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10',
  // Module 3: ML Fundamentals (10)
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10',
  // Module 4: Deep Dive into Practice (12)
  '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12',
  // Module 5: Computer Vision & Sequences (12)
  '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10', '5.11', '5.12',
  // Module 6: NLP & Generation (12)
  '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '6.10', '6.11', '6.12',
  // Module 7: Mastery (6)
  '7.1', '7.2', '7.3', '7.4', '7.5', '7.6',
];

// ---------------------------------------------------------------------------
// Lazy-load map
//
// Maps every lesson ID to a dynamic import of its content file. The file
// name convention is `lesson-{module}-{order}.ts` (e.g. `lesson-1-1.ts`).
//
// We build the map programmatically so that TypeScript does not statically
// check each import path -- this allows lesson files to be authored
// incrementally without causing compile errors for files that do not exist
// yet. At runtime the import will reject, and `getLessonContent` catches
// the error and returns `null`.
// ---------------------------------------------------------------------------

function buildLessonContentMap(): Record<string, Loader> {
  const map: Record<string, Loader> = {};

  for (const id of ALL_LESSON_IDS) {
    const fileName = `./lesson-${id.replace('.', '-')}`;
    // The variable in the template expression prevents TS from resolving
    // the module path statically, so missing files won't cause TS2307.
    map[id] = () => import(/* webpackChunkName: "lesson-[request]" */ `${fileName}`) as Promise<ContentModule>;
  }

  return map;
}

export const lessonContentMap: Record<string, Loader> = buildLessonContentMap();

// ---------------------------------------------------------------------------
// Helper: load a single lesson's content by ID
// ---------------------------------------------------------------------------

/**
 * Fetch the rich content for a lesson.
 *
 * Returns `null` when the lesson ID is unknown **or** when the backing
 * content file has not been authored yet (the dynamic import will reject,
 * and we swallow the error).
 */
export async function getLessonContent(
  lessonId: string,
): Promise<LessonContentData | null> {
  const loader = lessonContentMap[lessonId];
  if (!loader) return null;

  try {
    const mod = await loader();
    return mod.default;
  } catch {
    // File does not exist yet -- perfectly normal during incremental authoring.
    return null;
  }
}
