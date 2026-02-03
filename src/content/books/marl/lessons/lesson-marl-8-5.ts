/**
 * Lesson 8.5: Value Decomposition: VDN and QMIX
 *
 * Covers: Value decomposition idea, VDN (additive), QMIX (monotone mixing network)
 * Source sections: 9.5.1-9.5.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.5',
  title: 'Value Decomposition: VDN and QMIX',
  sections: [
    {
      id: 'marl-8.5.1',
      title: 'The Value Decomposition Idea and the IGM Property',
      content: `
Centralized action-value functions are powerful but have two problems: (1) they are hard to learn because the joint-action space grows exponentially, and (2) they do not directly enable decentralized execution -- choosing greedy actions requires searching over all joint actions. **Value decomposition** solves both problems by breaking the centralized Q-function into individual **utility functions**, one per agent.

Each agent $i$ learns a utility function $Q(h_i, a_i \\;; \\theta_i)$ that depends only on its own observation history and action. Agents select actions greedily with respect to their individual utilities: $a_i = \\arg\\max Q(h_i, a_i \\;; \\theta_i)$. The critical question: does greedy action selection by each agent individually produce the same result as greedy selection over the full joint-action space?

This is the **Individual-Global-Max (IGM) property**: a decomposition satisfies IGM if and only if, for all histories and centralized information:

$$a \\in A^*(h, z \\;; \\theta) \\iff \\forall i: a_i \\in A^*_i(h_i \\;; \\theta_i)$$

where $A^*$ denotes the set of greedy joint actions with respect to the centralized Q-function, and $A^*_i$ denotes greedy individual actions. In words: the joint action formed by each agent independently maximizing its own utility must equal a greedy joint action of the centralized function -- and vice versa.

IGM has two critical implications. First, each agent can execute its greedy policy **decentralized** using only its own utility function, and the joint result will be globally optimal (with respect to the decomposed Q-function). Second, computing the target value $\\max_a Q(h^{t+1}, a)$ during training can be done efficiently: just compute each agent's individual max and combine them, rather than searching over the exponential joint-action space.

Value decomposition algorithms are designed for **common-reward games**, where all agents share the same reward: $R_i = R_j$ for all $i, j$. The centralized action-value function estimates expected returns over these common rewards. Decomposing it into individual utilities not only simplifies learning but also naturally provides an estimate of each agent's contribution to the shared reward -- addressing credit assignment.
`,
      reviewCardIds: ['rc-marl-8.5-1', 'rc-marl-8.5-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.5.2',
      title: 'VDN: Additive Value Decomposition',
      content: `
The simplest decomposition that satisfies IGM is a **linear (additive) decomposition**. **Value Decomposition Networks (VDN)** (Sunehag et al. 2018) assume the common reward can be split into per-agent utilities that sum to the centralized value:

$$Q(h^t, z^t, a^t \\;; \\theta) = \\sum_{i \\in I} Q(h_i^t, a_i^t \\;; \\theta_i)$$

No constraints are placed on the individual utility functions -- only the shared common reward is used for optimization. VDN proves that this additive decomposition satisfies IGM: if agent $i$'s action maximizes its individual utility, then the joint action composed of all such individual greedy actions also maximizes the sum.

The proof works by contradiction. Suppose some agent $i$'s greedy action $a^*_i$ does *not* maximize its utility. Then replacing $a^*_i$ with a better action $a_i$ would increase agent $i$'s utility, which increases the sum, contradicting the assumption that $a^*$ was already a greedy joint action. The reverse direction follows similarly: if each $a^*_i$ maximizes $Q(h_i, a_i \\;; \\theta_i)$, then the sum is maximized.

VDN uses a shared replay buffer $D$ and jointly optimizes all utility networks with the loss:

$$L(\\theta) = \\frac{1}{B} \\sum \\left( r^t + \\gamma \\sum_i \\max_{a_i} Q(h_i^{t+1}, a_i \\;; \\bar{\\theta}_i) - \\sum_i Q(h_i^t, a_i^t \\;; \\theta_i) \\right)^2$$

This follows the same structure as IDQN but optimizes a common loss that flows gradients through all agents' networks. Target networks, $\\epsilon$-greedy exploration, and other DQN tricks carry over directly.

VDN's strength is simplicity. Its weakness is expressiveness: many value functions cannot be represented as a simple sum. If agent 1's contribution depends on what agent 2 does (a non-linear interaction), VDN cannot capture it. For example, in a game where $Q(A,A) = 10$, $Q(A,B) = 0$, $Q(B,A) = 0$, $Q(B,B) = 10$, no additive decomposition $Q_1(a_1) + Q_2(a_2)$ can represent this -- setting $Q_1(A) > Q_1(B)$ to match $Q(A,A) > Q(B,A)$ forces $Q(A,B) > Q(B,B)$, which is wrong.
`,
      reviewCardIds: ['rc-marl-8.5-3', 'rc-marl-8.5-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.5.3',
      title: 'QMIX: Monotonic Value Decomposition',
      content: `
**QMIX** (Rashid et al. 2018) generalizes VDN by replacing the additive decomposition with a **monotonic** one. Instead of requiring $Q = \\sum Q_i$, QMIX requires that the centralized value is a monotonically increasing function of each agent's utility:

$$\\forall i, \\; \\forall a: \\quad \\frac{\\partial Q(h, z, a \\;; \\theta)}{\\partial Q(h_i, a_i \\;; \\theta_i)} > 0$$

Intuitively: if any agent's utility for its chosen action increases, the centralized value must also increase. This is strictly weaker than linearity (every sum is monotonic, but not every monotonic function is a sum), so QMIX can represent a strictly larger class of value functions.

QMIX implements monotonicity through a **mixing network** $f_{\\text{mix}}$: a feedforward neural network that takes individual utilities as input and outputs the centralized value:

$$Q(h, z, a \\;; \\theta) = f_{\\text{mix}}(Q(h_1, a_1 \\;; \\theta_1), \\ldots, Q(h_n, a_n \\;; \\theta_n) \\;; \\theta_{\\text{mix}})$$

Monotonicity is enforced by requiring all weights in the mixing network to be **non-negative**. The parameters $\\theta_{\\text{mix}}$ of the mixing network are not learned directly -- instead, a **hypernetwork** $f_{\\text{hyper}}$ receives the centralized information $z$ as input and outputs the mixing network's weights and biases. The hypernetwork applies an absolute-value activation to weight outputs to ensure positivity. Biases are unconstrained.

This architecture is elegant: the hypernetwork allows the mixing function to *adapt based on the state*, while the non-negative weight constraint guarantees monotonicity. The entire system -- agent utility networks, hypernetwork, and mixing network -- is trained end-to-end by minimizing:

$$L(\\theta) = \\frac{1}{B} \\sum \\left( r + \\gamma \\max_a Q(h^{t+1}, z^{t+1}, a \\;; \\bar{\\theta}) - Q(h^t, z^t, a^t \\;; \\theta) \\right)^2$$

QMIX significantly outperforms VDN in complex environments. In level-based foraging with shared rewards, QMIX achieves higher returns, faster learning, and lower variance across runs. The monotonic mixing function can represent weighted combinations, nonlinear interactions, and state-dependent importance weights that a simple sum cannot capture.
`,
      reviewCardIds: ['rc-marl-8.5-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Value decomposition breaks a centralized action-value function into per-agent utility functions, enabling decentralized execution and efficient training in common-reward games.
- The IGM (Individual-Global-Max) property ensures that individually greedy actions compose into a globally greedy joint action.
- VDN uses an additive decomposition ($Q = \\sum Q_i$), which satisfies IGM but cannot represent nonlinear interactions between agents.
- QMIX generalizes VDN with a monotonic mixing network: the centralized value must be monotonically increasing in each agent's utility, enforced by non-negative weights.
- QMIX uses a hypernetwork conditioned on centralized information to generate the mixing network's parameters, allowing state-dependent mixing.
- QMIX significantly outperforms VDN in complex environments due to its greater representational capacity.`,
};

export default lesson;
