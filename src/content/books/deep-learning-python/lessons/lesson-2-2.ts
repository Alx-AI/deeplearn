/**
 * Lesson 2.2: First Steps with TensorFlow
 *
 * Covers: TF basics, tensors, variables, operations, GradientTape
 * Source sections: 3.3.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.2',
  title: 'First Steps with TensorFlow',
  sections: [
    {
      id: '2.2.1',
      title: 'Tensors and Variables in TensorFlow',
      content: `
TensorFlow is Google's open source machine learning framework, and it's one of the most widely used tools for production-grade deep learning. Let's get our hands dirty with the basics.

Everything in TensorFlow revolves around **tensors** -- multi-dimensional arrays of numbers. Creating them feels a lot like NumPy:

\`\`\`python
import tensorflow as tf

# Create tensors filled with ones or zeros
x = tf.ones(shape=(2, 3))    # 2x3 matrix of ones
y = tf.zeros(shape=(4, 1))   # 4x1 column of zeros

# Create from specific values
z = tf.constant([1, 2, 3], dtype="float32")

# Random tensors
r = tf.random.normal(shape=(3, 1), mean=0., stddev=1.)
u = tf.random.uniform(shape=(3, 1), minval=0., maxval=1.)
\`\`\`

Here's a critical difference from NumPy: **TensorFlow tensors are immutable.** You cannot assign to individual elements. Try \`x[0, 0] = 5.0\` and you'll get an error. This is by design -- immutability helps TensorFlow optimize computations behind the scenes.

But if tensors are immutable, how do we store model weights that need to change during training? That's where **\`tf.Variable\`** comes in. A Variable wraps a tensor and provides methods to modify its value:

\`\`\`python
v = tf.Variable(initial_value=tf.random.normal(shape=(3, 1)))

# Update the entire variable
v.assign(tf.ones((3, 1)))

# Update a single element
v[0, 0].assign(3.0)

# Efficient in-place add and subtract
v.assign_add(tf.ones((3, 1)))   # like +=
v.assign_sub(tf.ones((3, 1)))   # like -=
\`\`\`

Think of \`tf.constant\` as a number carved in stone and \`tf.Variable\` as a number written on a whiteboard -- one is permanent, the other is meant to be updated.
`,
      reviewCardIds: ['rc-2.2-1', 'rc-2.2-2'],
      illustrations: ['tf-vs-pytorch'],
      codeExamples: [
        {
          title: 'Inspecting tensor properties',
          language: 'python',
          code: `import tensorflow as tf
x = tf.constant([[1.0, 2.0], [3.0, 4.0]])
print(x.shape)    # (2, 2)
print(x.dtype)    # <dtype: 'float32'>
print(x.numpy())  # Convert to NumPy array`,
        },
        {
          title: 'tf.Variable vs tf.constant mutability',
          language: 'python',
          code: `import tensorflow as tf
c = tf.constant([1.0, 2.0])
# c[0].assign(5.0)  # ERROR: tensors are immutable

v = tf.Variable([1.0, 2.0])
v[0].assign(5.0)    # OK: Variables are mutable
print(v)            # <tf.Variable: [5.0, 2.0]>`,
        },
      ],
    },
    {
      id: '2.2.2',
      title: 'Tensor Operations and the GradientTape',
      content: `
TensorFlow provides a comprehensive library of tensor operations, mirroring what you'd find in NumPy:

\`\`\`python
a = tf.ones((2, 2))
b = tf.square(a)           # element-wise square
c = tf.sqrt(a)             # element-wise square root
d = b + c                  # element-wise addition
e = tf.matmul(a, b)        # matrix multiplication
f = tf.concat((a, b), axis=0)  # concatenation
\`\`\`

You can even express a Dense layer as a simple function:

\`\`\`python
def dense(inputs, W, b):
    return tf.nn.relu(tf.matmul(inputs, W) + b)
\`\`\`

Now here's where TensorFlow pulls ahead of plain NumPy: **automatic gradient computation.** The \`GradientTape\` is TensorFlow's mechanism for recording operations so it can compute derivatives. Open a tape scope, perform some computation, then ask the tape for gradients:

\`\`\`python
input_var = tf.Variable(initial_value=3.0)
with tf.GradientTape() as tape:
    result = tf.square(input_var)    # result = 9.0
gradient = tape.gradient(result, input_var)  # gradient = 6.0
\`\`\`

The math checks out: the derivative of $x^2$ is $2x$, and at $x = 3$ that gives $6.0$. The GradientTape tracked the \`square\` operation and computed the gradient automatically.

By default, the tape only watches **trainable variables** (instances of \`tf.Variable\`). If you need gradients with respect to a constant tensor, you must explicitly tell the tape to watch it with \`tape.watch()\`:

\`\`\`python
input_const = tf.constant(3.0)
with tf.GradientTape() as tape:
    tape.watch(input_const)
    result = tf.square(input_const)
gradient = tape.gradient(result, input_const)
\`\`\`

This selective tracking is intentional -- storing gradient information for every tensor would be wasteful. The tape only records what it needs to.
`,
      reviewCardIds: ['rc-2.2-3', 'rc-2.2-4', 'rc-2.2-5'],
      illustrations: ['gradient-tape-flow'],
      codeExamples: [
        {
          title: 'Computing multiple gradients at once',
          language: 'python',
          code: `import tensorflow as tf
W = tf.Variable(tf.random.normal((2, 1)))
b = tf.Variable(tf.zeros((1,)))
x = tf.constant([[1.0, 2.0]])

with tf.GradientTape() as tape:
    y = tf.matmul(x, W) + b
grad_W, grad_b = tape.gradient(y, [W, b])
print(grad_W.shape, grad_b.shape)  # (2, 1) (1,)`,
        },
        {
          title: 'Using tape.watch() for constants',
          language: 'python',
          code: `import tensorflow as tf
x = tf.constant(5.0)
with tf.GradientTape() as tape:
    tape.watch(x)
    y = 3.0 * x ** 2 + 2.0 * x + 1.0
print(tape.gradient(y, x))  # 32.0  (dy/dx = 6x + 2 at x=5)`,
        },
      ],
    },
    {
      id: '2.2.3',
      title: 'Compilation and Speed',
      content: `
By default, TensorFlow runs in **eager mode** -- operations execute immediately, just like regular Python. This is great for debugging because you can inspect intermediate values, set breakpoints, and use standard Python tools.

But eager mode has a cost: each operation goes through the Python interpreter, which adds overhead. For performance-critical code, TensorFlow offers **compilation** via the \`@tf.function\` decorator:

\`\`\`python
@tf.function
def dense(inputs, W, b):
    return tf.nn.relu(tf.matmul(inputs, W) + b)
\`\`\`

When you decorate a function with \`@tf.function\`, TensorFlow lifts the computation out of Python, rewrites it into an optimized "graph," and runs that graph directly. The first call is slower (because the compilation happens then), but all subsequent calls are much faster.

TensorFlow actually offers two levels of compilation:

1. **Graph mode** (the default with \`@tf.function\`) -- rewrites your code into an optimized execution graph
2. **XLA compilation** -- a more aggressive optimization that fuses operations together for even better performance

\`\`\`python
@tf.function(jit_compile=True)   # Enable XLA
def dense(inputs, W, b):
    return tf.nn.relu(tf.matmul(inputs, W) + b)
\`\`\`

XLA can replace two consecutive operations (like \`matmul\` followed by \`relu\`) with a single fused operation that skips materializing the intermediate result. This can deliver significant speedups.

The practical advice: **develop and debug in eager mode, then add \`@tf.function\` for production.** Don't try to optimize before your code is correct -- that's a recipe for painful debugging sessions.

You can also use the GradientTape to compute **second-order gradients** (the gradient of a gradient) by nesting two tapes. For example, if position varies as $4.9 \\cdot t^2$, the second derivative gives you acceleration:

\`\`\`python
time = tf.Variable(0.0)
with tf.GradientTape() as outer_tape:
    with tf.GradientTape() as inner_tape:
        position = 4.9 * time ** 2
    speed = inner_tape.gradient(position, time)
acceleration = outer_tape.gradient(speed, time)  # 9.8
\`\`\`

This capability is rarely needed in standard deep learning, but it's good to know it's available.
`,
      reviewCardIds: ['rc-2.2-6', 'rc-2.2-7'],
      codeExamples: [
        {
          title: 'Comparing eager vs compiled execution',
          language: 'python',
          code: `import tensorflow as tf

def compute_eager(x):
    return tf.reduce_sum(tf.square(x))

@tf.function
def compute_compiled(x):
    return tf.reduce_sum(tf.square(x))

x = tf.random.normal((1000, 1000))
# First call to compiled version is slower (tracing)
# Subsequent calls are faster than eager`,
        },
        {
          title: 'Nested GradientTape for second-order derivatives',
          language: 'python',
          code: `import tensorflow as tf
x = tf.Variable(2.0)
with tf.GradientTape() as outer:
    with tf.GradientTape() as inner:
        y = x ** 3          # y = x^3
    dy_dx = inner.gradient(y, x)   # 3x^2 = 12.0
d2y_dx2 = outer.gradient(dy_dx, x) # 6x  = 12.0
print(dy_dx, d2y_dx2)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- TensorFlow tensors are immutable; use \`tf.Variable\` for mutable state like model weights.
- The \`GradientTape\` records operations to compute gradients automatically -- the foundation of training.
- By default, the tape only tracks \`tf.Variable\` instances; use \`tape.watch()\` for constants.
- Eager mode runs operations immediately (good for debugging); \`@tf.function\` compiles for speed.
- XLA compilation (\`jit_compile=True\`) fuses operations for even better performance.
- Develop in eager mode first, add compilation once the code is correct.`,
};

export default lesson;
