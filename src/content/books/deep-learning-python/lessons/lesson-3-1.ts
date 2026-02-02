/**
 * Lesson 3.1: The Goal of Machine Learning
 *
 * Covers: Generalization, underfitting vs overfitting
 * Source sections: 5.1, 5.1.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.1',
  title: 'The Goal of Machine Learning',
  sections: [
    {
      id: '3.1.1',
      title: 'The Tension Between Optimization and Generalization',
      content: `
The central challenge of machine learning is not getting a model to perform well on its training data -- that part is relatively straightforward. The real challenge is getting it to perform well on data it has *never seen before*. This distinction is so important that it defines the entire field.

**Optimization** is the process of adjusting a model to perform as well as possible on the training data. This is the "learning" in "machine learning." **Generalization** is how well that trained model performs on new, unseen data. The goal is always generalization, but here is the catch: you can only directly control optimization. You adjust weights, tune hyperparameters, and iterate on the training set. You then *hope* that generalization follows.

This creates a fundamental tension. If you optimize the training performance too aggressively, the model starts memorizing the specific quirks of your training set rather than learning the underlying patterns. This is called **overfitting**, and it is the single most important concept in practical machine learning.

Every machine learning problem exhibits overfitting if you train long enough. The models from the previous module demonstrated this clearly: after a certain number of training epochs, validation performance peaked and then began to degrade, even as training performance continued to improve. The gap between training and validation performance is the signature of overfitting.
`,
      reviewCardIds: ['rc-3.1-1', 'rc-3.1-2'],
      illustrations: ['loss-landscape'],
      codeExamples: [
        {
          title: 'Training a model and observing the generalization gap',
          language: 'python',
          code: `import keras
from keras import layers
from keras.datasets import mnist

(train_images, train_labels), (test_images, test_labels) = mnist.load_data()
train_images = train_images.reshape((60000, 28 * 28)).astype("float32") / 255
test_images = test_images.reshape((10000, 28 * 28)).astype("float32") / 255

model = keras.Sequential([
    layers.Dense(512, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
model.compile(optimizer="rmsprop",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])

history = model.fit(train_images, train_labels,
                    epochs=20, batch_size=128,
                    validation_split=0.2)
# After ~5 epochs, val_loss starts rising while train_loss keeps falling`,
        },
      ],
    },
    {
      id: '3.1.2',
      title: 'Underfitting and Overfitting',
      content: `
When you begin training a model, both training loss and validation loss decrease together. During this phase the model is **underfitting** -- it has not yet captured all the relevant patterns in the data. There is still progress to be made.

After some number of epochs, something changes. The training loss keeps going down, but the validation loss stalls and then starts climbing. This is the moment overfitting begins: the model is learning patterns specific to the training data that do not generalize to new examples.

Overfitting is especially likely in three situations:

1. **Noisy data** -- Real datasets often contain mislabeled examples or invalid inputs. If the model tries to account for these outliers, it will learn misleading patterns. For example, MNIST contains some training digits that are nearly unrecognizable or outright mislabeled.

2. **Ambiguous features** -- Some regions of the input space genuinely map to multiple possible outputs. A banana photo might be labeled "ripe" by one person and "unripe" by another. An overconfident model that tries to draw sharp decision boundaries in ambiguous regions will overfit.

3. **Rare features and spurious correlations** -- If a particular feature value appears only once or twice in training, any correlation with the target is almost certainly a coincidence. Imagine the word "cherimoya" appearing in exactly one movie review, which happens to be negative. A model might learn that "cherimoya" predicts negative sentiment, but this correlation is pure noise.

A striking demonstration: if you concatenate 784 random noise dimensions to MNIST's 784 real pixel dimensions, validation accuracy drops by about a full percentage point -- even though the added dimensions carry zero signal. The model finds spurious correlations in the noise and uses them, hurting generalization.
`,
      reviewCardIds: ['rc-3.1-3', 'rc-3.1-4'],
      illustrations: ['underfitting-overfitting'],
      codeExamples: [
        {
          title: 'Plotting training vs validation loss to detect overfitting',
          language: 'python',
          code: `import matplotlib.pyplot as plt

loss = history.history["loss"]
val_loss = history.history["val_loss"]
epochs = range(1, len(loss) + 1)

plt.plot(epochs, loss, "bo-", label="Training loss")
plt.plot(epochs, val_loss, "rs-", label="Validation loss")
plt.title("Training vs Validation Loss")
plt.xlabel("Epochs")
plt.ylabel("Loss")
plt.legend()
plt.show()
# The point where curves diverge marks the onset of overfitting`,
        },
      ],
    },
    {
      id: '3.1.3',
      title: 'Feature Selection and the Path Forward',
      content: `
Since noisy or irrelevant features are a direct cause of overfitting, one practical countermeasure is **feature selection**: choosing which input features to keep and which to discard before training begins. The goal is to filter out features that are distracting rather than informative.

A common approach is to compute a usefulness score for each feature -- such as the mutual information between the feature and the target labels -- and then keep only features that score above a certain threshold. When we restricted the IMDB dataset to the top 10,000 most common words, that was a simple form of feature selection. In the noise-channel experiment, feature selection would have discarded the random noise dimensions entirely.

Here is a practical example of how noise channels affect training:

\`\`\`python
import numpy as np
from keras.datasets import mnist

(train_images, train_labels), _ = mnist.load_data()
train_images = train_images.reshape((60000, 28 * 28))
train_images = train_images.astype("float32") / 255

# Adding noise channels -- these carry zero information
train_images_with_noise = np.concatenate(
    [train_images, np.random.random((len(train_images), 784))], axis=1
)
# The model will find spurious correlations in the noise,
# hurting validation accuracy by ~1 percentage point
\`\`\`

Understanding this tension between optimization and generalization will frame everything that follows in this module. Before you can improve generalization, you need to measure it reliably (evaluation), achieve a solid fit (model development), and then deliberately constrain the model to generalize better (regularization). The rest of Module 3 covers each of these steps in turn.
`,
      reviewCardIds: ['rc-3.1-5'],
      illustrations: ['feature-engineering'],
      codeExamples: [
        {
          title: 'Feature selection using mutual information scores',
          language: 'python',
          code: `from sklearn.feature_selection import mutual_info_classif
import numpy as np

# Compute mutual information between each feature and the labels
mi_scores = mutual_info_classif(train_images, train_labels, random_state=42)

# Keep only features with above-median mutual information
threshold = np.median(mi_scores[mi_scores > 0])
useful_features = mi_scores > threshold
train_filtered = train_images[:, useful_features]
print(f"Kept {useful_features.sum()} of {train_images.shape[1]} features")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The fundamental tension in ML is between optimization (fitting training data) and generalization (performing well on unseen data). You can only directly control optimization.
- Overfitting occurs when the model learns training-specific patterns that do not generalize. It is the most common problem in practical ML.
- Underfitting means the model has not yet captured the relevant patterns -- both training and validation loss are still high.
- Three main sources of overfitting: noisy data, ambiguous features, and spurious correlations from rare features.
- Feature selection helps by removing irrelevant or noisy inputs before training begins.`,
};

export default lesson;
