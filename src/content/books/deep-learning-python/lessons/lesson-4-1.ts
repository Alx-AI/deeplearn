/**
 * Lesson 4.1: Keras Model-Building APIs -- Sequential and Functional
 *
 * Covers: Sequential model, Functional API, multi-input/output models
 * Source sections: 7.1, 7.2.1, 7.2.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '4.1',
  title: 'Keras Model-Building APIs -- Sequential and Functional',
  sections: [
    {
      id: '4.1.1',
      title: 'The Spectrum of Keras Workflows',
      illustrations: ['keras-apis'],
      content: `
Keras is designed around the principle of **progressive disclosure of complexity**. Simple tasks should be easy, and advanced workflows should be possible without switching frameworks. This means there is no single "correct" way to use Keras -- instead, there is a spectrum from simple to flexible.

At the simplest end sits the **Sequential model**. You already know it: it is a linear stack of layers, much like a Python list. You create one, add layers in order, and the data flows straight through from input to output. It is perfect for models that have one input tensor and one output tensor, with each layer feeding into the next.

\`\`\`python
import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(64, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
\`\`\`

Sequential models can also be built incrementally with \`add()\`. A useful trick is to declare the input shape upfront using \`keras.Input\`, which lets you call \`model.summary()\` at any point to inspect the output shapes as you assemble the architecture.

\`\`\`python
model = keras.Sequential()
model.add(keras.Input(shape=(3,)))
model.add(layers.Dense(64, activation="relu"))
model.summary()  # Now available immediately
\`\`\`

However, the Sequential model has a hard limit: it cannot express models with multiple inputs, multiple outputs, or non-linear topologies like skip connections. For anything beyond a straight pipeline, you need the Functional API.
`,
      reviewCardIds: ['rc-4.1-1', 'rc-4.1-2'],
      codeExamples: [
        {
          title: 'Building a Sequential model with an explicit Input',
          language: 'python',
          code: `import keras
from keras import layers

model = keras.Sequential([
    keras.Input(shape=(784,)),
    layers.Dense(256, activation="relu"),
    layers.Dense(128, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
model.summary()  # Works immediately thanks to Input`,
        },
        {
          title: 'Incrementally building a Sequential model with add()',
          language: 'python',
          code: `model = keras.Sequential(name="my_model")
model.add(keras.Input(shape=(28, 28, 1)))
model.add(layers.Flatten())
model.add(layers.Dense(128, activation="relu"))
model.add(layers.Dense(10, activation="softmax"))
print(model.output_shape)  # (None, 10)`,
        },
      ],
    },
    {
      id: '4.1.2',
      title: 'The Functional API: Models as Graphs',
      content: `
The **Functional API** is the workhorse of Keras. It treats layers as functions that transform tensors, and models as directed acyclic graphs (DAGs) of these transformations. This is the most commonly used model-building approach because it is both powerful and inspectable.

Here is the same two-layer model expressed with the Functional API:

\`\`\`python
inputs = keras.Input(shape=(3,), name="my_input")
features = layers.Dense(64, activation="relu")(inputs)
outputs = layers.Dense(10, activation="softmax")(features)
model = keras.Model(inputs=inputs, outputs=outputs)
\`\`\`

Notice the pattern: you start by declaring an \`Input\`, then chain layer calls to produce intermediate tensors. The notation \`layers.Dense(64)(x)\` calls the layer on tensor \`x\` and returns a new tensor. Finally, you wrap the whole graph in a \`keras.Model\` specifying the inputs and outputs.

The Functional API shines when you need **multi-input** or **multi-output** models. For instance, you might build a model that takes both an image and metadata as inputs, or one that predicts both a category and a confidence score. You can also share a single layer across different parts of the graph -- this is how Siamese networks work, using the same convolutional layers for two images.

\`\`\`python
text_input = keras.Input(shape=(None,), dtype="int64", name="text")
image_input = keras.Input(shape=(256, 256, 3), name="image")
# Process each input through its own layers, then merge
\`\`\`

Because the Functional API builds an explicit graph, Keras can inspect it: \`model.summary()\` shows all layers, their output shapes, and parameter counts. You can also visualize the graph or access any intermediate layer output. This makes debugging much easier than alternatives.
`,
      reviewCardIds: ['rc-4.1-3', 'rc-4.1-4', 'rc-4.1-5'],
      codeExamples: [
        {
          title: 'Multi-input Functional model',
          language: 'python',
          code: `import keras
from keras import layers

text_input = keras.Input(shape=(100,), name="text")
image_input = keras.Input(shape=(64, 64, 3), name="image")

text_features = layers.Dense(64, activation="relu")(text_input)
image_features = layers.Flatten()(image_input)
image_features = layers.Dense(64, activation="relu")(image_features)

merged = layers.Concatenate()([text_features, image_features])
output = layers.Dense(1, activation="sigmoid")(merged)

model = keras.Model(inputs=[text_input, image_input], outputs=output)
model.summary()`,
        },
        {
          title: 'Accessing intermediate layer outputs',
          language: 'python',
          code: `# After building a Functional model, inspect any layer
inputs = keras.Input(shape=(784,))
x = layers.Dense(128, activation="relu", name="hidden")(inputs)
outputs = layers.Dense(10, activation="softmax")(x)
model = keras.Model(inputs=inputs, outputs=outputs)

# Create a new model that also outputs the hidden layer
feature_extractor = keras.Model(
    inputs=model.input,
    outputs=model.get_layer("hidden").output,
)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Keras offers a spectrum of model-building APIs: Sequential (simplest), Functional (most common), and Subclassing (most flexible).
- The Sequential model is limited to a single linear stack of layers with one input and one output.
- The Functional API treats layers as functions and models as directed acyclic graphs (DAGs), enabling multi-input, multi-output, and shared-layer architectures.
- Use keras.Input to declare input shapes, then chain layer calls to build the computation graph.
- The Functional API is inspectable: model.summary() and graph visualization work out of the box.`,
};

export default lesson;
