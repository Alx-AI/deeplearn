/**
 * Lesson 1.10: Gradient-Based Optimization
 *
 * Covers: Derivatives, gradients, SGD, backpropagation
 * Source sections: 2.4.1-2.4.4
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.10',
  title: 'Gradient-Based Optimization',
  sections: [
    {
      id: '1.10.1',
      title: 'Derivatives: The Slope of Change',
      content: `
We've seen that training adjusts weights to reduce the loss. But *how* does the optimizer know which direction to adjust each weight? The answer lies in one of the most powerful ideas in mathematics: the **derivative**.

Consider a smooth, continuous function \`f(x) = y\`. If you nudge \`x\` by a tiny amount \`epsilon\`, the output \`y\` changes by some proportional amount. The derivative tells you the *ratio* -- how much \`y\` changes per unit change in \`x\`. Geometrically, it's the **slope** of the curve at that point.

If the derivative is positive at some point, increasing \`x\` will increase \`f(x)\`. If it's negative, increasing \`x\` will *decrease* \`f(x)\`. And the magnitude tells you how fast: a derivative of 3 means \`y\` changes 3 times as fast as \`x\`.

This is immediately useful for **optimization** -- finding the input that minimizes the output. If you want to make \`f(x)\` smaller:
- Check the derivative at the current point
- If the derivative is positive, move \`x\` a little to the *left* (decrease it)
- If the derivative is negative, move \`x\` a little to the *right* (increase it)
- In both cases, you're moving *against* the derivative

You're walking downhill on the curve of the function. That's the core intuition behind **gradient descent**.

Now, our neural network doesn't have a single number \`x\` -- it has millions of weights. Each weight is like a separate dial that affects the loss. We need to know the slope of the loss with respect to *every single weight simultaneously*. That generalization of the derivative to multiple inputs is called the **gradient**.
`,
      reviewCardIds: ['rc-1.10-1', 'rc-1.10-2'],
      illustrations: ['derivative-slope'],
      codeExamples: [
        {
          title: 'Numerical derivative approximation',
          language: 'python',
          code: `import numpy as np

def f(x):
    return x ** 2 + 3 * x + 1

# Approximate derivative at x=2 using a tiny epsilon
x = 2.0
epsilon = 1e-7
slope = (f(x + epsilon) - f(x)) / epsilon
print(f"Numerical derivative at x=2: {slope:.4f}")
# Analytical answer: f'(x) = 2x + 3, so f'(2) = 7.0`,
        },
        {
          title: 'Computing a derivative with tf.GradientTape',
          language: 'python',
          code: `import tensorflow as tf

x = tf.Variable(2.0)
with tf.GradientTape() as tape:
    y = x ** 2 + 3 * x + 1

dy_dx = tape.gradient(y, x)
print(f"dy/dx at x=2: {dy_dx.numpy()}")  # 7.0`,
        },
      ],
    },
    {
      id: '1.10.2',
      title: 'Gradients and Gradient Descent',
      content: `
The **gradient** of the loss with respect to the weights is a tensor that has the same shape as the weight tensor. Each entry tells you: "if I nudge this particular weight up by a tiny amount, how much will the loss increase?"

For a concrete example:

\`\`\`python
y_pred = matmul(x, W)                    # Make predictions
loss_value = loss(y_pred, y_true)         # Compute the loss
gradient = grad(loss_value, W)            # Gradient: same shape as W
\`\`\`

The gradient \`grad(loss_value, W)\` is a tensor where each entry \`[i, j]\` tells you the direction and magnitude of the loss change when you modify \`W[i, j]\`. It points in the direction of **steepest increase** of the loss.

Since we want to *decrease* the loss, we move in the **opposite** direction:

\`\`\`python
W_new = W - learning_rate * gradient
\`\`\`

This is **gradient descent** in a nutshell: compute the gradient, then step in the opposite direction. The **learning rate** is a small positive number (like 0.001) that controls the step size. It's crucial:

- **Too large:** You overshoot the minimum. The loss might oscillate wildly or even increase.
- **Too small:** You barely move each step. Training takes forever and might get stuck in a local minimum.
- **Just right:** Steady, reliable progress toward lower loss.

Could we find the exact minimum analytically (by solving \`gradient = 0\`)? In theory, yes. In practice, this means solving a polynomial equation with millions or billions of variables -- completely intractable. Gradient descent gives us a practical alternative: instead of solving for the exact minimum, we walk toward it one small step at a time.
`,
      reviewCardIds: ['rc-1.10-3', 'rc-1.10-4', 'rc-1.10-5'],
      illustrations: ['gradient-descent'],
      codeExamples: [
        {
          title: 'Gradient of loss with respect to model weights',
          language: 'python',
          code: `import tensorflow as tf
import numpy as np

W = tf.Variable(np.random.random((3, 1)).astype("float32"))
x = tf.constant([[1.0, 2.0, 3.0]])
y_true = tf.constant([[1.0]])

with tf.GradientTape() as tape:
    y_pred = x @ W
    loss = tf.reduce_mean((y_pred - y_true) ** 2)

grad = tape.gradient(loss, W)
print(f"W shape: {W.shape}, Gradient shape: {grad.shape}")
# Both are (3, 1) -- gradient matches the weight tensor`,
        },
        {
          title: 'Manual gradient descent step',
          language: 'python',
          code: `import tensorflow as tf

W = tf.Variable([5.0])
learning_rate = 0.1

for step in range(20):
    with tf.GradientTape() as tape:
        loss = (W - 3.0) ** 2  # minimum at W=3
    grad = tape.gradient(loss, W)
    W.assign_sub(learning_rate * grad)  # W -= lr * grad

print(f"Final W: {W.numpy()[0]:.4f}")  # ~3.0000`,
        },
      ],
    },
    {
      id: '1.10.3',
      title: 'Stochastic Gradient Descent (SGD)',
      content: `
In practice, we don't compute the gradient over the entire dataset before each weight update. That would be **batch gradient descent** -- computing the true gradient using all training samples. For a dataset of millions of examples, each weight update would take an enormous amount of time and memory.

Instead, we use **mini-batch stochastic gradient descent (SGD)**. The word "stochastic" means "random" -- we compute the gradient on a randomly selected small batch of data (typically 32-256 samples) and update the weights based on that. Each batch gives us an *estimate* of the true gradient -- noisy but fast.

The full SGD algorithm:
1. **Draw** a random batch of training samples and their labels
2. **Forward pass:** run the model on the batch to get predictions
3. **Compute loss:** measure how wrong the predictions are
4. **Backward pass:** compute the gradient of the loss with respect to all weights
5. **Update weights:** \`W -= learning_rate * gradient\`
6. **Repeat** until the loss is sufficiently low

Each pass through the entire training set is called an **epoch**. With 60,000 samples and a batch size of 128, one epoch has 469 batches (and 469 weight updates). Training for 5 epochs means 2,345 total updates.

Why does the randomness in SGD actually *help*? The noise in gradient estimates can push the optimization out of local minima -- shallow valleys in the loss landscape where pure gradient descent would get stuck.

There are also fancier variants of SGD, like **SGD with momentum**, **RMSprop**, and **Adam** (which we used in the MNIST example). These remember information from previous steps to make smarter updates. The momentum concept is intuitive: imagine a ball rolling down a hilly landscape. With momentum, it builds up speed on slopes and can roll through small bumps rather than getting trapped. The "adam" optimizer in our MNIST example combines several of these clever tricks.
`,
      reviewCardIds: ['rc-1.10-6', 'rc-1.10-7', 'rc-1.10-8'],
      illustrations: ['sgd-variants'],
      codeExamples: [
        {
          title: 'Mini-batch SGD training loop from scratch',
          language: 'python',
          code: `import tensorflow as tf
import numpy as np

# Toy dataset: y = 2*x + 1
x_train = np.random.random((1000, 1)).astype("float32")
y_train = 2 * x_train + 1 + 0.1 * np.random.randn(1000, 1).astype("float32")

W = tf.Variable([[0.0]])
b = tf.Variable([0.0])
lr = 0.1

for epoch in range(5):
    for i in range(0, 1000, 32):  # batch_size=32
        xb = tf.constant(x_train[i:i+32])
        yb = tf.constant(y_train[i:i+32])
        with tf.GradientTape() as tape:
            pred = xb @ W + b
            loss = tf.reduce_mean((pred - yb) ** 2)
        grads = tape.gradient(loss, [W, b])
        W.assign_sub(lr * grads[0])
        b.assign_sub(lr * grads[1])

print(f"Learned: y = {W.numpy()[0][0]:.2f}*x + {b.numpy()[0]:.2f}")`,
        },
        {
          title: 'Comparing Keras optimizers on the same problem',
          language: 'python',
          code: `import keras
from keras import layers

def build_and_train(optimizer_name):
    model = keras.Sequential([layers.Dense(1, input_shape=(1,))])
    model.compile(optimizer=optimizer_name, loss="mse")
    history = model.fit(x_train, y_train, epochs=10,
                        batch_size=32, verbose=0)
    return history.history["loss"][-1]

for opt in ["sgd", "rmsprop", "adam"]:
    final_loss = build_and_train(opt)
    print(f"{opt:>8s}: final loss = {final_loss:.4f}")`,
        },
      ],
    },
    {
      id: '1.10.4',
      title: 'Backpropagation: The Chain Rule in Action',
      content: `
One question remains: how do we actually *compute* the gradient for a network with many layers? The loss depends on the output layer's weights, but the output layer's input depends on the previous layer's weights, which depend on the layer before that, and so on. How do we trace the effect of an early layer's weight on the final loss?

The answer is the **chain rule** from calculus, applied in an algorithm called **backpropagation**.

The chain rule says: if you have composed functions like \`y = f(g(x))\`, then the derivative of \`y\` with respect to \`x\` is the product of the individual derivatives: \`grad(y, x) = grad(y, g(x)) * grad(g(x), x)\`.

A neural network is exactly a chain of composed functions. Our MNIST model computes:

\`\`\`python
loss_value = loss(softmax(matmul(relu(matmul(input, W1) + b1), W2) + b2), y_true)
\`\`\`

Each operation (matmul, +, relu, softmax, loss) has a simple, known derivative. The chain rule lets us multiply these derivatives together to get the gradient of the loss with respect to any weight, no matter how many layers deep.

**Backpropagation** simply applies this chain rule systematically:
1. **Forward pass:** compute the output, saving intermediate values at each layer
2. **Backward pass:** starting from the loss, compute gradients layer by layer, working *backward* from the output toward the input

The name "back-propagation" comes from this backward flow: gradient information propagates from the loss back through the network.

The wonderful news: **you never have to implement this yourself.** Modern frameworks (Keras, PyTorch, JAX) provide **automatic differentiation** -- you define the forward pass, and the framework handles all gradient computations automatically. It records your operations into a computation graph and applies the chain rule behind the scenes.

This is the complete picture of how neural networks learn: forward pass produces predictions, loss measures errors, backpropagation computes gradients, and the optimizer updates weights. Repeat thousands of times, and the network converges to a useful set of parameters.
`,
      reviewCardIds: ['rc-1.10-9', 'rc-1.10-10', 'rc-1.10-11'],
      illustrations: ['backpropagation-flow'],
      codeExamples: [
        {
          title: 'Watching GradientTape trace through multiple operations',
          language: 'python',
          code: `import tensorflow as tf

x = tf.Variable(2.0)
with tf.GradientTape() as tape:
    a = x * 3         # a = 6
    b = a + 1          # b = 7
    c = b ** 2         # c = 49
    # Chain rule: dc/dx = dc/db * db/da * da/dx
    #           = 2*b   *   1   *   3   = 42

grad = tape.gradient(c, x)
print(f"dc/dx = {grad.numpy()}")  # 42.0`,
        },
        {
          title: 'Automatic differentiation in a real Keras training step',
          language: 'python',
          code: `import tensorflow as tf
import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(64, activation="relu", input_shape=(784,)),
    layers.Dense(10, activation="softmax"),
])
loss_fn = keras.losses.SparseCategoricalCrossentropy()
optimizer = keras.optimizers.Adam(learning_rate=0.001)

# One manual training step (what model.fit does internally)
x_batch = tf.random.normal((32, 784))
y_batch = tf.random.uniform((32,), 0, 10, dtype=tf.int32)

with tf.GradientTape() as tape:
    predictions = model(x_batch, training=True)
    loss = loss_fn(y_batch, predictions)

gradients = tape.gradient(loss, model.trainable_weights)
optimizer.apply_gradients(zip(gradients, model.trainable_weights))
print(f"Loss: {loss.numpy():.4f}, Num gradients: {len(gradients)}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- A derivative tells you the slope (rate of change) of a function -- how the output changes when you nudge the input.
- The gradient generalizes derivatives to tensors: it has the same shape as the weights and points toward steepest loss increase.
- Gradient descent moves weights in the opposite direction of the gradient to reduce the loss.
- The learning rate controls step size: too large = overshooting, too small = slow convergence.
- Mini-batch SGD computes gradients on random batches for a practical balance of speed and accuracy.
- Backpropagation uses the chain rule to compute gradients through many layers, from output back to input.
- Modern frameworks handle backpropagation automatically -- you only write the forward pass.`,
};

export default lesson;
