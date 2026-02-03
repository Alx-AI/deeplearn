/**
 * Lesson 6.8: Large Language Models (LLMs) and Fine-Tuning
 *
 * Covers: Instruction tuning, LoRA, RLHF
 * Source sections: 16.3, 16.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.8',
  title: 'Large Language Models and Fine-Tuning',
  sections: [
    {
      id: '6.8.1',
      title: 'From Base Models to Instruction-Following Assistants',
      content: `
A **base LLM** is a raw language model trained on massive text for next-token prediction. It has absorbed vast knowledge but does not know how to be helpful. Ask it "What is the capital of France?" and it might continue with another question or random text -- it is completing text, not answering questions.

**Instruction fine-tuning** trains the model on examples of instruction-following behavior: (prompt, desired_response) pairs. "What is the capital of France?" -> "The capital of France is Paris." After this training, the model learns to interpret inputs as instructions and respond helpfully.

**RLHF** (Reinforcement Learning from Human Feedback) further refines behavior. Human raters rank multiple model outputs for the same prompt, training a reward model that captures human preferences. The LLM is then optimized against this reward model to produce outputs humans prefer -- more helpful, more accurate, less harmful.

The pipeline: Pretraining (massive text, next-token prediction) -> Instruction fine-tuning (prompt-response pairs) -> RLHF (human preference alignment). Each stage builds on the previous one, transforming a raw text predictor into a useful assistant.
`,
      reviewCardIds: ['rc-6.8-1', 'rc-6.8-2', 'rc-6.8-3'],
      illustrations: ['llm-training-pipeline'],
      codeExamples: [
        {
          title: 'Load a pretrained LLM with HuggingFace',
          language: 'python',
          code: `from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "meta-llama/Llama-2-7b-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",      # Automatically use available GPUs
    torch_dtype="auto",     # Use model's native precision
)`,
        },
        {
          title: 'Instruction-tuned model with a chat template',
          language: 'python',
          code: `from transformers import pipeline

chat = pipeline("text-generation", model="meta-llama/Llama-2-7b-chat-hf")
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
]
response = chat(messages, max_new_tokens=64)
print(response[0]["generated_text"][-1]["content"])`,
        },
      ],
    },
    {
      id: '6.8.2',
      title: 'LoRA: Parameter-Efficient Fine-Tuning',
      content: `
Fine-tuning all parameters of a 7-billion-parameter model requires enormous GPU memory (storing gradients for every weight). **LoRA** (Low-Rank Adaptation) offers an elegant alternative: instead of modifying the original weights, add small low-rank matrices alongside them.

For a weight matrix $W$ of shape $4096 \\times 4096$ (16 million parameters), LoRA adds two small matrices: $A$ ($4096 \\times 8$) and $B$ ($8 \\times 4096$). The effective weight becomes $W + AB$. Only $A$ and $B$ are trained -- just 65,536 new parameters instead of modifying 16 million.

\`\`\`python
# Conceptual: LoRA modifies the effective weight
effective_weight = original_weight + lora_A @ lora_B
# Only lora_A and lora_B have gradients
\`\`\`

Benefits of LoRA:
- **Memory efficient**: gradients only for ~0.1-1% of parameters
- **Storage efficient**: each LoRA adapter is tiny (megabytes, not gigabytes)
- **Composable**: the base model stays frozen; swap different LoRA adapters for different tasks
- **Fast**: fewer parameters to update means faster training

LoRA has become the standard approach for customizing LLMs. You can fine-tune a model for your specific domain (medical, legal, coding) by training a small LoRA adapter on domain-specific data, while keeping the massive base model unchanged and shared across use cases.
`,
      reviewCardIds: ['rc-6.8-4', 'rc-6.8-5'],
      illustrations: ['lora'],
      codeExamples: [
        {
          title: 'Configure a LoRA adapter with PEFT',
          language: 'python',
          code: `from peft import LoraConfig, get_peft_model

lora_config = LoraConfig(
    r=8,                       # Low-rank dimension
    lora_alpha=16,             # Scaling factor
    target_modules=["q_proj", "v_proj"],  # Apply to attention
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()
# "trainable params: 4,194,304 || all params: 6,742,609,920 || 0.06%"`,
        },
        {
          title: 'Save and reload a LoRA adapter',
          language: 'python',
          code: `# Save only the tiny adapter weights
peft_model.save_pretrained("my-lora-adapter")

# Later: reload the base model + adapter
from peft import PeftModel
base = AutoModelForCausalLM.from_pretrained(model_name)
model_with_lora = PeftModel.from_pretrained(base, "my-lora-adapter")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Base LLMs predict text; instruction fine-tuning teaches them to follow instructions; RLHF aligns them with human preferences.
- The training pipeline: pretraining -> instruction tuning -> RLHF.
- LoRA adds small low-rank matrices alongside frozen weights, training ~0.1-1% of parameters.
- LoRA is memory-efficient, storage-efficient, and composable -- different adapters share the same base model.
- LoRA is the standard approach for customizing LLMs to specific domains or tasks.`,
};

export default lesson;
