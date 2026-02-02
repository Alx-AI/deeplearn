/**
 * Lesson 1.4: The Deep Learning Revolution
 *
 * Covers: What makes DL different, generative AI era, achievements
 * Source sections: 1.7, 1.8, 1.9
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.4',
  title: 'The Deep Learning Revolution',
  sections: [
    {
      id: '1.4.1',
      title: 'Why Deep Learning Changed Everything',
      content: `
Deep learning isn't just another incremental improvement in AI. It represents a genuine revolution, and it's worth understanding *why*. Three properties set it apart:

**1. Simplicity -- Goodbye, Feature Engineering**

Before deep learning, the hardest part of any ML project was **feature engineering** -- manually designing clever ways to represent your data. Building an image classifier? You'd spend weeks designing pixel histograms, edge detectors, and texture descriptors. Building a speech recognizer? You'd handcraft spectral features and phoneme models. This was the bottleneck for every application.

Deep learning eliminates this bottleneck. You feed in raw data (pixels, audio samples, text), and the model learns all the useful features on its own, in one pass. Entire multi-stage ML pipelines collapsed into a single end-to-end deep learning model.

**2. Scalability -- More Data, More Compute, Better Results**

Deep learning is uniquely suited to scale. Models train on small batches of data at a time, so you can feed them datasets of essentially unlimited size. And the computations parallelize naturally on GPUs, which means you can throw more hardware at the problem and get proportionally better results. This "scaling" property is what has driven much of the progress in recent years.

**3. Versatility and Reusability -- Foundation Models**

Unlike older approaches, deep learning models can be trained on additional data without starting from scratch. Even more powerfully, a model trained on one task can be *reused* for many others. This is the idea behind **foundation models** -- enormous models trained on massive datasets that serve as general-purpose starting points. You fine-tune them for your specific task instead of building from scratch.
`,
      reviewCardIds: ['rc-1.4-1', 'rc-1.4-2'],
      illustrations: ['dl-revolution'],
      codeExamples: [
        {
          title: 'Foundation model reuse: fine-tuning a pretrained network',
          language: 'python',
          code: `from tensorflow import keras
from keras import layers

# Load a model pretrained on 1.2M images (ImageNet)
base_model = keras.applications.MobileNetV2(
    weights="imagenet",
    include_top=False,         # remove original classification head
    input_shape=(224, 224, 3),
)
base_model.trainable = False   # freeze the learned features

# Add a new head for YOUR task (e.g., 5 classes)
model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(5, activation="softmax"),
])
print(f"Reusing {base_model.count_params():,} pretrained params")
# No feature engineering, no training from scratch!`,
        },
        {
          title: 'GPU-friendly batched training (scalability)',
          language: 'python',
          code: `import numpy as np

# Deep learning trains on small batches -- easy to parallelize on GPUs
batch_size = 64
total_samples = 50_000
steps_per_epoch = total_samples // batch_size
print(f"{steps_per_epoch} gradient updates per epoch")
print(f"Each batch of {batch_size} samples processes in parallel on GPU")
# Double the GPU memory? Double the batch size. Linear scaling.`,
        },
      ],
    },
    {
      id: '1.4.2',
      title: 'The Generative AI Era',
      content: `
The most visible application of deep learning today is **generative AI** -- chatbots like ChatGPT, Claude, and Gemini; image generators like Midjourney; coding assistants like GitHub Copilot. These systems don't just classify or predict; they *create* new content.

How do they work? At their core, they use a training approach called **self-supervised learning**. Instead of requiring humans to label every training example (which is expensive and slow), these models learn by predicting parts of their own input:

- A language model learns to predict the next word in a sentence
- An image model learns to reconstruct a clean image from a noisy version

Because the "labels" come from the data itself, you don't need human annotators. This unlocks training on *vastly* larger datasets than was ever possible before. Some foundation models train on over a petabyte of data at the cost of tens of millions of dollars.

The result? Models that have absorbed so much human knowledge that they can solve new problems purely through **prompting** -- you describe what you want, and the model retrieves and recombines the patterns it learned during training.

This is qualitatively different from earlier AI. A traditional classifier could tell you "this image contains a cat." A foundation model can write an essay about cats, generate a photorealistic image of a cat wearing a hat, or explain cat behavior in the style of a nature documentary. Same underlying technique (layered representations learned from data), but at a dramatically larger scale.
`,
      reviewCardIds: ['rc-1.4-3', 'rc-1.4-4', 'rc-1.4-5'],
      illustrations: ['self-supervised-learning'],
      codeExamples: [
        {
          title: 'Self-supervised learning idea: predict the next token',
          language: 'python',
          code: `import numpy as np

# The core idea: the "labels" come from the data itself
text = "deep learning is a powerful framework"
words = text.split()

# Create training pairs: each word predicts the next
for i in range(len(words) - 1):
    input_word = words[i]
    target_word = words[i + 1]
    print(f"  Input: '{input_word}'  ->  Target: '{target_word}'")

# No human labeling needed! The structure of language IS the label.
# Scale this to trillions of words and you get a foundation model.`,
        },
      ],
    },
    {
      id: '1.4.3',
      title: 'What Deep Learning Has Actually Achieved',
      content: `
It's easy to get lost in hype, so let's ground ourselves in what deep learning has *concretely* accomplished. Over the past decade, the technology has produced breakthrough results in areas that had eluded AI for decades:

**Perceptual tasks (2013-2017):**
- Human-level image classification
- Human-level speech transcription
- Human-level handwriting recognition
- Dramatically improved machine translation

**Language and reasoning (2017-2022):**
- Fluent, versatile chatbots
- Programming assistants that write functional code
- Dramatically improved text-to-speech conversion

**Creative and physical tasks (2022-present):**
- Photorealistic image generation from text descriptions
- Human-level autonomous driving (deployed in Phoenix, San Francisco, Los Angeles, and Austin)
- Superhuman performance in Go, Chess, and Poker
- Scientific breakthroughs like AlphaFold's protein structure prediction

And the applications keep expanding. Deep learning is being used to transcribe ancient manuscripts, detect plant diseases from smartphone photos, assist oncologists with medical imaging, and predict natural disasters. The full potential hasn't been reached -- we're still in the early chapters.

The common thread in all of these achievements: tasks that require recognizing complex patterns in large amounts of data. That's where deep learning shines. It's not magic -- it's pattern recognition at a scale and complexity that was previously impossible.
`,
      reviewCardIds: ['rc-1.4-6', 'rc-1.4-7', 'rc-1.4-8'],
    },
  ],
  summary: `**Key takeaways:**
- Deep learning's revolution rests on three pillars: simplicity (automated feature learning), scalability (GPU parallelization + arbitrary dataset sizes), and versatility (reusable foundation models).
- Self-supervised learning eliminates the need for human-labeled data, enabling training on massive datasets.
- Foundation models learn from enormous data and can solve new tasks through prompting rather than retraining.
- Concrete achievements include human-level image/speech recognition, fluent chatbots, autonomous driving, and scientific breakthroughs.
- The common thread: DL excels at recognizing complex patterns in large datasets.`,
};

export default lesson;
