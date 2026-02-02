/**
 * Module definitions for the Deep Learning Learning Platform.
 *
 * 7 modules covering the complete "Deep Learning with Python, Third Edition"
 * curriculum, from foundations through mastery.
 */

import type { Module } from '../lib/db/schema';

export const modules: Module[] = [
  {
    id: 'mod-1',
    title: 'Foundations',
    description:
      'Understand what deep learning is, why it works, and the mathematical building blocks (tensors, operations, gradient descent, backpropagation) that make it possible.',
    order: 1,
    lessonIds: [
      '1.1', '1.2', '1.3', '1.4', '1.5',
      '1.6', '1.7', '1.8', '1.9', '1.10',
    ],
  },
  {
    id: 'mod-2',
    title: 'Getting Started',
    description:
      'Gain hands-on familiarity with deep learning frameworks (TensorFlow, PyTorch, JAX, Keras) and build first real projects: binary classification, multiclass classification, and regression.',
    order: 2,
    lessonIds: [
      '2.1', '2.2', '2.3', '2.4', '2.5',
      '2.6', '2.7', '2.8', '2.9', '2.10',
    ],
  },
  {
    id: 'mod-3',
    title: 'ML Fundamentals',
    description:
      'Understand the science of generalization, master model evaluation techniques, learn regularization strategies, and internalize the universal ML workflow from problem definition through deployment.',
    order: 3,
    lessonIds: [
      '3.1', '3.2', '3.3', '3.4', '3.5',
      '3.6', '3.7', '3.8', '3.9', '3.10',
    ],
  },
  {
    id: 'mod-4',
    title: 'Deep Dive into Practice',
    description:
      'Master the Keras API (Sequential, Functional, Subclassing), advanced training techniques (callbacks, custom loops, TensorBoard), and essential ConvNet architecture patterns (residual connections, batch normalization, depthwise separable convolutions).',
    order: 4,
    lessonIds: [
      '4.1', '4.2', '4.3', '4.4', '4.5', '4.6',
      '4.7', '4.8', '4.9', '4.10', '4.11', '4.12',
    ],
  },
  {
    id: 'mod-5',
    title: 'Computer Vision & Sequences',
    description:
      'Master ConvNet interpretability (visualizing what models learn), image segmentation, object detection, timeseries forecasting, and recurrent neural networks.',
    order: 5,
    lessonIds: [
      '5.1', '5.2', '5.3', '5.4', '5.5', '5.6',
      '5.7', '5.8', '5.9', '5.10', '5.11', '5.12',
    ],
  },
  {
    id: 'mod-6',
    title: 'NLP & Generation',
    description:
      'Master natural language processing (text classification, tokenization, embeddings), the Transformer architecture (attention, encoders, decoders), large language models (GPT, fine-tuning, LoRA), and image generation (VAEs, diffusion models, text-to-image).',
    order: 6,
    lessonIds: [
      '6.1', '6.2', '6.3', '6.4', '6.5', '6.6',
      '6.7', '6.8', '6.9', '6.10', '6.11', '6.12',
    ],
  },
  {
    id: 'mod-7',
    title: 'Mastery',
    description:
      'Learn production best practices (hyperparameter optimization, multi-GPU training, mixed precision), understand the limitations of current AI and where the field is heading, and consolidate all knowledge from the entire curriculum.',
    order: 7,
    lessonIds: [
      '7.1', '7.2', '7.3', '7.4', '7.5', '7.6',
    ],
  },
];
