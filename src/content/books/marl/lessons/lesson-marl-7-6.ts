/**
 * Lesson 7.6: Policy Gradient Theorem and REINFORCE
 *
 * Covers: Policy gradient theorem, REINFORCE, variance reduction with baselines
 * Source sections: 8.2.1-8.2.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.6',
  title: 'Policy Gradient Theorem and REINFORCE',
  sections: [
    {
      id: 'marl-7.6.1',
      title: 'Why Learn a Policy Directly?',
      content: `
DQN and other value-based methods learn a value function and derive a policy from it (e.g. epsilon-greedy). **Policy gradient** methods take a fundamentally different approach: they represent the policy itself as a parameterised function $\\pi(a \\mid s; \\phi)$ and optimise its parameters directly to maximise expected returns.

This direct approach has two key advantages. First, parameterised policies are **far more flexible** than epsilon-greedy policies. An epsilon-greedy policy can only assign high probability to the greedy action and spread the remaining probability uniformly; it cannot represent an arbitrary distribution over actions. A parameterised policy using a **softmax** output can assign any probability to any action:

$$\\pi(a \\mid s; \\phi) = \\frac{\\exp(l(s, a; \\phi))}{\\sum_{a'} \\exp(l(s, a'; \\phi))}$$

where $l(s, a; \\phi)$ is the network's raw output (logit) for action $a$. This flexibility is critical in partially observable and multi-agent settings, where the optimal policy may be genuinely **stochastic**. In Rock-Paper-Scissors, for example, the Nash equilibrium requires each action with probability $1/3$ -- an epsilon-greedy policy can only represent this at $\\epsilon = 1$, which defeats the purpose of learning.

Second, policy gradient methods naturally extend to **continuous action spaces**. A policy network can output the mean and standard deviation of a Gaussian distribution, from which continuous actions are sampled. Value-based methods like DQN require one output per action and therefore cannot handle infinite action sets.

The **policy gradient theorem** (Sutton and Barto, 2018) provides the theoretical foundation. It expresses the gradient of the expected return $J(\\phi)$ with respect to the policy parameters:

$$\\nabla_{\\phi} J(\\phi) = \\mathbb{E}_{s \\sim \\Pr(\\cdot | \\pi),\\, a \\sim \\pi} \\left[ Q^\\pi(s, a) \\cdot \\nabla_{\\phi} \\log \\pi(a \\mid s; \\phi) \\right]$$

This expression tells us: to improve the policy, increase the probability of actions that yield high returns and decrease the probability of actions with low returns. Crucially, this gradient depends only on quantities we can sample through interaction with the environment -- it does not require knowledge of the transition function.
`,
      reviewCardIds: ['rc-marl-7.6-1', 'rc-marl-7.6-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.6.2',
      title: 'REINFORCE: Monte Carlo Policy Gradient',
      content: `
The **REINFORCE** algorithm (Williams, 1992) is the simplest instantiation of the policy gradient theorem. It approximates the expected action values $Q^\\pi(s, a)$ with **Monte Carlo returns** -- the actual discounted sum of rewards observed from time step $t$ until the end of the episode:

$$u_t = \\sum_{\\tau=t}^{T-1} \\gamma^{\\tau - t} r_\\tau$$

The REINFORCE loss for a single episode of length $T$ is:

$$L(\\phi) = -\\frac{1}{T} \\sum_{t=0}^{T-1} u_t \\log \\pi(a_t \\mid s_t; \\phi)$$

The negative sign is because we want to *maximise* returns but convention defines losses to be *minimised*. The gradient of this loss, when minimised, pushes the policy to increase the probability of actions that led to high returns and decrease the probability of actions that led to low returns.

The algorithm is straightforward: (1) collect a full episode using the current policy, (2) compute the discounted return $u_t$ for each time step, (3) compute the loss and update the parameters via gradient descent. Because the returns depend on the entire episode trajectory, REINFORCE can only update the policy after each episode terminates -- it cannot learn from partial episodes.

REINFORCE is **on-policy**: the data used for each update must come from the current policy $\\pi$. This means we cannot reuse data from previous episodes (no replay buffer). Once the parameters are updated, all previously collected experience is stale and must be discarded. This is a significant limitation for sample efficiency.

The most serious practical problem with REINFORCE is **high variance** of the gradient estimates. Monte Carlo returns depend on every state and action in the episode, each of which is a random sample from the transition function and policy. Small changes in early actions can cascade into vastly different returns, making the gradient signal noisy. This variance often leads to slow, unstable training.
`,
      reviewCardIds: ['rc-marl-7.6-3', 'rc-marl-7.6-4'],
      illustrations: [],
      codeExamples: [
        {
          title: 'REINFORCE algorithm core loop',
          language: 'python',
          code: `import torch
import torch.nn as nn

class PolicyNetwork(nn.Module):
    def __init__(self, state_dim, action_dim, hidden=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, action_dim),
        )

    def forward(self, state):
        logits = self.net(state)
        return torch.distributions.Categorical(logits=logits)

def reinforce_update(policy, optimizer, episode, gamma=0.99):
    states, actions, rewards = zip(*episode)
    T = len(rewards)

    # Compute discounted returns for each time step
    returns = []
    G = 0
    for r in reversed(rewards):
        G = r + gamma * G
        returns.insert(0, G)
    returns = torch.tensor(returns, dtype=torch.float32)

    # Compute policy loss
    log_probs = []
    for s, a in zip(states, actions):
        dist = policy(torch.tensor(s, dtype=torch.float32))
        log_probs.append(dist.log_prob(torch.tensor(a)))
    log_probs = torch.stack(log_probs)

    loss = -(log_probs * returns).mean()
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`,
        },
      ],
    },
    {
      id: 'marl-7.6.3',
      title: 'Variance Reduction with Baselines',
      content: `
The high variance of REINFORCE can be dramatically reduced by subtracting a **baseline** $b(s)$ from the return estimate. The modified policy gradient becomes:

$$\\nabla_{\\phi} J(\\phi) = \\mathbb{E}_\\pi \\left[ (Q^\\pi(s, a) - b(s)) \\cdot \\nabla_{\\phi} \\log \\pi(a \\mid s; \\phi) \\right]$$

The remarkable property is that for any baseline that depends only on the state (not the action), the expected gradient is unchanged -- the baseline does not introduce bias. This can be proven by showing that the expected gradient of the baseline term is zero:

$$\\mathbb{E}_\\pi \\left[ b(s) \\nabla_{\\phi} \\log \\pi(a \\mid s; \\phi) \\right] = \\sum_s \\Pr(s|\\pi) \\, b(s) \\, \\nabla_{\\phi} \\left( \\sum_a \\pi(a|s;\\phi) \\right) = \\sum_s \\Pr(s|\\pi) \\, b(s) \\, \\nabla_{\\phi}(1) = 0$$

The probabilities sum to 1 for any setting of $\\phi$, so the gradient of that sum is always zero. This means we get variance reduction for free, with no bias cost.

The most common choice of baseline is a learned **state-value function** $V(s; \\theta)$. The REINFORCE loss with a value-function baseline becomes:

$$L(\\phi) = -\\frac{1}{T} \\sum_{t=0}^{T-1} (u_t - V(s_t; \\theta)) \\log \\pi(a_t \\mid s_t; \\phi)$$

The value function is trained alongside the policy to minimise its own MSE loss:

$$L(\\theta) = \\frac{1}{T} \\sum_{t=0}^{T-1} (u_t - V(s_t; \\theta))^2$$

The intuition is clear: the term $(u_t - V(s_t; \\theta))$ measures how much better (or worse) the actual return was compared to the expected return. Actions that produced above-average returns get reinforced; below-average actions get discouraged. Without the baseline, even mediocre actions might receive a large positive gradient simply because the environment gives positive rewards everywhere.

This "REINFORCE with baseline" is a stepping stone toward the more powerful **actor-critic** methods we will see next. The key difference is that REINFORCE with a baseline still uses Monte Carlo returns (waiting until the end of each episode), whereas actor-critic methods use bootstrapped value estimates for faster, lower-variance updates.
`,
      reviewCardIds: ['rc-marl-7.6-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Policy gradient methods learn a parameterised policy directly, offering more flexibility than value-based epsilon-greedy policies and natural support for continuous actions.
- The policy gradient theorem provides a gradient expression proportional to $Q^\\pi(s,a) \\cdot \\nabla \\log \\pi(a|s;\\phi)$, computable from on-policy experience without knowing the transition function.
- REINFORCE approximates the policy gradient using Monte Carlo returns, but suffers from high variance and can only update after complete episodes.
- Subtracting a state-dependent baseline (typically a learned value function) from the returns reduces variance without introducing bias.
- REINFORCE is on-policy and cannot use experience replay, limiting its sample efficiency.`,
};

export default lesson;
