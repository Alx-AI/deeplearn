/**
 * Lesson 1.6: Your First Neural Network
 *
 * Covers: MNIST example, data flow, how training works
 * Source section: 2.1
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.6',
  title: 'Your First Neural Network',
  sections: [
    {
      id: '1.6.1',
      title: 'The MNIST Challenge',
      content: `
Time to see deep learning in action. We're going to walk through a complete neural network that classifies handwritten digits -- the "Hello World" of deep learning.

The dataset is called **MNIST**: 60,000 training images and 10,000 test images of handwritten digits (0 through 9). Each image is a small 28x28 pixel grayscale picture. The task: given a picture of a handwritten digit, predict which digit it is.

Here's how we load the data in Keras:

\`\`\`python
from keras.datasets import mnist
(train_images, train_labels), (test_images, test_labels) = mnist.load_data()
\`\`\`

The training images have shape \`(60000, 28, 28)\` -- that's 60,000 images, each 28 pixels tall and 28 pixels wide. The labels are simple integers: \`[5, 0, 4, ..., 5, 6, 8]\`.

The workflow is straightforward:
1. Show the network the training images and their labels (so it can learn)
2. Ask it to predict labels for the test images (which it has never seen)
3. Check how many it gets right

This split between training and test data is fundamental. We *always* evaluate on data the model hasn't seen during training, because we care about how well it generalizes to new inputs, not how well it memorizes old ones.

Let's build the network:

\`\`\`python
import keras
from keras import layers

model = keras.Sequential([
    layers.Dense(512, activation="relu"),
    layers.Dense(10, activation="softmax"),
])
\`\`\`

This model has two **Dense layers** (also called "fully connected" layers, where every input connects to every output). The first layer has 512 outputs and uses the **relu** activation function. The second layer has 10 outputs (one per digit class) and uses **softmax**, which converts the outputs into a probability distribution -- 10 numbers that sum to 1, each representing the probability that the input belongs to that class.
`,
      reviewCardIds: ['rc-1.6-1', 'rc-1.6-2', 'rc-1.6-3'],
      illustrations: ['mnist-network'],
      codeExamples: [
        {
          title: 'Inspecting the MNIST dataset shapes',
          language: 'python',
          code: `from keras.datasets import mnist
(train_images, train_labels), (test_images, test_labels) = mnist.load_data()

print(train_images.shape)  # (60000, 28, 28)
print(train_labels.shape)  # (60000,)
print(test_images.shape)   # (10000, 28, 28)
print(train_images.dtype)  # uint8
print(train_labels[:10])   # [5 0 4 1 9 2 1 3 1 4]`,
        },
        {
          title: 'Viewing the model architecture summary',
          language: 'python',
          code: `model.summary()
# Model: "sequential"
# Layer (type)            Output Shape       Param #
# dense (Dense)           (None, 512)        401,920
# dense_1 (Dense)         (None, 10)         5,130
# Total params: 407,050`,
        },
      ],
    },
    {
      id: '1.6.2',
      title: 'Compile, Preprocess, Train',
      content: `
Before training, we need to do three things: compile the model, preprocess the data, and run the training loop.

**Compile** -- tell the model how to learn:

\`\`\`python
model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)
\`\`\`

Three choices here:
- **Loss function** (\`sparse_categorical_crossentropy\`): measures how wrong the predictions are. "Sparse" because our labels are integers (like \`7\`) rather than one-hot vectors.
- **Optimizer** (\`adam\`): the algorithm that updates weights to reduce the loss.
- **Metrics** (\`accuracy\`): what we monitor during training -- the percentage of correctly classified images.

**Preprocess** -- reshape and scale the data:

\`\`\`python
train_images = train_images.reshape((60000, 28 * 28))
train_images = train_images.astype("float32") / 255
\`\`\`

Two transformations: (1) flatten each 28x28 image into a single vector of 784 values, because Dense layers expect 1D input, and (2) scale pixel values from the 0-255 integer range down to the 0-1 float range, which helps training converge faster and more reliably.

**Train** -- fit the model to the data:

\`\`\`python
model.fit(train_images, train_labels, epochs=5, batch_size=128)
\`\`\`

This says: "go through the entire training set 5 times (**epochs**), processing 128 images at a time (**batch size**)." During each batch, the model makes predictions, computes the loss, calculates gradients, and updates its weights. After 5 epochs, we see training accuracy of about 98.9%.
`,
      reviewCardIds: ['rc-1.6-4', 'rc-1.6-5'],
      illustrations: ['training-loop'],
      codeExamples: [
        {
          title: 'Complete preprocessing for both train and test sets',
          language: 'python',
          code: `train_images = train_images.reshape((60000, 28 * 28)).astype("float32") / 255
test_images = test_images.reshape((10000, 28 * 28)).astype("float32") / 255

print(train_images.shape)  # (60000, 784)
print(train_images.min(), train_images.max())  # 0.0 1.0`,
        },
        {
          title: 'Monitoring training progress with verbose output',
          language: 'python',
          code: `history = model.fit(
    train_images, train_labels,
    epochs=5, batch_size=128, verbose=1
)
# Access training history
print(history.history["loss"])      # Loss per epoch
print(history.history["accuracy"])  # Accuracy per epoch`,
        },
      ],
    },
    {
      id: '1.6.3',
      title: 'Making Predictions and Evaluating',
      content: `
Now the model is trained. Let's use it:

\`\`\`python
predictions = model.predict(test_images[0:10])
print(predictions[0])
# array([1.07e-10, 1.69e-10, 6.13e-08, 8.41e-06,
#        2.99e-11, 3.03e-09, 8.36e-14, 9.99e-01,
#        2.66e-08, 3.81e-07])
\`\`\`

Each prediction is an array of 10 probabilities. For the first test image, the model assigns probability 0.999 to index 7 -- it's nearly certain this digit is a 7. We can confirm:

\`\`\`python
predictions[0].argmax()  # 7
test_labels[0]           # 7  -- correct!
\`\`\`

How does the model do overall? Let's evaluate on the entire test set:

\`\`\`python
test_loss, test_acc = model.evaluate(test_images, test_labels)
# test_acc: 0.978
\`\`\`

The test accuracy is 97.8% -- impressive, but notice it's lower than the training accuracy of 98.9%. This gap is our first encounter with **overfitting**: the model performs better on data it trained on than on new data. It has memorized some patterns specific to the training set that don't generalize. This is a central challenge in machine learning, and we'll address it extensively later in the curriculum.

Let's take stock of what just happened. In fewer than 15 lines of Python, we:
1. Loaded a dataset of 70,000 images
2. Built a two-layer neural network
3. Specified how it should learn (loss, optimizer, metrics)
4. Trained it on the data
5. Evaluated it on images it had never seen

And it works with 97.8% accuracy. That's the power of modern deep learning frameworks -- they abstract away the complexity so you can focus on the problem. But understanding what happens *behind* those 15 lines is what separates a practitioner from a user, which is exactly what the next lessons will teach you.
`,
      reviewCardIds: ['rc-1.6-6', 'rc-1.6-7', 'rc-1.6-8'],
      codeExamples: [
        {
          title: 'Visualizing a prediction as a bar chart',
          language: 'python',
          code: `import matplotlib.pyplot as plt
import numpy as np

pred = predictions[0]
plt.bar(range(10), pred)
plt.xticks(range(10))
plt.xlabel("Digit class")
plt.ylabel("Probability")
plt.title(f"Predicted: {np.argmax(pred)}")
plt.show()`,
        },
        {
          title: 'Comparing train vs test accuracy to spot overfitting',
          language: 'python',
          code: `train_loss, train_acc = model.evaluate(train_images, train_labels, verbose=0)
test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=0)

print(f"Train accuracy: {train_acc:.4f}")
print(f"Test accuracy:  {test_acc:.4f}")
print(f"Overfit gap:    {train_acc - test_acc:.4f}")`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- MNIST is the "Hello World" of deep learning: 70,000 grayscale images of handwritten digits.
- A simple two-layer Dense network achieves ~97.8% accuracy on test data.
- The compilation step specifies the loss function (feedback signal), optimizer (weight update strategy), and metrics.
- Data preprocessing: flatten 28x28 images to 784-element vectors and scale pixel values to [0, 1].
- Softmax activation produces a probability distribution over the 10 digit classes.
- Overfitting is visible in the gap between training accuracy (98.9%) and test accuracy (97.8%).`,
};

export default lesson;
