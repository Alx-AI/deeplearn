/**
 * Lesson 6.2: Word Embeddings and Sequence Models for Text
 *
 * Covers: Embedding layers, bag-of-words vs sequence models, pretrained embeddings
 * Source sections: 14.3, 14.4, 14.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.2',
  title: 'Word Embeddings and Sequence Models for Text',
  sections: [
    {
      id: '6.2.1',
      title: 'From Integers to Dense Vectors',
      content: `
Token indices are integers, but feeding raw integers into a neural network is not ideal -- the numeric distance between indices is meaningless (word 42 is not "closer" to word 43 than to word 1000). We need a way to represent tokens as dense vectors where proximity reflects semantic similarity.

An **Embedding layer** is a learnable lookup table that maps each integer index to a dense vector:

\`\`\`python
embedding = layers.Embedding(input_dim=20000, output_dim=256)
# Input: integer index 42 -> Output: 256-dimensional vector
\`\`\`

With vocabulary_size=20,000 and embedding_dim=256, the layer has 5,120,000 trainable parameters -- one 256-dim vector per token. During training, these vectors are adjusted so that semantically similar words end up with similar vectors. "Cat" and "kitten" might end up close together in embedding space, while "cat" and "airplane" are far apart.

**Pretrained embeddings** like Word2Vec and GloVe were trained on billions of words and encode rich semantic relationships. The famous example: vector("king") - vector("man") + vector("woman") is close to vector("queen"). Use pretrained embeddings when your training data is limited; train from scratch when you have abundant domain-specific data.
`,
      reviewCardIds: ['rc-6.2-1', 'rc-6.2-2', 'rc-6.2-3'],
      illustrations: ['word-embedding'],
      codeExamples: [
        {
          title: 'Create a trainable Embedding layer in Keras',
          language: 'python',
          code: `from keras import layers
import numpy as np

embedding = layers.Embedding(input_dim=10000, output_dim=128)

# Simulate a batch of 2 sequences, each length 5
token_ids = np.array([[12, 84, 3, 907, 5], [7, 42, 0, 1, 88]])
vectors = embedding(token_ids)
print(vectors.shape)  # (2, 5, 128) -- each token is now a 128-dim vector`,
        },
        {
          title: 'Load pretrained GloVe embeddings into a Keras layer',
          language: 'python',
          code: `import numpy as np
from keras import layers

# Assume glove_matrix is (vocab_size, embed_dim) loaded from GloVe file
vocab_size, embed_dim = 10000, 100
glove_matrix = np.random.randn(vocab_size, embed_dim)  # placeholder

embedding = layers.Embedding(vocab_size, embed_dim,
                             embeddings_initializer="zeros",
                             trainable=False)
embedding.build((None,))
embedding.set_weights([glove_matrix])
# Embeddings are frozen -- pretrained knowledge is preserved`,
        },
      ],
    },
    {
      id: '6.2.2',
      title: 'Bag-of-Words vs. Sequence Models',
      content: `
Once tokens are embedded, you have two broad modeling strategies:

**Bag-of-words** treats text as an unordered set of tokens. The simplest version creates a multi-hot vector (which words appear, ignoring order). More sophisticated versions average the embedding vectors. "Not good" and "good not" produce identical representations.

Despite ignoring word order, bag-of-words models work surprisingly well for tasks where individual word presence is more informative than syntax -- topic classification, spam detection, simple sentiment analysis.

**Sequence models** process words in order, capturing how meaning changes with position. "The dog bit the man" means something very different from "the man bit the dog." RNNs, Conv1D, and Transformers are all sequence models.

\`\`\`python
# Bag-of-words approach
x = layers.Embedding(20000, 128)(inputs)
x = layers.GlobalAveragePooling1D()(x)  # Average all embeddings

# Sequence approach
x = layers.Embedding(20000, 128)(inputs)
x = layers.LSTM(64)(x)                  # Process sequentially
\`\`\`

For many text classification tasks, a bag-of-words model is a strong baseline. Try it first. If word order matters for your task (sentiment with negation, question answering, machine translation), use a sequence model.
`,
      reviewCardIds: ['rc-6.2-4', 'rc-6.2-5'],
      illustrations: ['bag-of-words-vs-sequence'],
      codeExamples: [
        {
          title: 'Bag-of-words text classifier in Keras',
          language: 'python',
          code: `from keras import layers, Model, Input

inputs = Input(shape=(200,), dtype="int32")
x = layers.Embedding(20000, 128)(inputs)
x = layers.GlobalAveragePooling1D()(x)  # Average embeddings (bag-of-words)
x = layers.Dense(64, activation="relu")(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = Model(inputs, outputs)
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])`,
        },
        {
          title: 'Sequence model (LSTM) for text classification',
          language: 'python',
          code: `from keras import layers, Model, Input

inputs = Input(shape=(200,), dtype="int32")
x = layers.Embedding(20000, 128)(inputs)
x = layers.LSTM(64)(x)  # Process tokens in order
x = layers.Dense(64, activation="relu")(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = Model(inputs, outputs)
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Embedding layers map integer token indices to dense vectors where similar words are nearby.
- Pretrained embeddings (Word2Vec, GloVe) encode semantic relationships from billions of words of text.
- Bag-of-words models ignore word order but work well for topic classification and simple sentiment analysis.
- Sequence models (RNN, Conv1D, Transformer) capture word-order dependencies.
- Start with bag-of-words as a baseline; upgrade to sequence models when order matters.`,
};

export default lesson;
