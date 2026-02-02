/**
 * Lesson 6.9: The Frontier of LLMs -- RAG, Reasoning, Multimodal
 *
 * Covers: RAG, hallucination, multimodal models, current limitations
 * Source sections: 16.4.1, 16.4.2, 16.4.3, 16.4.4, 16.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.9',
  title: 'The Frontier of LLMs',
  sections: [
    {
      id: '6.9.1',
      title: 'Hallucination and RAG',
      content: `
LLMs have a fundamental problem: **hallucination**. They generate plausible-sounding but false information because they produce text that matches statistical patterns, not verified facts. The model has no internal model of truth -- it outputs what "sounds right" based on training data.

**RAG** (Retrieval-Augmented Generation) addresses this by grounding the model's output in retrieved documents:

1. The user's query is used to search an external knowledge base (using semantic similarity)
2. The most relevant documents are retrieved
3. These documents are inserted into the LLM's context alongside the query
4. The LLM generates a response grounded in the retrieved information

\`\`\`python
# RAG pseudocode
relevant_docs = search_knowledge_base(user_query)
context = format_docs(relevant_docs)
prompt = f"Based on: {context}\\n\\nQuestion: {user_query}"
response = llm.generate(prompt)
\`\`\`

RAG also solves the **knowledge cutoff** problem: LLMs do not know about events after their training data was collected. A RAG system can retrieve up-to-date information from a continuously updated knowledge base, enabling accurate responses about current events.
`,
      reviewCardIds: ['rc-6.9-1', 'rc-6.9-2', 'rc-6.9-3'],
      illustrations: ['rag'],
      codeExamples: [
        {
          title: 'Build a simple RAG pipeline with sentence-transformers and FAISS',
          language: 'python',
          code: `from sentence_transformers import SentenceTransformer
import faiss, numpy as np

# 1. Embed your knowledge base
embedder = SentenceTransformer("all-MiniLM-L6-v2")
docs = ["Paris is the capital of France.",
        "Berlin is the capital of Germany.",
        "Tokyo is the capital of Japan."]
doc_embeddings = embedder.encode(docs)

# 2. Build a FAISS index for fast similarity search
index = faiss.IndexFlatIP(doc_embeddings.shape[1])
faiss.normalize_L2(doc_embeddings)
index.add(doc_embeddings)

# 3. Retrieve the most relevant document for a query
query_vec = embedder.encode(["What is France's capital?"])
faiss.normalize_L2(query_vec)
scores, ids = index.search(query_vec, k=1)
print(docs[ids[0][0]])  # "Paris is the capital of France."`,
        },
      ],
    },
    {
      id: '6.9.2',
      title: 'Multimodal Models and Current Frontiers',
      content: `
**Multimodal LLMs** process multiple types of input -- text and images, text and audio, or even text, images, and video together. A multimodal model can answer "What's in this photo?" by processing both the image and the text question.

Applications include visual question answering, medical image analysis ("describe the abnormalities in this X-ray"), document understanding (extracting information from forms with both text and visual layout), and accessibility (describing images for visually impaired users).

**"Reasoning" models** attempt to show intermediate thinking steps, often using chain-of-thought prompting. Adding "Think step by step" to a prompt can significantly improve performance on logic problems because it forces the model to generate intermediate tokens that serve as working memory.

However, it is important to understand current limitations:
- LLMs do not truly reason -- they apply memorized patterns. Novel problems that differ from training data cause failures.
- Hallucination remains unsolved; RAG reduces but does not eliminate it.
- Sensitivity to phrasing means the same question worded differently can produce different answers.
- The "intelligence" in these models is better described as **sophisticated pattern matching** -- incredibly useful, but fundamentally different from human understanding.

These tools are powerful and practical. Understanding both their capabilities and limitations lets you use them effectively while avoiding over-reliance on outputs that may be confidently wrong.
`,
      reviewCardIds: ['rc-6.9-4', 'rc-6.9-5'],
      illustrations: ['multimodal-llm'],
      codeExamples: [
        {
          title: 'Compute image-text similarity with CLIP',
          language: 'python',
          code: `from transformers import CLIPProcessor, CLIPModel
from PIL import Image

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

image = Image.open("photo.jpg")
inputs = processor(
    text=["a dog", "a cat", "a car"],
    images=image,
    return_tensors="pt",
    padding=True,
)
outputs = model(**inputs)
probs = outputs.logits_per_image.softmax(dim=-1)
print(probs)  # e.g. tensor([[0.92, 0.05, 0.03]])`,
        },
        {
          title: 'Zero-shot image classification with CLIP',
          language: 'python',
          code: `from transformers import pipeline

classifier = pipeline(
    "zero-shot-image-classification",
    model="openai/clip-vit-base-patch32",
)
result = classifier(
    "photo.jpg",
    candidate_labels=["landscape", "portrait", "animal"],
)
for r in result:
    print(f"{r['label']}: {r['score']:.2%}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- LLMs hallucinate because they generate statistically plausible text without a model of truth.
- RAG grounds LLM responses in retrieved documents, reducing hallucination and addressing knowledge cutoff.
- Multimodal LLMs process text alongside images, audio, or video for richer understanding.
- Chain-of-thought prompting can improve performance on reasoning tasks by generating intermediate steps.
- LLMs are sophisticated pattern matchers, not genuine reasoners -- understand both their power and limitations.`,
};

export default lesson;
