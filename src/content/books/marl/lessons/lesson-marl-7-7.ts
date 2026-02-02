/**
 * Lesson 7.7: Actor-Critic Methods: A2C and PPO
 *
 * Covers: Actor-critic architecture, A2C and advantage, PPO clipped objective
 * Source sections: 8.2.4-8.2.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.7',
  title: 'Actor-Critic Methods: A2C and PPO',
  sections: [
    {
      id: 'marl-7.7.1',
      title: 'The Actor-Critic Architecture',
      content: `
REINFORCE must wait until the end of an episode to compute returns and update the policy. In environments with long episodes, this means infrequent updates and slow learning. **Actor-critic** methods address this by pairing the policy (the **actor**) with a learned value function (the **critic**) that can provide immediate feedback after every transition.

The actor is a parameterised policy pi(a | s; phi) -- exactly as in REINFORCE. The critic is a state-value function V(s; theta) that estimates the expected return from state s under the current policy. Together they form a two-network architecture, each with its own parameters and loss function.

The critic enables **bootstrapped return estimates**. Instead of waiting for the full Monte Carlo return u_t, the actor-critic can estimate the return from a single transition:

E[u_t | s_t] approx r_t + gamma * V(s_{t+1}; theta)

This one-step bootstrapped estimate has **much lower variance** than Monte Carlo returns because it depends on only a single reward and one value prediction, rather than the entire remaining trajectory. The tradeoff is **bias**: if the critic is inaccurate, the estimates will be biased. In practice, this bias-variance tradeoff strongly favours bootstrapping, leading to faster and more stable training.

A middle ground is **N-step returns**, which aggregate N actual rewards before bootstrapping:

G_t^{(N)} = sum_{tau=0}^{N-1} gamma^tau * r_{t+tau} + gamma^N * V(s_{t+N}; theta)

Small N (like 5 or 10) gives low variance with moderate bias, and is the most common choice in practice. Setting N equal to the full episode length recovers the unbiased Monte Carlo return.

The critic is trained with the standard value-function MSE loss, using the same N-step targets. The actor and critic are updated together, typically at every time step, making actor-critic methods significantly more sample-efficient than REINFORCE.
`,
      reviewCardIds: ['rc-marl-7.7-1', 'rc-marl-7.7-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.7.2',
      title: 'A2C: The Advantage Actor-Critic',
      content: `
**Advantage Actor-Critic (A2C)** (Mnih et al., 2016) refines the actor-critic framework by using the **advantage function** to guide policy updates. The advantage is defined as:

Adv(s, a) = Q^pi(s, a) - V^pi(s)

It measures how much better action a is compared to the average action under the current policy in state s. A positive advantage means the action yielded higher-than-expected returns; a negative advantage means it did worse than average.

The beauty of the advantage is that we do not need a separate Q-network. We can estimate the advantage using only the state-value critic:

Adv(s_t, a_t) = r_t + gamma * V(s_{t+1}; theta) - V(s_t; theta)

This is simply the **TD error**: the difference between what the agent actually received (reward plus discounted next-state value) and what it expected (current state value). When the TD error is positive, the action outperformed expectations and should become more probable.

The A2C actor loss is:

L(phi) = -Adv(s_t, a_t) * log pi(a_t | s_t; phi)

The critic loss is the standard squared TD error:

L(theta) = (y_t - V(s_t; theta))^2, where y_t = r_t + gamma * V(s_{t+1}; theta)

A2C commonly adds **entropy regularisation** to the actor loss: the negative entropy of the policy, -H(pi(. | s; phi)) = sum_a pi(a|s;phi) * log pi(a|s;phi), is added as a bonus term. Maximising entropy discourages premature convergence to a near-deterministic policy, encouraging continued exploration. The entropy coefficient is a hyperparameter that balances exploration and exploitation.

In the textbook's experiments, A2C with N-step returns (N=5) converges stably to optimal performance in the level-based foraging environment, far outperforming REINFORCE in both speed and stability.
`,
      reviewCardIds: ['rc-marl-7.7-3', 'rc-marl-7.7-4'],
      illustrations: [],
      codeExamples: [
        {
          title: 'A2C update step',
          language: 'python',
          code: `def a2c_update(actor, critic, optimizer_actor, optimizer_critic,
               state, action, reward, next_state, done, gamma=0.99):
    state_t = torch.tensor(state, dtype=torch.float32)
    next_state_t = torch.tensor(next_state, dtype=torch.float32)

    # Critic: compute advantage and value target
    with torch.no_grad():
        next_value = 0.0 if done else critic(next_state_t).item()
    target = reward + gamma * next_value
    value = critic(state_t)
    advantage = target - value.item()

    # Critic loss: squared TD error
    critic_loss = (torch.tensor(target) - value) ** 2
    optimizer_critic.zero_grad()
    critic_loss.backward()
    optimizer_critic.step()

    # Actor loss: negative advantage-weighted log probability
    dist = actor(state_t)  # returns Categorical distribution
    log_prob = dist.log_prob(torch.tensor(action))
    actor_loss = -advantage * log_prob
    optimizer_actor.zero_grad()
    actor_loss.backward()
    optimizer_actor.step()`,
        },
      ],
    },
    {
      id: 'marl-7.7.3',
      title: 'PPO: Proximal Policy Optimization',
      content: `
A2C updates the policy with a single gradient step per batch of data, then discards the data (since it is now off-policy). **Proximal Policy Optimization (PPO)** (Schulman et al., 2017) overcomes this waste by allowing **multiple epochs** of updates on the same data, using a clipped surrogate objective to prevent the policy from changing too much.

The key insight is **importance sampling**. If the data was collected by a behaviour policy pi_beta, we can adjust the gradient using the ratio:

rho(s, a) = pi(a | s; phi) / pi_beta(a | s)

When rho = 1, the current and behaviour policies agree. As the policy is updated, rho deviates from 1, indicating how much the policy has shifted. PPO constrains this ratio to prevent destructively large updates.

The **PPO clipped objective** is:

L(phi) = -min(rho * Adv, clip(rho, 1-epsilon, 1+epsilon) * Adv)

where epsilon (typically 0.2) defines the allowed range. If the advantage is positive and rho exceeds 1 + epsilon, the clipped term prevents further increase -- the policy has moved far enough in that direction. If the advantage is negative and rho drops below 1 - epsilon, clipping again stops the update. This mechanism acts as a computationally cheap approximation to a **trust region**, the idea that each update should keep the new policy close to the old one.

In practice, PPO collects a batch of experience, stores the log-probabilities under the behaviour policy pi_beta, and then runs several optimisation epochs (commonly N_e = 4) on the same batch, recomputing rho at each epoch. The clipping ensures that even after several epochs, the policy does not drift too far.

The textbook's experiments show that PPO learns slightly faster than A2C in the level-based foraging environment because it extracts more learning signal from each batch. PPO has become one of the most widely used deep RL algorithms due to its simplicity, strong empirical performance, and robust behaviour across a wide range of tasks and hyperparameter settings. It is the default policy gradient method in many MARL implementations.
`,
      reviewCardIds: ['rc-marl-7.7-5'],
      illustrations: [],
      codeExamples: [
        {
          title: 'PPO clipped surrogate loss',
          language: 'python',
          code: `def ppo_actor_loss(actor, states, actions, old_log_probs,
                   advantages, epsilon=0.2):
    """Compute PPO clipped surrogate objective."""
    dist = actor(states)  # Categorical distribution
    new_log_probs = dist.log_prob(actions)

    # Importance sampling ratio
    ratio = torch.exp(new_log_probs - old_log_probs)

    # Clipped surrogate objective
    surr1 = ratio * advantages
    surr2 = torch.clamp(ratio, 1 - epsilon, 1 + epsilon) * advantages
    loss = -torch.min(surr1, surr2).mean()

    # Optional: add entropy bonus for exploration
    entropy_bonus = dist.entropy().mean()
    loss = loss - 0.01 * entropy_bonus
    return loss`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- Actor-critic methods pair a policy network (actor) with a value network (critic). The critic enables bootstrapped return estimates for faster, lower-variance updates than REINFORCE.
- The advantage function Adv(s,a) = Q(s,a) - V(s) measures how much better an action is than average. In A2C, it is estimated from the TD error: r + gamma*V(s') - V(s).
- A2C adds entropy regularisation to encourage exploration and prevent premature convergence to deterministic policies.
- PPO allows multiple epochs of optimisation on the same batch by clipping the importance sampling ratio, preventing destructively large policy updates.
- PPO is one of the most widely used RL algorithms due to its simplicity, stability, and strong empirical performance across tasks.`,
};

export default lesson;
