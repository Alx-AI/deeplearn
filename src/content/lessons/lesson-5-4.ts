/**
 * Lesson 5.4: Segment Anything Model (SAM)
 *
 * Covers: SAM as a foundation model, prompt types, zero-shot segmentation
 * Source sections: 11.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '5.4',
  title: 'Segment Anything Model (SAM)',
  sections: [
    {
      id: '5.4.1',
      title: 'SAM: A Foundation Model for Segmentation',
      content: `
Traditional segmentation models are trained for specific categories: roads, buildings, tumors. The **Segment Anything Model (SAM)** is different -- it is a **foundation model** for segmentation, trained on over 1 billion masks from 11 million images, capable of segmenting virtually any object without task-specific training.

Just as GPT can answer questions about topics it was never specifically trained on, SAM can segment objects it has never seen during training. This is called **zero-shot transfer**: the model generalizes to new segmentation tasks without any retraining or fine-tuning.

SAM works through **prompting**. Instead of specifying what categories to segment ahead of time, you give the model a prompt at inference time indicating what you want segmented:

- **Point prompt**: click a single (x, y) coordinate on the target object
- **Box prompt**: draw a bounding rectangle around the target
- **Text prompt**: describe the object in natural language

The model's architecture has three parts: a powerful image encoder (a Vision Transformer that computes image features once), a prompt encoder (that converts your click/box/text into an embedding), and a lightweight mask decoder (that combines both to produce the segmentation mask).
`,
      reviewCardIds: ['rc-5.4-1', 'rc-5.4-2'],
      illustrations: ['encoder-decoder'],
      codeExamples: [
        {
          title: 'Loading SAM and generating a mask from a point prompt',
          language: 'python',
          code: `from segment_anything import sam_model_registry, SamPredictor

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
predictor = SamPredictor(sam)
predictor.set_image(image)

# Point prompt: (x, y) on the target object
masks, scores, _ = predictor.predict(
    point_coords=np.array([[500, 375]]),
    point_labels=np.array([1]),  # 1 = foreground
)
best_mask = masks[np.argmax(scores)]`,
        },
        {
          title: 'Using a bounding box prompt for more precise segmentation',
          language: 'python',
          code: `# Box prompt: [x_min, y_min, x_max, y_max]
input_box = np.array([100, 100, 600, 500])
masks, scores, _ = predictor.predict(
    box=input_box,
    multimask_output=False,
)`,
        },
      ],
    },
    {
      id: '5.4.2',
      title: 'Practical Implications of Promptable Segmentation',
      content: `
SAM represents a paradigm shift in computer vision. Instead of training a separate segmentation model for every new task (surgical instruments, manufacturing defects, wildlife tracking), you can use a single model and simply prompt it for what you need.

A box prompt is more precise than a point prompt because it constrains which object to segment. A point on a dog could be ambiguous -- does the user mean the dog, the collar, or the leash? A box around the dog disambiguates. SAM can also handle ambiguity by returning multiple candidate masks ranked by confidence.

The foundation model concept unifies several themes from this curriculum: self-supervised pretraining on massive data, transfer learning to new tasks, and prompting instead of fine-tuning. SAM is to image segmentation what GPT is to text: a general-purpose model that adapts to specific needs through prompting rather than retraining.

For practitioners, SAM changes the economics of segmentation. Instead of spending weeks collecting and labeling segmentation masks for your specific domain, you can use SAM directly or as a starting point for generating training data for more specialized models. This makes segmentation accessible for applications where labeled data was previously the bottleneck.
`,
      reviewCardIds: ['rc-5.4-3', 'rc-5.4-4'],
      illustrations: ['segmentation-types'],
      codeExamples: [
        {
          title: 'Automatic mask generation for an entire image',
          language: 'python',
          code: `from segment_anything import SamAutomaticMaskGenerator

mask_generator = SamAutomaticMaskGenerator(sam)
masks = mask_generator.generate(image)
# Returns a list of dicts: each has "segmentation", "area", "bbox", etc.
print(f"Found {len(masks)} segments")
for m in sorted(masks, key=lambda x: x["area"], reverse=True)[:5]:
    print(f"  area={m['area']}, bbox={m['bbox']}")`,
        },
        {
          title: 'Visualizing SAM masks on an image',
          language: 'python',
          code: `import matplotlib.pyplot as plt
import numpy as np

def show_mask(mask, ax, color=(0.2, 0.6, 0.9, 0.5)):
    h, w = mask.shape
    overlay = np.zeros((h, w, 4))
    overlay[mask] = color
    ax.imshow(overlay)

fig, ax = plt.subplots(figsize=(10, 8))
ax.imshow(image)
for mask_data in masks[:10]:
    show_mask(mask_data["segmentation"], ax)
plt.axis("off")
plt.show()`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- SAM is a foundation model for segmentation, trained on 1B+ masks, capable of segmenting any object zero-shot.
- It works through prompting: point clicks, bounding boxes, or text descriptions indicate what to segment.
- SAM's architecture consists of an image encoder, prompt encoder, and mask decoder.
- Box prompts provide more spatial information than point prompts and reduce ambiguity.
- SAM shifts segmentation from task-specific training to general-purpose prompting, dramatically reducing the need for labeled data.`,
};

export default lesson;
