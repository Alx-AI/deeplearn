/**
 * Lesson 8.3: Multi-Agent Policy Gradients and Centralised Critics
 *
 * Covers: Centralized critics, MADDPG, MAPPO
 * Source sections: 9.4.1-9.4.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.3',
  title: 'Multi-Agent Policy Gradients and Centralised Critics',
  sections: [
    {
      id: 'marl-8.3.1',
      title: 'The Multi-Agent Policy Gradient Theorem and Centralised Critics',
      content: `
Independent learning ignores other agents entirely. Can we do better? The **CTDE paradigm** says yes: during training, give the critic access to centralized information while keeping the actor decentralized.

The foundation is the **multi-agent policy gradient theorem**. Recall the single-agent version: the gradient of expected returns with respect to policy parameters equals an expectation of the action-value function times the score function. The multi-agent extension recognizes that agent $i$'s expected returns depend on the policies of *all* agents:

$$\\nabla_{\\phi_i} J(\\phi_i) \\propto \\mathbb{E}\\left[ Q_i^{\\pi}(\\hat{h}, \\langle a_i, a_{-i} \\rangle) \\cdot \\nabla_{\\phi_i} \\log \\pi_i(a_i \\mid h_i \\;; \\phi_i) \\right]$$

where $\\hat{h}$ is the full history, $a_{-i}$ are other agents' actions, and $h_i = \\sigma_i(\\hat{h})$ extracts agent $i$'s observation history.

To instantiate this, we can train a **centralized critic** $V(h_i^t, z^t \\;; \\theta_i)$ that conditions on both agent $i$'s observation history and centralized information $z^t$. This centralized information might include the observations of all agents, the full environment state, or any other shared data. The critic loss becomes:

$$L(\\theta_i) = \\left( y_i - V(h_i^t, z^t \\;; \\theta_i) \\right)^2, \\quad \\text{where } y_i = r_i^t + \\gamma \\cdot V(h_i^{t+1}, z^{t+1} \\;; \\theta_i)$$

The actor loss uses the advantage computed from this centralized critic, but the actor itself is still conditioned only on local observations: $\\pi(a_i \\mid h_i^t \\;; \\phi_i)$. This is the defining feature of CTDE: **the critic sees everything, the actor sees only local information**.

Lyu et al. (2023) studied what centralized critics should receive as input. At minimum, the critic must receive the agent's own observation history $h_i^t$; without it, the critic has less information than the actor it evaluates, introducing bias. Additional centralized information $z^t$ can theoretically increase variance in the policy gradient, but in practice it often helps by allowing the critic to learn more informative representations and adapt faster to non-stationary policies.
`,
      reviewCardIds: ['rc-marl-8.3-1', 'rc-marl-8.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.3.2',
      title: 'MADDPG and Centralised Action-Value Critics',
      content: `
A centralized *state-value* critic $V(h_i, z \\;; \\theta_i)$ estimates the general value of being in a particular information state. But we can go further: a centralized **action-value** critic $Q(h_i, z, a \\;; \\theta_i)$ conditions on the *actions of all agents* as well, estimating the value of a particular joint action.

The multi-agent policy gradient using a centralized action-value critic becomes:

$$\\nabla_{\\phi_i} J(\\phi_i) = \\mathbb{E}\\left[ Q(h_i^t, z^t, \\langle a_i^t, a_{-i}^t \\rangle \\;; \\theta_i) \\cdot \\nabla_{\\phi_i} \\log \\pi_i(a_i^t \\mid h_i^t \\;; \\phi_i) \\right]$$

This is the core idea behind **MADDPG** (Multi-Agent Deep Deterministic Policy Gradient, Lowe et al. 2017), one of the most influential CTDE algorithms. Each agent has a decentralized actor and a centralized critic that receives the observations and actions of all agents.

A critical design choice is the **network architecture** for the centralized action-value critic. Naively outputting one value for each possible joint action produces an exponentially large output. Instead, the critic for agent $i$ takes the actions $a_{-i}$ of other agents as additional *inputs* and outputs one value per action of agent $i$. This way the output dimension scales linearly with agent $i$'s action space rather than exponentially with the number of agents.

Why use action-value critics instead of simpler state-value critics? The action inputs provide direct information about what other agents are doing, which helps the critic:

1. **Reduce non-stationarity**: by conditioning on other agents' actual actions, the critic no longer needs to average over their entire policy distribution.
2. **Enable credit assignment**: the critic can estimate how specific joint actions affect returns.
3. **Inform the policy gradient**: the gradient can leverage fine-grained information about the value of different action combinations.

One important caveat: the multi-agent policy gradient theorem requires estimating expected returns under the *current* policies of all agents. This means the critic must be trained on **on-policy data**. Unlike DQN, which learns optimal values from off-policy data with a replay buffer, the centralized action-value critic for CTDE actor-critic methods uses Sarsa-style targets to track current-policy returns.
`,
      reviewCardIds: ['rc-marl-8.3-3', 'rc-marl-8.3-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.3.3',
      title: 'MAPPO and Practical Considerations',
      content: `
**MAPPO** (Multi-Agent PPO) applies the same CTDE principle using PPO as the underlying algorithm. Each agent has a decentralized policy (actor) and a centralized value function (critic). The critic typically conditions on the global state or joint observations, while each agent's policy uses only its own observations.

MAPPO has become one of the most widely used deep MARL algorithms, partly due to its simplicity and robustness. Like single-agent PPO, it clips the policy ratio to prevent destructively large updates:

$$L_{\\text{clip}}(\\phi_i) = \\min\\left( \\text{ratio} \\cdot \\text{Adv}, \\; \\text{clip}(\\text{ratio}, 1-\\epsilon, 1+\\epsilon) \\cdot \\text{Adv} \\right)$$

where the advantage is computed using the centralized critic. The centralized critic's broader view of the environment typically provides more stable advantage estimates than a decentralized critic would.

The book illustrates the benefit of centralized critics with the **speaker-listener game**. A listener agent is placed among three landmarks and can see its own position and the landmarks. A speaker agent can only see which landmark is the goal and can transmit an integer (1 to 3) to the listener. The agents must cooperate: the speaker identifies the goal, communicates it, and the listener navigates to the correct landmark.

This environment is challenging because of extreme partial observability: neither agent alone has enough information to solve the task. A centralized critic conditioned on *both* agents' observations can accurately estimate values by seeing both the goal information (from the speaker's view) and the spatial layout (from the listener's view). The book shows that centralized-critic A2C significantly outperforms independent A2C on this task, converging to higher returns.

Practical considerations for centralized critics include:

- **What to include in $z$**: start with the full state or joint observations; adding too much irrelevant information can increase variance.
- **Scalability**: centralized critics that concatenate all agents' observations face input dimensions that grow linearly with the number of agents. Attention mechanisms or mean-field approximations can help.
- **When centralized critics help most**: in environments with strong partial observability, significant inter-agent dependencies, or shared rewards where credit assignment matters.
`,
      reviewCardIds: ['rc-marl-8.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- The multi-agent policy gradient theorem extends the single-agent version by recognizing that each agent's returns depend on all agents' policies.
- Centralized critics ($V$ or $Q$) access shared information during training, while actors remain decentralized for execution -- the core CTDE pattern.
- MADDPG uses centralized action-value critics that receive other agents' actions as input, scaling the output dimension linearly rather than exponentially.
- MAPPO applies PPO with a centralized state-value critic and is one of the most popular CTDE algorithms due to simplicity and robustness.
- Centralized critics help most in environments with partial observability, inter-agent dependencies, or where credit assignment is important.
- At minimum, a centralized critic should always include the agent's own observation history to avoid introducing bias.`,
};

export default lesson;
