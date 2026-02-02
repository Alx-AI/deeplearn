/**
 * Lesson 7.5: The Future of AI -- Beyond Deep Learning
 *
 * Covers: Intelligence as abstraction + recombination, ARC benchmark, program synthesis
 * Source sections: 19.3, 19.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '7.5',
  title: 'The Future of AI -- Beyond Deep Learning',
  sections: [
    {
      id: '7.5.1',
      title: 'What Is Intelligence?',
      content: `
Chollet proposes that intelligence consists of two core capabilities:

**Abstraction acquisition**: observing patterns and extracting reusable abstract concepts. From seeing a few symmetric shapes, you grasp the concept of "symmetry." From navigating a few supermarkets, you develop an abstract model of "how stores are organized."

**On-the-fly recombination**: combining these abstractions in novel ways to handle new situations. You have never been to this particular store, but you combine your abstractions of "store layout," "product categories," and "navigation" to find what you need efficiently.

Current deep learning does a reasonable job at abstraction acquisition during training (gradient descent extracts patterns from data) but has **zero ability for on-the-fly recombination** at inference time. Models behave as static databases -- they can retrieve what they memorized but cannot combine it flexibly to address novel situations.

This is the **kaleidoscope hypothesis**: the world seems infinitely complex, but everything is composed of a relatively small number of reusable "atoms of meaning" -- abstract concepts that recombine to produce endless variety. Intelligence is the ability to discover these atoms and recombine them. Deep learning discovers some atoms but cannot recombine them.
`,
      reviewCardIds: ['rc-7.5-1', 'rc-7.5-2', 'rc-7.5-3'],
      illustrations: ['dl-limitations'],
    },
    {
      id: '7.5.2',
      title: 'ARC and Program Synthesis',
      content: `
The **ARC (Abstraction and Reasoning Corpus)** benchmark tests what current AI systems lack: the ability to reason on the fly about novel visual puzzles. Each puzzle presents a few input-output examples demonstrating an abstract rule, and the model must apply that rule to a new input.

ARC puzzles are deliberately novel -- they cannot be solved by memorization. An LLM trained on the entire internet still fails because the specific rule combinations have never been seen before. Solving them requires genuine abstraction and reasoning from a few examples, not pattern matching against training data.

**Program synthesis** -- automatically generating discrete programs that solve tasks -- is a complementary approach to deep learning. While deep learning produces continuous, opaque transformations, programs are discrete, interpretable, composable, and verifiable. The future may lie in combining both:

- **Deep learning** for perception: recognizing patterns, extracting features, handling noise
- **Program synthesis** for reasoning: composing abstractions, applying discrete logic, planning

**Test-time adaptation** -- models that can learn during inference -- is another missing piece. Current models are frozen after training. An intelligent agent needs to form new concepts, test hypotheses, and update behavior on the spot when encountering novelty.

The current state of AI is powerful cognitive automation, not intelligence. But understanding this distinction is not a criticism -- it is the foundation for building something better. The field is still young, and the most transformative discoveries likely lie ahead.
`,
      reviewCardIds: ['rc-7.5-4', 'rc-7.5-5'],
      illustrations: ['local-vs-extreme-gen'],
      codeExamples: [
        {
          title: 'Loading the ARC dataset for exploration',
          language: 'python',
          code: `import json
from pathlib import Path

# ARC tasks are JSON files with train/test examples
task_path = Path("ARC-AGI/data/training")
task = json.loads((task_path / "007bbfb7.json").read_text())

for i, example in enumerate(task["train"]):
    inp = example["input"]   # 2D grid of integers (colors)
    out = example["output"]  # Transformed grid
    print(f"Example {i}: {len(inp)}x{len(inp[0])} -> "
          f"{len(out)}x{len(out[0])}")
# Challenge: infer the transformation rule from few examples`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Intelligence = abstraction acquisition (extracting reusable concepts) + on-the-fly recombination (flexibly combining them for novel situations).
- Deep learning does abstraction acquisition during training but lacks on-the-fly recombination at inference time.
- ARC tests genuine reasoning with novel puzzles that cannot be solved by memorization.
- Program synthesis complements deep learning by providing discrete, interpretable, composable reasoning.
- Test-time adaptation -- learning during inference -- is a key missing capability. The field's most transformative discoveries likely lie ahead.`,
};

export default lesson;
