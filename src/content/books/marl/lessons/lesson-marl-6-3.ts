/**
 * Lesson 6.3: Minimax, Nash, and Correlated Q-Learning
 *
 * Covers: Minimax-Q, Nash-Q, Correlated-Q, convergence limitations
 * Source sections: 6.2.1, 6.2.2, 6.2.3, 6.2.4
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.3',
  title: 'Minimax, Nash, and Correlated Q-Learning',
  sections: [
    {
      id: 'marl-6.3.1',
      title: 'Minimax Q-Learning',
      content: `
**Minimax Q-learning** (Littman 1994) is the most straightforward instantiation of the JAL-GT framework. It plugs the **minimax solution concept** into the $\\text{Value}_j$ operator, solving each stage game $\\Gamma_s$ via linear programming. The algorithm applies to **two-agent zero-sum** stochastic games.

Convergence is guaranteed under standard conditions: all state-joint-action pairs must be visited infinitely often, and the learning rate must satisfy the usual Robbins-Monro conditions ($\\sum \\alpha_t$ diverges, $\\sum \\alpha_t^2$ converges). Since the minimax value is unique in zero-sum games, there is no equilibrium selection problem.

Littman (1994) evaluated Minimax-Q in a **simplified soccer game** -- a 4x5 grid where two agents try to carry a ball into the opponent's goal. The results are illuminating:

| Opponent | Minimax-Q Win % | Indep. Q Win % |
|---|---|---|
| Random | 99.3% | 99.5% |
| Hand-built | 53.7% | 76.3% |
| Optimal | 37.5% | 0% |

Against the **random opponent**, both algorithms perform similarly. Against the **hand-built** opponent, independent Q-learning actually wins more often because its deterministic policy happens to exploit weaknesses in the heuristic. But here is the critical result: against an **optimal adversary**, Minimax-Q achieves 37.5% wins (close to the theoretical 50% -- imperfect convergence explains the gap), while independent Q-learning wins **zero** games. A fully deterministic policy can always be exploited by an optimal opponent.

The lesson: Minimax-Q learns **robust** policies that cannot be exploited, at the cost of not exploiting suboptimal opponents. Independent Q-learning can exploit weak opponents but is itself trivially exploitable. This robustness-exploitation trade-off is a recurring theme in MARL.
`,
      reviewCardIds: ['rc-marl-6.3-1', 'rc-marl-6.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.3.2',
      title: 'Nash-Q and Correlated-Q Learning',
      content: `
What if the game is not zero-sum? **Nash Q-learning** (Hu and Wellman 2003) replaces the minimax solver with a **Nash equilibrium** solver, making it applicable to general-sum stochastic games with any number of agents. But its convergence guarantees come with severe restrictions.

Nash-Q converges to a Nash equilibrium of the stochastic game only if **every** encountered stage game $\\Gamma_s$ satisfies one of two conditions: (a) all games have a **global optimum** -- a joint policy where every agent simultaneously achieves its maximum possible return, or (b) all games have a **saddle point** -- an equilibrium where any unilateral deviation benefits all other agents. Either condition ensures a unique equilibrium value, sidestepping the equilibrium selection problem.

These conditions are extremely restrictive. A global optimum is even stronger than Pareto optimality. Consider the Prisoner's Dilemma: there is no joint policy that simultaneously maximizes both agents' returns (agent 1's maximum requires agent 2 to cooperate while agent 1 defects, and vice versa). In practice, these assumptions are almost never met in interesting general-sum games.

**Correlated Q-learning** (Greenwald and Hall 2003) takes a different approach: it solves $\\Gamma_s$ using **correlated equilibrium** instead of Nash equilibrium. This has two advantages. First, correlated equilibria can be computed efficiently via **linear programming** (whereas Nash equilibria require quadratic programming). Second, the correlated equilibrium set is a superset of the Nash equilibrium set, potentially offering solutions with higher returns.

However, correlated equilibria require a **correlation device** -- a mechanism that samples a joint action and privately tells each agent its part. And the larger equilibrium set makes equilibrium selection even harder. Greenwald and Hall propose mechanisms such as maximizing the sum of agents' rewards, but **no formal convergence guarantees** are known for correlated Q-learning in general.
`,
      reviewCardIds: ['rc-marl-6.3-3', 'rc-marl-6.3-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.3.3',
      title: 'Fundamental Limitations of Joint-Action Learning',
      content: `
Can we design a JAL-GT algorithm that converges to an equilibrium in **any** general-sum stochastic game? Remarkably, the answer is no. Zinkevich, Greenwald, and Littman (2005) proved that there exist stochastic games where the information in joint-action Q-values is **fundamentally insufficient** to reconstruct equilibrium policies.

The key insight involves **NoSDE games** -- games with "No Stationary Deterministic Equilibrium." Consider a turn-taking game with two states and two agents:

| State | Agent | Action | Next State | Reward $(a_1, a_2)$ |
|---|---|---|---|---|
| $s_1$ | Agent 1 | send | $s_2$ | $(0, 0)$ |
| $s_1$ | Agent 1 | keep | $s_1$ | $(3, 1)$ |
| $s_2$ | Agent 2 | send | $s_1$ | $(0, 3)$ |
| $s_2$ | Agent 2 | keep | $s_2$ | $(1, 0)$ |

In this game (with $\\gamma = 3/4$), **no deterministic** stationary joint policy is an equilibrium -- each agent always has an incentive to deviate. The unique equilibrium is **probabilistic**: $\\pi^*_1(\\text{send}\\mid s_1) = 2/3$, $\\pi^*_2(\\text{send}\\mid s_2) = 5/12$.

Here is the problem: in a turn-taking game, only one agent has a choice in each state, so any equilibrium concept applied to Q-values reduces to a simple max operator. But a max operator produces **deterministic** policies. Since the only equilibrium is probabilistic, no JAL-GT algorithm can find it.

Zinkevich et al. formalized this with a theorem: for any NoSDE game, there exists another NoSDE game with **identical** Q-values but a **different** equilibrium policy. The Q-values alone cannot distinguish between the two games. This is a fundamental information-theoretic limitation, not a failure of any particular algorithm.

While JAL-GT algorithms can still find "cyclic equilibria" in NoSDE games, this result motivates the search for alternative approaches -- including agent modeling and policy-based methods.
`,
      reviewCardIds: ['rc-marl-6.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Minimax Q-learning converges to minimax values in zero-sum stochastic games and produces robust (unexploitable) policies, but cannot exploit suboptimal opponents.
- Nash Q-learning extends to general-sum games but requires that all stage games have global optima or saddle points -- conditions rarely met in practice.
- Correlated Q-learning uses LP-solvable correlated equilibria but has no formal convergence guarantees and worsens the equilibrium selection problem.
- NoSDE games (No Stationary Deterministic Equilibrium) prove that joint-action Q-values can be fundamentally insufficient to reconstruct the correct equilibrium policy.
- These limitations motivate agent modeling (Section 6.3) and policy-based methods (Section 6.4).`,
};

export default lesson;
