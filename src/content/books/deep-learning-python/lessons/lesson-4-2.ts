/**
 * Lesson 4.2: Subclassing and Mixing Approaches
 *
 * Covers: Model subclassing, tradeoffs, mixing APIs
 * Source sections: 7.2.3, 7.2.4, 7.2.5
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.2',
  title: 'Subclassing and Mixing Approaches',
  sections: [
    {
      id: '4.2.1',
      title: 'Model Subclassing: Maximum Flexibility',
      illustrations: ['keras-apis'],
      content: `
When the Functional API cannot express what you need -- for example, models with dynamic control flow, recursive structures, or conditional branching in the forward pass -- you can fall back to **model subclassing**.

Subclassing means inheriting from \`keras.Model\` and implementing two methods:

\`\`\`python
class MyModel(keras.Model):
    def __init__(self):
        super().__init__()
        self.dense1 = layers.Dense(64, activation="relu")
        self.dense2 = layers.Dense(10, activation="softmax")

    def call(self, inputs):
        x = self.dense1(inputs)
        return self.dense2(x)
\`\`\`

In \`__init__\`, you create and store all layers. In \`call\`, you define the forward pass -- how data flows through those layers. Because \`call\` is plain Python, you can use if/else branches, loops, and any other control flow. This is the same approach used by PyTorch, so if you are coming from that ecosystem, subclassing will feel familiar.

The key tradeoff is **flexibility vs. inspectability**. Subclassed models define their forward pass as arbitrary Python code, which Keras cannot statically analyze. This means you lose access to \`model.summary()\` (until the model has been called on data), graph visualization, and easy serialization. The model is essentially a black box of code rather than a declarable graph.
`,
      reviewCardIds: ['rc-4.2-1', 'rc-4.2-2'],
      codeExamples: [
        {
          title: 'Subclassed model with conditional forward pass',
          language: 'python',
          code: `import keras
from keras import layers

class ConditionalModel(keras.Model):
    def __init__(self):
        super().__init__()
        self.dense1 = layers.Dense(64, activation="relu")
        self.dense2 = layers.Dense(64, activation="relu")
        self.classifier = layers.Dense(10, activation="softmax")

    def call(self, inputs, use_branch_b=False):
        if use_branch_b:
            x = self.dense2(inputs)
        else:
            x = self.dense1(inputs)
        return self.classifier(x)`,
        },
        {
          title: 'Inspecting a subclassed model after first call',
          language: 'python',
          code: `import numpy as np

model = ConditionalModel()
# model.summary()  # Would fail -- no graph yet
dummy_input = np.random.random((1, 784))
_ = model(dummy_input)            # Build the model
model.summary()                   # Now works`,
        },
      ],
    },
    {
      id: '4.2.2',
      title: 'Mixing APIs and Choosing the Right Tool',
      content: `
The good news is that you do not have to commit to a single API. Keras lets you freely mix Sequential, Functional, and subclassed components. A common pattern is to use the Functional API for the overall model structure while using subclassed layers for individual custom components.

For example, you might create a custom attention layer via subclassing and then plug it into a Functional model:

\`\`\`python
class CustomAttention(keras.Layer):
    def __init__(self, units):
        super().__init__()
        self.query_dense = layers.Dense(units)
        self.key_dense = layers.Dense(units)

    def call(self, query, key, value):
        scores = keras.ops.matmul(
            self.query_dense(query),
            keras.ops.transpose(self.key_dense(key))
        )
        weights = keras.ops.softmax(scores)
        return keras.ops.matmul(weights, value)

# Use inside a Functional model
inputs = keras.Input(shape=(None, 128))
attention_output = CustomAttention(64)(inputs, inputs, inputs)
\`\`\`

The practical rule of thumb: **use the simplest API that meets your requirements**. Sequential handles simple stacks. The Functional API covers the vast majority of production models. Reserve subclassing for genuinely novel architectures or research prototypes where Python control flow in the forward pass is essential.

When you encounter a model in the wild, you will most often find the Functional API. It hits the sweet spot of power and usability, which is why it is the default recommendation throughout the Keras ecosystem.
`,
      reviewCardIds: ['rc-4.2-3', 'rc-4.2-4'],
      codeExamples: [
        {
          title: 'Custom layer used inside a Functional model',
          language: 'python',
          code: `class ScaledDense(keras.Layer):
    def __init__(self, units, scale=1.0):
        super().__init__()
        self.dense = layers.Dense(units, activation="relu")
        self.scale = scale

    def call(self, inputs):
        return self.dense(inputs) * self.scale

# Plug into a Functional model
inputs = keras.Input(shape=(128,))
x = ScaledDense(64, scale=0.5)(inputs)
outputs = layers.Dense(10, activation="softmax")(x)
model = keras.Model(inputs, outputs)`,
        },
        {
          title: 'Choosing the right API -- quick reference',
          language: 'python',
          code: `# Sequential: simple stack
seq = keras.Sequential([layers.Dense(64), layers.Dense(10)])

# Functional: multi-input, shared layers, inspectable
inp = keras.Input(shape=(32,))
out = layers.Dense(10)(inp)
func = keras.Model(inp, out)

# Subclassing: dynamic control flow
class MyModel(keras.Model):
    def call(self, x):
        return self.dense(x)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Model subclassing gives maximum flexibility by letting you write arbitrary Python in the call() method.
- Subclassed models sacrifice inspectability: no model.summary() or graph visualization until data has passed through.
- You can mix APIs freely: use subclassed layers inside Functional models, or Functional models inside subclassed ones.
- Rule of thumb: use the simplest API that meets your needs -- Sequential, then Functional, then Subclassing.`,
};

export default lesson;
