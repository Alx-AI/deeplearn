/**
 * Lesson 5.3: Central Learning and Independent Learning
 *
 * Covers: Centralised learning and joint action space explosion, independent
 * learning (IQL), tradeoffs between the two approaches
 * Source sections: 5.3.1, 5.3.2, 5.3.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.3',
  title: 'Central Learning and Independent Learning',
  sections: [
    {
      id: 'marl-5.3.1',
      title: 'Central Learning and the Joint Action Space Explosion',
      content: `
The most straightforward way to apply RL in a multi-agent setting is to simply pretend there is only one agent. **Central learning** trains a single **central policy** $\\pi_c$ that receives the observations of *all* agents and selects a **joint action** from the full joint-action space $\\mathbf{A} = A_1 \\times \\ldots \\times A_n$. This reduces the multi-agent problem to a standard single-agent problem, letting us use any off-the-shelf RL algorithm.

The textbook gives a concrete algorithm: **Central Q-Learning (CQL)**, which maintains joint-action values $Q(s, \\mathbf{a})$ for all joint actions $\\mathbf{a} \\in \\mathbf{A}$. At each step the central controller observes the state, picks a joint action ($\\epsilon$-greedy over the joint space), applies it, transforms the per-agent rewards $(r_1, \\ldots, r_n)$ into a single scalar $r$, and updates $Q$ using the standard temporal-difference rule.

Central learning has a useful theoretical property in **common-reward** games, where all agents receive identical rewards. Here we can set $r = r_i$ for any $i$, and an optimal central policy $\\pi_c$ is guaranteed to be a **Pareto-optimal correlated equilibrium**. No other policy can improve any agent's return without reducing another's, and no agent benefits from unilaterally deviating.

But there are serious practical limitations. First, for **zero-sum** and **general-sum** games, it is unclear how to scalarize the joint reward. Summing rewards maximizes social welfare, but may not lead to equilibrium policies. Second -- and most damaging -- the joint-action space grows **exponentially** in the number of agents. In the LBF example with three agents and six actions each, the joint space has $6^3 = 216$ actions. With five agents, it balloons to $6^5 = 7{,}776$. Standard tabular RL algorithms simply cannot explore spaces this large efficiently. Third, central learning assumes a central coordinator that observes everything and communicates actions to every agent -- an assumption that fails in many real-world applications where agents must act on local information alone.
`,
      reviewCardIds: ['rc-marl-5.3-1', 'rc-marl-5.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.3.2',
      title: 'Independent Learning (IQL)',
      content: `
**Independent learning** (IL) takes the opposite approach: each agent $i$ learns its own policy $\\pi_i$ using only its local history of own observations, actions, and rewards, *completely ignoring the existence of other agents*. The effects of other agents' actions are simply absorbed into the environment dynamics from each agent's perspective. Like central learning, this reduces the problem to single-agent RL -- but now from the vantage point of each individual agent.

The canonical example is **Independent Q-Learning (IQL)**. Each agent $i$ maintains its own Q-table $Q_i(s, a_i)$ over its own actions $a_i \\in A_i$, observes the state, selects actions via $\\epsilon$-greedy, receives its own reward $r_i$, and updates $Q_i$ with the standard Q-learning rule. Crucially, agent $i$ never sees the actions chosen by other agents and never conditions on them.

Independent learning avoids the exponential explosion that plagues central learning. Each agent explores only $|A_i|$ actions per state rather than the full $|\\mathbf{A}| = |A_1| \\times \\ldots \\times |A_n|$ joint actions. In the LBF example, each IQL agent explores 6 actions per state versus CQL's 36. This advantage shows up empirically: in the textbook's LBF experiment with two agents collecting items on an 11x11 grid, IQL learns faster than CQL in the early stages precisely because it explores a much smaller action space per agent.

However, independent learning introduces **non-stationarity**. From agent $i$'s perspective, the effective transition function $T_i(s' \\mid s, a_i)$ depends on the policies $\\pi_j$ of all other agents $j$ (via Equation 5.10). As those policies change during learning, agent $i$'s environment appears to shift unpredictably. This can lead to unstable learning and failure to converge. Research on idealized IQL in two-player, two-action games shows that convergence to Nash equilibrium depends heavily on the game's structure -- IQL converges in some game classes but can exhibit chaotic behavior in others, such as the Prisoner's Dilemma.

Despite these issues, independent learning remains a remarkably strong **baseline** in MARL research. Studies have shown that IQL and its variants are often competitive with far more sophisticated algorithms.
`,
      reviewCardIds: ['rc-marl-5.3-3', 'rc-marl-5.3-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.3.3',
      title: 'Tradeoffs: Central vs. Independent Learning in LBF',
      content: `
The textbook provides a head-to-head comparison of CQL and IQL in a specific Level-Based Foraging task that neatly illustrates the tradeoffs between these two approaches. The setup: two agents on an 11x11 grid must collect two items. Both agents have level 1. One item has level 1 (collectible by either agent alone) and the other has level 2 (requiring both agents to cooperate). Episodes begin from a fixed start state with agents in the top corners and items in the center. The discount factor is $\\gamma = 0.99$.

**IQL learns faster initially.** Because each IQL agent explores only 6 actions per state versus CQL's 36, the agents quickly learn to collect the easy level-1 item. This produces an early jump in evaluation returns that CQL cannot match.

**Both eventually find the optimal policy.** Given enough training (around 1 million time steps), both CQL and IQL converge to the same optimal joint policy: one agent goes directly to the level-2 item and waits, while the other first collects the level-1 item and then joins to collaboratively collect the level-2 item. This policy requires 13 time steps to solve the task.

For CQL, the scalar reward is computed by summing the individual agent rewards: $r = r_1 + r_2$. Each agent receives 1/3 for collecting the level-1 item and both receive 1/3 for the level-2 item, so the total undiscounted reward is 1.

The comparison reveals the core tradeoff:

- **Central learning** avoids non-stationarity (one controller, one environment) and can naturally handle credit assignment (joint-action values capture each agent's contribution). But it suffers from exponential action spaces and requires centralized observation and control.

- **Independent learning** scales to each agent's local action space and supports decentralized execution. But it faces non-stationarity from concurrent learners and cannot explicitly model how other agents' actions affect outcomes.

Neither approach is universally better. Many modern MARL algorithms try to get the best of both worlds through architectures like **centralized training with decentralized execution** (CTDE), which we will encounter in later chapters.
`,
      reviewCardIds: ['rc-marl-5.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Central learning trains a single policy over the joint-action space $\\mathbf{A} = A_1 \\times \\ldots \\times A_n$, reducing MARL to single-agent RL but suffering from exponential action space growth.
- In common-reward games, central learning is guaranteed to find a Pareto-optimal correlated equilibrium, but reward scalarization is unclear for zero-sum and general-sum games.
- Independent learning (IQL) lets each agent learn independently on its own action space, avoiding the exponential explosion but introducing non-stationarity from concurrent learners.
- In the LBF comparison, IQL learns faster early due to smaller action spaces, but both CQL and IQL eventually converge to the same optimal joint policy.
- Neither approach dominates: central learning avoids non-stationarity but does not scale; independent learning scales but faces instability. Modern methods aim to combine their strengths.`,
};

export default lesson;
