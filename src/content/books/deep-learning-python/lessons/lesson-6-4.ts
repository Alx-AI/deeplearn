/**
 * Lesson 6.4: Sequence-to-Sequence and the Transformer Architecture
 *
 * Covers: Seq2seq, dot-product attention, multi-head attention, Transformer encoder
 * Source sections: 15.2, 15.3.1, 15.3.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.4',
  title: 'Sequence-to-Sequence and the Transformer Architecture',
  sections: [
    {
      id: '6.4.1',
      title: 'Attention: Focusing on What Matters',
      content: `
**Sequence-to-sequence** (seq2seq) tasks map an input sequence to an output sequence -- translation (English to Spanish), summarization (long text to short), or question answering (question to answer).

The breakthrough that made seq2seq practical is **attention**. Instead of compressing the entire input into a single vector (the RNN bottleneck), attention lets the model directly examine any part of the input when producing each output token.

**Dot-product attention** works through three learned projections of each token:
- **Query ($Q$)**: "what am I looking for?"
- **Key ($K$)**: "what do I contain?"
- **Value ($V$)**: "what information do I provide?"

The attention score between tokens is computed as $QK^T$, scaled by $\\sqrt{d_k}$ to prevent softmax saturation. The output is a weighted sum of Values:

\`\`\`python
scores = Q @ K.T / sqrt(d_key)     # How relevant is each key to each query
weights = softmax(scores)            # Normalize to probabilities
output = weights @ V                 # Weighted sum of values
\`\`\`

**Multi-head attention** runs multiple attention mechanisms in parallel, each with different learned $Q$, $K$, $V$ projections. One head might attend to syntactic relationships, another to semantic similarity, another to positional proximity. Their outputs are concatenated and linearly projected.
`,
      reviewCardIds: ['rc-6.4-1', 'rc-6.4-2', 'rc-6.4-3'],
      illustrations: ['attention-mechanism'],
      codeExamples: [
        {
          title: 'Scaled dot-product attention from scratch',
          language: 'python',
          code: `import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_key = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_key)     # Similarity scores
    weights = np.exp(scores) / np.exp(scores).sum(axis=-1, keepdims=True)
    return weights @ V                     # Weighted sum of values

# Example: 4 tokens, key dimension 8
Q = np.random.randn(4, 8)
K = np.random.randn(4, 8)
V = np.random.randn(4, 8)
output = scaled_dot_product_attention(Q, K, V)
print(output.shape)  # (4, 8)`,
        },
        {
          title: 'Using Keras MultiHeadAttention layer',
          language: 'python',
          code: `from keras import layers
import numpy as np

# Multi-head self-attention: Q, K, V all come from the same input
mha = layers.MultiHeadAttention(num_heads=4, key_dim=32)

# Simulated input: batch=1, seq_len=10, embed_dim=128
x = np.random.randn(1, 10, 128).astype("float32")
output = mha(query=x, key=x, value=x)
print(output.shape)  # (1, 10, 128)`,
        },
      ],
    },
    {
      id: '6.4.2',
      title: 'The Transformer Encoder Block',
      content: `
The **Transformer** architecture, introduced in the landmark 2017 "Attention Is All You Need" paper, is built entirely from attention mechanisms -- no recurrence, no convolutions.

A Transformer encoder block contains:
1. **Multi-head self-attention**: each token attends to all other tokens in the sequence
2. **Add & Norm**: residual connection + layer normalization
3. **Feed-forward network**: two Dense layers applied to each position independently
4. **Add & Norm**: another residual connection + layer normalization

\`\`\`python
# Pseudocode for one Transformer encoder block
attention_output = MultiHeadAttention(x, x, x)
x = LayerNorm(x + attention_output)          # Residual + norm
ff_output = Dense(Dense(x))
x = LayerNorm(x + ff_output)                 # Residual + norm
\`\`\`

The key advantage over RNNs: **parallelism**. An RNN must process tokens sequentially (token 5 depends on token 4's output). In a Transformer, all attention computations happen simultaneously -- every token attends to every other token in one parallel step. This makes Transformers dramatically faster to train on modern GPU/TPU hardware.

Additionally, each token can directly attend to any other token regardless of distance. An RNN must propagate information through every intermediate step, losing fidelity. A Transformer gets a direct "shortcut" between any two positions. This solves the long-range dependency problem that plagued RNNs.
`,
      reviewCardIds: ['rc-6.4-4', 'rc-6.4-5'],
      illustrations: ['transformer-block'],
      codeExamples: [
        {
          title: 'Transformer encoder block in Keras',
          language: 'python',
          code: `from keras import layers, Model, Input

def transformer_encoder_block(embed_dim, num_heads, ff_dim):
    inputs = Input(shape=(None, embed_dim))
    # Multi-head self-attention
    attn_output = layers.MultiHeadAttention(
        num_heads=num_heads, key_dim=embed_dim // num_heads
    )(inputs, inputs)
    x = layers.LayerNormalization()(inputs + attn_output)
    # Feed-forward network
    ff = layers.Dense(ff_dim, activation="relu")(x)
    ff = layers.Dense(embed_dim)(ff)
    outputs = layers.LayerNormalization()(x + ff)
    return Model(inputs, outputs)

encoder_block = transformer_encoder_block(128, 4, 256)`,
        },
        {
          title: 'Stack multiple encoder blocks for a Transformer',
          language: 'python',
          code: `from keras import layers, Input, Model

embed_dim, num_heads, ff_dim = 128, 4, 256

inputs = Input(shape=(200,), dtype="int32")
x = layers.Embedding(20000, embed_dim)(inputs)
for _ in range(4):  # Stack 4 encoder blocks
    attn = layers.MultiHeadAttention(num_heads, embed_dim // num_heads)(x, x)
    x = layers.LayerNormalization()(x + attn)
    ff = layers.Dense(ff_dim, activation="relu")(x)
    ff = layers.Dense(embed_dim)(ff)
    x = layers.LayerNormalization()(x + ff)

x = layers.GlobalAveragePooling1D()(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = Model(inputs, outputs)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Attention computes relevance scores between tokens via $Q \\cdot K$ dot products, then weights $V$ accordingly.
- Multi-head attention runs multiple parallel attention mechanisms to capture different types of relationships.
- A Transformer encoder block: multi-head attention -> add & norm -> feed-forward -> add & norm.
- Transformers process all tokens in parallel (unlike sequential RNNs), enabling much faster training.
- Direct attention between any two tokens solves the long-range dependency problem without vanishing gradients.`,
};

export default lesson;
