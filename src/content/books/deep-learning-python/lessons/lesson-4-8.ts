/**
 * Lesson 4.8: Transfer Learning -- Feature Extraction
 *
 * Covers: Pretrained models, convolutional base, feature extraction, freezing layers
 * Source sections: 8.3.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.8',
  title: 'Transfer Learning -- Feature Extraction',
  sections: [
    {
      id: '4.8.1',
      title: 'Why Pretrained Models Are Valuable',
      illustrations: ['transfer-learning'],
      content: `
**Transfer learning** is the practice of reusing learned representations from one task on a different but related task. It is one of the most impactful techniques in modern deep learning because it lets you leverage massive datasets and compute that you could never afford on your own.

Models like VGG16, ResNet, Xception, and EfficientNet have been trained on ImageNet -- a dataset of 1.4 million images spanning 1,000 categories. During this training, their convolutional layers learned a rich library of visual features: edges, textures, colors, shapes, and object parts. These features are not specific to the 1,000 ImageNet categories; they are **general visual features** useful for virtually any image task.

The idea is simple: take a pretrained model, remove its classifier head (the Dense layers designed for 1,000 classes), and attach your own classifier designed for your specific task. The convolutional layers -- called the **convolutional base** -- serve as a feature extractor that converts raw images into informative representations. You only train the new classifier head.

\`\`\`python
conv_base = keras.applications.Xception(
    weights="imagenet",
    include_top=False,       # Remove the original classifier
    input_shape=(180, 180, 3)
)
conv_base.trainable = False  # Freeze the convolutional base
\`\`\`

Setting \`trainable = False\` **freezes** the convolutional base. Its weights will not be updated during training -- they stay at their pretrained values. Only the new classifier layers you add on top will be trained.
`,
      reviewCardIds: ['rc-4.8-1', 'rc-4.8-2', 'rc-4.8-3'],
      codeExamples: [
        {
          title: 'Load VGG16 as a frozen feature extractor',
          language: 'python',
          code: `from tensorflow import keras

conv_base = keras.applications.VGG16(
    weights="imagenet",
    include_top=False,
    input_shape=(180, 180, 3),
)
conv_base.trainable = False
conv_base.summary()  # All layers show "Non-trainable"`,
        },
        {
          title: 'Load ResNet50 as a frozen feature extractor',
          language: 'python',
          code: `conv_base = keras.applications.ResNet50(
    weights="imagenet",
    include_top=False,
    input_shape=(180, 180, 3),
)
conv_base.trainable = False
print(f"Frozen parameters: {conv_base.count_params():,}")`,
        },
      ],
    },
    {
      id: '4.8.2',
      title: 'Building a Feature Extraction Pipeline',
      content: `
With the frozen convolutional base in hand, you attach a new classifier:

\`\`\`python
inputs = keras.Input(shape=(180, 180, 3))
x = data_augmentation(inputs)
x = keras.applications.xception.preprocess_input(x)
x = conv_base(x)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)
\`\`\`

The pretrained base already knows how to extract meaningful visual features. Your small classifier just needs to learn how to map those features to your specific classes (e.g., cat vs. dog). This requires far less data than learning features from scratch.

Which layers transfer best? **Early layers** (edges, textures, basic colors) are the most generic and transfer well to virtually any image task. **Later layers** become increasingly specific to the original training task. The deeper a layer, the more task-specific its features, and the less transferable they are to very different tasks.

For tasks that are similar to ImageNet (natural images with common objects), the entire convolutional base transfers well. For very different tasks (medical images, satellite imagery), the last few layers may be less useful, but the early layers still provide a strong starting point.

Feature extraction with a frozen base typically achieves much higher accuracy than training from scratch on small datasets. And because only a small classifier is being trained, training is fast -- often just a few minutes on a GPU.
`,
      reviewCardIds: ['rc-4.8-4', 'rc-4.8-5'],
      codeExamples: [
        {
          title: 'Build a feature extraction model with Xception',
          language: 'python',
          code: `from tensorflow.keras import layers

inputs = keras.Input(shape=(180, 180, 3))
x = data_augmentation(inputs)
x = keras.applications.xception.preprocess_input(x)
x = conv_base(x)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Compile and train the feature extraction model',
          language: 'python',
          code: `model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"],
)
history = model.fit(
    train_dataset, epochs=20,
    validation_data=val_dataset,
)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Transfer learning reuses features learned on large datasets (like ImageNet) for new tasks.
- The convolutional base of a pretrained model serves as a general-purpose feature extractor.
- Freezing the base (trainable=False) preserves pretrained weights; only the new classifier head is trained.
- Early layers learn generic features (edges, textures) that transfer broadly; later layers are more task-specific.
- Feature extraction is fast and effective, especially when your dataset is small.`,
};

export default lesson;
