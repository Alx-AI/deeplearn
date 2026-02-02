/**
 * Lesson 5.9: Recurrent Neural Networks (RNNs)
 *
 * Covers: RNN concept, hidden state, SimpleRNN, LSTM, GRU, return_sequences
 * Source sections: 13.3.1, 13.3.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.9',
  title: 'Recurrent Neural Networks (RNNs)',
  sections: [
    {
      id: '5.9.1',
      title: 'Processing Sequences with Hidden State',
      content: `
Unlike Conv1D, which detects local patterns within a fixed window, **Recurrent Neural Networks** process sequences step by step, maintaining a **hidden state** that carries information from all previous timesteps.

At each timestep t, the RNN takes two inputs: the current input x_t and the previous hidden state h_{t-1}. It produces a new hidden state h_t that is a compressed summary of everything seen so far:

\`\`\`python
h_t = activation(W_input @ x_t + W_hidden @ h_{t-1} + bias)
\`\`\`

The hidden state acts as the network's "memory." At timestep 50, it contains information about timesteps 1 through 50 -- though in practice, earlier timesteps are increasingly forgotten.

The **SimpleRNN** implements this basic formula but suffers from **vanishing gradients** on long sequences. As the gradient propagates back through many timesteps, it shrinks toward zero, preventing the network from learning long-range dependencies.

**LSTM** (Long Short-Term Memory) solves this with **gating mechanisms** -- forget gate, input gate, and output gate -- that control what information to keep, add, or output. These gates create "gradient highways" that let information and gradients flow across many timesteps without degradation.

**GRU** (Gated Recurrent Unit) is a simplified alternative to LSTM with two gates instead of three. It is faster to train and often performs similarly:

\`\`\`python
x = layers.LSTM(64)(inputs)     # Full-featured, 3 gates
x = layers.GRU(64)(inputs)      # Simpler, 2 gates, often equivalent
\`\`\`
`,
      reviewCardIds: ['rc-5.9-1', 'rc-5.9-2', 'rc-5.9-3'],
      illustrations: ['rnn-unrolled'],
      codeExamples: [
        {
          title: 'SimpleRNN, LSTM, and GRU layers side by side',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

inputs = keras.Input(shape=(120, 14))

# SimpleRNN: basic recurrence (prone to vanishing gradients)
out_simple = layers.SimpleRNN(64)(inputs)

# LSTM: 3 gates for long-range memory
out_lstm = layers.LSTM(64)(inputs)

# GRU: 2 gates, simpler and often equally effective
out_gru = layers.GRU(64)(inputs)`,
        },
        {
          title: 'Full LSTM model for timeseries forecasting',
          language: 'python',
          code: `model = keras.Sequential([
    layers.LSTM(64, input_shape=(120, 14)),
    layers.Dense(32, activation="relu"),
    layers.Dense(1),
])
model.compile(optimizer="adam", loss="mae")
model.summary()`,
        },
      ],
    },
    {
      id: '5.9.2',
      title: 'return_sequences and Stacking RNNs',
      content: `
By default, an RNN layer returns only the final timestep's hidden state -- a single vector summarizing the entire sequence. Setting \`return_sequences=True\` returns the hidden state at every timestep, producing a full sequence output:

\`\`\`python
# Final state only: output shape = (batch_size, 64)
x = layers.LSTM(64, return_sequences=False)(inputs)

# Full sequence: output shape = (batch_size, timesteps, 64)
x = layers.LSTM(64, return_sequences=True)(inputs)
\`\`\`

This matters when **stacking** RNN layers. The second LSTM expects a sequence as input, so the first must output a full sequence:

\`\`\`python
x = layers.LSTM(64, return_sequences=True)(inputs)  # Outputs sequence
x = layers.LSTM(32)(x)                               # Outputs final state
\`\`\`

\`return_sequences=True\` is also essential for sequence-to-sequence tasks (like translation) where you need an output for every input position.

For choosing between LSTM and GRU: GRU is faster and uses less memory. LSTM has slightly more representational capacity. In practice, both perform similarly on many tasks. Start with GRU for speed, switch to LSTM if you need maximum performance on very long sequences.
`,
      reviewCardIds: ['rc-5.9-4', 'rc-5.9-5'],
      illustrations: ['return-sequences'],
      codeExamples: [
        {
          title: 'return_sequences=True vs False output shapes',
          language: 'python',
          code: `inputs = keras.Input(shape=(120, 14))

# Final state only: shape (batch_size, 64)
final_only = layers.LSTM(64, return_sequences=False)(inputs)
print(final_only.shape)  # (None, 64)

# Full sequence: shape (batch_size, 120, 64)
full_seq = layers.LSTM(64, return_sequences=True)(inputs)
print(full_seq.shape)    # (None, 120, 64)`,
        },
        {
          title: 'Stacking two LSTM layers with return_sequences',
          language: 'python',
          code: `model = keras.Sequential([
    layers.LSTM(64, return_sequences=True, input_shape=(120, 14)),
    layers.LSTM(32),  # returns final state only
    layers.Dense(1),
])
model.compile(optimizer="adam", loss="mae")
print(f"Parameters: {model.count_params():,}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- RNNs process sequences step by step, maintaining a hidden state that carries information across timesteps.
- SimpleRNN suffers from vanishing gradients; LSTM and GRU use gating mechanisms to enable long-range dependencies.
- LSTM has 3 gates (forget, input, output); GRU has 2 gates and is simpler but often equally effective.
- return_sequences=True outputs every timestep's state; False outputs only the final state.
- When stacking RNN layers, all but the last must use return_sequences=True.`,
};

export default lesson;
