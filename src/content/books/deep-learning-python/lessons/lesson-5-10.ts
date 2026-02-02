/**
 * Lesson 5.10: Advanced RNN Techniques
 *
 * Covers: Recurrent dropout, stacked RNNs, bidirectional RNNs
 * Source sections: 13.3.3, 13.3.4, 13.3.5, 13.3.6
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.10',
  title: 'Advanced RNN Techniques',
  sections: [
    {
      id: '5.10.1',
      title: 'Recurrent Dropout and Stacking',
      content: `
Standard dropout applied independently at each timestep would break an RNN: randomly zeroing different units at each step would destroy the temporal continuity of the hidden state. **Recurrent dropout** fixes this by applying the **same dropout mask at every timestep**:

\`\`\`python
x = layers.LSTM(64, recurrent_dropout=0.2, return_sequences=True)(inputs)
\`\`\`

The same units are consistently active or inactive throughout the entire sequence, preserving temporal patterns while still regularizing.

**Stacking** multiple RNN layers can improve performance by learning hierarchical temporal features -- similar to how stacking convolutions learns hierarchical spatial features. Each layer abstracts the sequence at a different level:

\`\`\`python
x = layers.LSTM(64, return_sequences=True)(inputs)
x = layers.LSTM(64, return_sequences=True)(x)
x = layers.LSTM(32)(x)  # Last layer returns final state
\`\`\`

However, there are **diminishing returns**. Unlike ConvNets where dozens of layers help, stacking more than 2-3 RNN layers rarely improves performance and risks overfitting. If performance plateaus, try increasing units in existing layers rather than adding more layers.
`,
      reviewCardIds: ['rc-5.10-1', 'rc-5.10-2'],
      illustrations: ['recurrent-dropout'],
      codeExamples: [
        {
          title: 'Adding recurrent dropout to LSTM layers',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

inputs = keras.Input(shape=(120, 14))
# recurrent_dropout: same mask at every timestep
x = layers.LSTM(64, recurrent_dropout=0.25,
                return_sequences=True)(inputs)
x = layers.LSTM(32, recurrent_dropout=0.25)(x)
outputs = layers.Dense(1)(x)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Stacked RNNs with dropout for regularization',
          language: 'python',
          code: `model = keras.Sequential([
    layers.GRU(64, recurrent_dropout=0.2,
               return_sequences=True, input_shape=(120, 14)),
    layers.GRU(64, recurrent_dropout=0.2,
               return_sequences=True),
    layers.GRU(32, recurrent_dropout=0.2),
    layers.Dense(1),
])
model.compile(optimizer="adam", loss="mae")
model.summary()`,
        },
      ],
    },
    {
      id: '5.10.2',
      title: 'Bidirectional RNNs',
      content: `
A standard RNN processes the sequence left-to-right: each timestep has context from everything before it, but not after. A **bidirectional RNN** adds a second pass that processes right-to-left, then concatenates both outputs:

\`\`\`python
x = layers.Bidirectional(layers.LSTM(64))(inputs)
# Output shape: (batch_size, 128) -- 64 forward + 64 backward
\`\`\`

For text classification, this is powerful: the meaning of a word depends on both preceding and following words. "Not good" needs the left context ("not") to understand "good" as negative.

But bidirectional RNNs have a strict limitation: they require the **entire sequence to be available**. This makes them inappropriate for:
- **Timeseries forecasting**: you cannot use future values to predict the future
- **Real-time processing**: you cannot wait for the entire input before starting

Use bidirectional RNNs for tasks where the complete input is available upfront (text classification, named entity recognition, sentiment analysis) but never for sequential prediction tasks where you are predicting the next value in a stream.

The output of \`Bidirectional(LSTM(64))\` is 128-dimensional because it concatenates the 64-dim forward output with the 64-dim backward output, doubling the representation capacity.
`,
      reviewCardIds: ['rc-5.10-3', 'rc-5.10-4', 'rc-5.10-5'],
      illustrations: ['bidirectional-rnn'],
      codeExamples: [
        {
          title: 'Bidirectional LSTM for text classification',
          language: 'python',
          code: `# Bidirectional: processes sequence forward AND backward
inputs = keras.Input(shape=(200,))  # 200-token sequences
x = layers.Embedding(10000, 128)(inputs)
x = layers.Bidirectional(layers.LSTM(64))(x)
# Output: 128-dim (64 forward + 64 backward)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Stacking bidirectional layers for deeper sequence understanding',
          language: 'python',
          code: `inputs = keras.Input(shape=(200,))
x = layers.Embedding(10000, 128)(inputs)
x = layers.Bidirectional(
    layers.LSTM(64, return_sequences=True))(x)
x = layers.Bidirectional(layers.LSTM(32))(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)
model.compile(optimizer="adam", loss="binary_crossentropy",
              metrics=["accuracy"])`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Recurrent dropout applies the same mask at every timestep to preserve temporal continuity.
- Stacking 2-3 RNN layers can help, but diminishing returns set in quickly.
- Bidirectional RNNs process sequences in both directions, doubling the output dimension.
- Bidirectional is only valid when the complete sequence is available (text classification, not timeseries forecasting).
- Bidirectional(LSTM(64)) produces 128-dim output by concatenating forward and backward passes.`,
};

export default lesson;
