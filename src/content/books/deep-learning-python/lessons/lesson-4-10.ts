/**
 * Lesson 4.10: Residual Connections
 *
 * Covers: Vanishing gradients, skip connections, projection shortcuts, ResNet
 * Source sections: 9.1, 9.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.10',
  title: 'Residual Connections',
  sections: [
    {
      id: '4.10.1',
      title: 'The Vanishing Gradient Problem',
      illustrations: ['residual-connection'],
      content: `
Deep networks are powerful because more layers can learn more complex representations. But there is a limit: as you stack more layers, the gradient signal used for training degrades as it propagates backward through the chain. This is the **vanishing gradient problem**.

Think of the game of telephone: a message whispered through many people becomes garbled. Similarly, in a chain $y = f_4(f_3(f_2(f_1(x))))$, the gradient for updating $f_1$ must pass through $f_2$, $f_3$, and $f_4$. Each step introduces noise that can shrink the gradient toward zero. A 50-layer network without countermeasures may train poorly because the earliest layers receive almost no useful gradient signal.

The solution is elegantly simple: **residual connections** (also called skip connections). Instead of computing $\\text{output} = \\text{block}(x)$, you compute $\\text{output} = \\text{block}(x) + x$. You add the input directly to the output.

\`\`\`python
residual = x
x = layers.Conv2D(64, 3, activation="relu", padding="same")(x)
x = layers.Conv2D(64, 3, activation="relu", padding="same")(x)
x = layers.add([x, residual])   # Skip connection
\`\`\`

This creates an **information shortcut** around each block. Even if the block's computations are noisy or destructive, the original information is preserved in the shortcut. The gradient of $\\text{block}(x) + x$ with respect to $x$ includes a "$+1$" term that guarantees gradient flow regardless of what the block does.

This innovation, introduced by He et al. in 2015 with the **ResNet** family, made it possible to train networks with 50, 100, or even 1,000+ layers.
`,
      reviewCardIds: ['rc-4.10-1', 'rc-4.10-2', 'rc-4.10-3'],
      codeExamples: [
        {
          title: 'Basic residual connection (same shape)',
          language: 'python',
          code: `from tensorflow.keras import layers

x = layers.Input(shape=(32, 32, 64))
residual = x
out = layers.Conv2D(64, 3, activation="relu", padding="same")(x)
out = layers.Conv2D(64, 3, activation="relu", padding="same")(out)
out = layers.add([out, residual])  # Skip connection`,
        },
        {
          title: 'Residual block with BatchNormalization',
          language: 'python',
          code: `residual = x
x = layers.Conv2D(64, 3, padding="same")(x)
x = layers.BatchNormalization()(x)
x = layers.ReLU()(x)
x = layers.Conv2D(64, 3, padding="same")(x)
x = layers.BatchNormalization()(x)
x = layers.add([x, residual])
x = layers.ReLU()(x)`,
        },
      ],
    },
    {
      id: '4.10.2',
      title: 'Implementing Residual Blocks',
      content: `
There is one practical constraint: adding the input to the output requires both to have the same shape. When the number of filters changes or spatial dimensions are reduced by pooling, you need a **projection shortcut** -- a $1 \\times 1$ convolution that matches the residual to the new shape:

\`\`\`python
def residual_block(x, filters, pooling=False):
    residual = x
    x = layers.Conv2D(filters, 3, activation="relu", padding="same")(x)
    x = layers.Conv2D(filters, 3, activation="relu", padding="same")(x)
    if pooling:
        x = layers.MaxPooling2D(2, padding="same")(x)
        residual = layers.Conv2D(filters, 1, strides=2)(residual)
    elif filters != residual.shape[-1]:
        residual = layers.Conv2D(filters, 1)(residual)
    x = layers.add([x, residual])
    return x
\`\`\`

This utility function handles both cases: when pooling is used (match with strided $1 \\times 1$ conv) and when only the filter count changes (match with $1 \\times 1$ conv).

A crucial insight: if $\\text{block}(x)$ learns to output all zeros, then $\\text{output} = 0 + x = x$. The layer becomes an identity function. This means residual connections make it easy for layers that have nothing useful to add to simply pass data through unchanged. A deeper network can never be worse than a shallower one because unnecessary layers can learn to be identities.

Modern architectures universally use residual connections. Whether you are working with ConvNets, Transformers, or any deep model, skip connections are an essential architectural pattern you will encounter everywhere.
`,
      reviewCardIds: ['rc-4.10-4', 'rc-4.10-5'],
      codeExamples: [
        {
          title: 'Residual block with projection shortcut',
          language: 'python',
          code: `def residual_block(x, filters, pooling=False):
    residual = x
    x = layers.Conv2D(filters, 3, activation="relu", padding="same")(x)
    x = layers.Conv2D(filters, 3, activation="relu", padding="same")(x)
    if pooling:
        x = layers.MaxPooling2D(2, padding="same")(x)
        residual = layers.Conv2D(filters, 1, strides=2)(residual)
    elif filters != residual.shape[-1]:
        residual = layers.Conv2D(filters, 1)(residual)
    x = layers.add([x, residual])
    return x`,
        },
        {
          title: 'Stack residual blocks into a small ResNet',
          language: 'python',
          code: `inputs = keras.Input(shape=(32, 32, 3))
x = layers.Rescaling(1.0 / 255)(inputs)
x = layers.Conv2D(32, 3, activation="relu", padding="same")(x)
x = residual_block(x, 64, pooling=True)
x = residual_block(x, 128, pooling=True)
x = residual_block(x, 256, pooling=True)
x = layers.GlobalAveragePooling2D()(x)
outputs = layers.Dense(10, activation="softmax")(x)
model = keras.Model(inputs, outputs)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Vanishing gradients prevent very deep networks from training: gradient signals degrade through many layers.
- Residual connections add the input directly to the output: $\\text{output} = \\text{block}(x) + x$, creating a gradient highway.
- When shapes differ, a $1 \\times 1$ projection convolution matches the residual to the block's output dimensions.
- Layers with residual connections can learn the identity function (pass data through unchanged), ensuring depth never hurts.
- Introduced by ResNet in 2015, residual connections are now universal in deep architectures.`,
};

export default lesson;
