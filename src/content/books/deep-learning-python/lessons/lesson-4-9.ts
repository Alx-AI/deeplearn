/**
 * Lesson 4.9: Transfer Learning -- Fine-Tuning
 *
 * Covers: Fine-tuning procedure, two-phase training, low learning rate
 * Source sections: 8.3.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.9',
  title: 'Transfer Learning -- Fine-Tuning',
  sections: [
    {
      id: '4.9.1',
      title: 'From Feature Extraction to Fine-Tuning',
      illustrations: ['fine-tuning'],
      content: `
Feature extraction (freezing the entire convolutional base) gets you a long way. But you can squeeze out additional accuracy by **fine-tuning**: unfreezing some of the top layers of the pretrained base and training them alongside the classifier.

The key insight is that later layers in the base learn features specific to the original task (ImageNet). By unfreezing them, you let these layers adapt to your specific task -- learning to distinguish cat fur from dog fur rather than just detecting fur in general.

Fine-tuning follows a strict **two-phase procedure**:

1. **Phase 1**: Train only the classifier head with the entire base frozen (feature extraction). This gives the classifier sensible weights.
2. **Phase 2**: Unfreeze the top layers of the base and retrain the entire model with a very low learning rate.

\`\`\`python
# Phase 1: Train classifier (already done)
# Phase 2: Unfreeze top layers
conv_base.trainable = True
for layer in conv_base.layers[:-4]:
    layer.trainable = False   # Keep early layers frozen

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-5),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)
model.fit(train_dataset, epochs=10, validation_data=val_dataset)
\`\`\`

The order matters critically. If you unfreeze the base from the very start, the randomly initialized classifier head would produce random gradients that would destroy the carefully learned pretrained representations. Phase 1 ensures the classifier head produces meaningful gradients before they propagate into the pretrained weights.
`,
      reviewCardIds: ['rc-4.9-1', 'rc-4.9-2', 'rc-4.9-3'],
      codeExamples: [
        {
          title: 'Phase 1: Train only the classifier head',
          language: 'python',
          code: `conv_base.trainable = False  # Freeze all pretrained layers
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"],
)
model.fit(train_dataset, epochs=10,
          validation_data=val_dataset)`,
        },
        {
          title: 'Phase 2: Unfreeze top layers and fine-tune',
          language: 'python',
          code: `conv_base.trainable = True
for layer in conv_base.layers[:-4]:
    layer.trainable = False  # Keep early layers frozen

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-5),
    loss="binary_crossentropy",
    metrics=["accuracy"],
)
model.fit(train_dataset, epochs=10,
          validation_data=val_dataset)`,
        },
      ],
    },
    {
      id: '4.9.2',
      title: 'Why a Low Learning Rate Is Essential',
      content: `
During fine-tuning, you must use a learning rate **much lower** than initial training -- typically $10^{-5}$ instead of $10^{-3}$. The pretrained weights are already good; they just need small, careful adjustments to adapt to the new task. A large learning rate would make dramatic changes that could undo the valuable knowledge stored in those weights.

Think of it like tuning a piano that is already mostly in tune. You make tiny, precise adjustments. If you cranked the tuning pegs aggressively, you would make the piano worse, not better.

**Which layers to unfreeze**: typically only the last few convolutional blocks. Early layers learn generic features (edges, textures) that are useful as-is for any image task. Later layers are more task-specific and benefit from adaptation. Unfreezing everything risks overfitting, especially with limited training data.

In practice, fine-tuning typically improves accuracy by several percentage points over feature extraction alone. The combination of pretrained features plus task-specific adaptation is extremely powerful:

- Feature extraction alone: $\\sim 90\\%$ accuracy
- Feature extraction + fine-tuning: $\\sim 95\\%$ accuracy

This is a common pattern in industry: start with feature extraction to get a baseline, then fine-tune to push performance higher. Many production image classifiers are built this way, even at large companies, because it is both effective and computationally efficient.
`,
      reviewCardIds: ['rc-4.9-4', 'rc-4.9-5'],
      codeExamples: [
        {
          title: 'Check which layers are trainable after unfreezing',
          language: 'python',
          code: `for layer in conv_base.layers[-6:]:
    print(f"{layer.name:30s} trainable={layer.trainable}")
# Last 4 layers: trainable=True
# Earlier layers: trainable=False`,
        },
        {
          title: 'Use a learning rate schedule for fine-tuning',
          language: 'python',
          code: `lr_schedule = keras.optimizers.schedules.ExponentialDecay(
    initial_learning_rate=1e-5,
    decay_steps=1000,
    decay_rate=0.9,
)
optimizer = keras.optimizers.Adam(learning_rate=lr_schedule)
model.compile(optimizer=optimizer,
              loss="binary_crossentropy",
              metrics=["accuracy"])`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Fine-tuning unfreezes some top layers of the pretrained base and retrains them alongside the classifier.
- Always follow the two-phase procedure: train the classifier head first (frozen base), then unfreeze top layers and retrain.
- Use a very low learning rate (e.g., $10^{-5}$) to make careful adjustments without destroying pretrained representations.
- Keep early layers frozen -- they learn generic features that don't need adaptation.
- Fine-tuning typically improves accuracy several percentage points beyond feature extraction alone.`,
};

export default lesson;
