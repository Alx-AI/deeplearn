/**
 * Lesson 7.2: Scaling Training -- Multi-GPU and TPUs
 *
 * Covers: Data parallelism, gradient synchronization, TPUs, scaling laws
 * Source sections: 18.2.1, 18.2.2, 18.2.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '7.2',
  title: 'Scaling Training -- Multi-GPU and TPUs',
  sections: [
    {
      id: '7.2.1',
      title: 'Data Parallelism Across GPUs',
      content: `
When a single GPU cannot train your model fast enough, **data parallelism** distributes the workload across multiple GPUs. Each GPU holds a complete copy of the model and processes a different mini-batch simultaneously.

The process for each training step:
1. Split the batch across N GPUs (each gets batch_size / N samples)
2. Each GPU computes a forward pass and local gradients independently
3. All GPUs synchronize by **averaging** their gradients (all-reduce operation)
4. Each GPU updates its model weights identically using the averaged gradient

\`\`\`python
# With 4 GPUs and batch_size=64 per GPU
# Effective batch size = 4 * 64 = 256
# Training is ~4x faster (minus communication overhead)
\`\`\`

The result is mathematically equivalent to single-GPU training with a larger batch size, but roughly N times faster.

When scaling from 1 to N GPUs, the **learning rate** often needs adjustment. With N times more samples per gradient update, the gradient estimate is more reliable and can support a larger step. The common rule of thumb: scale the learning rate linearly with the number of GPUs, with a gradual **warmup** period at the start of training to avoid instability.

The main overhead is **gradient synchronization**: after each step, gradients must be transferred between GPUs. With fast interconnects (NVLink), this is manageable. Over slower connections (PCIe, network), it can become a bottleneck, especially for very large models.
`,
      reviewCardIds: ['rc-7.2-1', 'rc-7.2-2', 'rc-7.2-3'],
      illustrations: ['data-parallelism'],
      codeExamples: [
        {
          title: 'Data parallelism with tf.distribute.MirroredStrategy',
          language: 'python',
          code: `import tensorflow as tf

strategy = tf.distribute.MirroredStrategy()
print(f"Number of devices: {strategy.num_replicas_in_sync}")

with strategy.scope():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dense(10, activation="softmax")
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(0.001),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"])

# Batch is automatically split across GPUs
model.fit(x_train, y_train, batch_size=256, epochs=10)`,
        },
        {
          title: 'Learning rate warmup schedule for multi-GPU training',
          language: 'python',
          code: `import tensorflow as tf

num_gpus = strategy.num_replicas_in_sync
base_lr = 0.001
scaled_lr = base_lr * num_gpus
warmup_epochs = 5

def lr_schedule(epoch):
    if epoch < warmup_epochs:
        return base_lr + (scaled_lr - base_lr) * epoch / warmup_epochs
    return scaled_lr

callback = tf.keras.callbacks.LearningRateScheduler(lr_schedule)
model.fit(x_train, y_train, epochs=50, callbacks=[callback])`,
        },
      ],
    },
    {
      id: '7.2.2',
      title: 'TPUs and Hardware Considerations',
      content: `
**TPUs** (Tensor Processing Units) are custom hardware designed by Google specifically for neural network computation. They feature systolic arrays optimized for matrix multiplication, high-bandwidth memory, and tight integration with TensorFlow and JAX.

TPUs excel at:
- Very large batch sizes (their memory architecture favors this)
- Standard operations (matmul, convolution) at enormous scale
- Training within the Google Cloud ecosystem

GPUs are more flexible:
- Better for diverse workloads (not just deep learning)
- Wider software ecosystem (PyTorch, custom CUDA code)
- Available from multiple vendors and cloud providers

For most practitioners, the choice between GPUs and TPUs is determined by your cloud provider and framework preferences. Both are capable of training state-of-the-art models.

**Practical considerations** for distributed training:
- Start with a single GPU and optimize your training code before scaling
- Profile your training to identify bottlenecks (compute vs. data loading vs. communication)
- Use mixed precision (covered next lesson) to effectively double your GPU memory
- Consider whether your model is large enough to benefit from multi-GPU -- small models may spend more time communicating than computing
`,
      reviewCardIds: ['rc-7.2-4', 'rc-7.2-5'],
      codeExamples: [
        {
          title: 'Setting up a TPU strategy in TensorFlow',
          language: 'python',
          code: `import tensorflow as tf

resolver = tf.distribute.cluster_resolver.TPUClusterResolver()
tf.config.experimental_connect_to_cluster(resolver)
tf.tpu.experimental.initialize_tpu_system(resolver)

strategy = tf.distribute.TPUStrategy(resolver)
print(f"TPU cores: {strategy.num_replicas_in_sync}")

with strategy.scope():
    model = build_model()  # Your model-building function
    model.compile(optimizer="adam",
                  loss="sparse_categorical_crossentropy")`,
        },
        {
          title: 'Profiling a training step to find bottlenecks',
          language: 'python',
          code: `import tensorflow as tf

# Enable profiling for 3 training steps
tf.profiler.experimental.start("logdir")
model.fit(x_train, y_train, epochs=1,
          steps_per_epoch=3)
tf.profiler.experimental.stop()

# View results: tensorboard --logdir logdir
# Look for: compute time vs. data loading vs. comm`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Data parallelism distributes batches across GPUs; each GPU computes gradients that are averaged and synchronized.
- Effective batch size = batch_per_GPU * number_of_GPUs; training is ~N times faster with N GPUs.
- Learning rate should be scaled up (often linearly) when adding GPUs, with a warmup period.
- Communication overhead for gradient synchronization is the main bottleneck of multi-GPU training.
- TPUs are optimized for tensor operations; GPUs are more flexible. Both train state-of-the-art models.`,
};

export default lesson;
