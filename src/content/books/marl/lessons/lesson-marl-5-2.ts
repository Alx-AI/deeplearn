/**
 * Lesson 5.2: Convergence in Multi-Agent Settings
 *
 * Covers: Why single-agent guarantees break, convergence criteria for MARL,
 * self-play vs arbitrary opponents
 * Source sections: 5.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.2',
  title: 'Convergence in Multi-Agent Settings',
  sections: [
    {
      id: 'marl-5.2.1',
      title: 'Why Single-Agent Guarantees Break',
      content: `
In single-agent RL, algorithms like Q-learning come with well-studied convergence guarantees: given enough exploration and appropriate learning rates, the learned value function converges to the optimal values. These guarantees rest on a critical assumption -- the environment is **stationary**. The transition dynamics T(s' | s, a) and reward function R(s, a) do not change over time.

In MARL, this assumption is **violated**. As we saw in the previous lesson, from each agent's perspective the other agents' evolving policies are part of the environment. When Agent 2 updates its policy, Agent 1's effective transition function T_1(s' | s, a_1) changes. The technical conditions required for single-agent convergence -- the **stochastic approximation conditions** -- are no longer sufficient.

The result is that even a simple algorithm like Independent Q-Learning (IQL), which applies standard Q-learning to each agent separately, may fail to converge. Research by Wunder, Littman, and Babes (2010) analyzed an idealized version of IQL with infinitesimal learning rates in two-player, two-action normal-form games. They found that IQL converges to a Nash equilibrium in some game classes but exhibits **chaotic, non-convergent behavior** in others -- including the famous Prisoner's Dilemma.

All known theoretical convergence results in MARL are limited to **restricted game settings** and work only for specific algorithms. For example, the Infinitesimal Gradient Ascent (IGA) algorithm converges to the average reward of a Nash equilibrium, and WoLF-IGA converges to a Nash equilibrium itself -- but both results hold only for normal-form games with two agents and two actions. Designing general MARL algorithms with useful convergence guarantees remains an active and difficult area of research.
`,
      reviewCardIds: ['rc-marl-5.2-1', 'rc-marl-5.2-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.2.2',
      title: 'Convergence Criteria in MARL',
      content: `
Since standard convergence is hard to achieve in multi-agent settings, the MARL literature defines several **weaker** convergence criteria. Understanding these is essential for evaluating what any given MARL algorithm actually promises.

The **standard criterion** is convergence of the joint policy itself: **lim_{z -> infinity} pi^z = pi***, where pi* is a solution (e.g., a Nash equilibrium). This is the strongest guarantee -- the learned policies literally approach a game solution.

When this is too strong, weaker alternatives include:

**Convergence of expected return:** lim_{z -> infinity} U_i(pi^z) = U_i(pi*) for all agents i. The policies might not converge, but the *returns they produce* approach those of a solution. The IGA algorithm achieves this in two-player, two-action normal-form games.

**Convergence of empirical distribution:** lim_{z -> infinity} pi_bar^z = pi*, where pi_bar^z averages the policies across all episodes. This is useful when the policy itself oscillates but the *time-averaged behavior* stabilizes. The **fictitious play** algorithm converges in this sense in certain games, even though it uses deterministic policies that cannot directly represent probabilistic Nash equilibria.

**Convergence to the set of solutions:** For any epsilon > 0, eventually the empirical distribution stays within distance epsilon of *some* solution -- but it may wander within the solution set without settling on any single one. The **regret-matching** algorithms converge to the set of (coarse) correlated equilibria in this sense.

**Convergence of average return:** The averaged expected return across episodes converges to a solution's expected return.

Importantly, the standard criterion (policy convergence) implies all of the weaker types, but none of the weaker types say anything about how agents perform during *finite* learning. In practice, researchers often simply monitor learning curves showing returns over time, though this may not establish any formal relationship to an actual game solution.
`,
      reviewCardIds: ['rc-marl-5.2-3', 'rc-marl-5.2-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.2.3',
      title: 'Self-Play Assumptions and Practical Evaluation',
      content: `
Convergence results in MARL almost always come with a crucial qualifier: they assume **self-play**, meaning all agents use the same learning algorithm. This assumption simplifies theoretical analysis because it constrains the types of non-stationarity the agents face. If everyone plays by the same rules, the learning dynamics are more predictable.

But what happens when agents face **arbitrary opponents** who might use different algorithms -- or no learning algorithm at all? This is the **mixed-play** setting, and convergence guarantees are much harder to establish. A handful of research directions try to bridge the gap. One approach adds a secondary objective: converge to an equilibrium in self-play, but converge to a **best-response policy** if other agents use a stationary (non-learning) policy. Another approach, called **targeted optimality**, assumes other agents come from a known class and aims for best-response returns against that class, while guaranteeing at least **maximin returns** (the "safety" floor) against any other agents.

In practice, since we can never collect infinite data, learning typically stops when a computational budget is reached (a fixed number of episodes or time steps) or when policy changes fall below a threshold. Whether the learned policy is actually a game solution can be tested using the procedures from Chapter 4, such as checking for profitable unilateral deviations (the Nash equilibrium test).

A common practical approach is to monitor **evaluation returns** -- the expected returns U_i(pi^z) achieved by the current joint policy -- plotted as learning curves over training time. These curves can show whether performance improves and stabilizes, but they do not guarantee convergence to a formal solution. Even if returns flatten out, the joint policy pi^z might not satisfy any of the convergence criteria defined above. This gap between practical evaluation and theoretical guarantees is a persistent theme in MARL research.
`,
      reviewCardIds: ['rc-marl-5.2-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Single-agent RL convergence guarantees rely on environment stationarity, which is violated in MARL because other agents' changing policies alter the effective environment dynamics.
- MARL defines a hierarchy of convergence criteria: policy convergence (strongest), convergence of expected return, convergence of empirical distribution, convergence to a set of solutions, and convergence of average return (weakest).
- The standard policy convergence criterion implies all weaker types, but none of the weaker types guarantee good performance during finite learning.
- Most MARL convergence results assume self-play (all agents use the same algorithm); guarantees under mixed-play with arbitrary opponents are much harder to obtain.
- In practice, learning curves of evaluation returns are widely used but do not formally establish convergence to a game solution.`,
};

export default lesson;
