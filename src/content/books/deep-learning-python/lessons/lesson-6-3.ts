/**
 * Lesson 6.3: The Language Model Concept
 *
 * Covers: Language modeling, autoregressive generation, character-level models
 * Source sections: 15.1, 15.1.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.3',
  title: 'The Language Model Concept',
  sections: [
    {
      id: '6.3.1',
      title: 'Predicting the Next Token',
      content: `
A **language model** learns a deceptively simple probability distribution: given all tokens observed so far, what is the probability of each possible next token? Formally: $p(\\text{token} | \\text{past tokens})$.

Why predict one token at a time rather than entire sentences? Because the output space for even short sentences is astronomical. With a 20,000-word vocabulary, there are $20{,}000^4$ (160 quadrillion) possible 4-word sequences. But predicting one token at a time requires only 20,000 outputs per step -- feasible for a softmax layer.

The training setup is elegant: given a text sequence, the label at each position is simply the **next token**. If the input is "First Citizen:", the label is "irst Citizen:\\n" -- the same text shifted by one position:

\`\`\`python
features = text[:-1]    # "First Citizen:"
labels = text[1:]       # "irst Citizen:\\n"
\`\`\`

The model learns to predict every character (or word) from the characters that came before it. A character-level model trained on Shakespeare learns character patterns, common words, line structures, and even basic grammar -- all from the simple objective of guessing the next character.

\`\`\`python
inputs = layers.Input(shape=(sequence_length,), dtype="int")
x = layers.Embedding(vocabulary_size, 256)(inputs)
x = layers.GRU(1024, return_sequences=True)(x)
outputs = layers.Dense(vocabulary_size, activation="softmax")(x)
\`\`\`
`,
      reviewCardIds: ['rc-6.3-1', 'rc-6.3-2', 'rc-6.3-3'],
      illustrations: ['next-token-prediction'],
      codeExamples: [
        {
          title: 'Prepare next-token-prediction training data',
          language: 'python',
          code: `import numpy as np

# Simulated token IDs for "to be or not to be"
tokens = np.array([5, 12, 8, 42, 5, 12])

# Features: all tokens except the last
features = tokens[:-1]  # [5, 12, 8, 42, 5]

# Labels: all tokens except the first (shifted by one)
labels = tokens[1:]     # [12, 8, 42, 5, 12]
# Each label is the next token the model should predict`,
        },
        {
          title: 'Build a simple character-level language model in Keras',
          language: 'python',
          code: `from keras import layers, Model, Input

vocab_size = 128   # ASCII characters
seq_length = 64

inputs = Input(shape=(seq_length,), dtype="int32")
x = layers.Embedding(vocab_size, 256)(inputs)
x = layers.GRU(512, return_sequences=True)(x)
outputs = layers.Dense(vocab_size, activation="softmax")(x)

model = Model(inputs, outputs)
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy")`,
        },
      ],
    },
    {
      id: '6.3.2',
      title: 'Autoregressive Generation',
      content: `
Once trained, a language model can generate text through **autoregressive generation**: repeatedly predicting the next token, then using that prediction as input for the next step.

\`\`\`python
# Pseudocode for text generation
generated = "To be or"
for _ in range(100):
    next_token_probs = model.predict(generated)
    next_token = sample(next_token_probs)
    generated += next_token
\`\`\`

The model takes a seed text, predicts a probability distribution over possible next tokens, samples one, appends it, and repeats. Each new prediction is conditioned on everything generated so far.

A model that generates its own input for future predictions is called an **autoregressive model**. This is the core mechanism behind all text generation systems, from simple Shakespeare generators to ChatGPT.

With only ~70% character prediction accuracy, a simple GRU-based model can still generate surprisingly coherent text. This is because language has strong statistical regularities: after "th" the characters "e" or "a" are highly likely, and the 70% that are predicted correctly maintain enough structure for readability. The 30% of errors create "creative" variations that occasionally produce novel words or phrasing.

The quality of generated text depends directly on model capacity. A 4-million-parameter character model produces recognizable but imperfect Shakespeare. Scaling to billions of parameters and training on the entire internet produces GPT-class models -- the same fundamental concept, vastly more capacity.
`,
      reviewCardIds: ['rc-6.3-4', 'rc-6.3-5'],
      illustrations: ['autoregressive-gen'],
      codeExamples: [
        {
          title: 'Autoregressive text generation loop',
          language: 'python',
          code: `import numpy as np

def generate_text(model, seed_tokens, length=100, vocab_size=128):
    generated = list(seed_tokens)
    for _ in range(length):
        input_seq = np.array([generated[-64:]])  # Last 64 tokens
        probs = model.predict(input_seq, verbose=0)[0, -1, :]
        next_token = np.random.choice(vocab_size, p=probs)
        generated.append(next_token)
    return generated`,
        },
        {
          title: 'Temperature-controlled sampling for generation',
          language: 'python',
          code: `import numpy as np

def sample_with_temperature(logits, temperature=1.0):
    """Lower temperature -> more deterministic, higher -> more random."""
    logits = np.array(logits, dtype="float64")
    logits /= temperature
    exp_logits = np.exp(logits - np.max(logits))
    probs = exp_logits / np.sum(exp_logits)
    return np.random.choice(len(probs), p=probs)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- A language model predicts $p(\\text{next\\_token} | \\text{past\\_tokens})$ -- the probability distribution over possible next tokens.
- Training labels are simply the input sequence shifted by one position.
- Autoregressive generation produces text by repeatedly predicting and appending the next token.
- Even modest character-level models generate surprisingly coherent text due to language's statistical regularities.
- The same fundamental concept scales from simple character models to billion-parameter LLMs.`,
};

export default lesson;
