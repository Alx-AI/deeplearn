/**
 * Lesson 5.1: Visualizing Intermediate Activations
 *
 * Covers: Feature map extraction, activation visualization, abstraction gradient
 * Source sections: 10.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.1',
  title: 'Visualizing Intermediate Activations',
  sections: [
    {
      id: '5.1.1',
      title: 'Extracting and Viewing Feature Maps',
      content: `
A trained ConvNet is not a black box. You can open it up and see exactly what each layer does to an input image by extracting **intermediate activations** -- the output tensors at each layer as an image passes through the network.

To do this, create a new model that returns the outputs of all layers you care about:

\`\`\`python
layer_outputs = [layer.output for layer in model.layers]
activation_model = keras.Model(inputs=model.input, outputs=layer_outputs)
activations = activation_model.predict(img_array)
\`\`\`

Each activation is a 3D tensor of shape (height, width, channels). Each channel is a different **feature map** -- a 2D grid showing where that filter's pattern was detected in the image.

At **early layers** (layer 1-2), feature maps look like filtered versions of the original image. You will see edge detectors (horizontal, vertical, diagonal), color blobs, and basic textures. Each channel responds to a different low-level visual pattern.

At **deeper layers**, feature maps become increasingly abstract and sparse. Instead of recognizable visual patterns, you see a few bright spots indicating "here is where this high-level concept appears." A deep layer might have a channel that lights up only when it detects something like "cat ear" -- which looks like a bright blob at the ear location, not anything recognizable as an ear to a human eye.
`,
      reviewCardIds: ['rc-5.1-1', 'rc-5.1-2', 'rc-5.1-3'],
      illustrations: ['feature-extraction'],
      codeExamples: [
        {
          title: 'Building a multi-output model for activation extraction',
          language: 'python',
          code: `from tensorflow import keras

model = keras.applications.VGG16(weights="imagenet")
layer_outputs = [layer.output for layer in model.layers[:8]]
activation_model = keras.Model(
    inputs=model.input, outputs=layer_outputs
)`,
        },
        {
          title: 'Extracting and inspecting feature maps',
          language: 'python',
          code: `import numpy as np

img = keras.utils.load_img("cat.jpg", target_size=(224, 224))
img_array = keras.utils.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = keras.applications.vgg16.preprocess_input(img_array)

activations = activation_model.predict(img_array)
first_layer_activation = activations[0]
print(first_layer_activation.shape)  # (1, 224, 224, 64)`,
        },
        {
          title: 'Visualizing a single feature map channel',
          language: 'python',
          code: `import matplotlib.pyplot as plt

# Display channel 0 of layer 3's activations
plt.imshow(activations[3][0, :, :, 0], cmap="viridis")
plt.title("Layer 3, Channel 0")
plt.axis("off")
plt.show()`,
        },
      ],
    },
    {
      id: '5.1.2',
      title: 'What Visualization Tells You',
      content: `
Some channels in deep layers may show **all zeros** for a given input. These are "dead" filters for this particular image -- the patterns they detect are simply not present. A filter that responds to wheel patterns will show zero activation for a cat image. This is normal and shows specialization.

The progression from concrete to abstract as you go deeper is the **abstraction gradient**. Layer 1 detects edges. Layer 3 combines edges into textures. Layer 6 combines textures into object parts. Layer 10 combines parts into complete objects. This hierarchy is precisely what makes ConvNets so effective -- each layer builds on the previous one's discoveries.

Visualizing activations is valuable for **debugging**. If the model is classifying cats but the deep activations light up on the background (sofa, rug) rather than the cat, the model may have learned a shortcut -- "photos of cats tend to have certain backgrounds." This would fail on cats in unusual settings.

If early layers produce all-zero activations, the model may not be processing input correctly -- check your preprocessing pipeline. If deep layers show no specialization (all channels look similar), the model may lack capacity or the training data may be insufficient.

Model introspection turns a trained model from an opaque prediction machine into something you can understand, debug, and trust. It is an essential practice before deploying any vision model in a real-world application.
`,
      reviewCardIds: ['rc-5.1-4', 'rc-5.1-5'],
      illustrations: ['grad-cam'],
      codeExamples: [
        {
          title: 'Checking for dead filters (all-zero channels)',
          language: 'python',
          code: `import numpy as np

for layer_idx, activation in enumerate(activations):
    dead = np.sum(activation[0], axis=(0, 1)) == 0
    n_dead = np.count_nonzero(dead)
    total = activation.shape[-1]
    print(f"Layer {layer_idx}: {n_dead}/{total} dead channels")`,
        },
        {
          title: 'Displaying the abstraction gradient across layers',
          language: 'python',
          code: `import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 4, figsize=(16, 4))
layer_indices = [1, 3, 5, 7]
for ax, idx in zip(axes, layer_indices):
    ax.imshow(activations[idx][0, :, :, 0], cmap="viridis")
    ax.set_title(f"Layer {idx}")
    ax.axis("off")
plt.suptitle("Early to Deep: Concrete to Abstract")
plt.show()`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Intermediate activations show what each layer detects: early layers find edges and textures, deep layers find abstract concepts.
- Feature maps at each layer are 3D tensors; each channel is a different pattern detector.
- Dead filters (all zeros) for a given input indicate that filter's pattern is absent in the image.
- Visualization helps debug models by revealing whether the model focuses on relevant features or background shortcuts.
- Model introspection is essential before deploying vision models in production.`,
};

export default lesson;
