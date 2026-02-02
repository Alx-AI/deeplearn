/**
 * Lesson 4.3: Callbacks and TensorBoard
 *
 * Covers: ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard, custom callbacks
 * Source sections: 7.3.1, 7.3.2, 7.3.3, 7.3.4
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.3',
  title: 'Callbacks and TensorBoard',
  sections: [
    {
      id: '4.3.1',
      title: 'Automating Training with Callbacks',
      illustrations: ['callbacks'],
      content: `
When you call \`model.fit()\`, you hand control to Keras for the entire training loop. But what if you want to save the best model, stop early when overfitting begins, or adjust the learning rate on the fly? That is where **callbacks** come in.

A callback is an object that can perform actions at various points during training: at the start or end of each epoch, at the start or end of each batch, or when training begins or finishes. Keras provides several built-in callbacks that handle the most common needs:

**ModelCheckpoint** saves the model after each epoch. With \`save_best_only=True\`, it only saves when the monitored metric improves:

\`\`\`python
callbacks = [
    keras.callbacks.ModelCheckpoint(
        filepath="best_model.keras",
        monitor="val_loss",
        save_best_only=True
    )
]
model.fit(x, y, epochs=100, callbacks=callbacks)
\`\`\`

**EarlyStopping** halts training when a metric stops improving. The \`patience\` parameter lets you tolerate a few epochs without improvement before stopping:

\`\`\`python
keras.callbacks.EarlyStopping(
    monitor="val_loss", patience=5
)
\`\`\`

**ReduceLROnPlateau** reduces the learning rate when progress stalls. If validation loss has not improved for \`patience\` epochs, the learning rate is multiplied by \`factor\`:

\`\`\`python
keras.callbacks.ReduceLROnPlateau(
    monitor="val_loss", factor=0.1, patience=3
)
\`\`\`

These three callbacks are used together in virtually every serious training run. They automate the manual process of watching training curves and making adjustments.
`,
      reviewCardIds: ['rc-4.3-1', 'rc-4.3-2', 'rc-4.3-3'],
      codeExamples: [
        {
          title: 'Combining common callbacks in a training run',
          language: 'python',
          code: `import keras

callbacks = [
    keras.callbacks.EarlyStopping(
        monitor="val_loss", patience=5, restore_best_weights=True
    ),
    keras.callbacks.ModelCheckpoint(
        filepath="best_model.keras",
        monitor="val_loss",
        save_best_only=True,
    ),
    keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss", factor=0.2, patience=3
    ),
]
history = model.fit(
    x_train, y_train,
    epochs=100, validation_split=0.2,
    callbacks=callbacks,
)`,
        },
      ],
    },
    {
      id: '4.3.2',
      title: 'TensorBoard and Custom Callbacks',
      content: `
**TensorBoard** is a browser-based visualization tool that lets you monitor training in real time. The TensorBoard callback logs metrics, learning rate schedules, weight histograms, and more:

\`\`\`python
keras.callbacks.TensorBoard(log_dir="./logs")
\`\`\`

After training starts, run \`tensorboard --logdir=./logs\` in a terminal and open the provided URL. You will see live plots of training and validation loss, accuracy curves, and other diagnostics. This is far more informative than watching numbers scroll by in a terminal.

For specialized behavior, you can write **custom callbacks** by subclassing \`keras.callbacks.Callback\` and overriding event methods like \`on_epoch_end\`, \`on_batch_end\`, or \`on_train_begin\`:

\`\`\`python
class PrintLR(keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        lr = self.model.optimizer.learning_rate
        print(f"Epoch {epoch}: lr = {lr:.6f}")
\`\`\`

Custom callbacks give you full control. Common uses include logging custom metrics (F1 score, precision), sending notifications when training finishes, generating sample predictions at each epoch for visual inspection, or implementing learning rate schedules that are not covered by the built-in callbacks.

The callback system is what makes \`model.fit()\` surprisingly extensible. You get the convenience of a managed training loop with the ability to inject custom behavior at every step.
`,
      reviewCardIds: ['rc-4.3-4', 'rc-4.3-5'],
      codeExamples: [
        {
          title: 'Launching TensorBoard with the callback',
          language: 'python',
          code: `import keras

callbacks = [
    keras.callbacks.TensorBoard(
        log_dir="./logs",
        histogram_freq=1,   # Log weight histograms every epoch
    )
]
model.fit(x_train, y_train, epochs=20, callbacks=callbacks)
# Then run in terminal: tensorboard --logdir=./logs`,
        },
        {
          title: 'Custom callback that logs per-epoch predictions',
          language: 'python',
          code: `import numpy as np

class SamplePredictions(keras.callbacks.Callback):
    def __init__(self, sample_data):
        super().__init__()
        self.sample_data = sample_data

    def on_epoch_end(self, epoch, logs=None):
        preds = self.model.predict(self.sample_data, verbose=0)
        print(f"Epoch {epoch} sample preds: {preds[0][:3]}")

# Usage: callbacks=[SamplePredictions(x_val[:5])]`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Callbacks perform automated actions during training: saving models, stopping early, adjusting learning rates.
- ModelCheckpoint saves the best model based on a monitored metric; EarlyStopping halts training when overfitting begins; ReduceLROnPlateau lowers the learning rate when progress stalls.
- TensorBoard provides real-time browser-based visualization of training metrics and model internals.
- Custom callbacks let you inject any behavior at any point during training by subclassing keras.callbacks.Callback.`,
};

export default lesson;
