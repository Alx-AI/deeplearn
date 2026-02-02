/**
 * Lesson 5.12: Module 5 Integration -- Computer Vision and Sequences Recap
 *
 * Covers: Task-to-architecture mapping, transfer learning applicability, interpretability
 * Source sections: Synthesis of chapters 10-13
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.12',
  title: 'Computer Vision and Sequences Recap',
  sections: [
    {
      id: '5.12.1',
      title: 'Mapping Tasks to Architectures',
      content: `
You now have a toolkit of architectures for two broad domains. Let us consolidate the mapping:

**Computer vision tasks:**
- **Image classification** (one label per image): ConvNet or ViT with GlobalPooling + Dense. Use pretrained models + fine-tuning for small datasets.
- **Semantic segmentation** (one label per pixel): encoder-decoder with skip connections (U-Net). Or use SAM for zero-shot segmentation.
- **Object detection** (bounding boxes + labels): YOLO for speed, R-CNN for maximum accuracy. Pretrained on COCO for general use.

**Sequence tasks:**
- **Tabular/simple forecasting**: Dense baseline (always start here)
- **Local temporal patterns**: Conv1D + pooling
- **Long-range dependencies**: LSTM/GRU or Transformer
- **Full-sequence understanding** (text classification): Bidirectional LSTM or Transformer encoder

Transfer learning applies broadly to vision: pretrained ImageNet features transfer to most image tasks. For sequences, pretrained language models (covered in Module 6) provide similar benefits for text tasks.
`,
      reviewCardIds: ['rc-5.12-1', 'rc-5.12-2'],
      illustrations: ['encoder-decoder'],
      codeExamples: [
        {
          title: 'Choosing a model architecture based on task type',
          language: 'python',
          code: `from tensorflow import keras
from tensorflow.keras import layers

# Timeseries forecasting: LSTM with dense head
def forecast_model(window, features):
    return keras.Sequential([
        layers.LSTM(64, input_shape=(window, features)),
        layers.Dense(1)])

# Text classification: Bidirectional LSTM
def text_classifier(vocab_size, max_len):
    return keras.Sequential([
        layers.Embedding(vocab_size, 128, input_length=max_len),
        layers.Bidirectional(layers.LSTM(64)),
        layers.Dense(1, activation="sigmoid")])`,
        },
        {
          title: 'Image classification with pretrained ConvNet (transfer learning)',
          language: 'python',
          code: `base = keras.applications.MobileNetV2(
    weights="imagenet", include_top=False,
    input_shape=(224, 224, 3))
base.trainable = False

model = keras.Sequential([
    base,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
model.compile(optimizer="adam", loss="categorical_crossentropy")`,
        },
      ],
    },
    {
      id: '5.12.2',
      title: 'The Interpretability Imperative',
      content: `
A recurring theme across this module: **always visualize what your model learns before deploying it**.

For vision models:
- Use **Grad-CAM** to verify the model focuses on the right image regions
- Visualize **intermediate activations** to check that layers learn meaningful features
- Use **filter visualization** to understand what patterns each filter detects

For sequence models:
- Plot **attention weights** (when available) to see which timesteps influence predictions
- Examine **prediction errors** by time period, feature, or condition to find systematic failures
- Compare model predictions against the **baseline** across different scenarios

A model that achieves high accuracy for the wrong reasons is more dangerous than a model that achieves moderate accuracy for the right reasons. An image classifier that uses the background (hospital room for medical images) rather than the actual pathology will fail catastrophically when deployed in a different clinical setting.

You now have the foundations for both visual and sequential data. Module 6 will bring these together with NLP -- where sequences of tokens are processed by Transformer models that combine the best of attention, embeddings, and deep architecture patterns.
`,
      reviewCardIds: ['rc-5.12-3', 'rc-5.12-4', 'rc-5.12-5'],
      illustrations: ['grad-cam'],
      codeExamples: [
        {
          title: 'Grad-CAM visualization for a ConvNet prediction',
          language: 'python',
          code: `import numpy as np
import tensorflow as tf

def make_gradcam_heatmap(model, img_array, last_conv_layer_name):
    grad_model = tf.keras.Model(
        model.inputs,
        [model.get_layer(last_conv_layer_name).output, model.output])
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        top_class = tf.argmax(predictions[0])
        loss = predictions[:, top_class]
    grads = tape.gradient(loss, conv_outputs)
    weights = tf.reduce_mean(grads, axis=(0, 1, 2))
    heatmap = tf.reduce_sum(conv_outputs[0] * weights, axis=-1)
    return tf.nn.relu(heatmap) / tf.reduce_max(heatmap)`,
        },
        {
          title: 'Analyzing prediction errors by time period',
          language: 'python',
          code: `import numpy as np

preds = model.predict(test_x).squeeze()
errors = np.abs(test_y - preds)

# Split errors by hour of day to find systematic patterns
hours = test_hours  # array of hour-of-day for each sample
for h in range(0, 24, 6):
    mask = (hours >= h) & (hours < h + 6)
    print(f"Hours {h:02d}-{h+5:02d}: MAE = {errors[mask].mean():.3f}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Match architectures to tasks: ConvNets for images, encoder-decoder for segmentation, YOLO for detection, RNNs/Transformers for sequences.
- Transfer learning with pretrained models is the default approach for vision tasks with limited data.
- Always visualize model behavior (Grad-CAM, activations, attention weights) before deploying.
- A model that succeeds for the wrong reasons is more dangerous than moderate accuracy from the right features.
- Dense baselines remain important -- always compare your complex model against a simple one.`,
};

export default lesson;
