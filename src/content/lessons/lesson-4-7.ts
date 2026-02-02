/**
 * Lesson 4.7: Training a ConvNet from Scratch on Small Data
 *
 * Covers: Small data challenges, data augmentation, combining regularization techniques
 * Source sections: 8.2.1, 8.2.2, 8.2.3, 8.2.4, 8.2.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.7',
  title: 'Training a ConvNet from Scratch on Small Data',
  sections: [
    {
      id: '4.7.1',
      title: 'The Small Data Challenge',
      illustrations: ['data-augmentation'],
      content: `
In practice, most image classification problems do not come with millions of labeled samples. You might have a few thousand images -- or even a few hundred. Training a ConvNet from scratch on such small datasets leads to severe overfitting: the model memorizes the specific images rather than learning generalizable visual features.

Consider a dogs-versus-cats classifier with 2,000 training images per class. Without any countermeasures, a ConvNet will overfit within a handful of epochs. The training accuracy climbs to near 100% while validation accuracy plateaus or declines.

The first line of defense is **data augmentation** -- applying random transformations to training images to artificially increase diversity. Common augmentations include:

\`\`\`python
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.2),
])
\`\`\`

Each training image is randomly transformed every time the model sees it. A cat flipped horizontally is still a cat; a cat rotated slightly is still a cat. The model never sees the exact same image twice, which makes memorization much harder.

The critical constraint is that augmentations must be **label-preserving**. Flipping a cat image still shows a cat. But flipping a handwritten "6" could produce a "9," corrupting the training signal. Always choose augmentations appropriate to your domain.
`,
      reviewCardIds: ['rc-4.7-1', 'rc-4.7-2', 'rc-4.7-3'],
      codeExamples: [
        {
          title: 'Define a Keras data augmentation pipeline',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.2),
])`,
        },
        {
          title: 'Preview augmented images',
          language: 'python',
          code: `import matplotlib.pyplot as plt

# image shape: (180, 180, 3)
augmented_images = [data_augmentation(image, training=True)
                    for _ in range(9)]
fig, axes = plt.subplots(3, 3, figsize=(6, 6))
for ax, img in zip(axes.flat, augmented_images):
    ax.imshow(img.numpy().astype("uint8"))
    ax.axis("off")
plt.show()`,
        },
      ],
    },
    {
      id: '4.7.2',
      title: 'Combining Augmentation with Other Regularization',
      content: `
Data augmentation alone is not enough for small datasets. You will want to combine it with **Dropout** before the Dense classifier layers to prevent co-adaptation of features:

\`\`\`python
inputs = keras.Input(shape=(180, 180, 3))
x = data_augmentation(inputs)
x = layers.Rescaling(1.0 / 255)(x)
x = layers.Conv2D(32, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(64, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(128, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
\`\`\`

Data augmentation and dropout address overfitting from different angles. Augmentation diversifies the input (more training variety), while dropout diversifies the representations (prevents reliance on any single feature). Together, they provide stronger regularization than either alone.

Important: data augmentation is applied **only during training**, not during validation or testing. During evaluation, you want to measure performance on the actual, unmodified images. The Keras augmentation layers automatically disable themselves when the model is in inference mode.

Even with these techniques, training from scratch on very small datasets has limits. When you have fewer than a few thousand images, the results will almost always be better with **transfer learning** -- which we cover in the next two lessons. Transfer learning lets you leverage visual features already learned from millions of images rather than trying to learn everything from your small dataset.
`,
      reviewCardIds: ['rc-4.7-4', 'rc-4.7-5'],
      codeExamples: [
        {
          title: 'Full model with augmentation and dropout',
          language: 'python',
          code: `inputs = keras.Input(shape=(180, 180, 3))
x = data_augmentation(inputs)
x = layers.Rescaling(1.0 / 255)(x)
x = layers.Conv2D(32, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(64, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.Conv2D(128, 3, activation="relu")(x)
x = layers.MaxPooling2D(2)(x)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Compile and train with augmentation enabled',
          language: 'python',
          code: `model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"],
)
# Augmentation layers are active during training,
# automatically disabled during validation
history = model.fit(
    train_dataset, epochs=50,
    validation_data=val_dataset,
)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Small datasets (a few thousand images) cause ConvNets to overfit quickly when trained from scratch.
- Data augmentation applies random label-preserving transformations (flips, rotations, zooms) to increase training diversity.
- Combine data augmentation with Dropout for stronger regularization from two different angles.
- Augmentation is applied only during training; validation/test use unmodified images.
- For very small datasets, transfer learning will almost always outperform training from scratch.`,
};

export default lesson;
