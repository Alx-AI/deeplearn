/**
 * Lesson 5.4: Non-Stationarity and Equilibrium Selection
 *
 * Covers: Non-stationarity deep dive, policy oscillation and cyclic dynamics,
 * the equilibrium selection problem
 * Source sections: 5.4.1, 5.4.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.4',
  title: 'Non-Stationarity and Equilibrium Selection',
  sections: [
    {
      id: 'marl-5.4.1',
      title: 'Non-Stationarity: A Deep Dive',
      content: `
Non-stationarity is arguably the **defining challenge** of MARL, and understanding it requires first seeing how stationarity works in the single-agent case.

A stochastic process {X_t} is **stationary** if the probability distribution of X_{t+tau} does not depend on tau -- intuitively, the dynamics do not change over time. In a standard MDP with a *fixed* policy pi, the state process is stationary: the next state s_t depends only on the previous state s_{t-1} and action a_{t-1} (the **Markov property**), and a_{t-1} depends only on s_{t-1} via pi. Since none of these mechanisms change with time, the process dynamics are time-independent.

But even in single-agent RL, learning makes things non-stationary. The policy pi^z changes at each update step via pi^{z+1} = L(D^z, pi^z). When we use temporal-difference learning and update Q(s_t, a_t) using a target like r + gamma * Q(s_{t+1}, a_{t+1}), that target shifts as Q itself changes. This is the single-agent **moving target problem**.

In MARL, the non-stationarity is **dramatically worse**. When agent i uses independent learning, the effective transition function it perceives -- T_i(s' | s, a_i) -- depends on the current policies of *all other agents* through the marginalization formula (Equation 5.10). As each agent j updates its policy pi_j, the transition dynamics from agent i's perspective change, even if agent i's own policy stays fixed. The environment is not just non-stationary because of bootstrapping (as in single-agent RL); it is non-stationary because the world itself appears to change its rules.

This makes the environment **non-Markovian** from each agent's perspective: the transition dynamics now depend on the full history of the interaction (since they depend on the current policies of other agents, which depend on all prior experience). The standard stochastic approximation conditions that guarantee convergence of temporal-difference learning in single-agent RL are no longer sufficient.
`,
      reviewCardIds: ['rc-marl-5.4-1', 'rc-marl-5.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.4.2',
      title: 'Policy Oscillation and Cyclic Dynamics',
      content: `
Non-stationarity can manifest as striking **cyclic dynamics** in which agents' policies chase each other in circles without ever settling down. The textbook provides a vivid illustration: two agents learning in Rock-Paper-Scissors using the WoLF-PHC algorithm. Plotted in the policy simplex (where each point represents a probability distribution over {Rock, Paper, Scissors}), the agents' policies trace spiraling paths that co-adapt over time -- each agent shifting its strategy in response to the other's shifts -- before eventually converging to the Nash equilibrium where both play uniformly at random.

But convergence is not guaranteed in general. The cyclic pattern arises because of a fundamental feedback loop:

1. Agent 1 observes that Agent 2 plays Rock frequently, so Agent 1 shifts toward Paper.
2. Agent 2 detects Agent 1's shift to Paper, so Agent 2 shifts toward Scissors.
3. Agent 1 detects Agent 2's shift to Scissors, so Agent 1 shifts toward Rock.
4. The cycle repeats.

Whether this spiral converges inward (toward equilibrium) or outward (diverging) depends on the specifics of the learning algorithm, the learning rates, and the game structure. In WoLF-PHC applied to Rock-Paper-Scissors, the spiral does converge, but in other games or with other algorithms the dynamics may oscillate indefinitely.

The implication for algorithm design is profound: **convergence in MARL often requires carefully tailored algorithms** rather than generic single-agent methods. All known convergence results are limited to restricted settings. IGA converges (in average reward) for two-player, two-action normal-form games. WoLF-IGA achieves policy convergence in the same restricted setting. But extending these guarantees to larger games or more agents remains an open problem. Designing general and efficient MARL algorithms with useful learning guarantees is, as the textbook puts it, "a difficult problem and the subject of ongoing research."
`,
      reviewCardIds: ['rc-marl-5.4-3', 'rc-marl-5.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.4.3',
      title: 'The Equilibrium Selection Problem',
      content: `
Even when a MARL algorithm *can* converge, the question remains: converge to *what*? Many games have **multiple equilibria** yielding different returns for the agents, and the agents face the problem of which equilibrium to agree on and how to reach agreement. This is the **equilibrium selection** problem.

Consider the **Chicken game**: two agents choose Swerve (S) or go straight (L). The three Nash equilibria yield returns of (7,2), (2,7), and approximately (4.66, 4.66). Which one should the agents converge to? There is no obvious answer -- each agent prefers a different pure equilibrium.

The **Stag Hunt** game makes the problem even more insidious. Two hunters can hunt a Stag (S) or a Hare (H). The joint actions (S,S) and (H,H) are both Nash equilibria. (S,S) is **reward-dominant** -- it yields the highest payoffs (4,4). But (H,H) is **risk-dominant** -- each agent can guarantee a reward of at least 2 by choosing H, regardless of what the other does. Algorithms like IQL tend to gravitate toward the risk-dominant equilibrium. Early in learning, when agents choose actions semi-randomly, each agent quickly discovers that action H gives a safe reward of 2+ while action S risks 0. This reinforces H in a feedback loop, locking agents into the suboptimal (H,H) equilibrium even though both would prefer (S,S).

Several approaches can mitigate equilibrium selection:
- **Solution refinements** like Pareto optimality or welfare criteria can narrow the solution set.
- In **zero-sum games**, minimax equilibrium values are unique, side-stepping the problem entirely.
- In **no-conflict games** (like Stag Hunt), algorithms like Pareto Actor-Critic exploit the fact that all agents prefer the reward-dominant equilibrium.
- **Agent modeling** can help: if Agent 1 predicts that Agent 2 is likely to cooperate, it may choose to cooperate as well.
- **Communication** between agents could help coordinate on an equilibrium, though it introduces its own challenges (agents might not be bound to their announcements).

Equilibrium selection remains a fundamental open challenge, particularly when different equilibria favor different agents.
`,
      reviewCardIds: ['rc-marl-5.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Non-stationarity in MARL goes beyond the single-agent moving target problem: each agent's effective environment dynamics change as other agents update their policies, making the environment non-Markovian.
- Cyclic dynamics arise when agents continuously adapt to each other, potentially spiraling toward equilibrium (as in WoLF-PHC on Rock-Paper-Scissors) or oscillating indefinitely.
- All known MARL convergence results are limited to restricted game settings and specific algorithms.
- The equilibrium selection problem arises when games have multiple equilibria with different payoffs; agents must agree on which equilibrium to target.
- Risk-dominant equilibria can act as attractors for learning algorithms even when reward-dominant equilibria are preferred by all agents, as illustrated by the Stag Hunt game.`,
};

export default lesson;
