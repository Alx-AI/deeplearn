/**
 * Lesson 4.3: Nash Equilibrium
 *
 * Covers: NE definition, Nash's theorem, finding NE in 2x2 games
 * Source sections: 4.4, 4.5
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.3',
  title: 'Nash Equilibrium',
  sections: [
    {
      id: 'marl-4.3.1',
      title: 'Definition of Nash Equilibrium',
      content: `The minimax solution concept only applies to two-agent zero-sum games. **Nash equilibrium** extends the mutual-best-response idea to general-sum games with any number of agents, making it the most widely used solution concept in game theory and MARL.

A joint policy pi = (pi_1, ..., pi_n) is a **Nash equilibrium** if no agent can improve its expected return by unilaterally changing its own policy, while the other agents' policies remain fixed:

For all agents i and all alternative policies pi'_i: U_i(pi'_i, pi_{-i}) <= U_i(pi)

Equivalently, every agent's policy is a best response to the others: pi_i is in BR_i(pi_{-i}) for all i. In two-agent zero-sum games, the set of Nash equilibria coincides exactly with the set of minimax solutions, so Nash equilibrium truly is a generalization.

Let us trace through some familiar matrix games. In the **Prisoner's Dilemma**:

|     | C    | D    |
|-----|------|------|
| C   | -1,-1 | -5,0 |
| D   | 0,-5  | -3,-3 |

The only Nash equilibrium is (D, D). Neither agent can unilaterally switch to C and improve their payoff -- switching from D to C drops your return from -3 to -5. In the **Coordination Game**:

|     | A      | B    |
|-----|--------|------|
| A   | 10,10  | 0,0  |
| B   | 0,0    | 10,10 |

There are *three* Nash equilibria: (A, A), (B, B), and a probabilistic one where each agent plays A with probability 0.5. This illustrates that games can have multiple equilibria with different expected returns -- (A, A) and (B, B) each yield 10, while the mixed equilibrium yields only 5.`,
      reviewCardIds: ['rc-marl-4.3-1', 'rc-marl-4.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.3.2',
      title: "Nash's Theorem and Pure vs. Mixed Equilibria",
      content: `In his celebrated 1950 paper, **John Nash** proved that every finite normal-form game has at least one Nash equilibrium. This is a powerful existence guarantee -- no matter how complicated the reward structure, there is always at least one stable configuration of policies.

Nash equilibria come in two flavors. A **pure** (deterministic) Nash equilibrium is one where each agent's policy assigns probability 1 to a single action. A **mixed** (probabilistic) Nash equilibrium involves policies that randomize over actions. Some games only have mixed equilibria -- Rock-Paper-Scissors has no pure Nash equilibrium because any deterministic choice can be exploited by the opponent.

This distinction matters for MARL because some algorithms can only represent deterministic policies and therefore *cannot* learn mixed equilibria. If the only equilibria in a game are mixed, these algorithms will fail to converge to any equilibrium at all.

A game may have multiple Nash equilibria yielding different expected returns. In the Chicken game, the two pure equilibria (S, L) and (L, S) yield asymmetric returns of (7, 2) and (2, 7), while the mixed equilibrium gives roughly (4.66, 4.66) to each agent. This raises a critical question: which equilibrium should the agents converge to? This is the **equilibrium selection problem**, one of the deepest challenges in MARL. We will return to it in the discussion of limitations (Lesson 4.5).

Nash equilibria also exist in stochastic games (Fink, 1964). For games with infinite sequential moves, **folk theorems** show that essentially *any* feasible and enforceable set of expected returns can be achieved by some equilibrium when agents are sufficiently far-sighted (discount factor gamma close to 1). "Feasible" means some joint policy achieves those returns; "enforceable" means each agent's return is at least as large as its minmax value. This makes the space of equilibria enormous, motivating the refinement concepts we will cover later.`,
      reviewCardIds: ['rc-marl-4.3-3', 'rc-marl-4.3-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.3.3',
      title: 'Finding Nash Equilibria and Epsilon-Nash Equilibrium',
      content: `Given a joint policy pi, how do we check whether it is a Nash equilibrium? The definition suggests a procedure that reduces the multi-agent problem to n single-agent problems. For each agent i, hold the other policies pi_{-i} fixed and compute an optimal best-response policy pi'_i. If pi'_i achieves a higher expected return than pi_i -- that is, U_i(pi'_i, pi_{-i}) > U_i(pi_i, pi_{-i}) -- then pi is *not* a Nash equilibrium.

For non-repeated normal-form games, each best-response computation can be done efficiently via linear programming. For sequential-move games, a suitable single-agent RL algorithm can be used to find pi'_i.

In practice, exact Nash equilibria can be problematic for computational systems. Nash himself noted that for games with more than two agents, the probabilities in an equilibrium may be **irrational numbers** that cannot be represented exactly with finite-precision floating point. Moreover, reaching a strict equilibrium may be too computationally costly. This motivates the **epsilon-Nash equilibrium**: a joint policy pi is an epsilon-Nash equilibrium (for epsilon > 0) if:

For all agents i and all pi'_i: U_i(pi'_i, pi_{-i}) - epsilon <= U_i(pi)

No agent can gain more than epsilon by deviating. Every exact Nash equilibrium is surrounded by a region of epsilon-Nash equilibria.

However, a critical warning: an epsilon-Nash equilibrium may be *arbitrarily far* from any true Nash equilibrium in terms of expected returns. Consider a game with unique NE at (A, C) yielding (100, 100), and an epsilon-NE at (B, D) yielding (1, 1) for epsilon = 1. The epsilon-NE is not a meaningful approximation of the true NE at all. We can even increase the NE payoffs without affecting the epsilon-NE. So while epsilon-NE is a useful relaxation computationally, it should not be blindly treated as an approximation to exact Nash equilibrium.`,
      reviewCardIds: ['rc-marl-4.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A **Nash equilibrium** is a joint policy where no agent can unilaterally improve its return -- every agent is best-responding to the others.
- **Nash's theorem** (1950): every finite normal-form game has at least one Nash equilibrium, though it may be mixed (probabilistic).
- Games can have multiple Nash equilibria with different payoffs, leading to the **equilibrium selection problem**.
- **Epsilon-Nash equilibrium** relaxes NE by allowing deviations of at most epsilon, but an epsilon-NE can be arbitrarily far from any true NE in expected returns.
- Checking whether a joint policy is NE reduces to n independent best-response computations.
- **Folk theorems** show that in repeated games, the space of equilibria can be enormous.`,
};

export default lesson;
