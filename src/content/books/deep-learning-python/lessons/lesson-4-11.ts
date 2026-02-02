/**
 * Lesson 4.11: Batch Normalization and Separable Convolutions
 *
 * Covers: BatchNorm, depthwise separable convolutions, SeparableConv2D
 * Source sections: 9.3, 9.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.11',
  title: 'Batch Normalization and Separable Convolutions',
  sections: [
    {
      id: '4.11.1',
      title: 'Stabilizing Training with Batch Normalization',
      illustrations: ['batch-norm'],
      content: `
**Batch normalization** (BatchNorm) normalizes each layer's activations to have mean=0 and standard deviation=1 across the current batch. This addresses a problem called "internal covariate shift" -- where the distribution of inputs to each layer keeps changing as the preceding layers update their weights.

\`\`\`python
x = layers.Conv2D(64, 3, padding="same")(x)
x = layers.BatchNormalization()(x)
x = layers.ReLU()(x)
\`\`\`

The typical placement is: Conv -> BatchNorm -> Activation. After normalizing, BatchNorm applies learned **scale** (gamma) and **shift** (beta) parameters. This lets the network recover any distribution it needs -- the normalization provides a stable starting point, and the learned parameters fine-tune from there.

BatchNorm provides several benefits:
- **Stabilizes training**: prevents activations from exploding or vanishing through layers
- **Allows higher learning rates**: the normalized landscape is smoother, so larger steps are safe
- **Acts as mild regularization**: the batch-level statistics introduce noise that helps generalization

One important detail: during inference, BatchNorm uses running averages (computed during training) instead of batch statistics. This is why the \`training=True/False\` flag matters when you write custom training loops.
`,
      reviewCardIds: ['rc-4.11-1', 'rc-4.11-2'],
      codeExamples: [
        {
          title: 'Conv -> BatchNorm -> ReLU pattern',
          language: 'python',
          code: `from tensorflow.keras import layers

x = layers.Conv2D(64, 3, padding="same")(x)
x = layers.BatchNormalization()(x)
x = layers.ReLU()(x)`,
        },
        {
          title: 'BatchNorm behavior in training vs inference',
          language: 'python',
          code: `# During model.fit(), BatchNorm uses batch statistics
# During model.predict() / model.evaluate(), it uses
# running averages computed during training.

# In a custom training loop, pass the flag explicitly:
logits = model(x_batch, training=True)   # training mode
logits = model(x_batch, training=False)  # inference mode`,
        },
      ],
    },
    {
      id: '4.11.2',
      title: 'Depthwise Separable Convolutions',
      illustrations: ['depthwise-separable-conv'],
      content: `
A standard convolution jointly learns spatial patterns AND channel mixing in a single operation. A **depthwise separable convolution** factorizes this into two separate steps, dramatically reducing parameters and computation.

**Step 1 -- Depthwise convolution**: applies one spatial filter per input channel independently. A 3x3 depthwise conv on 32 input channels uses 3x3x32 = 288 parameters.

**Step 2 -- Pointwise convolution**: a 1x1 convolution that mixes information across channels. Going from 32 to 64 output channels uses 1x1x32x64 = 2,048 parameters.

Compare this to a standard Conv2D(64, 3) on 32 input channels: 3x3x32x64 = 18,432 parameters. The separable version uses 2,336 parameters -- about 8x fewer.

\`\`\`python
# Standard convolution: 18,432 parameters
x = layers.Conv2D(64, 3, padding="same")(x)

# Separable convolution: ~2,336 parameters, same output shape
x = layers.SeparableConv2D(64, 3, padding="same")(x)
\`\`\`

This factorization works well because spatial patterns and cross-channel patterns are largely independent. You lose very little expressive power while gaining massive efficiency. The Xception architecture, built entirely from separable convolutions, achieves state-of-the-art accuracy while being more parameter-efficient than alternatives.

In modern practice, you will often see architectures combining all three innovations: **residual connections** for gradient flow, **batch normalization** for training stability, and **separable convolutions** for parameter efficiency.
`,
      reviewCardIds: ['rc-4.11-3', 'rc-4.11-4', 'rc-4.11-5'],
      codeExamples: [
        {
          title: 'SeparableConv2D as a drop-in replacement for Conv2D',
          language: 'python',
          code: `# Standard convolution: many parameters
x = layers.Conv2D(128, 3, padding="same", activation="relu")(x)

# Separable convolution: same output, far fewer parameters
x = layers.SeparableConv2D(128, 3, padding="same", activation="relu")(x)`,
        },
        {
          title: 'MobileNet-style inverted residual block',
          language: 'python',
          code: `def mobile_block(x, filters):
    residual = x
    x = layers.SeparableConv2D(filters, 3, padding="same")(x)
    x = layers.BatchNormalization()(x)
    x = layers.ReLU()(x)
    x = layers.SeparableConv2D(filters, 3, padding="same")(x)
    x = layers.BatchNormalization()(x)
    if filters != residual.shape[-1]:
        residual = layers.Conv2D(filters, 1)(residual)
    x = layers.add([x, residual])
    return layers.ReLU()(x)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Batch normalization normalizes layer activations to mean=0, std=1, then applies learned scale and shift parameters.
- BatchNorm stabilizes training, enables higher learning rates, and acts as mild regularization.
- Depthwise separable convolutions factorize spatial filtering and channel mixing into two steps, using ~8x fewer parameters.
- SeparableConv2D in Keras implements depthwise separable convolutions as a drop-in replacement for Conv2D.
- Modern architectures combine residual connections, batch normalization, and separable convolutions for maximum effectiveness.`,
};

export default lesson;
