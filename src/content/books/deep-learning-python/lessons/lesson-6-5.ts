/**
 * Lesson 6.5: Transformer Decoder and Positional Encoding
 *
 * Covers: Causal masking, cross-attention, positional encoding, encoder-decoder Transformer
 * Source sections: 15.3.3, 15.3.4, 15.3.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.5',
  title: 'Transformer Decoder and Positional Encoding',
  sections: [
    {
      id: '6.5.1',
      title: 'Causal Masking and Cross-Attention',
      content: `
The Transformer **decoder** differs from the encoder in two important ways: it uses **causal masking** and **cross-attention**.

**Causal masking** prevents each token from attending to future tokens. Token 5 can attend to tokens 1-5 but not 6, 7, etc. This is essential because during generation, future tokens do not exist yet -- the model must predict them. Without masking, the model would "cheat" during training by looking at the answer.

\`\`\`python
# Causal mask: lower triangular matrix
# Token 1 sees: [1, 0, 0, 0]
# Token 2 sees: [1, 1, 0, 0]
# Token 3 sees: [1, 1, 1, 0]
# Token 4 sees: [1, 1, 1, 1]
\`\`\`

**Cross-attention** connects the decoder to the encoder. In translation, each Spanish word being generated should "look at" the relevant English words. In cross-attention, $Q$ comes from the decoder (the Spanish side), while $K$ and $V$ come from the encoder (the English side). This is how the decoder retrieves information from the source sequence.

A complete encoder-decoder Transformer for translation: the encoder processes the English sentence (bidirectional attention, no masking). The decoder generates the Spanish sentence token by token (causal self-attention + cross-attention to the encoder output).
`,
      reviewCardIds: ['rc-6.5-1', 'rc-6.5-2', 'rc-6.5-3'],
      illustrations: ['transformer-block'],
      codeExamples: [
        {
          title: 'Create a causal attention mask',
          language: 'python',
          code: `import numpy as np

def causal_mask(seq_len):
    """Lower-triangular mask: each token sees only itself and previous tokens."""
    mask = np.tril(np.ones((seq_len, seq_len)))
    return mask  # 1 = attend, 0 = blocked

print(causal_mask(4))
# [[1, 0, 0, 0],
#  [1, 1, 0, 0],
#  [1, 1, 1, 0],
#  [1, 1, 1, 1]]`,
        },
        {
          title: 'Causal self-attention with Keras MultiHeadAttention',
          language: 'python',
          code: `from keras import layers
import numpy as np

mha = layers.MultiHeadAttention(num_heads=4, key_dim=32)

x = np.random.randn(1, 10, 128).astype("float32")
# use_causal_mask=True prevents attending to future positions
output = mha(query=x, key=x, value=x, use_causal_mask=True)
print(output.shape)  # (1, 10, 128)`,
        },
      ],
    },
    {
      id: '6.5.2',
      title: 'Positional Encoding',
      content: `
Attention treats input as an **unordered set** -- it computes pairwise scores regardless of position. Without positional information, "the cat sat on the mat" and "mat the on sat cat the" would produce identical attention outputs. Word order clearly matters in language.

**Positional encoding** adds position information to each token embedding. Two common approaches:

**Sinusoidal encoding**: uses sine and cosine functions at different frequencies to encode each position. Different frequencies capture position at different scales (character, word, phrase). A key property: the encoding for position 10 minus position 5 has the same pattern as position 100 minus position 95, helping the model learn relative positions.

**Learned positional embeddings**: treat positions as learnable parameters, just like word embeddings. Position 0 gets one learned vector, position 1 gets another, etc. This is simpler and often works equally well.

\`\`\`python
# Add positional information to token embeddings
x = token_embedding + positional_encoding
# Now the model knows both WHAT each token is and WHERE it is
\`\`\`

In both cases, positional encoding is simply **added** to the token embedding before entering the Transformer. The model then has access to both semantic content (from the embedding) and positional information (from the encoding).

Positional encoding completes the Transformer architecture. With self-attention, causal masking, cross-attention, and position information, you have all the components needed for modern NLP.
`,
      reviewCardIds: ['rc-6.5-4', 'rc-6.5-5'],
      illustrations: ['positional-encoding'],
      codeExamples: [
        {
          title: 'Sinusoidal positional encoding from scratch',
          language: 'python',
          code: `import numpy as np

def sinusoidal_encoding(max_len, embed_dim):
    pos = np.arange(max_len)[:, np.newaxis]
    dim = np.arange(0, embed_dim, 2)[np.newaxis, :]
    angles = pos / (10000 ** (dim / embed_dim))
    encoding = np.zeros((max_len, embed_dim))
    encoding[:, 0::2] = np.sin(angles)
    encoding[:, 1::2] = np.cos(angles)
    return encoding

pe = sinusoidal_encoding(max_len=200, embed_dim=128)
print(pe.shape)  # (200, 128)`,
        },
        {
          title: 'Learned positional embedding in Keras',
          language: 'python',
          code: `from keras import layers, Input, Model

max_len, vocab_size, embed_dim = 200, 20000, 128

inputs = Input(shape=(max_len,), dtype="int32")
token_embed = layers.Embedding(vocab_size, embed_dim)(inputs)
pos_embed = layers.Embedding(max_len, embed_dim)(
    np.arange(max_len)  # Position indices [0, 1, ..., 199]
)
x = token_embed + pos_embed  # Combine token + position info`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Causal masking in the decoder prevents tokens from attending to future positions, essential for autoregressive generation.
- Cross-attention connects decoder to encoder: $Q$ from decoder, $K$ and $V$ from encoder.
- Positional encoding is necessary because attention is inherently order-agnostic.
- Sinusoidal encoding uses multi-frequency sine/cosine; learned encoding treats positions as learnable parameters.
- Position information is added to token embeddings before entering the Transformer.`,
};

export default lesson;
