/**
 * Lesson 5.11: Timeseries Best Practices and Going Further
 *
 * Covers: Model comparison, ensembles, attention preview, feature engineering
 * Source sections: 13.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.11',
  title: 'Timeseries Best Practices',
  sections: [
    {
      id: '5.11.1',
      title: 'Comparing Approaches',
      content: `
For timeseries forecasting, you now have three model families to choose from:

- **Dense layers**: the simplest approach. Flattens the window and treats each feature independently. Fast to train, good baseline, but ignores temporal structure.
- **Conv1D**: detects local temporal patterns. Handles short-term trends and periodicities well, but limited by receptive field for long-range dependencies.
- **RNNs (LSTM/GRU)**: maintain state across the entire sequence. Best for long-range dependencies but slower to train.

In practice, the differences in accuracy are often smaller than expected. A well-tuned Dense model can be surprisingly competitive with complex RNNs. The best approach depends on your data's characteristics: if patterns are primarily local (daily cycles), Conv1D may suffice; if long-range context matters (annual seasons), RNNs or Transformers are more appropriate.

**Ensemble approaches** -- combining predictions from multiple model types -- often outperform any single model. Average the predictions of a Dense model, a Conv1D model, and an LSTM model. Because different architectures capture different patterns, their errors tend to be uncorrelated, and the ensemble smooths out individual weaknesses.
`,
      reviewCardIds: ['rc-5.11-1', 'rc-5.11-2'],
      illustrations: ['timeseries-baseline'],
      codeExamples: [
        {
          title: 'Building and comparing Dense, Conv1D, and LSTM models',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

def make_dense(input_shape):
    return keras.Sequential([
        layers.Flatten(input_shape=input_shape),
        layers.Dense(64, activation="relu"),
        layers.Dense(1)])

def make_conv(input_shape):
    return keras.Sequential([
        layers.Conv1D(32, 5, activation="relu", input_shape=input_shape),
        layers.MaxPooling1D(2),
        layers.GlobalAveragePooling1D(),
        layers.Dense(1)])

def make_lstm(input_shape):
    return keras.Sequential([
        layers.LSTM(64, input_shape=input_shape),
        layers.Dense(1)])`,
        },
        {
          title: 'Simple ensemble by averaging predictions',
          language: 'python',
          code: `import numpy as np

# Assume each model is already trained
pred_dense = dense_model.predict(val_x)
pred_conv = conv_model.predict(val_x)
pred_lstm = lstm_model.predict(val_x)

# Ensemble: average the predictions
ensemble_pred = (pred_dense + pred_conv + pred_lstm) / 3.0
ensemble_mae = np.mean(np.abs(val_y - ensemble_pred.squeeze()))
print(f"Ensemble MAE: {ensemble_mae:.4f}")`,
        },
      ],
    },
    {
      id: '5.11.2',
      title: 'Feature Engineering and Attention',
      content: `
**Feature engineering** can significantly boost timeseries performance. Instead of feeding raw values, create features that make patterns explicit:

- **Lag features**: include the value from 24 hours ago, 7 days ago, 1 year ago
- **Rolling statistics**: 7-day moving average, rolling standard deviation
- **Cyclical encoding**: encode time-of-day as sine/cosine so 23:59 and 0:01 are numerically close
- **Calendar features**: day of week, month, holiday indicators

These features reduce the learning burden on the model. A rolling 7-day average explicitly provides trend information that the model would otherwise have to discover from raw data.

Looking ahead, the **attention mechanism** (covered in Module 6) addresses a key RNN limitation. An RNN compresses all past information into a fixed-size hidden state, creating a bottleneck where distant information gets increasingly lost. Attention lets the model directly access any past timestep, assigning learned importance weights. This means relevant distant events can be recalled with full fidelity.

Transformers -- which are entirely based on attention -- have become competitive with RNNs for timeseries. They process all timesteps in parallel (faster training) and handle long-range dependencies without the gradient issues of recurrence.

For production timeseries systems, remember: monitor performance continuously, retrain regularly as data distributions shift, and always compare against updated baselines.
`,
      reviewCardIds: ['rc-5.11-3', 'rc-5.11-4', 'rc-5.11-5'],
      illustrations: ['cyclical-encoding'],
      codeExamples: [
        {
          title: 'Cyclical encoding for time-of-day and day-of-year',
          language: 'python',
          code: `import numpy as np

hours = np.arange(24)
# Encode so hour 23 and hour 0 are neighbors
hour_sin = np.sin(2 * np.pi * hours / 24)
hour_cos = np.cos(2 * np.pi * hours / 24)

days = np.arange(365)
day_sin = np.sin(2 * np.pi * days / 365)
day_cos = np.cos(2 * np.pi * days / 365)

# Add as extra features alongside raw data
# shape: (timesteps, original_features + 4)`,
        },
        {
          title: 'Creating lag features and rolling statistics',
          language: 'python',
          code: `import pandas as pd

df = pd.DataFrame({"temp": temperature_data})
# Lag features: value from 24h ago, 7 days ago
df["lag_24h"] = df["temp"].shift(24)
df["lag_7d"] = df["temp"].shift(24 * 7)

# Rolling statistics: 24-hour mean and std
df["roll_mean_24h"] = df["temp"].rolling(24).mean()
df["roll_std_24h"] = df["temp"].rolling(24).std()
df = df.dropna()  # remove rows with NaN from shifting`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Dense, Conv1D, and RNN each have strengths: simplicity, local patterns, and long-range dependencies respectively.
- Ensemble approaches combining multiple model types often outperform any single model.
- Feature engineering (lags, rolling stats, cyclical encoding) makes important patterns explicit and reduces learning burden.
- Attention mechanisms let models directly access any past timestep, overcoming the RNN hidden-state bottleneck.
- Production timeseries systems require ongoing monitoring, regular retraining, and baseline comparisons.`,
};

export default lesson;
