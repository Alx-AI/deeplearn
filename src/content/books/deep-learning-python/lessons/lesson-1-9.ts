/**
 * Lesson 1.9: Tensor Operations
 *
 * Covers: Element-wise ops, broadcasting, tensor product, reshaping, geometric interpretation
 * Source sections: 2.3.1-2.3.6
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.9',
  title: 'Tensor Operations',
  sections: [
    {
      id: '1.9.1',
      title: 'Element-Wise Operations',
      content: `
Neural networks are built from a small set of tensor operations, just as any computer program reduces to basic operations like AND, OR, and NOT. Let's learn the fundamental building blocks.

Recall that a Dense layer computes:

\`\`\`python
output = relu(matmul(input, W) + b)
\`\`\`

Three operations here: a tensor product (\`matmul\`), an addition (\`+\`), and a relu. Let's start with the simplest kind: **element-wise operations**.

An element-wise operation applies independently to each entry in the tensor. Addition, multiplication, and relu are all element-wise. If you add two matrices of the same shape, each entry in the result is the sum of the corresponding entries in the inputs. Simple.

\`\`\`python
import numpy as np
z = x + y              # Element-wise addition
z = np.maximum(z, 0.)  # Element-wise relu: max(value, 0)
\`\`\`

The key word is *independently* -- what happens to element $[i, j]$ depends only on the values at $[i, j]$ in the inputs, not on any other elements. This makes element-wise operations trivially parallelizable -- you could compute all entries simultaneously on different processors.

In fact, that's exactly what happens. NumPy delegates to highly optimized BLAS libraries (written in Fortran/C), and on GPUs, these operations use vectorized CUDA implementations that exploit the GPU's thousands of cores. The difference is dramatic: NumPy's built-in \`+\` on two 20x100 matrices runs 1,000 iterations in 0.02 seconds; a naive Python \`for\`-loop implementation takes 2.45 seconds. That's over 100x faster.

Bottom line: always use NumPy/framework operations, never write your own loops over tensor elements. The performance difference is enormous, and it only grows with tensor size.
`,
      reviewCardIds: ['rc-1.9-1', 'rc-1.9-2'],
      illustrations: ['element-wise-ops'],
      codeExamples: [
        {
          title: 'Comparing element-wise operations side by side',
          language: 'python',
          code: `import numpy as np

a = np.array([1.0, -2.0, 3.0, -4.0])
b = np.array([0.5,  1.0, 0.5,  1.0])

print("Add:      ", a + b)           # [ 1.5 -1.0  3.5 -3.0]
print("Multiply: ", a * b)           # [ 0.5 -2.0  1.5 -4.0]
print("Relu:     ", np.maximum(a, 0))  # [1. 0. 3. 0.]
print("Sigmoid:  ", 1 / (1 + np.exp(-a)))  # [0.73 0.12 0.95 0.02]`,
        },
        {
          title: 'Timing NumPy vs Python loops (why vectorization matters)',
          language: 'python',
          code: `import numpy as np
import time

x = np.random.random((1000, 1000))
y = np.random.random((1000, 1000))

# Vectorized NumPy
start = time.time()
z = x + y
print(f"NumPy:  {time.time() - start:.5f}s")

# Naive Python loop (do NOT do this in practice)
start = time.time()
z2 = [[x[i][j] + y[i][j] for j in range(1000)] for i in range(1000)]
print(f"Loops:  {time.time() - start:.5f}s")`,
        },
      ],
    },
    {
      id: '1.9.2',
      title: 'Broadcasting',
      content: `
What happens when you try to operate on two tensors of *different* shapes? For example, in the Dense layer formula \`matmul(input, W) + b\`, the result of the matmul might be shape \`(128, 512)\` while the bias \`b\` has shape \`(512,)\`. How do you add a matrix and a vector?

The answer is **broadcasting**: the smaller tensor is logically "stretched" to match the larger one. In this case, the vector \`b\` of shape \`(512,)\` is broadcast across the batch dimension to effectively become shape \`(128, 512)\` -- the same vector is added to every row.

The mechanics of broadcasting follow two steps:
1. **Add axes** to the smaller tensor until both tensors have the same rank. The vector \`(512,)\` becomes \`(1, 512)\`.
2. **Repeat** the smaller tensor along the new axes. \`(1, 512)\` becomes \`(128, 512)\` by repeating 128 times.

\`\`\`python
X = np.random.random((32, 10))  # Shape (32, 10)
y = np.random.random((10,))     # Shape (10,)
z = X + y  # Broadcasting! y is treated as (32, 10) -- same y added to each row
\`\`\`

Importantly, no memory is actually allocated for the repeated version. Broadcasting is a *virtual* operation -- efficient and invisible at the memory level.

Broadcasting also works with higher-rank tensors:

\`\`\`python
x = np.random.random((64, 3, 32, 10))  # Shape (64, 3, 32, 10)
y = np.random.random((32, 10))          # Shape (32, 10)
z = np.maximum(x, y)  # y is broadcast to (64, 3, 32, 10)
\`\`\`

The general rule: if one tensor has shape $(a, b, \\ldots, n, n{+}1, \\ldots, m)$ and another has shape $(n, n{+}1, \\ldots, m)$, broadcasting happens automatically for axes $a$ through $n{-}1$. The trailing dimensions must match.
`,
      reviewCardIds: ['rc-1.9-3', 'rc-1.9-4'],
      illustrations: ['broadcasting'],
      codeExamples: [
        {
          title: 'Broadcasting gotcha: row vector vs column vector',
          language: 'python',
          code: `import numpy as np

row = np.array([1, 2, 3])        # shape (3,)
col = np.array([[10], [20], [30]])  # shape (3, 1)

# These produce VERY different results!
result = row + col  # shape (3, 3) -- full outer addition
print(result)
# [[11 12 13]
#  [21 22 23]
#  [31 32 33]]`,
        },
        {
          title: 'Normalizing features using broadcasting (zero-mean, unit-variance)',
          language: 'python',
          code: `import numpy as np

# 100 samples, 5 features each
data = np.random.random((100, 5)) * 100

# Compute mean and std per feature (along axis 0)
mean = data.mean(axis=0)  # shape (5,)
std = data.std(axis=0)    # shape (5,)

# Broadcasting: (100, 5) - (5,) / (5,) works automatically
normalized = (data - mean) / std
print(f"Before: mean={data.mean(axis=0).round(1)}")
print(f"After:  mean={normalized.mean(axis=0).round(1)}")`,
        },
      ],
    },
    {
      id: '1.9.3',
      title: 'The Tensor Product (Dot Product)',
      content: `
The **tensor product** (also called dot product or matmul) is the most important operation in deep learning. It's how layers connect to each other.

For two vectors, the dot product multiplies corresponding elements and sums the results:

\`\`\`python
x = np.random.random((32,))
y = np.random.random((32,))
z = np.matmul(x, y)  # or x @ y -- a single scalar
\`\`\`

For a matrix and a vector, each row of the matrix is dot-multiplied with the vector:

\`\`\`python
# x shape: (3, 4), y shape: (4,) --> result shape: (3,)
# Each of the 3 rows of x is dot-multiplied with y
\`\`\`

For two matrices, it's the classic matrix multiplication:

\`\`\`python
# x shape: (a, b), y shape: (b, c) --> result shape: (a, c)
z = x @ y
\`\`\`

The critical rule: the last dimension of the first tensor must match the first dimension of the second tensor. Shape \`(64, 256) @ (256, 128)\` works -- the shared dimension 256 "contracts" -- producing shape \`(64, 128)\`.

In a Dense layer, the core computation is:

\`\`\`python
output = input @ W + b
# input: (batch_size, 784)
# W:     (784, 512)
# output: (batch_size, 512)
# b:     (512,) -- broadcast across the batch
\`\`\`

The matmul transforms each 784-element input vector into a 512-element output vector, using the weight matrix $W$ as the transformation. Every connection between input features and output features is encoded in $W$. This is why it's called a "fully connected" or "dense" layer -- every input connects to every output through the weight matrix.
`,
      reviewCardIds: ['rc-1.9-5', 'rc-1.9-6', 'rc-1.9-7'],
      illustrations: ['tensor-product'],
      codeExamples: [
        {
          title: 'Matrix multiplication with a Keras Dense layer',
          language: 'python',
          code: `import keras
from keras import layers
import numpy as np

# A Dense layer IS a matrix multiply + bias add
dense = layers.Dense(3, input_shape=(4,))
dense.build((None, 4))

x = np.random.random((2, 4))  # 2 samples, 4 features
out = dense(x)
print(f"Input:  {x.shape}")   # (2, 4)
print(f"Output: {out.shape}")  # (2, 3)

# Under the hood: output = x @ kernel + bias
kernel, bias = dense.get_weights()
print(f"Kernel: {kernel.shape}")  # (4, 3)
print(f"Bias:   {bias.shape}")    # (3,)`,
        },
        {
          title: 'Shape compatibility check for matmul',
          language: 'python',
          code: `import numpy as np

a = np.random.random((64, 256))
b = np.random.random((256, 128))
c = a @ b
print(f"{a.shape} @ {b.shape} = {c.shape}")
# (64, 256) @ (256, 128) = (64, 128)

# This will FAIL: inner dimensions don't match
try:
    bad = np.random.random((64, 256)) @ np.random.random((64, 128))
except ValueError as e:
    print(f"Error: {e}")`,
        },
      ],
    },
    {
      id: '1.9.4',
      title: 'Reshaping and Geometric Interpretation',
      content: `
**Tensor reshaping** rearranges a tensor's elements into a new shape without changing the data:

\`\`\`python
x = np.array([[0, 1], [2, 3], [4, 5]])
x.shape          # (3, 2) -- 6 elements
x.reshape((6, 1))  # 6 rows, 1 column -- same 6 elements
x.reshape((2, 3))  # 2 rows, 3 columns -- same 6 elements
\`\`\`

The total number of elements must stay the same: $3 \\times 2 = 6 \\times 1 = 2 \\times 3 = 6$. A common special case is **transposition** -- swapping rows and columns:

\`\`\`python
x = np.zeros((300, 20))
x = np.transpose(x)
x.shape  # (20, 300)
\`\`\`

We used reshaping in the MNIST example to flatten 28x28 images into 784-element vectors: \`train_images.reshape((60000, 784))\`.

Now here's a beautiful insight: all tensor operations have a **geometric interpretation**. If you think of tensor values as coordinates in a geometric space:

- **Addition** translates a point (moves it without distortion)
- **Matrix multiplication** can implement rotation, scaling, or skewing
- **Affine transform** (matrix multiply + addition) is exactly what a Dense layer does: $y = Wx + b$
- **relu activation** introduces non-linearity by zeroing out negative values

This is critical: without activation functions, stacking multiple Dense layers would be pointless. Why? Because $\\text{affine}(\\text{affine}(x))$ is still just a single affine transform. $W_2(W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2)$ -- it collapses into one layer. Activation functions like relu break this linearity, enabling deep networks to learn complex, nonlinear transformations.

The beautiful mental model: a deep network uncrumples a ball of crumpled paper. Imagine two sheets (two classes) crumpled together. The network learns a sequence of gentle geometric transformations that smoothly separate them -- each layer uncrumples a little bit more.
`,
      reviewCardIds: ['rc-1.9-8', 'rc-1.9-9', 'rc-1.9-10'],
      illustrations: ['geometric-interpretation'],
      codeExamples: [
        {
          title: 'Reshape and transpose in practice',
          language: 'python',
          code: `import numpy as np

# Flatten a batch of images for a Dense layer
images = np.random.random((128, 28, 28))
flat = images.reshape((128, 784))
print(f"Before: {images.shape} -> After: {flat.shape}")

# Reshape back to visualize
restored = flat.reshape((128, 28, 28))
print(np.allclose(images, restored))  # True -- no data lost`,
        },
        {
          title: 'Why stacking Dense layers without activation collapses',
          language: 'python',
          code: `import numpy as np

# Two linear transforms in sequence
W1 = np.random.random((4, 8))
b1 = np.random.random((8,))
W2 = np.random.random((8, 3))
b2 = np.random.random((3,))

x = np.random.random((1, 4))

# Two layers without activation
h = x @ W1 + b1
y = h @ W2 + b2

# Equivalent single layer
W_combined = W1 @ W2
b_combined = b1 @ W2 + b2
y_single = x @ W_combined + b_combined
print(np.allclose(y, y_single))  # True -- they are identical!`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Element-wise operations (addition, relu) apply independently to each tensor element and are massively parallelizable.
- Broadcasting automatically stretches smaller tensors to match larger ones -- it's virtual, not a memory copy.
- The tensor product (matmul / @) is the core operation connecting layers: it contracts a shared dimension.
- Shape compatibility for matmul: $(a, b) \\times (b, c) \\rightarrow (a, c)$. The shared dimension $b$ must match.
- Reshaping changes tensor organization without altering data. Transposition swaps axes.
- Tensor operations have geometric meanings: addition = translation, matmul = linear transform, Dense layer = affine transform.
- Activation functions (relu) are essential -- without them, stacked Dense layers collapse into a single linear layer.`,
};

export default lesson;
