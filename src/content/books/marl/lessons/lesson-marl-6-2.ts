/**
 * Lesson 6.2: Joint-Action TD Learning
 *
 * Covers: Joint-action Q-values, TD update rule, action observability
 * Source sections: 6.2 intro
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.2',
  title: 'Joint-Action TD Learning',
  sections: [
    {
      id: 'marl-6.2.1',
      title: 'Joint-Action Q-Values',
      content: `
Value iteration for stochastic games is elegant but impractical in many settings: it requires knowing the full game model -- the reward functions R_i and the transition function T. In real applications these are rarely available. Can we instead **learn** solutions through repeated interaction, using temporal-difference (TD) methods?

**Joint-action learning** (JAL) is a family of MARL algorithms that answers this question affirmatively. The key idea: instead of maintaining single-agent Q-values Q(s, a_i) that ignore other agents, JAL algorithms learn **joint-action value functions** Q_i(s, a_1, ..., a_n) that estimate the expected return for agent i when all agents play a specific combination of actions in state s.

In a stochastic game, the Bellman equation for joint-action values under joint policy pi is:

Q^pi_i(s, a) = sum over s' of T(s'|s,a) * [R_i(s,a,s') + gamma * sum over a' of pi(a'|s') * Q^pi_i(s', a')]

The JAL algorithms we study are **off-policy**: they aim to learn the **equilibrium** Q-values Q^{pi*}_i, where pi* is an equilibrium joint policy. This is analogous to how Q-learning in single-agent RL learns optimal Q-values regardless of the exploration policy.

A crucial insight is that the set of joint-action values {Q_1(s, .), ..., Q_n(s, .)} at a given state s can be viewed as the reward matrices of a **normal-form game** Gamma_s. If we have two agents with three actions each, the game Gamma_s for agent i looks like:

| | a_{j,1} | a_{j,2} | a_{j,3} |
|---|---|---|---|
| **a_{i,1}** | Q_i(s, a_{i,1}, a_{j,1}) | Q_i(s, a_{i,1}, a_{j,2}) | Q_i(s, a_{i,1}, a_{j,3}) |
| **a_{i,2}** | Q_i(s, a_{i,2}, a_{j,1}) | Q_i(s, a_{i,2}, a_{j,2}) | Q_i(s, a_{i,2}, a_{j,3}) |
| **a_{i,3}** | Q_i(s, a_{i,3}, a_{j,1}) | Q_i(s, a_{i,3}, a_{j,2}) | Q_i(s, a_{i,3}, a_{j,3}) |

This is the bridge between RL and game theory that makes JAL algorithms possible.
`,
      reviewCardIds: ['rc-marl-6.2-1', 'rc-marl-6.2-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.2.2',
      title: 'The JAL-GT Temporal-Difference Update',
      content: `
The family of JAL algorithms that use game-theoretic solution concepts is called **JAL-GT**. The pseudocode (Algorithm 7 in the textbook) follows a simple loop:

1. **Observe** the current state s_t.
2. **Select an action** using epsilon-greedy exploration: with probability epsilon choose randomly, otherwise solve the stage game Gamma_{s_t} to obtain equilibrium policies (pi_1, ..., pi_n) and sample a_i from pi_i.
3. **Observe** the joint action a_t = (a^t_1, ..., a^t_n), each agent's reward r^t_j, and the next state s_{t+1}.
4. **Update** Q-values for every agent j using a TD rule:

Q_j(s_t, a_t) <-- Q_j(s_t, a_t) + alpha * [r^t_j + gamma * Value_j(Gamma_{s_{t+1}}) - Q_j(s_t, a_t)]

The term **Value_j(Gamma_{s'})** is the expected return for agent j under the equilibrium solution of the stage game at the next state s'. This mirrors how the max operator works in single-agent Q-learning, but replaces the single-agent "max" with a game-theoretic solver.

Different JAL-GT algorithms arise from plugging in **different solution concepts** for the Value_j operator. Minimax gives us Minimax-Q. Nash equilibrium gives us Nash-Q. Correlated equilibrium gives us Correlated-Q. Each choice leads to different convergence properties and applicability conditions.

Note a strong requirement: the algorithm must observe the **actions and rewards of all agents** at each step. This is significantly more information than single-agent RL requires. In settings where you can only observe your own reward, the algorithm needs modification -- a topic addressed by agent modeling methods later in this chapter.
`,
      reviewCardIds: ['rc-marl-6.2-3', 'rc-marl-6.2-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.2.3',
      title: 'Action Observability and the Equilibrium Selection Problem',
      content: `
JAL-GT algorithms make two critical assumptions that distinguish them from simpler independent learning methods. Understanding these assumptions reveals both the strengths and limitations of this approach.

**Full action observability.** Each agent must observe the actions chosen by **all** other agents after every time step. This is essential because the Q-value update requires the full joint action a_t = (a^t_1, ..., a^t_n). Without it, the agent cannot index into the correct entry of its Q-table. In many practical scenarios -- robots in the same warehouse, players in a board game -- this assumption holds naturally. In others -- autonomous vehicles on separate roads, distributed sensor networks -- it may not.

**Reward observability.** The algorithm also requires observing every agent's reward r^t_j, not just agent i's own reward. This is needed because JAL-GT maintains Q-functions Q_j(s, a) for **every** agent j, so it must know each agent's reward to perform the TD updates. This is an even stronger requirement and is one reason why JAL with agent modeling (covered later) is often preferred -- it only needs agent i's own Q-function.

Beyond observability, there is the subtle problem of **equilibrium selection**. A game can have multiple equilibria that yield different expected returns. When agents use the Value_j operator to compute update targets, they all need to agree on **which** equilibrium to use. If agent 1 computes targets using one Nash equilibrium while agent 2 uses a different one, the Q-values may not converge properly.

In zero-sum games, this problem vanishes: the minimax value is **unique**, so all agents automatically agree. But in general-sum games, equilibrium selection becomes a genuine challenge. Nash Q-learning and Correlated Q-learning each tackle this problem differently -- but as we will see, neither fully solves it. This fundamental difficulty is what motivates the richer set of algorithms covered in the rest of this chapter.
`,
      reviewCardIds: ['rc-marl-6.2-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Joint-action learning (JAL) extends temporal-difference learning to multi-agent settings by learning Q-values over joint actions Q_i(s, a_1, ..., a_n).
- The joint-action Q-values at each state form a normal-form game that can be solved using game-theoretic concepts (minimax, Nash, correlated equilibrium).
- JAL-GT algorithms update Q-values using TD learning where the "max" operator is replaced by a game-theoretic Value_j solver.
- These algorithms require observing all agents' actions and rewards -- stronger assumptions than single-agent RL.
- The equilibrium selection problem -- agreeing on which equilibrium to use for update targets -- is a central challenge in general-sum games.`,
};

export default lesson;
