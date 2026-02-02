/**
 * Lesson 3.10: Deploying Your Model
 *
 * Covers: Stakeholders, inference models, monitoring, maintenance
 * Source sections: 6.3.1, 6.3.2, 6.3.3, 6.3.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.10',
  title: 'Deploying Your Model',
  sections: [
    {
      id: '3.10.1',
      title: 'Communicating with Stakeholders and Shipping an Inference Model',
      content: `
A model that clears its final test evaluation is ready for deployment -- but deployment is far more than copying a file to a server. The first step is **setting expectations** with the people who will use or depend on your model.

Nonspecialists often have unrealistic expectations about AI. They may assume the model "understands" the task or has human-like common sense. To address this:

- **Show failure modes** -- Demonstrate examples where the model gets things wrong, especially surprising or counterintuitive errors. This builds realistic expectations.
- **Avoid abstract accuracy numbers** -- "98% accuracy" is mentally rounded to 100% by most stakeholders. Instead, speak in concrete terms: "Of every 1,000 transactions, about 5 fraudulent ones will be missed, and about 25 legitimate ones will be flagged for review."
- **Discuss key parameters** -- Thresholds, tradeoffs between false positives and false negatives, and how these map to business outcomes. These decisions require business context that only stakeholders can provide.

Once expectations are set, you need to create an **inference model** -- an optimized version of your trained model designed for production use. The model you trained in a notebook is rarely what you deploy.

\`\`\`python
# Export for TensorFlow Serving (REST API deployment)
model.export("path/to/location", format="tf_saved_model")

# Or export for ONNX (cross-platform deployment)
model.export("path/to/location", format="onnx")
\`\`\`

Three common deployment targets exist:

1. **REST API** -- Serve predictions from a remote server. Good when connectivity is reliable and latency of ~500ms is acceptable. Used for recommendation engines, fraud detection, and search.

2. **On-device** -- Run the model on the user's phone or embedded hardware. Required when connectivity is unreliable, latency must be minimal, or data is too sensitive to send to a server.

3. **In-browser** -- Run via JavaScript (TensorFlow.js or ONNX). Offloads compute to the user, works offline after initial download, and keeps data private.
`,
      reviewCardIds: ['rc-3.10-1', 'rc-3.10-2'],
      illustrations: ['ml-workflow'],
      codeExamples: [
        {
          title: 'Saving and loading a Keras model',
          language: 'python',
          code: `from keras import Sequential, layers

model = Sequential([
    layers.Dense(64, activation="relu", input_shape=(10,)),
    layers.Dense(1, activation="sigmoid"),
])
model.compile(optimizer="adam", loss="binary_crossentropy")

# Save the entire model (architecture + weights + optimizer)
model.save("my_model.keras")

# Load it back -- no need to redefine architecture
from keras.models import load_model
restored = load_model("my_model.keras")
print(f"Restored params: {restored.count_params():,}")`,
        },
        {
          title: 'Exporting for different deployment targets',
          language: 'python',
          code: `# REST API deployment with TensorFlow Serving
model.export("export/serving", format="tf_saved_model")

# Cross-platform deployment with ONNX
model.export("export/onnx_model", format="onnx")

# For TensorFlow Lite (on-device / mobile)
import tensorflow as tf
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()
with open("model.tflite", "wb") as f:
    f.write(tflite_model)`,
        },
      ],
    },
    {
      id: '3.10.2',
      title: 'Optimizing for Inference and Monitoring in Production',
      content: `
Before deploying, especially to resource-constrained environments, apply **inference optimization** techniques:

- **Weight pruning** -- Not all weights contribute equally to predictions. Pruning removes the least important weights, reducing memory and compute requirements at a small cost in accuracy.
- **Weight quantization** -- Training uses 32-bit floating-point weights. Quantizing to 8-bit integers (\`int8\`) produces a model four times smaller with minimal accuracy loss.

\`\`\`python
# Keras built-in quantization
model.quantize("int8")
# The model is now ~4x smaller and faster for inference
\`\`\`

Once deployed, your work is not done. You must **monitor** the model continuously in production:

- **Track business metrics** -- Is user engagement up or down after deploying the new recommendation system? Has click-through rate improved? Use **A/B testing** to isolate the model's impact: route some traffic through the new model and compare against a control group using the old system.

- **Audit predictions manually** -- Periodically send production data for manual annotation and compare against model predictions. This catches degradation that automated metrics might miss.

- **Use surveys when audits are impossible** -- For tasks like spam detection where manual review is impractical, user feedback surveys can provide signal about model quality.

- **Watch for distribution shift** -- Production data will inevitably diverge from training data over time. Monitor input feature distributions and prediction confidence. If you see shifts, it is time to retrain.
`,
      reviewCardIds: ['rc-3.10-3', 'rc-3.10-4'],
      illustrations: ['quantization'],
      codeExamples: [
        {
          title: 'Weight quantization for smaller, faster inference',
          language: 'python',
          code: `import tensorflow as tf

# Post-training quantization to int8
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
quantized_model = converter.convert()

original_size = len(converter.convert())  # without optimization
quantized_size = len(quantized_model)
print(f"Original: {original_size:,} bytes")
print(f"Quantized: {quantized_size:,} bytes")
print(f"Reduction: {1 - quantized_size/original_size:.0%}")`,
        },
        {
          title: 'Simple A/B test tracking for model comparison',
          language: 'python',
          code: `import random

def assign_variant(user_id, control_pct=0.5):
    """Deterministically assign users to A/B groups."""
    random.seed(user_id)
    return "new_model" if random.random() > control_pct else "baseline"

# Track outcomes per variant
results = {"baseline": [], "new_model": []}
for uid in range(1000):
    variant = assign_variant(uid)
    outcome = random.random()  # replace with real metric
    results[variant].append(outcome)

for variant, outcomes in results.items():
    avg = sum(outcomes) / len(outcomes)
    print(f"{variant}: n={len(outcomes)}, avg={avg:.3f}")`,
        },
      ],
    },
    {
      id: '3.10.3',
      title: 'Model Maintenance and the Complete Workflow',
      content: `
No model lasts forever. **Concept drift** -- the gradual change in the relationship between inputs and outputs -- affects every production model. A music recommendation engine might become outdated in weeks. A credit card fraud detector can become stale in days, because fraud patterns evolve rapidly. Even relatively stable problems like image search will degrade over years as visual styles, camera technology, and user expectations change.

As soon as your model launches, begin preparing the next generation:

- **Continue collecting and annotating data** -- Pay special attention to samples the current model finds difficult. These "hard examples" are the most valuable for improving the next version.
- **Watch for new features** -- Are new data sources becoming available that could improve predictions?
- **Update the label set** -- Categories or classes may need to expand or change as the problem evolves.
- **Maintain your annotation pipeline** -- Invest in making data labeling faster and more reliable over time.

The complete ML workflow, from start to finish:

1. **Define the task** -- Frame the problem, collect data, understand the data, choose a success metric.
2. **Develop a model** -- Prepare data, choose evaluation protocol, beat a baseline, scale up to overfit, regularize and tune.
3. **Deploy the model** -- Set expectations with stakeholders, export and optimize the inference model, ship to the target environment, monitor performance, and maintain with retraining.

This workflow is a cycle, not a one-time process. Each deployed model generates data and insights that feed into the next iteration. Becoming an effective ML practitioner means internalizing this complete loop -- not just the modeling step in the middle.
`,
      reviewCardIds: ['rc-3.10-5'],
      illustrations: ['ml-lifecycle'],
      codeExamples: [
        {
          title: 'Logging experiments for reproducibility',
          language: 'python',
          code: `import json, datetime

experiment = {
    "timestamp": datetime.datetime.now().isoformat(),
    "model": "Dense(128) x 2 + Dropout(0.4)",
    "optimizer": "adam",
    "learning_rate": 0.001,
    "batch_size": 32,
    "epochs_trained": 25,
    "val_loss": 0.312,
    "val_accuracy": 0.874,
    "notes": "Added L2=1e-3, improved over baseline by 2%",
}
with open("experiments.jsonl", "a") as f:
    f.write(json.dumps(experiment) + "\\n")
print(f"Logged: val_acc={experiment['val_accuracy']}")`,
        },
        {
          title: 'Monitoring for distribution shift in production',
          language: 'python',
          code: `import numpy as np

# Compare input feature statistics: training vs production
train_mean = np.array([0.5, 3.2, -1.0])
train_std = np.array([1.0, 0.8, 2.0])

prod_batch = np.random.randn(100, 3) + [0.5, 3.5, -0.5]
prod_mean = prod_batch.mean(axis=0)
drift = np.abs(prod_mean - train_mean) / train_std
for i, d in enumerate(drift):
    flag = " ** DRIFT" if d > 1.0 else ""
    print(f"Feature {i}: shift = {d:.2f} std{flag}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Before deploying, set realistic expectations with stakeholders. Show failure modes and avoid abstract accuracy numbers.
- Export trained models as inference models (TensorFlow Serving, ONNX) optimized for the target environment: REST API, on-device, or in-browser.
- Apply weight pruning and quantization to reduce model size and improve inference speed.
- Monitor deployed models continuously: track business metrics, audit predictions, use A/B testing, and watch for distribution shift.
- No model lasts forever. Concept drift degrades performance over time. Plan for retraining from day one.
- The ML workflow is a cycle: define task, develop model, deploy, monitor, collect more data, and repeat.`,
};

export default lesson;
