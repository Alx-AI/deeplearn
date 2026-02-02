/**
 * Lesson 3.6: Regularization
 *
 * Covers: Dataset curation, feature engineering, early stopping
 * Source sections: 5.4.1, 5.4.2, 5.4.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.6',
  title: 'Regularization',
  sections: [
    {
      id: '3.6.1',
      title: 'Dataset Curation',
      content: `
Once your model can overfit the training data, your focus shifts from improving fit to improving **generalization**. The set of techniques for doing this is collectively called **regularization** -- any method that constrains the model to generalize better rather than merely memorizing training data.

The single most effective form of regularization is not a modeling technique at all -- it is **improving your data**. Generalization in deep learning originates from the latent structure of the data. If your data forms a smooth, well-structured manifold, the model can interpolate between training points and generalize to new inputs. If your data is noisy, sparse, or poorly structured, no amount of clever modeling will save you.

Practical steps for dataset curation:

- **Get more data** -- A denser sampling of the input space always helps. Problems that seem unsolvable with 1,000 samples might become tractable with 100,000. If you have extra time or budget to spend on a project, investing in more data almost always yields a better return than searching for a better model.

- **Minimize labeling errors** -- Visualize your inputs and spot-check your labels. Mislabeled samples are a direct source of overfitting because the model tries to memorize contradictory signals.

- **Clean your data** -- Deal with missing values, remove duplicates, and handle outliers. Missing categorical values can be treated as a separate category. Missing numerical values should be replaced by the mean or median of the feature, not by an arbitrary value like zero (which could introduce a discontinuity in the feature space).

- **Do feature selection** -- If you have many features and are unsure which ones carry real signal, compute a usefulness score (like mutual information with the target) and discard features below a threshold. Fewer noisy features means less opportunity for spurious correlations.

The message is clear: **data quality beats model sophistication**. Spending 50 hours curating a better dataset will almost always outperform spending 50 hours tuning model hyperparameters.
`,
      reviewCardIds: ['rc-3.6-1', 'rc-3.6-2'],
      illustrations: ['dataset-curation'],
      codeExamples: [
        {
          title: 'Computing feature usefulness with mutual information',
          language: 'python',
          code: `from sklearn.feature_selection import mutual_info_classif
import numpy as np

# X is your feature matrix, y is your target labels
X = np.random.randn(1000, 10)
y = (X[:, 0] + X[:, 2] > 0).astype(int)  # only features 0 and 2 matter

scores = mutual_info_classif(X, y, random_state=42)
for i, score in enumerate(scores):
    print(f"Feature {i}: MI = {score:.3f}")
# Features 0 and 2 will have the highest scores`,
        },
        {
          title: 'Handling missing values in numerical features',
          language: 'python',
          code: `import numpy as np

data = np.array([1.0, 2.0, np.nan, 4.0, np.nan, 6.0])

# Replace NaN with the feature median (not zero!)
median_val = np.nanmedian(data)
data_clean = np.where(np.isnan(data), median_val, data)
print(f"Median fill: {data_clean}")  # [1. 2. 3. 4. 3. 6.]`,
        },
      ],
    },
    {
      id: '3.6.2',
      title: 'Feature Engineering',
      content: `
**Feature engineering** is the process of using your domain knowledge to transform raw data into features that make the model's job easier. Even though deep learning can automatically extract features from raw data, hand-crafted features can still provide significant advantages.

Consider a classic example: reading the time from a clock face image. If you feed raw pixels to a convolutional network, you have a difficult learning problem requiring significant computational resources. But if you first extract the \`(x, y)\` coordinates of each clock hand tip -- a simple five-line script -- the problem becomes trivially easy. Go further and convert to polar coordinates (the angle of each hand), and you do not even need a model at all: a lookup table suffices.

This illustrates the essence of feature engineering: **make the latent manifold smoother and simpler**. By transforming raw inputs into more informative representations, you reduce the complexity of the mapping the model needs to learn.

Before deep learning, feature engineering was the *most critical* part of the ML pipeline. Classical algorithms could not learn good features on their own, so the quality of hand-crafted features determined success or failure. Deep learning has reduced this dependency because neural networks extract their own features from raw data -- but feature engineering still matters for two reasons:

1. **Elegance and efficiency** -- Good features let you solve problems with simpler models and fewer resources. Using a convolutional network to read a clock face when coordinate extraction would suffice is wasteful.

2. **Small data regimes** -- Deep learning's ability to learn features depends on having large amounts of training data. When data is scarce, the informational value of well-engineered features becomes critical. Feature engineering can compensate for limited data.
`,
      reviewCardIds: ['rc-3.6-3', 'rc-3.6-4'],
      illustrations: ['feature-engineering'],
      codeExamples: [
        {
          title: 'Feature normalization: scaling and standardization',
          language: 'python',
          code: `import numpy as np

raw = np.array([100.0, 200.0, 300.0, 400.0, 500.0])

# Min-max scaling to [0, 1]
scaled = (raw - raw.min()) / (raw.max() - raw.min())
print(f"Scaled: {scaled}")  # [0.   0.25 0.5  0.75 1.  ]

# Standardization: zero mean, unit variance
standardized = (raw - raw.mean()) / raw.std()
print(f"Standardized: {standardized}")  # [-1.41 -0.71  0.  0.71  1.41]`,
        },
        {
          title: 'Converting Cartesian coordinates to polar (clock hand example)',
          language: 'python',
          code: `import numpy as np

# Raw clock hand tip coordinates (x, y)
hand_tip = np.array([[0.0, 1.0], [0.87, 0.5], [0.0, -1.0]])

# Transform to polar: angle tells us the time directly
angles = np.arctan2(hand_tip[:, 0], hand_tip[:, 1])
angles_degrees = np.degrees(angles)
print(f"Angles (degrees): {angles_degrees}")
# [0, 60, 180] -- directly maps to clock positions!`,
        },
      ],
    },
    {
      id: '3.6.3',
      title: 'Using Early Stopping',
      content: `
In practice, deep learning models are always **overparameterized** -- they have far more degrees of freedom than the minimum required to fit the data manifold. This is by design. You never fully fit a deep learning model; a perfect fit to the training data would not generalize at all.

Instead, you interrupt training at the point where generalization is best. This technique is called **early stopping**, and it is one of the most effective and commonly used regularization methods.

The idea is straightforward: monitor validation loss during training, and stop when it begins to increase. The epoch with the lowest validation loss represents the sweet spot between underfitting and overfitting.

In earlier examples, we used a two-pass approach: train for many epochs to find the optimal number, then retrain from scratch for exactly that many epochs. This works but is wasteful. A more practical approach is to use a callback that automatically stops training and remembers the best model weights:

\`\`\`python
from keras.callbacks import EarlyStopping

# EarlyStopping monitors validation loss and stops when
# it hasn't improved for 'patience' consecutive epochs.
# restore_best_weights ensures we keep the best model.
early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=5,
    restore_best_weights=True,
)

model.fit(
    train_data, train_labels,
    epochs=100,            # Set a generous upper bound
    validation_split=0.2,
    callbacks=[early_stopping],
)
# Training will stop automatically when validation loss
# plateaus, and the model will use the best weights found.
\`\`\`

Early stopping is essentially "free" regularization -- it requires no changes to the model architecture or training process. You simply train for longer than necessary and let the callback find the optimal stopping point. Combined with dataset curation and feature engineering, early stopping forms the foundation of a solid generalization strategy.
`,
      reviewCardIds: ['rc-3.6-5'],
      illustrations: ['early-stopping'],
      codeExamples: [
        {
          title: 'Early stopping with custom patience and minimum improvement',
          language: 'python',
          code: `from keras.callbacks import EarlyStopping

# min_delta: minimum change to count as an improvement
# patience: epochs to wait after last improvement
early_stop = EarlyStopping(
    monitor="val_loss",
    min_delta=0.001,
    patience=10,
    restore_best_weights=True,
    verbose=1,
)
# Use in model.fit(..., callbacks=[early_stop])`,
        },
        {
          title: 'Combining EarlyStopping with ModelCheckpoint',
          language: 'python',
          code: `from keras.callbacks import EarlyStopping, ModelCheckpoint

callbacks = [
    EarlyStopping(monitor="val_loss", patience=5,
                  restore_best_weights=True),
    ModelCheckpoint("best_model.keras",
                    monitor="val_loss", save_best_only=True),
]
# ModelCheckpoint saves the best weights to disk
# EarlyStopping halts training when val_loss stalls`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Regularization is any technique that improves generalization at the expense of training performance.
- The most effective "regularization" is better data: more samples, cleaner labels, and feature selection.
- Feature engineering transforms raw data into more informative representations, making the model's job easier and reducing data requirements.
- Early stopping monitors validation loss and halts training at the optimal point between underfitting and overfitting.
- Deep learning models are always overparameterized by design. You never fully fit them -- you stop at the point of best generalization.
- Data quality and curation consistently outperform model sophistication as a strategy for improving generalization.`,
};

export default lesson;
