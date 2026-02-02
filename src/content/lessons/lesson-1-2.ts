/**
 * Lesson 1.2: How Machines Learn
 *
 * Covers: What makes ML different from classical programming, learning representations
 * Source sections: 1.3, 1.4
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.2',
  title: 'How Machines Learn',
  sections: [
    {
      id: '1.2.1',
      title: 'What Does "Learning" Actually Mean?',
      content: `
We said that machine learning is about discovering rules from data. But what does the machine *actually* find? The answer is: **representations**.

A representation is simply a different way to look at or encode the same data. Consider a color image. You could represent it in RGB (red-green-blue channels) or in HSV (hue-saturation-value). Both encodings contain the same information, but some tasks become easier depending on which one you use. "Select all red pixels" is trivial in RGB. "Desaturate the image" is trivial in HSV. The *right representation* makes the problem easy; the wrong one makes it hard.

Here's a concrete example. Imagine you have a scatter plot of black dots and white dots that are swirled together -- impossible to separate with a straight line in the current coordinate system. But if you apply a clever coordinate transformation (rotate and stretch the axes), suddenly the two colors fall on opposite sides of a vertical line. The data didn't change; only the *way you're looking at it* did. That transformation gave you a useful representation.

Machine learning automates this search for useful representations. The system tries different transformations of the input data, guided by a feedback signal that says "you're getting warmer" or "you're getting colder." When it finds a transformation that makes the task easy to solve with simple rules, it has *learned*.

More precisely: **learning is an automatic search for data transformations that produce useful representations, guided by a feedback signal.** The transformations produce representations that make the problem easier to solve -- like that coordinate change that separated the black dots from the white dots.
`,
      reviewCardIds: ['rc-1.2-1', 'rc-1.2-2'],
      illustrations: ['coordinate-transform'],
      codeExamples: [
        {
          title: 'A coordinate transform that makes data separable',
          language: 'python',
          code: `import numpy as np

# Two interleaved half-circles (not linearly separable)
from sklearn.datasets import make_moons
X, y = make_moons(n_samples=200, noise=0.15, random_state=42)

# A simple learned transformation: map to polar-like coords
r = np.sqrt(X[:, 0]**2 + X[:, 1]**2)
theta = np.arctan2(X[:, 1], X[:, 0])
X_transformed = np.column_stack([r, theta])
# In this new representation, the classes become easier to separate`,
        },
        {
          title: 'Different representations of the same color',
          language: 'python',
          code: `import numpy as np

# Same color, two representations
rgb = np.array([200, 50, 50])  # reddish in RGB

# Convert to HSV (hue, saturation, value)
r, g, b = rgb / 255.0
max_c, min_c = max(r, g, b), min(r, g, b)
hue = 0 if max_c == min_c else 60 * ((g - b) / (max_c - min_c)) % 360
saturation = 0 if max_c == 0 else (max_c - min_c) / max_c
value = max_c
print(f"RGB: {rgb}  ->  HSV: ({hue:.0f}, {saturation:.2f}, {value:.2f})")
# Same data, but "select all red pixels" is trivial in RGB
# while "desaturate" is trivial in HSV`,
        },
      ],
    },
    {
      id: '1.2.2',
      title: 'The Hypothesis Space',
      content: `
There's an important constraint on machine learning algorithms: they don't search *everywhere* for useful transformations. They search within a predefined set of possible operations, called the **hypothesis space**.

Think of it like a combination lock. A brute-force search tries every possible combination, but only within the range of numbers available on the lock. ML algorithms similarly search within a structured space of possibilities -- the set of all transformations that the chosen model architecture can represent. A linear model can only search through linear transformations. A decision tree searches through threshold-based splits. A neural network searches through compositions of layered transformations.

Choosing your hypothesis space is one of the most important decisions in ML. If the right transformation isn't *possible* within your chosen space, no amount of data or training will find it. This is why model architecture matters so much.

To summarize the ML recipe:

1. **Define the hypothesis space** -- choose what kinds of transformations are possible (this is your model architecture)
2. **Feed in data with known answers** -- input data paired with expected outputs
3. **Measure performance** -- use a feedback signal (loss function) to quantify how well the current transformation works
4. **Search and adjust** -- the algorithm systematically tries different transformations within the hypothesis space, guided by feedback, until it finds one that works well

This is the core loop of machine learning. Everything else -- all the fancy techniques, architectures, and frameworks -- is built on top of this basic idea. The art lies in choosing the right hypothesis space and the right feedback signal for your specific problem.
`,
      reviewCardIds: ['rc-1.2-3', 'rc-1.2-4'],
      illustrations: ['hypothesis-space'],
      codeExamples: [
        {
          title: 'Linear model: a very small hypothesis space',
          language: 'python',
          code: `from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_moons

X, y = make_moons(n_samples=500, noise=0.2, random_state=42)
model = LogisticRegression()
model.fit(X, y)
print(f"Linear accuracy: {model.score(X, y):.2f}")
# ~0.86 -- a straight line can't fully separate curved data`,
        },
        {
          title: 'Neural network: a much larger hypothesis space',
          language: 'python',
          code: `from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_moons

X, y = make_moons(n_samples=500, noise=0.2, random_state=42)
model = MLPClassifier(hidden_layer_sizes=(16, 8), max_iter=1000,
                      random_state=42)
model.fit(X, y)
print(f"Neural net accuracy: {model.score(X, y):.2f}")
# ~1.00 -- curved decision boundaries are within reach`,
        },
      ],
    },
    {
      id: '1.2.3',
      title: 'From Shallow Learning to Deep Learning',
      content: `
Traditional ML approaches are sometimes called "shallow learning" because they typically learn only one or two layers of representation. For example, a classic image classifier might:

1. Compute a histogram of pixel intensities (one transformation)
2. Apply a classification rule to the histogram (one more transformation)

That's it -- two steps. And for simple problems, this works! But for hard problems like recognizing faces, understanding speech, or translating languages, one or two transformations aren't enough. Humans had to do enormous amounts of **feature engineering** -- manually designing clever transformations to make the data amenable to these shallow methods. This was painstaking, domain-specific work.

Deep learning takes a radically different approach. Instead of two layers of transformation, it uses *many* -- often tens or hundreds of layers stacked on top of each other. Each layer learns its own transformation, and the output of one layer feeds into the next. The key insight: **these layers are all learned automatically from data.** No manual feature engineering required.

The "deep" in deep learning refers to this depth -- the number of successive layers of representation. It does *not* mean "deep understanding" or "deep thinking." A more descriptive name might have been "layered representations learning" or "hierarchical representations learning."

What makes this powerful is **information distillation**. Each layer takes the representation from the previous layer and refines it slightly, making it more useful for the final task. Raw pixel values become edge detectors. Edge detectors become texture recognizers. Texture recognizers become part detectors. Part detectors become object classifiers. Each layer distills the information a little further, like filtering water through successive stages until it's pure.

This is the magic of deep learning: simple transformations, stacked many times, can implement astonishingly complex mappings from input to output.
`,
      reviewCardIds: ['rc-1.2-5', 'rc-1.2-6', 'rc-1.2-7'],
      illustrations: ['training-loop'],
      codeExamples: [
        {
          title: 'Shallow model: manual feature engineering + simple classifier',
          language: 'python',
          code: `import numpy as np
from sklearn.linear_model import LogisticRegression

# Simulate a hand-engineered feature pipeline for images
# Step 1: manually compute a histogram of pixel intensities
def pixel_histogram(image, bins=16):
    hist, _ = np.histogram(image.ravel(), bins=bins, range=(0, 255))
    return hist / hist.sum()  # normalize

# Step 2: classify based on the hand-crafted features
# (this is the "shallow" approach -- one manual transform + one classifier)
fake_images = np.random.randint(0, 256, size=(100, 28, 28))
features = np.array([pixel_histogram(img) for img in fake_images])
print(f"Hand-engineered features shape: {features.shape}")  # (100, 16)`,
        },
        {
          title: 'Deep model: raw pixels in, learned features automatically',
          language: 'python',
          code: `from tensorflow import keras
from keras import layers

# Deep learning: feed raw pixels, let the model learn features
model = keras.Sequential([
    layers.Flatten(input_shape=(28, 28)),  # raw pixels
    layers.Dense(128, activation="relu"),  # learned layer 1
    layers.Dense(64, activation="relu"),   # learned layer 2
    layers.Dense(32, activation="relu"),   # learned layer 3
    layers.Dense(10, activation="softmax") # output: 10 digits
])
print(f"Total learned parameters: {model.count_params():,}")
# No manual feature engineering needed!`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- A representation is a different way to encode data; the right representation makes a problem easy to solve.
- Learning = automatic search for useful data transformations, guided by a feedback signal.
- ML algorithms search within a predefined hypothesis space -- the set of all transformations the model can represent.
- Shallow learning uses 1-2 layers of representation and requires manual feature engineering.
- Deep learning stacks many layers, each learned from data, progressively distilling information into more useful forms.
- "Deep" refers to the number of layers, not depth of understanding.`,
};

export default lesson;
