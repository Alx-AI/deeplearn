/**
 * Lesson 2.8: Movie Review Classification
 *
 * Covers: IMDb binary classification -- first real project
 * Source sections: 4.1.1 through 4.1.7
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.8',
  title: 'Movie Review Classification',
  sections: [
    {
      id: '2.8.1',
      title: 'The IMDb Dataset and Data Preparation',
      content: `
Time for your first real deep learning project. We're going to build a model that reads movie reviews and predicts whether they're positive or negative. This is **binary classification** -- one of the most common ML tasks.

The IMDb dataset contains 50,000 highly polarized movie reviews from the Internet Movie Database, split evenly: 25,000 for training and 25,000 for testing, with a 50/50 balance of positive and negative reviews. The dataset comes pre-packaged with Keras, already preprocessed: each review is a sequence of integers, where each integer represents a specific word in a dictionary.

\`\`\`python
from keras.datasets import imdb

(train_data, train_labels), (test_data, test_labels) = imdb.load_data(
    num_words=10000    # Keep only the 10,000 most frequent words
)
\`\`\`

Each review is a variable-length list of word indices, and labels are 0 (negative) or 1 (positive). But neural networks expect fixed-size inputs, not variable-length lists. How do we convert?

We'll use **multi-hot encoding**: create a vector of 10,000 elements (one per word in our vocabulary). For each review, set position \`i\` to 1 if word \`i\` appears, and 0 otherwise:

\`\`\`python
import numpy as np

def multi_hot_encode(sequences, num_classes):
    results = np.zeros((len(sequences), num_classes))
    for i, sequence in enumerate(sequences):
        results[i][sequence] = 1.0
    return results

x_train = multi_hot_encode(train_data, num_classes=10000)
x_test = multi_hot_encode(test_data, num_classes=10000)
\`\`\`

This encoding discards word order and frequency -- a review with "great" mentioned once looks the same as one with "great" mentioned ten times. That's a simplification, but it works surprisingly well for sentiment classification. (Later you'll learn more sophisticated text representations.)

Labels just need to be converted to floats:

\`\`\`python
y_train = train_labels.astype("float32")
y_test = test_labels.astype("float32")
\`\`\`
`,
      reviewCardIds: ['rc-2.8-1', 'rc-2.8-2'],
      illustrations: ['multi-hot-encoding'],
      codeExamples: [
        {
          title: 'Loading and inspecting the IMDb dataset',
          language: 'python',
          code: `from keras.datasets import imdb

(train_data, train_labels), (test_data, test_labels) = imdb.load_data(
    num_words=10000
)
print(f"Training samples: {len(train_data)}")
print(f"First review length: {len(train_data[0])} words")
print(f"Label: {train_labels[0]}")  # 1 = positive, 0 = negative`,
        },
        {
          title: 'Multi-hot encoding for variable-length sequences',
          language: 'python',
          code: `import numpy as np

def multi_hot_encode(sequences, num_classes):
    results = np.zeros((len(sequences), num_classes))
    for i, sequence in enumerate(sequences):
        results[i][sequence] = 1.0
    return results

x_train = multi_hot_encode(train_data, num_classes=10000)
print(x_train.shape)  # (25000, 10000)
print(x_train[0].sum())  # Number of unique words in first review`,
        },
      ],
    },
    {
      id: '2.8.2',
      title: 'Building and Training the Model',
      content: `
For this problem -- classifying fixed-size vectors into two categories -- a stack of Dense layers with relu activations works well. Our architecture:

\`\`\`python
import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(16, activation="relu"),
    layers.Dense(16, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
\`\`\`

Let's unpack the design choices:

- **Two hidden layers with 16 units each.** The 16 defines the model's capacity -- how many distinct patterns it can learn. Too few units (say 4) and the model can't capture the complexity of sentiment. Too many (say 512) and it starts memorizing individual reviews instead of learning general patterns. 16 is a reasonable starting point.

- **relu activation** in hidden layers. Without an activation function, stacking Dense layers would be equivalent to a single linear transformation (no matter how many layers). relu introduces non-linearity, allowing the model to learn complex patterns.

- **sigmoid in the output layer.** Since this is binary classification, the output should be a single probability between 0 and 1. Sigmoid squashes any value into that range -- 0.9 means "90% confident this is positive."

For the compile step, we pair sigmoid output with **binary crossentropy** loss:

\`\`\`python
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"],
)
\`\`\`

Why crossentropy and not mean squared error? Crossentropy penalizes *confident wrong predictions* much more heavily. Being 99% confident and wrong is catastrophic under crossentropy but only mildly worse under MSE. For classification with probability outputs, crossentropy is almost always the right choice.

Now we train, holding out 10,000 samples for validation:

\`\`\`python
x_val = x_train[:10000]
partial_x_train = x_train[10000:]
y_val = y_train[:10000]
partial_y_train = y_train[10000:]

history = model.fit(
    partial_x_train, partial_y_train,
    epochs=20, batch_size=512,
    validation_data=(x_val, y_val),
)
\`\`\`
`,
      reviewCardIds: ['rc-2.8-3', 'rc-2.8-4', 'rc-2.8-5'],
      illustrations: ['binary-classifier-arch'],
      codeExamples: [
        {
          title: 'Binary classification model: sigmoid + binary_crossentropy',
          language: 'python',
          code: `import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(16, activation="relu"),
    layers.Dense(16, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"],
)`,
        },
        {
          title: 'Training with a manual validation split',
          language: 'python',
          code: `# Hold out first 10,000 samples for validation
x_val = x_train[:10000]
partial_x_train = x_train[10000:]
y_val = y_train[:10000]
partial_y_train = y_train[10000:]

history = model.fit(
    partial_x_train, partial_y_train,
    epochs=20, batch_size=512,
    validation_data=(x_val, y_val),
)`,
        },
      ],
    },
    {
      id: '2.8.3',
      title: 'Interpreting Results and Diagnosing Overfitting',
      content: `
After training for 20 epochs, plot the training and validation metrics from \`history.history\`. You'll see a telling pattern:

- **Training loss** decreases steadily every epoch -- the model is getting better at the training data.
- **Validation loss** decreases for the first ~4 epochs, then starts *increasing*.

This divergence is the classic signature of **overfitting**. After epoch 4, the model stops learning general sentiment patterns and starts memorizing quirks of the training data -- specific word combinations that happen to correlate with sentiment in the training set but don't generalize.

The fix is simple: **train for only 4 epochs** (the point of lowest validation loss). This technique is called **early stopping** -- halt training when validation performance stops improving.

\`\`\`python
model = keras.Sequential([
    layers.Dense(16, activation="relu"),
    layers.Dense(16, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy",
              metrics=["accuracy"])
model.fit(x_train, y_train, epochs=4, batch_size=512)
results = model.evaluate(x_test, y_test)
# Test accuracy: ~88%
\`\`\`

An 88% accuracy from such a simple model is quite good. State-of-the-art approaches can reach ~95%, but this baseline demonstrates the power of even basic neural network architectures.

After training, generate predictions with \`model.predict()\`:

\`\`\`python
predictions = model.predict(x_test)
# array([[ 0.98], [ 0.99], [ 0.02], ...])
\`\`\`

Values near 1.0 indicate confident positive predictions; near 0.0 indicates confident negative. The model shows varying levels of confidence -- some reviews are obvious, others are ambiguous.

**Key lessons from this project:**
- Variable-length text can be encoded as fixed-size multi-hot vectors
- Stacks of Dense layers with relu are a solid baseline for vector classification
- Binary classification uses sigmoid output + binary_crossentropy loss
- Always monitor validation metrics to catch overfitting
- Training curves tell you when to stop: watch for divergence between training and validation loss
`,
      reviewCardIds: ['rc-2.8-6', 'rc-2.8-7', 'rc-2.8-8'],
      illustrations: ['overfitting'],
      codeExamples: [
        {
          title: 'Plotting training curves to detect overfitting',
          language: 'python',
          code: `import matplotlib.pyplot as plt

loss = history.history["loss"]
val_loss = history.history["val_loss"]
epochs = range(1, len(loss) + 1)

plt.plot(epochs, loss, "bo-", label="Training loss")
plt.plot(epochs, val_loss, "rs-", label="Validation loss")
plt.title("Training vs validation loss")
plt.xlabel("Epochs")
plt.legend()
plt.show()
# Look for where validation loss starts rising`,
        },
        {
          title: 'Retrain with early stopping at the optimal epoch',
          language: 'python',
          code: `model = keras.Sequential([
    layers.Dense(16, activation="relu"),
    layers.Dense(16, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy",
              metrics=["accuracy"])
model.fit(x_train, y_train, epochs=4, batch_size=512)
results = model.evaluate(x_test, y_test)
print(f"Test accuracy: {results[1]:.3f}")  # ~0.88`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The IMDb dataset has 50,000 movie reviews (binary positive/negative labels), preprocessed as sequences of word indices.
- Multi-hot encoding converts variable-length reviews into fixed-size binary vectors (one dimension per vocabulary word).
- Binary classification architecture: Dense hidden layers with relu, final Dense(1) with sigmoid, compiled with binary_crossentropy.
- Training curves reveal overfitting: when validation loss starts rising while training loss keeps falling, stop training.
- This simple model achieves ~88% test accuracy on sentiment classification.
- The adam optimizer is a reliable default choice for most problems.`,
};

export default lesson;
