/**
 * Lesson 5.2: Visualizing ConvNet Filters and Grad-CAM
 *
 * Covers: Filter visualization via gradient ascent, Grad-CAM heatmaps, model explainability
 * Source sections: 10.2, 10.3, 10.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.2',
  title: 'Visualizing ConvNet Filters and Grad-CAM',
  sections: [
    {
      id: '5.2.1',
      title: 'Filter Visualization via Gradient Ascent',
      content: `
While activation visualization shows what a filter responds to in a specific image, **filter visualization** reveals the abstract pattern each filter is ideally looking for, independent of any particular input.

The technique uses **gradient ascent in input space**. Start with a random noise image, compute the gradient of a specific filter's activation with respect to the input pixels, and nudge the pixels to increase that filter's response. After many iterations, the noise image transforms into a pattern that maximally activates the filter:

\`\`\`python
# Pseudocode for filter visualization
image = random_noise()
for step in range(iterations):
    activation = get_filter_activation(model, layer, filter_index, image)
    grads = compute_gradient(activation, image)
    image += learning_rate * grads  # Gradient ascent
\`\`\`

Early-layer filters produce simple patterns: horizontal stripes, diagonal edges, color gradients. Mid-layer filters reveal textures: crosshatch patterns, polka dots, wavy lines. Deep-layer filters show complex patterns resembling feathers, eyes, leaves, or other natural structures.

This is gradient ascent on pixels rather than gradient descent on weights. You are not training the model -- you are generating an image that reveals what the model has already learned.
`,
      reviewCardIds: ['rc-5.2-1', 'rc-5.2-2'],
      illustrations: ['feature-extraction'],
      codeExamples: [
        {
          title: 'Filter visualization via gradient ascent',
          language: 'python',
          code: `import tensorflow as tf
from tensorflow import keras

model = keras.applications.Xception(weights="imagenet")
layer = model.get_layer("block3_sepconv1")
feature_extractor = keras.Model(
    inputs=model.input, outputs=layer.output
)`,
        },
        {
          title: 'Computing the loss and gradient for a single filter',
          language: 'python',
          code: `def compute_loss_and_grads(image, filter_index):
    with tf.GradientTape() as tape:
        tape.watch(image)
        activation = feature_extractor(image)
        filter_activation = activation[:, 2:-2, 2:-2, filter_index]
        loss = tf.reduce_mean(filter_activation)
    grads = tape.gradient(loss, image)
    grads = tf.math.l2_normalize(grads)
    return loss, grads`,
        },
        {
          title: 'Running the gradient ascent loop on a noise image',
          language: 'python',
          code: `image = tf.random.uniform(
    (1, 200, 200, 3), minval=0.4, maxval=0.6
)
learning_rate = 10.0
for step in range(30):
    loss, grads = compute_loss_and_grads(image, filter_index=0)
    image += learning_rate * grads`,
        },
      ],
    },
    {
      id: '5.2.2',
      title: 'Grad-CAM: Understanding Model Decisions',
      content: `
**Grad-CAM** (Gradient-weighted Class Activation Mapping) answers a practical question: "Which regions of this image most influenced the model's classification decision?"

It works by computing the gradient of the predicted class score with respect to the feature maps of the last convolutional layer. These gradients indicate how much each spatial location in the feature maps contributed to the prediction. The result is a heatmap overlaid on the original image:

\`\`\`python
# Get gradients of the predicted class with respect to final conv layer
grads = tape.gradient(class_output, last_conv_output)
# Weight each feature map by its average gradient importance
weights = tf.reduce_mean(grads, axis=(0, 1))
heatmap = tf.reduce_sum(last_conv_output * weights, axis=-1)
\`\`\`

Bright regions in the heatmap indicate areas that strongly influenced the prediction. For a "cat" classification, you should see the heatmap highlighting the cat's body or face. If the heatmap highlights the background instead, the model has learned a spurious correlation.

This is crucial for **model explainability** in high-stakes applications. In medical imaging, you need to verify the model is examining the lesion, not a hospital logo. In autonomous driving, you need to confirm the model is looking at the road, not dashboard reflections. Grad-CAM provides this verification.

Model explainability is not just a nice-to-have. For trust, safety, compliance, and debugging, understanding WHY a model makes predictions is as important as the predictions themselves.
`,
      reviewCardIds: ['rc-5.2-3', 'rc-5.2-4', 'rc-5.2-5'],
      illustrations: ['grad-cam'],
      codeExamples: [
        {
          title: 'Grad-CAM: computing the class activation heatmap',
          language: 'python',
          code: `import tensorflow as tf
import numpy as np
from tensorflow import keras

model = keras.applications.Xception(weights="imagenet")
last_conv_layer = model.get_layer("block14_sepconv2_act")
grad_model = keras.Model(
    inputs=model.input,
    outputs=[last_conv_layer.output, model.output],
)

with tf.GradientTape() as tape:
    conv_output, predictions = grad_model(img_array)
    class_index = tf.argmax(predictions[0])
    class_score = predictions[:, class_index]

grads = tape.gradient(class_score, conv_output)
weights = tf.reduce_mean(grads, axis=(0, 1, 2))
heatmap = conv_output[0] @ weights[:, tf.newaxis]
heatmap = tf.squeeze(heatmap)
heatmap = tf.maximum(heatmap, 0) / tf.reduce_max(heatmap)`,
        },
        {
          title: 'Overlaying the heatmap on the original image',
          language: 'python',
          code: `import matplotlib.pyplot as plt
import matplotlib.cm as cm

heatmap_resized = tf.image.resize(
    heatmap[..., tf.newaxis], (img.shape[0], img.shape[1])
).numpy().squeeze()
colormap = cm.jet(heatmap_resized)[:, :, :3]
overlay = 0.6 * img / 255.0 + 0.4 * colormap
plt.imshow(overlay)
plt.title("Grad-CAM Overlay")
plt.axis("off")
plt.show()`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Filter visualization uses gradient ascent on input pixels to reveal the ideal pattern each filter detects.
- Early filters detect edges and colors; deep filters detect complex textures and object parts.
- Grad-CAM produces heatmaps showing which image regions most influenced the classification decision.
- If Grad-CAM highlights the background rather than the object, the model has learned a spurious correlation.
- Model explainability is essential for trust, safety, debugging, and regulatory compliance.`,
};

export default lesson;
