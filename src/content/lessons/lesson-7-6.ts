/**
 * Lesson 7.6: Key Concepts in Review and Staying Current
 *
 * Covers: Architecture guide, universal workflow, staying current, final synthesis
 * Source sections: 20.1, 20.2, 20.3, 20.4, 20.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '7.6',
  title: 'Key Concepts in Review and Staying Current',
  sections: [
    {
      id: '7.6.1',
      title: 'The Architecture Decision Guide',
      content: `
After 72 lessons, you have a comprehensive toolkit. Here is the consolidated architecture guide:

**Data type -> Architecture**:
- **Tabular/structured data**: Dense layers (start here for any problem)
- **Images**: ConvNets (Conv2D + pooling) or Vision Transformers. Use pretrained models + fine-tuning.
- **Short sequences**: Conv1D for local patterns; LSTM/GRU for sequential dependencies
- **Long sequences / NLP**: Transformer (self-attention). Pretrained models (BERT for understanding, GPT for generation).
- **Image generation**: Diffusion models (highest quality) or VAEs (structured latent space)
- **Text generation**: Transformer decoder with autoregressive sampling

**The universal workflow** remains your guide for every project:
1. **Define the task**: frame the problem, understand data, choose success metric
2. **Develop a model**: prepare data, beat a baseline, scale up to overfit, regularize and tune
3. **Evaluate honestly**: held-out test set, compare to baselines, visualize model behavior
4. **Deploy and monitor**: export for inference, track performance, retrain when needed

The most important principle: the tension between fitting training data and generalizing to new data is the central challenge. Everything else -- regularization, architecture choice, evaluation protocol -- is in service of achieving good generalization.
`,
      reviewCardIds: ['rc-7.6-1', 'rc-7.6-2', 'rc-7.6-3'],
      illustrations: ['ml-workflow'],
      codeExamples: [
        {
          title: 'Quick-reference: choosing an architecture by data type',
          language: 'python',
          code: `from tensorflow import keras

# Tabular data -> Dense layers
tabular_model = keras.Sequential([
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dense(1)])

# Images -> ConvNet or pretrained model
image_model = keras.applications.EfficientNetV2B0(
    weights="imagenet", include_top=False)

# Text -> Pretrained Transformer
# from transformers import TFAutoModel
# text_model = TFAutoModel.from_pretrained("bert-base-uncased")`,
        },
      ],
    },
    {
      id: '7.6.2',
      title: 'Staying Current and Moving Forward',
      content: `
Deep learning evolves rapidly. The techniques in this curriculum are foundational and will remain relevant, but new architectures, methods, and tools emerge constantly. Here is how to stay current:

**Practice on real problems**: Kaggle competitions provide datasets, baselines, leaderboards, and community discussion. The gap between understanding concepts and building working systems is only closed by hands-on practice.

**Follow the research**: arXiv papers (cs.LG for machine learning, cs.CV for computer vision, cs.CL for NLP) publish the latest advances. Key conferences: NeurIPS, ICML, ICLR, CVPR. You do not need to read every paper -- follow curated summaries and key researchers.

**Build projects**: apply what you have learned to problems you care about. Personal projects develop intuition faster than any course. Start small, iterate, and gradually tackle more complex challenges.

**Key takeaways from the entire curriculum:**

Current AI is powerful **cognitive automation** -- it encodes and operationalizes knowledge learned from data. It excels at interpolation within training distributions. But it is not general intelligence: it cannot adapt to fundamentally novel situations or reason from first principles.

Deep learning is a tool. A remarkably powerful tool that has transformed every industry it has touched. Understanding both its capabilities and limitations makes you a more effective practitioner. You now have the knowledge to build, train, evaluate, debug, deploy, and critically assess deep learning systems. The rest comes from practice.
`,
      reviewCardIds: ['rc-7.6-4', 'rc-7.6-5'],
      illustrations: ['ml-lifecycle'],
    },
  ],
  summary: `**Key takeaways:**
- Match architectures to data types: Dense for tabular, ConvNets for images, Transformers for NLP, diffusion for generation.
- The universal workflow: define task -> develop model -> evaluate -> deploy -> monitor.
- The central challenge of ML is always generalization: fitting training data while performing well on unseen data.
- Stay current through Kaggle, arXiv, conferences, and personal projects.
- Deep learning is powerful cognitive automation with clear limitations -- understanding both makes you an effective practitioner.`,
};

export default lesson;
