/**
 * Lesson 7.3: Mixed Precision and Quantization
 *
 * Covers: float32/float16/bfloat16, mixed-precision training, loss scaling, post-training quantization
 * Source sections: 18.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '7.3',
  title: 'Mixed Precision and Quantization',
  sections: [
    {
      id: '7.3.1',
      title: 'Mixed-Precision Training',
      content: `
Standard deep learning uses **float32** (32-bit floating point) -- 4 bytes per number. **Mixed-precision training** performs most computations in **float16** or **bfloat16** (16-bit, 2 bytes) while keeping a float32 copy of the weights for accurate accumulation.

Benefits are substantial:
- **2x memory savings**: half the bytes per value means twice as many values fit in GPU memory
- **Faster computation**: modern GPUs have dedicated hardware for float16 operations (Tensor Cores on NVIDIA GPUs)
- **Maintained accuracy**: the float32 master weights prevent numerical drift

\`\`\`python
# Enable mixed precision in Keras
keras.mixed_precision.set_global_policy("mixed_float16")
# Now computations use float16, weights accumulate in float32
\`\`\`

**Loss scaling** is a technique used with float16 to prevent **gradient underflow**. Very small gradient values (common in deep networks) can round to zero in float16's limited precision. Loss scaling multiplies the loss by a large factor (e.g., 1024) before backpropagation, shifting all gradients into float16's representable range. After computing gradients, the factor is divided out before updating the float32 master weights. The net effect on training is identical, but intermediate gradients avoid underflow.

**bfloat16** is often preferred over float16 because it maintains float32's exponent range (handling very large and small values) while reducing precision. This makes it less susceptible to overflow/underflow, reducing the need for loss scaling.
`,
      reviewCardIds: ['rc-7.3-1', 'rc-7.3-2', 'rc-7.3-3'],
      illustrations: ['quantization'],
      codeExamples: [
        {
          title: 'Enabling mixed-precision training in Keras',
          language: 'python',
          code: `import tensorflow as tf
from tensorflow import keras

# Set the global dtype policy to mixed_float16
keras.mixed_precision.set_global_policy("mixed_float16")

model = keras.Sequential([
    keras.layers.Dense(512, activation="relu"),
    keras.layers.Dense(512, activation="relu"),
    # Final layer in float32 for numerical stability
    keras.layers.Dense(10, dtype="float32")
])
model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy")`,
        },
        {
          title: 'Using bfloat16 policy instead of float16',
          language: 'python',
          code: `import tensorflow as tf
from tensorflow import keras

# bfloat16: wider exponent range, less overflow risk
# No loss scaling needed in most cases
keras.mixed_precision.set_global_policy("mixed_bfloat16")

model = keras.Sequential([
    keras.layers.Dense(256, activation="relu"),
    keras.layers.Dense(10, activation="softmax")
])
model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy")`,
        },
      ],
    },
    {
      id: '7.3.2',
      title: 'Post-Training Quantization for Inference',
      content: `
While mixed precision speeds up training, **quantization** targets inference. After training, model weights are converted from float32 to lower precision formats:

- **int8 quantization**: 4x memory reduction (32-bit to 8-bit). A 7-billion-parameter model goes from 28 GB to 7 GB.
- **int4 quantization**: 8x memory reduction. The same model fits in 3.5 GB.

\`\`\`python
# Post-training quantization conceptually
for weight in model.weights:
    weight = quantize(weight, target_dtype="int8")
\`\`\`

Quantization introduces a small accuracy loss because lower precision means less precise weight values. However, for many applications the tradeoff is worthwhile: running a large model on consumer hardware (a laptop GPU instead of a data center) more than compensates for a fraction of a percent accuracy loss.

The practical impact: quantization is what makes it possible to run LLMs on personal devices. A 13-billion-parameter model in float32 requires 52 GB of memory. With int4 quantization, it fits in 6.5 GB -- comfortably within a modern laptop GPU.

Different layers may have different sensitivity to quantization. Critical layers (attention projections, final classifiers) sometimes benefit from higher precision, while less sensitive layers (intermediate feed-forward) can be aggressively quantized. This **mixed quantization** approach maximizes compression while preserving accuracy.
`,
      reviewCardIds: ['rc-7.3-4', 'rc-7.3-5'],
      illustrations: ['quantization-memory'],
      codeExamples: [
        {
          title: 'TensorFlow Lite post-training INT8 quantization',
          language: 'python',
          code: `import tensorflow as tf

# Save trained model
model.save("my_model")

# Convert with INT8 quantization
converter = tf.lite.TFLiteConverter.from_saved_model("my_model")
converter.optimizations = [tf.lite.Optimize.DEFAULT]

# Representative dataset for calibration
def representative_data():
    for sample in calibration_samples:
        yield [sample.astype("float32")]

converter.representative_dataset = representative_data
tflite_model = converter.convert()

with open("model_int8.tflite", "wb") as f:
    f.write(tflite_model)`,
        },
        {
          title: 'Exporting a Keras model to ONNX format',
          language: 'python',
          code: `import tf2onnx
import tensorflow as tf

model = tf.keras.models.load_model("my_model")

# Convert to ONNX (opset 13 for broad compatibility)
input_signature = [tf.TensorSpec(
    shape=(None, 784), dtype=tf.float32, name="input")]
onnx_model, _ = tf2onnx.convert.from_keras(
    model, input_signature, opset=13)

with open("model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Mixed-precision training uses float16 for computation and float32 for weight accumulation, giving 2x memory savings and faster training.
- Loss scaling prevents gradient underflow in float16 by temporarily amplifying gradient values.
- bfloat16 is often preferred over float16 due to its wider exponent range (less overflow/underflow risk).
- Post-training quantization (int8, int4) reduces model size for efficient inference on consumer hardware.
- Quantization enables running billion-parameter models on laptops at the cost of minimal accuracy loss.`,
};

export default lesson;
