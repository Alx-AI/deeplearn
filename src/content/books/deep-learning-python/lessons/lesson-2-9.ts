/**
 * Lesson 2.9: Newswire Classification
 *
 * Covers: Reuters multiclass classification, softmax, information bottlenecks
 * Source sections: 4.2.1 through 4.2.9
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.9',
  title: 'Newswire Classification',
  sections: [
    {
      id: '2.9.1',
      title: 'From Two Classes to Forty-Six',
      content: `
In the previous lesson, we classified reviews as positive or negative -- two classes. Now we're scaling up to **multiclass classification**: sorting Reuters newswires into one of 46 different topics.

The Reuters dataset contains short newswires from 1986, labeled with topic categories. Like IMDb, it comes with Keras and is preprocessed as sequences of word indices:

\`\`\`python
from keras.datasets import reuters

(train_data, train_labels), (test_data, test_labels) = reuters.load_data(
    num_words=10000
)
# 8,982 training examples, 2,246 test examples
# Labels are integers from 0 to 45
\`\`\`

Input preparation is the same multi-hot encoding as before:

\`\`\`python
x_train = multi_hot_encode(train_data, num_classes=10000)
x_test = multi_hot_encode(test_data, num_classes=10000)
\`\`\`

For the labels, we have a choice. We can use **one-hot encoding** (each label becomes a vector of 46 zeros with a single 1), or leave them as integers. Both approaches compute the same loss -- they just use different Keras loss functions:

\`\`\`python
# Option A: One-hot labels + categorical_crossentropy
from keras.utils import to_categorical
y_train = to_categorical(train_labels)   # shape: (8982, 46)

# Option B: Integer labels + sparse_categorical_crossentropy
y_train = train_labels                   # shape: (8982,)
\`\`\`

Both are mathematically equivalent. Use whichever is more convenient for your pipeline.
`,
      reviewCardIds: ['rc-2.9-1', 'rc-2.9-2'],
      illustrations: ['one-hot-encoding'],
      codeExamples: [
        {
          title: 'Loading Reuters and inspecting the data',
          language: 'python',
          code: `from keras.datasets import reuters

(train_data, train_labels), (test_data, test_labels) = reuters.load_data(
    num_words=10000
)
print(f"Training samples: {len(train_data)}")   # 8982
print(f"Test samples: {len(test_data)}")         # 2246
print(f"Number of classes: {max(train_labels) + 1}")  # 46`,
        },
        {
          title: 'One-hot encoding labels with to_categorical',
          language: 'python',
          code: `from keras.utils import to_categorical

y_train = to_categorical(train_labels)
y_test = to_categorical(test_labels)
print(y_train.shape)   # (8982, 46)
print(y_train[0])      # [0. 0. 0. 1. 0. ... ]  one-hot vector`,
        },
      ],
    },
    {
      id: '2.9.2',
      title: 'Softmax, Larger Layers, and Information Bottlenecks',
      content: `
The model architecture looks similar to our binary classifier, but with two key differences: **larger hidden layers** and a **softmax output**.

\`\`\`python
import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(64, activation="relu"),
    layers.Dense(46, activation="softmax"),
])
\`\`\`

Why 64 units instead of 16? Because we now need to separate 46 classes instead of 2. Each hidden layer must carry enough information to distinguish between all 46 topics. If we used only 16 units -- or worse, just 4 -- we'd create an **information bottleneck**: the layer would be forced to compress all the discriminative information for 46 classes into too few dimensions, permanently losing critical details.

Let's see this concretely. An experiment with a 4-unit middle layer:

\`\`\`python
# DON'T do this for 46-class classification
model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(4, activation="relu"),   # Bottleneck!
    layers.Dense(46, activation="softmax"),
])
\`\`\`

This drops validation accuracy from ~80% to ~71% -- an 8% loss because the 4-dimensional bottleneck can't represent enough information about 46 distinct categories.

The **softmax** activation in the output layer is what makes this multiclass. Unlike sigmoid (which outputs a single probability), softmax outputs a **probability distribution** over all 46 classes. The outputs are always positive and always sum to $1.0$:

\`\`\`python
# If model outputs [0.01, 0.02, ..., 0.71, ...]
# The 46 values sum to 1.0
# The predicted class = argmax = the index with highest probability
\`\`\`

For compilation, we pair softmax with **categorical crossentropy**:

\`\`\`python
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)
\`\`\`

This loss measures the distance between the model's predicted probability distribution and the true distribution (which is all zeros except for a 1 at the correct class).
`,
      reviewCardIds: ['rc-2.9-3', 'rc-2.9-4', 'rc-2.9-5'],
      illustrations: ['softmax'],
      codeExamples: [
        {
          title: 'Multiclass model: softmax + categorical_crossentropy',
          language: 'python',
          code: `import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(64, activation="relu"),
    layers.Dense(46, activation="softmax"),
])
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)`,
        },
        {
          title: 'Information bottleneck: too-small layers hurt accuracy',
          language: 'python',
          code: `# BAD: 4 units cannot represent 46 classes
bottleneck_model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(4, activation="relu"),    # Bottleneck!
    layers.Dense(46, activation="softmax"),
])
# Validation accuracy drops from ~80% to ~71%
# Rule: hidden layers should have >= N output classes`,
        },
      ],
    },
    {
      id: '2.9.3',
      title: 'Training, Evaluation, and Key Patterns',
      content: `
Training follows the same pattern as the IMDb example. Set aside validation data, train, and watch for overfitting:

\`\`\`python
x_val = x_train[:1000]
partial_x_train = x_train[1000:]
y_val = y_train[:1000]
partial_y_train = y_train[1000:]

history = model.fit(
    partial_x_train, partial_y_train,
    epochs=20, batch_size=512,
    validation_data=(x_val, y_val),
)
\`\`\`

The training curves show the model starts overfitting around epoch 9. Retraining from scratch for 9 epochs gives approximately 80% accuracy on the test set. That might seem modest, but a random classifier on 46 classes would score only ~19%, so 80% represents a substantial improvement.

Predictions come as probability vectors:

\`\`\`python
predictions = model.predict(x_test)
# predictions[0].shape is (46,)
# np.sum(predictions[0]) is 1.0
# np.argmax(predictions[0]) gives the predicted class
\`\`\`

**Comparing binary and multiclass classification -- the key differences:**

| Aspect | Binary (IMDb) | Multiclass (Reuters) |
|---|---|---|
| Output layer | Dense(1, activation="sigmoid") | Dense(N, activation="softmax") |
| Output meaning | Single probability $[0, 1]$ | $N$ probabilities that sum to $1$ |
| Loss function | binary_crossentropy | categorical_crossentropy |
| Prediction | threshold at $0.5$ | argmax over $N$ classes |
| Hidden layer size | Can be small (e.g., 16) | Must be $\\geq N$ classes to avoid bottleneck |

The pattern to remember: **sigmoid gives you independent probabilities; softmax gives you a probability distribution.** Use sigmoid when classes are independent (binary, or multi-label where an item can belong to multiple classes). Use softmax when exactly one class must be chosen.

Another practical lesson: when classifying into many categories, ensure your intermediate layers have at least as many units as the number of output classes. Otherwise you'll create an information bottleneck that permanently discards discriminative information.
`,
      reviewCardIds: ['rc-2.9-6', 'rc-2.9-7', 'rc-2.9-8'],
      codeExamples: [
        {
          title: 'Training with validation data and finding optimal epochs',
          language: 'python',
          code: `x_val = x_train[:1000]
partial_x_train = x_train[1000:]
y_val = y_train[:1000]
partial_y_train = y_train[1000:]

history = model.fit(
    partial_x_train, partial_y_train,
    epochs=20, batch_size=512,
    validation_data=(x_val, y_val),
)
# Overfitting starts around epoch 9`,
        },
        {
          title: 'Interpreting softmax predictions with argmax',
          language: 'python',
          code: `import numpy as np

predictions = model.predict(x_test)
print(predictions[0].shape)         # (46,)
print(np.sum(predictions[0]))       # 1.0 (probabilities sum to 1)
predicted_class = np.argmax(predictions[0])
print(f"Predicted class: {predicted_class}")`,
        },
        {
          title: 'Alternative: integer labels with sparse loss',
          language: 'python',
          code: `# Instead of one-hot encoding labels, use integers directly
model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",  # For integer labels
    metrics=["accuracy"],
)
# y_train stays as integers: [3, 4, 3, ...]
# Mathematically identical to categorical_crossentropy + one-hot`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Multiclass classification uses softmax activation (probability distribution over $N$ classes) paired with categorical_crossentropy loss.
- Softmax outputs $N$ values that are positive and sum to $1.0$; the predicted class is the argmax.
- Labels can be one-hot encoded (use categorical_crossentropy) or left as integers (use sparse_categorical_crossentropy).
- Information bottleneck: intermediate layers much smaller than the number of output classes lose critical information and hurt accuracy.
- The Reuters model achieves ~80% accuracy on 46 classes (vs ~19% random baseline).
- Sigmoid = independent probabilities; softmax = mutually exclusive probability distribution.`,
};

export default lesson;
