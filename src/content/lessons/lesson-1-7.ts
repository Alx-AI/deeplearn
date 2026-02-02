/**
 * Lesson 1.7: Understanding Tensors
 *
 * Covers: Scalars, vectors, matrices, rank-3+ tensors, key attributes
 * Source sections: 2.2.1-2.2.5
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.7',
  title: 'Understanding Tensors',
  sections: [
    {
      id: '1.7.1',
      title: 'What Is a Tensor?',
      content: `
Every piece of data that flows through a neural network -- images, audio, text, predictions, weights -- is stored in a data structure called a **tensor**. If you've heard of matrices and vectors, you already know two special cases. Tensors are simply the generalization to any number of dimensions.

Think of it as a container for numbers, organized along one or more **axes** (dimensions). The number of axes is called the tensor's **rank** (or \`ndim\`).

Let's build up from the simplest case:

**Rank-0 tensor (Scalar):** A single number. No axes. Just a value like \`12\` or \`3.14\`.

\`\`\`python
import numpy as np
x = np.array(12)
x.ndim  # 0
\`\`\`

**Rank-1 tensor (Vector):** A sequence of numbers along one axis. Like a list of values.

\`\`\`python
x = np.array([12, 3, 6, 14, 7])
x.ndim  # 1
\`\`\`

This is a "5-dimensional vector" -- but be careful with that phrasing! It has 5 *entries* along 1 axis, not 5 axes. The word "dimension" is overloaded in tensor-land, which is why it's clearer to talk about **rank** (number of axes) separately from **shape** (how many entries per axis).

**Rank-2 tensor (Matrix):** A grid of numbers along two axes -- rows and columns.

\`\`\`python
x = np.array([[5, 78, 2, 34, 0],
              [6, 79, 3, 35, 1],
              [7, 80, 4, 36, 2]])
x.ndim   # 2
x.shape  # (3, 5) -- 3 rows, 5 columns
\`\`\`

If vectors are sequences, matrices are tables. Most structured data (spreadsheets, feature tables) is naturally represented as matrices.
`,
      reviewCardIds: ['rc-1.7-1', 'rc-1.7-2', 'rc-1.7-3'],
      illustrations: ['tensor-rank'],
      codeExamples: [
        {
          title: 'Converting between Python lists and NumPy tensors',
          language: 'python',
          code: `import numpy as np

py_list = [[1, 2, 3], [4, 5, 6]]
tensor = np.array(py_list)
print(tensor.ndim)   # 2
print(tensor.shape)  # (2, 3)

back_to_list = tensor.tolist()
print(back_to_list)  # [[1, 2, 3], [4, 5, 6]]`,
        },
        {
          title: 'Creating tensors with specific initialization patterns',
          language: 'python',
          code: `import numpy as np

zeros = np.zeros((3, 4))       # 3x4 matrix of zeros
ones = np.ones((2, 3))         # 2x3 matrix of ones
rand = np.random.random((5,))  # Random vector of length 5
arange = np.arange(12).reshape((3, 4))  # Sequential values reshaped
print(arange)
# [[ 0  1  2  3]
#  [ 4  5  6  7]
#  [ 8  9 10 11]]`,
        },
      ],
    },
    {
      id: '1.7.2',
      title: 'Higher-Rank Tensors',
      content: `
Once you understand scalars, vectors, and matrices, the pattern extends naturally:

**Rank-3 tensor:** Pack multiple matrices together and you get a rank-3 tensor -- a "cube" of numbers with three axes. This is how images are stored: height x width x color channels.

\`\`\`python
x = np.array([[[5, 78, 2],
               [6, 79, 3]],
              [[7, 80, 4],
               [8, 81, 5]]])
x.ndim   # 3
x.shape  # (2, 2, 3)
\`\`\`

**Rank-4 tensor:** Pack rank-3 tensors into an array. This is how *batches of images* are stored: batch_size x height x width x channels. If you have 128 color photos of 256x256 pixels, they form a tensor of shape \`(128, 256, 256, 3)\`.

**Rank-5 tensor:** Batches of video clips -- batch_size x frames x height x width x channels. Four 60-second clips at 4fps in 144x256 resolution: shape \`(4, 240, 144, 256, 3)\`. That's over 100 million numbers!

In practice, you'll mostly work with ranks 0 through 4. Rank 5 shows up for video, but that's about as high as you'll go. The important thing is that the pattern is consistent: each additional axis adds one more "dimension of organization" to your data.

Here's a useful mental model:
- Rank 0: a single data point (temperature reading)
- Rank 1: a sequence (time series of temperatures)
- Rank 2: a table (many time series stacked)
- Rank 3: a stack of tables (or a single image)
- Rank 4: a batch of images
- Rank 5: a batch of videos
`,
      reviewCardIds: ['rc-1.7-4', 'rc-1.7-5'],
      illustrations: ['higher-rank-tensors'],
      codeExamples: [
        {
          title: 'Building a rank-4 tensor from scratch (batch of images)',
          language: 'python',
          code: `import numpy as np

# Simulate a batch of 8 color images, each 32x32 with 3 channels
batch = np.random.randint(0, 256, size=(8, 32, 32, 3), dtype=np.uint8)
print(f"Rank: {batch.ndim}")          # 4
print(f"Shape: {batch.shape}")        # (8, 32, 32, 3)
print(f"Total pixels: {batch.size}")  # 24576`,
        },
        {
          title: 'Counting total elements across different ranks',
          language: 'python',
          code: `import numpy as np

scalar = np.array(42)
vector = np.array([1, 2, 3, 4, 5])
matrix = np.ones((3, 4))
cube = np.zeros((2, 3, 4))

for name, t in [("scalar", scalar), ("vector", vector),
                ("matrix", matrix), ("cube", cube)]:
    print(f"{name}: rank={t.ndim}, shape={t.shape}, size={t.size}")`,
        },
      ],
    },
    {
      id: '1.7.3',
      title: 'The Three Key Attributes',
      content: `
Every tensor is fully described by three attributes. Memorize these -- you'll check them constantly when debugging:

**1. Rank (\`ndim\`):** The number of axes. Scalar = 0, vector = 1, matrix = 2, etc.

**2. Shape:** A tuple telling you the size along each axis. This is the most informative attribute. Examples:
- A scalar: \`()\` -- empty tuple
- A vector with 5 entries: \`(5,)\`
- A 3x5 matrix: \`(3, 5)\`
- MNIST training images: \`(60000, 28, 28)\` -- 60,000 images, each 28x28 pixels

**3. Data type (\`dtype\`):** What kind of numbers the tensor holds. Common types:
- \`float32\` -- the standard for neural network computations
- \`float64\` -- higher precision, rarely needed in DL
- \`uint8\` -- unsigned 8-bit integers (0-255), common for raw image pixels
- \`int64\` -- integers, often used for labels and indices

Let's see these in action with the MNIST data:

\`\`\`python
from keras.datasets import mnist
(train_images, train_labels), _ = mnist.load_data()

train_images.ndim    # 3
train_images.shape   # (60000, 28, 28)
train_images.dtype   # uint8
\`\`\`

So MNIST training images form a rank-3 tensor of 8-bit integers: 60,000 matrices of 28x28 values, where each value ranges from 0 (black) to 255 (white).

Here's a practical tip: when something goes wrong in deep learning code (and it will), the first thing to check is usually tensor shapes and dtypes. A mismatch is the most common source of errors. Get in the habit of printing \`.shape\` and \`.dtype\` at every step.
`,
      reviewCardIds: ['rc-1.7-6', 'rc-1.7-7', 'rc-1.7-8'],
      codeExamples: [
        {
          title: 'Inspecting tensor attributes of a Keras model\'s weights',
          language: 'python',
          code: `import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(512, activation="relu", input_shape=(784,)),
    layers.Dense(10, activation="softmax"),
])

for w in model.weights:
    print(f"{w.name}: shape={w.shape}, dtype={w.dtype}")
# dense/kernel: shape=(784, 512), dtype=float32
# dense/bias:   shape=(512,),     dtype=float32
# dense_1/kernel: shape=(512, 10), dtype=float32
# dense_1/bias:   shape=(10,),     dtype=float32`,
        },
        {
          title: 'Checking dtype conversions (a common debugging task)',
          language: 'python',
          code: `import numpy as np
from keras.datasets import mnist
(train_images, _), _ = mnist.load_data()

print(train_images.dtype)  # uint8 (raw pixels)

# Convert for neural network input
processed = train_images.astype("float32") / 255.0
print(processed.dtype)     # float32
print(processed.min(), processed.max())  # 0.0 1.0`,
        },
      ],
    },
    {
      id: '1.7.4',
      title: 'Why "Dimension" Is Confusing',
      content: `
Before we move on, let's clear up a common source of confusion. The word "dimension" means two different things in tensor discussions:

1. **The number of axes** (the rank): "This is a 3D tensor" means it has 3 axes.
2. **The number of entries along one axis**: "A 5-dimensional vector" means it has 5 entries along its single axis.

A "5D vector" and a "5D tensor" are *completely different things*:
- A 5D vector is a rank-1 tensor with 5 entries -- shape \`(5,)\`
- A 5D tensor has 5 *axes* -- it might have shape \`(4, 240, 144, 256, 3)\`

To avoid ambiguity, we use:
- **Rank** (or \`ndim\`) for the number of axes
- **Shape** for the sizes along each axis
- **Axis** for a specific direction in the tensor

When someone says "the tensor has 3 dimensions," ask yourself: do they mean 3 axes (rank 3), or 3 entries along some axis? Context usually makes it clear, but when writing code or documentation, precision matters.

The total number of scalar values in a tensor is the product of all numbers in its shape. A tensor of shape \`(3, 5, 2)\` contains 3 * 5 * 2 = 30 numbers. A shape \`(60000, 28, 28)\` tensor holds 60,000 * 28 * 28 = 47,040,000 numbers. These calculations become second nature quickly.
`,
      reviewCardIds: ['rc-1.7-9', 'rc-1.7-10'],
      codeExamples: [
        {
          title: 'Computing total elements from shape',
          language: 'python',
          code: `import numpy as np

shape = (60000, 28, 28)
total = np.prod(shape)
print(f"Shape {shape} holds {total:,} elements")
# Shape (60000, 28, 28) holds 47,040,000 elements

# Memory usage depends on dtype
bytes_uint8 = total * 1        # ~45 MB
bytes_float32 = total * 4      # ~180 MB
print(f"uint8: {bytes_uint8 / 1e6:.0f} MB")
print(f"float32: {bytes_float32 / 1e6:.0f} MB")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- A tensor is a container for numerical data, generalized from scalars (rank 0) through vectors (rank 1), matrices (rank 2), and beyond.
- Every tensor has three key attributes: rank (ndim), shape, and dtype.
- MNIST images are a rank-3 tensor of shape (60000, 28, 28) with dtype uint8.
- In deep learning you'll mostly work with ranks 0-4 (rank 5 for video).
- "Dimension" is ambiguous -- prefer "rank" for number of axes, "shape" for sizes along axes.
- Total elements = product of all shape dimensions. Always check shapes when debugging.`,
};

export default lesson;
