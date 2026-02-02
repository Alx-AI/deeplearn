/**
 * Lesson 6.1: Value Iteration for Games
 *
 * Covers: Minimax value iteration for stochastic games, Shapley's theorem,
 * LP for stage games
 * Source sections: 6.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.1',
  title: 'Value Iteration for Games',
  sections: [
    {
      id: 'marl-6.1.1',
      title: 'Minimax Value Iteration',
      content: `
In single-agent RL, **value iteration** sweeps over all states, updating each state's value using the Bellman optimality equation. Shapley (1953) showed that an analogous procedure exists for **two-agent zero-sum stochastic games** -- and it predates the more famous MDP version by several years.

The algorithm maintains a value function **V_i(s)** for each agent i and state s. Each iteration performs two sweeps:

1. **Build stage-game matrices.** For every state s and agent i, compute a matrix **M_{s,i}** whose entry for joint action **a = (a_1, a_2)** is:

M_{s,i}(a) = sum over s' of T(s' | s, a) * [R_i(s, a, s') + gamma * V_i(s')]

Think of M_{s,i} as the reward matrix of a normal-form game that lives "inside" state s. Each cell gives the estimated return to agent i when the agents play joint action a and then follow the current value estimates onward.

2. **Solve the stage game.** For each state s, treat the pair of matrices (M_{s,1}, M_{s,2}) as a non-repeated normal-form game and compute the **minimax value** for each agent:

V_i(s) <-- Value_i(M_{s,1}, M_{s,2})

Here Value_i denotes the unique minimax expected return for agent i. In a zero-sum game, this can be computed exactly via a **linear program** (the same LP we met in Section 4.3.1). Notice the structural similarity to MDP value iteration, which uses V(s) <-- max_a [sum over s' of T(s'|s,a)(R + gamma V(s'))]. The only difference is that the max-operator is replaced by the **Value_i-operator**, which solves a two-player game rather than a single-agent optimization.

In fact, if you set n = 1 (a single agent), the stochastic game reduces to an MDP, and Value_i collapses to a simple max over actions -- recovering standard value iteration exactly.
`,
      reviewCardIds: ['rc-marl-6.1-1', 'rc-marl-6.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.1.2',
      title: "Shapley's Convergence Theorem",
      content: `
Why does this value iteration process converge? Shapley (1953) proved that the update operator defined in the previous section is a **contraction mapping** under the max-norm. The argument mirrors the classic proof for MDPs but extends to the multi-agent setting.

A mapping f: X -> X on a normed vector space is a **gamma-contraction** if for all x, y in X:

||f(x) - f(y)|| <= gamma * ||x - y||

where gamma is in [0, 1). The **Banach fixed-point theorem** then guarantees that repeatedly applying f from any starting point converges to a unique fixed point x* satisfying f(x*) = x*.

Shapley showed that the value-update operator satisfies this contraction property under the max-norm ||x||_infinity = max_i |x_i|. Therefore, no matter how we initialize V_i(s), the iterative sweeps converge to unique optimal values **V*_i(s)** for every agent i and state s. These fixed-point values satisfy the **Bellman-like optimality equations**:

V*_i(s) = Value_i(M*_{s,1}, ..., M*_{s,n})
M*_{s,i}(a) = sum over s' of T(s'|s,a)[R_i(s,a,s') + gamma * V*_i(s')]

Once we have V*_i, we can extract the **minimax joint policy** of the stochastic game. For each state s, we solve the stage game given by M*_{s,1}, ..., M*_{s,n} to get equilibrium policies pi_i(a_i | s). A key observation: just like optimal policies in MDPs, the resulting minimax policies depend only on the **current state** -- not on the full history of states and actions. This stationarity property is powerful: it means agents need only observe the present state to act optimally (in the minimax sense).

The discount factor gamma plays a dual role: it ensures the contraction property holds (since gamma < 1 is required) and it reflects how much agents care about future versus immediate rewards.
`,
      reviewCardIds: ['rc-marl-6.1-3', 'rc-marl-6.1-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.1.3',
      title: 'Linear Programming for Stage Games',
      content: `
Each iteration of the value iteration algorithm requires solving a **normal-form stage game** for every state. In a two-agent zero-sum game, computing the minimax solution reduces to solving a **linear program** (LP), which can be done efficiently in polynomial time.

Recall that the minimax value for agent i (the row player) in a two-player zero-sum game with reward matrix M is:

max_{pi_i} min_{pi_j} sum_{a_i, a_j} pi_i(a_i) * pi_j(a_j) * M(a_i, a_j)

By the minimax theorem, this equals:

min_{pi_j} max_{pi_i} sum_{a_i, a_j} pi_i(a_i) * pi_j(a_j) * M(a_i, a_j)

The inner max over pi_i for a fixed pi_j is attained by a deterministic policy -- the agent simply picks the action with the highest expected payoff. This structure allows the problem to be cast as a standard LP.

This observation is practically significant because the value iteration algorithm must solve **one LP per state per iteration**. If the state space is large, even polynomial-time LP solvers can become a bottleneck. This computational burden is one motivation for the temporal-difference (model-free) methods we will see next.

While Shapley's original method focused on **zero-sum** games using minimax, the algorithmic template generalizes naturally. If we replace the Value_i operator with a different solution concept -- say, **Nash equilibrium** or **correlated equilibrium** -- we obtain analogous algorithms for general-sum games. However, convergence guarantees become much harder to establish in these broader settings.

This value iteration framework is the foundation for the next section's family of **joint-action learning** algorithms. Those methods replace the model-based sweeps with sample-based **temporal-difference updates**, eliminating the need to know the transition and reward functions -- but inheriting the same basic architecture of constructing and solving stage games at each step.
`,
      reviewCardIds: ['rc-marl-6.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Value iteration for stochastic games builds a normal-form "stage game" for each state using current value estimates, then solves it via a minimax (LP) solver to update state values.
- Shapley's theorem proves convergence via the Banach fixed-point theorem: the update operator is a gamma-contraction under the max-norm, guaranteeing convergence to unique minimax values V*_i.
- The resulting minimax policies are stationary -- they depend only on the current state, not the full history.
- For a single agent, the algorithm reduces exactly to standard MDP value iteration.
- Computing minimax solutions via linear programming is efficient but can become a bottleneck for large state spaces, motivating temporal-difference approaches.`,
};

export default lesson;
