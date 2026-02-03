/**
 * Lesson 6.11: Diffusion Models
 *
 * Covers: Forward/reverse diffusion, denoising U-Net, iterative generation
 * Source sections: 17.2
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '6.11',
  title: 'Diffusion Models',
  sections: [
    {
      id: '6.11.1',
      title: 'The Forward and Reverse Diffusion Process',
      content: `
**Diffusion models** generate images through a two-phase process: gradually adding noise (forward), then learning to remove it (reverse).

**Forward diffusion** takes a real image and progressively adds Gaussian noise over $T$ steps until it becomes pure random noise. Each step adds a small amount of noise according to a predefined schedule.

\`\`\`
Step 0: Clean image
Step 1: Slightly noisy image
Step 2: More noisy image
...
Step T: Pure random noise
\`\`\`

**Reverse diffusion** is what the model learns: given a noisy image at step $t$ and the noise level $t$, predict the noise that was added (or equivalently, predict a slightly cleaner version). A neural network (typically a **U-Net** with skip connections) learns this denoising function.

Training is straightforward: take a clean image, add noise at a random step $t$, and train the model to predict the added noise:

\`\`\`python
# Training pseudocode
noise = random_normal(image_shape)
noisy_image = image + noise_schedule[t] * noise
predicted_noise = model(noisy_image, t)     # Model also receives time step
loss = mse(noise, predicted_noise)
\`\`\`

The U-Net receives **two inputs**: the noisy image and a time encoding. The time encoding is crucial because the model must know how much noise is present -- at early steps (low noise), it makes fine adjustments; at late steps (heavy noise), it makes large structural changes.
`,
      reviewCardIds: ['rc-6.11-1', 'rc-6.11-2', 'rc-6.11-3'],
      illustrations: ['diffusion-process'],
      codeExamples: [
        {
          title: 'Linear noise schedule for forward diffusion',
          language: 'python',
          code: `import numpy as np

T = 1000  # Total diffusion steps
beta = np.linspace(1e-4, 0.02, T)     # Noise schedule
alpha = 1.0 - beta
alpha_bar = np.cumprod(alpha)          # Cumulative product

# alpha_bar[t] tells us how much original signal remains at step t
print(f"Signal at t=0:   {alpha_bar[0]:.4f}")   # ~1.0 (clean)
print(f"Signal at t=500: {alpha_bar[500]:.4f}")  # ~0.04 (mostly noise)
print(f"Signal at t=999: {alpha_bar[999]:.4f}")  # ~0.00 (pure noise)`,
        },
        {
          title: 'Forward diffusion: adding noise at an arbitrary step t',
          language: 'python',
          code: `def forward_diffusion(x_0, t, alpha_bar):
    """Add noise to a clean image x_0 to get noisy image at step t."""
    noise = np.random.randn(*x_0.shape)
    sqrt_alpha_bar = np.sqrt(alpha_bar[t])
    sqrt_one_minus = np.sqrt(1.0 - alpha_bar[t])
    x_t = sqrt_alpha_bar * x_0 + sqrt_one_minus * noise
    return x_t, noise  # Return both for training`,
        },
      ],
    },
    {
      id: '6.11.2',
      title: 'Generating Images by Iterative Denoising',
      content: `
To **generate** a new image, start from pure random noise and iteratively apply the denoising model:

\`\`\`python
image = random_noise()
for t in reversed(range(T)):
    predicted_noise = model(image, t)
    image = remove_noise(image, predicted_noise, t)
# After T denoising steps: a clean, generated image
\`\`\`

Each step removes a small amount of noise, progressively revealing structure. Early steps establish broad composition (shapes, layout). Middle steps add medium-level features (textures, colors). Final steps refine fine details (edges, small features).

Why not denoise in a single step? Because removing all noise at once would require the model to make an enormously complex transformation -- predicting every pixel of a clean image from pure noise. Breaking this into many small steps makes each individual prediction simpler and more accurate. The iterative refinement allows each step to correct errors from previous steps.

This iterative approach is what makes diffusion models produce higher-quality images than VAEs and GANs. The typical generation process uses 20-1000 denoising steps, trading computation time for image quality.

Diffusion models now power the most impressive image generation systems. They produce photorealistic images, handle complex compositions, and generalize well to novel combinations of concepts. The core idea -- "learn to remove noise" -- turns out to be a remarkably effective framework for generative modeling.
`,
      reviewCardIds: ['rc-6.11-4', 'rc-6.11-5'],
      illustrations: ['iterative-denoising'],
      codeExamples: [
        {
          title: 'Reverse diffusion loop (simplified generation)',
          language: 'python',
          code: `import torch

@torch.no_grad()
def generate(model, shape, T, beta, alpha, alpha_bar):
    """Generate an image by iterative denoising."""
    x = torch.randn(shape)  # Start from pure noise
    for t in reversed(range(T)):
        t_tensor = torch.full((shape[0],), t, dtype=torch.long)
        predicted_noise = model(x, t_tensor)
        # Remove predicted noise, scaled by schedule
        x = (1 / alpha[t].sqrt()) * (
            x - (beta[t] / (1 - alpha_bar[t]).sqrt()) * predicted_noise
        )
        if t > 0:  # Add small noise except at final step
            x += beta[t].sqrt() * torch.randn_like(x)
    return x`,
        },
        {
          title: 'Diffusion training step (predict the noise)',
          language: 'python',
          code: `def training_step(model, x_0, T, alpha_bar):
    t = torch.randint(0, T, (x_0.shape[0],))  # Random timesteps
    noise = torch.randn_like(x_0)
    # Create noisy images at timestep t
    sqrt_ab = alpha_bar[t].sqrt().view(-1, 1, 1, 1)
    sqrt_1_ab = (1 - alpha_bar[t]).sqrt().view(-1, 1, 1, 1)
    x_t = sqrt_ab * x_0 + sqrt_1_ab * noise
    # Train model to predict the noise
    predicted = model(x_t, t)
    loss = torch.nn.functional.mse_loss(predicted, noise)
    return loss`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Forward diffusion gradually adds noise to images; reverse diffusion learns to remove it step by step.
- A U-Net denoising model takes both the noisy image and a time encoding as inputs.
- Generation starts from pure noise and iteratively applies denoising over many steps.
- Iterative refinement allows each step to be simple while producing high-quality results overall.
- Diffusion models produce higher-quality images than VAEs and GANs through this progressive denoising approach.`,
};

export default lesson;
