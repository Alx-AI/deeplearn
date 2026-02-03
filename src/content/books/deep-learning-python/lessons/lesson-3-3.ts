/**
 * Lesson 3.3: Evaluating Models
 *
 * Covers: Train/val/test splits, cross-validation
 * Source sections: 5.2.1, 5.2.2, 5.2.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.3',
  title: 'Evaluating Models',
  sections: [
    {
      id: '3.3.1',
      title: 'Training, Validation, and Test Sets',
      content: `
You can only improve what you can measure. Since the goal of machine learning is generalization, you need a reliable way to measure how well your model generalizes. This requires splitting your data into **three** separate sets, not just two.

- **Training set** -- The data the model learns from.
- **Validation set** -- The data used to tune hyperparameters and make decisions during development (number of layers, learning rate, regularization strength, etc.).
- **Test set** -- A completely untouched dataset used for one final evaluation before deployment.

Why three sets instead of two? Because model development involves many decisions. Every time you evaluate on the validation set and then adjust something -- add a layer, change the learning rate, tweak dropout -- you are indirectly fitting to the validation data. This is called **information leakage**: bits of information about the validation set "leak" into the model through your tuning decisions.

A single adjustment leaks very little information. But over dozens or hundreds of experiments, the cumulative leakage can be substantial. Your model may appear to perform well on the validation set simply because it has been optimized for that particular data. The test set serves as a safeguard: it is used only once, at the very end, to provide an honest estimate of real-world performance.

\`\`\`python
import numpy as np

# Simple hold-out validation
num_validation_samples = 10000
np.random.shuffle(data)
validation_data = data[:num_validation_samples]
training_data = data[num_validation_samples:]

model = get_model()
model.fit(training_data, ...)
validation_score = model.evaluate(validation_data, ...)

# After tuning, train final model on all non-test data
model = get_model()
model.fit(np.concatenate([training_data, validation_data]), ...)
test_score = model.evaluate(test_data, ...)
\`\`\`
`,
      reviewCardIds: ['rc-3.3-1', 'rc-3.3-2'],
      illustrations: ['three-way-data-split'],
      codeExamples: [
        {
          title: 'Three-way split using sklearn',
          language: 'python',
          code: `from sklearn.model_selection import train_test_split

# First split: separate out the test set (held until the very end)
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42)

# Second split: create training and validation sets
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.18, random_state=42)
# Result: ~70% train, ~15% validation, ~15% test

print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")`,
        },
      ],
    },
    {
      id: '3.3.2',
      title: 'K-Fold Cross-Validation',
      content: `
Simple hold-out validation works well when you have plenty of data. But when your dataset is small, the validation and test splits may contain too few samples to be statistically representative. You will know this is happening if different random shuffles before splitting lead to very different performance estimates.

**K-fold cross-validation** addresses this problem. You split the data into $K$ equal-sized partitions (folds). Then you train $K$ separate models: for each one, you hold out a different fold as the validation set and train on the remaining $K-1$ folds. The final score is the average across all $K$ runs.

\`\`\`python
k = 3
num_validation_samples = len(data) // k
np.random.shuffle(data)
validation_scores = []

for fold in range(k):
    # Select a different validation fold each time
    val_start = num_validation_samples * fold
    val_end = num_validation_samples * (fold + 1)
    validation_data = data[val_start:val_end]
    training_data = np.concatenate([
        data[:val_start], data[val_end:]
    ])
    model = get_model()
    model.fit(training_data, ...)
    score = model.evaluate(validation_data, ...)
    validation_scores.append(score)

final_score = np.average(validation_scores)
\`\`\`

For even more reliable estimates with very small datasets, you can use **iterated K-fold validation with shuffling**: run K-fold validation multiple times, reshuffling the data each time, and average all scores. This is more expensive (you train $P \\times K$ models total) but produces very stable estimates.
`,
      reviewCardIds: ['rc-3.3-3', 'rc-3.3-4'],
      illustrations: ['k-fold-validation'],
      codeExamples: [
        {
          title: 'K-fold cross-validation with sklearn',
          language: 'python',
          code: `from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
import numpy as np

model = LogisticRegression(max_iter=1000)
scores = cross_val_score(model, X_train, y_train, cv=5, scoring="accuracy")
print(f"Fold accuracies: {scores}")
print(f"Mean: {scores.mean():.4f} (+/- {scores.std():.4f})")
# 5 folds give a more reliable estimate than a single split`,
        },
        {
          title: 'Iterated K-fold with shuffling for small datasets',
          language: 'python',
          code: `from sklearn.model_selection import RepeatedKFold, cross_val_score

rkf = RepeatedKFold(n_splits=4, n_repeats=3, random_state=42)
scores = cross_val_score(model, X_train, y_train, cv=rkf, scoring="accuracy")
print(f"12 total runs (4 folds x 3 repeats)")
print(f"Mean: {scores.mean():.4f} (+/- {scores.std():.4f})")
# More expensive but produces very stable estimates`,
        },
      ],
    },
    {
      id: '3.3.3',
      title: 'Things to Keep in Mind About Evaluation',
      content: `
No matter which evaluation protocol you choose, there are several pitfalls to watch out for:

**Data representativeness** -- Both your training and validation sets must be representative of the overall data distribution. If your dataset is sorted by class (all 0s first, then all 1s, and so on), taking the first 80% as training and the last 20% as validation means your validation set only contains a few classes. Always shuffle your data before splitting -- unless temporal order matters.

**The arrow of time** -- For tasks involving temporal predictions (weather forecasting, stock prices, etc.), you must *not* shuffle before splitting. Doing so creates temporal leakage: the model would be trained on future data to predict the past. Instead, split chronologically: train on the earlier portion, validate on more recent data, and test on the most recent data.

**Redundancy in your data** -- If some data points appear multiple times, random shuffling might place copies in both training and validation. This means you would be evaluating on data the model has already seen, giving a misleadingly optimistic score. Always check for and remove duplicates before splitting.

**Beating a common-sense baseline** -- Before celebrating any validation score, compare it against a trivial baseline. For MNIST, a random classifier achieves ~10% accuracy. For IMDB sentiment, random guessing gets ~50%. For a binary classification problem where 90% of samples belong to one class, always predicting the majority class gives 90% accuracy. If your model cannot beat such baselines, it has learned nothing useful from the data. A common-sense baseline is your sanity check that the model is actually extracting meaningful patterns.
`,
      reviewCardIds: ['rc-3.3-5'],
      illustrations: ['evaluation-pitfalls'],
      codeExamples: [
        {
          title: 'Checking for data leakage via duplicates',
          language: 'python',
          code: `import numpy as np

# Check for duplicate rows that could appear in both splits
train_set = set(map(tuple, X_train))
val_set = set(map(tuple, X_val))
overlap = train_set & val_set
print(f"Overlapping samples: {len(overlap)}")
# If overlap > 0, remove duplicates before splitting`,
        },
        {
          title: 'Chronological split for time series data',
          language: 'python',
          code: `import numpy as np

# For temporal data, never shuffle -- split by time
sorted_indices = np.argsort(timestamps)
data_sorted = data[sorted_indices]

n = len(data_sorted)
train_data = data_sorted[:int(0.7 * n)]       # oldest 70%
val_data = data_sorted[int(0.7 * n):int(0.85 * n)]  # next 15%
test_data = data_sorted[int(0.85 * n):]       # most recent 15%
# Train on the past, validate and test on the future`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Always split data into three sets: training (learn), validation (tune), and test (final honest evaluation).
- Information leakage occurs when repeated tuning on the validation set causes the model to indirectly overfit to it. The test set guards against this.
- Use K-fold cross-validation when your dataset is too small for a reliable hold-out split.
- For temporal data, split chronologically -- never shuffle.
- Always compare your model against a common-sense baseline to confirm it has learned something meaningful.
- Check for data representativeness and redundancy before splitting.`,
};

export default lesson;
