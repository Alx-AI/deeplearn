# Plan: Multi-Book Support + MARL Book Content Creation

## Overview

Two major workstreams:
1. **Architecture** - Add multi-book support with a source dropdown so users can switch between books
2. **Content** - Analyze the MARL book and create a full mnemonic-medium learning experience (modules, lessons, review cards, quizzes, 100+ illustrations)

Plus: save a reusable **New Book Playbook** markdown file for future book additions.

---

## Part 1: Multi-Book Architecture

### 1A. Content File Restructuring

**Move existing DL content into a book-scoped folder:**

```
src/content/
  books.ts                          (NEW - book registry)
  index.ts                          (MODIFIED - book-aware API)
  books/
    deep-learning-python/
      modules.ts                    (moved from src/content/modules.ts)
      lessons.ts                    (moved from src/content/lessons.ts)
      review-cards.ts               (moved)
      quiz-questions.ts             (moved)
      illustration-map.ts           (NEW - extracted from lesson page)
      lessons/
        index.ts                    (moved)
        lesson-1-1.ts ... lesson-7-6.ts  (moved)
    marl/
      modules.ts                    (NEW)
      lessons.ts                    (NEW)
      review-cards.ts               (NEW)
      quiz-questions.ts             (NEW)
      illustration-map.ts           (NEW)
      lessons/
        index.ts                    (NEW)
        lesson-1-1.ts ...           (NEW - created by content pipeline)
```

**New file `src/content/books.ts`:**
```ts
export interface Book {
  id: string;          // URL slug: "deep-learning-python" | "marl"
  title: string;
  shortTitle: string;
  description: string;
  authors: string;
  order: number;
}

export const books: Book[] = [
  { id: 'deep-learning-python', title: 'Deep Learning with Python, 3rd Ed.', shortTitle: 'Deep Learning', ... },
  { id: 'marl', title: 'Multi-Agent Reinforcement Learning', shortTitle: 'Multi-Agent RL', ... },
];
```

### 1B. Content API Changes

**File: `src/content/index.ts`**

All exported functions gain a `bookId` parameter as their first argument:

| Current | New |
|---------|-----|
| `getModule(moduleId)` | `getModule(bookId, moduleId)` |
| `getLesson(lessonId)` | `getLesson(bookId, lessonId)` |
| `getLessonsForModule(moduleId)` | `getLessonsForModule(bookId, moduleId)` |
| `getCardsForLesson(lessonId)` | `getCardsForLesson(bookId, lessonId)` |
| `getQuizForLesson(lessonId)` | `getQuizForLesson(bookId, lessonId)` |
| `getLessonContent(lessonId)` | `getLessonContent(bookId, lessonId)` |

Internally: a `contentRegistry` object keyed by bookId holds each book's modules/lessons/cards/quizzes arrays.

Card IDs: existing DL book keeps current IDs (`rc-1.1-1`). MARL uses prefixed IDs (`rc-marl-1.1-1`). No data migration needed.

### 1C. URL Routing Changes

| Current | New |
|---------|-----|
| `/learn` | `/books/[bookId]/learn` |
| `/learn/[moduleId]/[lessonId]` | `/books/[bookId]/learn/[moduleId]/[lessonId]` |
| `/review` | `/books/[bookId]/review` |
| `/progress` | `/books/[bookId]/progress` |
| `/settings` | `/settings` (stays global) |

**New files:**
- `src/app/books/[bookId]/layout.tsx` - validates bookId, wraps children in `BookProvider`
- Move existing page components into `/books/[bookId]/` subtree
- Add redirects: `/learn` -> `/books/deep-learning-python/learn` etc.

**New context: `src/components/providers/BookProvider.tsx`**
- Provides `useBookId()` hook to all descendant components
- Book ID is always derived from the URL `[bookId]` param

### 1D. NavHeader Book Dropdown

**File: `src/components/navigation/NavHeader.tsx`**

Add a book selector dropdown between the logo and nav links:
- Shows current book's `shortTitle` with a chevron icon
- Dropdown lists all books
- Selecting a book navigates to `/books/[newBookId]/learn`
- Mobile: appears in the mobile dropdown menu
- Nav link hrefs become: `/books/${bookId}/learn`, `/books/${bookId}/review`, etc.

### 1E. Home Page Transformation

**File: `src/app/page.tsx`**

Transform from single-book module grid into a **book selector**:
- Grid of book cards (title, author, module count, overall mastery %)
- "Continue Learning" CTA linking to the last-accessed book
- Each card links to `/books/[bookId]/learn`

### 1F. Database Schema Changes

Add `book_id TEXT NOT NULL DEFAULT 'deep-learning-python'` to three tables:

1. **`lesson_progress`** - add `book_id`, update unique constraint to `(user_id, book_id, lesson_id)`
2. **`user_card_states`** - add `book_id`, update PK to `(user_id, book_id, card_id)`
3. **`review_logs`** - add `book_id`, add index on `(user_id, book_id)`

All existing rows automatically get `'deep-learning-python'` via DEFAULT. No data migration.

### 1G. API Routes & Hooks

- All API routes accept `bookId` query parameter, include in SQL WHERE clauses
- All SWR hooks in `src/lib/db/hooks.ts` include `bookId` in cache keys
- `api-client.ts` functions pass `bookId` through
- SRS engine itself is unchanged (operates on individual cards)

### 1H. Illustration Map Extraction

The hardcoded `illustrationMap` in the lesson page component gets extracted into per-book files:
- `src/content/books/deep-learning-python/illustration-map.ts`
- `src/content/books/marl/illustration-map.ts`

The lesson page dynamically imports the right map based on `bookId`.

---

## Part 2: MARL Content Creation Pipeline

### Phase 0: Source Extraction & Chunking

**Works for both PDF and EPUB sources:**

1. **Detect format** - PDF vs EPUB (existing `extract_epub.py` handles EPUB)
2. **Extract to markdown** - Convert source into per-chapter markdown files stored in a `book-content/` directory
3. **Chunk into sections** - Break each chapter into logical sections (by headings, topic boundaries)
4. **Create a chapter map** - JSON/markdown file listing every chapter and section with page ranges
5. **Identify figures/equations** - Note which sections have figures, equations, code that need special visual treatment

The MARL book (Albrecht, Christianos, Schafer - MIT Press 2024) covers:
- Part 1: Foundations (RL, game theory, solution concepts, intro MARL)
- Part 2: Modern Approaches (deep learning for MARL, deep RL, multi-agent deep RL, applications)

### Phase 1: Curriculum Design (Sequential)

**Run 1 subagent** to design the full curriculum after reading the extracted book content:

- Proposed module structure (~6-8 modules)
- Lesson breakdown (~50-70 lessons, ~15 min each)
- Prerequisites graph
- Where to use interleaving (mix game theory + RL concepts)
- Where to use progressive disclosure (simple 2-player -> n-player -> deep MARL)
- Learning objectives per lesson
- Key concepts per lesson (3-4, Miller's Law)

**Pedagogy principles to apply:**
- **Concrete -> Abstract**: Start with Prisoner's Dilemma, Rock-Paper-Scissors before Nash equilibrium math
- **Progressive Disclosure**: Single-agent RL first, then 2-agent, then n-agent
- **Interleaving**: Mix theory sections with application sections
- **Elaborative Interrogation**: "Why" and "How" prompts, not just "What"
- **Dual Coding**: Every abstract concept MUST have a corresponding visual

### Phase 2: Per-Section Content Pipeline (Multi-Agent Assembly Line)

For each lesson, run a multi-stage agent pipeline. Lessons within a module can run in parallel (up to 3 concurrent). Each lesson goes through these stages:

**Stage 1 - Section Planner Agent:**
- Receives: extracted book chunk, curriculum design, learning objectives
- Produces: detailed section plan (what to cover, in what order, what visuals, what review cards, what code examples)
- Determines the narrative arc for the section

**Stage 2 - Content Drafter Agent:**
- Receives: section plan + original book text
- Produces: full prose draft for each section in the lesson
- Writes in mnemonic medium style (engaging, clear, concrete-first)
- Embeds placeholder markers for illustrations and review cards
- Writes code examples with explanations

**Stage 3 - Content Critic Agent:**
- Receives: drafted content + original book text + pedagogy guidelines
- Reviews for:
  - Technical accuracy (does it match the source material?)
  - Pedagogical quality (progressive disclosure? concrete examples?)
  - Clarity (would a student understand this without the textbook?)
  - Mnemonic medium principles (are review cards well-placed? not orphaned?)
  - Completeness (all key concepts covered?)
- Produces: specific, actionable feedback with line-level suggestions

**Stage 4 - Content Refiner Agent:**
- Receives: draft + critic's feedback
- Produces: polished final content
- Generates the complete `lesson-X-Y.ts` file in the correct TypeScript format

**Stage 5 - Review Card & Quiz Agent:**
- Receives: final lesson content
- Produces: review cards (4-6 per lesson) and quiz questions (3-4 per lesson)
- **Review card design rules:**
  - Mix Bloom's levels: remember (30%), understand (30%), apply (25%), analyze (15%)
  - Mix types: recall, concept, application, cloze
  - Both "what" and "why/how" questions (elaborative interrogation)
  - No orphan prompts - every card ties to the narrative
  - Application prompts that ask students to use concepts in new contexts
- **Quiz question design rules:**
  - Multiple choice, true/false, fill-blank mix
  - Each question links to related review cards for re-learning on wrong answers
  - Explanations for all answers

### Phase 2B: Per-Section Code Snippet Pipeline

For lessons with code examples, run a parallel code-focused pipeline:

**Code Stage 1 - Code Planner Agent:**
- Decides what code to show, in what language (Python)
- Determines if it's a standalone snippet, a build-on-previous example, or an interactive exercise
- Specifies inputs, expected outputs, key concepts demonstrated

**Code Stage 2 - Code Drafter Agent:**
- Writes the actual code with clear comments
- Ensures code is correct and runnable
- Follows consistent style (imports, variable naming, etc.)

**Code Stage 3 - Code Reviewer Agent:**
- Verifies correctness (would this actually run?)
- Checks for best practices, clarity, appropriate complexity level
- Ensures comments explain the "why" not just the "what"

**Code Stage 4 - Code Polisher Agent:**
- Applies feedback, produces final code blocks
- Formats for the CodeExample TypeScript interface

### Phase 3: Visual Creation (Parallel Subagents - CRITICAL)

This is the most important phase. **Run dedicated illustration subagents** - separate from content authoring.

**SVG Quality Protocol (lessons learned from DL book):**

Common SVG failure modes to prevent:
1. **Text overlaps** - Labels colliding with each other or diagram elements
2. **Viewport clipping** - Content extending beyond the SVG viewBox
3. **Missing responsive behavior** - Not using viewBox + 100% width
4. **Dark mode breakage** - Hardcoded colors instead of CSS variables
5. **Animation jank** - Too many simultaneous animations, wrong transform origins
6. **Spacing/alignment** - Uneven spacing, off-center elements
7. **Font rendering** - Missing fontFamily, wrong sizes for readability

**Four-stage illustration pipeline per diagram:**

**Stage A - Design Subagent** (1 per module, parallel):
- Takes the illustration specification from Phase 2
- Designs the visual: what shapes, labels, colors, layout, animations
- Outputs a detailed SVG design spec (viewBox dimensions, element positions, colors, animation sequences)
- Specifies exact label positions to prevent overlaps

**Stage B - Implementation Subagent** (1 per diagram, highly parallel):
- Takes the design spec
- Writes the React + Framer Motion SVG component
- Must follow the established pattern:
  - `useRef` + `useInView` for scroll-triggered entrance
  - CSS variables: `var(--color-accent)`, `var(--color-text-secondary)`, etc.
  - `viewBox` with `width: 100%`, `height: auto`
  - `role="img"` with `aria-label`
  - Framer Motion `motion.*` elements with staggered delays
  - Proper `className` prop passthrough

**Stage C - Code Validation Subagent** (1 per batch of ~5 diagrams):
- Reviews the implemented SVG component code for:
  - Text collision detection (checks label positions against element positions)
  - ViewBox bounds (all elements within viewBox)
  - Color variable usage (no hardcoded colors)
  - Animation timing (no overlapping entrance animations)
  - Responsive behavior
  - Dark mode compatibility
  - Accessibility (aria-label, role)
- Reports issues, sends failures back to Stage B for regeneration

**Stage D - Screenshot Visual Verification** (after Stage C passes):
- Render each diagram in a test harness (dev server or Storybook-style page)
- Take screenshots of each illustration in both light and dark mode
- Visual review subagent examines screenshots for:
  - Actual text overlaps/clipping that code analysis missed
  - Visual balance and spacing
  - Readability of labels at rendered size
  - Animation smoothness (check initial/final states)
  - Color contrast and legibility
  - Overall aesthetic quality
- Any failures go back to Stage B with specific visual feedback
- This is the final quality gate before illustrations ship

**Estimated illustration count for MARL book: ~80-120 diagrams:**
- Game matrices (payoff tables) ~10
- Nash equilibrium visualizations ~8
- RL diagrams (agent-environment loops, MDPs, policy/value) ~15
- Multi-agent interaction diagrams ~15
- Deep learning architecture diagrams ~10
- Algorithm flow diagrams ~15
- Environment visualizations (grid worlds, Pommerman-style) ~10
- Comparison/contrast diagrams ~10
- Math concept visualizations (gradients, objectives, convergence) ~10

### Phase 4: Integration & Assembly

1. Wire all lesson content files into `src/content/books/marl/lessons/index.ts`
2. Wire all review cards into `src/content/books/marl/review-cards.ts`
3. Wire all quiz questions into `src/content/books/marl/quiz-questions.ts`
4. Register all illustrations in `src/content/books/marl/illustration-map.ts`
5. Add illustration components to `src/components/illustrations/` (shared directory)

### Phase 5: Quality Assurance

1. **Build test** - `npm run build` passes with no errors
2. **Visual review** - Navigate every lesson, verify illustrations render correctly
3. **Content accuracy** - Cross-reference lesson content with original book
4. **Card quality** - Review a sample of review cards for clarity, specificity, correctness
5. **Navigation** - Test book switching, URL routing, back/forward, mobile

---

## Part 3: Reusable New Book Playbook

Save to: `NEW-BOOK-PLAYBOOK.md` in the project root

This comprehensive document will serve as the complete instruction manual for any agent tasked with adding a new book. Contents:

### Section 1: Architecture Setup
- How to create a new book entry in `books.ts`
- Directory structure to create under `src/content/books/<slug>/`
- File templates (modules.ts, lessons.ts, review-cards.ts, quiz-questions.ts, illustration-map.ts, lessons/index.ts)
- Database migration: add new book_id value (existing DEFAULT handles old data)

### Section 2: PDF/Source Extraction
- Tools and approach for PDF -> markdown extraction
- How to structure extracted chapters for analysis
- What to look for: TOC, chapter boundaries, figures, equations, code

### Section 3: Curriculum Design Principles
- **Mnemonic Medium** (Matuschak/Nielsen): Embed spaced repetition in reading, expert-written prompts, both recall AND application prompts, no orphan prompts
- **Desirable Difficulties** (Bjork): Spacing, interleaving, effortful retrieval, storage vs retrieval strength
- **Dual Coding** (Paivio): Pair every abstract concept with a visual
- **Progressive Disclosure**: Concrete -> representational -> abstract
- **Elaborative Interrogation**: "Why" and "How" questions, not just "What"
- **Active Learning**: Code exercises, interactive problem-solving
- **Scaffolding & ZPD**: Support structures that progressively withdraw
- **Miller's Law**: 3-4 key concepts per lesson, ~15 min per lesson
- **Interleaving**: Mix different problem types within study sessions

### Section 4: Subagent Orchestration

**Phase 0 - Extraction:** 1 agent to convert PDF/EPUB -> markdown chapters + section chunking

**Phase 1 - Curriculum Design:** 1 agent (sequential, needs extraction output) designs modules, lessons, prerequisites, learning objectives

**Phase 2 - Per-Section Content Pipeline** (parallel, 1 pipeline per lesson, max 3 concurrent):
Each lesson goes through 5 sequential stages:
1. **Section Planner** - designs the section plan, narrative arc, visual/card/code placements
2. **Content Drafter** - writes full prose in mnemonic medium style
3. **Content Critic** - reviews for accuracy, pedagogy, clarity, completeness
4. **Content Refiner** - polishes based on critic feedback, produces final TypeScript
5. **Review Card & Quiz Creator** - generates cards (4-6) and questions (3-4) per lesson

**Phase 2B - Per-Section Code Pipeline** (parallel with content, for code-heavy lessons):
1. **Code Planner** - decides what to show, language, inputs/outputs
2. **Code Drafter** - writes the code with comments
3. **Code Reviewer** - verifies correctness and clarity
4. **Code Polisher** - applies feedback, formats for CodeExample interface

**Phase 3 - 4-Stage Visual Pipeline** (parallel, 1 pipeline per illustration):
1. **Design Agent** - designs visual layout, shapes, colors, animation sequence
2. **Implementation Agent** - writes React + Framer Motion SVG component
3. **Code Validation Agent** - checks for overlaps, clipping, dark mode, accessibility
4. **Screenshot Verification Agent** - renders, screenshots in light+dark, visual QA, sends failures back to Stage 2

**Phase 4 - Integration:** 1 agent wires all files together

**Phase 5 - QA:** 1 agent runs build, navigates all pages, cross-references with source

### Section 5: Content File Format Specs
- LessonContentData TypeScript interface with examples
- ReviewCard interface with Bloom's taxonomy level requirements
- QuizQuestion interface with linking to review cards
- CodeExample interface

### Section 6: Review Card Design Guide
- Mix Bloom's levels: remember (30%), understand (30%), apply (25%), analyze (15%)
- Types: recall, concept, application, cloze
- Expert Response Heuristic: an expert should answer quickly and accurately
- No orphan prompts: every card tied to narrative
- Application prompts using concepts in novel situations
- Elaborative interrogation: "why does X work?" not just "what is X?"

### Section 7: SVG Illustration Quality Checklist
- [ ] Uses `useRef` + `useInView` for scroll-triggered entrance
- [ ] Uses CSS variables for all colors (no hardcoded hex/rgb)
- [ ] Has `viewBox` + `width: 100%` + `height: auto`
- [ ] Has `role="img"` + descriptive `aria-label`
- [ ] Has `className` prop passthrough
- [ ] All text labels within viewBox bounds
- [ ] No label-to-label overlaps
- [ ] No label-to-element overlaps
- [ ] Framer Motion animations staggered with appropriate delays
- [ ] Transform origins explicitly set for scaling/rotating animations
- [ ] Font sizes readable (min 11px for labels, 13px for headings)
- [ ] `fontFamily="var(--font-sans)"` on all text elements
- [ ] Passes screenshot review in both light and dark mode
- [ ] Visually balanced with even spacing

### Section 8: Common SVG Failure Modes
1. Text overlaps - labels colliding with each other or shapes
2. ViewBox clipping - content extending beyond bounds
3. Dark mode breakage - hardcoded colors
4. Animation jank - too many simultaneous animations, wrong transform origins
5. Spacing issues - uneven gaps, off-center elements
6. Font problems - missing fontFamily, sizes too small
7. Responsive breakage - missing viewBox, fixed width/height

### Section 9: Integration Checklist
- [ ] All lesson files wired into `lessons/index.ts` with lazy loading
- [ ] All review cards in `review-cards.ts` keyed by lesson ID
- [ ] All quiz questions in `quiz-questions.ts` keyed by lesson ID
- [ ] All illustrations registered in `illustration-map.ts`
- [ ] All illustration components exported from barrel file
- [ ] Book registered in `books.ts`
- [ ] Content registry updated in `src/content/index.ts`
- [ ] `npm run build` passes
- [ ] Every lesson navigable via UI
- [ ] Book dropdown shows and switches correctly

---

## Implementation Order (Parallel Strategy)

**Stream A and Stream B run simultaneously:**

**Stream A: Architecture (Part 1)**
1. Content file restructuring (1A) + books.ts registry
2. Content API changes (1B) + BookProvider (1C)
3. URL routing changes (1C) + NavHeader dropdown (1D)
4. Home page transformation (1E)
5. Database schema migration (1F) + API routes (1G)
6. Illustration map extraction (1H)
7. Build + verify DL book still works

**Stream B: MARL Content (Part 2) - runs in parallel with Stream A**
1. PDF extraction & analysis (Phase 0)
2. Curriculum design (Phase 1) - depends on extraction
3. Content authoring (Phase 2) - parallel subagents per module
4. Visual creation (Phase 3) - 4-stage pipeline, parallel with Phase 2
5. Integration (Phase 4) - depends on Stream A being done
6. QA (Phase 5)

**Stream C: Playbook (Part 3) - after both A and B complete**
1. Write `NEW-BOOK-PLAYBOOK.md`

---

## Critical Files to Modify

| File | Change |
|------|--------|
| `src/content/index.ts` | Make all functions book-aware |
| `src/content/modules.ts` | Move to `books/deep-learning-python/` |
| `src/content/lessons.ts` | Move to `books/deep-learning-python/` |
| `src/content/review-cards.ts` | Move to `books/deep-learning-python/` |
| `src/content/quiz-questions.ts` | Move to `books/deep-learning-python/` |
| `src/content/lessons/` (all files) | Move to `books/deep-learning-python/lessons/` |
| `src/components/navigation/NavHeader.tsx` | Add book dropdown |
| `src/app/page.tsx` | Transform to book selector |
| `src/app/learn/` (all pages) | Move to `src/app/books/[bookId]/learn/` |
| `src/app/review/page.tsx` | Move to `src/app/books/[bookId]/review/` |
| `src/app/progress/page.tsx` | Move to `src/app/books/[bookId]/progress/` |
| `src/lib/db/hooks.ts` | Add bookId to all hooks + SWR keys |
| `src/lib/db/api-client.ts` | Pass bookId to all API calls |
| All `src/app/api/` routes | Accept + filter by bookId |
| `src/lib/db/schema.ts` | Add Book interface |

**New files to create:**
- `src/content/books.ts`
- `src/app/books/[bookId]/layout.tsx`
- `src/components/providers/BookProvider.tsx`
- `src/content/books/marl/` (entire directory with all content)
- `src/components/illustrations/` (80-120 new MARL diagram components)
- `NEW-BOOK-PLAYBOOK.md`

---

## Verification

1. `npm run build` passes
2. Navigate to `/` - see book selector with both books
3. Click "Deep Learning with Python" - existing content loads correctly at `/books/deep-learning-python/learn`
4. Click MARL - new content loads at `/books/marl/learn`
5. Book dropdown in header switches between books
6. Lesson pages show illustrations with no overlaps, clipping, or rendering issues
7. Review cards are scoped per-book
8. Progress tracking works independently per book
9. All old URLs redirect to new structure
10. Mobile navigation works with book selector
