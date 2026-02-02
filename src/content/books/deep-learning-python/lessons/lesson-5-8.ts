/**
 * Lesson 5.8: 1D Convolutions for Timeseries
 *
 * Covers: Conv1D for sequences, temporal pattern detection, receptive field limitations
 * Source sections: 13.2.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.8',
  title: '1D Convolutions for Timeseries',
  sections: [
    {
      id: '5.8.1',
      title: 'Applying Conv1D to Sequences',
      content: `
Just as Conv2D slides a kernel over spatial dimensions to detect local image patterns, **Conv1D** slides a kernel along the time axis to detect local temporal patterns. The input has shape \`(timesteps, features)\` -- at each timestep, there are multiple features (temperature, humidity, pressure, wind speed, etc.).

\`\`\`python
inputs = keras.Input(shape=(120, 14))  # 120 timesteps, 14 features
x = layers.Conv1D(32, kernel_size=5, activation="relu")(inputs)
x = layers.MaxPooling1D(2)(x)
x = layers.Conv1D(64, kernel_size=5, activation="relu")(x)
x = layers.GlobalAveragePooling1D()(x)
outputs = layers.Dense(1)(x)
\`\`\`

A Conv1D kernel of size 5 looks at 5 consecutive timesteps across all features, detecting patterns like "temperature rising while humidity drops" over a 5-hour window. Like Conv2D, these patterns are **translation-invariant in time** -- a temperature spike looks the same whether it happens Monday or Thursday.

Conv1D often outperforms Dense layers for timeseries because it explicitly models local temporal structure. Dense layers treat each feature at each timestep independently, while Conv1D captures interactions within short time windows.
`,
      reviewCardIds: ['rc-5.8-1', 'rc-5.8-2'],
      illustrations: ['convolution'],
      codeExamples: [
        {
          title: 'Building a Conv1D model for timeseries forecasting',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

inputs = keras.Input(shape=(120, 14))  # 120 timesteps, 14 features
x = layers.Conv1D(32, kernel_size=5, activation="relu")(inputs)
x = layers.MaxPooling1D(2)(x)
x = layers.Conv1D(64, kernel_size=5, activation="relu")(x)
x = layers.GlobalAveragePooling1D()(x)
outputs = layers.Dense(1)(x)

model = keras.Model(inputs, outputs)
model.compile(optimizer="adam", loss="mae")
model.summary()`,
        },
        {
          title: 'Comparing Conv1D kernel sizes for different pattern scales',
          language: 'python',
          code: `# Small kernel: captures short patterns (e.g., 3-hour trends)
x = layers.Conv1D(32, kernel_size=3, activation="relu")(inputs)

# Larger kernel: captures wider patterns (e.g., 12-hour cycles)
x = layers.Conv1D(32, kernel_size=12, activation="relu")(inputs)

# Very large kernel: day-long patterns (24-hour seasonality)
x = layers.Conv1D(32, kernel_size=24, activation="relu")(inputs)`,
        },
      ],
    },
    {
      id: '5.8.2',
      title: 'Receptive Field Limitations',
      content: `
The main limitation of Conv1D is its **receptive field** -- the span of timesteps that can influence a given output. A single Conv1D with kernel_size=5 sees only 5 timesteps. Stacking multiple Conv1D layers with pooling increases the receptive field (each layer sees the output of the previous, which itself summarized a wider window), but it can still be insufficient for very long-range patterns.

If important patterns span 365 days but the receptive field is only 30 timesteps, the model will miss yearly seasonal cycles. Solutions include:
- **Stack more Conv1D layers** with pooling to increase the receptive field
- **Use dilated convolutions** that skip timesteps to cover a wider range without more parameters
- **Switch to recurrent models** (RNNs) that maintain state across the entire sequence

In practice, Conv1D is a strong baseline for timeseries tasks with primarily local patterns. It trains faster than RNNs, is easier to parallelize, and performs surprisingly well when combined with a Dense layer head. For many practical timeseries problems (short-term weather forecasting, anomaly detection, activity recognition), Conv1D is competitive with or superior to more complex approaches.

The pattern is identical to image ConvNets: Conv1D -> Pool -> Conv1D -> Pool -> GlobalPool -> Dense. The only difference is that everything happens along one dimension (time) rather than two (height and width).
`,
      reviewCardIds: ['rc-5.8-3', 'rc-5.8-4'],
      illustrations: ['receptive-field-growth'],
      codeExamples: [
        {
          title: 'Stacking Conv1D layers to expand the receptive field',
          language: 'python',
          code: `inputs = keras.Input(shape=(365, 14))
x = layers.Conv1D(32, kernel_size=7, activation="relu")(inputs)
x = layers.MaxPooling1D(2)(x)       # receptive field: 7 steps
x = layers.Conv1D(64, kernel_size=7, activation="relu")(x)
x = layers.MaxPooling1D(2)(x)       # receptive field: ~27 steps
x = layers.Conv1D(64, kernel_size=7, activation="relu")(x)
x = layers.GlobalAveragePooling1D()(x)  # covers full remaining
outputs = layers.Dense(1)(x)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Using dilated convolutions for wider receptive field',
          language: 'python',
          code: `# Dilated convolutions skip timesteps to see further back
inputs = keras.Input(shape=(365, 14))
x = layers.Conv1D(32, kernel_size=3, dilation_rate=1, activation="relu",
                   padding="causal")(inputs)   # sees 3 steps
x = layers.Conv1D(32, kernel_size=3, dilation_rate=2, activation="relu",
                   padding="causal")(x)        # sees 7 steps
x = layers.Conv1D(32, kernel_size=3, dilation_rate=4, activation="relu",
                   padding="causal")(x)        # sees 15 steps
x = layers.GlobalAveragePooling1D()(x)
outputs = layers.Dense(1)(x)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Conv1D slides a kernel along the time axis, detecting local temporal patterns that are translation-invariant in time.
- Input shape is (timesteps, features); Conv1D captures interactions within short time windows.
- The main limitation is receptive field: Conv1D can miss long-range patterns beyond its effective window.
- Solutions for limited receptive field: stacking layers, dilated convolutions, or switching to RNNs.
- Conv1D is a strong, fast baseline for timeseries with primarily local temporal patterns.`,
};

export default lesson;
