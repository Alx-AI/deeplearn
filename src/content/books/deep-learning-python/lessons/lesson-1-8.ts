/**
 * Lesson 1.8: Working with Tensors
 *
 * Covers: NumPy operations, data batches, real-world tensor examples
 * Source sections: 2.2.6-2.2.8
 */

import type { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '1.8',
  title: 'Working with Tensors',
  sections: [
    {
      id: '1.8.1',
      title: 'Slicing and Manipulating Tensors',
      content: `
Now that you know what tensors are, let's learn to work with them. The most common operation is **slicing** -- selecting a subset of a tensor's data.

In NumPy, slicing works just like Python list slicing, but across multiple axes. Let's start with our MNIST images (shape \`(60000, 28, 28)\`):

\`\`\`python
# Select images 10 through 99 (90 images)
my_slice = train_images[10:100]
my_slice.shape  # (90, 28, 28)
\`\`\`

You can also slice along specific axes. To grab the bottom-right 14x14 pixels of every image:

\`\`\`python
my_slice = train_images[:, 14:, 14:]
# : means "all" along the first axis (all images)
# 14: means "from pixel 14 onward" along height
# 14: means "from pixel 14 onward" along width
\`\`\`

Or crop to a centered 14x14 patch:

\`\`\`python
my_slice = train_images[:, 7:-7, 7:-7]
# Negative indices count from the end, just like Python lists
\`\`\`

The syntax \`tensor[start:stop]\` selects elements from \`start\` up to (but not including) \`stop\` along an axis. Using \`:\` by itself means "everything along this axis." This is identical to Python's built-in slicing -- if you know lists, you know tensor slicing.

These operations don't copy data by default -- they create *views* of the original tensor, which is important for memory efficiency when working with large datasets. Tensors can hold millions or billions of numbers, so avoiding unnecessary copies matters.
`,
      reviewCardIds: ['rc-1.8-1', 'rc-1.8-2'],
      codeExamples: [
        {
          title: 'Slicing a single image and visualizing it',
          language: 'python',
          code: `import matplotlib.pyplot as plt
from keras.datasets import mnist
(train_images, _), _ = mnist.load_data()

# Select the 5th image (index 4)
digit = train_images[4]
print(digit.shape)  # (28, 28)

plt.imshow(digit, cmap="gray")
plt.title("A single MNIST digit")
plt.show()`,
        },
        {
          title: 'Slicing a region of interest from every image',
          language: 'python',
          code: `import numpy as np
from keras.datasets import mnist
(train_images, _), _ = mnist.load_data()

# Top-left quadrant of all images
top_left = train_images[:, :14, :14]
print(top_left.shape)  # (60000, 14, 14)

# Center 20x20 crop
center = train_images[:, 4:24, 4:24]
print(center.shape)  # (60000, 20, 20)`,
        },
      ],
    },
    {
      id: '1.8.2',
      title: 'The Concept of Data Batches',
      content: `
Here's a pattern you'll see everywhere in deep learning: data is processed in **batches**, not one sample at a time and not all at once.

The first axis of any data tensor (axis 0) is the **samples axis** -- it indexes individual data points. In MNIST, axis 0 indexes the 60,000 images. In deep learning, models don't process the entire dataset in one go. Instead, they break it into small groups called batches:

\`\`\`python
# First batch: images 0-127
batch = train_images[:128]

# Second batch: images 128-255
batch = train_images[128:256]

# Nth batch
n = 3
batch = train_images[128 * n : 128 * (n + 1)]
\`\`\`

When working with batches, axis 0 is called the **batch axis** (or batch dimension). You'll see this terminology constantly in documentation and error messages.

Why batches instead of one-at-a-time or all-at-once?

- **One at a time** is too noisy: the gradient computed from a single sample is a very rough estimate, and you can't exploit GPU parallelism.
- **All at once** uses too much memory: for large datasets, you simply can't fit everything into GPU memory at once, and you'd only update weights once per pass through the data.
- **Batches** are the sweet spot: typically 32, 64, 128, or 256 samples. Large enough for stable gradient estimates and efficient GPU utilization, small enough to fit in memory and allow frequent weight updates.

In the MNIST example, \`batch_size=128\` means the model processes 128 images at a time, makes predictions for all 128, computes the average loss across the batch, and updates its weights once. With 60,000 training images, each epoch has \`60000 / 128 = 469\` batches (and thus 469 weight updates).
`,
      reviewCardIds: ['rc-1.8-3', 'rc-1.8-4', 'rc-1.8-5'],
      illustrations: ['data-batch'],
      codeExamples: [
        {
          title: 'Iterating over batches with a Python generator',
          language: 'python',
          code: `import numpy as np

def batch_generator(data, labels, batch_size=128):
    num_samples = len(data)
    for start in range(0, num_samples, batch_size):
        end = min(start + batch_size, num_samples)
        yield data[start:end], labels[start:end]

# Usage
for batch_data, batch_labels in batch_generator(train_images, train_labels):
    print(batch_data.shape)  # (128, 784) for most batches
    break  # just show the first one`,
        },
        {
          title: 'Shuffling data before batching (important for SGD)',
          language: 'python',
          code: `import numpy as np

indices = np.arange(len(train_images))
np.random.shuffle(indices)

shuffled_images = train_images[indices]
shuffled_labels = train_labels[indices]

# Now batches contain a random mix of digits
batch = shuffled_labels[:128]
print(np.unique(batch, return_counts=True))`,
        },
      ],
    },
    {
      id: '1.8.3',
      title: 'Real-World Tensor Shapes',
      content: `
Different types of data naturally map to different tensor shapes. Here's a field guide you'll reference often:

**Vector data -- Rank-2 tensors: \`(samples, features)\`**

Each sample is described by a fixed set of numerical features. Examples:
- A dataset of 100,000 people with age, income, and credit score: shape \`(100000, 3)\`
- 500 text documents represented as word counts over a 20,000-word vocabulary: shape \`(500, 20000)\`

**Timeseries / sequence data -- Rank-3 tensors: \`(samples, timesteps, features)\`**

When order matters (time, sequence position), you add a time axis. Examples:
- 250 days of stock prices, sampled every minute (390 minutes per day), with price/high/low per minute: shape \`(250, 390, 3)\`
- 1 million tweets, each up to 280 characters from a 128-character alphabet (one-hot encoded): shape \`(1000000, 280, 128)\`

**Image data -- Rank-4 tensors: \`(samples, height, width, channels)\`**

Images have spatial dimensions plus color channels. Examples:
- 128 grayscale images of 256x256 pixels: shape \`(128, 256, 256, 1)\`
- 128 color images of 256x256 pixels: shape \`(128, 256, 256, 3)\`

Note: this is the "channels-last" convention used by TensorFlow/JAX/Keras. PyTorch uses "channels-first": \`(128, 3, 256, 256)\`.

**Video data -- Rank-5 tensors: \`(samples, frames, height, width, channels)\`**

A video is a sequence of images. Four 60-second clips at 4fps in 144x256: shape \`(4, 240, 144, 256, 3)\`. That's 106 million values -- about 425 MB in float32!

The pattern: each additional "level of structure" in your data adds one more axis to the tensor. Recognizing these shapes is a practical skill that becomes automatic with practice.
`,
      reviewCardIds: ['rc-1.8-6', 'rc-1.8-7', 'rc-1.8-8'],
      illustrations: ['higher-rank-tensors'],
      codeExamples: [
        {
          title: 'Creating example tensors for each real-world data type',
          language: 'python',
          code: `import numpy as np

# Vector data: 1000 samples, 8 features each
vector_data = np.random.random((1000, 8))

# Timeseries: 250 sequences, 100 timesteps, 3 features
timeseries = np.random.random((250, 100, 3))

# Images: 64 RGB images of 128x128
images = np.random.randint(0, 256, (64, 128, 128, 3), dtype=np.uint8)

for name, t in [("vector", vector_data), ("timeseries", timeseries),
                ("images", images)]:
    print(f"{name}: rank={t.ndim}, shape={t.shape}")`,
        },
        {
          title: 'Channels-last vs channels-first conversion',
          language: 'python',
          code: `import numpy as np

# TensorFlow/Keras: channels-last (samples, H, W, C)
img_channels_last = np.random.random((32, 64, 64, 3))

# Convert to PyTorch format: channels-first (samples, C, H, W)
img_channels_first = np.transpose(img_channels_last, (0, 3, 1, 2))

print(f"Channels-last:  {img_channels_last.shape}")   # (32, 64, 64, 3)
print(f"Channels-first: {img_channels_first.shape}")   # (32, 3, 64, 64)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Tensor slicing uses Python's familiar \`start:stop\` syntax across multiple axes.
- Axis 0 is always the samples (or batch) axis in deep learning data tensors.
- Data is processed in batches (typically 32-256 samples) for a balance of stable gradients, memory efficiency, and GPU parallelism.
- Standard tensor shapes: vector data is rank-2, sequences are rank-3, images are rank-4, video is rank-5.
- Channels-last \`(samples, height, width, channels)\` is the convention for TensorFlow/Keras; PyTorch uses channels-first.
- Recognizing tensor shapes for different data types is a core practical skill.`,
};

export default lesson;
