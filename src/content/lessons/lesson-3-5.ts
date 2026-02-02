/**
 * Lesson 3.5: Improving Model Fit
 *
 * Covers: Tuning gradient descent, architecture, capacity
 * Source sections: 5.3.1, 5.3.2, 5.3.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.5',
  title: 'Improving Model Fit',
  sections: [
    {
      id: '3.5.1',
      title: 'Tuning Key Gradient Descent Parameters',
      content: `
Before you can fight overfitting, you need a model that actually *fits*. The strategy is: **first overfit, then regularize**. You need to cross the boundary between underfitting and overfitting to know where it is.

Three common problems arise at this stage:

1. **Training does not start** -- Loss does not decrease at all.
2. **Training starts but the model does not generalize** -- You cannot beat the common-sense baseline.
3. **The model generalizes somewhat but cannot overfit** -- Validation improves but training and validation curves never diverge.

When training fails to start, it is almost always a problem with gradient descent configuration. The most common culprit is the **learning rate**. Too high, and gradient updates overshoot the minimum, causing the model to thrash around without improving. Too low, and training appears to stall because progress is imperceptibly slow.

\`\`\`python
import keras
from keras import layers

# Too-high learning rate: model gets stuck at ~20-40% accuracy
model = keras.Sequential([
    layers.Dense(512, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
model.compile(
    optimizer=keras.optimizers.RMSprop(learning_rate=1.0),  # Way too high
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

# Fix: use a more reasonable learning rate
model.compile(
    optimizer=keras.optimizers.RMSprop(learning_rate=1e-2),  # Much better
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
\`\`\`

The **batch size** also matters. Larger batches produce more stable gradient estimates (lower variance), which can help training converge. If training is unstable, try increasing the batch size alongside adjusting the learning rate.
`,
      reviewCardIds: ['rc-3.5-1', 'rc-3.5-2'],
      illustrations: ['gradient-descent'],
      codeExamples: [
        {
          title: 'Experimenting with learning rates',
          language: 'python',
          code: `import keras
from keras import layers

def build_model(learning_rate):
    model = keras.Sequential([
        layers.Dense(512, activation="relu"),
        layers.Dense(10, activation="softmax"),
    ])
    model.compile(
        optimizer=keras.optimizers.RMSprop(learning_rate=learning_rate),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model

# Compare: too high, too low, and just right
for lr in [1.0, 1e-5, 1e-2]:
    model = build_model(lr)
    h = model.fit(train_images, train_labels, epochs=3,
                  batch_size=128, verbose=0)
    print(f"lr={lr}: final loss={h.history['loss'][-1]:.4f}")`,
        },
      ],
    },
    {
      id: '3.5.2',
      title: 'Using Better Architecture Priors',
      content: `
If your model trains (loss decreases) but validation metrics never improve beyond chance, this is a more serious problem. It means something is fundamentally wrong with your approach.

The first possibility is that the input data simply does not contain enough information to predict the targets. If you try to train on MNIST with shuffled labels, training loss goes down but validation stays at 10% -- because there is literally nothing to generalize.

The second, more common possibility is that your **architecture is wrong for the problem**. Different data types require different kinds of layers:

- **Images** -- Convolutional layers exploit spatial structure and translation invariance. A dense network applied directly to pixels lacks these priors and will struggle.
- **Sequences and time series** -- Recurrent networks or Transformers model temporal dependencies. A dense network cannot easily capture sequential patterns.
- **Tabular data** -- Dense layers are usually appropriate. Gradient-boosted trees can also be competitive here.

Choosing the right architecture is not guesswork. For most common data types, the ML community has established which architectures work well. Always research prior art for your specific task. If someone else has solved a similar problem, start from their approach and adapt it.

An architecture prior is essentially a way of encoding domain knowledge into the model structure. Convolutions say "spatial locality matters." Recurrence says "temporal order matters." These assumptions dramatically reduce the space of possible functions the model needs to search through, making learning far more efficient.
`,
      reviewCardIds: ['rc-3.5-3', 'rc-3.5-4'],
      illustrations: ['architecture-priors'],
      codeExamples: [
        {
          title: 'Choosing the right architecture for the data type',
          language: 'python',
          code: `import keras
from keras import layers

# For images: use convolutional layers (spatial priors)
image_model = keras.Sequential([
    layers.Conv2D(32, (3, 3), activation="relu", input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(10, activation="softmax"),
])

# For sequences: use recurrent layers (temporal priors)
sequence_model = keras.Sequential([
    layers.LSTM(64, input_shape=(None, 32)),
    layers.Dense(1, activation="sigmoid"),
])

# For tabular data: use dense layers
tabular_model = keras.Sequential([
    layers.Dense(128, activation="relu", input_shape=(20,)),
    layers.Dense(64, activation="relu"),
    layers.Dense(1),
])`,
        },
      ],
    },
    {
      id: '3.5.3',
      title: 'Increasing Model Capacity',
      content: `
If your model generalizes somewhat (it beats the baseline) but you cannot get it to overfit, the problem is likely **insufficient capacity**. The model does not have enough parameters to capture all the patterns in the training data.

Consider training a simple logistic regression on MNIST -- just a single Dense layer with 10 outputs and softmax activation:

\`\`\`python
model = keras.Sequential([layers.Dense(10, activation="softmax")])
model.compile(
    optimizer="rmsprop",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
model.fit(train_images, train_labels, epochs=20,
          batch_size=128, validation_split=0.2)
\`\`\`

The validation loss decreases initially but then flattens out without reversing -- the model cannot overfit because it simply lacks the representational power. The fix is to increase capacity:

\`\`\`python
# A model with more capacity -- two hidden layers with 128 units each
model = keras.Sequential([
    layers.Dense(128, activation="relu"),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
\`\`\`

With this larger model, training curves look correct: loss decreases quickly and overfitting begins after about eight epochs. This is exactly what you want to see -- it confirms the model has enough capacity.

But be careful: too much capacity causes problems too. A model with three layers of 2,048 units each starts overfitting immediately, on the very first epoch. The more capacity the model has, the faster it memorizes training data and the worse the generalization gap becomes.

The practical approach: **start small, add capacity until you can overfit, then regularize**. This gives you a model at the sweet spot between underfitting and overfitting.
`,
      reviewCardIds: ['rc-3.5-5'],
      illustrations: ['model-capacity-spectrum'],
      codeExamples: [
        {
          title: 'Comparing models with different capacities on MNIST',
          language: 'python',
          code: `import keras
from keras import layers

configs = {
    "too_small":  [layers.Dense(10, activation="softmax")],
    "right_size": [layers.Dense(128, activation="relu"),
                   layers.Dense(128, activation="relu"),
                   layers.Dense(10, activation="softmax")],
    "too_large":  [layers.Dense(2048, activation="relu"),
                   layers.Dense(2048, activation="relu"),
                   layers.Dense(2048, activation="relu"),
                   layers.Dense(10, activation="softmax")],
}
for name, layer_list in configs.items():
    model = keras.Sequential(layer_list)
    model.compile(optimizer="rmsprop",
                  loss="sparse_categorical_crossentropy",
                  metrics=["accuracy"])
    h = model.fit(train_images, train_labels, epochs=10,
                  batch_size=128, validation_split=0.2, verbose=0)
    gap = h.history["loss"][-1] - h.history["val_loss"][-1]
    print(f"{name:>10}: val_acc={h.history['val_accuracy'][-1]:.3f}  gap={gap:.4f}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The strategy is "first overfit, then regularize." You must cross the overfitting boundary to know where it lies.
- If training does not start, check the learning rate (too high or too low) and batch size.
- If the model trains but does not generalize, the architecture may be wrong for the data type. Use the right priors: convolutions for images, recurrence for sequences, etc.
- If the model generalizes but cannot overfit, increase model capacity by adding layers or making layers larger.
- Too much capacity causes immediate overfitting. Start small and scale up.
- The goal is a model that can overfit -- then you apply regularization to improve generalization.`,
};

export default lesson;
