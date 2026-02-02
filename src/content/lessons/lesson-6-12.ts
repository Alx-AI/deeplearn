/**
 * Lesson 6.12: Text-to-Image Models and Module 6 Recap
 *
 * Covers: Text conditioning, CLIP, latent diffusion, classifier-free guidance
 * Source sections: 17.3, Module 6 synthesis
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.12',
  title: 'Text-to-Image Models and Module 6 Recap',
  sections: [
    {
      id: '6.12.1',
      title: 'How Text Guides Image Generation',
      content: `
**Text-to-image models** condition the diffusion process on a text description. The text prompt "a horse riding a bike on the moon" is encoded into a vector by a text encoder (like CLIP), and this vector guides the U-Net's denoising at every step.

The text encoding is injected into the U-Net via **cross-attention**: at each denoising step, the model attends to the text embedding to ensure the generated image matches the description. This is the same cross-attention mechanism used in Transformer decoders for translation.

**Latent diffusion** (used by Stable Diffusion) performs the diffusion process in a compressed latent space rather than pixel space. A 512x512 image (786,432 values) is first encoded into a much smaller latent representation (e.g., 64x64x4 = 16,384 values). Diffusion happens in this small space, then a decoder maps the final latent back to full resolution. This makes generation roughly 50x cheaper computationally.

**Classifier-free guidance** amplifies the text prompt's influence during generation. The model runs twice -- once with the prompt and once without. The difference between the two outputs indicates the "direction" of the prompt, and this direction is amplified to make the generated image more faithful to the description.

Text-to-image models sometimes produce artifacts (extra fingers, incoherent objects) because they learn statistical pixel patterns, not physical understanding. The model does not "know" that hands have five fingers; it generates what statistically looks like a hand.
`,
      reviewCardIds: ['rc-6.12-1', 'rc-6.12-2', 'rc-6.12-3'],
      illustrations: ['text-to-image'],
      codeExamples: [
        {
          title: 'Generate an image with Stable Diffusion',
          language: 'python',
          code: `from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1",
    torch_dtype=torch.float16,
).to("cuda")

image = pipe(
    prompt="a horse riding a bike on the moon, digital art",
    num_inference_steps=50,       # More steps = higher quality
    guidance_scale=7.5,           # Classifier-free guidance strength
).images[0]
image.save("generated.png")`,
        },
        {
          title: 'Control generation with a negative prompt',
          language: 'python',
          code: `image = pipe(
    prompt="a serene mountain landscape, photorealistic",
    negative_prompt="blurry, cartoon, low quality",
    num_inference_steps=50,
    guidance_scale=7.5,
).images[0]`,
        },
      ],
    },
    {
      id: '6.12.2',
      title: 'Module 6 Recap: The NLP and Generation Landscape',
      content: `
Module 6 covered the full spectrum of text and generation:

**Text processing pipeline**: Raw text -> Tokenization (subword/BPE) -> Integer indices -> Embedding (dense vectors) -> Model processing -> Output

**Text understanding models**: Transformer encoders (BERT-style) pretrained with masked language modeling. Fine-tune for classification, extraction, similarity.

**Text generation models**: Transformer decoders (GPT-style) pretrained with causal language modeling. Scale to LLMs with instruction tuning, RLHF, and LoRA.

**LLM ecosystem**: RAG for grounding, multimodal models for images + text, chain-of-thought for reasoning. Understand limitations: hallucination, phrasing sensitivity, pattern matching not reasoning.

**Image generation pipeline**: VAEs (structured latent spaces, good for interpolation) -> Diffusion models (iterative denoising, highest quality) -> Text-to-image (text conditioning via CLIP + cross-attention + latent diffusion).

The common thread: all these systems are trained to predict patterns in data. Language models predict the next token. Diffusion models predict noise to remove. Text-to-image models combine both. The power comes from scale (massive data + massive models) and architecture (attention, residual connections, the concepts from Modules 4-5).
`,
      reviewCardIds: ['rc-6.12-4', 'rc-6.12-5'],
      codeExamples: [
        {
          title: 'Fine-tune Stable Diffusion with LoRA using diffusers',
          language: 'python',
          code: `# Fine-tuning uses the same LoRA concept from lesson 6.8
# but applied to the U-Net denoising model
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1",
)
pipe.unet.load_attn_procs("my-lora-weights/")  # Load LoRA adapter
image = pipe("a painting in my custom style").images[0]`,
        },
        {
          title: 'Encode text with CLIP (the text conditioning step)',
          language: 'python',
          code: `from transformers import CLIPTextModel, CLIPTokenizer

tokenizer = CLIPTokenizer.from_pretrained("openai/clip-vit-large-patch14")
text_encoder = CLIPTextModel.from_pretrained("openai/clip-vit-large-patch14")

prompt = "a sunset over the ocean"
tokens = tokenizer(prompt, return_tensors="pt", padding="max_length",
                   max_length=77, truncation=True)
text_embeddings = text_encoder(tokens.input_ids)[0]
print(text_embeddings.shape)  # torch.Size([1, 77, 768])`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Text-to-image models use a text encoder (CLIP) and cross-attention to guide diffusion with text prompts.
- Latent diffusion operates in compressed space for ~50x computational savings over pixel-space diffusion.
- Classifier-free guidance amplifies the text prompt's influence for more faithful image generation.
- Module 6 spans: tokenization -> embeddings -> Transformers -> LLMs -> RAG -> VAEs -> diffusion -> text-to-image.
- All these systems fundamentally predict patterns in data; power comes from scale and architecture.`,
};

export default lesson;
