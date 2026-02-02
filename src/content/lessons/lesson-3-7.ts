/**
 * Lesson 3.7: Regularization Techniques
 *
 * Covers: Weight regularization, dropout, reducing model size
 * Source sections: 5.4.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.7',
  title: 'Regularization Techniques',
  sections: [
    {
      id: '3.7.1',
      title: 'Reducing Network Size and Weight Regularization',
      content: `
Beyond data curation and early stopping, there are several **explicit regularization techniques** that directly constrain the model during training. These are particularly important when you cannot simply get more data.

**Reducing the network's size** is the simplest approach. A model with fewer parameters has fewer "slots" to memorize training noise and is forced to learn compressed, generalizable representations instead. The tradeoff is clear: too few parameters leads to underfitting, too many leads to overfitting.

The practical workflow is to start with a small model, increase capacity until overfitting appears, then either reduce the model size or add other regularization. There is no formula for the "right" size -- you must experiment.

**Weight regularization** adds a penalty to the loss function that discourages large weight values. This implements Occam's razor: among models that explain the data equally well, the simpler one (with smaller weights) is more likely to generalize.

Two flavors are commonly used:

- **L2 regularization** (weight decay) -- Adds a penalty proportional to the *square* of each weight value. This pushes all weights toward smaller values without driving them to exactly zero.
- **L1 regularization** -- Adds a penalty proportional to the *absolute value* of each weight. This can drive some weights to exactly zero, effectively performing automatic feature selection.

\`\`\`python
from keras.regularizers import l2

model = keras.Sequential([
    layers.Dense(16, kernel_regularizer=l2(0.002), activation="relu"),
    layers.Dense(16, kernel_regularizer=l2(0.002), activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
# l2(0.002) adds 0.002 * weight^2 to the loss for every weight
# This makes the model much more resistant to overfitting
\`\`\`

The regularization penalty is only applied during training. This means training loss will be higher than test loss -- which is the opposite of what you see with overfitting and is perfectly normal.
`,
      reviewCardIds: ['rc-3.7-1', 'rc-3.7-2'],
      illustrations: ['weight-regularization'],
      codeExamples: [
        {
          title: 'Comparing L1 and L2 regularization in Keras',
          language: 'python',
          code: `from keras import layers, regularizers

# L2 pushes weights toward zero but never exactly zero
l2_layer = layers.Dense(16, kernel_regularizer=regularizers.l2(0.002),
                        activation="relu")

# L1 can drive weights to exactly zero (sparse model)
l1_layer = layers.Dense(16, kernel_regularizer=regularizers.l1(0.001),
                        activation="relu")

# Combined L1 + L2 (elastic net)
l1l2_layer = layers.Dense(16, kernel_regularizer=regularizers.l1_l2(
    l1=0.001, l2=0.002), activation="relu")`,
        },
        {
          title: 'Reducing network size to fight overfitting',
          language: 'python',
          code: `from keras import Sequential, layers

# Overfitting model -- too much capacity
big_model = Sequential([
    layers.Dense(512, activation="relu"),
    layers.Dense(512, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])

# Smaller model -- forced to learn compressed representations
small_model = Sequential([
    layers.Dense(16, activation="relu"),
    layers.Dense(16, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
print(f"Big:   {big_model.count_params():,} params")
print(f"Small: {small_model.count_params():,} params")`,
        },
      ],
    },
    {
      id: '3.7.2',
      title: 'Dropout',
      content: `
**Dropout** is one of the most effective regularization techniques for neural networks. The idea is deceptively simple: during training, randomly set a fraction of the layer's output activations to zero. A different random subset is zeroed out on every training step.

If a layer normally outputs the vector \`[0.2, 0.5, 1.3, 0.8, 1.1]\`, after dropout with rate 0.5, it might become \`[0, 0.5, 1.3, 0, 1.1]\`. The **dropout rate** -- typically between 0.2 and 0.5 -- controls what fraction of units are silenced.

\`\`\`python
# Conceptually, dropout works like this during training:
layer_output *= np.random.randint(0, 2, size=layer_output.shape)
layer_output /= 0.5  # Scale up to compensate for dropped units

# At test/inference time, dropout is turned OFF.
# All units are active, and no scaling is needed (already handled).
\`\`\`

Why does this work? The key intuition is that dropout prevents **co-adaptation** between neurons. Without dropout, neurons can develop "conspiracies" -- specific combinations of activations that memorize training examples. By randomly removing different neurons each step, the network cannot rely on any particular neuron being present. Knowledge must be distributed across many neurons, leading to more robust and generalizable representations.

Geoffrey Hinton, who invented dropout, was inspired by an anti-fraud mechanism at banks: tellers are regularly rotated so that defrauding the bank requires cooperation across changing teams, making it much harder.

In Keras, dropout is added as a separate layer placed after the layer you want to regularize:

\`\`\`python
model = keras.Sequential([
    layers.Dense(16, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(16, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(1, activation="sigmoid"),
])
\`\`\`
`,
      reviewCardIds: ['rc-3.7-3', 'rc-3.7-4'],
      illustrations: ['regularization'],
      codeExamples: [
        {
          title: 'Dropout with different rates for different layers',
          language: 'python',
          code: `from keras import Sequential, layers

model = Sequential([
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.3),   # lighter dropout early
    layers.Dense(256, activation="relu"),
    layers.Dropout(0.5),   # heavier dropout deeper
    layers.Dense(1, activation="sigmoid"),
])
# Dropout is only active during training
# At inference time, all neurons participate`,
        },
        {
          title: 'Verifying dropout is off during inference',
          language: 'python',
          code: `import numpy as np

# During training: model(x, training=True) applies dropout
# During inference: model(x, training=False) uses all units
x_sample = np.random.randn(1, 256).astype("float32")

train_out = model(x_sample, training=True).numpy()
infer_out = model(x_sample, training=False).numpy()
# train_out varies each call (random dropout)
# infer_out is deterministic (no dropout)`,
        },
      ],
    },
    {
      id: '3.7.3',
      title: 'Comparing and Combining Techniques',
      content: `
How do these techniques compare in practice? On the IMDB sentiment classification task, both L2 regularization and dropout significantly reduce overfitting compared to the baseline model. Dropout tends to perform particularly well -- in experiments, it not only slows overfitting but also achieves a lower minimum validation loss than L2 regularization.

Here is a practical comparison. The original IMDB model (two Dense layers with 16 units each, no regularization) begins overfitting around epoch 4. The same model with L2 regularization (weight=0.002) overfits later and less severely. With dropout (rate=0.5), overfitting is delayed even further and the overall validation performance is best.

Some guidelines for choosing regularization techniques:

- **L2 regularization** works best for smaller models. For very large, overparameterized models, constraining individual weight values has limited effect -- there are simply too many parameters for the penalty to meaningfully restrict the model.

- **Dropout** is generally more effective for larger models and is the most widely used regularization technique in modern deep learning.

- **L1 regularization** is useful when you want sparse models -- where some features are automatically "turned off." This is valuable for interpretability or when you suspect many input features are irrelevant.

- **Combining techniques** is common and often beneficial. A typical setup might include dropout between layers, mild L2 regularization, and early stopping to find the optimal training duration.

To recap, here are all the tools for maximizing generalization:

1. Get more training data (or better training data)
2. Develop better features through feature engineering
3. Reduce model capacity (fewer layers or smaller layers)
4. Add weight regularization (L1, L2, or both)
5. Add dropout
6. Use early stopping
`,
      reviewCardIds: ['rc-3.7-5'],
      codeExamples: [
        {
          title: 'Combining dropout, L2 regularization, and early stopping',
          language: 'python',
          code: `from keras import Sequential, layers, regularizers
from keras.callbacks import EarlyStopping

model = Sequential([
    layers.Dense(64, activation="relu",
                 kernel_regularizer=regularizers.l2(1e-3)),
    layers.Dropout(0.4),
    layers.Dense(64, activation="relu",
                 kernel_regularizer=regularizers.l2(1e-3)),
    layers.Dropout(0.4),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy",
              metrics=["accuracy"])
# model.fit(..., callbacks=[EarlyStopping(patience=5)])`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Reducing model size forces the network to learn compressed, generalizable representations instead of memorizing training data.
- L2 regularization (weight decay) penalizes large weights, producing smoother decision boundaries. L1 regularization can drive weights to zero for automatic feature selection.
- Dropout randomly silences neurons during training, preventing co-adaptation and distributing knowledge across the network.
- Dropout is generally the most effective single regularization technique for modern deep learning.
- Regularization techniques can and should be combined: dropout + L2 + early stopping is a common and effective recipe.
- The regularization penalty only applies during training, so training loss will appear higher than test loss -- this is expected.`,
};

export default lesson;
