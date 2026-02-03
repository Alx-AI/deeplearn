/**
 * Lesson 8.6: Value Decomposition in Practice and Beyond
 *
 * Covers: QMIX limitations, QTRAN/QPLEX extensions, when to use value decomposition
 * Source sections: 9.5.4, 9.5.5
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.6',
  title: 'Value Decomposition in Practice and Beyond',
  sections: [
    {
      id: 'marl-8.6.1',
      title: 'QMIX Limitations: When Monotonicity Fails',
      content: `
QMIX's monotonic mixing is more expressive than VDN's additive decomposition, but it still cannot represent all value functions. Let us see exactly where it breaks down by examining specific games.

In a **linearly decomposable** matrix game (e.g., $Q(A,A)=1$, $Q(A,B)=5$, $Q(B,A)=5$, $Q(B,B)=9$), both VDN and QMIX learn accurate centralized value estimates. This is expected -- additive functions are a subset of monotonic functions.

In a **monotonic but non-linear** game ($Q(A,A)=0$, $Q(A,B)=0$, $Q(B,A)=0$, $Q(B,B)=10$), VDN fails because no additive decomposition can represent the highly nonlinear payoff structure. QMIX succeeds -- its mixing network learns a steep nonlinear mapping that correctly assigns value 10 to $(B,B)$ and 0 to everything else. However, VDN still learns the *optimal policy* despite inaccurate value estimates, because the ordering of individual utilities happens to be correct.

This distinction matters in multi-step settings. In a **two-step stochastic game** where agent 1 first chooses which matrix game to play, inaccurate values from VDN cause it to choose the wrong game: VDN underestimates the value of the monotonic game and picks the linear one for a reward of 9 instead of 10. QMIX learns accurate values for both games and correctly selects the optimal path.

The real challenge is the **Climbing game**, a $3 \\times 3$ matrix game with no obvious linear or monotonic decomposition. $Q(A,A) = 11$ is optimal but risky (deviations lead to $-30$), while safer options like $Q(C,C) = 5$ or $Q(B,B) = 7$ are easier to reach. Both VDN and QMIX fail here: VDN converges to $(C,C)$ with reward 5, and QMIX converges to $(C,B)$ with reward 6. Neither can accurately represent the true value function, and both learn suboptimal policies.

This failure is not merely theoretical -- it highlights a fundamental limitation. Whenever the interaction between agents is *non-monotonic* (increasing one agent's utility can decrease the joint value), QMIX's constraint prevents it from representing the true value function. Such interactions arise naturally in games requiring precise coordination or risk-reward tradeoffs.
`,
      reviewCardIds: ['rc-marl-8.6-1', 'rc-marl-8.6-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.6.2',
      title: 'QTRAN, Weighted QMIX, and QPLEX',
      content: `
Several algorithms extend beyond monotonicity to represent more general value decompositions.

**QTRAN** (Son et al. 2019) derives conditions that are both sufficient and *necessary* for the IGM property (under affine transformations of utilities). QTRAN uses three components: (1) individual utility functions $Q(h_i, a_i \\;; \\theta_i)$ combined additively like VDN, (2) an unrestricted centralized action-value function $Q(h, z, a \\;; \\theta_q)$, and (3) a utility function $V(h, z \\;; \\theta_v)$ that corrects for the gap between the linear decomposition and the true centralized value. The IGM conditions require:

$$\\sum_i Q(h_i, a_i \\;; \\theta_i) - Q(h, z, a \\;; \\theta_q) + V(h, z \\;; \\theta_v) = 0 \\text{ if } a = a^* \\text{ (greedy)}, \\geq 0 \\text{ otherwise}$$

QTRAN trains all three components jointly with TD-error for the centralized Q and soft regularization terms for the IGM conditions. In the Climbing game, QTRAN finds the optimal policy where VDN and QMIX fail. However, QTRAN has practical drawbacks: (1) its unrestricted centralized Q-function scales poorly with agent count, (2) the IGM conditions are enforced through soft regularization rather than hard constraints, so they may not hold during training.

**Weighted QMIX** (Rashid et al. 2020) takes a different approach: train both a constrained (monotonic) and unconstrained mixing network, then use the unconstrained one to identify *which joint actions are potentially optimal* and put more learning weight on those. This avoids the strict monotonicity constraint for the most important value estimates while maintaining tractability.

**QPLEX** (Wang et al. 2021) uses a **duplex decomposition** that separately decomposes value and advantage functions:

$$Q(h, z, a) = V(h, z) + A(h, z, a); \\quad Q(h_i, a_i) = V(h_i) + A(h_i, a_i)$$

QPLEX defines an advantage-based IGM property and ensures it holds throughout training using a linear mixing of advantage functions with weights computed via multi-head attention. This gives QPLEX the expressiveness to represent non-monotonic value functions while maintaining the IGM guarantee.
`,
      reviewCardIds: ['rc-marl-8.6-3', 'rc-marl-8.6-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.6.3',
      title: 'When to Use Value Decomposition',
      content: `
Value decomposition algorithms form a rich family. Choosing the right one depends on the environment, the number of agents, and the computational budget.

**Use VDN when:** the environment is simple, the number of agents is large, and computational efficiency matters most. VDN has the lowest overhead -- no mixing network, no hypernetwork, just individual Q-networks summed together. In environments where agent contributions are roughly independent and additive, VDN performs well.

**Use QMIX when:** the environment has moderate coordination requirements and common rewards. QMIX is the most battle-tested value decomposition algorithm, with extensive empirical evidence across many domains. Its mixing network adds modest computational cost. The original QMIX implementation includes several important tricks: parameter sharing across agents ($\\theta_i = \\theta_j$), agent-ID one-hot encoding to break symmetry, recurrent utility networks, last-action as additional input, and episodic replay buffers. These details significantly affect performance.

**Use QTRAN/QPLEX when:** the environment requires complex, non-monotonic coordination and accuracy of value estimates matters (e.g., multi-step planning). Be prepared for higher computational costs and potentially less stable training.

**When NOT to use value decomposition:** these algorithms are designed for common-reward games. In general-sum settings where agents have different reward functions, value decomposition does not directly apply. In such cases, multi-agent policy gradient methods (Section 9.4) or independent learning may be more appropriate.

Beyond pure value-based approaches, the decomposition idea can also be applied to actor-critic methods. **FACMAC** (Peng et al. 2021) trains a decomposed centralized critic alongside individual policy networks for each agent. Since the policies handle decentralized execution, the critic decomposition does not need to satisfy the IGM property -- the monotonicity constraint can be relaxed.

Empirically, QMIX with its standard implementation details remains one of the strongest algorithms across a wide range of common-reward cooperative tasks, including the StarCraft Multi-Agent Challenge (SMAC) benchmark. The gap between QMIX and more expressive methods like QTRAN often narrows or even reverses in complex environments, likely because the more complex optimization objectives become harder to optimize in practice.
`,
      reviewCardIds: ['rc-marl-8.6-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- QMIX fails when the true value function is non-monotonic, as demonstrated by the Climbing game where both VDN and QMIX learn suboptimal policies.
- VDN can learn correct policies even with inaccurate value estimates if the ordering of individual utilities is preserved, but this breaks down in multi-step settings.
- QTRAN derives necessary and sufficient conditions for IGM and can represent non-monotonic value functions, but uses soft regularization that may not hold during training.
- Weighted QMIX focuses learning on potentially optimal actions; QPLEX uses a duplex decomposition with advantage-based IGM guaranteed throughout training.
- Value decomposition is designed for common-reward games; for general-sum settings, use policy gradient methods or independent learning.
- QMIX with standard implementation details (parameter sharing, recurrent networks, episodic replay) remains one of the strongest cooperative MARL algorithms in practice.`,
};

export default lesson;
