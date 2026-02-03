/**
 * Lesson 4.12: Putting It Together -- Building a Mini Xception Model
 *
 * Covers: Xception architecture, pyramid structure, ablation studies, Vision Transformers
 * Source sections: 9.5, 9.6
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.12',
  title: 'Putting It Together -- Building a Mini Xception Model',
  sections: [
    {
      id: '4.12.1',
      title: 'Assembling the Architecture',
      illustrations: ['residual-connection'],
      content: `
Now you have all the building blocks to construct a modern ConvNet. A mini-Xception model combines residual connections, batch normalization, and separable convolutions into repeated blocks:

\`\`\`python
inputs = keras.Input(shape=(180, 180, 3))
x = layers.Rescaling(1.0 / 255)(inputs)

def xception_block(x, filters, pooling=False):
    residual = x
    x = layers.SeparableConv2D(filters, 3, padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.SeparableConv2D(filters, 3, padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    if pooling:
        x = layers.MaxPooling2D(2, padding="same")(x)
        residual = layers.Conv2D(filters, 1, strides=2)(residual)
    elif filters != residual.shape[-1]:
        residual = layers.Conv2D(filters, 1)(residual)
    x = layers.add([x, residual])
    return x

x = xception_block(x, filters=128, pooling=True)
x = xception_block(x, filters=256, pooling=True)
x = xception_block(x, filters=512, pooling=True)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)
\`\`\`

The architecture follows the **modularity-hierarchy-reuse** (MHR) formula: identical blocks are repeated (reuse), organized into a pyramid of increasing filter counts (hierarchy), with each block being a self-contained module. This structure mirrors how effective complex systems are organized across many domains.
`,
      reviewCardIds: ['rc-4.12-1', 'rc-4.12-2'],
      codeExamples: [
        {
          title: 'Build a mini-Xception model from scratch',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

def xception_block(x, filters, pooling=False):
    residual = x
    x = layers.SeparableConv2D(filters, 3, padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.SeparableConv2D(filters, 3, padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    if pooling:
        x = layers.MaxPooling2D(2, padding="same")(x)
        residual = layers.Conv2D(filters, 1, strides=2)(residual)
    elif filters != residual.shape[-1]:
        residual = layers.Conv2D(filters, 1)(residual)
    x = layers.add([x, residual])
    return x`,
        },
        {
          title: 'Assemble the full mini-Xception architecture',
          language: 'python',
          code: `inputs = keras.Input(shape=(180, 180, 3))
x = layers.Rescaling(1.0 / 255)(inputs)
x = xception_block(x, filters=128, pooling=True)
x = xception_block(x, filters=256, pooling=True)
x = xception_block(x, filters=512, pooling=True)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)
model.summary()`,
        },
      ],
    },
    {
      id: '4.12.2',
      title: 'Ablation Studies and the Vision Transformer',
      illustrations: ['vision-transformer-patch'],
      content: `
Whenever you build a complex architecture, it is valuable to conduct **ablation studies**: systematically removing components to determine which ones actually contribute to performance. Remove the residual connections -- does accuracy drop? Replace separable convolutions with standard ones -- what changes? Remove batch normalization? This tells you what matters and what is unnecessary complexity.

Deep learning architectures are often more evolved than designed. Without ablation studies, you risk cargo-culting: including components because everyone does, without understanding whether they help for your specific problem.

Looking forward, **Vision Transformers (ViTs)** represent an emerging alternative to ConvNets for image tasks. Instead of convolutions, ViTs split an image into patches (e.g., $16 \\times 16$), treat each patch as a "token" (like a word in NLP), and process them with the Transformer's self-attention mechanism.

ViTs have no built-in spatial priors like translation invariance. This makes them more flexible but also more data-hungry -- they typically need much more training data than ConvNets to match performance. With enough data (millions of images), ViTs can outperform ConvNets, which is why they are increasingly popular in research.

For practical work today, the choice between ConvNets and ViTs depends on your situation. ConvNets remain excellent for smaller datasets and when efficiency matters. ViTs shine when data is abundant or when combined with large-scale pretraining. Both are valid tools, and understanding the ConvNet foundations covered in this module will serve you well regardless of which architecture you choose.
`,
      reviewCardIds: ['rc-4.12-3', 'rc-4.12-4', 'rc-4.12-5'],
      codeExamples: [
        {
          title: 'Simple ablation study: compare with and without residual connections',
          language: 'python',
          code: `# Train two models and compare validation accuracy:
# 1. Full model (with residual connections)
# 2. Same model but replace add([x, residual]) with just x
#
# Example results after 50 epochs:
# With residuals:    val_accuracy ~ 92%
# Without residuals: val_accuracy ~ 87%`,
        },
        {
          title: 'Extract 16x16 patches for a Vision Transformer',
          language: 'python',
          code: `import tensorflow as tf

patch_size = 16
image = tf.random.normal((1, 224, 224, 3))
patches = tf.image.extract_patches(
    images=image,
    sizes=[1, patch_size, patch_size, 1],
    strides=[1, patch_size, patch_size, 1],
    rates=[1, 1, 1, 1],
    padding="VALID",
)
# patches shape: (1, 14, 14, 768)  ->  196 patches of 768 dims
patches = tf.reshape(patches, (1, -1, patch_size * patch_size * 3))
print(patches.shape)  # (1, 196, 768)`,
        },
        {
          title: 'Load a pretrained ViT for image classification',
          language: 'python',
          code: `# Using huggingface transformers
from transformers import ViTForImageClassification, ViTImageProcessor

processor = ViTImageProcessor.from_pretrained(
    "google/vit-base-patch16-224"
)
model = ViTForImageClassification.from_pretrained(
    "google/vit-base-patch16-224"
)
inputs = processor(images=image_pil, return_tensors="pt")
outputs = model(**inputs)
predicted_class = outputs.logits.argmax(-1).item()`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- A mini-Xception model combines separable convolutions, batch normalization, and residual connections in repeated blocks.
- The architecture follows modularity-hierarchy-reuse: repeated blocks, pyramid filter structure, self-contained modules.
- Ablation studies systematically remove components to identify what actually contributes to performance.
- Vision Transformers (ViTs) process images as patch sequences with self-attention, offering flexibility but requiring more data.
- ConvNets remain practical for smaller datasets; ViTs excel with large-scale data and pretraining.`,
};

export default lesson;
