/**
 * Lesson 5.3: Image Segmentation Fundamentals
 *
 * Covers: Semantic, instance, panoptic segmentation; encoder-decoder architecture; upsampling
 * Source sections: 11.1, 11.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.3',
  title: 'Image Segmentation Fundamentals',
  sections: [
    {
      id: '5.3.1',
      title: 'Types of Image Segmentation',
      content: `
Image classification assigns one label per image. **Image segmentation** assigns a label to every pixel, producing a detailed spatial understanding of the scene.

There are three flavors:

- **Semantic segmentation**: every pixel gets a class label (sky, road, car, person). All pixels of the same class receive the same label. If two cars overlap, both are just "car."
- **Instance segmentation**: distinguishes individual objects. Two overlapping cars get different labels (car_1 and car_2). Each instance is tracked separately.
- **Panoptic segmentation**: combines both -- stuff categories (sky, road) get semantic labels, and thing categories (cars, people) get instance labels.

The loss function for segmentation differs from classification: instead of one loss per image, there is a loss **per pixel**. Every pixel has a predicted class and a ground truth class, and the total loss is the average cross-entropy across all pixels.

Creating training data for segmentation is expensive -- every pixel in every image must be labeled. This makes transfer learning and pretrained models especially valuable for segmentation tasks.
`,
      reviewCardIds: ['rc-5.3-1', 'rc-5.3-2'],
      illustrations: ['segmentation-types'],
      codeExamples: [
        {
          title: 'Per-pixel cross-entropy loss for segmentation',
          language: 'python',
          code: `from tensorflow import keras

model.compile(
    optimizer="rmsprop",
    loss=keras.losses.SparseCategoricalCrossentropy(),
    metrics=["accuracy"],
)
# Each pixel in the mask has a class label (0..num_classes-1)
# Loss is averaged across all pixels in all images`,
        },
        {
          title: 'Loading a segmentation dataset with masks',
          language: 'python',
          code: `from tensorflow.keras.utils import image_dataset_from_directory

input_ds = image_dataset_from_directory(
    "images/", image_size=(256, 256), batch_size=32, label_mode=None
)
mask_ds = image_dataset_from_directory(
    "masks/", image_size=(256, 256), batch_size=32,
    label_mode=None, color_mode="grayscale",
)
dataset = tf.data.Dataset.zip((input_ds, mask_ds))`,
        },
      ],
    },
    {
      id: '5.3.2',
      title: 'The Encoder-Decoder Architecture',
      content: `
Segmentation models need to produce an output with the same spatial resolution as the input image. The standard approach is the **encoder-decoder** architecture.

The **encoder** is essentially a classification ConvNet: it progressively reduces spatial dimensions while building rich feature representations. A $224 \\times 224$ image might be reduced to a $7 \\times 7$ feature map.

The **decoder** then progressively **upsamples** these feature maps back to the original resolution. Upsampling can be done with transposed convolutions (\`Conv2DTranspose\`) or simple upsampling followed by regular convolutions.

\`\`\`python
# Encoder (downsampling)
x = layers.Conv2D(64, 3, activation="relu", padding="same")(inputs)
x = layers.MaxPooling2D(2)(x)
# ... more conv+pool layers

# Decoder (upsampling)
x = layers.Conv2DTranspose(64, 3, strides=2, padding="same", activation="relu")(x)
# ... more upsampling layers
outputs = layers.Conv2D(num_classes, 1, activation="softmax")(x)
\`\`\`

**Skip connections** between encoder and decoder are critical. During encoding, fine spatial details (exact edges, precise boundaries) are lost. Skip connections pass high-resolution feature maps from the encoder directly to corresponding decoder layers, helping the decoder recover sharp boundaries. Without them, segmentation masks would be blurry.

The U-Net architecture, named for its U-shaped diagram, is the canonical example of this pattern and remains widely used in medical imaging and other domains.
`,
      reviewCardIds: ['rc-5.3-3', 'rc-5.3-4', 'rc-5.3-5'],
      illustrations: ['encoder-decoder'],
      codeExamples: [
        {
          title: 'Building a U-Net encoder-decoder with skip connections',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

inputs = keras.Input(shape=(256, 256, 3))

# Encoder
e1 = layers.Conv2D(64, 3, activation="relu", padding="same")(inputs)
p1 = layers.MaxPooling2D(2)(e1)
e2 = layers.Conv2D(128, 3, activation="relu", padding="same")(p1)
p2 = layers.MaxPooling2D(2)(e2)

# Bottleneck
b = layers.Conv2D(256, 3, activation="relu", padding="same")(p2)

# Decoder with skip connections
d2 = layers.Conv2DTranspose(128, 3, strides=2, padding="same")(b)
d2 = layers.Concatenate()([d2, e2])  # skip connection
d2 = layers.Conv2D(128, 3, activation="relu", padding="same")(d2)

d1 = layers.Conv2DTranspose(64, 3, strides=2, padding="same")(d2)
d1 = layers.Concatenate()([d1, e1])  # skip connection
d1 = layers.Conv2D(64, 3, activation="relu", padding="same")(d1)

outputs = layers.Conv2D(num_classes, 1, activation="softmax")(d1)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Compiling and training the segmentation model',
          language: 'python',
          code: `model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
model.fit(dataset, epochs=25, validation_data=val_dataset)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Semantic segmentation labels every pixel with a class; instance segmentation distinguishes individual objects; panoptic combines both.
- Segmentation loss is computed per pixel, not per image.
- The encoder-decoder architecture reduces spatial dimensions (encoder) then restores them (decoder).
- Skip connections from encoder to decoder preserve fine spatial details for sharp segmentation boundaries.
- U-Net is the canonical encoder-decoder architecture for segmentation.`,
};

export default lesson;
