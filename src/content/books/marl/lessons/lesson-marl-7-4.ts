/**
 * Lesson 7.4: Convolutional and Recurrent Networks
 *
 * Covers: CNNs for spatial data, RNNs/LSTMs for sequences, when to use which in RL
 * Source sections: 7.5, 7.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.4',
  title: 'Convolutional and Recurrent Networks',
  sections: [
    {
      id: 'marl-7.4.1',
      title: 'CNNs: Exploiting Spatial Structure in Images',
      content: `
Feedforward networks can process any vector input, but they are a poor fit for images. An image of just $128 \\times 128$ RGB pixels is a vector of length 49,152. A first hidden layer with 128 units would need over 6 million parameters just for the weight matrix -- and that is a tiny image. Worse, feedforward layers treat every pixel independently, ignoring the spatial relationships that make images meaningful: nearby pixels tend to belong to the same object.

**Convolutional neural networks (CNNs)** exploit this spatial structure using two key ideas: **parameter sharing** and **local connectivity**. Instead of connecting every input pixel to every hidden unit, a CNN slides small learnable filters (also called **kernels**) across the image. Each filter is a small matrix, e.g. $3 \\times 3$ or $5 \\times 5$, that computes a weighted sum over a patch of nearby pixels at each position:

$$y_{i,j} = \\sum_{a,b} W_{a,b} \\cdot x_{i+a-1,\\, j+b-1}$$

The same filter parameters are reused at every position, so a $5 \\times 5$ filter for three colour channels has only 75 weights plus a bias -- compared to millions in a fully-connected layer. This **weight sharing** dramatically reduces the number of parameters while encoding the assumption that useful patterns (edges, textures, shapes) can appear anywhere in the image.

Two hyperparameters control how the filter moves: **stride** (number of pixels it shifts per step) and **padding** (extra border pixels, usually zeros, added around the image). After the convolution, a non-linear activation function (typically ReLU) is applied element-wise. Then a **pooling** layer -- usually max-pooling -- aggregates small patches of the output (e.g. taking the maximum of each $2 \\times 2$ block), reducing the spatial resolution and making the representation invariant to small translations.

A typical CNN stacks several convolution-activation-pooling blocks, progressively shrinking the spatial dimensions while increasing the number of learned feature maps. The final compact representation is then fed into a feedforward network for prediction. In RL, CNNs are the standard way to process pixel-based observations -- for example, Atari game screens or robotic camera feeds.
`,
      reviewCardIds: ['rc-marl-7.4-1', 'rc-marl-7.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.4.2',
      title: 'RNNs and LSTMs: Processing Sequences with Memory',
      content: `
In many RL environments, especially partially observable ones, the agent receives a sequence of observations rather than a single complete state. It needs to remember what it saw earlier in the episode to make good decisions now. Feedforward networks have no mechanism for this: they process each input independently with no memory of previous inputs.

**Recurrent neural networks (RNNs)** solve this by maintaining a **hidden state** $h_t$ that serves as a compact summary of all observations seen so far. At each time step $t$, the network receives the current input $x_t$ and the previous hidden state $h_{t-1}$, and produces an updated hidden state:

$$h_t = f(x_t, h_{t-1}; \\theta)$$

The hidden state $h_0$ is typically initialised to zeros at the start of each episode. The same parameters $\\theta$ are reused at every time step, so the network naturally handles sequences of any length. This architecture means the RNN can, in principle, condition its output on the entire history of observations.

In practice, vanilla RNNs struggle with long sequences. During backpropagation through time, gradients are repeatedly multiplied by the Jacobian of the recurrence. If these factors are consistently less than 1, gradients **vanish** (approaching zero), making the network unable to learn long-range dependencies. If they are greater than 1, gradients **explode** (growing unboundedly), causing training instability.

**Long Short-Term Memory (LSTM)** networks (Hochreiter and Schmidhuber, 1997) and **Gated Recurrent Units (GRUs)** (Cho et al., 2014) address this with gating mechanisms. These architectures include learned gates that control when to write new information into the hidden state, when to read from it, and when to forget accumulated information. The gates create paths through which gradients can flow over many time steps without vanishing, enabling the network to capture long-range dependencies.

In RL and MARL, LSTMs and GRUs are the standard recurrent architectures. They appear inside policy and value networks whenever the agent must reason about a history of observations rather than a single state.
`,
      reviewCardIds: ['rc-marl-7.4-3', 'rc-marl-7.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-7.4.3',
      title: 'Choosing the Right Architecture for RL Problems',
      content: `
With three major architecture families in hand -- feedforward networks (MLPs), convolutional networks (CNNs), and recurrent networks (RNNs/LSTMs) -- the natural question is: when should you use each?

**Feedforward networks** are the default and the most broadly applicable. If the environment provides a compact, fully observable state vector (joint positions, velocities, inventory counts, etc.), an MLP is usually the right choice. It is simple, fast to train, and sufficient for a wide range of tasks. Most deep RL papers that work with vector-valued states use two-layer MLPs with 64 to 256 hidden units per layer and ReLU activations.

**CNNs** are the right choice when the input has **spatial structure** -- primarily images, but also grid-world representations or any tensor where nearby elements are correlated. In the landmark DQN work by Mnih et al. (2015), a CNN processed raw Atari game frames to produce action-value estimates. The typical pattern in RL is a CNN "encoder" that compresses the high-dimensional image into a compact feature vector, followed by an MLP "head" that maps that vector to values or action probabilities.

**RNNs (LSTMs/GRUs)** are needed when the environment is **partially observable** and the agent must reason about a history of observations. The agent receives one observation per time step, and the recurrent hidden state accumulates information over the episode. In practice, the recurrent module is inserted into the middle of the network: the observation may first pass through a CNN (if it is an image) or an MLP, and the resulting feature vector is fed into the LSTM, whose output is then passed to the value or policy head.

These architectures are also frequently **combined**. A partially observable environment with image observations might use a CNN to encode each frame, an LSTM to aggregate the encoded frames over time, and an MLP head to produce the final output. The composability of neural network modules is one of deep learning's great strengths, and RL practitioners routinely mix and match architectures to suit the structure of their problem.
`,
      reviewCardIds: ['rc-marl-7.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- CNNs exploit spatial structure by sliding small, shared filters across images, dramatically reducing parameters compared to fully connected layers. Pooling layers reduce spatial resolution and add translation invariance.
- RNNs maintain a hidden state that accumulates information over a sequence of inputs, enabling agents to condition on observation histories.
- Vanilla RNNs suffer from vanishing/exploding gradients; LSTMs and GRUs solve this with gating mechanisms that control information flow.
- Use MLPs for compact vector states, CNNs for image/spatial inputs, and RNNs for partially observable environments requiring memory.
- These architectures are composable: a common RL pattern is CNN encoder followed by LSTM followed by MLP head.`,
};

export default lesson;
