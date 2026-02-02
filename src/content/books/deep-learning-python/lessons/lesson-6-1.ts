/**
 * Lesson 6.1: Text Preprocessing and Tokenization
 *
 * Covers: Text pipeline, word/character/subword tokenization, BPE
 * Source sections: 14.1, 14.2.1, 14.2.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.1',
  title: 'Text Preprocessing and Tokenization',
  sections: [
    {
      id: '6.1.1',
      title: 'The Text Preprocessing Pipeline',
      content: `
Text is not numeric, so before any deep learning model can process it, we need a pipeline to convert strings into tensors. This pipeline has three stages: **standardization**, **splitting** (tokenization), and **indexing**.

**Standardization** normalizes the raw text. The simplest approach is lowercasing and removing punctuation. Historically, aggressive standardization (stemming, lemmatization) was common, but modern models benefit from lighter standardization -- tense and plurality carry useful information.

**Splitting** breaks text into units called **tokens**. There are three main approaches:

- **Word tokenization**: split on spaces and punctuation. Each word becomes a token. Simple and intuitive, but creates large vocabularies and cannot handle words not seen during training (out-of-vocabulary or OOV tokens become [UNK]).

- **Character tokenization**: each character is a token. Tiny vocabulary (~100), no OOV problem, but sequences become very long and individual characters carry little semantic meaning.

\`\`\`python
def split_words(text):
    return re.findall(r"[\\w]+|[.,!?;]", text)
# "The quick fox." -> ["The", "quick", "fox", "."]
\`\`\`

**Indexing** maps each token to a unique integer using a **vocabulary** -- a lookup table built from the training data. Unknown tokens map to a special [UNK] index.
`,
      reviewCardIds: ['rc-6.1-1', 'rc-6.1-2', 'rc-6.1-3'],
      illustrations: ['tokenization-pipeline'],
      codeExamples: [
        {
          title: 'Basic word and character tokenization in Python',
          language: 'python',
          code: `import re

text = "The quick brown fox jumps!"

# Word tokenization
word_tokens = re.findall(r"[\\w]+|[.,!?;]", text)
print(word_tokens)  # ['The', 'quick', 'brown', 'fox', 'jumps', '!']

# Character tokenization
char_tokens = list(text)
print(char_tokens)  # ['T', 'h', 'e', ' ', 'q', ...]`,
        },
        {
          title: 'Build a vocabulary and index tokens with Keras',
          language: 'python',
          code: `from keras import layers

text_vectorizer = layers.TextVectorization(
    max_tokens=10000,
    output_sequence_length=50
)
# Build vocabulary from training data
text_vectorizer.adapt(["The cat sat on the mat", "Dogs are great"])

# Convert text to integer indices
encoded = text_vectorizer(["The cat sat"])
print(encoded)  # e.g. [[2, 5, 8, 0, 0, ...]]`,
        },
      ],
    },
    {
      id: '6.1.2',
      title: 'Subword Tokenization: The Modern Standard',
      content: `
**Subword tokenization** (like BPE -- Byte Pair Encoding) is the modern standard used by virtually all large language models. It splits common words into single tokens while breaking rare words into known subword pieces.

The word "unhappiness" might be tokenized as ["un", "happi", "ness"]. Each subword is in the vocabulary. The model can partially understand novel words from their components -- "defenestration" becomes ["de", "fen", "est", "ration"], each carrying partial meaning.

Subword tokenization balances three competing goals:
1. **Reasonable vocabulary size** (~30,000-50,000 tokens) -- not millions of words, not just 100 characters
2. **Manageable sequence length** -- shorter than character-level, longer than word-level
3. **Robust handling of rare/new words** -- no OOV problem since any string can be decomposed into known subwords

BPE builds its vocabulary by starting with individual characters, then iteratively merging the most frequent pairs. "th" + "e" -> "the" becomes a single token because it occurs so frequently. After enough merges, you get a vocabulary that captures common words whole while splitting rare words.

In Keras, the \`TextVectorization\` layer handles tokenization and vocabulary building:

\`\`\`python
tokenizer = layers.TextVectorization(
    max_tokens=20000,
    output_sequence_length=200
)
tokenizer.adapt(training_texts)
\`\`\`
`,
      reviewCardIds: ['rc-6.1-4', 'rc-6.1-5'],
      illustrations: ['bpe-merging'],
      codeExamples: [
        {
          title: 'Subword tokenization with a HuggingFace BPE tokenizer',
          language: 'python',
          code: `from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("gpt2")

text = "unhappiness is defenestration"
tokens = tokenizer.tokenize(text)
print(tokens)  # ['un', 'happiness', ' is', ' def', 'en', 'est', 'ration']

ids = tokenizer.encode(text)
print(ids)  # [403, 71, 1108, 825, ...]`,
        },
        {
          title: 'See how BPE handles rare vs common words',
          language: 'python',
          code: `from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("gpt2")

# Common word -> single token
print(tokenizer.tokenize("the"))       # ['the']

# Rare word -> split into subwords
print(tokenizer.tokenize("antidisestablishmentarianism"))
# ['ant', 'id', 'ise', 'st', 'ablish', 'ment', 'arian', 'ism']`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Text preprocessing has three stages: standardization (normalize), splitting (tokenize), and indexing (map to integers).
- Word tokenization is simple but has OOV problems; character tokenization has no OOV but long sequences.
- Subword tokenization (BPE) is the modern standard: reasonable vocabulary, manageable sequences, handles rare words.
- BPE builds vocabulary by iteratively merging the most frequent character pairs.
- Keras TextVectorization handles tokenization and vocabulary building as a model layer.`,
};

export default lesson;
