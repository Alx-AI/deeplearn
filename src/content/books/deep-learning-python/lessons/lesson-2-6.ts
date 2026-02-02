/**
 * Lesson 2.6: First Steps with JAX
 *
 * Covers: JAX basics, functional approach, random numbers, jit/grad/vmap
 * Source sections: 3.5.1 through 3.5.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.6',
  title: 'First Steps with JAX',
  sections: [
    {
      id: '2.6.1',
      title: 'A Functional Approach to Deep Learning',
      content: `
JAX is Google's framework for differentiable computation, and it takes a radically different approach from TensorFlow and PyTorch. While those frameworks let you write imperative, stateful code, JAX embraces **functional programming** -- a style where functions have no side effects and never modify external state.

The good news: JAX's numerical API is just NumPy. No new API to learn:

\`\`\`python
from jax import numpy as jnp

jnp.ones(shape=(2, 1))
jnp.zeros(shape=(2, 1))
jnp.array([1, 2, 3], dtype="float32")

# Math is identical to NumPy
a = jnp.ones((2, 2))
b = jnp.square(a)
c = jnp.matmul(a, b)
\`\`\`

But there are two important differences from regular NumPy.

**First: JAX arrays are immutable.** Like TensorFlow tensors, you cannot modify them in place. Instead, you create new arrays:

\`\`\`python
x = jnp.array([1, 2, 3], dtype="float32")
# x[0] = 10   # This would FAIL
new_x = x.at[0].set(10)  # Returns a NEW array: [10, 2, 3]
\`\`\`

The \`.at[].set()\` syntax creates a copy with the modification applied. The original remains unchanged. This immutability is central to JAX's ability to optimize and parallelize your code.

**Second: JAX handles randomness differently.** In NumPy, random number generation relies on hidden global state -- a seed that silently changes with each call. JAX can't have hidden state (it breaks compilation and parallelization), so it requires **explicit random keys**:

\`\`\`python
import jax

key = jax.random.key(42)
x = jax.random.normal(key, shape=(3,))  # Same key = same output
y = jax.random.normal(key, shape=(3,))  # Identical to x!
\`\`\`

To get different random values, you must create new keys by *splitting* existing ones:

\`\`\`python
key1, key2 = jax.random.split(key, num=2)
x = jax.random.normal(key1, shape=(3,))  # Different from y
y = jax.random.normal(key2, shape=(3,))
\`\`\`

This is more work than NumPy's \`np.random\`, but it guarantees reproducibility and enables safe parallelization.
`,
      reviewCardIds: ['rc-2.6-1', 'rc-2.6-2', 'rc-2.6-3'],
      codeExamples: [
        {
          title: 'JAX arrays are immutable -- use .at[].set()',
          language: 'python',
          code: `from jax import numpy as jnp

x = jnp.array([1.0, 2.0, 3.0])
# x[0] = 10  # ERROR: JAX arrays are immutable
new_x = x.at[0].set(10.0)
print(x)      # [1. 2. 3.]  (unchanged)
print(new_x)  # [10.  2.  3.]`,
        },
        {
          title: 'Explicit random keys for reproducible randomness',
          language: 'python',
          code: `import jax

key = jax.random.key(42)
key1, key2 = jax.random.split(key, num=2)
x = jax.random.normal(key1, shape=(3,))
y = jax.random.normal(key2, shape=(3,))
print(x)  # Different from y
print(y)  # Each key produces unique values`,
        },
      ],
    },
    {
      id: '2.6.2',
      title: 'Function Transformations: jit, grad, vmap',
      content: `
JAX's real power comes from its **function transformations** -- functions that take in a function and return a new, transformed version of it. The three key transformations are:

**\`jax.grad\` -- Differentiation as a function transform.** This is the most distinctive feature of JAX. Instead of recording operations on a tape (TensorFlow) or silently tracking a graph (PyTorch), JAX transforms your loss function into a *gradient function*:

\`\`\`python
def compute_loss(input_var):
    return jnp.square(input_var)

grad_fn = jax.grad(compute_loss)   # Returns a NEW function
input_var = jnp.array(3.0)
gradient = grad_fn(input_var)      # gradient = 6.0
\`\`\`

\`jax.grad(f)\` returns a brand new function that computes the gradient of \`f\`. This is *metaprogramming* -- functions that produce functions. The beauty is composability: you can chain transforms freely.

For practical use, \`jax.value_and_grad\` returns both the loss value and the gradient in one call (avoiding redundant computation):

\`\`\`python
grad_fn = jax.value_and_grad(compute_loss)
loss_value, gradient = grad_fn(input_var)
\`\`\`

**\`jax.jit\` -- Just-in-time compilation.** Decorating a function with \`@jax.jit\` compiles it into optimized XLA code, often delivering dramatic speedups:

\`\`\`python
@jax.jit
def dense(inputs, W, b):
    return jax.nn.relu(jnp.matmul(inputs, W) + b)
\`\`\`

The first call is slow (compilation happens then), but all subsequent calls run on the compiled, optimized version.

**\`jax.vmap\` -- Automatic vectorization.** Write a function that handles a single example, and \`vmap\` transforms it to handle an entire batch:

\`\`\`python
def process_single(x):
    return jnp.dot(x, weights)

process_batch = jax.vmap(process_single)  # Now handles batches
\`\`\`

These transforms are *composable*: \`jax.jit(jax.grad(loss_fn))\` gives you a JIT-compiled gradient function. This modularity is what makes JAX exceptionally powerful for research.
`,
      reviewCardIds: ['rc-2.6-4', 'rc-2.6-5', 'rc-2.6-6'],
      illustrations: ['jax-transforms'],
      codeExamples: [
        {
          title: 'jax.grad transforms a function into its gradient function',
          language: 'python',
          code: `import jax
from jax import numpy as jnp

def square_loss(x):
    return jnp.sum(x ** 2)

grad_fn = jax.grad(square_loss)
x = jnp.array([3.0, 4.0])
print(grad_fn(x))  # [6. 8.]  (derivative of x^2 is 2x)`,
        },
        {
          title: 'Composing jit and grad for fast gradient computation',
          language: 'python',
          code: `import jax
from jax import numpy as jnp

def loss_fn(params, x, y):
    pred = jnp.dot(x, params)
    return jnp.mean((pred - y) ** 2)

fast_grad = jax.jit(jax.grad(loss_fn))
params = jnp.array([1.0, 2.0])
x = jnp.ones((5, 2))
y = jnp.array([3.0, 3.0, 3.0, 3.0, 3.0])
print(fast_grad(params, x, y))  # JIT-compiled gradient`,
        },
      ],
    },
    {
      id: '2.6.3',
      title: 'A Linear Classifier in JAX',
      content: `
Let's see these ideas in action with our familiar linear classifier. The key difference from TensorFlow and PyTorch: **everything is stateless.** State (weights) must be passed in as arguments and returned as outputs.

\`\`\`python
def model(inputs, W, b):
    return jnp.matmul(inputs, W) + b

def mean_squared_error(targets, predictions):
    per_sample_losses = jnp.square(targets - predictions)
    return jnp.mean(per_sample_losses)
\`\`\`

For gradient computation, we package everything into a \`compute_loss\` function where the first argument is the state we need gradients for:

\`\`\`python
def compute_loss(state, inputs, targets):
    W, b = state
    predictions = model(inputs, W, b)
    return mean_squared_error(targets, predictions)

grad_fn = jax.value_and_grad(compute_loss)
\`\`\`

The training step must also be stateless -- it receives W and b, and *returns* their updated values:

\`\`\`python
learning_rate = 0.1

@jax.jit
def training_step(inputs, targets, W, b):
    loss, grads = grad_fn((W, b), inputs, targets)
    grad_wrt_W, grad_wrt_b = grads
    W = W - grad_wrt_W * learning_rate
    b = b - grad_wrt_b * learning_rate
    return loss, W, b      # Must return updated state!
\`\`\`

Notice there's no \`assign_sub\` (TensorFlow) or \`torch.no_grad()\` (PyTorch). We simply compute new values for W and b and return them. The full training loop:

\`\`\`python
W = jnp.array(np.random.uniform(size=(2, 1)))
b = jnp.array(np.zeros(shape=(1,)))
for step in range(40):
    loss, W, b = training_step(inputs, targets, W, b)
\`\`\`

JAX's strengths: fastest execution among all frameworks (especially on TPUs), NumPy-compatible API, and extreme scalability. Its functional style requires more discipline but unlocks powerful optimizations. The tradeoff: debugging compiled JAX code can be harder than debugging eager PyTorch, and the stateless pattern takes some getting used to.
`,
      reviewCardIds: ['rc-2.6-7', 'rc-2.6-8'],
      illustrations: ['linear-classifier'],
      codeExamples: [
        {
          title: 'Stateless training step: receive state in, return state out',
          language: 'python',
          code: `import jax
from jax import numpy as jnp

def compute_loss(state, inputs, targets):
    W, b = state
    predictions = jnp.matmul(inputs, W) + b
    return jnp.mean(jnp.square(targets - predictions))

grad_fn = jax.value_and_grad(compute_loss)

@jax.jit
def training_step(inputs, targets, W, b):
    loss, (grad_W, grad_b) = grad_fn((W, b), inputs, targets)
    W = W - 0.1 * grad_W
    b = b - 0.1 * grad_b
    return loss, W, b`,
        },
        {
          title: 'Full JAX training loop',
          language: 'python',
          code: `import numpy as np
from jax import numpy as jnp

# Initialize weights
W = jnp.array(np.random.uniform(size=(2, 1)))
b = jnp.zeros((1,))

for step in range(40):
    loss, W, b = training_step(inputs, targets, W, b)
    if step % 10 == 0:
        print(f"Step {step}, loss: {loss:.4f}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- JAX uses a functional, stateless approach: arrays are immutable, random state is explicit, functions return updated state.
- JAX's API mirrors NumPy, making it easy to learn if you know NumPy.
- The three key transforms: \`jax.grad\` (differentiation), \`jax.jit\` (compilation), \`jax.vmap\` (vectorization) -- all composable.
- \`jax.grad(f)\` returns a new function that computes the gradient of f -- differentiation as metaprogramming.
- Random numbers require explicit keys: \`jax.random.key()\` and \`jax.random.split()\` instead of global state.
- JAX is the fastest framework, especially on TPUs, but requires disciplined stateless coding.`,
};

export default lesson;
