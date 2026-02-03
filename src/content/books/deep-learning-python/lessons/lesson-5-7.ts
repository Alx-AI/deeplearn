/**
 * Lesson 5.7: Timeseries Forecasting Fundamentals
 *
 * Covers: Timeseries setup, sliding windows, baselines, temporal splits
 * Source sections: 13.1, 13.2.1, 13.2.2, 13.2.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.7',
  title: 'Timeseries Forecasting Fundamentals',
  sections: [
    {
      id: '5.7.1',
      title: 'Setting Up a Timeseries Problem',
      content: `
**Timeseries forecasting** predicts future values based on historical patterns. Applications range from weather prediction and stock prices to energy demand and server load forecasting.

The standard setup uses a **sliding window**: take the last $N$ timesteps as input and predict the value at some future horizon. For example, use the last 120 hours of temperature data to predict the temperature 24 hours ahead:

\`\`\`python
# Each sample: input = last 120 hours, target = temp at hour 144
for i in range(len(data) - window_size - horizon):
    inputs.append(data[i : i + window_size])
    targets.append(data[i + window_size + horizon])
\`\`\`

A critical rule for timeseries: **always split chronologically**. Train on earlier data, validate on later data, test on the most recent data. Random shuffling would create temporal leakage -- the model could use future information to predict the past, producing unrealistically good results that fail in production.

Normalization uses training set statistics only. If the training data has temperature mean=15 and std=8, apply those same values to normalize the validation and test sets, even if their statistics differ.
`,
      reviewCardIds: ['rc-5.7-1', 'rc-5.7-2', 'rc-5.7-3'],
      illustrations: ['timeseries-baseline'],
      codeExamples: [
        {
          title: 'Creating sliding window datasets for timeseries',
          language: 'python',
          code: `import numpy as np
from tensorflow import keras

# Simulate hourly temperature data (1000 hours)
raw_data = np.sin(np.arange(1000) * 0.01) + np.random.randn(1000) * 0.1

window_size = 120   # use last 120 hours as input
horizon = 24        # predict 24 hours ahead

inputs, targets = [], []
for i in range(len(raw_data) - window_size - horizon):
    inputs.append(raw_data[i : i + window_size])
    targets.append(raw_data[i + window_size + horizon])
inputs, targets = np.array(inputs), np.array(targets)`,
        },
        {
          title: 'Chronological train/val/test split with training-set normalization',
          language: 'python',
          code: `# Chronological split: 70% train, 15% val, 15% test
n = len(inputs)
train_x, train_y = inputs[:int(0.7*n)], targets[:int(0.7*n)]
val_x, val_y = inputs[int(0.7*n):int(0.85*n)], targets[int(0.7*n):int(0.85*n)]
test_x, test_y = inputs[int(0.85*n):], targets[int(0.85*n):]

# Normalize using ONLY training set statistics
mean = train_x.mean()
std = train_x.std()
train_x = (train_x - mean) / std
val_x = (val_x - mean) / std
test_x = (test_x - mean) / std`,
        },
      ],
    },
    {
      id: '5.7.2',
      title: 'The Importance of Baselines',
      content: `
Before building any ML model, establish a **common-sense baseline**. For temperature prediction, the simplest baseline is: "Tomorrow's temperature equals today's temperature." This persistence baseline exploits the high autocorrelation in temperature data and is surprisingly hard to beat.

\`\`\`python
# Persistence baseline
baseline_mae = np.mean(np.abs(data[1:] - data[:-1]))
\`\`\`

If this baseline achieves MAE of 2.3 degrees and your neural network achieves MAE of 2.5 degrees, your model is **worse than doing nothing**. This happens more often than you might think, especially with poorly designed architectures or preprocessing errors.

Always compare your model against the baseline. A model is only useful if it beats the trivial prediction. For different domains, the baseline differs:
- Temperature: persistence (today = tomorrow)
- Stock prices: persistence or random walk
- Classification: always predict the most common class
- Seasonal data: predict the same day last year

MAE (Mean Absolute Error) is the standard metric for timeseries regression because it is directly interpretable in the original units: an MAE of 2.5 degrees means predictions are off by 2.5 degrees on average.
`,
      reviewCardIds: ['rc-5.7-4', 'rc-5.7-5'],
      codeExamples: [
        {
          title: 'Computing a persistence baseline and evaluating with MAE',
          language: 'python',
          code: `import numpy as np

# Persistence baseline: predict tomorrow = today
baseline_preds = val_x[:, -1]  # last value of each window
baseline_mae = np.mean(np.abs(val_y - baseline_preds))
print(f"Persistence baseline MAE: {baseline_mae:.4f}")`,
        },
        {
          title: 'Training a simple Dense model and comparing to baseline',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

model = keras.Sequential([
    layers.Flatten(input_shape=(120,)),
    layers.Dense(64, activation="relu"),
    layers.Dense(1),
])
model.compile(optimizer="adam", loss="mae")
model.fit(train_x[..., np.newaxis], train_y, epochs=10,
          validation_data=(val_x[..., np.newaxis], val_y), verbose=0)

model_mae = model.evaluate(val_x[..., np.newaxis], val_y, verbose=0)
print(f"Model MAE: {model_mae:.4f} vs Baseline MAE: {baseline_mae:.4f}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Timeseries forecasting uses sliding windows over historical data to predict future values.
- Data must be split chronologically: train on past, validate on recent, test on most recent.
- Normalization uses training set statistics only -- never compute statistics from test data.
- Always establish a common-sense baseline; a model that fails to beat it has learned nothing useful.
- MAE measures average prediction error in original units, making it directly interpretable.`,
};

export default lesson;
