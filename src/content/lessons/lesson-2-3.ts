/**
 * Lesson 2.3: Building with TensorFlow
 *
 * Covers: Linear classifier example in TF, what makes TF unique
 * Source sections: 3.3.2, 3.3.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.3',
  title: 'Building with TensorFlow',
  sections: [
    {
      id: '2.3.1',
      title: 'Building a Linear Classifier from Scratch',
      content: `
Now that you know tensors, variables, operations, and gradients, let's put them all together into a complete machine learning model. We'll build a **linear classifier** -- the simplest possible model that can learn to separate two groups of data points.

First, let's generate some synthetic data: two clusters of 2D points that a line can separate.

\`\`\`python
import numpy as np

num_samples_per_class = 1000
negative_samples = np.random.multivariate_normal(
    mean=[0, 3], cov=[[1, 0.5], [0.5, 1]],
    size=num_samples_per_class
)
positive_samples = np.random.multivariate_normal(
    mean=[3, 0], cov=[[1, 0.5], [0.5, 1]],
    size=num_samples_per_class
)
inputs = np.vstack((negative_samples, positive_samples)).astype(np.float32)
targets = np.vstack((
    np.zeros((num_samples_per_class, 1), dtype="float32"),
    np.ones((num_samples_per_class, 1), dtype="float32"),
))
\`\`\`

We have 2,000 points in a 2D plane, each labeled 0 or 1. The model's job is to find a line that separates them. That line is defined by just three numbers: two weights and a bias.

\`\`\`python
import tensorflow as tf

W = tf.Variable(tf.random.uniform(shape=(2, 1)))
b = tf.Variable(tf.zeros(shape=(1,)))
\`\`\`

The model is an **affine transformation**: prediction = matmul(input, W) + b. For a 2D input point [x, y], this computes \`w1*x + w2*y + b\`. Points where this value exceeds 0.5 are classified as class 1; below 0.5, class 0. The boundary between the two classes is literally a straight line in the plane.

\`\`\`python
def model(inputs, W, b):
    return tf.matmul(inputs, W) + b
\`\`\`

Simple, right? The entire "intelligence" of this model lives in the three numbers W and b, which training will discover.
`,
      reviewCardIds: ['rc-2.3-1', 'rc-2.3-2'],
      illustrations: ['linear-classifier'],
      codeExamples: [
        {
          title: 'Generating and visualizing synthetic 2D data',
          language: 'python',
          code: `import numpy as np
import matplotlib.pyplot as plt

neg = np.random.multivariate_normal([0, 3], [[1, 0.5], [0.5, 1]], 500)
pos = np.random.multivariate_normal([3, 0], [[1, 0.5], [0.5, 1]], 500)
plt.scatter(neg[:, 0], neg[:, 1], label="Class 0")
plt.scatter(pos[:, 0], pos[:, 1], label="Class 1")
plt.legend()
plt.show()`,
        },
        {
          title: 'Affine model as a one-liner',
          language: 'python',
          code: `import tensorflow as tf

W = tf.Variable(tf.random.uniform(shape=(2, 1)))
b = tf.Variable(tf.zeros(shape=(1,)))

# Prediction for a single 2D point [x1, x2]
point = tf.constant([[1.5, 2.0]])
prediction = tf.matmul(point, W) + b
print(prediction)  # Raw output before training`,
        },
      ],
    },
    {
      id: '2.3.2',
      title: 'The Training Loop',
      content: `
We need two more pieces: a **loss function** that measures how wrong our predictions are, and a **training step** that uses gradients to improve the weights.

For the loss, we use mean squared error -- the average of the squared differences between predictions and targets:

\`\`\`python
def mean_squared_error(targets, predictions):
    per_sample_losses = tf.square(targets - predictions)
    return tf.reduce_mean(per_sample_losses)
\`\`\`

Now the training step ties everything together. Inside a GradientTape scope, we run the forward pass and compute the loss. Then we ask the tape for gradients and update the weights:

\`\`\`python
learning_rate = 0.1

@tf.function(jit_compile=True)
def training_step(inputs, targets, W, b):
    with tf.GradientTape() as tape:
        predictions = model(inputs, W, b)
        loss = mean_squared_error(targets, predictions)
    grad_loss_wrt_W, grad_loss_wrt_b = tape.gradient(loss, [W, b])
    W.assign_sub(grad_loss_wrt_W * learning_rate)
    b.assign_sub(grad_loss_wrt_b * learning_rate)
    return loss
\`\`\`

Notice the \`@tf.function(jit_compile=True)\` decorator -- we're compiling this function for speed since it will be called many times. The \`assign_sub\` method subtracts from the variable in place, implementing the gradient descent update rule: **new_weight = old_weight - learning_rate * gradient**.

Running the loop for 40 steps is enough:

\`\`\`python
for step in range(40):
    loss = training_step(inputs, targets, W, b)
    print(f"Loss at step {step}: {loss:.4f}")
\`\`\`

After training, the loss stabilizes around 0.025. The model has found weight values that draw a line neatly separating our two point clouds. That line equation is \`w1*x + w2*y + b = 0.5\` -- a simple, interpretable boundary learned entirely from data.

This is the core pattern of all deep learning: define a model, define a loss, compute gradients, update weights, repeat. Everything else is elaboration on this theme.
`,
      reviewCardIds: ['rc-2.3-3', 'rc-2.3-4'],
      illustrations: ['training-loop'],
      codeExamples: [
        {
          title: 'Complete TensorFlow training loop',
          language: 'python',
          code: `import tensorflow as tf

W = tf.Variable(tf.random.uniform(shape=(2, 1)))
b = tf.Variable(tf.zeros(shape=(1,)))
learning_rate = 0.1

@tf.function(jit_compile=True)
def training_step(inputs, targets):
    with tf.GradientTape() as tape:
        predictions = tf.matmul(inputs, W) + b
        loss = tf.reduce_mean(tf.square(targets - predictions))
    dW, db = tape.gradient(loss, [W, b])
    W.assign_sub(dW * learning_rate)
    b.assign_sub(db * learning_rate)
    return loss`,
        },
        {
          title: 'Monitoring loss over training steps',
          language: 'python',
          code: `for step in range(40):
    loss = training_step(inputs, targets)
    if step % 10 == 0:
        print(f"Step {step:>2d}  Loss: {loss:.4f}")
# Step  0  Loss: 0.6712
# Step 10  Loss: 0.0543
# Step 20  Loss: 0.0298
# Step 30  Loss: 0.0254`,
        },
      ],
    },
    {
      id: '2.3.3',
      title: 'What Makes TensorFlow Unique',
      content: `
Now that you've seen TensorFlow in action, let's consider when and why you'd choose it over the alternatives.

**TensorFlow's key strengths:**

1. **Speed through compilation.** Thanks to graph mode and XLA, TensorFlow is usually significantly faster than PyTorch. (JAX can be even faster in some cases, since it was built from the ground up around XLA.)

2. **Feature completeness.** TensorFlow is the most feature-rich framework available. It offers unique capabilities like string tensors, "ragged tensors" (where different entries can have different sizes -- extremely useful for variable-length sequences), and the high-performance \`tf.data\` API for data preprocessing. The \`tf.data\` pipeline is so good that even JAX users often use it.

3. **Production ecosystem.** TensorFlow has the most mature deployment story. TFX handles production ML workflows, TF-Serving manages model serving, TFLite and MediaPipe handle mobile deployment, and TensorFlow.js runs models in the browser. If you need to ship a model to production, TensorFlow's ecosystem is hard to beat.

**TensorFlow's drawbacks:**

1. **Sprawling API.** The flipside of feature completeness is that TensorFlow has *thousands* of operations. Finding what you need can feel overwhelming.

2. **Inconsistency with NumPy.** TensorFlow's numerical API occasionally differs from NumPy conventions in subtle ways, which can trip you up if you're used to NumPy.

3. **Weaker Hugging Face support.** The popular model-sharing platform Hugging Face has stronger support for PyTorch, so the latest pretrained models may not always be available in TensorFlow.

In practice, TensorFlow is an excellent choice when you care about production deployment, need specialized features like ragged tensors, or want maximum compilation performance. For research prototyping or when you need quick access to pretrained models, you might look at PyTorch or JAX instead. And with Keras sitting on top of all three, you can often defer this choice until deployment time.
`,
      reviewCardIds: ['rc-2.3-5', 'rc-2.3-6'],
      illustrations: ['tf-vs-pytorch'],
      codeExamples: [
        {
          title: 'TensorFlow ragged tensors for variable-length data',
          language: 'python',
          code: `import tensorflow as tf

# Sentences of different lengths
ragged = tf.ragged.constant([
    [1, 2, 3],
    [4, 5],
    [6, 7, 8, 9],
])
print(ragged.shape)  # (3, None) -- variable second dim`,
        },
        {
          title: 'Building a tf.data pipeline',
          language: 'python',
          code: `import tensorflow as tf

dataset = tf.data.Dataset.from_tensor_slices((inputs, targets))
dataset = (dataset
    .shuffle(buffer_size=2000)
    .batch(32)
    .prefetch(tf.data.AUTOTUNE))

for batch_inputs, batch_targets in dataset.take(1):
    print(batch_inputs.shape)  # (32, 2)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- A linear classifier learns a line (or hyperplane) that separates two classes, defined by weights W and bias b.
- The TensorFlow training loop: forward pass inside GradientTape, compute loss, get gradients, update weights with \`assign_sub\`.
- TensorFlow excels at compiled performance, feature completeness, and production deployment.
- The \`@tf.function\` decorator compiles functions for speed; XLA adds further optimization.
- TensorFlow's downsides include a large API surface and occasional inconsistency with NumPy.`,
};

export default lesson;
