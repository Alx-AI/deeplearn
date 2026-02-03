/**
 * Lesson 6.6: Pretrained Transformers and Fine-Tuning for NLP
 *
 * Covers: BERT vs GPT pretraining, fine-tuning pretrained Transformers
 * Source sections: 15.4, 15.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.6',
  title: 'Pretrained Transformers and Fine-Tuning for NLP',
  sections: [
    {
      id: '6.6.1',
      title: 'Two Pretraining Paradigms: BERT and GPT',
      content: `
Just as ImageNet pretraining revolutionized computer vision, **pretraining on massive text** has transformed NLP. Two paradigms dominate:

**BERT-style (masked language modeling)**: randomly mask some tokens in the input and train the model to predict them using bidirectional context (both left and right). "The [MASK] sat on the mat" -- the model must predict "cat" using surrounding words. Because it sees both directions, BERT excels at understanding tasks (classification, question answering, named entity recognition).

**GPT-style (causal language modeling)**: predict the next token using only left context (previous tokens). This is the standard language modeling objective from the previous lesson. Because it only sees leftward, GPT excels at generation tasks (text completion, dialogue, creative writing).

Both approaches pretrain on enormous text corpora (Wikipedia, books, web text). The resulting models encode rich language knowledge: grammar, facts, reasoning patterns, and style. This knowledge transfers to downstream tasks via fine-tuning.

The choice between BERT and GPT depends on your task:
- **Understanding** (classification, extraction, similarity): BERT-style bidirectional models
- **Generation** (text completion, chatbots, summarization): GPT-style autoregressive models
`,
      reviewCardIds: ['rc-6.6-1', 'rc-6.6-2'],
      illustrations: ['bert-vs-gpt'],
      codeExamples: [
        {
          title: 'Masked language modeling with HuggingFace (BERT-style)',
          language: 'python',
          code: `from transformers import pipeline

mlm = pipeline("fill-mask", model="bert-base-uncased")

results = mlm("The cat [MASK] on the mat.")
for r in results[:3]:
    print(f"{r['token_str']:>10} (score: {r['score']:.3f})")
# e.g.  sat (score: 0.432)
#        lay (score: 0.182)
#        was (score: 0.091)`,
        },
        {
          title: 'Causal text generation with HuggingFace (GPT-style)',
          language: 'python',
          code: `from transformers import pipeline

generator = pipeline("text-generation", model="gpt2")

output = generator(
    "The meaning of life is",
    max_new_tokens=30,
    temperature=0.7,
    do_sample=True,
)
print(output[0]["generated_text"])`,
        },
      ],
    },
    {
      id: '6.6.2',
      title: 'Fine-Tuning for Specific Tasks',
      content: `
**Fine-tuning** a pretrained Transformer follows the same principle as fine-tuning a pretrained ConvNet:

1. Load the pretrained model
2. Add a task-specific output head (e.g., Dense layer for classification)
3. Optionally freeze some pretrained layers
4. Train on your task-specific data with a low learning rate

\`\`\`python
# Pseudocode for fine-tuning
pretrained = load_pretrained_bert()
x = pretrained(inputs)            # Extract representations
x = layers.Dense(1, activation="sigmoid")(x[:, 0, :])  # Classify using [CLS] token
model = keras.Model(inputs, x)
model.compile(optimizer=keras.optimizers.Adam(1e-5), loss="binary_crossentropy")
\`\`\`

The low learning rate is critical -- pretrained weights already encode valuable language knowledge. Large updates would destroy this knowledge. Typically $1 \\times 10^{-5}$ to $3 \\times 10^{-5}$ works well.

Why are Transformers more effective than RNNs for most NLP tasks?
1. **Self-attention captures any-distance dependencies** in one step (no vanishing gradients)
2. **Parallel processing** of all tokens makes training much faster
3. **Multi-head attention** captures diverse relationship types simultaneously
4. **The architecture scales well** to very large models and datasets

Domain mismatch can be an issue: a Transformer pretrained on general English may struggle with medical or legal text. Solutions include domain-specific pretrained models (BioBERT, LegalBERT) or further pretraining on domain text before fine-tuning.
`,
      reviewCardIds: ['rc-6.6-3', 'rc-6.6-4', 'rc-6.6-5'],
      illustrations: ['nlp-fine-tuning'],
      codeExamples: [
        {
          title: 'Fine-tune BERT for binary text classification',
          language: 'python',
          code: `from transformers import AutoTokenizer, TFAutoModelForSequenceClassification
import tensorflow as tf

model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = TFAutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=2
)

# Tokenize input texts
inputs = tokenizer(["I love this!", "Terrible movie."],
                   padding=True, truncation=True, return_tensors="tf")
labels = tf.constant([1, 0])

model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
              loss=model.compute_loss, metrics=["accuracy"])
model.fit(dict(inputs), labels, epochs=3)`,
        },
        {
          title: 'Use a fine-tuned model for sentiment prediction',
          language: 'python',
          code: `from transformers import pipeline

classifier = pipeline("sentiment-analysis",
                      model="distilbert-base-uncased-finetuned-sst-2-english")

results = classifier([
    "This is the best course I have ever taken!",
    "The food was bland and overpriced.",
])
for r in results:
    print(f"{r['label']}: {r['score']:.3f}")
# POSITIVE: 0.999
# NEGATIVE: 0.998`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- BERT uses masked language modeling (bidirectional, good for understanding); GPT uses causal language modeling (left-to-right, good for generation).
- Both pretrain on massive text, encoding grammar, facts, and reasoning patterns.
- Fine-tuning adds a task-specific head and trains with a low learning rate to preserve pretrained knowledge.
- Transformers outperform RNNs through parallel processing, long-range attention, and better scalability.
- Domain-specific pretrained models address the domain mismatch problem.`,
};

export default lesson;
