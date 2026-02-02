/**
 * Lesson 4.4: Custom Training Loops
 *
 * Covers: When to use custom loops, training vs inference mode, overriding train_step
 * Source sections: 7.4.1, 7.4.2, 7.4.3, 7.4.4, 7.4.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.4',
  title: 'Custom Training Loops',
  sections: [
    {
      id: '4.4.1',
      title: 'Beyond model.fit()',
      illustrations: ['training-loop'],
      content: `
The built-in \`model.fit()\` handles the vast majority of training scenarios. But some tasks require non-standard training procedures: GANs train two models alternately, reinforcement learning uses reward signals instead of labeled data, and some research techniques require custom gradient manipulation. For these cases, you need a **custom training loop**.

In a custom loop, you write the training step yourself: fetch a batch, compute the forward pass, calculate the loss, obtain gradients, and update weights. In TensorFlow, the forward pass is wrapped in a \`GradientTape\` context so gradients can be computed:

\`\`\`python
for batch in dataset:
    with tf.GradientTape() as tape:
        predictions = model(batch["inputs"], training=True)
        loss = loss_fn(batch["targets"], predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply(gradients, model.trainable_variables)
\`\`\`

One critical detail is the **training vs. inference mode** flag. Layers like Dropout and BatchNormalization behave differently during training (Dropout zeroes random units, BatchNorm uses batch statistics) versus inference (Dropout is off, BatchNorm uses running averages). You signal which mode to use by passing \`training=True\` or \`training=False\` when calling the model. The built-in \`fit()\` and \`predict()\` handle this automatically, but in a custom loop you must manage it yourself.
`,
      reviewCardIds: ['rc-4.4-1', 'rc-4.4-2'],
      codeExamples: [
        {
          title: 'Complete custom training loop with metrics',
          language: 'python',
          code: `import tensorflow as tf
import keras

model = keras.Sequential([keras.Input(shape=(784,)),
    keras.layers.Dense(128, activation="relu"),
    keras.layers.Dense(10, activation="softmax")])
optimizer = keras.optimizers.Adam()
loss_fn = keras.losses.SparseCategoricalCrossentropy()

for epoch in range(10):
    for x_batch, y_batch in train_dataset:
        with tf.GradientTape() as tape:
            preds = model(x_batch, training=True)
            loss = loss_fn(y_batch, preds)
        grads = tape.gradient(loss, model.trainable_variables)
        optimizer.apply(grads, model.trainable_variables)
    print(f"Epoch {epoch}: loss = {loss:.4f}")`,
        },
        {
          title: 'Training vs inference mode matters for Dropout',
          language: 'python',
          code: `model = keras.Sequential([
    keras.Input(shape=(784,)),
    keras.layers.Dense(256, activation="relu"),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(10, activation="softmax"),
])

# During training: Dropout is active
train_out = model(x_batch, training=True)

# During inference: Dropout is disabled
eval_out = model(x_batch, training=False)`,
        },
      ],
    },
    {
      id: '4.4.2',
      title: 'Overriding train_step for the Best of Both Worlds',
      content: `
Writing a full custom loop means giving up callbacks, progress bars, epoch management, and built-in validation. That is a lot of infrastructure to reimplement. A middle ground is to **override train_step()** in a Model subclass.

When you override \`train_step\`, you customize only what happens inside each training step. The outer loop -- epoch iteration, callbacks, validation, progress display -- is still handled by \`fit()\`:

\`\`\`python
class CustomModel(keras.Model):
    def train_step(self, data):
        x, y = data
        with tf.GradientTape() as tape:
            y_pred = self(x, training=True)
            loss = self.compute_loss(y=y, y_pred=y_pred)
        gradients = tape.gradient(loss, self.trainable_variables)
        self.optimizer.apply(gradients, self.trainable_variables)
        # Update and return metrics
        for metric in self.metrics:
            if metric.name == "loss":
                metric.update_state(loss)
            else:
                metric.update_state(y, y_pred)
        return {m.name: m.result() for m in self.metrics}
\`\`\`

You can then call \`model.fit()\` as usual and still use EarlyStopping, ModelCheckpoint, and TensorBoard. This approach is ideal for situations where the gradient computation or loss calculation is non-standard but everything else about the training loop is conventional.

Choose the approach that matches your needs: \`fit()\` for standard training, \`train_step\` override for custom gradients with standard infrastructure, and a full custom loop only when the entire training paradigm is non-standard.
`,
      reviewCardIds: ['rc-4.4-3', 'rc-4.4-4'],
      codeExamples: [
        {
          title: 'Overriding train_step for custom loss computation',
          language: 'python',
          code: `import tensorflow as tf
import keras

class CustomModel(keras.Model):
    def train_step(self, data):
        x, y = data
        with tf.GradientTape() as tape:
            y_pred = self(x, training=True)
            loss = self.compute_loss(y=y, y_pred=y_pred)
        grads = tape.gradient(loss, self.trainable_variables)
        self.optimizer.apply(grads, self.trainable_variables)
        for metric in self.metrics:
            if metric.name == "loss":
                metric.update_state(loss)
            else:
                metric.update_state(y, y_pred)
        return {m.name: m.result() for m in self.metrics}`,
        },
        {
          title: 'Using the custom model with standard fit() and callbacks',
          language: 'python',
          code: `inputs = keras.Input(shape=(784,))
x = keras.layers.Dense(128, activation="relu")(inputs)
outputs = keras.layers.Dense(10, activation="softmax")(x)
model = CustomModel(inputs=inputs, outputs=outputs)

model.compile(optimizer="adam",
              loss="sparse_categorical_crossentropy",
              metrics=["accuracy"])
# Still works with callbacks!
model.fit(x_train, y_train, epochs=10,
          callbacks=[keras.callbacks.EarlyStopping(patience=3)])`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Custom training loops give you full control over the gradient computation and weight update process.
- Dropout and BatchNormalization behave differently during training vs. inference -- you must pass the correct training flag.
- Overriding train_step() lets you customize the inner training logic while keeping fit()'s callbacks, progress bars, and validation.
- Use fit() for standard training, train_step override for custom gradients, and full custom loops only for fundamentally different training paradigms like GANs.`,
};

export default lesson;
