/**
 * Lesson 7.3: Gradient-Based Optimisation and Backpropagation
 *
 * Covers: Loss functions, gradient descent and Adam, backpropagation
 * Source sections: 7.4
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.3',
  title: 'Gradient-Based Optimisation and Backpropagation',
  sections: [
    {
      id: 'marl-7.3.1',
      title: 'Loss Functions: Defining What "Good" Means',
      content: `
A neural network starts life with random parameters. To turn it into a useful function approximator, we need two things: a measure of how wrong the current parameters are, and a method to make them less wrong. The measure is the **loss function** $L(\\theta)$, and the method is gradient-based optimisation.

The loss function must be **differentiable** with respect to the network parameters $\\theta$, because we need to compute gradients. The goal of training is to find parameters $\\theta^*$ that minimise the loss:

$$\\theta^* = \\arg\\min_{\\theta} L(\\theta)$$

The choice of loss depends on what the network is approximating. For a **state-value function** trained with supervised targets (where we know the true values $V^\\pi(s)$), the standard choice is the **mean squared error (MSE)**:

$$L(\\theta) = \\frac{1}{B} \\sum_{k=1}^{B} \\left( V^\\pi(s_k) - \\hat{V}(s_k; \\theta) \\right)^2$$

Here $B$ is the batch size -- the number of state-value pairs used in a single update. In RL, we rarely know the true values, so we substitute bootstrapped estimates from temporal-difference learning:

$$L(\\theta) = \\frac{1}{B} \\sum_{i=1}^{B} \\left( r_i + \\gamma \\hat{V}(s'_i; \\theta) - \\hat{V}(s_i; \\theta) \\right)^2$$

This TD loss drives the value function toward self-consistency: for each transition, the predicted value of the current state should approximately equal the immediate reward plus the discounted value of the next state. The key subtlety is that the target $r + \\gamma \\hat{V}(s')$ also depends on $\\theta$, which creates the moving-target problem we discussed previously.

For **policy networks**, the loss is derived from the policy gradient theorem and typically involves the log-probability of the chosen action weighted by return estimates. We will formalise this in the policy gradient lessons. The important point for now is that every deep RL algorithm defines a differentiable loss, and training proceeds by repeatedly minimising it.
`,
      reviewCardIds: ['rc-marl-7.3-1', 'rc-marl-7.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.3.2',
      title: 'Gradient Descent, Mini-Batches, and Adam',
      content: `
Once we have a differentiable loss, we can compute its **gradient** with respect to the parameters:

$$\\nabla_{\\theta} L(\\theta) = \\left( \\frac{\\partial L}{\\partial \\theta_1}, \\ldots, \\frac{\\partial L}{\\partial \\theta_d} \\right)$$

This gradient vector points in the direction of steepest increase of the loss. We update the parameters in the opposite direction -- **gradient descent** -- to reduce the loss:

$$\\theta \\leftarrow \\theta - \\alpha \\nabla_{\\theta} L(\\theta)$$

where $\\alpha$ is the **learning rate**, a small positive constant typically between $10^{-5}$ and $10^{-2}$.

**Vanilla gradient descent** computes the gradient over the entire dataset. This is stable but slow and memory-intensive. **Stochastic gradient descent (SGD)** uses a single sample, which is fast but has high variance. The practical sweet spot is **mini-batch gradient descent**, which computes the gradient over a batch of $B$ samples (commonly 32 to 1024). This gives a good tradeoff: lower variance than SGD, much less computation than full-batch.

Beyond vanilla SGD, the most widely used optimiser in deep RL is **Adam** (Kingma and Ba, 2015). Adam maintains running estimates of the first moment (mean) and second moment (uncentred variance) of the gradient, effectively adapting the learning rate for each parameter individually. This makes training less sensitive to the initial learning rate and accelerates convergence, especially in the non-stationary landscapes common in RL.

Another important idea is **momentum** (Polyak, 1964). Instead of following only the current gradient, momentum keeps a running average of past gradients and adds it to the update. This "accelerates" optimisation when gradients consistently point in the same direction, helping the optimiser traverse flat regions faster. **Nesterov momentum** further refines this by computing the gradient at a "look-ahead" position, improving stability.

In practice, the choice of optimiser matters. Adam is a safe default for most deep RL work. The batch size, learning rate, and (for Adam) the epsilon stability constant are the hyperparameters most worth tuning.
`,
      reviewCardIds: ['rc-marl-7.3-3', 'rc-marl-7.3-4'],
      illustrations: [],
    },
    {
      id: 'marl-7.3.3',
      title: 'Backpropagation: Computing Gradients Efficiently',
      content: `
Gradient-based optimisation requires the gradient $\\nabla_{\\theta} L(\\theta)$ -- the partial derivative of the loss with respect to every parameter in the network. A modern RL network may have thousands or millions of parameters spread across many layers. Computing each partial derivative from scratch would be prohibitively expensive. **Backpropagation** (Rumelhart, Hinton, and Williams, 1986) solves this problem by exploiting the compositional structure of the network.

Recall that a feedforward network is a composition of layer functions: $f(\\mathbf{x}; \\theta) = f_K( \\ldots f_2(f_1(\\mathbf{x}; \\theta_1); \\theta_2) \\ldots ; \\theta_K)$. The **chain rule** of calculus tells us how to differentiate composite functions. For $z = f(g(x))$:

$$\\nabla_x z = \\left( \\frac{\\partial g}{\\partial x} \\right)^T \\nabla_{g(x)} z$$

In words: to find how a change in $x$ affects the final output $z$, multiply the Jacobian of the inner function $g$ by the gradient of the outer function $f$.

Backpropagation applies this rule layer by layer, starting from the loss at the output and working backward toward the input. This backward traversal is called the **backward pass**, in contrast to the **forward pass** that computes the network's output for a given input.

Here is the key efficiency insight: during the forward pass, each layer computes and caches its output. During the backward pass, each layer uses that cached output to compute local gradients and passes them backward. The chain rule is applied once per layer, and the gradients with respect to all parameters in that layer are computed as a byproduct. The entire process requires only two passes through the network -- one forward, one backward -- regardless of how many parameters it has.

In practice, you almost never implement backpropagation by hand. Frameworks like PyTorch and JAX implement **automatic differentiation**, which records the computational graph during the forward pass and mechanically applies the chain rule during the backward pass. As a user, you define the network architecture and loss function, call a single function (e.g. \`loss.backward()\` in PyTorch), and the framework computes all gradients for you. This abstraction is one reason deep learning has become so accessible.
`,
      reviewCardIds: ['rc-marl-7.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A differentiable loss function defines the training objective. MSE is standard for value functions; policy losses derive from the policy gradient theorem.
- Mini-batch gradient descent strikes a balance between the stability of full-batch and the speed of stochastic gradient descent.
- Adam is the most common optimiser in deep RL, adapting learning rates per parameter for faster, more robust convergence.
- Backpropagation efficiently computes gradients for all network parameters in a single backward pass by applying the chain rule layer by layer.
- Deep learning frameworks handle backpropagation automatically via automatic differentiation, so practitioners define architectures and losses while gradients are computed under the hood.`,
};

export default lesson;
