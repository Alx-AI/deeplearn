/**
 * Lesson 4.6: Pareto Optimality and Social Welfare
 *
 * Covers: Pareto optimality/dominance, social welfare (utilitarian/egalitarian), price of anarchy
 * Source sections: 4.8, 4.9
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.6',
  title: 'Pareto Optimality and Social Welfare',
  sections: [
    {
      id: 'marl-4.6.1',
      title: 'Pareto Dominance and Pareto Optimality',
      content: `Since equilibrium solutions can be sub-optimal and non-unique, we need additional criteria to narrow the space of desirable solutions. One of the most fundamental is **Pareto optimality**, named after Italian economist Vilfredo Pareto (1848-1923).

A joint policy $\\pi$ is **Pareto-dominated** by another joint policy $\\pi'$ if $\\pi'$ is at least as good for every agent and strictly better for at least one:

$$\\forall i:\\; U_i(\\pi') \\geq U_i(\\pi), \\quad \\text{and} \\quad \\exists i:\\; U_i(\\pi') > U_i(\\pi)$$

A joint policy $\\pi$ is **Pareto-optimal** if no other joint policy Pareto-dominates it. In other words, you cannot make any agent better off without making at least one other agent worse off.

Every game has at least one Pareto-optimal joint policy. In common-reward games, all Pareto-optimal policies achieve the same (maximum) expected return. In the Chicken game, the **Pareto frontier** -- the set of Pareto-optimal returns -- stretches from (7, 2) through (6, 6) to (2, 7), tracing the upper-right boundary of the feasible return space.

Pareto optimality is useful as a refinement: given a set of equilibria, we can prefer those that are also Pareto-optimal. However, Pareto optimality on its own has limitations as a solution concept. In zero-sum games, *every* joint policy is Pareto-optimal by definition (improving one agent necessarily hurts the other). In general-sum games, many joint policies may be Pareto-optimal without being particularly desirable -- for example, a policy that gives returns (100, 0) is Pareto-optimal if no other policy gives agent 1 more than 100, even though agent 2 gets nothing.

An important theoretical result is that **welfare optimality implies Pareto optimality** (we will define welfare optimality next). The proof is by contradiction: if a policy is welfare-optimal but not Pareto-optimal, then some other policy improves at least one agent's return without hurting any, which would increase total welfare -- contradicting welfare optimality. The converse does not hold: Pareto optimality does not imply welfare optimality.`,
      reviewCardIds: ['rc-marl-4.6-1', 'rc-marl-4.6-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.6.2',
      title: 'Social Welfare and Fairness',
      content: `Pareto optimality tells us "no agent can improve without hurting another" but says nothing about the *total amount* of reward or how it is distributed. The Pareto frontier in the Chicken game contains both (7, 2) and (2, 7) -- very different distributions of reward. To further refine our solution criteria, we introduce concepts of **social welfare** and **fairness**.

**Welfare** (also called utilitarian social welfare) measures the total return:

$$W(\\pi) = \\sum_i U_i(\\pi)$$

A joint policy is **welfare-optimal** if it maximizes this sum. This is the "greatest good for the greatest number" criterion.

**Fairness** (also called Nash social welfare) measures the product of returns:

$$F(\\pi) = \\prod_i U_i(\\pi)$$

A joint policy is **fairness-optimal** if it maximizes this product. The product formulation promotes equity: among policies with equal total welfare, the fairest one is that giving equal return to each agent. For example, in a two-agent game, policies yielding (1, 5), (2, 4), and (3, 3) all have welfare 6 but fairness of 5, 8, and 9 respectively -- the equal split wins.

In the Chicken game, the only policy that is both welfare-optimal and fairness-optimal achieves returns of (6, 6) -- the joint action (L, L). This narrows an infinite space of equilibria to a single desirable outcome. In the Battle of the Sexes game, the two deterministic joint policies (A, A) yielding (10, 7) and (B, B) yielding (7, 10) are the only ones that are both Pareto-optimal and fairness-optimal. The mixed Nash equilibrium is neither.

These criteria are most useful in **general-sum** games. In common-reward games, welfare and fairness are automatically maximized when any agent's return is maximized, so they add nothing new. In two-agent zero-sum games, total welfare is always zero and all minimax solutions have identical fairness, so again these concepts provide no additional discrimination.`,
      reviewCardIds: ['rc-marl-4.6-3', 'rc-marl-4.6-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.6.3',
      title: 'Price of Anarchy and Combining Criteria',
      content: `The gap between equilibrium solutions and socially optimal outcomes can be measured by the **price of anarchy** -- the ratio of the social welfare under the worst equilibrium to the social welfare under the optimal joint policy. A price of anarchy close to 1 means equilibria are nearly as good as the best possible outcome; a large price means selfish equilibrium behavior is costly to society.

In the Prisoner's Dilemma, the only Nash equilibrium (D, D) yields total welfare -6, while the optimal (C, C) yields -2. The price of anarchy is -6 / -2 = 3 (or equivalently, welfare is 3x worse at equilibrium). This quantifies the "tragedy" of the Prisoner's Dilemma: individual rationality leads to a collectively inferior outcome.

In practice, we often want to combine multiple criteria. A common approach is to seek solutions that are simultaneously equilibria *and* satisfy additional desirable properties. For example:

- A Nash equilibrium that is also **Pareto-optimal** -- an equilibrium from which no agent can improve without hurting another
- A Nash equilibrium that maximizes **social welfare** -- the equilibrium with the highest total return
- A correlated equilibrium that is **fairness-optimal** -- the correlated equilibrium giving the most equitable distribution

These combinations provide stronger guarantees than any single criterion alone. The CE linear program from Lesson 4.4 already demonstrates this approach: its objective can maximize social welfare subject to equilibrium constraints, directly computing a welfare-optimal correlated equilibrium.

The interplay between stability (equilibrium), efficiency (Pareto optimality, welfare), and equity (fairness) is at the heart of solution concept design. Different applications call for different trade-offs. Cooperative robotics teams might prioritize welfare; resource allocation systems might emphasize fairness; competitive markets might focus on equilibrium stability. Understanding this full toolkit allows the MARL practitioner to choose and combine solution concepts appropriate for the specific problem at hand.`,
      reviewCardIds: ['rc-marl-4.6-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A joint policy is **Pareto-optimal** if no other policy can improve one agent's return without worsening another's. Every game has at least one Pareto-optimal policy.
- **Social welfare** (sum of returns) and **fairness** (product of returns) further refine the space of desirable solutions beyond Pareto optimality.
- Welfare optimality implies Pareto optimality, but not vice versa. Fairness optimality does not imply Pareto optimality.
- The **price of anarchy** quantifies the gap between the worst equilibrium and the socially optimal outcome.
- In practice, criteria are combined: seek equilibria that are also Pareto-optimal, welfare-optimal, or fairness-optimal depending on the application.
- These refinements are most useful in general-sum games; they add little in common-reward or zero-sum games.`,
};

export default lesson;
