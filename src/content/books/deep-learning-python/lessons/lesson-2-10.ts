/**
 * Lesson 2.10: Predicting House Prices
 *
 * Covers: California housing regression, feature normalization, K-fold validation
 * Source sections: 4.3.1 through 4.3.6
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.10',
  title: 'Predicting House Prices',
  sections: [
    {
      id: '2.10.1',
      title: 'Regression: Predicting Continuous Values',
      content: `
So far we've classified things into categories. Now we shift to **regression** -- predicting a continuous number. Instead of "positive or negative?" or "which of 46 topics?", we're asking "how much does this house cost?"

The California Housing dataset contains information about 600 districts from the 1990 census. For each district, we know eight features: longitude, latitude, median house age, population, number of households, median income, total rooms, and total bedrooms. The target is the median house value in the district.

\`\`\`python
from keras.datasets import california_housing

(train_data, train_targets), (test_data, test_targets) = (
    california_housing.load_data(version="small")
)
# train_data.shape: (480, 8)  -- 480 districts, 8 features each
# test_data.shape: (120, 8)
\`\`\`

Only 480 training samples -- that's tiny by deep learning standards. This introduces challenges we haven't faced before.

**Feature normalization** is essential here. The eight features have wildly different scales: median income might range from 0 to 15, while total rooms could be in the thousands. If we feed these raw values into a network, features with large values would dominate the learning process, and gradient descent would be painfully slow.

The fix: **subtract the mean and divide by the standard deviation** for each feature, centering everything around $0$ with a standard deviation of $1$:

\`\`\`python
mean = train_data.mean(axis=0)
std = train_data.std(axis=0)
x_train = (train_data - mean) / std
x_test = (test_data - mean) / std    # Use TRAINING stats, not test stats!
\`\`\`

Critical detail: we compute mean and std from the *training data only*, then apply those same values to normalize the test data. Computing separate statistics from the test data would be **data leakage** -- using information you shouldn't have access to during evaluation. In production, you won't have future data statistics available.

We also scale the targets, dividing by 100,000 so that house prices in the $60K-$500K range become values between 0.6 and 5.0. This helps the model learn faster since its small initial random weights would otherwise need enormous updates to predict values in the hundreds of thousands:

\`\`\`python
y_train = train_targets / 100000
y_test = test_targets / 100000
\`\`\`
`,
      reviewCardIds: ['rc-2.10-1', 'rc-2.10-2', 'rc-2.10-3'],
      illustrations: ['regression'],
      codeExamples: [
        {
          title: 'Loading and normalizing the California Housing data',
          language: 'python',
          code: `from keras.datasets import california_housing

(train_data, train_targets), (test_data, test_targets) = (
    california_housing.load_data(version="small")
)
print(f"Training shape: {train_data.shape}")  # (480, 8)

# Normalize: zero mean, unit variance
mean = train_data.mean(axis=0)
std = train_data.std(axis=0)
x_train = (train_data - mean) / std
x_test = (test_data - mean) / std  # Use TRAINING stats!`,
        },
        {
          title: 'Why normalization matters: comparing feature scales',
          language: 'python',
          code: `import numpy as np

print("Before normalization:")
print(f"  Median income range: {train_data[:, 5].min():.1f} - {train_data[:, 5].max():.1f}")
print(f"  Total rooms range:   {train_data[:, 4].min():.0f} - {train_data[:, 4].max():.0f}")

print("After normalization:")
print(f"  Median income: mean={x_train[:, 5].mean():.2f}, std={x_train[:, 5].std():.2f}")
print(f"  Total rooms:   mean={x_train[:, 4].mean():.2f}, std={x_train[:, 4].std():.2f}")`,
        },
      ],
    },
    {
      id: '2.10.2',
      title: 'K-Fold Cross-Validation for Small Datasets',
      content: `
With only 480 training samples, a single train/validation split would give us a validation set of maybe 100 samples. That's so small that the validation score could vary dramatically depending on *which* 100 samples we happened to pick. Our evaluation would be unreliable.

The solution is **K-fold cross-validation**. Split the data into $K$ equal partitions (folds). Train $K$ separate models, each time using $K - 1$ folds for training and the remaining fold for validation. Average the $K$ validation scores for a reliable estimate.

\`\`\`python
k = 4
num_val_samples = len(x_train) // k    # 120 samples per fold
all_scores = []

for i in range(k):
    print(f"Processing fold #{i + 1}")
    # Carve out the validation fold
    fold_x_val = x_train[i * num_val_samples : (i + 1) * num_val_samples]
    fold_y_val = y_train[i * num_val_samples : (i + 1) * num_val_samples]
    # Everything else is training data
    fold_x_train = np.concatenate(
        [x_train[:i * num_val_samples],
         x_train[(i + 1) * num_val_samples:]], axis=0
    )
    fold_y_train = np.concatenate(
        [y_train[:i * num_val_samples],
         y_train[(i + 1) * num_val_samples:]], axis=0
    )
    model = get_model()    # Fresh model each fold
    model.fit(fold_x_train, fold_y_train,
              epochs=50, batch_size=16, verbose=0)
    scores = model.evaluate(fold_x_val, fold_y_val, verbose=0)
    all_scores.append(scores[1])  # MAE
\`\`\`

With 4-fold validation, individual fold MAE scores might range from 0.23 to 0.35 (in units of $100K), but the average of ~0.30 is a much more reliable estimate. That average tells us we're off by about $30,000 per prediction -- significant when prices range from $60K to $500K, but far better than guessing.

The key insight: **K-fold gives you a stable evaluation even when data is scarce.** Any single split could be misleadingly good or bad. Averaging across $K$ splits smooths out that noise.
`,
      reviewCardIds: ['rc-2.10-4', 'rc-2.10-5'],
      illustrations: ['k-fold-validation'],
      codeExamples: [
        {
          title: 'K-fold cross-validation loop',
          language: 'python',
          code: `import numpy as np

k = 4
num_val_samples = len(x_train) // k
all_mae_scores = []

for i in range(k):
    val_data = x_train[i * num_val_samples:(i + 1) * num_val_samples]
    val_targets = y_train[i * num_val_samples:(i + 1) * num_val_samples]
    train_data = np.concatenate(
        [x_train[:i * num_val_samples],
         x_train[(i + 1) * num_val_samples:]], axis=0)
    train_targets = np.concatenate(
        [y_train[:i * num_val_samples],
         y_train[(i + 1) * num_val_samples:]], axis=0)
    model = get_model()
    model.fit(train_data, train_targets,
              epochs=50, batch_size=16, verbose=0)
    _, mae = model.evaluate(val_data, val_targets, verbose=0)
    all_mae_scores.append(mae)

print(f"Average MAE: {np.mean(all_mae_scores):.2f}")`,
        },
      ],
    },
    {
      id: '2.10.3',
      title: 'The Regression Architecture',
      content: `
The model architecture for regression has a distinctive final layer:

\`\`\`python
def get_model():
    model = keras.Sequential([
        layers.Dense(64, activation="relu"),
        layers.Dense(64, activation="relu"),
        layers.Dense(1),                # No activation!
    ])
    model.compile(
        optimizer="adam",
        loss="mean_squared_error",
        metrics=["mean_absolute_error"],
    )
    return model
\`\`\`

Three critical differences from classification:

1. **No activation on the output layer.** The final Dense(1) has no activation function, making it a purely linear layer. This is essential because we need to output *any* continuous value. A sigmoid would constrain output to $[0, 1]$; a relu would prevent negative outputs. For regression, no constraint is correct.

2. **Mean squared error (MSE) as the loss.** MSE is the standard regression loss -- it's the average of the squared differences between predictions and targets. Squaring penalizes large errors disproportionately.

3. **Mean absolute error (MAE) as the metric.** While we optimize MSE, we monitor MAE because it's directly interpretable. An MAE of 0.30 means "on average, predictions are off by $30,000" (after undoing our scaling). MAE doesn't over-penalize outliers the way MSE does, making it a more intuitive measure of practical performance.

After using K-fold validation to determine the optimal number of epochs (~130), we train a final model on all the training data and evaluate:

\`\`\`python
model = get_model()
model.fit(x_train, y_train, epochs=130, batch_size=16, verbose=0)
test_mse, test_mae = model.evaluate(x_test, y_test)
# test_mae is approximately 0.31 -> ~$31,000 average error
\`\`\`

**Takeaways from all three projects in this module:**

You've now built models for the three most common ML problem types, each with its own recipe:

| Problem | Output Activation | Loss Function | Metric |
|---|---|---|---|
| Binary classification | sigmoid | binary_crossentropy | accuracy |
| Multiclass classification | softmax | categorical_crossentropy | accuracy |
| Regression | none (linear) | mean_squared_error | MAE |

When little data is available, use a small model (to avoid overfitting) and K-fold cross-validation (for reliable evaluation). Always normalize your input features when they have different scales. And always watch for the gap between training and validation performance -- that gap is your overfitting detector.
`,
      reviewCardIds: ['rc-2.10-6', 'rc-2.10-7', 'rc-2.10-8'],
      codeExamples: [
        {
          title: 'Regression model: no output activation + MSE loss',
          language: 'python',
          code: `import keras
from keras import layers

def get_model():
    model = keras.Sequential([
        layers.Dense(64, activation="relu"),
        layers.Dense(64, activation="relu"),
        layers.Dense(1),  # No activation -- raw continuous output
    ])
    model.compile(
        optimizer="adam",
        loss="mean_squared_error",
        metrics=["mean_absolute_error"],
    )
    return model`,
        },
        {
          title: 'Final training and evaluation on the test set',
          language: 'python',
          code: `model = get_model()
model.fit(x_train, y_train, epochs=130, batch_size=16, verbose=0)
test_mse, test_mae = model.evaluate(x_test, y_test)
print(f"Test MAE: {test_mae:.2f}")  # ~0.31
print(f"Average error in dollars: ~{test_mae * 100000:,.0f}")`,
        },
        {
          title: 'The three problem-type recipes',
          language: 'python',
          code: `# Binary classification
# Dense(1, activation="sigmoid") + binary_crossentropy

# Multiclass classification
# Dense(N, activation="softmax") + categorical_crossentropy

# Regression
# Dense(1)  [no activation] + mean_squared_error`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Regression predicts continuous values; use Dense(1) with no activation and mean_squared_error loss.
- Feature normalization (subtract mean, divide by std) is essential when features have different scales.
- Always compute normalization statistics from training data only -- using test data statistics is data leakage.
- K-fold cross-validation provides reliable evaluation when datasets are small by averaging scores across $K$ different splits.
- MAE (mean absolute error) is the most interpretable regression metric -- it tells you average prediction error in original units.
- Small datasets need small models to avoid overfitting.
- Three common problem types each have their own activation/loss/metric recipe.`,
};

export default lesson;
