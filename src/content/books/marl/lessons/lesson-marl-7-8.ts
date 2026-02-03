/**
 * Lesson 7.8: Policy Gradients in Practice
 *
 * Covers: Hyperparameters, normalisation and gradient clipping, debugging tips
 * Source sections: 8.2.7, 8.2.8
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.8',
  title: 'Policy Gradients in Practice',
  sections: [
    {
      id: 'marl-7.8.1',
      title: 'Hyperparameters That Matter Most',
      content: `
Policy gradient algorithms have several hyperparameters that can dramatically affect training success. Getting them right is part engineering, part art. Here we distil the most impactful choices based on the textbook's experiments and general best practice.

**Learning rate ($\\alpha$).** This is arguably the single most important hyperparameter. Too high, and the policy oscillates or collapses; too low, and training stalls. Typical values range from $10^{-4}$ to $10^{-3}$. A2C and PPO often work well with $\\alpha = 3 \\times 10^{-4}$. The textbook's REINFORCE experiments used $\\alpha = 10^{-3}$. Learning rate schedules (e.g. linear decay) can help, but a good constant rate is a solid starting point.

**Discount factor ($\\gamma$).** Standard choice is $\\gamma = 0.99$. Lower values (0.9, 0.95) make the agent more short-sighted, which can speed up learning in simple tasks but hurt performance in environments requiring long-horizon planning. For most problems, 0.99 is a safe default.

**N-step returns ($N$).** Using N-step returns instead of one-step bootstrapping balances bias and variance. The textbook's A2C and PPO experiments use $N = 5$, which provides return estimates with reasonably low bias and variance. Typical choices range from 5 to 20.

**PPO-specific: clipping $\\epsilon$ and epochs ($N_e$).** The clipping parameter $\\epsilon = 0.2$ is the standard default. The number of optimisation epochs per batch is typically $N_e = 4$. More epochs squeeze more learning from each batch but risk overfitting to stale data even with clipping.

**Network architecture.** The textbook uses small networks -- two hidden layers of 32 units with ReLU activations -- for its level-based foraging experiments. For more complex environments, 64 or 256 units per layer is common. Actor and critic typically share the same architecture but have **separate parameters** to avoid interference between their gradients.

**Entropy coefficient.** The weight on the entropy regularisation term in A2C and PPO. A common starting value is 0.01. Too high impedes convergence; too low allows premature determinism.
`,
      reviewCardIds: ['rc-marl-7.8-1', 'rc-marl-7.8-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.8.2',
      title: 'Normalisation, Gradient Clipping, and Parallel Environments',
      content: `
Beyond hyperparameter selection, several engineering practices are critical for stable policy gradient training.

**Advantage normalisation.** The raw advantage estimates can have large magnitude and high variance across a batch. A common trick is to normalise advantages within each mini-batch to have zero mean and unit variance: $A_{\\text{norm}} = (A - \\text{mean}(A)) / (\\text{std}(A) + \\epsilon)$. This does not change which actions are better than average, but it controls the scale of the gradient, making training more stable.

**Gradient clipping.** Even with careful hyperparameter tuning, occasional large gradients can destabilise training. **Gradient norm clipping** caps the global norm of the gradient vector to a maximum value (e.g. 0.5 or 1.0): if $\\|\\mathbf{g}\\| > \\text{max\\_norm}$, scale $\\mathbf{g}$ to $\\mathbf{g} \\cdot (\\text{max\\_norm} / \\|\\mathbf{g}\\|)$. This prevents catastrophic parameter updates from outlier batches.

**Parallel (synchronous) environments.** On-policy algorithms like A2C and PPO cannot use a replay buffer, so they rely on parallelism to obtain diverse, decorrelated experience. The standard approach is **synchronous data collection**: run $K$ copies of the environment in parallel on separate CPU threads. At each time step, the agent receives a batch of $K$ states, computes $K$ actions in a single vectorised forward pass, and sends each action to its respective environment. The batch of $K$ transitions then forms the training data for one update.

This parallelisation has three benefits: (1) it provides a larger, more diverse batch for each gradient step, reducing variance; (2) different environment instances explore different parts of the state space, partly breaking temporal correlations; (3) the vectorised forward pass over $K$ inputs is highly efficient on GPUs. The textbook experiments show that A2C with $K = 16$ or $K = 64$ synchronous environments converges dramatically faster in wall-clock time than $K = 1$, though marginal returns diminish for very large $K$ due to thread synchronisation overhead.

**Asynchronous training** is an alternative: each thread runs its own environment and agent copy, computes gradients independently, and sends them to update a shared central model. This avoids idle time but introduces engineering complexity and potential gradient staleness.
`,
      reviewCardIds: ['rc-marl-7.8-3', 'rc-marl-7.8-4'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Advantage normalisation and gradient clipping',
          language: 'python',
          code: `import torch

def normalise_advantages(advantages, eps=1e-8):
    """Zero-mean, unit-variance normalisation within a batch."""
    return (advantages - advantages.mean()) / (advantages.std() + eps)

# Gradient clipping after loss.backward()
def train_step(actor, optimizer, loss, max_grad_norm=0.5):
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(actor.parameters(), max_grad_norm)
    optimizer.step()`,
        },
      ],
    },
    {
      id: 'marl-7.8.3',
      title: 'Debugging and Monitoring Deep RL Training',
      content: `
Deep RL is notoriously difficult to debug. Training curves are noisy, small bugs can silently degrade performance, and there are many moving parts. Here are practical guidelines drawn from the textbook's discussion and established best practices in the field.

**Monitor multiple metrics, not just returns.** Episodic returns are the ultimate measure of success, but they are noisy and lag behind policy changes. Also track: the critic loss (is the value function improving?), the actor loss (is it stable or spiking?), the policy entropy (is the agent still exploring?), and the explained variance of the critic (how much of the return variance does $V$ explain?). A sudden collapse in entropy often signals that the policy has prematurely committed to a suboptimal action.

**Seed variation.** Deep RL results are highly sensitive to random seeds. Always run at least 3-5 seeds and report mean and standard deviation, as the textbook does in all its experiments. A single good seed can be misleading; a single bad seed does not mean the algorithm is broken.

**Start with a simple environment.** Before deploying an algorithm on your target task, verify it works on a simple benchmark. If A2C cannot solve a basic grid-world, the bug is in your implementation, not your hyperparameters. The textbook's single-agent level-based foraging environment serves exactly this role.

**Compare against baselines.** The textbook systematically ablates: DQN vs. DQN without replay, vs. DQN without target networks, vs. the full algorithm. Similarly, always compare your method against known-working baselines. Unexpectedly poor performance from a baseline implementation usually indicates a bug.

**Verify the loss computation.** Common pitfalls include: forgetting to stop gradients through the target in DQN, accidentally averaging where you should sum (or vice versa), applying the wrong sign to the policy loss (which should be negative for maximisation), and failing to mask terminal-state values. PyTorch's autograd is powerful but unforgiving -- a misplaced \`.detach()\` or missing \`torch.no_grad()\` can be the difference between a working algorithm and one that diverges silently.

**Reward scale matters.** If rewards are very large or very small, gradients can be unstable. Reward clipping (e.g. to [-1, 1]) or reward normalisation can help significantly.
`,
      reviewCardIds: ['rc-marl-7.8-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- The learning rate is the most important hyperparameter; $3 \\times 10^{-4}$ is a common starting point for A2C and PPO. Discount factor $\\gamma = 0.99$ and N-step $N = 5$ are standard defaults.
- Advantage normalisation (zero-mean, unit-variance) and gradient norm clipping are essential for training stability.
- Synchronous parallel environments provide diverse, decorrelated batches for on-policy algorithms that cannot use replay buffers, dramatically improving wall-clock efficiency.
- Monitor critic loss, entropy, and explained variance in addition to returns. Run multiple seeds. Start with simple environments to validate implementations.
- Common bugs include missing gradient stops on targets, wrong loss signs, and failure to mask terminal states.`,
};

export default lesson;
