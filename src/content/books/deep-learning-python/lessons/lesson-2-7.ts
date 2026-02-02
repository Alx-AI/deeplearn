/**
 * Lesson 2.7: Introduction to Keras
 *
 * Covers: Keras layers, models, compile step, fit method, loss/optimizer selection
 * Source sections: 3.6.1 through 3.6.7
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.7',
  title: 'Introduction to Keras',
  sections: [
    {
      id: '2.7.1',
      title: 'Layers: The Building Blocks',
      content: `
You've now seen how to build models from scratch in TensorFlow, PyTorch, and JAX. It works, but it's tedious -- lots of manual weight management, gradient handling, and training loop boilerplate. **Keras** is the solution: a high-level API that handles all of that for you while running on top of any of those three frameworks.

The fundamental building block in Keras is the **Layer**. A layer is a module that takes in tensors, transforms them, and outputs new tensors. Most layers also maintain **weights** -- learned parameters that get updated during training.

Different layer types handle different data shapes:
- **Dense** (fully connected) layers process 2D data of shape \`(samples, features)\`
- **Conv2D** layers process 4D image data of shape \`(samples, height, width, channels)\`
- **LSTM** layers process 3D sequence data of shape \`(samples, timesteps, features)\`

Think of layers as LEGO bricks. Each brick has a specific shape and purpose, and you snap them together to build something complex. Keras makes this literal -- layers automatically figure out their input shapes:

\`\`\`python
from keras import layers

layer = layers.Dense(32, activation="relu")
\`\`\`

This Dense layer will produce 32-dimensional output vectors. You don't need to specify the input dimension -- Keras infers it automatically the first time data flows through the layer. This **automatic shape inference** means you can stack layers without worrying about dimension bookkeeping:

\`\`\`python
import keras

model = keras.Sequential([
    layers.Dense(32, activation="relu"),
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
\`\`\`

Each layer automatically adapts its weight shapes to match the output of the layer before it. Under the hood, a Dense layer with 32 units creates a weight matrix of shape \`(input_dim, 32)\` and a bias vector of shape \`(32,)\`. The \`input_dim\` is determined the first time actual data arrives.
`,
      reviewCardIds: ['rc-2.7-1', 'rc-2.7-2'],
      illustrations: ['keras-workflow'],
      codeExamples: [
        {
          title: 'Building a Sequential model from layers',
          language: 'python',
          code: `import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(32, activation="relu"),
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
# Weights are created on first call -- no input size needed`,
        },
        {
          title: 'Inspecting layer weights after building',
          language: 'python',
          code: `import numpy as np
from keras import layers

layer = layers.Dense(16, activation="relu")
layer.build(input_shape=(None, 8))  # Trigger weight creation
print(layer.weights[0].shape)  # Kernel: (8, 16)
print(layer.weights[1].shape)  # Bias:   (16,)`,
        },
      ],
    },
    {
      id: '2.7.2',
      title: 'Models and the Compile Step',
      content: `
A **Model** in Keras is a graph of layers. The simplest kind is a **Sequential** model -- a linear stack of layers where data flows through one after another. (Later you'll learn about more complex topologies like multi-branch and residual networks.)

Choosing your model architecture defines the **hypothesis space** -- the set of all possible functions your model could learn. A model with three Dense layers and relu activations can represent a different set of transformations than a model with convolutional layers. Picking the right architecture is part science, part art, and mostly practice.

Once you've defined the architecture, you need to tell Keras *how* to train it. That's the **compile** step, where you specify three things:

1. **Loss function** -- what the model should minimize. This is the feedback signal.
2. **Optimizer** -- the algorithm that adjusts weights to reduce the loss.
3. **Metrics** -- what you want to monitor during training (not optimized directly).

\`\`\`python
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)
\`\`\`

You can pass these as strings (Keras converts them to objects) or as explicit instances for more control:

\`\`\`python
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-4),
    loss=keras.losses.CategoricalCrossentropy(),
    metrics=[keras.metrics.BinaryAccuracy()],
)
\`\`\`

**Choosing the right loss function is critical.** The loss is what the model *actually* optimizes, so it must genuinely reflect your goal. Common pairings:

| Problem Type | Last-Layer Activation | Loss Function |
|---|---|---|
| Binary classification | sigmoid | binary_crossentropy |
| Multiclass classification | softmax | categorical_crossentropy |
| Regression | none (linear) | mean_squared_error |

Compile does not perform any training -- it just configures the training process. Think of it as setting up the rules of the game before play begins.
`,
      reviewCardIds: ['rc-2.7-3', 'rc-2.7-4', 'rc-2.7-5'],
      codeExamples: [
        {
          title: 'Compile with string shortcuts vs explicit objects',
          language: 'python',
          code: `import keras

model = keras.Sequential([...])

# String shortcuts (good for quick experiments)
model.compile(optimizer="adam", loss="mse", metrics=["mae"])

# Explicit objects (when you need fine control)
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-4),
    loss=keras.losses.MeanSquaredError(),
    metrics=[keras.metrics.MeanAbsoluteError()],
)`,
        },
        {
          title: 'Common loss/activation pairings',
          language: 'python',
          code: `import keras
from keras import layers

# Binary classification
model.compile(loss="binary_crossentropy")    # + sigmoid

# Multiclass classification
model.compile(loss="categorical_crossentropy")  # + softmax

# Regression
model.compile(loss="mean_squared_error")     # + no activation`,
        },
      ],
    },
    {
      id: '2.7.3',
      title: 'Training with fit() and Making Predictions',
      content: `
With the model compiled, training happens through the \`fit()\` method. This is where the magic of Keras shines -- one line of code runs the entire training loop:

\`\`\`python
history = model.fit(
    x_train,              # Input data (NumPy array)
    y_train,              # Target labels
    epochs=10,            # Pass through the data 10 times
    batch_size=128,       # Process 128 samples per gradient update
    validation_split=0.2, # Hold out 20% for validation
)
\`\`\`

Internally, \`fit()\` does exactly what you coded by hand in the framework lessons: for each epoch, it iterates over the data in batches, computes the loss, computes gradients, and updates weights. But you don't have to write any of that.

The \`validation_split=0.2\` argument is crucial. It sets aside 20% of your training data as a **validation set** -- data the model never trains on but is evaluated against after each epoch. This lets you detect **overfitting**: if training loss keeps going down but validation loss starts going up, the model is memorizing rather than learning.

The \`history\` object returned by \`fit()\` contains a dictionary of all metric values recorded during training:

\`\`\`python
history.history.keys()
# dict_keys(['loss', 'accuracy', 'val_loss', 'val_accuracy'])
\`\`\`

You can plot these to visualize training progress and spot overfitting.

After training, use \`predict()\` to run inference on new data:

\`\`\`python
predictions = model.predict(new_data)
\`\`\`

Important: \`predict()\` only runs the forward pass. It does **not** update weights -- the model is frozen during inference. Some layers (like Dropout) even behave differently during prediction than during training.

The three-step workflow -- **build, compile, fit** -- is the Keras pattern you'll use for every project. It abstracts away the framework-specific details while giving you full control over the architecture, loss function, optimizer, and training process.
`,
      reviewCardIds: ['rc-2.7-6', 'rc-2.7-7', 'rc-2.7-8'],
      codeExamples: [
        {
          title: 'Training with fit() and monitoring validation loss',
          language: 'python',
          code: `history = model.fit(
    x_train, y_train,
    epochs=10,
    batch_size=128,
    validation_split=0.2,
)
# Access training metrics
print(history.history.keys())
# dict_keys(['loss', 'accuracy', 'val_loss', 'val_accuracy'])`,
        },
        {
          title: 'Plotting training vs validation loss',
          language: 'python',
          code: `import matplotlib.pyplot as plt

loss = history.history["loss"]
val_loss = history.history["val_loss"]
epochs = range(1, len(loss) + 1)

plt.plot(epochs, loss, "bo-", label="Training loss")
plt.plot(epochs, val_loss, "rs-", label="Validation loss")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend()
plt.show()`,
        },
        {
          title: 'Making predictions on new data',
          language: 'python',
          code: `predictions = model.predict(x_test)
print(predictions[:3])
# Forward pass only -- weights are NOT updated`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Keras layers are building blocks that encapsulate weights and computation, with automatic shape inference.
- The three-step workflow: build model (stack layers) -> compile (loss, optimizer, metrics) -> fit (train on data).
- Loss function selection is critical: binary_crossentropy for binary classification, categorical_crossentropy for multiclass, MSE for regression.
- \`fit()\` handles the entire training loop; use \`validation_split\` to monitor overfitting.
- \`predict()\` runs inference without updating weights.
- Keras runs on top of TensorFlow, PyTorch, or JAX -- choose your backend based on your needs.`,
};

export default lesson;
