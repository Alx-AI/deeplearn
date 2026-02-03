/**
 * Lesson 4.5: Introduction to ConvNets
 *
 * Covers: Why ConvNets work, translation invariance, spatial hierarchies, convolution operation
 * Source sections: 8.1, 8.1.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.5',
  title: 'Introduction to ConvNets',
  sections: [
    {
      id: '4.5.1',
      title: 'Why ConvNets Beat Dense Networks for Images',
      illustrations: ['spatial-hierarchy'],
      content: `
Computer vision was deep learning's first breakthrough. At the heart of this success are **convolutional neural networks** (ConvNets or CNNs) -- a model architecture specifically designed to exploit the spatial structure of images.

The key difference between a Dense layer and a convolution layer is this: Dense layers learn **global** patterns across the entire input, while convolution layers learn **local** patterns in small spatial windows. A Conv2D layer with a $3 \\times 3$ kernel learns patterns found in $3 \\times 3$ pixel patches, not patterns spanning the whole image.

This gives ConvNets two powerful properties:

1. **Translation invariance**: a pattern learned in one part of the image is recognized everywhere. A Dense network would have to relearn the same edge or texture at every position. ConvNets share the same kernel weights across all spatial locations, making them far more data-efficient.

2. **Spatial hierarchies**: layer 1 learns small patterns (edges), layer 2 combines those into medium patterns (textures, corners), layer 3 combines those into larger patterns (object parts). This mirrors the hierarchical structure of the visual world itself -- lines compose into shapes, shapes compose into objects.

A basic ConvNet classifying MNIST digits reaches $99.1\\%$ accuracy, compared to $97.8\\%$ from a Dense network. That $60\\%$ reduction in error rate comes entirely from the architectural prior knowledge that ConvNets encode about how images work.
`,
      reviewCardIds: ['rc-4.5-1', 'rc-4.5-2', 'rc-4.5-3'],
      codeExamples: [
        {
          title: 'Simple ConvNet for MNIST vs Dense baseline',
          language: 'python',
          code: `import keras
from keras import layers

# ConvNet: exploits spatial structure
conv_model = keras.Sequential([
    keras.Input(shape=(28, 28, 1)),
    layers.Conv2D(32, kernel_size=3, activation="relu"),
    layers.MaxPooling2D(pool_size=2),
    layers.Conv2D(64, kernel_size=3, activation="relu"),
    layers.MaxPooling2D(pool_size=2),
    layers.Flatten(),
    layers.Dense(10, activation="softmax"),
])

# Dense baseline: no spatial awareness
dense_model = keras.Sequential([
    keras.Input(shape=(28, 28, 1)),
    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])`,
        },
      ],
    },
    {
      id: '4.5.2',
      title: 'How the Convolution Operation Works',
      illustrations: ['convolution'],
      content: `
A convolution operates on rank-3 tensors called **feature maps** with shape \`(height, width, channels)\`. For an RGB image, the input has 3 channels. The convolution slides a small window (the **kernel**) over every spatial position, extracting a patch and transforming it via a learned weight matrix.

\`\`\`python
inputs = keras.Input(shape=(28, 28, 1))
x = layers.Conv2D(filters=64, kernel_size=3, activation="relu")(inputs)
\`\`\`

This layer has three key parameters:
- **filters=64**: the number of output channels. Each filter is a different pattern detector -- one might detect horizontal edges, another diagonal lines.
- **kernel_size=3**: the spatial size of each window ($3 \\times 3$ pixels).
- **activation="relu"**: applied to each output element.

The output is another feature map. A $28 \\times 28 \\times 1$ input processed by Conv2D(64, 3) produces a $26 \\times 26 \\times 64$ output. The spatial dimensions shrink by 2 (one pixel lost on each side of each axis, because a $3 \\times 3$ kernel cannot be centered on border pixels). The depth grows to 64 because the layer computes 64 different filters.

Two important configuration options affect the output size. **Padding="same"** adds zeros around the input so the output keeps the same spatial dimensions. **Strides** control how far the kernel moves between positions -- stride 2 halves the spatial dimensions.

The convolution kernel is reused at every spatial position. This weight sharing is what gives ConvNets their translation invariance and parameter efficiency. A $3 \\times 3$ kernel with 64 input channels and 128 output filters has only $3 \\times 3 \\times 64 \\times 128 + 128 = 73{,}856$ parameters, regardless of the image size.
`,
      reviewCardIds: ['rc-4.5-4', 'rc-4.5-5'],
      codeExamples: [
        {
          title: 'Conv2D with "same" padding to preserve spatial dimensions',
          language: 'python',
          code: `import keras
from keras import layers

inputs = keras.Input(shape=(28, 28, 1))
# "valid" padding (default): 28x28 -> 26x26
x_valid = layers.Conv2D(32, 3, padding="valid", activation="relu")(inputs)

# "same" padding: 28x28 -> 28x28
x_same = layers.Conv2D(32, 3, padding="same", activation="relu")(inputs)

print(x_valid.shape)  # (None, 26, 26, 32)
print(x_same.shape)   # (None, 28, 28, 32)`,
        },
        {
          title: 'Using strides to downsample within a convolution',
          language: 'python',
          code: `inputs = keras.Input(shape=(28, 28, 1))

# Stride 2 halves spatial dimensions
x = layers.Conv2D(64, 3, strides=2, padding="same",
                  activation="relu")(inputs)
print(x.shape)  # (None, 14, 14, 64)`,
        },
        {
          title: 'Counting parameters in a Conv2D layer',
          language: 'python',
          code: `# Conv2D(filters=128, kernel_size=3) with 64 input channels:
# Parameters = kernel_h * kernel_w * in_channels * filters + bias
# = 3 * 3 * 64 * 128 + 128 = 73,856
layer = layers.Conv2D(128, 3)
layer.build(input_shape=(None, 16, 16, 64))
print(layer.count_params())  # 73856`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- ConvNets learn local spatial patterns that are translation-invariant, unlike Dense layers which learn global patterns.
- ConvNets naturally learn spatial hierarchies: edges -> textures -> object parts -> objects.
- A convolution slides a small kernel (e.g., $3 \\times 3$) over the input feature map, producing an output feature map with learned filters.
- Key parameters: filters (number of output channels), kernel_size (spatial window), padding, and strides.
- Weight sharing across spatial positions makes ConvNets parameter-efficient and data-efficient for image tasks.`,
};

export default lesson;
