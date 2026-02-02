/**
 * Lesson 7.2: Feedforward Neural Networks
 *
 * Covers: Architecture (input/hidden/output), activation functions, universal approximation
 * Source sections: 7.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.2',
  title: 'Feedforward Neural Networks',
  sections: [
    {
      id: 'marl-7.2.1',
      title: 'Architecture: Input, Hidden, and Output Layers',
      content: `
**Feedforward neural networks** -- also called **multi-layer perceptrons (MLPs)** or fully connected networks -- are the foundational architecture of deep learning. They are structured as a sequence of layers, where each layer receives input from the previous one and passes its output forward to the next. There are no loops or backward connections; data flows strictly from input to output.

The first layer is the **input layer**. It simply accepts the raw input vector x (for example, a state representation in RL). The final layer is the **output layer**, which produces the network's prediction -- perhaps a value estimate for each action. Every layer in between is called a **hidden layer**, because its intermediate representations are not directly exposed to the user.

Each layer k is a parameterised function. A three-layer network, for example, computes:

f(x; theta) = f_3(f_2(f_1(x; theta_1); theta_2); theta_3)

where theta_k denotes the parameters of layer k, and theta = union of all theta_k is the full parameter set. Two key architectural choices govern the network's capacity: the **depth** (number of layers) and the **width** (number of units per layer, also called the hidden dimension). More layers and wider layers generally allow the network to represent more complex functions, but they also require more data and computation to train.

Inside each layer, the computation is surprisingly simple. Consider a single **neural unit** in layer k. It receives the output of the previous layer as input, computes a weighted sum using a weight vector w and a scalar bias b, and then applies a non-linear **activation function** g:

f_{k,u}(x; theta_u) = g(w^T x + b)

Stacking many such units side by side forms a layer, and stacking layers forms the network. In vectorised form, a full layer computes f_k(x_{k-1}; theta_k) = g(W_k^T x_{k-1} + b_k), where W_k is a weight matrix and b_k is a bias vector. This matrix-vector formulation makes layers efficient to compute on modern hardware, especially GPUs.
`,
      reviewCardIds: ['rc-marl-7.2-1', 'rc-marl-7.2-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.2.2',
      title: 'Activation Functions: Introducing Non-Linearity',
      content: `
The activation function g applied after each layer's linear transformation is what gives neural networks their power. Without it, stacking layers would be pointless: the composition of two linear functions is still a linear function. You could collapse an entire deep network into a single-layer linear model. The non-linearity after each layer is what allows the network to learn complex, non-linear mappings.

The most commonly used activation function in modern deep learning is the **Rectified Linear Unit (ReLU)**: g(x) = max(0, x). It is computationally cheap, easy to differentiate, and produces sparse representations (many outputs are exactly zero). These properties make optimisation with gradient descent well-behaved.

Several variants of ReLU address its main weakness -- the fact that units outputting zero receive zero gradient and can "die" permanently:

- **Leaky ReLU**: g(x) = max(cx, x) with a small constant 0 < c < 1 (e.g. 0.01), allowing a small gradient even for negative inputs.
- **Exponential Linear Unit (ELU)**: uses an exponential curve for negative inputs, producing smoother gradients than leaky ReLU.

Two other classic activation functions remain important for specific roles:

- **Sigmoid**: g(x) = 1 / (1 + e^{-x}), which squashes outputs into the range (0, 1). Useful when you need an output interpretable as a probability.
- **Hyperbolic tangent (tanh)**: g(x) = (e^{2x} - 1) / (e^{2x} + 1), which maps to (-1, 1). Common in recurrent networks and when zero-centred outputs are desirable.

In practice, **ReLU** (or one of its variants) is the default choice for hidden layers. Sigmoid and tanh are typically reserved for output layers where bounded outputs are required -- for instance, producing action probabilities through a softmax layer that builds on the exponential function. The choice of activation function can meaningfully affect training speed and stability, so it is worth experimenting, but ReLU is a safe starting point.
`,
      reviewCardIds: ['rc-marl-7.2-3', 'rc-marl-7.2-4'],
      illustrations: [],
    },
    {
      id: 'marl-7.2.3',
      title: 'The Universal Approximation Theorem',
      content: `
Why should we believe that neural networks can represent the complex value functions and policies we need in RL? The answer comes from a remarkable theoretical result known as the **universal approximation theorem** (Cybenko, 1989; Hornik et al., 1989).

The theorem states that a feedforward neural network with just a single hidden layer and a sufficient number of hidden units can approximate any continuous function on a closed, bounded subset of R^n to arbitrary accuracy. In other words, if the function you want to learn is continuous, there always exists a (possibly very wide) single-hidden-layer network that gets as close to it as you like.

This is a powerful existence result, but it comes with important caveats:

First, the theorem tells us that a solution **exists**; it says nothing about whether gradient-based training will **find** it. In practice, optimisation landscapes are non-convex and riddled with local minima and saddle points. A network might have the capacity to represent a perfect value function, yet training may converge to a mediocre approximation.

Second, while a single wide layer is theoretically sufficient, in practice **deeper networks with multiple layers** tend to learn better representations with fewer total parameters. Deep networks can compose features hierarchically: early layers extract simple patterns, and later layers combine them into higher-level abstractions. This hierarchical composition is one of the central insights of deep learning and is especially valuable for processing raw sensory input like images.

For RL specifically, the universal approximation theorem gives us confidence that neural networks are expressive enough to represent the value functions and policies we care about -- provided we make them large enough and train them carefully. The practical challenge is not representational capacity but **optimisation**: finding good parameters efficiently, stabilising training in the non-stationary RL setting, and avoiding the pitfalls of the deadly triad.

This combination of theoretical expressiveness and practical flexibility is why neural networks have become the dominant function approximator in modern RL and MARL research.
`,
      reviewCardIds: ['rc-marl-7.2-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Feedforward neural networks (MLPs) consist of sequential layers: an input layer, one or more hidden layers, and an output layer. Each layer applies a linear transformation followed by a non-linear activation function.
- A single neural unit computes g(w^T x + b), and a full layer is the vectorised version: g(W^T x + b).
- ReLU is the default activation for hidden layers. Sigmoid and tanh are used when bounded outputs are needed.
- The universal approximation theorem guarantees that a sufficiently wide single-hidden-layer network can approximate any continuous function, but deeper networks learn better representations in practice.
- For RL, neural networks provide the expressiveness needed to represent complex value functions and policies, but practical challenges lie in optimisation and training stability.`,
};

export default lesson;
