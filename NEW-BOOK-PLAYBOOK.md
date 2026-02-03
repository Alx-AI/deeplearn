# New Book Playbook

A comprehensive, step-by-step guide for adding a new book to the DeepLearn multi-book learning platform. This playbook was distilled from the experience of adding the MARL (Multi-Agent Reinforcement Learning) book alongside the original Deep Learning with Python book.

---

## Table of Contents

1. [Overview](#1-overview)
2. [ID Conventions](#2-id-conventions)
3. [Phase 0: Scaffold](#3-phase-0-scaffold)
4. [Phase 1: Lesson Content Files](#4-phase-1-lesson-content-files)
5. [Phase 2: Review Cards](#5-phase-2-review-cards)
6. [Phase 3: Quiz Questions](#6-phase-3-quiz-questions)
7. [Phase 4: Illustrations Pipeline](#7-phase-4-illustrations-pipeline)
8. [Phase 5: Verification Checklist](#8-phase-5-verification-checklist)
9. [Parallelization and Sub-Agent Strategy](#9-parallelization-and-sub-agent-strategy)
10. [Content Guidelines](#10-content-guidelines)
11. [Common Pitfalls](#11-common-pitfalls)

---

## 1. Overview

### What the Platform Supports

The DeepLearn platform is a multi-book mnemonic medium learning experience. Each book is a self-contained curriculum with:

- **Modules** -- high-level groupings of lessons (e.g., "Foundations", "Advanced Topics")
- **Lessons** -- ~15-minute learning units with prose sections, inline review cards, code examples, and illustrations
- **Review Cards** -- spaced-repetition cards (FSRS-powered) embedded inline within lesson prose
- **Quiz Questions** -- end-of-lesson assessments linked back to review cards for targeted re-learning
- **Illustrations** -- animated SVG React components rendered inline within lesson sections

All content is statically defined in TypeScript files. User progress (card states, lesson progress, review logs) is stored server-side in Neon PostgreSQL, scoped by `book_id`.

### Directory Structure Convention

```
src/content/
  books.ts                              # Book registry (all books)
  index.ts                              # Book-aware content API
  books/
    {book-id}/                          # One directory per book
      modules.ts                        # Module definitions
      lessons.ts                        # Lesson metadata
      review-cards.ts                   # All review cards
      quiz-questions.ts                 # All quiz questions
      illustration-map.ts              # Illustration ID -> React component mapping
      lessons/
        index.ts                        # Barrel export + lazy-loading map
        lesson-{prefix}-{M}-{L}.ts     # One file per lesson

src/components/illustrations/           # Shared directory for all SVG components
  {PascalCaseName}Diagram.tsx           # One component per illustration

src/app/books/[bookId]/                 # URL routing
  layout.tsx                            # BookProvider wrapper
  learn/page.tsx                        # Module/lesson grid
  learn/[moduleId]/[lessonId]/page.tsx  # Lesson viewer
  review/page.tsx                       # Review session
  progress/page.tsx                     # Progress dashboard
```

---

## 2. ID Conventions

All IDs must be globally unique across all books. Use a short prefix derived from the book slug (e.g., `marl` for the MARL book, no prefix for the original DL book).

| Entity | Pattern | Example |
|--------|---------|---------|
| Module ID | `{prefix}-mod-{N}` | `marl-mod-1`, `marl-mod-9` |
| Lesson ID | `{prefix}-{module}.{lesson}` | `marl-1.1`, `marl-8.10` |
| Review Card ID | `rc-{prefix}-{module}.{lesson}-{N}` | `rc-marl-1.1-1`, `rc-marl-8.10-5` |
| Quiz Question ID | `quiz-{prefix}-{module}.{lesson}-{N}` | `quiz-marl-1.1-1`, `quiz-marl-2.3-3` |
| Section ID | `{prefix}-{module}.{lesson}.{section}` | `marl-1.1.1`, `marl-1.1.3` |
| Lesson file name | `lesson-{prefix}-{M}-{L}.ts` (dots become dashes) | `lesson-marl-1-1.ts`, `lesson-marl-8-10.ts` |
| Illustration ID | kebab-case descriptive name | `mas-components`, `joint-action-explosion` |

**Important**: The DL book uses unprefixed IDs (e.g., `1.1`, `rc-1.1-1`, `mod-1`). All new books MUST use prefixed IDs to avoid collisions.

---

## 3. Phase 0: Scaffold

### Step 0a: Register the Book in `books.ts`

File: `src/content/books.ts`

Add a new entry to the `books` array:

```ts
export const books: Book[] = [
  // ... existing books ...
  {
    id: 'my-new-book',                  // URL slug -- used in routes and DB
    title: 'Full Title of the Book',
    shortTitle: 'Short Title',           // Shown in nav dropdown
    description: 'One-line description of what this book covers.',
    authors: 'Author Name(s)',
    order: 3,                            // Next sequential order number
  },
];
```

### Step 0b: Create the Directory Structure

```bash
mkdir -p src/content/books/{book-id}/lessons
```

### Step 0c: Create `modules.ts`

File: `src/content/books/{book-id}/modules.ts`

```ts
/**
 * Module definitions for {Book Title}.
 */

import type { Module } from '@/lib/db/schema';

export const modules: Module[] = [
  {
    id: '{prefix}-mod-1',
    title: 'Module One Title',
    description: 'Brief description of what this module covers.',
    order: 1,
    lessonIds: [
      '{prefix}-1.1', '{prefix}-1.2', '{prefix}-1.3',
    ],
  },
  // ... more modules ...
];
```

**Module interface** (from `src/lib/db/schema.ts`):

```ts
interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
}
```

### Step 0d: Create `lessons.ts`

File: `src/content/books/{book-id}/lessons.ts`

```ts
/**
 * Lesson definitions for {Book Title}.
 */

import type { Lesson } from '@/lib/db/schema';

export const lessons: Lesson[] = [
  {
    id: '{prefix}-1.1',
    moduleId: '{prefix}-mod-1',
    title: 'Lesson Title',
    description: 'Short description of the lesson.',
    order: 1,
    sourceSections: ['1.1'],              // Reference to source material
    prerequisites: [],                     // Lesson IDs that must come first
    learningObjectives: [
      'First objective',
      'Second objective',
      'Third objective',
    ],
    keyConcepts: [
      'Concept 1: brief definition',
      'Concept 2: brief definition',
      'Concept 3: brief definition',
    ],
    estimatedMinutes: 15,
    contentPath: 'lessons/{prefix}-1.1.mdx',
  },
  // ... more lessons ...
];
```

**Lesson interface** (from `src/lib/db/schema.ts`):

```ts
interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  sourceSections: string[];
  prerequisites: string[];
  learningObjectives: string[];
  keyConcepts: string[];
  estimatedMinutes: number;
  contentPath: string;
}
```

### Step 0e: Create `lessons/index.ts`

File: `src/content/books/{book-id}/lessons/index.ts`

This is the barrel export with lazy-loading. It must list ALL lesson IDs and build a dynamic import map.

```ts
/**
 * Barrel export for {book title} lesson content modules.
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
// All lesson IDs across all modules
// ---------------------------------------------------------------------------

export const ALL_LESSON_IDS: string[] = [
  // Module 1: Title (N lessons)
  '{prefix}-1.1', '{prefix}-1.2', '{prefix}-1.3',
  // Module 2: Title (N lessons)
  '{prefix}-2.1', '{prefix}-2.2',
  // ... etc ...
];

function buildLessonContentMap(): Record<string, Loader> {
  const map: Record<string, Loader> = {};

  for (const id of ALL_LESSON_IDS) {
    const fileName = `./lesson-${id.replace('.', '-')}`;
    map[id] = () =>
      import(
        /* webpackChunkName: "{prefix}-lesson-[request]" */ `${fileName}`
      ) as Promise<ContentModule>;
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
```

**Critical**: The `webpackChunkName` comment must include the book prefix (e.g., `"marl-lesson-[request]"`) to avoid chunk name collisions with other books. The dynamic import template string pattern `${fileName}` is required for webpack to resolve the imports at build time.

### Step 0f: Create `review-cards.ts` (Empty Shell)

File: `src/content/books/{book-id}/review-cards.ts`

```ts
import type { ReviewCard } from '@/lib/db/schema';

export const reviewCards: ReviewCard[] = [
  // Cards will be added in Phase 2
];

// Build the by-lesson lookup
export const reviewCardsByLesson: Record<string, ReviewCard[]> = {};
for (const card of reviewCards) {
  if (!reviewCardsByLesson[card.lessonId]) {
    reviewCardsByLesson[card.lessonId] = [];
  }
  reviewCardsByLesson[card.lessonId].push(card);
}
```

### Step 0g: Create `quiz-questions.ts` (Empty Shell)

File: `src/content/books/{book-id}/quiz-questions.ts`

```ts
import type { QuizQuestion } from '@/lib/db/schema';

export const quizQuestions: QuizQuestion[] = [
  // Questions will be added in Phase 3
];

// Build the by-lesson lookup
export const quizQuestionsByLesson: Record<string, QuizQuestion[]> = {};
for (const q of quizQuestions) {
  if (!quizQuestionsByLesson[q.lessonId]) {
    quizQuestionsByLesson[q.lessonId] = [];
  }
  quizQuestionsByLesson[q.lessonId].push(q);
}
```

### Step 0h: Create `illustration-map.ts` (Empty Shell)

File: `src/content/books/{book-id}/illustration-map.ts`

```ts
/**
 * Illustration map for {Book Title}.
 *
 * Maps string IDs (used in lesson content's `illustrations` arrays) to React
 * components that render the corresponding SVG diagram.
 */

import type { IllustrationMap } from '../deep-learning-python/illustration-map';

const illustrationMap: IllustrationMap = {
  // Illustrations will be added in Phase 4
};

export default illustrationMap;
```

The `IllustrationMap` type is defined in the DL book's illustration map as:

```ts
export type IllustrationMap = Record<string, ComponentType<{ className?: string }>>;
```

### Step 0i: Register in the Content Index

File: `src/content/index.ts`

Add imports and register in the content registry:

```ts
// Add these imports alongside existing book imports:
import { modules as newModules } from './books/{book-id}/modules';
import { lessons as newLessons } from './books/{book-id}/lessons';
import { reviewCardsByLesson as newReviewCardsByLesson } from './books/{book-id}/review-cards';
import { quizQuestionsByLesson as newQuizQuestionsByLesson } from './books/{book-id}/quiz-questions';
import {
  getLessonContent as newGetLessonContent,
  lessonContentMap as newLessonContentMap,
} from './books/{book-id}/lessons/index';

// Add to the contentRegistry object:
const contentRegistry: Record<string, BookContent> = {
  // ... existing entries ...
  '{book-id}': {
    modules: newModules,
    lessons: newLessons,
    reviewCardsByLesson: newReviewCardsByLesson,
    quizQuestionsByLesson: newQuizQuestionsByLesson,
    getLessonContent: newGetLessonContent,
    lessonContentMap: newLessonContentMap,
  },
};
```

### Step 0j: Register the Illustration Map Importer

File: `src/app/learn/[moduleId]/[lessonId]/page.tsx`

Add the new book to the `illustrationMapImporters` object:

```ts
const illustrationMapImporters: Record<string, () => Promise<{ default: IllustrationMap }>> = {
  'deep-learning-python': () => import('@/content/books/deep-learning-python/illustration-map'),
  'marl': () => import('@/content/books/marl/illustration-map'),
  '{book-id}': () => import('@/content/books/{book-id}/illustration-map'),
};
```

### Step 0k: Verify the Scaffold Compiles

```bash
npx tsc --noEmit
```

This should pass with zero errors before proceeding to content creation.

---

## 4. Phase 1: Lesson Content Files

Each lesson gets a single `.ts` file in the `lessons/` directory.

### File Template

File: `src/content/books/{book-id}/lessons/lesson-{prefix}-{M}-{L}.ts`

```ts
/**
 * Lesson {M}.{L}: {Lesson Title}
 *
 * Covers: {brief description of topics}
 * Source sections: {source references}
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '{prefix}-{M}.{L}',
  title: '{Lesson Title}',
  sections: [
    {
      id: '{prefix}-{M}.{L}.1',
      title: 'First Section Title',
      content: `
Your lesson prose goes here. Use **bold** for key terms on first use. Use
*italics* for emphasis. Use \`inline code\` for technical identifiers.

Math should be written as inline markdown, e.g., V(s) = E[R_t + gamma * V(s')].

Game/payoff matrices can be represented as markdown tables within the content
string (they are rendered as HTML by the lesson page parser).

- Unordered lists work like this
- Second item with **bold term**

1. Ordered lists work too
2. Second numbered item
`,
      reviewCardIds: ['rc-{prefix}-{M}.{L}-1', 'rc-{prefix}-{M}.{L}-2'],
      illustrations: ['illustration-id-here'],       // or [] if none yet
    },
    {
      id: '{prefix}-{M}.{L}.2',
      title: 'Second Section Title',
      content: `
More prose content. Aim for 300-400 words per section.
Typically 3-4 sections per lesson.
`,
      reviewCardIds: ['rc-{prefix}-{M}.{L}-3'],
      illustrations: [],
    },
    {
      id: '{prefix}-{M}.{L}.3',
      title: 'Third Section Title',
      content: `
Final section content. Include a code example if appropriate.
`,
      reviewCardIds: ['rc-{prefix}-{M}.{L}-4', 'rc-{prefix}-{M}.{L}-5'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Example: Descriptive Title',
          language: 'python',
          code: `import numpy as np

# Demonstrate the concept
result = np.array([1, 2, 3])
print(result)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- First key takeaway from this lesson.
- Second key takeaway.
- Third key takeaway.
- Fourth key takeaway.`,
};

export default lesson;
```

### Key Interfaces

The `LessonContentData` interface is defined in `src/content/books/deep-learning-python/lessons/lesson-1-1.ts` (the canonical location):

```ts
interface CodeExample {
  title: string;        // Short label above the code block
  language: string;     // "python", "bash", "json", etc.
  code: string;         // The code string (no surrounding backticks)
}

interface LessonSection {
  id: string;
  title: string;
  content: string;           // Prose content (markdown-like, parsed by the lesson page)
  reviewCardIds: string[];   // Card IDs to display after this section
  illustrations?: string[];  // Illustration IDs to render after this section
  codeExamples?: CodeExample[];  // Code blocks rendered after prose
}

interface LessonContentData {
  lessonId: string;
  title: string;
  sections: LessonSection[];
  summary: string;           // Markdown string shown at end of lesson
}
```

### Content Sizing Guidelines

- **3-4 sections per lesson**, each ~300-400 words
- Total lesson should target ~15 minutes of reading
- Each section should cover one coherent subtopic
- Bold key terms on first use: `**multi-agent system**`
- Code examples primarily in Python/PyTorch for practical modules

### Import Convention

All lesson files import `LessonContentData` from the DL book's canonical location:

```ts
import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';
```

This avoids duplicate type definitions across books.

### Parallelization Strategy

Lesson content creation can be heavily parallelized:

- Launch **one sub-agent per module** (all modules in parallel)
- Each sub-agent writes all lessons for its module sequentially
- After all sub-agents complete, verify every lesson file compiles

---

## 5. Phase 2: Review Cards

### Distribution per Lesson

Each lesson gets **5 review cards** with this distribution:

| # | Type | Bloom's Level | Purpose |
|---|------|---------------|---------|
| 1 | `recall` | `remember` | Basic fact retrieval |
| 2 | `recall` | `remember` | Second key fact |
| 3 | `concept` | `understand` | Explain "why" or "how" |
| 4 | `application` | `apply` | Use concept in a new scenario |
| 5 | `cloze` | `remember` | Fill-in-the-blank |

### ReviewCard Interface

From `src/lib/db/schema.ts`:

```ts
interface ReviewCard {
  id: string;                  // Globally unique: 'rc-{prefix}-{M}.{L}-{N}'
  lessonId: string;            // Must match a lesson ID
  prompt: string;              // The question (supports Markdown and LaTeX)
  answer: string;              // The answer (supports Markdown and LaTeX)
  type: 'recall' | 'concept' | 'application' | 'cloze';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze';
  tags: string[];              // Concept tags for filtering
  order: number;               // Display order within the lesson (1-5)
}
```

### Card Design Principles

- **No orphan prompts**: Every card must tie directly to a concept in the lesson prose
- **Expert response heuristic**: An expert should be able to answer quickly and accurately
- **Elaborative interrogation**: Prefer "Why does X work?" over "What is X?" for concept cards
- **Application cards**: Present a novel scenario requiring the concept to be applied
- **Cloze cards**: Test a single key term or phrase, not an entire sentence recall
- **Tags**: Use kebab-case tags from the lesson's key concepts (e.g., `'nash-equilibrium'`, `'policy-gradient'`)

### Example Review Cards

```ts
// recall / remember
{
  id: 'rc-marl-1.1-1',
  lessonId: 'marl-1.1',
  prompt: 'What are the three basic components of a multi-agent system?',
  answer: 'A multi-agent system consists of an **environment**, multiple decision-making **agents**, and their **goals**.',
  type: 'recall',
  bloomLevel: 'remember',
  tags: ['multi-agent-systems', 'components', 'environment'],
  order: 1,
},

// concept / understand
{
  id: 'rc-marl-1.1-3',
  lessonId: 'marl-1.1',
  prompt: 'Why do multi-agent environments often involve agents with limited and imperfect views?',
  answer: 'Multi-agent environments are often characterized by **partial observability**, meaning individual agents may only observe some partial information about the state. This forces agents to make decisions under **uncertainty**.',
  type: 'concept',
  bloomLevel: 'understand',
  tags: ['partial-observability', 'observations', 'uncertainty'],
  order: 3,
},

// application / apply
{
  id: 'rc-marl-1.1-4',
  lessonId: 'marl-1.1',
  prompt: 'Robot A (level 2) and Robot B (level 1) are adjacent to a level-3 item. Can they collect it? What if only Robot A is adjacent?',
  answer: 'Yes, Robots A and B can collect it (2+1=3 meets the threshold). Robot A alone cannot (2 < 3). This demonstrates the need for **multi-agent coordination**.',
  type: 'application',
  bloomLevel: 'apply',
  tags: ['level-based-foraging', 'coordination'],
  order: 4,
},

// cloze / remember
{
  id: 'rc-marl-1.1-5',
  lessonId: 'marl-1.1',
  prompt: 'The _____ characteristic of a multi-agent system is that agents must coordinate their actions with (or against) each other.',
  answer: '**defining**',
  type: 'cloze',
  bloomLevel: 'remember',
  tags: ['multi-agent-systems', 'coordination'],
  order: 5,
},
```

### File Structure

File: `src/content/books/{book-id}/review-cards.ts`

```ts
import type { ReviewCard } from '@/lib/db/schema';

export const reviewCards: ReviewCard[] = [
  // ============================================================
  // Module 1: {Module Title}
  // ============================================================

  // --- Lesson {prefix}-1.1: {Lesson Title} ---
  { id: 'rc-{prefix}-1.1-1', lessonId: '{prefix}-1.1', prompt: '...', answer: '...', type: 'recall', bloomLevel: 'remember', tags: [...], order: 1 },
  { id: 'rc-{prefix}-1.1-2', lessonId: '{prefix}-1.1', prompt: '...', answer: '...', type: 'recall', bloomLevel: 'remember', tags: [...], order: 2 },
  { id: 'rc-{prefix}-1.1-3', lessonId: '{prefix}-1.1', prompt: '...', answer: '...', type: 'concept', bloomLevel: 'understand', tags: [...], order: 3 },
  { id: 'rc-{prefix}-1.1-4', lessonId: '{prefix}-1.1', prompt: '...', answer: '...', type: 'application', bloomLevel: 'apply', tags: [...], order: 4 },
  { id: 'rc-{prefix}-1.1-5', lessonId: '{prefix}-1.1', prompt: '...', answer: '...', type: 'cloze', bloomLevel: 'remember', tags: [...], order: 5 },

  // --- Lesson {prefix}-1.2: ... ---
  // ... continue for all lessons ...
];

// Build the by-lesson lookup
export const reviewCardsByLesson: Record<string, ReviewCard[]> = {};
for (const card of reviewCards) {
  if (!reviewCardsByLesson[card.lessonId]) {
    reviewCardsByLesson[card.lessonId] = [];
  }
  reviewCardsByLesson[card.lessonId].push(card);
}
```

### Parallelization and Assembly

1. **Batch by module groups**: Each sub-agent writes cards for one module's worth of lessons
2. **Write to scratchpad files**: e.g., `_scratch/review-cards-mod-1.ts`, `_scratch/review-cards-mod-2.ts`
3. **Assembly**: Concatenate all scratchpad files with proper imports/exports wrapper

Assembly via bash:

```bash
# Start with the import header
echo "import type { ReviewCard } from '@/lib/db/schema';" > review-cards.ts
echo "" >> review-cards.ts
echo "export const reviewCards: ReviewCard[] = [" >> review-cards.ts

# Concatenate each module's cards (strip their own import/export wrappers)
for f in _scratch/review-cards-mod-*.ts; do
  # Extract just the card objects
  cat "$f" >> review-cards.ts
done

# Close the array and add the by-lesson lookup
echo "];" >> review-cards.ts
echo "" >> review-cards.ts
cat >> review-cards.ts << 'EOF'
export const reviewCardsByLesson: Record<string, ReviewCard[]> = {};
for (const card of reviewCards) {
  if (!reviewCardsByLesson[card.lessonId]) {
    reviewCardsByLesson[card.lessonId] = [];
  }
  reviewCardsByLesson[card.lessonId].push(card);
}
EOF
```

**Note**: Assembly agents can be slow. Manual assembly via bash concatenation is more reliable. Always verify the assembled file compiles with `npx tsc --noEmit` after assembly.

---

## 6. Phase 3: Quiz Questions

### Distribution per Lesson

Each lesson gets **3 quiz questions** with this distribution:

| # | Type | Format |
|---|------|--------|
| 1 | `multiple-choice` | 4 options, 1 correct |
| 2 | `true-false` | 2 options: True / False |
| 3 | `fill-blank` | Single word or short phrase |

### QuizQuestion Interface

From `src/lib/db/schema.ts`:

```ts
interface QuizQuestion {
  id: string;                    // 'quiz-{prefix}-{M}.{L}-{N}'
  lessonId: string;
  question: string;              // The question text
  type: 'multiple-choice' | 'fill-blank' | 'true-false';
  options?: string[];            // Required for multiple-choice and true-false
  correctAnswer: string;         // Must match one of options (for MC) or be exact (for fill-blank)
  explanation: string;           // Shown after answering
  relatedCardIds: string[];      // Review card IDs to resurface on wrong answers
  order: number;                 // 1, 2, or 3
}
```

### Example Quiz Questions

```ts
// multiple-choice
{
  id: 'quiz-marl-1.1-1',
  lessonId: 'marl-1.1',
  question: 'What are the three basic components of a multi-agent system?',
  type: 'multiple-choice',
  options: [
    'Environment, agents, and goals',
    'States, actions, and rewards',
    'Policies, value functions, and episodes',
    'Observations, transitions, and terminal states',
  ],
  correctAnswer: 'Environment, agents, and goals',
  explanation: 'A multi-agent system consists of an environment, multiple decision-making agents, and their goals.',
  relatedCardIds: ['rc-marl-1.1-1'],
  order: 1,
},

// true-false
{
  id: 'quiz-marl-1.1-2',
  lessonId: 'marl-1.1',
  question: 'Individual agents always have a complete and perfect view of the entire environment state.',
  type: 'true-false',
  options: ['True', 'False'],
  correctAnswer: 'False',
  explanation: 'Multi-agent environments are often characterized by partial observability.',
  relatedCardIds: ['rc-marl-1.1-2'],
  order: 2,
},

// fill-blank
{
  id: 'quiz-marl-1.1-3',
  lessonId: 'marl-1.1',
  question: 'In MARL, goals are defined by _____ functions.',
  type: 'fill-blank',
  correctAnswer: 'reward',
  explanation: 'Reward functions specify scalar signals agents receive.',
  relatedCardIds: ['rc-marl-1.1-3'],
  order: 3,
},
```

### Key Linking Rule

Every `relatedCardIds` entry must reference a review card ID from the same lesson. This enables targeted re-learning: when a learner answers a quiz question incorrectly, the linked review cards are surfaced for re-study.

### File Structure

File: `src/content/books/{book-id}/quiz-questions.ts`

```ts
import type { QuizQuestion } from '@/lib/db/schema';

export const quizQuestions: QuizQuestion[] = [
  // ============================================================
  // MODULE 1: {Module Title}
  // ============================================================

  // --- Lesson {prefix}-1.1: {Lesson Title} ---
  {
    id: 'quiz-{prefix}-1.1-1',
    lessonId: '{prefix}-1.1',
    question: '...',
    type: 'multiple-choice',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 'Option A',
    explanation: '...',
    relatedCardIds: ['rc-{prefix}-1.1-1'],
    order: 1,
  },
  // ... 2 more per lesson, then next lesson ...
];

// Build the by-lesson lookup
export const quizQuestionsByLesson: Record<string, QuizQuestion[]> = {};
for (const q of quizQuestions) {
  if (!quizQuestionsByLesson[q.lessonId]) {
    quizQuestionsByLesson[q.lessonId] = [];
  }
  quizQuestionsByLesson[q.lessonId].push(q);
}
```

### Parallelization

Same pattern as review cards: batch by module groups, write to scratchpad files, assemble.

---

## 7. Phase 4: Illustrations Pipeline

Illustrations are animated SVG React components rendered inline within lesson sections. This is the most complex and error-prone phase.

### 7a: Plan

Decide which lesson sections need diagrams. Target approximately **2 illustrations per lesson** on average (some lessons may have 0-1, others may have 3-4). Prioritize:

- Abstract concepts that benefit from visual representation
- Process flows and architectures
- Comparison/contrast diagrams
- Data structures and mathematical relationships

### 7b: Create -- Component Template

File: `src/components/illustrations/{PascalCaseName}Diagram.tsx`

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface {PascalCaseName}DiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function {PascalCaseName}Diagram({ className = '' }: {PascalCaseName}DiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 300"
      className={className}
      role="img"
      aria-label="Descriptive label for accessibility"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* IMPORTANT: Prefix marker IDs with the diagram name to avoid collisions */}
        <marker
          id="arrowhead-{diagram-name}"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* First element group - entrance animation */}
      <motion.g
        initial={{ opacity: 0, y: -15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="100"
          y="50"
          width="180"
          height="80"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x="190"
          y="95"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          Label Text
        </text>
      </motion.g>

      {/* Second element group - staggered delay */}
      <motion.g
        initial={{ opacity: 0, x: -15 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
        transition={{ duration: 0.6, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        {/* ... more SVG elements ... */}
      </motion.g>

      {/* Connecting lines - appear after boxes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="195"
          y1="130"
          x2="195"
          y2="200"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-{diagram-name})"
        />
      </motion.g>
    </svg>
  );
}
```

### Mandatory Component Requirements

Every illustration component MUST follow these rules:

1. **`'use client'`** directive at the top of the file
2. **`useRef`** + **`useInView`** from framer-motion for scroll-triggered entrance
3. **`PRODUCTIVE_EASE`** constant: `[0.2, 0, 0.38, 0.9]`
4. **CSS custom properties for ALL colors** -- never hardcode hex/rgb values:
   - `var(--color-accent)` -- primary accent color
   - `var(--color-text-primary)` -- main text
   - `var(--color-text-secondary)` -- secondary text
   - `var(--color-text-tertiary)` -- tertiary/muted text
   - `var(--color-bg-elevated)` -- elevated background
   - `var(--color-bg-tertiary)` -- tertiary background
   - `var(--color-border-primary)` -- primary border
   - `var(--color-accent-subtle)` -- subtle accent background
5. **Responsive SVG**: `viewBox` attribute + `style={{ width: '100%', height: 'auto' }}`
6. **Accessibility**: `role="img"` + descriptive `aria-label`
7. **`className` prop passthrough** on the `<svg>` element
8. **Unique marker IDs**: Prefix all `<marker>`, `<filter>`, `<linearGradient>` IDs with the diagram name (e.g., `arrowhead-mas`, `arrowhead-marl-loop`). Multiple diagrams can appear on the same page, and SVG `id` attributes are global to the document.
9. **Staggered animations gated on `isInView`**: Use incrementing `delay` values (0, 0.2, 0.4, 0.7, etc.)
10. **`animate` fallbacks must match `initial` state**: When `isInView` is false, the `animate` prop should repeat the `initial` values (not empty objects `{}`). Example: `animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}`
11. **Font sizes**: Minimum 9px for any text; 13px+ for primary labels
12. **`fontFamily: 'var(--font-sans)'`** on the SVG element style

### 7c: Verify -- Wire Up

After creating illustration components:

1. **Import the component** in `illustration-map.ts`:

```ts
import MyNewDiagram from '@/components/illustrations/MyNewDiagram';

const illustrationMap: IllustrationMap = {
  // ... existing entries ...
  'my-new-diagram': MyNewDiagram,
};
```

2. **Add the illustration ID** to the relevant lesson section's `illustrations` array:

```ts
{
  id: '{prefix}-1.1.1',
  title: 'Section Title',
  content: `...`,
  reviewCardIds: ['...'],
  illustrations: ['my-new-diagram'],   // <-- Add here
},
```

3. **Run TypeScript check**:

```bash
npx tsc --noEmit
```

### 7d: Critique -- Ruthless Review

After all illustrations for a module are created, run a critique pass. Check every illustration against this issues checklist:

- [ ] **Overlapping text**: Labels colliding with each other or diagram elements
- [ ] **Font size too small**: Any text smaller than 9px
- [ ] **ViewBox clipping**: Content extending beyond the SVG viewBox bounds
- [ ] **Hardcoded colors**: Any hex/rgb values instead of CSS variables
- [ ] **Animation duration too long**: Total entrance animation sequence exceeds 2 seconds
- [ ] **Missing `animate` fallback**: `animate` prop uses `{}` instead of repeating `initial` values
- [ ] **Non-unique marker IDs**: Marker/filter/gradient IDs that could collide with other diagrams
- [ ] **Missing `aria-label`**: No accessibility description
- [ ] **Missing `className` passthrough**: Cannot receive external styling
- [ ] **Uneven spacing**: Visually unbalanced layout
- [ ] **Dark mode breakage**: Colors that look wrong against dark backgrounds

### 7e: Polish

Apply fixes from the critique in parallel (one sub-agent per illustration or batch of illustrations). Then re-verify with TypeScript and visual inspection.

### Recommended Workflow

Iterate **per module** to prove the illustrations pipeline before scaling to all modules:

1. Create all illustrations for Module 1
2. Wire them up, verify, critique, polish
3. Once the pipeline is proven, scale to remaining modules in parallel

---

## 8. Phase 5: Verification Checklist

### Build Verification

```bash
npx tsc --noEmit      # TypeScript type checking
npx next build         # Full Next.js production build
```

### Cross-Reference Integrity Checks

Run these checks (manually or via script) to ensure all content is properly linked:

**1. Every `reviewCardIds` in lesson content exists in `review-cards.ts`**

For each lesson content file, extract all `reviewCardIds` and verify they exist in the `reviewCards` array.

**2. Every `relatedCardIds` in quiz questions exists in `review-cards.ts`**

For each quiz question, verify all `relatedCardIds` point to existing review cards.

**3. Every lesson ID in `lessons.ts` has a matching file in `lessons/`**

Every entry in the lessons array must have a corresponding `lesson-{prefix}-{M}-{L}.ts` file.

**4. Every lesson ID appears in `ALL_LESSON_IDS`**

The `ALL_LESSON_IDS` array in `lessons/index.ts` must contain every lesson ID from `lessons.ts`.

**5. Module `lessonIds` arrays match**

Every lesson ID referenced in a module's `lessonIds` array must exist in `lessons.ts`, and vice versa.

**6. Illustration IDs match**

Every illustration ID referenced in a lesson section's `illustrations` array must exist in `illustration-map.ts`.

### ID Uniqueness

- No duplicate IDs within any single file
- No ID collisions between books (prefixed IDs prevent this)

### Count Verification

| Check | Expected |
|-------|----------|
| Total lessons | Sum of all module `lessonIds` arrays |
| Review cards per lesson | 5 |
| Quiz questions per lesson | 3 |
| Total review cards | lessons * 5 |
| Total quiz questions | lessons * 3 |

---

## 9. Parallelization and Sub-Agent Strategy

### What Can Run in Parallel

| Phase | Parallelism | Notes |
|-------|-------------|-------|
| Phase 0: Scaffold | Sequential | Must complete before content phases |
| Phase 1: Lesson content | **All modules in parallel** | One sub-agent per module |
| Phase 2: Review cards | **All modules in parallel** | Can run alongside Phase 1 if lesson content is known |
| Phase 3: Quiz questions | **All modules in parallel** | Depends on review card IDs being finalized |
| Phase 4: Illustrations | **All illustrations in parallel** | Depends on lesson sections being finalized |
| Phase 5: Verification | Sequential | Must run after all content is complete |

### Recommended Batching

For a book with ~65 lessons across 9 modules:

- **Lesson content**: 9 parallel sub-agents (one per module)
- **Review cards**: 3-4 batches of 2-3 modules each
- **Quiz questions**: Same batching as review cards
- **Illustrations**: 5-10 parallel sub-agents (batches of ~10-15 diagrams)

### Scratchpad File Pattern

Use a `_scratch/` directory (gitignored) for intermediate outputs:

```
_scratch/
  lessons-mod-1/          # Sub-agent writes lesson files here
  lessons-mod-2/
  review-cards-mod-1.ts   # Raw card data (no import/export wrapper)
  review-cards-mod-2.ts
  quiz-mod-1.ts
  quiz-mod-2.ts
```

### Assembly Pattern

After all sub-agents complete their scratchpad files:

1. **Lessons**: Move/copy from `_scratch/lessons-mod-N/` to `src/content/books/{book-id}/lessons/`
2. **Review cards**: Concatenate scratchpad files with imports/exports wrapper into `review-cards.ts`
3. **Quiz questions**: Same concatenation pattern into `quiz-questions.ts`
4. **Verify**: Run `npx tsc --noEmit` after each assembly step

### Background vs Foreground Agents

- Use **background agents** for independent content creation tasks (lesson writing, card writing)
- Use **foreground agents** for tasks that need interactive verification (illustration critique, final assembly)
- Always verify assembled output with TypeScript after background agents complete

---

## 10. Content Guidelines

### Tone and Style

- **Conversational and accessible**: Write as if explaining to a motivated student
- **Mathematically rigorous**: Do not sacrifice accuracy for simplicity
- **Concrete before abstract**: Start with examples, then generalize
- Use the direct second person: "you", "your"

### Formatting Conventions

- **Bold key terms on first use**: `**multi-agent system** (MAS)`
- **Inline math as markdown**: `V(s) = E[R_t + gamma * V(s')]`
- **Game/payoff matrices as markdown tables**: Rendered as HTML tables by the content parser
- **Code in backticks**: `Q-learning`, `np.array`
- **Lists for enumerated concepts**: Use `- ` for unordered, `1. ` for ordered

### Code Examples

- **Language**: Python/PyTorch primarily (for practical/implementation modules)
- **Keep examples short**: 5-15 lines, focused on one concept
- **Include comments**: Explain the "why", not just the "what"
- **Runnable**: Code should be correct and executable

### Running Examples

Use a consistent running example throughout the book (similar to how the MARL book uses Level-Based Foraging). This provides continuity and helps learners build mental models incrementally.

### Prerequisites Graph

Prerequisites should form a **valid directed acyclic graph (DAG)**:

- No circular dependencies
- Lesson X cannot be a prerequisite of itself
- If A requires B and B requires C, A implicitly requires C (but explicit listing is fine)

### Mnemonic Medium Principles

- **No orphan prompts**: Every review card must tie directly to content in the lesson prose
- **Interleave card placement**: Cards appear after the section that teaches the concept, not all at the end
- **Mix Bloom's levels**: Dont over-index on recall; include understanding and application
- **Progressive disclosure**: Simple concepts first, build to complex ones

---

## 11. Common Pitfalls

### Dynamic Imports and Webpack

The `lessonContentMap` uses dynamic imports with webpack chunk names. The pattern:

```ts
const fileName = `./lesson-${id.replace('.', '-')}`;
map[id] = () =>
  import(/* webpackChunkName: "{prefix}-lesson-[request]" */ `${fileName}`) as Promise<ContentModule>;
```

The `webpackChunkName` comment is essential for proper code splitting. Without it, all lessons may be bundled into a single chunk.

### Scratchpad File Paths

When using `_scratch/` directories for intermediate outputs, be careful with path conventions:

- Use hyphens in directory names: `_scratch/lessons-mod-1/` (not `lessons_mod_1`)
- Sub-agents may write files at different relative paths depending on their working directory
- Always use absolute paths when referencing scratchpad files across agents

### Assembly Agent Reliability

Assembly agents (that combine scratchpad files into final output) can be slow or unreliable. Prefer:

- **Manual bash concatenation** for combining review cards and quiz questions
- **Direct file copy** for lesson files
- **Always verify** assembled output with `npx tsc --noEmit`

### Illustration Marker ID Collisions

SVG `id` attributes are global to the HTML document. If two diagrams on the same page both define `<marker id="arrowhead">`, only one will render correctly. Always prefix marker/filter/gradient IDs with the diagram name:

```xml
<!-- BAD -->
<marker id="arrowhead">

<!-- GOOD -->
<marker id="arrowhead-mas-components">
```

### Animation Fallback States

When `isInView` is false, the `animate` prop must explicitly repeat the `initial` state values:

```tsx
// BAD - empty object fallback causes elements to snap to default position
animate={isInView ? { opacity: 1, y: 0 } : {}}

// GOOD - repeats initial state when not in view
animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
```

### Animation Duration

Keep the total entrance animation sequence under **2 seconds**. With staggered delays, the last element should finish animating within 2s of the diagram entering the viewport. Beyond that, users may scroll past before the animation completes.

### Font Size Minimums

All text in SVG illustrations must be at least **9px** for mobile readability. Primary labels should be **13px+**. Subtitle/helper text can be 9-11px.

### The `illustration-map.ts` Import

All illustration components are imported eagerly in the illustration map (not lazy-loaded). This means:

- Keep illustration components reasonably sized
- The illustration map is lazy-loaded per-book by the lesson page (`useIllustrationMap` hook)
- Adding a new book requires adding an entry to `illustrationMapImporters` in the lesson page

### Database Schema

The database includes a `book_id` column on `lesson_progress`, `user_card_states`, and `review_logs` tables. The default value is `'deep-learning-python'`. No database migration is needed when adding a new book -- the content API and hooks automatically pass the correct `book_id` for queries.

### TypeScript Canonical Type Locations

- `LessonContentData`, `LessonSection`, `CodeExample` are defined in `src/content/books/deep-learning-python/lessons/lesson-1-1.ts`
- `Module`, `Lesson`, `ReviewCard`, `QuizQuestion`, `UserCardState`, `ReviewLog`, `UserLessonProgress` are defined in `src/lib/db/schema.ts`
- `IllustrationMap` is defined in `src/content/books/deep-learning-python/illustration-map.ts`
- All new books should import from these canonical locations, not redefine the types

---

## Quick Reference: File Checklist for a New Book

- [ ] `src/content/books.ts` -- Add book entry
- [ ] `src/content/index.ts` -- Add imports and registry entry
- [ ] `src/content/books/{book-id}/modules.ts` -- Module definitions
- [ ] `src/content/books/{book-id}/lessons.ts` -- Lesson metadata
- [ ] `src/content/books/{book-id}/lessons/index.ts` -- Barrel export with lazy-loading
- [ ] `src/content/books/{book-id}/lessons/lesson-{prefix}-{M}-{L}.ts` -- One per lesson
- [ ] `src/content/books/{book-id}/review-cards.ts` -- All review cards + by-lesson lookup
- [ ] `src/content/books/{book-id}/quiz-questions.ts` -- All quiz questions + by-lesson lookup
- [ ] `src/content/books/{book-id}/illustration-map.ts` -- Illustration ID-to-component mapping
- [ ] `src/components/illustrations/{Name}Diagram.tsx` -- One per illustration
- [ ] `src/app/learn/[moduleId]/[lessonId]/page.tsx` -- Add to `illustrationMapImporters`
- [ ] `npx tsc --noEmit` -- Passes
- [ ] `npx next build` -- Passes
