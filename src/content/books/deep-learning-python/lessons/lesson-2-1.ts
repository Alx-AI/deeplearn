/**
 * Lesson 2.1: The Framework Landscape
 *
 * Covers: Brief history of DL frameworks, how TF/PyTorch/JAX/Keras relate
 * Source sections: 3.1, 3.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.1',
  title: 'The Framework Landscape',
  sections: [
    {
      id: '2.1.1',
      title: 'A Brief History of Deep Learning Frameworks',
      content: `
When you start doing real deep learning work, you won't be writing matrix multiplications and gradient computations from scratch. You'll use a *framework* -- a software library that handles the heavy lifting. But the landscape of frameworks has a surprisingly interesting history, and understanding it helps you make better choices today.

The story begins with **automatic differentiation** -- the ability to compute gradients of arbitrary mathematical expressions. The first paper on autodiff was published all the way back in 1964, but it took decades for practical implementations to appear. Meanwhile, GPU programming was essentially impossible for most researchers until NVIDIA released **CUDA** in 2006, which let developers run general-purpose computations on graphics cards.

The first framework to combine autodiff with GPU computation was **Theano**, around 2009. Think of Theano as the ancestor of everything you use today. It gained real traction in 2013-2014, right after deep learning's "big bang" moment -- the ImageNet 2012 competition, where a deep neural network dramatically outperformed traditional methods at image recognition.

Then things accelerated rapidly:

- **Keras** launched in March 2015 as a user-friendly layer on top of Theano
- **TensorFlow** arrived in late 2015, backed by Google, bringing distributed computation to the masses
- **PyTorch** followed in 2016, released by Meta (then Facebook), offering a more Pythonic, dynamic experience
- **JAX** came from Google in 2018, taking a radically different functional approach to the same problems

Each new framework learned from the mistakes and successes of its predecessors, and today all four are mature, well-supported tools with distinct strengths.
`,
      reviewCardIds: ['rc-2.1-1', 'rc-2.1-2'],
      illustrations: ['framework-stack'],
      codeExamples: [
        {
          title: 'Installing the major frameworks',
          language: 'bash',
          code: `pip install tensorflow torch jax jaxlib keras`,
        },
        {
          title: 'Importing each framework',
          language: 'python',
          code: `import tensorflow as tf   # Google, 2015
import torch               # Meta, 2016
import jax                 # Google, 2018
import keras               # Chollet, 2015 (high-level API)`,
        },
      ],
    },
    {
      id: '2.1.2',
      title: 'How the Frameworks Relate to Each Other',
      content: `
Here's the crucial insight that will save you a lot of confusion: **Keras and the other three frameworks serve fundamentally different roles.**

TensorFlow, PyTorch, and JAX are *low-level* frameworks. They provide the raw building blocks:

- **Tensors** -- multi-dimensional arrays that hold your data and model parameters
- **Tensor operations** -- math like matrix multiplication, element-wise addition, activation functions
- **Automatic differentiation** -- computing gradients so your model can learn

Keras, by contrast, is a *high-level* framework. It provides the abstractions that make deep learning productive:

- **Layers** that snap together like building blocks
- **Models** that organize layers into trainable systems
- **Loss functions**, **optimizers**, and **metrics** for the training loop
- A simple \`compile()\` and \`fit()\` API that handles the training loop for you

Think of it like building a house. TensorFlow, PyTorch, and JAX are like raw lumber, bricks, and concrete. Keras is like a prefabricated building kit -- it uses those raw materials but gives you walls, doors, and windows you can assemble quickly.

The key design feature of Keras is that it needs a **backend engine** to run. TensorFlow, PyTorch, or JAX can all serve as that backend. This means you can write your model code once in Keras and run it on whichever backend suits your needs -- JAX for maximum speed, PyTorch for Hugging Face compatibility, or TensorFlow for production deployment.
`,
      reviewCardIds: ['rc-2.1-3', 'rc-2.1-4'],
      codeExamples: [
        {
          title: 'Low-level: creating a tensor in each backend',
          language: 'python',
          code: `import tensorflow as tf
import torch
import jax.numpy as jnp

tf_tensor  = tf.constant([[1.0, 2.0], [3.0, 4.0]])
pt_tensor  = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
jax_tensor = jnp.array([[1.0, 2.0], [3.0, 4.0]])`,
        },
        {
          title: 'High-level: building a model in Keras',
          language: 'python',
          code: `import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax"),
])`,
        },
        {
          title: 'Switching the Keras backend',
          language: 'python',
          code: `# Set before importing keras (or in env variable)
import os
os.environ["KERAS_BACKEND"] = "jax"  # "tensorflow" or "torch"
import keras`,
        },
      ],
    },
    {
      id: '2.1.3',
      title: 'Three Shared Capabilities, Many Different Styles',
      content: `
Despite their different APIs and philosophies, all three backend frameworks share three essential capabilities:

1. **Automatic differentiation (autodiff)** -- computing gradients of arbitrary differentiable expressions. This is the engine of learning.
2. **Hardware-accelerated tensor computation** -- running math on CPUs, GPUs, and specialized hardware like Google's TPUs.
3. **Distributed computation** -- spreading work across multiple devices or even multiple machines.

These three capabilities are what unlock all of modern deep learning. Without any one of them, training today's models would be impractical.

Where the frameworks diverge is in their *execution model* and *philosophy*:

- **TensorFlow** offers both eager (immediate) and graph (compiled) execution. It has the most complete ecosystem for production deployment and an enormous API surface.
- **PyTorch** defaults to eager execution, making it feel like writing normal Python. It has first-class Hugging Face support, giving you access to thousands of pretrained models.
- **JAX** takes a functional, stateless approach. Its key primitives -- \`jit\` (compilation), \`grad\` (differentiation), and \`vmap\` (vectorization) -- are *composable function transformations*. This design makes JAX exceptionally fast and scalable but requires a different way of thinking.

What about the future? Three things seem certain: Python will remain the dominant language for ML, we'll continue to live in a multiframework world (which is exactly why Keras's backend-agnostic design is so valuable), and new hardware will need to integrate with existing frameworks to succeed. Learning the fundamentals across all four frameworks is a smart investment.
`,
      reviewCardIds: ['rc-2.1-5', 'rc-2.1-6'],
      illustrations: ['tf-vs-pytorch'],
      codeExamples: [
        {
          title: 'Autodiff in TensorFlow',
          language: 'python',
          code: `import tensorflow as tf
x = tf.Variable(3.0)
with tf.GradientTape() as tape:
    y = x ** 2
print(tape.gradient(y, x))  # 6.0`,
        },
        {
          title: 'Autodiff in PyTorch',
          language: 'python',
          code: `import torch
x = torch.tensor(3.0, requires_grad=True)
y = x ** 2
y.backward()
print(x.grad)  # tensor(6.)`,
        },
        {
          title: 'Autodiff in JAX',
          language: 'python',
          code: `import jax
f = lambda x: x ** 2
grad_f = jax.grad(f)
print(grad_f(3.0))  # 6.0`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Deep learning frameworks evolved from Theano (2009) through Keras (2015), TensorFlow (2015), PyTorch (2016), and JAX (2018).
- TensorFlow, PyTorch, and JAX are low-level frameworks providing tensors, operations, and autodiff. Keras is a high-level API that runs on top of any of them.
- All three backend frameworks share autodiff, GPU-accelerated tensor computation, and distributed computing.
- Keras uses a backend engine (TF, PyTorch, or JAX), so you can write once and run on any backend.
- Each framework has distinct strengths: TensorFlow for production, PyTorch for ecosystem and Hugging Face, JAX for speed and scalability.`,
};

export default lesson;
