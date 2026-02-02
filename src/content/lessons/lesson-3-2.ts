/**
 * Lesson 3.2: The Nature of Generalization
 *
 * Covers: Why DL generalizes, manifold hypothesis
 * Source sections: 5.1.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '3.2',
  title: 'The Nature of Generalization',
  sections: [
    {
      id: '3.2.1',
      title: 'The Manifold Hypothesis',
      content: `
Deep learning models can be trained to fit *anything*. Give a model enough parameters and enough time, and it will memorize random noise. You can even shuffle MNIST labels randomly and the training loss will still go down -- the model just memorizes which random label goes with which input. Of course, validation loss does not improve at all, because there is nothing to generalize.

\`\`\`python
import numpy as np
from keras.datasets import mnist

(train_images, train_labels), _ = mnist.load_data()
train_images = train_images.reshape((60000, 28 * 28))
train_images = train_images.astype("float32") / 255

random_train_labels = train_labels[:]
np.random.shuffle(random_train_labels)
# A model trained on these shuffled labels will memorize them,
# but validation accuracy stays at ~10% (random chance)
\`\`\`

So if neural networks can memorize anything, why do they generalize at all on real data? The answer lies not in the models themselves but in the **structure of real-world data**.

The **manifold hypothesis** states that all natural data lies on a low-dimensional surface (a "manifold") within the much larger high-dimensional space where it is encoded. Consider MNIST: an input image is a 28x28 grid of pixel values, so the space of all possible inputs has 256^784 configurations -- a number far exceeding the atoms in the universe. But the subset of those configurations that actually look like handwritten digits is astronomically small and highly structured.

A **manifold** is a lower-dimensional surface that is locally similar to a flat Euclidean space. A curve is a 1D manifold in 2D space. A smooth surface is a 2D manifold in 3D space. The space of valid handwritten digits forms a manifold within the space of all possible 28x28 images, and this manifold has two key properties: it is *continuous* (small changes produce similar digits) and *connected* (you can smoothly morph one digit into another).
`,
      reviewCardIds: ['rc-3.2-1', 'rc-3.2-2'],
      illustrations: ['manifold-hypothesis'],
      codeExamples: [
        {
          title: 'Generating points on a low-dimensional manifold in high-dimensional space',
          language: 'python',
          code: `import numpy as np

# A 1D manifold (curve) embedded in 3D space
t = np.linspace(0, 4 * np.pi, 500)
x = np.cos(t)
y = np.sin(t)
z = t / (4 * np.pi)
manifold_points = np.column_stack([x, y, z])
# 500 points on a spiral -- a 1D manifold in 3D space
print(f"Shape: {manifold_points.shape}")  # (500, 3)
# Despite living in 3D, the data has only 1 intrinsic dimension`,
        },
        {
          title: 'Measuring intrinsic dimensionality with PCA',
          language: 'python',
          code: `from sklearn.decomposition import PCA
from keras.datasets import mnist

(images, _), _ = mnist.load_data()
images = images.reshape((60000, 784)).astype("float32") / 255

pca = PCA().fit(images)
cumulative_var = np.cumsum(pca.explained_variance_ratio_)
n_components_95 = np.argmax(cumulative_var >= 0.95) + 1
print(f"95% variance captured with {n_components_95} of 784 dimensions")
# Shows that MNIST lives on a much lower-dimensional manifold`,
        },
      ],
    },
    {
      id: '3.2.2',
      title: 'Interpolation as the Source of Generalization',
      content: `
The manifold hypothesis has a powerful implication for machine learning. If data lies on a structured, low-dimensional manifold, then a model does not need to learn the entire high-dimensional input space. It only needs to learn the manifold itself -- a vastly simpler task.

More importantly, if data points lie on a continuous manifold, you can **interpolate** between them. Given two training examples that sit on the manifold, points in between them also lie on (or near) the manifold. This means the model can make sense of new inputs it has never explicitly seen by relating them to nearby training examples.

This is the key insight: **deep learning models generalize by interpolating between training examples on the learned data manifold**. They do not need to memorize every possible input. They just need enough training points to form a dense enough sampling of the manifold that interpolation becomes reliable.

However, there is an important distinction between interpolation on the manifold and naive linear interpolation. If you take two MNIST digit images and average their pixel values, the result usually does not look like a valid digit. But if you follow a path along the *manifold* from one digit to another, every intermediate point looks like a plausible digit. Deep learning models learn to work in this manifold space, not in raw pixel space.

It is also critical to understand the limits of interpolation. Models interpolate well -- they handle inputs that fall *within* the distribution of their training data. But they **extrapolate** poorly -- inputs that fall outside the training distribution are unreliable territory. This is why training data that densely covers your expected input space is so important.
`,
      reviewCardIds: ['rc-3.2-3', 'rc-3.2-4'],
      illustrations: ['manifold-interpolation'],
      codeExamples: [
        {
          title: 'Interpolation in latent space vs pixel space',
          language: 'python',
          code: `import numpy as np
from keras.datasets import mnist
from sklearn.decomposition import PCA

(images, labels), _ = mnist.load_data()
images = images.reshape((60000, 784)).astype("float32") / 255

# Fit PCA as a simple latent space
pca = PCA(n_components=30)
latent = pca.fit_transform(images)

# Pick two digits
idx_a, idx_b = np.where(labels == 3)[0][0], np.where(labels == 7)[0][0]

# Interpolate in latent space (follows the manifold)
alphas = np.linspace(0, 1, 8)
latent_interp = [(1 - a) * latent[idx_a] + a * latent[idx_b] for a in alphas]
manifold_interp = pca.inverse_transform(np.array(latent_interp))
# Each step looks like a plausible digit transitioning from 3 to 7`,
        },
      ],
    },
    {
      id: '3.2.3',
      title: 'Why Deep Learning Works',
      content: `
Recall the "crumpled paper ball" metaphor from earlier modules: a deep learning model uncrumples complex data manifolds. A sheet of paper is a 2D manifold in 3D space. If you crumple it up, the 2D surface is still there, just tangled. Deep learning disentangles these tangled manifolds by learning smooth, continuous transformations.

Several properties make deep learning particularly well-suited to this task:

1. **Smoothness by construction** -- Because deep learning models must be differentiable (you need gradients for backpropagation), they implement smooth, continuous mappings. This naturally matches the smooth structure of real-world data manifolds.

2. **Architecture priors** -- Model architectures encode structural assumptions about the data. Convolutional layers assume spatial patterns are translation-invariant. Recurrent layers assume sequential dependencies. These priors help the model find the right manifold structure more efficiently.

3. **Gradient descent as implicit regularization** -- The training process itself biases toward simple solutions. Gradient descent moves through parameter space gradually, finding smooth approximations of the data manifold before it has a chance to memorize individual training points. At some intermediate point during training, the model achieves a good approximation of the true manifold -- and this is where it generalizes best.

Because generalization ultimately depends on the data manifold, **training data is paramount**. You need a dense sampling of the input space. The more informative and less noisy your features, the better the manifold structure and the better generalization will be. More data, or better data, is almost always more valuable than a more sophisticated model architecture. If the data does not form a learnable manifold, no amount of model tuning will produce generalization.
`,
      reviewCardIds: ['rc-3.2-5'],
      codeExamples: [
        {
          title: 'Demonstrating that smooth models learn manifold structure',
          language: 'python',
          code: `import keras
from keras import layers
from keras.datasets import mnist

(train_images, train_labels), _ = mnist.load_data()
train_images = train_images.reshape((60000, 784)).astype("float32") / 255

# Train a simple autoencoder to learn the manifold
encoder = keras.Sequential([
    layers.Dense(128, activation="relu"),
    layers.Dense(32, activation="relu"),  # 32-D latent space
])
decoder = keras.Sequential([
    layers.Dense(128, activation="relu"),
    layers.Dense(784, activation="sigmoid"),
])
inputs = keras.Input(shape=(784,))
autoencoder = keras.Model(inputs, decoder(encoder(inputs)))
autoencoder.compile(optimizer="adam", loss="mse")
autoencoder.fit(train_images, train_images, epochs=5, batch_size=256)
# The 32-D bottleneck forces the model to learn the data manifold`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Deep learning models can memorize anything, but they generalize on real data because real data has structure -- it lies on low-dimensional manifolds.
- The manifold hypothesis: natural data occupies a small, structured subspace within the much larger possible input space.
- Models generalize by interpolating between training examples on the learned manifold, not by memorizing every possible input.
- Interpolation works within the training distribution, but extrapolation (outside the distribution) is unreliable.
- Deep learning is well-suited to manifold learning due to smoothness constraints, architecture priors, and the implicit regularization of gradient descent.
- Training data quality and density are the most important factors for generalization.`,
};

export default lesson;
