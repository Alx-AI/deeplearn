/**
 * Lesson 1.5: Promises and Pitfalls
 *
 * Covers: Hype, AI winters, the real promise
 * Source sections: 1.10, 1.11, 1.12
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.5',
  title: 'Promises and Pitfalls',
  sections: [
    {
      id: '1.5.1',
      title: 'Cognitive Automation, Not Intelligence',
      content: `
With all the impressive achievements we just covered, it's tempting to think we're on the verge of truly intelligent machines. Headlines scream about AGI (artificial general intelligence) arriving any day now. Let's take a step back and think critically.

Despite its name, today's AI is more accurately described as **cognitive automation** -- the encoding and operationalization of human skills and knowledge for narrowly defined problems. It's extraordinarily useful, but it's not intelligence.

Here's the key distinction: **intelligence is the ability to face the unknown, adapt to it, and learn from it.** Automation, even at its best, can only handle situations it has been trained on. A chatbot can produce remarkably human-sounding text, but it's recombining patterns from its training data. It doesn't *understand* in the way you do. It's like a cartoon character versus a living being -- a cartoon, no matter how realistic, can only act out scenes it was drawn for.

Chollet offers a memorable analogy: expecting a better clock to lead to time travel. Improvements in cognitive automation (pattern recognition, text generation) are wonderful, but they're fundamentally different from general intelligence. They operate on different principles entirely. Making clocks more precise doesn't get you closer to time travel, and making language models bigger doesn't get you closer to machines that truly *think*.

As a practitioner, this distinction matters. It helps you understand what problems AI can solve (pattern recognition on large datasets) and what it can't (genuinely novel reasoning about the unknown). Setting realistic expectations makes you a better engineer.
`,
      reviewCardIds: ['rc-1.5-1', 'rc-1.5-2', 'rc-1.5-3'],
      illustrations: ['dl-limitations'],
    },
    {
      id: '1.5.2',
      title: 'AI Winters and the Hype Cycle',
      content: `
History offers a sobering lesson about AI hype. Twice before, the field went through a cycle of wild optimism followed by crushing disappointment -- periods called **AI winters**.

**The first winter (early 1970s):** In 1967, Marvin Minsky predicted that human-level AI would be achieved "within a generation." By 1970, he narrowed it to "three to eight years." When those predictions predictably failed to materialize, government funding dried up, researchers left the field, and progress stalled for years.

**The second winter (early 1990s):** Expert systems -- a new flavor of symbolic AI -- boomed in the 1980s. Companies poured over $1 billion per year into the technology. But these systems proved expensive to maintain, difficult to scale, and limited in scope. Interest evaporated, and another winter set in.

Today, we may be in a third hype cycle. AI investment exceeds $200 billion annually, while revenue generation is closer to $30 billion. The gap between investment and returns is driven largely by promises about what AI *might soon* become, rather than what it can do today. Some of those promises -- mass unemployment, 100x productivity gains, near-term AGI -- have not materialized.

Does this mean a third winter is coming? Probably not a severe one. Unlike previous eras, AI today has demonstrated undeniable, practical value. Tens of billions in real revenue, millions of daily users, deployed autonomous vehicles. But some correction is likely.

**The real promise** is long-term. Deep learning will eventually be applied to nearly every process in society -- medicine, science, manufacturing, education, creative work. The internet was overhyped in 1999, crashed in 2000, and then proceeded to transform every aspect of human life. AI is likely on a similar trajectory: believe the long-term vision, but stay skeptical of short-term promises.
`,
      reviewCardIds: ['rc-1.5-4', 'rc-1.5-5', 'rc-1.5-6'],
      illustrations: ['hype-cycle'],
    },
  ],
  summary: `**Key takeaways:**
- Current AI is best described as "cognitive automation" -- encoding skills for narrow problems -- not true intelligence.
- Intelligence means adapting to the unknown; automation handles only what it was trained for.
- AI has experienced two "winters" caused by hype-then-disappointment cycles (1970s and 1990s).
- Today's AI investment far exceeds current revenue, suggesting some correction is likely.
- The long-term promise is real -- AI will transform virtually every field -- but short-term hype should be met with healthy skepticism.
- As a practitioner, understanding these limits makes you a better engineer.`,
};

export default lesson;
