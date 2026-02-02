/**
 * Lesson 3.9: Developing a Model
 *
 * Covers: Data prep, evaluation protocol, overfitting, tuning
 * Source sections: 6.2.1, 6.2.2, 6.2.3, 6.2.4, 6.2.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.9',
  title: 'Developing a Model',
  sections: [
    {
      id: '3.9.1',
      title: 'Preparing Data and Choosing an Evaluation Protocol',
      content: `
With the task defined and data collected, you move to model development. This is often treated as the entire ML workflow in tutorials and courses, but in practice it is just one step. The good news: compared to problem framing and data collection, model development follows a well-defined recipe.

**Step 1: Prepare your data.** Neural networks expect tensors of floating-point numbers. Whatever your raw data -- text, images, audio, tabular records -- it must be converted into this format through **vectorization**.

After vectorization, apply **normalization**. Neural networks struggle with features that have very different scales or very large values. Two common approaches:

\`\`\`python
# Simple scaling to [0, 1] range
x = x.astype("float32") / 255.0

# Standardization: zero mean, unit variance
x -= x.mean(axis=0)
x /= x.std(axis=0)
\`\`\`

Handle **missing values** thoughtfully. For categorical features, create a new "missing" category. For numerical features, replace missing values with the feature's mean or median -- not zero, which can create artificial discontinuities. If you expect missing values at inference time but your training data has none, artificially drop some values during training so the model learns to handle them.

**Step 2: Choose an evaluation protocol.** Pick one of the three standard approaches based on your dataset size:

- **Hold-out validation** -- Simple split; works when you have plenty of data.
- **K-fold cross-validation** -- Rotate the validation fold; use when data is limited.
- **Iterated K-fold with shuffling** -- Most reliable but most expensive; for very small datasets.

Always ensure training and validation sets are disjoint and representative of the overall distribution.
`,
      reviewCardIds: ['rc-3.9-1', 'rc-3.9-2'],
      illustrations: ['ml-workflow'],
      codeExamples: [
        {
          title: 'K-fold cross-validation for small datasets',
          language: 'python',
          code: `from sklearn.model_selection import KFold
import numpy as np

X = np.random.randn(200, 10)
y = np.random.randint(0, 2, 200)
kf = KFold(n_splits=5, shuffle=True, random_state=42)

for fold, (train_idx, val_idx) in enumerate(kf.split(X)):
    X_train, X_val = X[train_idx], X[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]
    print(f"Fold {fold}: train={len(train_idx)}, val={len(val_idx)}")
    # Build and train a fresh model for each fold`,
        },
        {
          title: 'Vectorization and normalization pipeline',
          language: 'python',
          code: `import numpy as np

# Vectorize: convert raw data to float tensors
images = np.random.randint(0, 256, (1000, 28, 28))
x = images.astype("float32")

# Normalize: zero mean, unit variance (per-feature)
mean = x.mean(axis=0)
std = x.std(axis=0) + 1e-7  # avoid division by zero
x_normalized = (x - mean) / std
print(f"Mean: {x_normalized.mean():.4f}, Std: {x_normalized.std():.4f}")`,
        },
      ],
    },
    {
      id: '3.9.2',
      title: 'Beating a Baseline and Scaling Up',
      content: `
**Step 3: Beat a baseline.** Your first model should be simple. The goal is not perfection -- it is to demonstrate that the model can extract meaningful signal from the data. Choose a loss function, architecture, and optimizer based on your task type, and verify that validation performance exceeds a trivial baseline.

If you cannot beat the baseline after several reasonable attempts, revisit your assumptions. Either the inputs do not contain enough information to predict the outputs, or your data preprocessing has a bug.

**Step 4: Scale up to overfit.** Once you have a model with statistical power, make it bigger. Add layers, make layers wider, and train for more epochs. Your goal is to get the model to *overfit* -- this proves it has enough capacity to learn the task.

\`\`\`python
# Start with a model that has statistical power
model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])

# If it can't overfit, increase capacity:
model = keras.Sequential([
    layers.Dense(256, activation="relu"),
    layers.Dense(256, activation="relu"),
    layers.Dense(256, activation="relu"),
    layers.Dense(1, activation="sigmoid"),
])
# Train for enough epochs to see the training/validation gap
\`\`\`

Watch for the telltale sign: training loss keeps decreasing while validation loss begins to increase. This divergence means you have crossed the boundary from underfitting into overfitting. That is exactly what you want -- it tells you the model has more than enough capacity.

If training loss goes to near zero but the model cannot generalize at all, the issue may be that your model architecture does not match the data type. A dense network will struggle with image data where a convolutional network would succeed.
`,
      reviewCardIds: ['rc-3.9-3', 'rc-3.9-4'],
      illustrations: ['scale-up-to-overfit'],
      codeExamples: [
        {
          title: 'Debugging: checking tensor shapes at each layer',
          language: 'python',
          code: `from keras import Sequential, layers
import numpy as np

model = Sequential([
    layers.Dense(256, activation="relu", input_shape=(784,)),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])

# Print shape at each layer to verify data flow
x = np.random.randn(1, 784).astype("float32")
for layer in model.layers:
    x = layer(x)
    print(f"{layer.name:20s} -> output shape: {x.shape}")`,
        },
        {
          title: 'Monitoring for the overfit signal: train vs validation loss',
          language: 'python',
          code: `# After model.fit(), inspect the training history
# history = model.fit(X_train, y_train, validation_split=0.2, epochs=50)

# Check for the overfit signal
# train_loss = history.history["loss"]
# val_loss = history.history["val_loss"]
# gap = [v - t for t, v in zip(train_loss, val_loss)]
# print(f"Final gap (val - train): {gap[-1]:.4f}")
# A growing positive gap means overfitting has begun

# Pseudocode -- replace with your actual history object
import numpy as np
train_loss = np.linspace(0.5, 0.01, 50)
val_loss = np.concatenate([np.linspace(0.5, 0.15, 25),
                           np.linspace(0.15, 0.35, 25)])
overfit_epoch = np.argmin(val_loss)
print(f"Best epoch: {overfit_epoch}, val_loss: {val_loss[overfit_epoch]:.3f}")`,
        },
      ],
    },
    {
      id: '3.9.3',
      title: 'Regularizing and Tuning',
      content: `
**Step 5: Regularize and tune.** This is where you spend the most time. Having established that the model can overfit, you now work to close the gap between training and validation performance.

Try these approaches systematically:

- **Add dropout** -- Start with 0.3-0.5 between dense layers. This is often the single most impactful regularization technique.
- **Add weight regularization** -- L2 regularization (weight decay) for smaller models. Typical values: 1e-4 to 1e-2.
- **Reduce model capacity** -- Remove layers or reduce layer sizes. Find the sweet spot between expressiveness and overfitting.
- **Tune hyperparameters** -- Experiment with different learning rates, batch sizes, number of units, and number of layers.
- **Iterate on data** -- Consider collecting more data, improving feature engineering, or removing noisy features.

\`\`\`python
# A regularized version of the model
model = keras.Sequential([
    layers.Dense(128, activation="relu",
                 kernel_regularizer=keras.regularizers.l2(1e-3)),
    layers.Dropout(0.4),
    layers.Dense(128, activation="relu",
                 kernel_regularizer=keras.regularizers.l2(1e-3)),
    layers.Dropout(0.4),
    layers.Dense(1, activation="sigmoid"),
])
\`\`\`

**Be mindful of information leakage.** Every time you evaluate on the validation set and adjust the model, you leak a small amount of information. Over many experiments, this accumulates. If your final validation score is significantly better than your test score, you may have overfit to the validation process itself.

Once you have a satisfactory configuration, train the final model on all non-test data (training + validation combined) and evaluate once on the test set. If the test score is significantly worse than the validation score, your validation procedure may not have been reliable enough -- consider switching to K-fold validation for your next project.
`,
      reviewCardIds: ['rc-3.9-5'],
      illustrations: ['regularization'],
      codeExamples: [
        {
          title: 'Systematic hyperparameter tuning with manual search',
          language: 'python',
          code: `from keras import Sequential, layers, regularizers

def build_model(units, dropout_rate, l2_weight):
    model = Sequential([
        layers.Dense(units, activation="relu",
                     kernel_regularizer=regularizers.l2(l2_weight)),
        layers.Dropout(dropout_rate),
        layers.Dense(units, activation="relu",
                     kernel_regularizer=regularizers.l2(l2_weight)),
        layers.Dropout(dropout_rate),
        layers.Dense(1, activation="sigmoid"),
    ])
    model.compile(optimizer="adam", loss="binary_crossentropy")
    return model

# Try different configurations
for units in [64, 128]:
    for dropout in [0.3, 0.5]:
        model = build_model(units, dropout, l2_weight=1e-3)
        print(f"units={units}, dropout={dropout}, "
              f"params={model.count_params():,}")`,
        },
        {
          title: 'Training on all non-test data for final evaluation',
          language: 'python',
          code: `import numpy as np

# After tuning, train final model on train + validation data
# X_all = np.concatenate([X_train, X_val])
# y_all = np.concatenate([y_train, y_val])
# final_model = build_model(best_units, best_dropout, best_l2)
# final_model.fit(X_all, y_all, epochs=best_epoch)

# Evaluate ONCE on the held-out test set
# test_loss = final_model.evaluate(X_test, y_test)
# print(f"Final test loss: {test_loss:.4f}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The five-step model development workflow: prepare data, choose evaluation protocol, beat a baseline, scale up to overfit, regularize and tune.
- Vectorize and normalize all inputs. Handle missing values explicitly, not with arbitrary fill values.
- If you cannot beat a trivial baseline, the problem may be in the data or preprocessing, not the model.
- Scaling up to overfit proves the model has enough capacity. The training/validation divergence is the signal you are looking for.
- Regularization closes the gap: dropout, L2 regularization, reduced capacity, and more data are the primary tools.
- Watch for information leakage from repeated validation-based tuning. The final test evaluation should be done only once.`,
};

export default lesson;
