/**
 * Lesson 1.3: The "Deep" in Deep Learning
 *
 * Covers: What deep means, layered representations, how DL works
 * Source sections: 1.5, 1.6
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.3',
  title: 'The "Deep" in Deep Learning',
  sections: [
    {
      id: '1.3.1',
      title: 'Layers, Representations, and Neural Networks',
      content: `
Let's get concrete about what a deep learning model actually looks like inside. Imagine you're building a system to recognize handwritten digits. The input is a 28x28 pixel image -- just a grid of numbers representing brightness values. The output should be a digit label: 0 through 9.

A deep learning model for this task might have five layers. Each layer transforms the data into a new representation:

- **Layer 1** learns to detect simple edges and contrasts
- **Layer 2** combines edges into simple shapes (curves, corners)
- **Layer 3** assembles shapes into recognizable parts (loops, strokes)
- **Layer 4** combines parts into candidate digit patterns
- **Layer 5** maps those patterns to one of the 10 digit classes

Each layer's output is a new representation of the original image -- one that's a little less about raw pixel values and a little more about *what the image means* for the task at hand. The book describes this beautifully as a "multistage information-distillation process," where data goes through successive filters and comes out increasingly *purified* for the task.

These layered representations are learned through models called **neural networks**, named after a loose analogy with biological neurons. The layers are literally stacked on top of each other, with each layer's output feeding into the next layer's input.

But here's the key question: how does each layer *know* what transformation to apply? The answer is that each layer's behavior is determined by its **weights** -- a set of numbers that get adjusted during training. The process of finding the right weights is what "training" means.
`,
      reviewCardIds: ['rc-1.3-1', 'rc-1.3-2'],
      illustrations: ['layered-representations'],
      codeExamples: [
        {
          title: 'Building a 5-layer digit classifier in Keras',
          language: 'python',
          code: `from tensorflow import keras
from keras import layers

model = keras.Sequential([
    layers.Flatten(input_shape=(28, 28)),     # 784 raw pixel values
    layers.Dense(256, activation="relu"),      # Layer 1: edges & contrasts
    layers.Dense(128, activation="relu"),      # Layer 2: simple shapes
    layers.Dense(64, activation="relu"),       # Layer 3: recognizable parts
    layers.Dense(32, activation="relu"),       # Layer 4: digit patterns
    layers.Dense(10, activation="softmax"),    # Layer 5: 10 digit classes
])
model.summary()  # see each layer's output shape and parameter count`,
        },
        {
          title: 'Inspecting a layer\'s weights (parameters)',
          language: 'python',
          code: `# Each layer stores weights that control its transformation
first_dense = model.layers[1]  # first Dense layer (after Flatten)
weights, biases = first_dense.get_weights()
print(f"Weight matrix shape: {weights.shape}")  # (784, 256)
print(f"Bias vector shape:   {biases.shape}")   # (256,)
print(f"Total params in this layer: {weights.size + biases.size:,}")
# These start random and get refined during training`,
        },
      ],
    },
    {
      id: '1.3.2',
      title: 'How Training Actually Works',
      content: `
Understanding the training process is understanding deep learning. There are four key players:

1. **Weights (parameters):** Every layer has a set of numerical weights that control what it does to its input. A neural network might have millions of these. Initially, they're set to random values -- meaning the network starts out performing random, useless transformations.

2. **Loss function:** This measures how far the network's output is from the correct answer. If the network says an image of a "7" is probably a "3", the loss is high. If it correctly says "7", the loss is low. The loss function gives us a single number that quantifies "how wrong are we?"

3. **Optimizer (Backpropagation):** This is the algorithm that figures out how to adjust each weight to reduce the loss. It computes how much each weight contributed to the error and nudges them all in a direction that should make the next prediction a little better.

4. **The training loop:** The process repeats over and over:
   - Feed a batch of data through the network (the **forward pass**)
   - Compute the loss (how wrong were the predictions?)
   - Calculate how to adjust each weight (the **backward pass**)
   - Update the weights by a small amount

Because the weights start at random values, the network's first predictions are garbage -- the loss is very high. But with each pass through the training data, the weights improve a little. After thousands of repetitions, the loss drops to a low value, and the network can make accurate predictions.

This is the mechanism behind the "magic." Repeat simple adjustments enough times, at sufficient scale, and the result looks remarkably intelligent.
`,
      reviewCardIds: ['rc-1.3-3', 'rc-1.3-4', 'rc-1.3-5'],
      illustrations: ['training-loop'],
      codeExamples: [
        {
          title: 'The four key players: model, loss, optimizer, training loop',
          language: 'python',
          code: `from tensorflow import keras
from keras import layers

# 1. Model with weights (parameters)
model = keras.Sequential([
    layers.Flatten(input_shape=(28, 28)),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])

# 2. Loss function: measures how wrong predictions are
# 3. Optimizer: adjusts weights to reduce the loss
model.compile(
    optimizer="adam",                             # the optimizer
    loss="sparse_categorical_crossentropy",       # the loss function
    metrics=["accuracy"],                         # extra tracking
)

# 4. Training loop: forward pass -> loss -> backward pass -> update
# model.fit(train_images, train_labels, epochs=5, batch_size=32)`,
        },
        {
          title: 'Watching the loss decrease during training',
          language: 'python',
          code: `from tensorflow.keras.datasets import mnist

# Load real handwritten digits
(train_images, train_labels), _ = mnist.load_data()
train_images = train_images / 255.0  # normalize to 0-1

# Train and watch the loss drop
history = model.fit(train_images, train_labels,
                    epochs=3, batch_size=64, verbose=1)
# Epoch 1 - loss: ~0.30, accuracy: ~0.91
# Epoch 2 - loss: ~0.14, accuracy: ~0.96
# Epoch 3 - loss: ~0.10, accuracy: ~0.97
# Each epoch, the weights improve and the loss decreases`,
        },
      ],
    },
    {
      id: '1.3.3',
      title: 'Putting It All Together',
      content: `
Let's trace through the entire picture one more time, because it's worth internalizing:

**Before training:** You have a network with random weights. It takes in images but produces random outputs. The loss (error) is huge.

**During training (each iteration):**
1. Take a small batch of training images and their correct labels
2. Pass images through the network -- each layer applies its transformation based on its current weights
3. Compare the network's predictions to the correct labels using the loss function
4. Use the optimizer to compute the gradient -- "for each weight, which direction should I nudge it to reduce the error?"
5. Update every weight by a tiny amount in the right direction
6. Repeat

**After training:** The weights have been adjusted so that the chain of transformations reliably converts images into correct predictions. The network has "learned" -- not by memorizing rules, but by discovering the right sequence of numerical transformations through trial, error, and adjustment.

The elegance of this approach is that *nothing is hard-coded*. You don't tell the network to look for edges or loops or strokes. You just give it data and a feedback signal, and it figures out what representations are useful. This is what makes deep learning so powerful and so general -- the same basic architecture can learn to classify images, translate languages, generate text, or play games. You just change the data and the loss function.

One important detail: the loss function uses the training data to guide learning, but the *real* test of a model is how well it performs on data it has never seen before. This gap between training performance and real-world performance is one of the central challenges of ML -- we'll return to it many times.
`,
      reviewCardIds: ['rc-1.3-6', 'rc-1.3-7', 'rc-1.3-8'],
      codeExamples: [
        {
          title: 'Complete example: train and evaluate on unseen data',
          language: 'python',
          code: `from tensorflow import keras
from keras import layers
from tensorflow.keras.datasets import mnist

# Load data: training set AND a separate test set
(train_images, train_labels), (test_images, test_labels) = mnist.load_data()
train_images, test_images = train_images / 255.0, test_images / 255.0

# Build and train
model = keras.Sequential([
    layers.Flatten(input_shape=(28, 28)),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
model.fit(train_images, train_labels, epochs=5, batch_size=64)

# The REAL test: data the model has never seen
test_loss, test_acc = model.evaluate(test_images, test_labels)
print(f"Test accuracy: {test_acc:.3f}")
# Typically ~0.97 -- but always a bit lower than training accuracy`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Deep learning models are chains of layers, each transforming data into progressively more useful representations.
- Each layer's behavior is controlled by its weights (parameters), which start random and are refined during training.
- The loss function measures how wrong the network's predictions are -- it's the feedback signal.
- The optimizer uses backpropagation to compute how to adjust each weight to reduce the loss.
- The training loop repeats: forward pass, compute loss, backward pass, update weights.
- Nothing is hard-coded -- the network discovers useful representations entirely from data and feedback.`,
};

export default lesson;
