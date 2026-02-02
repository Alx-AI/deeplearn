/**
 * Lesson 5.5: Object Detection -- Single-Stage vs. Two-Stage
 *
 * Covers: Object detection concepts, R-CNN vs YOLO, anchor boxes, NMS
 * Source sections: 12.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.5',
  title: 'Object Detection -- Single-Stage vs. Two-Stage',
  sections: [
    {
      id: '5.5.1',
      title: 'What Object Detection Does',
      content: `
**Object detection** combines localization and classification: it finds all objects in an image, draws a bounding box around each one, and assigns a class label. Unlike classification (one label per image) or segmentation (one label per pixel), detection produces a variable-length list of (box, class, confidence) tuples.

There are two main families of detectors:

**Two-stage detectors** (R-CNN family): Stage 1 generates hundreds of region proposals -- candidate bounding boxes that might contain objects. Stage 2 classifies each proposal and refines its coordinates. This is accurate but slow because two separate networks must run.

**Single-stage detectors** (YOLO, RetinaNet): predict bounding boxes and class labels in a single forward pass. The model divides the image into a grid and simultaneously predicts boxes for all grid cells. This is faster but historically slightly less accurate, though recent versions have largely closed the gap.

Both approaches use **anchor boxes**: predefined bounding boxes at various scales and aspect ratios placed across the image. The model predicts adjustments (offsets and scale factors) to the nearest anchor rather than predicting absolute coordinates from scratch. This makes learning easier since the model only needs to learn small refinements.
`,
      reviewCardIds: ['rc-5.5-1', 'rc-5.5-2', 'rc-5.5-3'],
      illustrations: ['yolo'],
      codeExamples: [
        {
          title: 'Running YOLOv8 inference on an image',
          language: 'python',
          code: `from ultralytics import YOLO

model = YOLO("yolov8n.pt")  # nano model, pretrained on COCO
results = model("street.jpg")

for box in results[0].boxes:
    cls = int(box.cls[0])
    conf = float(box.conf[0])
    x1, y1, x2, y2 = box.xyxy[0].tolist()
    print(f"{model.names[cls]}: {conf:.2f} at [{x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}]")`,
        },
        {
          title: 'Defining anchor boxes at multiple scales',
          language: 'python',
          code: `import numpy as np

# 9 anchor boxes: 3 scales x 3 aspect ratios
scales = [32, 64, 128]
ratios = [0.5, 1.0, 2.0]
anchors = []
for s in scales:
    for r in ratios:
        w = s * np.sqrt(r)
        h = s / np.sqrt(r)
        anchors.append((w, h))
print("Anchors (w, h):", anchors)`,
        },
      ],
    },
    {
      id: '5.5.2',
      title: 'Post-Processing with Non-Maximum Suppression',
      content: `
A detector often produces multiple overlapping predictions for the same object -- several boxes, all slightly shifted, all claiming to contain a car. **Non-maximum suppression (NMS)** cleans this up.

For each class, NMS works as follows:
1. Sort all predicted boxes by confidence score
2. Keep the highest-confidence box
3. Remove any remaining box that overlaps significantly with the kept box (measured by IoU -- Intersection over Union)
4. Repeat with the next highest-confidence remaining box

The IoU threshold (typically 0.5) controls how much overlap is tolerated. After NMS, each detected object has exactly one bounding box.

When choosing between detector families:
- Use **single-stage** (YOLO) when speed matters: real-time video, autonomous driving, interactive applications
- Use **two-stage** (R-CNN variants) when maximum accuracy matters and inference time is less critical

In practice, modern single-stage detectors like YOLOv8 are fast enough for real-time use while being accurate enough for most applications, making them the default choice for many practitioners.
`,
      reviewCardIds: ['rc-5.5-4', 'rc-5.5-5'],
      illustrations: ['non-max-suppression'],
      codeExamples: [
        {
          title: 'Computing Intersection over Union (IoU)',
          language: 'python',
          code: `def compute_iou(box_a, box_b):
    """Each box is [x1, y1, x2, y2]."""
    x1 = max(box_a[0], box_b[0])
    y1 = max(box_a[1], box_b[1])
    x2 = min(box_a[2], box_b[2])
    y2 = min(box_a[3], box_b[3])
    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area_a = (box_a[2] - box_a[0]) * (box_a[3] - box_a[1])
    area_b = (box_b[2] - box_b[0]) * (box_b[3] - box_b[1])
    union = area_a + area_b - intersection
    return intersection / union if union > 0 else 0.0`,
        },
        {
          title: 'Non-maximum suppression from scratch',
          language: 'python',
          code: `def nms(boxes, scores, iou_threshold=0.5):
    """boxes: list of [x1,y1,x2,y2], scores: list of floats."""
    order = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    keep = []
    while order:
        best = order.pop(0)
        keep.append(best)
        order = [
            i for i in order
            if compute_iou(boxes[best], boxes[i]) < iou_threshold
        ]
    return keep`,
        },
        {
          title: 'Using TensorFlow built-in NMS',
          language: 'python',
          code: `import tensorflow as tf

selected = tf.image.non_max_suppression(
    boxes=all_boxes,        # shape (N, 4)
    scores=all_scores,      # shape (N,)
    max_output_size=100,
    iou_threshold=0.5,
    score_threshold=0.3,
)
final_boxes = tf.gather(all_boxes, selected)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Object detection predicts bounding boxes AND class labels for all objects in an image.
- Two-stage detectors (R-CNN) are accurate but slower; single-stage detectors (YOLO) are faster.
- Anchor boxes provide predefined reference boxes that the model refines with learned offsets.
- Non-maximum suppression removes duplicate overlapping detections, keeping the highest-confidence box per object.
- Modern single-stage detectors offer a strong balance of speed and accuracy for most applications.`,
};

export default lesson;
