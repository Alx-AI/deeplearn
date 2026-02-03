/**
 * Lesson 5.6: Training a YOLO Model
 *
 * Covers: YOLO grid-based detection, multi-component loss, pretrained detectors
 * Source sections: 12.2, 12.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.6',
  title: 'Training a YOLO Model',
  sections: [
    {
      id: '5.6.1',
      title: 'How YOLO Works',
      content: `
**YOLO** (You Only Look Once) divides the input image into an $S \\times S$ grid (e.g., $13 \\times 13$). Each grid cell is responsible for predicting bounding boxes for objects whose center falls within that cell. This distributes detection responsibility spatially and allows all predictions to happen in a single forward pass.

Each grid cell predicts several values:
- **Bounding box coordinates**: offsets from the cell position plus width and height
- **Objectness score**: the confidence that this box contains an object (vs. background)
- **Class probabilities**: which category the detected object belongs to

The **YOLO loss function** combines three components:
1. **Box regression loss**: how well the predicted box matches the ground truth (position, width, height)
2. **Objectness loss**: whether boxes correctly predict the presence or absence of objects
3. **Classification loss**: whether detected objects are assigned the correct class

\`\`\`python
total_loss = box_loss + objectness_loss + classification_loss
\`\`\`

This multi-component loss means the model learns to localize, detect, and classify simultaneously. The balance between components affects behavior -- weighting box loss higher produces more precise localization; weighting classification loss higher improves class accuracy.
`,
      reviewCardIds: ['rc-5.6-1', 'rc-5.6-2'],
      illustrations: ['yolo'],
      codeExamples: [
        {
          title: 'How YOLO encodes predictions per grid cell',
          language: 'python',
          code: `import numpy as np

S = 13  # grid size
B = 3   # boxes per cell
C = 80  # COCO class count
# Each cell predicts B * (5 + C) values:
#   5 = [x_offset, y_offset, width, height, objectness]
output_shape = (S, S, B * (5 + C))
print(f"YOLO output tensor: {output_shape}")
# (13, 13, 255) for YOLOv3 with 80 classes`,
        },
        {
          title: 'Multi-component YOLO loss (simplified)',
          language: 'python',
          code: `import tensorflow as tf

def yolo_loss(y_true, y_pred, lambda_coord=5.0, lambda_noobj=0.5):
    box_loss = tf.reduce_mean(tf.square(y_true[..., :4] - y_pred[..., :4]))
    obj_loss = tf.reduce_mean(
        tf.keras.losses.binary_crossentropy(
            y_true[..., 4:5], y_pred[..., 4:5])
    )
    cls_loss = tf.reduce_mean(
        tf.keras.losses.categorical_crossentropy(
            y_true[..., 5:], y_pred[..., 5:])
    )
    return lambda_coord * box_loss + obj_loss + cls_loss`,
        },
      ],
    },
    {
      id: '5.6.2',
      title: 'Using Pretrained Detectors',
      content: `
Training a detector from scratch requires large datasets with bounding box annotations -- far more expensive to create than classification labels. The **COCO dataset** (Common Objects in Context) is the standard benchmark with 80 object categories and hundreds of thousands of annotated images.

For most practical applications, you should start with a **pretrained detector** rather than training from scratch:

\`\`\`python
# Example: using a pretrained model for inference
model = load_pretrained_yolo("yolov8n")
results = model.predict(image)
for box in results:
    print(f"Class: {box.class_name}, Confidence: {box.confidence:.2f}")
\`\`\`

The inference pipeline runs in three steps:
1. **Preprocessing**: resize and normalize the image
2. **Forward pass**: run the model to get raw predictions
3. **Post-processing**: apply NMS to remove duplicates, filter by confidence threshold

If you need to detect objects not in COCO's 80 categories (e.g., specific manufactured parts, rare animal species), you can **fine-tune** a pretrained detector on your custom annotated data. This requires far fewer annotations than training from scratch because the pretrained model already understands general visual features and detection concepts.

Object detection is the foundation for many real-world applications: autonomous driving (detect vehicles, pedestrians), retail (checkout systems), medical imaging (detect lesions), and manufacturing (quality inspection).
`,
      reviewCardIds: ['rc-5.6-3', 'rc-5.6-4'],
      illustrations: ['non-max-suppression'],
      codeExamples: [
        {
          title: 'Running a pretrained YOLOv8 detector end-to-end',
          language: 'python',
          code: `from ultralytics import YOLO

model = YOLO("yolov8n.pt")
results = model.predict("city.jpg", conf=0.25, iou=0.45)

# Results include boxes after NMS, ready to use
for box in results[0].boxes:
    name = model.names[int(box.cls[0])]
    conf = float(box.conf[0])
    print(f"{name}: {conf:.2f}")`,
        },
        {
          title: 'Fine-tuning YOLOv8 on a custom dataset',
          language: 'python',
          code: `from ultralytics import YOLO

model = YOLO("yolov8n.pt")  # start from pretrained weights
model.train(
    data="custom_data.yaml",  # paths + class names
    epochs=50,
    imgsz=640,
    batch=16,
)
# custom_data.yaml specifies train/val image dirs
# and a list of your custom class names`,
        },
        {
          title: 'Full inference pipeline: preprocess, predict, postprocess',
          language: 'python',
          code: `import numpy as np
from PIL import Image

img = Image.open("photo.jpg").resize((640, 640))
img_array = np.array(img, dtype=np.float32) / 255.0
img_batch = np.expand_dims(img_array, axis=0)

# Forward pass returns raw predictions
raw = model(img_batch)
# Post-process: filter by confidence, then apply NMS
results = model.predict("photo.jpg", conf=0.3, iou=0.5)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- YOLO divides images into a grid where each cell predicts boxes for objects whose center falls in that cell.
- The YOLO loss combines box regression, objectness, and classification components.
- COCO is the standard object detection benchmark with 80 categories.
- Pretrained detectors are the practical starting point; fine-tune for custom categories.
- The inference pipeline: preprocess, forward pass, post-process (NMS + confidence filtering).`,
};

export default lesson;
