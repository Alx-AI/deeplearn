/**
 * Lesson 8.8: Homogeneous Agents: Parameter and Experience Sharing
 *
 * Covers: Homogeneous agents, parameter sharing, experience sharing and symmetry breaking
 * Source sections: 9.7
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.8',
  title: 'Homogeneous Agents: Parameter and Experience Sharing',
  sections: [
    {
      id: 'marl-8.8.1',
      title: 'Weakly and Strongly Homogeneous Agents',
      content: `
As the number of agents increases, the parameter space of deep MARL grows linearly -- each agent has its own policy network, value network, and potentially agent models. Training all these networks is slow and data-hungry. But in many environments, agents are fundamentally similar. Can we exploit this similarity?

The book defines two levels of agent homogeneity.

**Weakly homogeneous agents:** for any joint policy pi = (pi_1, pi_2, ..., pi_n) and any permutation sigma of agents, swapping which agent runs which policy does not change the expected returns:

U_i(pi) = U_{sigma(i)}(<pi_{sigma(1)}, pi_{sigma(2)}, ..., pi_{sigma(n)}>)  for all i

Intuitively, agents have interchangeable roles -- if you swapped agent 1's policy with agent 2's, neither agent's performance would change. Level-based foraging is an example: agents are randomly assigned levels and start at random positions, making them interchangeable in principle.

**Strongly homogeneous agents:** the environment is weakly homogeneous AND the optimal joint policy consists of identical individual policies: pi_1* = pi_2* = ... = pi_n*. This is a stronger condition. It holds when the environment has a single shared goal and agents can all pursue it the same way. For example, if all agents need to reach the same landmark, they should all learn the same "move toward the landmark" policy.

Crucially, weakly homogeneous does NOT imply strongly homogeneous. Consider two agents that each must reach a *different* landmark. Swapping their policies still works (each reaches the other's landmark), so they are weakly homogeneous. But the optimal policy requires different behaviors (go to different places), so they are NOT strongly homogeneous.

This distinction matters because **parameter sharing** -- the main efficiency technique -- implicitly assumes strong homogeneity by forcing all agents to use the same policy. Applying it in weakly-but-not-strongly homogeneous environments can prevent agents from learning the distinct behaviors needed for optimal coordination.
`,
      reviewCardIds: ['rc-marl-8.8-1', 'rc-marl-8.8-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.8.2',
      title: 'Parameter Sharing',
      content: `
**Parameter sharing** means all agents use the same neural network parameters:

theta_shared = theta_1 = theta_2 = ... = theta_n (and/or phi_shared = phi_1 = ... = phi_n)

Every agent runs the same policy network and/or value network. When any agent generates an experience, the gradient update modifies the shared parameters that all agents use. This has two major benefits:

1. **Constant parameter count.** The number of parameters does not grow with the number of agents. Ten agents cost the same as one in terms of model size.

2. **N-times more training data.** Each gradient step uses experiences from all N agents, effectively multiplying the training data by N. This dramatically improves sample efficiency.

The book demonstrates this with level-based foraging (6x6 grid, two agents, one item requiring cooperation). Four variants of independent A2C were tested: (i) full parameter sharing (actor and critic), (ii) critic-only sharing, (iii) actor-only sharing, and (iv) no sharing. Full sharing converges significantly faster than no sharing, though all variants eventually reach similar final performance.

The caveat is that parameter sharing **constrains** the joint policy to consist of identical individual policies. In environments with strongly homogeneous agents, this is fine -- the optimal policy is identical across agents anyway. But in environments with only weakly homogeneous agents, this constraint is too restrictive.

A common workaround: include the **agent index** i as part of the observation, creating a modified observation bar{o}_i^t = (o_i^t, i). Since each agent always sees its own unique index, agents *can* in principle learn different behaviors. In practice, however, neural networks may lack the representational capacity to develop truly distinct strategies from a one-hot index alone (Christianos et al. 2021).

QMIX uses parameter sharing by default: all agent utility networks share weights, with agent ID provided as input. This is one of the implementation details that significantly contributes to QMIX's strong empirical performance.
`,
      reviewCardIds: ['rc-marl-8.8-3', 'rc-marl-8.8-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.8.3',
      title: 'Experience Sharing and Symmetry Breaking',
      content: `
Parameter sharing forces identical policies. What if we want the benefits of sharing data without constraining agents to behave identically? **Experience sharing** provides exactly this.

The simplest form: in IDQN, replace per-agent replay buffers D_1, ..., D_n with a single **shared replay buffer** D_shared. Each agent stores its transitions in D_shared, and any agent can sample transitions originally collected by *any* agent. Since the agents are (weakly) homogeneous, a transition collected by agent 2 is just as valid for training agent 1.

A subtlety: simply sharing the buffer without changing the training loop does not help much, because the number of samples drawn per update step stays the same. To benefit from the larger buffer, each agent should draw *more* samples per step, effectively performing multiple gradient updates per environment interaction.

For **on-policy** algorithms (A2C, PPO), experience sharing is trickier because the data must come from the current policy. **Shared Experience Actor-Critic (SEAC)** (Christianos et al. 2020) solves this with **importance sampling**. The loss for agent i includes both its own on-policy trajectory and the trajectories of other agents, re-weighted to correct for the off-policy distribution:

L(phi_i) = [on-policy term for agent i] - lambda * sum_{k != i} [pi(a_k | h_k ; phi_i) / pi(a_k | h_k ; phi_k)] * Adv_k * log pi(a_k | h_k ; phi_i)

The importance ratio pi(phi_i) / pi(phi_k) corrects for the fact that agent k's trajectory was generated by agent k's policy, not agent i's. The hyperparameter lambda controls the weight given to other agents' experiences.

Experience sharing has two key advantages over parameter sharing. First, it allows agents to learn **different policies**, which is essential in weakly homogeneous environments where the optimal joint policy requires diverse behaviors. Second, it ensures **uniform learning progression**: if one agent discovers a successful strategy, its experiences populate the shared buffer, allowing other agents to quickly learn from it. This reduces the coordination problem of agents learning at different rates.

The tradeoff: experience sharing maintains separate network parameters for each agent, so computational cost scales linearly with the number of agents. Parameter sharing is cheaper but more restrictive.
`,
      reviewCardIds: ['rc-marl-8.8-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Weakly homogeneous agents can swap policies without changing returns; strongly homogeneous agents additionally have identical optimal policies.
- Parameter sharing (all agents share one network) offers constant parameter count and N-times more data, but constrains agents to identical policies.
- Agent-ID input (appending the agent index to observations) is a common workaround but may not enable truly distinct strategies in practice.
- Experience sharing (shared replay buffer or importance-sampled trajectories) allows distinct policies while still benefiting from all agents' data.
- SEAC uses importance sampling to correct for off-policy data when sharing on-policy trajectories between agents.
- Experience sharing ensures uniform learning progression: successful strategies discovered by one agent quickly propagate to others.
- Parameter sharing is best for strongly homogeneous environments; experience sharing is better for weakly homogeneous environments.`,
};

export default lesson;
