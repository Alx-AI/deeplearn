/**
 * Lesson 6.10: Image Generation -- VAEs
 *
 * Covers: Latent spaces, variational autoencoders, reparameterization trick, KL divergence
 * Source sections: 17.1.1, 17.1.2, 17.1.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.10',
  title: 'Image Generation -- VAEs',
  sections: [
    {
      id: '6.10.1',
      title: 'Latent Spaces for Image Generation',
      content: `
The key idea behind image generation is learning a **latent space** -- a low-dimensional continuous space where every point can be mapped to a valid image. Once you have such a space, you can sample random points and decode them into never-before-seen images.

A **Variational Autoencoder** (VAE) learns this latent space through an encoder-decoder structure. The encoder maps an input image to parameters of a probability distribution ($\\mu$ and $\\sigma^2$). A point is sampled from this distribution, and the decoder maps it back to an image.

Unlike a standard autoencoder (which maps to a single point), the VAE maps to a **distribution**. This forces the latent space to be continuous -- nearby points must produce similar images because the encoder maps each image to a spread-out region, not a single isolated point.

\`\`\`python
# VAE in pseudocode
z_mean, z_log_var = encoder(input_image)        # Distribution parameters
z = z_mean + exp(z_log_var / 2) * epsilon       # Sample (reparameterization)
reconstructed = decoder(z)                       # Decode back to image
\`\`\`

The **reparameterization trick** makes training possible. Direct sampling from a distribution is not differentiable, so you cannot backpropagate through it. Instead, sample $\\epsilon$ from $\\mathcal{N}(0, 1)$ (which has no learnable parameters), then compute $z = \\mu + e^{\\log \\sigma^2 / 2} \\cdot \\epsilon$. Gradients flow through $\\mu$ and $\\log \\sigma^2$ while $\\epsilon$ provides randomness.
`,
      reviewCardIds: ['rc-6.10-1', 'rc-6.10-2', 'rc-6.10-3'],
      illustrations: ['vae-latent-space'],
      codeExamples: [
        {
          title: 'VAE sampling layer with the reparameterization trick (Keras)',
          language: 'python',
          code: `import keras
from keras import ops

class Sampling(keras.Layer):
    """Reparameterization trick: z = mean + exp(log_var/2) * eps."""
    def call(self, inputs):
        z_mean, z_log_var = inputs
        epsilon = keras.random.normal(shape=ops.shape(z_mean))
        return z_mean + ops.exp(0.5 * z_log_var) * epsilon`,
        },
        {
          title: 'VAE encoder network (Keras)',
          language: 'python',
          code: `from keras import layers

latent_dim = 2
encoder_inputs = keras.Input(shape=(28, 28, 1))
x = layers.Conv2D(32, 3, activation="relu", strides=2, padding="same")(encoder_inputs)
x = layers.Conv2D(64, 3, activation="relu", strides=2, padding="same")(x)
x = layers.Flatten()(x)
x = layers.Dense(16, activation="relu")(x)
z_mean = layers.Dense(latent_dim, name="z_mean")(x)
z_log_var = layers.Dense(latent_dim, name="z_log_var")(x)
z = Sampling()([z_mean, z_log_var])
encoder = keras.Model(encoder_inputs, [z_mean, z_log_var, z], name="encoder")`,
        },
      ],
    },
    {
      id: '6.10.2',
      title: 'The VAE Loss Function',
      content: `
The VAE is trained with two loss components:

**Reconstruction loss** (e.g., MSE between input and output) ensures the decoder can accurately reconstruct the original image. Without it, the model would produce random outputs.

**KL divergence loss** pushes the encoder's output distribution toward a standard normal $\\mathcal{N}(0, 1)$. This is what gives the latent space its structure: it prevents the encoder from learning wildly different distributions for different images, ensuring the space is smooth and well-organized.

\`\`\`python
reconstruction_loss = mse(input_image, reconstructed_image)
kl_loss = -0.5 * sum(1 + z_log_var - z_mean**2 - exp(z_log_var))
total_loss = reconstruction_loss + kl_loss
\`\`\`

The balance between these losses controls a tradeoff. Emphasizing reconstruction produces sharp but poorly structured latent spaces. Emphasizing KL divergence produces smooth latent spaces but blurry reconstructions.

To **generate** new images, simply sample random points from a standard normal distribution and pass them through the decoder. Because the KL loss shaped the latent space to approximate $\\mathcal{N}(0, 1)$, random samples land in regions the decoder knows how to handle.

VAEs produce blurrier images than diffusion models, but they remain valuable when you need an interpretable, structured latent space -- for image interpolation, style transfer, or understanding what the model has learned about the data's structure.
`,
      reviewCardIds: ['rc-6.10-4', 'rc-6.10-5'],
      illustrations: ['vae-loss'],
      codeExamples: [
        {
          title: 'VAE decoder network (Keras)',
          language: 'python',
          code: `latent_inputs = keras.Input(shape=(latent_dim,))
x = layers.Dense(7 * 7 * 64, activation="relu")(latent_inputs)
x = layers.Reshape((7, 7, 64))(x)
x = layers.Conv2DTranspose(64, 3, activation="relu", strides=2, padding="same")(x)
x = layers.Conv2DTranspose(32, 3, activation="relu", strides=2, padding="same")(x)
decoder_outputs = layers.Conv2DTranspose(1, 3, activation="sigmoid", padding="same")(x)
decoder = keras.Model(latent_inputs, decoder_outputs, name="decoder")`,
        },
        {
          title: 'VAE loss: reconstruction + KL divergence',
          language: 'python',
          code: `import keras
from keras import ops

def vae_loss(x, x_reconstructed, z_mean, z_log_var):
    reconstruction = ops.mean(
        keras.losses.binary_crossentropy(x, x_reconstructed)
    )
    kl = -0.5 * ops.mean(
        1 + z_log_var - ops.square(z_mean) - ops.exp(z_log_var)
    )
    return reconstruction + kl`,
        },
        {
          title: 'Generate new images by sampling from the latent space',
          language: 'python',
          code: `import numpy as np

# Sample random points from N(0, 1)
z_samples = np.random.normal(size=(16, latent_dim))
generated_images = decoder.predict(z_samples)
# generated_images has shape (16, 28, 28, 1)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- VAEs learn a latent space where every point maps to a valid image via encoder-decoder architecture.
- The encoder outputs distribution parameters ($\\mu$, $\\sigma^2$), not a single point, ensuring continuous latent space.
- The reparameterization trick enables backpropagation through sampling: $z = \\mu + e^{\\log \\sigma^2 / 2} \\cdot \\epsilon$.
- The loss combines reconstruction (accurate output) and KL divergence (smooth latent space near $\\mathcal{N}(0, 1)$).
- Generate images by sampling from $\\mathcal{N}(0, 1)$ and decoding; nearby latent points produce similar images.`,
};

export default lesson;
