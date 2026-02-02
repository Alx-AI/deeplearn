/**
 * Lesson 6.7: Training a Mini-GPT -- Text Generation
 *
 * Covers: GPT architecture, sampling strategies (greedy, temperature, top-k, top-p)
 * Source sections: 16.1, 16.2.1, 16.2.2, 16.2.3, 16.2.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.7',
  title: 'Training a Mini-GPT -- Text Generation',
  sections: [
    {
      id: '6.7.1',
      title: 'The GPT Architecture',
      content: `
A GPT model is a stack of Transformer **decoder blocks** with causal masking. There is no encoder -- the model simply processes a sequence of tokens and predicts the next one at each position.

Each block contains: causal self-attention, add & norm, feed-forward, add & norm. The model learns to predict p(next_token | all_previous_tokens) at every position simultaneously during training.

The power of GPT comes from scale: a 4-million-parameter character model produces recognizable but imperfect text. GPT-3 has 175 billion parameters. GPT-4 is likely much larger. The same architecture, vastly different capacity.

But even small models reveal the core mechanism. A mini-GPT trained on Shakespeare learns:
- Character co-occurrence patterns ("th" -> "e" or "a")
- Common words and line structures
- Basic verse and dialogue formatting
- Character names and speech patterns

All from the simple objective of predicting the next character. The model does not "understand" Shakespeare -- it has learned the statistical patterns of Shakespearean text well enough to generate plausible continuations.
`,
      reviewCardIds: ['rc-6.7-1', 'rc-6.7-2'],
      illustrations: ['gpt-architecture'],
      codeExamples: [
        {
          title: 'Load a pretrained GPT-2 model and generate text',
          language: 'python',
          code: `from transformers import GPT2LMHeadModel, GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

input_ids = tokenizer.encode("To be or not to be", return_tensors="pt")
output = model.generate(input_ids, max_new_tokens=50)
print(tokenizer.decode(output[0]))`,
        },
      ],
    },
    {
      id: '6.7.2',
      title: 'Sampling Strategies',
      content: `
Once trained, the model outputs a probability distribution over all possible next tokens. How you select from this distribution dramatically affects the generated text.

**Greedy decoding**: always pick the highest-probability token. Produces safe, repetitive text -- the model falls into loops ("the the the" or "I think I think").

**Temperature**: scales the logits before softmax. Low temperature (0.2) sharpens the distribution -- the model becomes very confident, producing predictable text. High temperature (2.0) flattens it -- the model treats many tokens as equally likely, producing diverse but potentially incoherent text.

\`\`\`python
logits = model(input_tokens)
logits = logits / temperature  # Scale before softmax
probs = softmax(logits)
next_token = random_sample(probs)
\`\`\`

**Top-k sampling**: sample only from the k most likely tokens. Top-k=40 means the 39,960 least likely tokens are excluded. This prevents absurd word choices while maintaining diversity among plausible options.

**Top-p (nucleus) sampling**: sample from the smallest set of tokens whose cumulative probability exceeds p. If top-p=0.9, keep adding tokens (most-probable first) until their probabilities sum to 0.9, then sample from that set. This adapts to context: when the model is confident, few tokens are kept; when uncertain, more options remain.

In practice, temperature around 0.7-1.0 combined with top-k=40 or top-p=0.9 produces natural-sounding text. The right settings depend on the application: creative writing benefits from higher temperature, while factual responses benefit from lower temperature.
`,
      reviewCardIds: ['rc-6.7-3', 'rc-6.7-4', 'rc-6.7-5'],
      illustrations: ['sampling-strategies'],
      codeExamples: [
        {
          title: 'Generate text with temperature control',
          language: 'python',
          code: `from transformers import GPT2LMHeadModel, GPT2Tokenizer

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
input_ids = tokenizer.encode("The meaning of life is", return_tensors="pt")

for temp in [0.3, 0.7, 1.5]:
    output = model.generate(
        input_ids, max_new_tokens=40,
        do_sample=True, temperature=temp,
    )
    print(f"temp={temp}: {tokenizer.decode(output[0])}")`,
        },
        {
          title: 'Top-k and top-p (nucleus) sampling',
          language: 'python',
          code: `output = model.generate(
    input_ids,
    max_new_tokens=40,
    do_sample=True,
    temperature=0.8,
    top_k=40,          # Only consider top-40 tokens
    top_p=0.9,         # Or smallest set summing to 90%
)
print(tokenizer.decode(output[0]))`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- GPT is a stack of Transformer decoder blocks with causal masking -- no encoder needed.
- Model quality scales with parameters: 4M parameters produce basic text; billions produce ChatGPT.
- Greedy decoding is deterministic but repetitive; sampling introduces necessary variety.
- Temperature controls randomness: low = predictable, high = diverse but potentially incoherent.
- Top-k and top-p sampling restrict choices to plausible tokens while maintaining diversity.`,
};

export default lesson;
