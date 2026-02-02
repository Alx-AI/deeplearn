/**
 * Lesson 4.2: Best Response and Minimax Strategies
 *
 * Covers: Best response, dominant strategies, minimax and von Neumann's theorem
 * Source sections: 4.2, 4.3
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.2',
  title: 'Best Response and Minimax Strategies',
  sections: [
    {
      id: 'marl-4.2.1',
      title: 'Best Response Policies',
      content: `Most solution concepts in game theory can be expressed compactly using one elegant idea: the **best response**. Given policies for all agents except agent i, denoted pi_{-i} = (pi_1, ..., pi_{i-1}, pi_{i+1}, ..., pi_n), a best response for agent i is any policy pi_i that maximizes i's expected return when played against pi_{-i}. Formally:

BR_i(pi_{-i}) = argmax_{pi_i} U_i(pi_i, pi_{-i})

Notice that the best response may not be unique -- BR_i(pi_{-i}) is a *set* of policies. In a non-repeated normal-form game, there may be multiple actions that achieve the same maximum expected return against a given pi_{-i}. Any probability distribution over those equally-good actions is also a best response.

For example, in Rock-Paper-Scissors, if one agent plays uniformly at random (probability 1/3 for each action), then *every* policy for the other agent achieves an expected return of 0. So every policy is a best response to a uniform policy. But only the specific joint policy where *both* agents play uniformly is one where both are simultaneously best-responding to each other.

A related concept is a **dominant strategy**: a policy that is a best response regardless of what the other agents do. In the Prisoner's Dilemma, action D (Defect) is dominant for both agents -- no matter what the opponent does, playing D yields a higher reward. Dominant strategies are rare in general games, which is why we need more nuanced solution concepts.

Beyond compact definitions, best response operators are also used algorithmically. Methods like **fictitious play** and **joint-action learning with agent modeling** iteratively compute best responses to approximate equilibria. The best response is truly the Swiss army knife of game theory.`,
      reviewCardIds: ['rc-marl-4.2-1', 'rc-marl-4.2-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.2.2',
      title: 'Minimax: Optimizing Against the Worst Case',
      content: `**Minimax** is a solution concept defined specifically for two-agent zero-sum games, where one agent's reward is the negative of the other's. Think of games like chess, Go, or the classic Rock-Paper-Scissors.

A joint policy pi = (pi_i, pi_j) is a **minimax solution** if:

U_i(pi) = max_{pi'_i} min_{pi'_j} U_i(pi'_i, pi'_j) = min_{pi'_j} max_{pi'_i} U_i(pi'_i, pi'_j) = -U_j(pi)

There are two parts here. The first expression, max-min, represents the maximum expected return that agent i can *guarantee* regardless of what the opponent does -- this is agent i's **maxmin policy** and **maxmin value**. The second expression, min-max, represents the minimum expected return that agent j can *force* on agent i -- agent j's **minmax policy** against i, yielding i's **minmax value**.

In a minimax solution, these two values are equal. This means the order of the min/max operators does not matter: whether agent i announces its policy first or agent j announces first, neither gains from such announcements. Each agent is best-responding to the other.

Consider Rock-Paper-Scissors with this payoff matrix (from agent 1's perspective):

|     | R  | P  | S  |
|-----|----|----|-----|
| R   | 0  | -1 | +1 |
| P   | +1 | 0  | -1 |
| S   | -1 | +1 | 0  |

The unique minimax solution is for both agents to play uniformly at random (1/3 each), yielding an expected return of 0 for both. If either agent deviates, the opponent can exploit the deviation.

A minimax solution can equivalently be understood as each agent using a best-response policy to the other agent's policy: pi_i is in BR_i(pi_j) and pi_j is in BR_j(pi_i). This mutual-best-response interpretation will generalize to Nash equilibrium in the next lesson.`,
      reviewCardIds: ['rc-marl-4.2-3', 'rc-marl-4.2-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.2.3',
      title: "Von Neumann's Theorem and Linear Programming",
      content: `The existence of minimax solutions for normal-form games was first proven in the foundational work of **von Neumann (1928)** -- one of the earliest and most important results in game theory. The theorem guarantees that every two-agent zero-sum normal-form game with finite action spaces has a minimax solution.

Beyond normal-form games, minimax solutions also exist in every two-agent zero-sum stochastic game with finite episode length, and in those with infinite episode length using discounted returns (Shapley, 1953). Moreover, while multiple minimax solutions may exist, they all yield the same unique value U_i(pi) for agent i (and hence for agent j). This value is called the **game value**.

For non-repeated zero-sum normal-form games, we can compute the minimax solution efficiently using **linear programming**. We solve two LPs, one per agent. Agent i's LP computes a policy that minimizes agent j's expected return:

- **Variables**: x_{a_i} for each action a_i (representing pi_i(a_i)), plus U*_j
- **Objective**: minimize U*_j
- **Constraints**: For each action a_j of agent j, the expected reward to j under pi_i must be at most U*_j; the x_{a_i} values form a valid probability distribution (non-negative, sum to 1)

This ensures no single action by agent j can achieve expected return greater than U*_j, which implies no mixture of actions can either. Agent j's policy is obtained by a symmetric LP with swapped indices.

Linear programs can be solved using the **simplex algorithm** (exponential worst case but fast in practice) or **interior-point methods** (provably polynomial time). This makes computing minimax solutions for normal-form games tractable -- a pleasant contrast to the complexity of Nash equilibria, as we will see later. The LP formulation also highlights why minimax is limited to two-agent zero-sum games: the zero-sum structure allows one agent's loss to directly represent the other's gain, enabling the linear formulation.`,
      reviewCardIds: ['rc-marl-4.2-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A **best response** for agent i maximizes its expected return against fixed policies of the other agents. Best responses may not be unique.
- A **dominant strategy** is a best response regardless of what others do -- rare but powerful when it exists (e.g., Defect in Prisoner's Dilemma).
- **Minimax** is a solution concept for two-agent zero-sum games where each agent's maxmin value equals its minmax value -- neither gains from announcing its policy first.
- Von Neumann's theorem (1928) guarantees minimax solutions exist for all finite two-agent zero-sum normal-form games; all solutions share the same unique **game value**.
- Minimax solutions for normal-form games can be computed in polynomial time via **linear programming**.`,
};

export default lesson;
