/**
 * Lesson 4.6: Max Pooling and ConvNet Architecture
 *
 * Covers: Max pooling, padding, strides, standard ConvNet pattern
 * Source sections: 8.1.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.6',
  title: 'Max Pooling and ConvNet Architecture',
  sections: [
    {
      id: '4.6.1',
      title: 'Downsampling with Max Pooling',
      illustrations: ['max-pooling'],
      content: `
In the ConvNet from the previous lesson, you may have noticed MaxPooling2D layers halving the feature map dimensions at each step. **Max pooling** extracts windows from the input feature maps and outputs the maximum value in each window. Typically, a $2 \\times 2$ pool with stride 2 is used, which cuts each spatial dimension in half.

\`\`\`python
x = layers.Conv2D(64, 3, activation="relu")(inputs)   # 28x28 -> 26x26
x = layers.MaxPooling2D(pool_size=2)(x)                # 26x26 -> 13x13
x = layers.Conv2D(128, 3, activation="relu")(x)        # 13x13 -> 11x11
x = layers.MaxPooling2D(pool_size=2)(x)                # 11x11 -> 5x5
\`\`\`

Why is this downsampling necessary? Without it, each convolution layer only "sees" a small $3 \\times 3$ area of its input. After many layers without pooling, the network's receptive field barely grows, and it cannot detect large-scale structures. Pooling aggressively shrinks spatial dimensions so that deeper layers effectively see larger regions of the original image.

There is also a computational argument: without pooling, feature maps stay large, leading to enormous numbers of parameters in later layers and excessive memory usage.

As an alternative to a separate pooling layer, some architectures use **strided convolutions** (stride=2 in the Conv2D itself) to achieve downsampling while still applying learned filters. This is common in generative models and modern architectures.
`,
      reviewCardIds: ['rc-4.6-1', 'rc-4.6-2', 'rc-4.6-3'],
      codeExamples: [
        {
          title: 'MaxPooling2D reduces spatial dimensions by half',
          language: 'python',
          code: `import keras
from keras import layers

inputs = keras.Input(shape=(28, 28, 1))
x = layers.Conv2D(64, 3, activation="relu")(inputs)
print(x.shape)  # (None, 26, 26, 64)

x = layers.MaxPooling2D(pool_size=2)(x)
print(x.shape)  # (None, 13, 13, 64)`,
        },
        {
          title: 'Strided convolution as an alternative to pooling',
          language: 'python',
          code: `inputs = keras.Input(shape=(28, 28, 1))

# Instead of Conv2D + MaxPooling2D, use strides=2
x = layers.Conv2D(64, 3, strides=2, padding="same",
                  activation="relu")(inputs)
print(x.shape)  # (None, 14, 14, 64)
# Learns what to downsample, instead of just taking max`,
        },
      ],
    },
    {
      id: '4.6.2',
      title: 'The Standard ConvNet Pattern',
      illustrations: ['convnet-pyramid'],
      content: `
Most classification ConvNets follow a recognizable template: alternating convolution and pooling layers that progressively reduce spatial dimensions while increasing the number of filters, followed by a global pooling or flatten operation and one or more Dense layers for classification.

\`\`\`python
inputs = keras.Input(shape=(28, 28, 1))
x = layers.Conv2D(64, 3, activation="relu")(inputs)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(128, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(256, 3, activation="relu")(x)
x = layers.GlobalAveragePooling2D()(x)
outputs = layers.Dense(10, activation="softmax")(x)
model = keras.Model(inputs=inputs, outputs=outputs)
\`\`\`

Notice the **pyramid pattern**: filter counts increase (64, 128, 256) while spatial dimensions decrease. As the feature maps shrink, each position represents a larger region of the original image with richer semantic meaning. More filters are needed to capture the greater variety of high-level patterns.

**GlobalAveragePooling2D** at the end collapses each feature map into a single value by averaging all spatial positions. This converts a 3D tensor (e.g., $3 \\times 3 \\times 256$) into a 1D vector (256), which is then fed to the Dense classifier. Global average pooling is often preferred over Flatten because it acts as a mild regularizer and does not depend on the exact spatial dimensions.

This pattern -- Conv, Pool, repeat, GlobalPool, Dense -- is the foundation of image classification. Everything from early LeNet to modern EfficientNet follows variations of this template.
`,
      reviewCardIds: ['rc-4.6-4', 'rc-4.6-5'],
      codeExamples: [
        {
          title: 'Complete ConvNet for MNIST image classification',
          language: 'python',
          code: `import keras
from keras import layers
from keras.datasets import mnist

(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.reshape(-1, 28, 28, 1).astype("float32") / 255
x_test = x_test.reshape(-1, 28, 28, 1).astype("float32") / 255

inputs = keras.Input(shape=(28, 28, 1))
x = layers.Conv2D(32, 3, activation="relu")(inputs)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(64, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(128, 3, activation="relu")(x)
x = layers.GlobalAveragePooling2D()(x)
outputs = layers.Dense(10, activation="softmax")(x)
model = keras.Model(inputs, outputs)

model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
model.fit(x_train, y_train, epochs=5, validation_split=0.15)
model.evaluate(x_test, y_test)`,
        },
        {
          title: 'GlobalAveragePooling2D vs Flatten',
          language: 'python',
          code: `inputs = keras.Input(shape=(28, 28, 1))
x = layers.Conv2D(64, 3, activation="relu")(inputs)  # 26x26x64

# Flatten: 26 * 26 * 64 = 43,264 features -> large Dense layer
flat = layers.Flatten()(x)
print(flat.shape)  # (None, 43264)

# GlobalAveragePooling2D: 64 features -> compact, regularized
gap = layers.GlobalAveragePooling2D()(x)
print(gap.shape)  # (None, 64)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Max pooling downsamples feature maps by taking the maximum value in each spatial window (typically $2 \\times 2$ with stride 2).
- Downsampling increases the effective receptive field and reduces computational cost.
- The standard ConvNet follows a pyramid pattern: filter counts increase while spatial dimensions decrease.
- GlobalAveragePooling2D converts 3D feature maps to 1D vectors for the final Dense classifier.
- This Conv -> Pool -> Conv -> Pool -> GlobalPool -> Dense pattern is the foundation of image classification.`,
};

export default lesson;
