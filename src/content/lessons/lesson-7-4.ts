/**
 * Lesson 7.4: Limitations of Deep Learning
 *
 * Covers: Poor novelty handling, phrasing sensitivity, local vs extreme generalization, anthropomorphization
 * Source sections: 19.1, 19.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '7.4',
  title: 'Limitations of Deep Learning',
  sections: [
    {
      id: '7.4.1',
      title: 'What Deep Learning Cannot Do',
      content: `
Deep learning models are parametric curves fitted to data. This is the source of their power -- they scale well and are easy to train. But it is also the source of fundamental limitations.

**Inability to handle novelty**: deep learning models are static databases. Their parameters are fixed after training. They excel at recognizing patterns similar to their training data (local generalization) but break down when encountering genuinely novel situations. An LLM that has seen "What's heavier, 1 kg of steel or 1 kg of feathers?" many times in its training data may correctly answer that question but fail when the numbers change to 10 kg vs. 1 kg -- because it is matching patterns, not reasoning about weight.

**Sensitivity to phrasing**: innocuous changes to how a question is worded can dramatically change model performance. Changing variable names in code, rephrasing a math problem, or substituting synonyms in instructions can degrade accuracy significantly. This is why "prompt engineering" exists -- the model is not understanding your intent; it is matching your text to patterns in its training data, and slightly different text addresses slightly different patterns.

**Inability to learn generalizable programs**: even after seeing millions of addition examples, deep learning models typically achieve only ~70% accuracy on digit addition. They are interpolating between memorized examples, not learning the actual addition algorithm. The programs memorized by deep learning are approximate and brittle.
`,
      reviewCardIds: ['rc-7.4-1', 'rc-7.4-2', 'rc-7.4-3'],
      illustrations: ['dl-limitations'],
      codeExamples: [
        {
          title: 'Generating an adversarial example with FGSM',
          language: 'python',
          code: `import tensorflow as tf

def fgsm_attack(model, image, label, epsilon=0.01):
    image = tf.cast(image, tf.float32)
    with tf.GradientTape() as tape:
        tape.watch(image)
        pred = model(image[tf.newaxis])
        loss = tf.keras.losses.sparse_categorical_crossentropy(
            [label], pred)
    gradient = tape.gradient(loss, image)
    perturbation = epsilon * tf.sign(gradient)
    return tf.clip_by_value(image + perturbation, 0, 1)

# A tiny, imperceptible perturbation can flip the prediction
adv_image = fgsm_attack(model, test_image, true_label)`,
        },
        {
          title: 'Demonstrating phrasing sensitivity in predictions',
          language: 'python',
          code: `import numpy as np

# Same semantic meaning, different input representations
# can yield different model predictions
original = preprocess("What is heavier, 1kg steel or 1kg feathers?")
rephrased = preprocess("Compare the weight: 1kg of steel vs 1kg of feathers")

pred_a = model.predict(original)
pred_b = model.predict(rephrased)

print(f"Original phrasing confidence: {np.max(pred_a):.3f}")
print(f"Rephrased confidence:         {np.max(pred_b):.3f}")
# These may differ significantly despite identical meaning`,
        },
      ],
    },
    {
      id: '7.4.2',
      title: 'Local vs. Extreme Generalization',
      content: `
Chollet draws a crucial distinction between two types of generalization:

**Local generalization**: handling variations similar to training data. A cat classifier recognizes cats in new photos with different backgrounds. An LLM answers questions similar to those in its training data. This is what deep learning does well -- interpolation within the training distribution.

**Extreme generalization**: adapting to fundamentally novel situations using reasoning and abstraction. A human seeing a truck for the first time can understand it from a description. A human can solve a novel logic puzzle by reasoning from first principles. Deep learning cannot do this.

The "scale is all you need" argument -- that bigger models will eventually achieve general intelligence -- misses this distinction. Scaling gives more data points to interpolate between, but does not produce the ability to reason about genuinely novel situations. The fundamental architecture remains the same: parametric curves fitted via gradient descent.

**The anthropomorphization trap**: because LLMs produce fluent natural language, we instinctively attribute understanding to them. But fluent text does not require understanding -- it only requires pattern matching on text statistics. A model that generates a correct explanation of photosynthesis may have no "understanding" of biology; it has learned that those words follow each other in educational contexts.

As a practitioner, treat models as pattern matchers. This mindset leads to better engineering: you will anticipate failures, build safeguards, and set appropriate expectations. Never assume the model "gets it."
`,
      reviewCardIds: ['rc-7.4-4', 'rc-7.4-5'],
      illustrations: ['local-vs-extreme-gen'],
      codeExamples: [
        {
          title: 'Detecting out-of-distribution inputs via prediction entropy',
          language: 'python',
          code: `import numpy as np

def prediction_entropy(probs):
    """High entropy = model is uncertain (possibly OOD input)."""
    return -np.sum(probs * np.log(probs + 1e-10), axis=-1)

preds = model.predict(x_test)
entropy = prediction_entropy(preds)

# Flag inputs where model is highly uncertain
threshold = np.percentile(entropy, 95)
ood_mask = entropy > threshold
print(f"Flagged {ood_mask.sum()} potentially OOD samples")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Deep learning models are static parametric curves: powerful for pattern matching, limited for novelty and reasoning.
- Models struggle with novel situations, are sensitive to phrasing, and cannot learn exact algorithmic programs.
- Local generalization (interpolation within training distribution) is what DL does well; extreme generalization (novel reasoning) is what it cannot do.
- Scaling models does not solve these fundamental limitations -- the architecture paradigm remains the same.
- Avoid anthropomorphizing models: fluent language output does not indicate understanding. Treat models as pattern matchers.`,
};

export default lesson;
