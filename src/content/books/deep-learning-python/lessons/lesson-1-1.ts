/**
 * Lesson 1.1: The Landscape of AI
 *
 * Covers: What is AI, the relationship between AI/ML/DL
 * Source sections: 1.1, 1.2, 1.3
 */

export interface CodeExample {
  /** Short label shown above the code block, e.g. "Creating a tensor" */
  title: string;
  /** Language identifier for syntax display, e.g. "python", "bash", "json" */
  language: string;
  /** The code string (no surrounding backticks needed) */
  code: string;
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  reviewCardIds: string[];
  /** Optional illustration component IDs to render within this section. */
  illustrations?: string[];
  /** Optional code examples rendered after prose content. */
  codeExamples?: CodeExample[];
}

export interface LessonContentData {
  lessonId: string;
  title: string;
  sections: LessonSection[];
  summary: string;
}

const lesson: LessonContentData = {
  lessonId: '1.1',
  title: 'The Landscape of AI',
  sections: [
    {
      id: '1.1.1',
      title: 'What Is Artificial Intelligence?',
      content: `
You hear the terms "artificial intelligence," "machine learning," and "deep learning" thrown around almost interchangeably in the news. But they mean very different things, and understanding the distinction is your first step toward actually *building* these systems rather than just reading about them.

**Artificial intelligence** is the broadest term. It simply means the effort to automate intellectual tasks that humans normally perform. That's it -- nothing about robots, consciousness, or sci-fi. An AI system could be a chess program running on handwritten rules from the 1960s, a spam filter, or a chatbot like ChatGPT. The umbrella is huge.

AI as a field was born in the 1950s, when a small group of computer scientists asked a provocative question: *can machines think?* In 1956, John McCarthy organized a now-famous workshop at Dartmouth College, proposing that "every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it." They didn't solve the problem that summer -- in fact, we're still working on it -- but they launched a revolution.

For the first few decades, the dominant approach was **symbolic AI**: programmers would try to encode human knowledge as explicit rules. "If the patient has a fever AND a cough, consider pneumonia." This worked beautifully for well-defined logical problems like chess, where you can enumerate strategies. But it hit a wall when researchers tried to tackle *fuzzy*, real-world problems like recognizing faces in photos or understanding spoken language. There are simply too many variations and edge cases to write rules for by hand.

That wall is exactly what motivated a different approach -- one where the machine figures out the rules on its own.
`,
      reviewCardIds: ['rc-1.1-1', 'rc-1.1-2'],
      illustrations: ['ai-timeline'],
    },
    {
      id: '1.1.2',
      title: 'The Machine Learning Revolution',
      content: `
In 1843, Ada Lovelace wrote about Charles Babbage's Analytical Engine: "It can do whatever we know how to order it to perform." In other words, a computer only does what you explicitly tell it. For over a century, that observation held true. Programming meant writing step-by-step instructions.

**Machine learning** flips this model on its head. Instead of a programmer writing rules that transform inputs into outputs, a machine learning system is *shown* many examples of inputs and the corresponding desired outputs, and it discovers the rules itself. The programmer provides the data and specifies how to measure success; the algorithm figures out everything else.

Think of it this way:

- **Classical programming:** Human writes rules + computer processes data = answers
- **Machine learning:** Computer sees data + answers = discovers rules

This is a genuine paradigm shift. Rather than asking "what are the exact rules for recognizing a handwritten '7'?", you show the system thousands of handwritten 7s and say "figure it out." And it does -- by finding statistical patterns in the data that distinguish 7s from other digits.

To do machine learning, you need three ingredients:

1. **Input data** -- the raw material (images, text, sensor readings, whatever)
2. **Expected outputs** -- examples of correct answers (labels, categories, values)
3. **A feedback signal** -- a way to measure how well the system is doing, so it knows which direction to improve

The system uses that feedback signal to gradually adjust itself, getting better with each pass through the data. That process of gradual adjustment *is* what we mean by "learning."
`,
      reviewCardIds: ['rc-1.1-3', 'rc-1.1-4', 'rc-1.1-5'],
      illustrations: ['paradigm-shift', 'three-ingredients'],
    },
    {
      id: '1.1.3',
      title: 'Where Deep Learning Fits In',
      content: `
So where does deep learning fit? Picture three concentric circles, like a bullseye:

- The outermost circle is **AI** -- the entire field of automating intellectual tasks
- The middle circle is **Machine Learning** -- the subset of AI where systems learn from data
- The innermost circle is **Deep Learning** -- a specific *kind* of machine learning that uses layered representations

Deep learning is not a separate field from ML; it's a particularly powerful approach *within* ML. It got its own name because of a key architectural idea: learning through multiple successive layers, each one transforming data into a slightly more useful form. (We'll unpack exactly what "layers" and "representations" mean in the next lesson.)

Here's one more critical distinction: despite the name "neural networks," deep learning is **not** a model of the human brain. The original inspiration came from neurobiology, sure, but modern deep learning has diverged so far from brain science that the connection is mostly historical. There's no evidence the brain uses anything like backpropagation (the algorithm that trains neural networks). Thinking of deep learning as "how the brain works" will actually *mislead* you. It's better to think of it as a powerful mathematical framework for learning patterns from data -- nothing more, nothing less.

Although machine learning only started to flourish in the 1990s, it has become the most popular and successful approach to AI by far. Unlike theoretical mathematics or physics, machine learning is deeply empirical -- it's an engineering discipline driven by experiments, data, and advances in hardware and software. That practical, hands-on character is exactly what makes it so exciting to learn.
`,
      reviewCardIds: ['rc-1.1-6', 'rc-1.1-7', 'rc-1.1-8'],
      illustrations: ['concentric-circles'],
    },
  ],
  summary: `**Key takeaways:**
- AI is the broad effort to automate intellectual tasks; ML is the subset where systems learn from data; DL is a specific ML approach using layered representations.
- Symbolic AI (hand-coded rules) dominated until the 1980s but couldn't handle fuzzy, complex real-world problems.
- ML reverses classical programming: instead of writing rules, you provide data and expected outputs, and the system discovers the rules.
- Deep learning is NOT a model of the brain -- it's a mathematical framework for learning representations from data.
- You need three ingredients for ML: input data, expected outputs, and a feedback signal.`,
};

export default lesson;
