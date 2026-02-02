/**
 * Lesson 3.4: Beating Baselines
 *
 * Covers: Common-sense baselines, things to keep in mind
 * Source sections: 5.2.2, 5.2.3, 6.2.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.4',
  title: 'Beating Baselines',
  sections: [
    {
      id: '3.4.1',
      title: 'Why Baselines Matter',
      content: `
Training a deep learning model can feel like launching an invisible rocket. You cannot directly observe what the model is learning -- the representations live in spaces with thousands of dimensions. The only feedback you get is your validation metrics. Without a baseline, those metrics are meaningless numbers.

A **common-sense baseline** is the simplest possible prediction you can make on a problem. It sets the floor: if your model cannot beat this trivial approach, then it has not learned anything useful from the input data. Here are some examples:

- **MNIST digit classification**: A random classifier achieves ~10% accuracy (10 classes, equal probability). Any useful model must comfortably exceed this.
- **IMDB sentiment**: Random guessing achieves ~50% (binary classification with balanced classes).
- **Reuters topic classification**: Due to class imbalance, always predicting the most common class yields ~18-19%.
- **Temperature forecasting**: Predicting "tomorrow's temperature equals today's temperature" is a strong persistence baseline.

The baseline does not have to be machine learning at all. It could be a hard-coded rule, the output of a simple statistical method, or even the result of always predicting the mean or the majority class. The point is to have a concrete reference point.

If your deep learning model cannot beat such a baseline, you have a serious problem. It usually means one of three things: the input data does not contain sufficient information to predict the targets, the data preprocessing is wrong, or the model architecture is fundamentally unsuited to the task. Rather than adding more layers, you should step back and re-examine your assumptions.
`,
      reviewCardIds: ['rc-3.4-1', 'rc-3.4-2'],
      illustrations: ['overfitting'],
      codeExamples: [
        {
          title: 'Computing common-sense baselines for different tasks',
          language: 'python',
          code: `import numpy as np

# MNIST: random guessing baseline (10 classes)
random_baseline = 1.0 / 10
print(f"MNIST random baseline: {random_baseline:.1%}")  # 10.0%

# Binary classification: majority class baseline
labels = np.array([0, 0, 0, 0, 0, 0, 0, 0, 0, 1])  # 90% class 0
majority_baseline = np.mean(labels == 0)
print(f"Majority class baseline: {majority_baseline:.1%}")  # 90.0%

# Regression: always predict the mean
y_true = np.array([3.1, 2.8, 3.5, 4.0, 2.9])
mean_pred = np.full_like(y_true, y_true.mean())
mse_baseline = np.mean((y_true - mean_pred) ** 2)
print(f"Mean-prediction MSE baseline: {mse_baseline:.4f}")`,
        },
      ],
    },
    {
      id: '3.4.2',
      title: 'Achieving Statistical Power',
      content: `
When you first begin working with a model, your initial goal should be to achieve **statistical power** -- to demonstrate that the model can extract meaningful signal from the data. This means beating your common-sense baseline by a noticeable margin.

At this stage, focus on three things:

1. **Feature engineering** -- Filter out uninformative features (feature selection) and use your domain knowledge to develop new features that might be useful. Good features make the problem easier.

2. **Architecture priors** -- Choose the right type of model for your data. Dense networks are a reasonable default for tabular data. Convolutional networks excel at image data because they encode the assumption that local spatial patterns matter. Recurrent networks or Transformers are better for sequential data. Using the wrong architecture is one of the most common reasons for failing to beat a baseline.

3. **Training configuration** -- Choose an appropriate loss function, batch size, and learning rate. For common problem types, there are well-established defaults:

| Task | Last-layer activation | Loss function |
|---|---|---|
| Binary classification | Sigmoid | Binary crossentropy |
| Multiclass single-label | Softmax | Categorical crossentropy |
| Multiclass multi-label | Sigmoid | Binary crossentropy |
| Regression | None | Mean squared error |

If you cannot achieve statistical power after trying multiple reasonable architectures, it is possible that your two core hypotheses are false: either the outputs cannot be predicted from the inputs, or the available data is insufficient to learn the relationship.
`,
      reviewCardIds: ['rc-3.4-3', 'rc-3.4-4'],
      illustrations: ['architecture-priors'],
      codeExamples: [
        {
          title: 'Achieving statistical power: building a first model to beat the baseline',
          language: 'python',
          code: `import keras
from keras import layers
from keras.datasets import mnist

(train_images, train_labels), (test_images, test_labels) = mnist.load_data()
train_images = train_images.reshape((60000, 784)).astype("float32") / 255
test_images = test_images.reshape((10000, 784)).astype("float32") / 255

model = keras.Sequential([
    layers.Dense(256, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
model.compile(optimizer="rmsprop",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
model.fit(train_images, train_labels, epochs=5, batch_size=128)
val_acc = model.evaluate(test_images, test_labels)[1]
print(f"Model accuracy: {val_acc:.1%} vs random baseline: 10.0%")`,
        },
      ],
    },
    {
      id: '3.4.3',
      title: 'Picking the Right Loss and Evaluation Strategy',
      content: `
An important subtlety is that the metric you *care about* and the loss function you *train with* are often different. Loss functions need to be differentiable and computable from mini-batches. Your success metric -- such as ROC AUC, F1 score, or customer retention rate -- might not meet these requirements.

The solution is to optimize a **proxy loss** that correlates with your actual metric. For classification, cross-entropy is the standard proxy: as cross-entropy decreases, metrics like accuracy and AUC tend to improve. For regression, mean squared error is the standard proxy even when you care about mean absolute error.

Always verify that improving your proxy loss actually improves your real metric. Occasionally they can diverge, especially with imbalanced datasets or unusual metric definitions.

Here are additional evaluation pitfalls to remember:

- **Do not tune on the test set** -- If you evaluate on the test set and then go back to modify your model, your test score is no longer trustworthy. The test set is a one-time-use resource.
- **Watch for class imbalance** -- If 90% of your data is one class, accuracy is a poor metric. Use precision, recall, F1, or AUC instead.
- **Research prior art** -- For most common problem types, there are established baselines, architectures, and loss functions. Browsing platforms like Kaggle can give you a sense of what works well for similar problems.

The combination of a reliable evaluation protocol and a meaningful baseline gives you the foundation to make informed decisions throughout the rest of the model development process. Without this foundation, you are flying blind.
`,
      reviewCardIds: ['rc-3.4-5'],
      illustrations: ['evaluation-pitfalls'],
      codeExamples: [
        {
          title: 'Comparing proxy loss with the metric you care about',
          language: 'python',
          code: `from sklearn.metrics import roc_auc_score, f1_score
import numpy as np

# After training, evaluate with the metric you actually care about
y_pred_proba = model.predict(X_val)
y_pred = (y_pred_proba > 0.5).astype(int).flatten()

# The loss function optimizes crossentropy (proxy)
# But you may care about AUC or F1 (actual metric)
auc = roc_auc_score(y_val, y_pred_proba)
f1 = f1_score(y_val, y_pred)
print(f"ROC AUC: {auc:.4f}, F1 Score: {f1:.4f}")
# Verify these improve as your proxy loss decreases`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Always establish a common-sense baseline before building any model. Without it, your metrics are meaningless.
- Failing to beat a baseline usually signals a problem with the data, preprocessing, or fundamental approach -- not just model capacity.
- Focus on feature engineering, architecture priors, and training configuration to achieve statistical power.
- The loss function you train with (proxy) may differ from the metric you actually care about -- verify they correlate.
- Standard pairings exist for common tasks: sigmoid + binary crossentropy for binary classification, softmax + categorical crossentropy for multiclass, etc.
- The test set is a one-time resource. Do not use it to make development decisions.`,
};

export default lesson;
